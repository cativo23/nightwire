#!/usr/bin/env node
// Computed-style parity between two Nightwire stylesheets.
//
//   npm run parity -- [--old <path|git:REF>] [--new <path|git:REF>] [--pages <glob,glob…>]
//                     [--max-lines N] [--expect <categories.json>] [--jobs N] [--json <file>]
//
// --old defaults to git:main. With --expect and no --old it defaults to git:<baseline> instead,
// where `baseline` is the optional top-level field of the category file (git:main when the file
// has none); an explicit --old that differs from that baseline still runs but prints one WARN
// line before the PARITY line.
//
// Loads every page twice in the local Chrome, once with each stylesheet substituted for
// nightwire.css, and compares getComputedStyle for every element, its ::before/::after/
// ::placeholder, and every --* on :root. It does that in 8 states (intensity none/archive/
// operator/combat × prefers-reduced-motion off/on) and again with :hover/:focus/
// :focus-visible/:active forced on the elements each stateful selector targets.
//
// Captures run concurrently, one job per page x state (the old and the new stylesheet of a pair
// are captured by the same job). --jobs N (or NW_PARITY_JOBS=N) sets how many run at once;
// default min(6, cores - 2), at least 1. --jobs 1 is the strictly sequential run. Results are
// merged in page/state order, so the output does not depend on N. While iterating, pass --pages
// for the pages you touch; run the full set once before committing.
//
// Determinism: Math.random is seeded, the page clock is faked and advanced by a fixed amount,
// requests outside the local server are blocked (fallback fonts on both sides), CSS
// transitions are finished and CSS animations are paused at t=0. No freeze stylesheet is
// injected, so animation-* and transition-* values stay comparable.
//
// With --json <file>, the run is also written as JSON: `meta`, every difference with its category
// (null when none explains it) and `shadows`, every element with a box-shadow or text-shadow on
// either side, changed or not. `node scripts/parity/glow-check.mjs <file>` reads it (FR-013b).
//
// With --expect <file>, differences are classified against the change categories in that file
// (docs/design/v3/change-inventory.json): one CATEGORY line per category, and only the
// differences no category explains are printed and fail the run.
//
// Exit codes: 0 = no differences (with --expect: none unexpected) and full coverage,
// 1 = differences (with --expect: unexpected ones) or coverage < 100%,
// 2 = usage error (including an unreadable or invalid --expect file) or browser launch failure.
// See CONTRIBUTING.md.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { availableParallelism } from 'node:os';
import { extractSelectors, analyzeSelectors } from './lib/selectors.mjs';
import { snapshotKey, diffRecords, validateCategories } from './lib/diff.mjs';
import { globToRegExp } from './lib/glob.mjs';
import { buildReport, buildJsonReport } from './lib/report.mjs';
import { collectShadows } from './lib/shadows.mjs';
import { resolveOld } from './lib/baseline.mjs';
import { loadSheet as loadSheetFrom, SheetError } from './lib/sheet.mjs';
import { startServer as startServerAt } from './lib/server.mjs';
import { routeAction } from './lib/route.mjs';
import { runPool } from './lib/pool.mjs';
import { startPausedClock } from './lib/clock.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const COVERAGE_FIXTURE = 'scripts/parity/fixtures/coverage.html';
const VIEWPORT = { width: 1280, height: 800 };
const INTENSITIES = ['none', 'archive', 'operator', 'combat'];
const MOTION = [['rm-off', 'no-preference'], ['rm-on', 'reduce']];
const FIXED_TIME = new Date('2026-01-01T00:00:00Z');
const SCRIPT_RUN_MS = 5000;
const FOCUSABLE = 'a[href], button, input, select, textarea, summary, [tabindex]';
const PROVIDED_ATTR_STATES = /^\[data-intensity(="(archive|operator|combat)")?\]$/;
const SEPARATOR = '\u0001';

class UsageError extends Error {}

function usage(message) {
  if (message) console.error(`parity: ${message}`);
  console.error('usage: npm run parity -- [--old <path|git:REF>] [--new <path|git:REF>] [--pages <glob,glob…>] [--max-lines N] [--expect <categories.json>] [--jobs N] [--json <file>]');
  console.error('  --old defaults to git:main, or to git:<baseline> of the --expect file when it has one');
  console.error('  --jobs defaults to NW_PARITY_JOBS, else min(6, cores - 2), at least 1');
  process.exit(2);
}

/** Concurrency: --jobs, else NW_PARITY_JOBS, else min(6, cores - 2) and at least 1. */
function resolveJobs(arg, env) {
  const raw = arg ?? env;
  if (raw === undefined || raw === '') return Math.max(1, Math.min(6, availableParallelism() - 2));
  const n = Number(raw);
  if (!/^\d+$/.test(String(raw).trim()) || !Number.isSafeInteger(n) || n < 1) {
    usage(`${arg === undefined ? 'NW_PARITY_JOBS' : '--jobs'} must be a positive integer, got "${raw}"`);
  }
  return n;
}

function loadSheet(spec) {
  try {
    return loadSheetFrom(spec, ROOT);
  } catch (err) {
    if (err instanceof SheetError) usage(err.message);
    throw err;
  }
}

/** Read and compile a change-category file ({ baseline?, categories }); any failure is a usage error. */
function loadCategories(file) {
  let json;
  try {
    json = JSON.parse(readFileSync(resolve(file), 'utf8'));
  } catch (err) {
    usage(`cannot read --expect file ${file}: ${err.message}`);
  }
  try {
    return validateCategories(json);
  } catch (err) {
    usage(`${file}: ${err.message}`);
  }
}

/** Repo-relative POSIX paths of every file under `dir` (no dotfiles, no node_modules). */
function listFiles(dir) {
  const out = [];
  const walkDir = (rel) => {
    for (const e of readdirSync(resolve(ROOT, rel), { withFileTypes: true })) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue;
      const child = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walkDir(child); else out.push(child);
    }
  };
  if (existsSync(resolve(ROOT, dir))) walkDir(dir);
  return out;
}

function glob(pattern) {
  if (!/[*?]/.test(pattern)) return existsSync(resolve(ROOT, pattern)) ? [pattern] : [];
  const fixed = [];
  for (const seg of pattern.split('/')) { if (/[*?]/.test(seg)) break; fixed.push(seg); }
  const re = globToRegExp(pattern);
  return listFiles(fixed.join('/')).filter((p) => re.test(p));
}

function defaultPages() {
  const pages = glob('examples/html/**/*.html')
    .filter((p) => /nightwire\.css/.test(readFileSync(resolve(ROOT, p), 'utf8')));
  if (existsSync(resolve(ROOT, COVERAGE_FIXTURE))) pages.push(COVERAGE_FIXTURE);
  return pages.map((p) => p.split(sep).join('/')).sort();
}

function resolvePages(arg) {
  if (!arg) return defaultPages();
  const pages = new Set();
  for (const pattern of arg.split(',').map((s) => s.trim()).filter(Boolean)) {
    for (const p of glob(pattern)) pages.add(p);
  }
  if (!pages.size) usage(`--pages matched nothing: ${arg}`);
  return [...pages].sort();
}

const startServer = () => startServerAt(ROOT);

// ---- in-page helpers (serialized into the page) -------------------------------------------

const PAGE_HELPERS = `
window.__nwParity = {
  path(el) {
    const parts = [];
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      let part = e.localName;
      if (e.classList.length) part += '.' + e.classList[0];
      if (e.parentElement) part += ':nth-child(' + (Array.prototype.indexOf.call(e.parentElement.children, e) + 1) + ')';
      parts.unshift(part);
    }
    return parts.join('>');
  },
  settle() {
    for (const a of document.getAnimations()) {
      if (a instanceof CSSTransition) { try { a.finish(); } catch {} }
      else { a.pause(); a.currentTime = 0; }
    }
  },
  scope(root) {
    if (!root) return Array.from(document.querySelectorAll('*'));
    const out = [root, ...root.querySelectorAll('*')];
    for (let s = root.nextElementSibling; s; s = s.nextElementSibling) out.push(s, ...s.querySelectorAll('*'));
    return out;
  },
  capture(root, props, sepr) {
    const rows = [];
    const ser = (cs) => props.map((p) => cs.getPropertyValue(p)).join(sepr);
    for (const el of this.scope(root)) {
      const p = this.path(el);
      rows.push([p, ser(getComputedStyle(el))]);
      for (const pe of ['::before', '::after']) {
        const cs = getComputedStyle(el, pe);
        if (cs.content !== 'none' && cs.content !== 'normal') rows.push([p + pe, ser(cs)]);
      }
      if (el.localName === 'input' || el.localName === 'textarea') rows.push([p + '::placeholder', ser(getComputedStyle(el, '::placeholder'))]);
    }
    if (!root) {
      const cs = getComputedStyle(document.documentElement);
      const custom = Array.from(cs).filter((n) => n.startsWith('--')).sort();
      for (const n of custom) rows.push([':root' + sepr + n, cs.getPropertyValue(n).trim()]);
      // @keyframes are not visible through computed styles at t=0: compare the effective
      // (last-declared) rule for every name instead.
      const frames = new Map();
      const visit = (rules) => { for (const r of rules) {
        if (r.type === CSSRule.KEYFRAMES_RULE) frames.set(r.name, r.cssText.replace(/\s+/g, ' '));
        else if (r.cssRules) visit(r.cssRules);
      } };
      for (const sheet of document.styleSheets) { try { visit(sheet.cssRules); } catch {} }
      for (const [name, text] of [...frames].sort()) rows.push(['@keyframes' + sepr + name, text]);
    }
    return rows;
  },
  signature(el) {
    const attrs = Array.from(el.attributes)
      .filter((a) => !['id', 'style', 'href', 'src', 'alt', 'title', 'placeholder', 'value', 'for', 'name', 'aria-label'].includes(a.name))
      .map((a) => a.name + '=' + a.value).sort().join(' ');
    return [el.localName, attrs, el.disabled ? 'disabled' : '', el.checked ? 'checked' : '',
      el.parentElement ? el.parentElement.localName + '.' + (el.parentElement.classList[0] || '') : ''].join('|');
  },
};
`;

// Mulberry32 seeded PRNG replaces Math.random so script-built DOM is identical in both runs.
const SEED_RANDOM = `(() => { let s = 0x6e77; Math.random = () => { s |= 0; s = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; })();`;

// ---- capture --------------------------------------------------------------------------------

async function openPage(browser, { css, origin, url, intensity, reducedMotion }) {
  const context = await browser.newContext({ viewport: VIEWPORT, reducedMotion });
  const page = await context.newPage();
  let substituted = 0;
  await page.route('**/*', (route) => {
    const action = routeAction(route.request().url(), origin);
    if (action === 'abort') return route.abort();
    if (action === 'css') { substituted++; return route.fulfill({ status: 200, contentType: 'text/css', body: css }); }
    return route.continue();
  });
  await page.addInitScript(SEED_RANDOM);
  await page.addInitScript(PAGE_HELPERS);
  // Paused from the start (see lib/clock.mjs): page timers only fire on runFor(), and nothing
  // depends on how long the host takes between two calls.
  await startPausedClock(page.clock, FIXED_TIME);
  const response = await page.goto(url, { waitUntil: 'load' });
  if (!response?.ok()) throw new UsageError(`${url} returned HTTP ${response?.status() ?? 'no response'}`);
  if (!substituted) throw new UsageError(`${url} never requested nightwire.css, so there is nothing to compare`);
  await page.evaluate(() => document.fonts.ready.then(() => true));
  await page.clock.runFor(SCRIPT_RUN_MS);
  await page.evaluate((value) => {
    if (value === 'none') document.documentElement.removeAttribute('data-intensity');
    else document.documentElement.setAttribute('data-intensity', value);
    window.__nwParity.settle();
  }, intensity);
  return { context, page };
}

/**
 * Capture one page in one base state. Returns Map<snapshotKey, value> built lazily:
 * rows are kept as joined strings and only expanded per property when they differ.
 */
async function captureState(browser, opts, props, stateful) {
  const { context, page } = await openPage(browser, opts);
  try {
    const captures = [];
    const base = await page.evaluate(([p, s]) => window.__nwParity.capture(null, p, s), [props, SEPARATOR]);
    captures.push({ state: opts.label, rows: base });

    const cdp = await context.newCDPSession(page);
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 });

    for (const { target, pseudos } of stateful) {
      const selector = target === '*' ? FOCUSABLE : target;
      let reps;
      try {
        reps = await page.evaluate((sel) => {
          const seen = new Set(); const out = [];
          document.querySelectorAll(sel).forEach((el, i) => {
            const sig = window.__nwParity.signature(el);
            if (!seen.has(sig)) { seen.add(sig); out.push(i); }
          });
          return out;
        }, selector);
      } catch { continue; } // selector the browser rejects (e.g. vendor-only): nothing to force
      if (!reps.length) continue;
      const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector });
      for (const index of reps) {
        const nodeId = nodeIds[index];
        await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: pseudos });
        const { where, rows } = await page.evaluate(([sel, i, p, s]) => {
          const el = document.querySelectorAll(sel)[i];
          window.__nwParity.settle();
          return { where: window.__nwParity.path(el), rows: window.__nwParity.capture(el, p, s) };
        }, [selector, index, props, SEPARATOR]);
        captures.push({ state: `${opts.label}|:${pseudos.join(':')}@${where}`, rows });
        await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] });
        await page.evaluate(() => window.__nwParity.settle());
      }
    }

    const coverage = await page.evaluate(([classes, attrs]) => ({
      classes: classes.filter((c) => document.querySelector('.' + CSS.escape(c))),
      attrs: attrs.filter((a) => { try { return document.querySelector(a); } catch { return false; } }),
    }), [opts.classes, opts.attrs]);

    return { captures, coverage };
  } finally {
    await context.close();
  }
}

function compareCaptures(pageName, oldCaps, newCaps, props) {
  const index = (caps) => new Map(caps.map((c) => [c.state, new Map(c.rows)]));
  const a = index(oldCaps);
  const b = index(newCaps);
  const oldSnap = new Map();
  const newSnap = new Map();
  for (const state of new Set([...a.keys(), ...b.keys()])) {
    const ra = a.get(state) ?? new Map();
    const rb = b.get(state) ?? new Map();
    for (const path of new Set([...ra.keys(), ...rb.keys()])) {
      const va = ra.get(path);
      const vb = rb.get(path);
      if (va === vb) continue;
      if (path.includes(SEPARATOR)) { // ':root' custom properties and '@keyframes' rules
        const [where, prop] = path.split(SEPARATOR);
        if (va !== undefined) oldSnap.set(snapshotKey({ page: pageName, state, path: where, prop }), va);
        if (vb !== undefined) newSnap.set(snapshotKey({ page: pageName, state, path: where, prop }), vb);
        continue;
      }
      if (va === undefined || vb === undefined) {
        const snap = va === undefined ? newSnap : oldSnap;
        snap.set(snapshotKey({ page: pageName, state, path, prop: '(element)' }), 'present');
        continue;
      }
      const xa = va.split(SEPARATOR);
      const xb = vb.split(SEPARATOR);
      props.forEach((prop, i) => {
        if (xa[i] === xb[i]) return;
        oldSnap.set(snapshotKey({ page: pageName, state, path, prop }), xa[i]);
        newSnap.set(snapshotKey({ page: pageName, state, path, prop }), xb[i]);
      });
    }
  }
  return diffRecords(oldSnap, newSnap);
}

// ---- main -----------------------------------------------------------------------------------

async function main() {
  let args;
  try {
    ({ values: args } = parseArgs({
      args: process.argv.slice(2),
      options: { old: { type: 'string' }, new: { type: 'string', default: 'nightwire.css' },
        pages: { type: 'string' }, 'max-lines': { type: 'string', default: '200' }, expect: { type: 'string' }, jobs: { type: 'string' }, json: { type: 'string' } },
    }));
  } catch (err) { usage(err.message); }
  const maxLines = Number(args['max-lines']);
  if (!Number.isInteger(maxLines) || maxLines < 0) usage('--max-lines must be a non-negative integer');

  const jobs = resolveJobs(args.jobs, process.env.NW_PARITY_JOBS);

  const file = args.expect === undefined ? undefined : loadCategories(args.expect);
  const categories = file?.categories;
  const { old: oldSpec, warning } = resolveOld({ expect: file !== undefined, baseline: file?.baseline, old: args.old });

  const oldCss = loadSheet(oldSpec);
  const newCss = loadSheet(args.new);
  const pages = resolvePages(args.pages);

  const analysis = analyzeSelectors([...extractSelectors(oldCss), ...extractSelectors(newCss)]);
  const classes = [...analysis.classes].sort();
  const attrStates = [...analysis.attrStates].sort();
  const stateful = analysis.stateful;

  let chromium;
  try {
    ({ chromium } = await import('playwright-core'));
  } catch { usage('playwright-core is not installed: run npm install'); }
  let browser;
  try {
    browser = process.env.NW_CHROME_PATH
      ? await chromium.launch({ executablePath: process.env.NW_CHROME_PATH })
      : await chromium.launch({ channel: 'chrome' });
  } catch (err) {
    console.error(`parity: cannot launch Chrome (${err.message.split('\n')[0]}). Install Google Chrome or set NW_CHROME_PATH.`);
    process.exit(2);
  }

  const server = await startServer();
  const origin = `http://127.0.0.1:${server.address().port}`;
  const states = INTENSITIES.flatMap((i) => MOTION.map(([tag, rm]) => ({ intensity: i, reducedMotion: rm, label: `${i}|${tag}` })));
  if (warning) console.log(warning);
  console.log(`PARITY  old=${oldSpec}  new=${args.new}  pages=${pages.length}  states=${states.length}  viewport=${VIEWPORT.width}x${VIEWPORT.height}`);

  const diffs = [];
  const shadows = [];
  const coveredClasses = new Set();
  const coveredAttrs = new Set(attrStates.filter((a) => PROVIDED_ATTR_STATES.test(a)));
  try {
    const probe = await browser.newPage();
    await probe.goto(`${origin}/${pages[0]}`).catch(() => {});
    const props = await probe.evaluate(() => Array.from(getComputedStyle(document.body)).filter((p) => !p.startsWith('--')).sort());
    await probe.close();

    // One job per page x state; the old and new capture of a pair stay in the same job. Every
    // job builds its own options and results, so nothing is shared between concurrent jobs.
    const jobList = pages.flatMap((pageName) => states.map((state) => ({ pageName, state })));
    const results = await runPool(jobList, jobs, async ({ pageName, state }) => {
      const common = { origin, url: `${origin}/${pageName}`, intensity: state.intensity, reducedMotion: state.reducedMotion,
        label: state.label, classes, attrs: attrStates };
      const before = await captureState(browser, { ...common, css: oldCss }, props, stateful);
      const after = await captureState(browser, { ...common, css: newCss }, props, stateful);
      return {
        diffs: compareCaptures(pageName, before.captures, after.captures, props),
        shadows: collectShadows(pageName, before.captures, after.captures, props, SEPARATOR),
        coverage: after.coverage,
      };
    });
    for (const result of results) { // job order, so the report matches a sequential run
      diffs.push(...result.diffs);
      shadows.push(...result.shadows);
      result.coverage.classes.forEach((c) => coveredClasses.add(c));
      result.coverage.attrs.forEach((a) => coveredAttrs.add(a));
    }
  } finally {
    await browser.close();
    server.close();
  }

  const uncovered = [...classes.filter((c) => !coveredClasses.has(c)).map((c) => '.' + c),
    ...attrStates.filter((a) => !coveredAttrs.has(a))];
  const coverageLine = `COVERAGE  classes=${coveredClasses.size}/${classes.length}  attr-states=${coveredAttrs.size}/${attrStates.length}  uncovered=${uncovered.length ? uncovered.join(' ') : 'none'}`;
  const report = buildReport({ diffs, categories, maxLines, coverageLine, uncovered: uncovered.length });
  report.lines.forEach((l) => console.log(l));
  if (args.json !== undefined) {
    const json = buildJsonReport({ oldSpec, newSpec: args.new, pages, states: states.map((s) => s.label), diffs, shadows, categories });
    writeFileSync(resolve(args.json), JSON.stringify(json));
    console.log(`JSON  ${args.json}  differences=${diffs.length}  shadows=${shadows.length}`);
  }
  process.exit(report.exitCode);
}

main().catch((err) => {
  console.error(`parity: ${err instanceof UsageError ? err.message : err.stack || err.message}`);
  process.exit(2);
});

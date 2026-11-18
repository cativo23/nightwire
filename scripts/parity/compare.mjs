#!/usr/bin/env node
// Computed-style parity between two Nightwire stylesheets.
//
//   npm run parity -- [--old <path|git:REF>] [--new <path|git:REF>] [--pages <glob,glob…>]
//
// Loads every page twice in the local Chrome, once with each stylesheet substituted for
// nightwire.css, and compares getComputedStyle for every element, its ::before/::after/
// ::placeholder, and every --* on :root. It does that in 8 states (intensity none/archive/
// operator/combat × prefers-reduced-motion off/on) and again with :hover/:focus/
// :focus-visible/:active forced on the elements each stateful selector targets.
//
// Determinism: Math.random is seeded, the page clock is faked and advanced by a fixed amount,
// requests outside the local server are blocked (fallback fonts on both sides), CSS
// transitions are finished and CSS animations are paused at t=0. No freeze stylesheet is
// injected, so animation-* and transition-* values stay comparable.
//
// Exit codes: 0 = no differences and full coverage, 1 = differences or coverage < 100%,
// 2 = usage error or browser launch failure. See CONTRIBUTING.md.

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, extname, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { extractSelectors, analyzeSelectors } from './lib/selectors.mjs';
import { snapshotKey, diffSnapshots } from './lib/diff.mjs';
import { globToRegExp } from './lib/glob.mjs';

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
  console.error('usage: npm run parity -- [--old <path|git:REF>] [--new <path|git:REF>] [--pages <glob,glob…>] [--max-lines N]');
  process.exit(2);
}

function loadSheet(spec) {
  if (spec.startsWith('git:')) {
    const ref = spec.slice(4);
    if (!ref || ref.startsWith('-')) usage(`invalid git ref: ${spec}`);
    try {
      return execFileSync('git', ['show', `${ref}:nightwire.css`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 });
    } catch {
      usage(`cannot read nightwire.css at ${ref}`);
    }
  }
  const path = resolve(ROOT, spec);
  if (!existsSync(path)) usage(`stylesheet not found: ${spec}`);
  return readFileSync(path, 'utf8');
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

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon' };

function startServer() {
  const server = createServer((req, res) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400).end(); return; }
    if (pathname.split('/').some((seg) => seg.startsWith('.'))) { res.writeHead(404).end(); return; }
    const file = resolve(ROOT, `.${pathname}`);
    if (file !== ROOT && !file.startsWith(ROOT + sep)) { res.writeHead(403).end(); return; }
    if (!existsSync(file) || !statSync(file).isFile()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

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
    const u = new URL(route.request().url());
    if (u.origin !== origin) return route.abort();
    if (u.pathname.endsWith('/nightwire.css')) { substituted++; return route.fulfill({ status: 200, contentType: 'text/css', body: css }); }
    return route.continue();
  });
  await page.addInitScript(SEED_RANDOM);
  await page.addInitScript(PAGE_HELPERS);
  await page.clock.install({ time: FIXED_TIME });
  // install() lets time flow in real time; pause it so page timers only fire on runFor().
  await page.clock.pauseAt(new Date(FIXED_TIME.getTime() + 1000));
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
  return diffSnapshots(oldSnap, newSnap);
}

// ---- main -----------------------------------------------------------------------------------

async function main() {
  let args;
  try {
    ({ values: args } = parseArgs({
      args: process.argv.slice(2),
      options: { old: { type: 'string', default: 'git:main' }, new: { type: 'string', default: 'nightwire.css' },
        pages: { type: 'string' }, 'max-lines': { type: 'string', default: '200' } },
    }));
  } catch (err) { usage(err.message); }
  const maxLines = Number(args['max-lines']);
  if (!Number.isInteger(maxLines) || maxLines < 0) usage('--max-lines must be a non-negative integer');

  const oldCss = loadSheet(args.old);
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
  console.log(`PARITY  old=${args.old}  new=${args.new}  pages=${pages.length}  states=${states.length}  viewport=${VIEWPORT.width}x${VIEWPORT.height}`);

  const lines = [];
  const coveredClasses = new Set();
  const coveredAttrs = new Set(attrStates.filter((a) => PROVIDED_ATTR_STATES.test(a)));
  try {
    const probe = await browser.newPage();
    await probe.goto(`${origin}/${pages[0]}`).catch(() => {});
    const props = await probe.evaluate(() => Array.from(getComputedStyle(document.body)).filter((p) => !p.startsWith('--')).sort());
    await probe.close();

    for (const pageName of pages) {
      const url = `${origin}/${pageName}`;
      for (const state of states) {
        const common = { origin, url, intensity: state.intensity, reducedMotion: state.reducedMotion,
          label: state.label, classes, attrs: attrStates };
        const before = await captureState(browser, { ...common, css: oldCss }, props, stateful);
        const after = await captureState(browser, { ...common, css: newCss }, props, stateful);
        lines.push(...compareCaptures(pageName, before.captures, after.captures, props));
        after.coverage.classes.forEach((c) => coveredClasses.add(c));
        after.coverage.attrs.forEach((a) => coveredAttrs.add(a));
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  lines.sort();
  lines.slice(0, maxLines).forEach((l) => console.log(l));
  if (lines.length > maxLines) console.log(`…  ${lines.length - maxLines} more DIFF lines (raise --max-lines to see them)`);

  const uncovered = [...classes.filter((c) => !coveredClasses.has(c)).map((c) => '.' + c),
    ...attrStates.filter((a) => !coveredAttrs.has(a))];
  console.log(`COVERAGE  classes=${coveredClasses.size}/${classes.length}  attr-states=${coveredAttrs.size}/${attrStates.length}  uncovered=${uncovered.length ? uncovered.join(' ') : 'none'}`);
  console.log(`RESULT  differences=${lines.length}`);
  process.exit(lines.length || uncovered.length ? 1 : 0);
}

main().catch((err) => {
  console.error(`parity: ${err instanceof UsageError ? err.message : err.stack || err.message}`);
  process.exit(2);
});

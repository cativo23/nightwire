#!/usr/bin/env node
// Render the v3 direction board (docs/design/v3/board.html) as full-page PNGs: once per
// stylesheet, at each of the three intensities.
//
//   npm run design:board -- [--out <dir>] [--page <path>] [--width N]
//                           [--before <spec>] [--after <spec>] | [--css <spec>]
//
// <spec> is what parity accepts: a repo-relative path or git:<ref>. By default it renders both
// before (git:v2.1.0) and after (the working-tree nightwire.css), six files named
// board-<label>-<intensity>.png in --out (default: <tmpdir>/nightwire-board). --css renders one
// stylesheet, labelled "css".
//
// Elements carrying data-force=":hover :focus-visible …" get those pseudo-classes forced through
// CDP (CSS.forcePseudoState) so the states can be photographed without a pointer. Fonts come
// from Google Fonts like in every Nightwire page: that origin, and only that origin, is let
// through the request interception so the four typefaces render; the run prints which loaded.
//
// Exit codes: 0 = rendered, 2 = usage error or browser launch failure.

import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from '../parity/lib/server.mjs';
import { loadSheet, SheetError } from '../parity/lib/sheet.mjs';
import { routeAction } from '../parity/lib/route.mjs';
import { parseBoardArgs, outputName, parseForce, INTENSITIES } from './lib/board.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FONT_ORIGINS = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
const FONT_FAMILIES = ['Noto Serif Display', 'JetBrains Mono', 'Saira Extra Condensed', 'Shippori Mincho B1'];
const VIEWPORT_HEIGHT = 900;
const NAV_TIMEOUT_MS = 30000;

class UsageError extends Error {}

function usage(message) {
  if (message) console.error(`design:board: ${message}`);
  console.error('usage: npm run design:board -- [--out <dir>] [--page <path>] [--width N] [--before <spec>] [--after <spec>] | [--css <spec>]');
  console.error('  <spec> is a repo-relative stylesheet path or git:<ref>; default renders git:v2.1.0 and nightwire.css');
  process.exit(2);
}

/** Apply every data-force element's pseudo-classes through CDP; returns how many elements. */
async function forceStates(page, context) {
  const forced = await page.evaluate(() => Array.from(document.querySelectorAll('[data-force]'))
    .map((el, index) => ({ index, value: el.getAttribute('data-force') })));
  const cdp = await context.newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '[data-force]' });
  if (nodeIds.length !== forced.length) throw new Error(`found ${forced.length} [data-force] elements but CDP resolved ${nodeIds.length}`);
  for (const { index, value } of forced) {
    let pseudos;
    try { pseudos = parseForce(value); } catch (err) { throw new UsageError(`element #${index}: ${err.message}`); }
    if (pseudos.length) await cdp.send('CSS.forcePseudoState', { nodeId: nodeIds[index], forcedPseudoClasses: pseudos });
  }
  return forced.length;
}

async function renderSheet({ browser, origin, pageUrl, width, outDir, label, css }) {
  const context = await browser.newContext({ viewport: { width, height: VIEWPORT_HEIGHT }, reducedMotion: 'no-preference' });
  try {
    const page = await context.newPage();
    page.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);
    let substituted = 0;
    await page.route('**/*', (route) => {
      const action = routeAction(route.request().url(), origin, FONT_ORIGINS);
      if (action === 'abort') return route.abort();
      if (action === 'css') { substituted++; return route.fulfill({ status: 200, contentType: 'text/css', body: css }); }
      return route.continue();
    });
    const response = await page.goto(pageUrl, { waitUntil: 'load' });
    if (!response?.ok()) throw new UsageError(`${pageUrl} returned HTTP ${response?.status() ?? 'no response'}`);
    if (!substituted) throw new UsageError(`${pageUrl} never requested nightwire.css, so there is nothing to render`);
    await page.evaluate(() => document.fonts.ready.then(() => true));
    const fonts = await page.evaluate((families) => families.filter((f) => Array.from(document.fonts)
      .some((ff) => ff.family.replace(/["']/g, '') === f && ff.status === 'loaded')), FONT_FAMILIES);
    const forcedCount = await forceStates(page, context);
    console.log(`${label}: ${forcedCount} forced states, fonts loaded: ${fonts.length}/${FONT_FAMILIES.length}${fonts.length === FONT_FAMILIES.length ? '' : ` (missing: ${FONT_FAMILIES.filter((f) => !fonts.includes(f)).join(', ')})`}`);

    const files = [];
    for (const intensity of INTENSITIES) {
      await page.evaluate((value) => document.documentElement.setAttribute('data-intensity', value), intensity);
      const file = join(outDir, outputName(label, intensity));
      await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
      files.push(file);
    }
    return files;
  } finally {
    await context.close();
  }
}

async function main() {
  let args;
  try { args = parseBoardArgs(process.argv.slice(2), { tmpdir: tmpdir() }); } catch (err) { usage(err.message); }
  const outDir = resolve(args.out);
  const pagePath = args.page.split('\\').join('/').replace(/^\/+/, '');
  if (!resolve(ROOT, pagePath).startsWith(ROOT)) usage(`--page must be inside the repository: ${args.page}`);

  let sheets;
  try {
    sheets = args.sheets.map((s) => ({ ...s, css: loadSheet(s.spec, ROOT) }));
  } catch (err) {
    if (err instanceof SheetError) usage(err.message);
    throw err;
  }

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
    console.error(`design:board: cannot launch Chrome (${err.message.split('\n')[0]}). Install Google Chrome or set NW_CHROME_PATH.`);
    process.exit(2);
  }

  mkdirSync(outDir, { recursive: true });
  const server = await startServer(ROOT);
  const origin = `http://127.0.0.1:${server.address().port}`;
  console.log(`BOARD  page=${pagePath}  width=${args.width}  out=${outDir}`);
  const written = [];
  try {
    for (const { label, spec, css } of sheets) {
      console.log(`${label}: ${spec}`);
      written.push(...await renderSheet({ browser, origin, pageUrl: `${origin}/${pagePath}`, width: args.width, outDir, label, css }));
    }
  } finally {
    await browser.close();
    server.close();
  }
  written.forEach((f) => console.log(`WROTE  ${f}`));
}

main().catch((err) => {
  console.error(`design:board: ${err instanceof UsageError ? err.message : err.stack || err.message}`);
  process.exit(2);
});

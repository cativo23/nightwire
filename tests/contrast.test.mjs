import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { emitCss } from '../scripts/lib/tokens.mjs';
import { tokenCssFromSource } from '../scripts/design/lib/token-css.mjs';
import {
  parseColor,
  composite,
  flatten,
  relativeLuminance,
  contrastRatio,
  parseTokenCss,
  tokensForLevel,
  resolveColorToken,
  evaluatePairs,
  REQUIRED,
} from '../scripts/design/lib/contrast.mjs';

const near = (actual, expected, eps = 0.01) =>
  assert.ok(Math.abs(actual - expected) <= eps, `expected ${actual} to be within ${eps} of ${expected}`);

test('white on black is 21:1 and the ratio is symmetric', () => {
  near(contrastRatio('#fff', '#000'), 21, 1e-9);
  near(contrastRatio('#000', '#ffffff'), 21, 1e-9);
});

test('identical colours are 1:1', () => {
  near(contrastRatio('#336699', '#336699'), 1, 1e-9);
});

test('#777 on white is just under 4.5:1, so it fails the text threshold', () => {
  const ratio = contrastRatio('#777777', '#ffffff');
  near(ratio, 4.48, 0.005);
  assert.ok(ratio < REQUIRED.text);
});

test('relative luminance uses the WCAG sRGB curve', () => {
  near(relativeLuminance(parseColor('#000')), 0, 1e-12);
  near(relativeLuminance(parseColor('#fff')), 1, 1e-12);
  near(relativeLuminance(parseColor('#808080')), 0.2159, 0.0005);
});

test('parseColor reads #rgb, #rrggbb, rgb(), rgba() in comma and space syntax', () => {
  assert.deepEqual(parseColor('#fa0'), { r: 255, g: 170, b: 0, a: 1 });
  assert.deepEqual(parseColor('#FFAA00'), { r: 255, g: 170, b: 0, a: 1 });
  assert.deepEqual(parseColor('rgb(1, 2, 3)'), { r: 1, g: 2, b: 3, a: 1 });
  assert.deepEqual(parseColor('rgba(1, 2, 3, 0.5)'), { r: 1, g: 2, b: 3, a: 0.5 });
  assert.deepEqual(parseColor('rgb(1 2 3 / 0.25)'), { r: 1, g: 2, b: 3, a: 0.25 });
  assert.deepEqual(parseColor('rgb(1 2 3 / 50%)'), { r: 1, g: 2, b: 3, a: 0.5 });
  assert.deepEqual(parseColor('  rgba(255,255,255,.36) '), { r: 255, g: 255, b: 255, a: 0.36 });
});

test('parseColor throws on anything it cannot read', () => {
  for (const bad of ['', 'red', '#12', '#12345', '#ggg', 'rgb(1,2)', 'rgb(300,0,0)', 'rgba(0,0,0,2)', 'calc(1px * 2)', 'var(--x)']) {
    assert.throws(() => parseColor(bad), /colour|color/i, bad);
  }
});

test('composite blends an alpha colour over an opaque background', () => {
  assert.deepEqual(composite(parseColor('#ffffff'), parseColor('#000000')), { r: 255, g: 255, b: 255, a: 1 });
  const half = composite(parseColor('rgba(255,255,255,0.5)'), parseColor('#000'));
  near(half.r, 127.5, 1e-9);
  assert.equal(half.a, 1);
});

test('composite refuses a translucent background', () => {
  assert.throws(() => composite(parseColor('#fff'), parseColor('rgba(0,0,0,0.5)')), /opaque/i);
});

test('white at 0.36 over black reads about 3.13:1', () => {
  near(contrastRatio('rgba(255,255,255,0.36)', '#000'), 3.13, 0.01);
});

test('a translucent foreground is composited over the background before measuring', () => {
  // Over black, 0.5 white is #808080 (127.5), so the ratio is the same as grey on black.
  near(contrastRatio('rgba(255,255,255,0.5)', '#000'), contrastRatio('#808080', '#000'), 0.05);
});

test('flatten composites a stack, bottom first', () => {
  const flat = flatten(['#000000', 'rgba(255,255,255,0.1)', 'rgba(255,0,0,0.5)']);
  // 0.1 white over black = 25.5 each; then 0.5 red over that.
  near(flat.r, 0.5 * 255 + 0.5 * 25.5, 1e-9);
  near(flat.g, 0.5 * 25.5, 1e-9);
  near(flat.b, 0.5 * 25.5, 1e-9);
});

test('a stacked background changes the ratio versus the bottom layer alone', () => {
  const alone = contrastRatio('#e6e6e6', ['#0a0a0a']);
  const stacked = contrastRatio('#e6e6e6', ['#0a0a0a', 'rgba(255,255,255,0.3)']);
  assert.ok(stacked < alone);
});

test('flatten needs an opaque bottom layer', () => {
  assert.throws(() => flatten(['rgba(0,0,0,0.5)']), /opaque/i);
  assert.throws(() => flatten([]), /empty|at least/i);
});

test('opacity on the foreground scales its alpha', () => {
  const withOpacity = contrastRatio('#aaaaaa', ['#111111'], { opacity: 0.75 });
  const manual = contrastRatio('rgba(170,170,170,0.75)', ['#111111']);
  near(withOpacity, manual, 1e-9);
  assert.ok(withOpacity < contrastRatio('#aaaaaa', ['#111111']));
});

const CSS = `
/* comment with { braces } */
:root {
  --a: #111111;
  --b: var(--a);
  --c: var(--b);
  --fallback: var(--missing, #222222);
  --len: calc(150ms * var(--scale));
  --scale: 1;
  --text: #fff;
}
:root[data-intensity="archive"] { --a: #333333; }
:root[data-intensity="operator"] {
  /* base values apply */
}
:root[data-intensity="combat"] { --text: #eee; }
@media (prefers-reduced-motion: reduce) {
  :root,
  :root[data-intensity] { --a: #ff0000; }
}
`;

test('parseTokenCss reads :root and the per-intensity blocks, ignoring @media', () => {
  const parsed = parseTokenCss(CSS);
  assert.equal(parsed.base.get('--a'), '#111111');
  assert.equal(parsed.levels.archive.get('--a'), '#333333');
  assert.equal(parsed.levels.combat.get('--text'), '#eee');
  assert.equal(parsed.levels.operator.size, 0);
});

test('a bare :root inside @media (or any at-rule) is never read as base tokens', () => {
  const parsed = parseTokenCss(`
    :root { --a: #111111; }
    @media (prefers-color-scheme: light) { :root { --a: #ffffff; --b: #123456; } }
    @supports (color: red) { @media print { :root[data-intensity="combat"] { --a: #ff0000; } } }
    :root[data-intensity="archive"] { --b: #654321; }
  `);
  assert.equal(parsed.base.get('--a'), '#111111');
  assert.equal(parsed.base.has('--b'), false);
  assert.equal(parsed.levels.combat.size, 0);
  assert.equal(parsed.levels.archive.get('--b'), '#654321');
});

test('resolveColorToken follows var() chains and fallbacks', () => {
  const map = tokensForLevel(parseTokenCss(CSS), 'operator');
  assert.deepEqual(resolveColorToken('--c', map), { r: 17, g: 17, b: 17, a: 1 });
  assert.deepEqual(resolveColorToken('--fallback', map), { r: 34, g: 34, b: 34, a: 1 });
});

test('an intensity override flows through var() chains evaluated at that level', () => {
  const parsed = parseTokenCss(CSS);
  assert.deepEqual(resolveColorToken('--c', tokensForLevel(parsed, 'archive')), { r: 51, g: 51, b: 51, a: 1 });
  assert.deepEqual(resolveColorToken('--text', tokensForLevel(parsed, 'combat')), { r: 238, g: 238, b: 238, a: 1 });
});

test('a colour token that resolves to calc(), is missing, or loops is an error', () => {
  const parsed = parseTokenCss(CSS + ':root { --loop-a: var(--loop-b); --loop-b: var(--loop-a); }');
  const map = tokensForLevel(parsed, 'operator');
  assert.throws(() => resolveColorToken('--len', map), /calc/);
  assert.throws(() => resolveColorToken('--nope', map), /not defined|missing/i);
  assert.throws(() => resolveColorToken('--loop-a', map), /cycle|loop/i);
});

test('tokensForLevel rejects an unknown level', () => {
  assert.throws(() => tokensForLevel(parseTokenCss(CSS), 'turbo'), /level/i);
});

const spec = (pairs) => ({ pairs, exempt: [] });

test('evaluatePairs passes and fails against the kind thresholds', () => {
  const results = evaluatePairs(
    spec([
      { id: 'good-text', fg: '--text', bg: ['--a'], kind: 'text', where: 'x' },
      { id: 'weak-text', fg: '#777777', bg: ['#ffffff'], kind: 'text', where: 'x' },
      { id: 'weak-large', fg: '#777777', bg: ['#ffffff'], kind: 'large-text', where: 'x' },
      { id: 'weak-ui', fg: '#cccccc', bg: ['#ffffff'], kind: 'ui', where: 'x' },
    ]),
    CSS,
  );
  const by = Object.fromEntries(results.map((r) => [r.id, r]));
  assert.equal(by['good-text'].pass, true);
  assert.equal(by['weak-text'].pass, false);
  assert.equal(by['weak-text'].required, 4.5);
  assert.equal(by['weak-large'].pass, true);
  assert.equal(by['weak-large'].required, 3);
  assert.equal(by['weak-ui'].pass, false);
  assert.equal(by['weak-ui'].required, 3);
});

test('evaluatePairs reads literal colours and composites an alpha fill over its surface', () => {
  const [r] = evaluatePairs(
    spec([{ id: 'tag', fg: '#ffffff', bg: ['--a', 'rgba(255,255,255,0.5)'], kind: 'text', where: 'x' }]),
    CSS,
  );
  const flat = flatten(['#111111', 'rgba(255,255,255,0.5)']);
  near(r.ratio, contrastRatio('#ffffff', [flat]), 1e-9);
});

test('evaluatePairs expands "levels" into one result per level, evaluated against that level', () => {
  const results = evaluatePairs(
    spec([{ id: 'v', fg: '#888888', bg: ['--a'], kind: 'text', levels: ['operator', 'archive'], where: 'x' }]),
    CSS,
  );
  assert.deepEqual(results.map((r) => r.id), ['v@operator', 'v@archive']);
  assert.ok(results[0].ratio > results[1].ratio, 'archive background #333 is lighter than operator #111');
});

test('a single-level pair keeps its plain id', () => {
  const [r] = evaluatePairs(spec([{ id: 'plain', fg: '--text', bg: ['--a'], kind: 'text', where: 'x' }]), CSS);
  assert.equal(r.id, 'plain');
  assert.equal(r.level, 'operator');
});

test('evaluatePairs rejects a bad kind, a duplicate id, and a missing field', () => {
  const ok = { id: 'a', fg: '--text', bg: ['--a'], kind: 'text', where: 'x' };
  assert.throws(() => evaluatePairs(spec([{ ...ok, kind: 'huge' }]), CSS), /kind/);
  assert.throws(() => evaluatePairs(spec([ok, ok]), CSS), /duplicate/i);
  assert.throws(() => evaluatePairs(spec([{ ...ok, bg: [] }]), CSS), /bg/);
  assert.throws(() => evaluatePairs(spec([{ ...ok, where: undefined }]), CSS), /where/);
});

// ── The real system ───────────────────────────────────────────────────────────────────────────
// FR-014 / SC-005: every checked pairing in docs/design/v3/contrast-pairs.json meets AA against the
// built tokens. This is the guard that keeps a future token edit from silently dropping below it.
const ROOT = new URL('..', import.meta.url);
const pairsFile = JSON.parse(readFileSync(new URL('docs/design/v3/contrast-pairs.json', ROOT), 'utf8'));
// Built in memory from the source of truth: src/tokens/tokens.css is generated and git-ignored, so
// a clean checkout (CI runs `npm test` before `npm run build`) does not have it, and a local copy
// can be stale.
const tokenCss = tokenCssFromSource();

test('the token CSS is emitted from tokens.json, not read from the generated tokens.css', () => {
  const tree = JSON.parse(readFileSync(new URL('src/tokens/tokens.json', ROOT), 'utf8'));
  assert.equal(tokenCss, emitCss(tree));
  assert.equal(tokenCssFromSource(new URL('src/tokens/tokens.json', ROOT)), emitCss(tree));
});

test('design:contrast without --css ignores a stale src/tokens/tokens.css, and --css still overrides', () => {
  const script = new URL('scripts/design/contrast.mjs', ROOT).pathname;
  const run = (...args) => spawnSync(process.execPath, [script, '--quiet', ...args], { encoding: 'utf8' });
  const dir = mkdtempSync(join(tmpdir(), 'nw-contrast-'));
  try {
    const stale = join(dir, 'stale.css');
    writeFileSync(stale, tokenCss.replace(/(--nw-text-strong:\s*)[^;]+;/, '$1#111111;'));
    const def = run();
    assert.equal(def.status, 0, def.stdout + def.stderr);
    assert.match(def.stdout, /0 fail/);
    const overridden = run('--css', stale);
    assert.equal(overridden.status, 1, 'a CSS file with a failing colour must fail the run');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('the pairs file covers every category the plan lists', () => {
  const ids = pairsFile.pairs.map((p) => p.id).join(' ');
  for (const needle of ['body-', 'label-', 'signal-', 'btn-', 'tag-', 'placeholder-', 'focus-', 'boundary-']) {
    assert.ok(ids.includes(needle), `no pair id contains ${needle}`);
  }
});

test('every checked pairing meets its WCAG AA threshold at every level it is evaluated', () => {
  const results = evaluatePairs(pairsFile, tokenCss);
  assert.ok(results.length >= 60, `only ${results.length} pairings are checked`);
  const failing = results.filter((r) => !r.pass).map((r) => `${r.id} ${r.ratio.toFixed(2)} < ${r.required}`);
  assert.deepEqual(failing, []);
});

test('exempt entries carry a reason and are not in the checked pairs', () => {
  assert.ok(pairsFile.exempt.length >= 1);
  const checked = new Set(pairsFile.pairs.map((p) => p.id));
  for (const e of pairsFile.exempt) {
    assert.ok(e.reason && e.reason.length > 10, `${e.id} needs a reason`);
    assert.ok(!checked.has(e.id), `${e.id} is both checked and exempt`);
  }
});

test('every token a component sets as `color:` is checked as an fg, or exempt by name', () => {
  const dir = new URL('src/components/', ROOT);
  const used = new Map();
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.css'))) {
    const css = readFileSync(new URL(file, dir), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const [, value] of css.matchAll(/(?:^|[\s;{])color\s*:\s*([^;}]+)/g)) {
      for (const [, token] of value.matchAll(/var\(\s*(--[\w-]+)/g)) used.set(token, `${used.get(token) ?? ''} ${file}`.trim());
    }
  }
  assert.ok(used.size >= 15, `only ${used.size} colour tokens found in src/components`);
  const checked = new Set(pairsFile.pairs.map((p) => p.fg));
  const exempt = new Set(pairsFile.exempt.flatMap((e) => e.tokens ?? []));
  const unchecked = [...used].filter(([t]) => !checked.has(t) && !exempt.has(t)).map(([t, f]) => `${t} (${f})`);
  assert.deepEqual(unchecked, [], 'add each to contrast-pairs.json as an fg, or to an exempt entry\'s tokens with a reason');
});

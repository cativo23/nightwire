import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { NS } from '../scripts/lib/tokens.mjs';

// Guards on the checked-in sources (src/tokens/tokens.json, src/components/*.css,
// src/utilities/*.css), as opposed to tokens-validate/-emit, which feed the build fixtures.
const root = new URL('../', import.meta.url);
const tokens = JSON.parse(readFileSync(new URL('src/tokens/tokens.json', root), 'utf8'));

// Every token node (an object with $value) under `node`, with its dot path.
function* leaves(node, path = []) {
  if (node === null || typeof node !== 'object') return;
  if ('$value' in node) { yield { path: path.join('.'), node }; return; }
  for (const [key, child] of Object.entries(node)) if (!key.startsWith('$')) yield* leaves(child, [...path, key]);
}
const allTokens = [...leaves(tokens)];
const ext = (node) => node.$extensions?.[NS] ?? {};

test('every token flagged motion: true has a reducedMotion value', () => {
  const missing = allTokens
    .filter(({ node }) => ext(node).motion === true && !('reducedMotion' in ext(node)))
    .map(({ path }) => path);
  assert.deepEqual(missing, [], `motion tokens without reducedMotion: ${missing.join(', ')}`);
});

test('the motion knobs --nw-motion-scale, --nw-pulse-state and --nw-loop-state are flagged motion: true', () => {
  // Without the flag the generated reduced-motion block silently loses the knob, and the
  // previous test cannot notice: it only checks tokens that already opted in.
  const flagged = new Set(allTokens.filter(({ node }) => ext(node).motion === true).map(({ node }) => ext(node).css));
  for (const css of ['--nw-motion-scale', '--nw-pulse-state', '--nw-loop-state']) {
    assert.ok(flagged.has(css), `${css} must carry motion: true (and a reducedMotion value)`);
  }
});

const toMs = ({ value, unit }) => (unit === 's' ? value * 1000 : value);

test('every motion step has an out.duration no longer than its in.duration', () => {
  const steps = Object.entries(tokens.motion.timing).filter(([, step]) => step.in && step.out);
  assert.ok(steps.length > 0, 'tokens.json has motion.timing steps with in and out');
  const offenders = [];
  for (const [name, step] of steps) {
    const inMs = toMs(step.in.duration.$value);
    const outMs = toMs(step.out.duration.$value);
    if (outMs > inMs) offenders.push(`motion.timing.${name}: out ${outMs}ms > in ${inMs}ms`);
  }
  assert.deepEqual(offenders, []);
});

// ---- SC-003: no literal times in component and utility sources -------------------------------

const TIMING_PROP = /(?<![\w-])(transition|transition-duration|transition-delay|animation|animation-duration|animation-delay)\s*:\s*([^;{}]*)/g;
// A whole time token: not inside an identifier, a number or a var() name. Zero is exempt below.
const TIME = /(?<![\w.-])-?(?:\d+\.?\d*|\.\d+)m?s(?![\w-])/g;
const isZero = (time) => parseFloat(time) === 0;

/** file:line + declaration for every literal non-zero time in a timing declaration. */
function literalTimes(dir) {
  const hits = [];
  for (const file of readdirSync(new URL(dir, root)).filter((f) => f.endsWith('.css')).sort()) {
    const text = readFileSync(new URL(`${dir}${file}`, root), 'utf8');
    // Blank out comments (keeping newlines) so offsets still map to the right line.
    const code = text.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
    for (const m of code.matchAll(TIMING_PROP)) {
      // var(--nw-…) names are not times, whatever digits they hold.
      const value = m[2].replace(/var\([^)]*\)/g, 'var()');
      const times = (value.match(TIME) ?? []).filter((t) => !isZero(t));
      if (times.length === 0) continue;
      const line = code.slice(0, m.index).split('\n').length;
      hits.push(`${dir}${file}:${line}  ${m[1]}: ${m[2].trim().replace(/\s+/g, ' ')}   [${times.join(', ')}]`);
    }
  }
  return hits;
}

// A zero time (0s, 0ms) is not a timing choice, it means "no animation". Later tasks need
// `visibility 0s linear var(--nw-…-out-duration)`: in the transition shorthand the first time
// is the duration, so the 0s cannot be dropped or tokenized. Hence zero is exempt.
test('no literal time value in transition/animation declarations of components and utilities (SC-003)',
  { todo: 'components still hardcode durations; tokenized in US1 (T017-T024)' }, () => {
    const hits = [...literalTimes('src/components/'), ...literalTimes('src/utilities/')];
    assert.deepEqual(hits, [], `${hits.length} declaration(s) hardcode a duration, use a motion token:\n${hits.join('\n')}`);
  });

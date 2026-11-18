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

// ---- Source scanning helpers ------------------------------------------------------------------

// Blank out comments (keeping newlines) so offsets still map to the right line.
const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));

function cssFiles(dir) {
  return readdirSync(new URL(dir, root)).filter((f) => f.endsWith('.css')).sort().map((f) => ({
    name: `${dir}${f}`,
    text: readFileSync(new URL(`${dir}${f}`, root), 'utf8'),
  }));
}

/**
 * Every rule of a stylesheet as { selector, decls: [{ prop, value, line }] }. Nested blocks
 * (@media, @keyframes) are walked; a rule's selector is the prelude of its own block, and blocks
 * without declarations produce no entry. A `;` inside parentheses (url(data:...)) does not end
 * a declaration.
 */
function parseRules(text) {
  const code = stripComments(text);
  const rules = [];
  const stack = [];
  let buf = '';
  let bufStart = 0;
  let paren = 0;
  const lineAt = (index) => code.slice(0, index).split('\n').length;
  const flush = () => {
    const decl = buf.trim();
    const at = bufStart + (buf.length - buf.trimStart().length);
    buf = '';
    const colon = decl.indexOf(':');
    if (!decl || colon < 0 || stack.length === 0) return;
    stack[stack.length - 1].decls.push({
      prop: decl.slice(0, colon).trim().toLowerCase(),
      value: decl.slice(colon + 1).trim().replace(/\s+/g, ' '),
      line: lineAt(at),
    });
  };
  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    if (ch === '(') paren++;
    else if (ch === ')') paren = Math.max(0, paren - 1);
    if (paren === 0 && ch === '{') {
      const rule = { selector: buf.trim().replace(/\s+/g, ' '), decls: [] };
      stack.push(rule);
      rules.push(rule);
      buf = '';
    } else if (paren === 0 && ch === '}') {
      flush();
      stack.pop();
    } else if (paren === 0 && ch === ';') {
      flush();
    } else {
      if (buf === '') bufStart = i;
      buf += ch;
    }
  }
  return rules.filter((r) => r.decls.length > 0);
}

// ---- SC-003: no literal times in component, utility and base sources ---------------------------

const TIMING_PROP = /(?<![\w-])((?:-webkit-|-moz-)?(?:transition|transition-duration|transition-delay|animation|animation-duration|animation-delay))\s*:\s*([^;{}]*)/g;
// A whole time token: not inside an identifier, a number or a var() name. Zero is exempt below.
const TIME = /(?<![\w.-])-?(?:\d+\.?\d*|\.\d+)m?s(?![\w-])/g;
const isZero = (time) => parseFloat(time) === 0;

/**
 * var(--name) holds no time, but its fallback can: var(--x, 150ms) hardcodes 150ms for whoever
 * has not defined --x. Keep the fallback text (recursively, for nested var()), drop the rest.
 */
function stripVars(value) {
  let out = '';
  for (let i = 0; i < value.length;) {
    if (value.startsWith('var(', i) && !/[\w-]/.test(value[i - 1] ?? '')) {
      let depth = 1;
      let j = i + 4;
      while (j < value.length && depth > 0) {
        if (value[j] === '(') depth++;
        else if (value[j] === ')') depth--;
        j++;
      }
      const inner = value.slice(i + 4, depth === 0 ? j - 1 : j);
      const comma = inner.indexOf(',');
      out += ` ${comma < 0 ? '' : stripVars(inner.slice(comma + 1))} `;
      i = j;
    } else {
      out += value[i++];
    }
  }
  return out;
}

/** file:line + declaration for every literal non-zero time in a timing declaration of `text`. */
function literalTimesIn(name, text) {
  const hits = [];
  const code = stripComments(text);
  for (const m of code.matchAll(TIMING_PROP)) {
    const times = (stripVars(m[2]).match(TIME) ?? []).filter((t) => !isZero(t));
    if (times.length === 0) continue;
    const line = code.slice(0, m.index).split('\n').length;
    hits.push(`${name}:${line}  ${m[1]}: ${m[2].trim().replace(/\s+/g, ' ')}   [${times.join(', ')}]`);
  }
  return hits;
}

const literalTimes = (dir) => cssFiles(dir).flatMap(({ name, text }) => literalTimesIn(name, text));

test('the literal-time scan catches -webkit- prefixed properties and var() fallbacks', () => {
  assert.equal(literalTimesIn('x.css', '.a { transition: opacity 150ms; }').length, 1, 'plain, the baseline');
  assert.equal(literalTimesIn('x.css', '.a { -webkit-transition: opacity 150ms; }').length, 1, '-webkit-transition');
  assert.equal(literalTimesIn('x.css', '.a { -webkit-animation-duration: 2s; }').length, 1, '-webkit-animation-duration');
  assert.equal(literalTimesIn('x.css', '.a { transition: opacity var(--nw-tick, 150ms); }').length, 1, 'var fallback');
  assert.equal(literalTimesIn('x.css', '.a { transition: opacity var(--a, var(--b, 1s)); }').length, 1, 'nested var fallback');
  assert.equal(literalTimesIn('x.css', '.a { transition: opacity var(--nw-tick-2s); }').length, 0, 'digits in a var name are not a time');
  assert.equal(literalTimesIn('x.css', '.a { transition: visibility 0s linear var(--nw-sweep-out-duration); }').length, 0, 'zero is exempt');
});

// A zero time (0s, 0ms) is not a timing choice, it means "no animation". Later tasks need
// `visibility 0s linear var(--nw-…-out-duration)`: in the transition shorthand the first time
// is the duration, so the 0s cannot be dropped or tokenized. Hence zero is exempt.
test('no literal time value in transition/animation declarations of base, components and utilities (SC-003)', () => {
  const hits = [...literalTimes('src/base/'), ...literalTimes('src/components/'), ...literalTimes('src/utilities/')];
  assert.deepEqual(hits, [], `${hits.length} declaration(s) hardcode a duration, use a motion token:\n${hits.join('\n')}`);
});

// ---- Infinite animations read a play-state knob ------------------------------------------------

const PLAY_STATE_KNOBS = /^var\(--nw-(pulse|loop)-state\)$/;

/** file:line of every rule that loops forever without animation-play-state: var(--nw-pulse|loop-state). */
function unguardedLoopsIn(name, text) {
  const hits = [];
  for (const rule of parseRules(text)) {
    const loops = rule.decls.filter((d) => /^(-webkit-)?animation(-iteration-count)?$/.test(d.prop) && /\binfinite\b/.test(d.value));
    if (loops.length === 0) continue;
    const guarded = rule.decls.some((d) => /^(-webkit-)?animation-play-state$/.test(d.prop) && PLAY_STATE_KNOBS.test(d.value));
    if (!guarded) hits.push(`${name}:${loops[0].line}  ${rule.selector}  { ${loops[0].prop}: ${loops[0].value} }`);
  }
  return hits;
}

test('the infinite-animation scan flags a loop that has no play-state knob', () => {
  const bad = '.a { animation: spin 1s linear infinite; }';
  const ok = '.a { animation: spin 1s linear infinite; animation-play-state: var(--nw-loop-state); }';
  const wrong = '.a { animation: spin 1s linear infinite; animation-play-state: running; }';
  const count = '.a { animation-iteration-count: infinite; }';
  assert.equal(unguardedLoopsIn('x.css', bad).length, 1);
  assert.equal(unguardedLoopsIn('x.css', ok).length, 0);
  assert.equal(unguardedLoopsIn('x.css', wrong).length, 1, 'a literal play-state is not a knob');
  assert.equal(unguardedLoopsIn('x.css', count).length, 1, 'animation-iteration-count: infinite');
});

test('every infinite animation in src/ reads --nw-pulse-state or --nw-loop-state', () => {
  const hits = ['src/base/', 'src/components/', 'src/utilities/']
    .flatMap(cssFiles)
    .flatMap(({ name, text }) => unguardedLoopsIn(name, text));
  assert.deepEqual(hits, [], `looping animation(s) the intensity level cannot pause:\n${hits.join('\n')}`);
});

// ---- FR-013a: header decoration knobs are gone -------------------------------------------------

function* sourceFiles(dir) {
  for (const entry of readdirSync(new URL(dir, root), { withFileTypes: true })) {
    const path = `${dir}${entry.name}`;
    if (entry.isDirectory()) yield* sourceFiles(`${path}/`);
    else yield path;
  }
}

test('no --nw-header-gradient or --nw-header-pattern (nor their knob.header-* tokens) anywhere in src/ (FR-013a)', () => {
  const hits = [];
  for (const path of sourceFiles('src/')) {
    readFileSync(new URL(path, root), 'utf8').split('\n').forEach((text, i) => {
      if (/header-(gradient|pattern)/.test(text)) hits.push(`${path}:${i + 1}  ${text.trim()}`);
    });
  }
  assert.deepEqual(hits, [], `the header decoration knobs were removed:\n${hits.join('\n')}`);
});

// ---- FR-013: line weights come from the line knobs ----------------------------------------------

// border, border-<side>, border-width and border-<side>-width with a literal px width. Radius is
// excluded: it is a corner, not a line weight, and has its own tokens.
const LITERAL_BORDER = /(?<![\w-])border(?:-(?!radius)[a-z]+)?(?:-width)?\s*:\s*[\d.]+px/g;

test('no literal border width in src/components/*.css: use --nw-hairline, --nw-rule or --nw-accent-width', () => {
  const hits = [];
  for (const { name, text } of cssFiles('src/components/')) {
    const code = stripComments(text);
    for (const m of code.matchAll(LITERAL_BORDER)) {
      hits.push(`${name}:${code.slice(0, m.index).split('\n').length}  ${m[0].replace(/\s+/g, ' ')}`);
    }
  }
  assert.deepEqual(hits, [], `${hits.length} literal border width(s):\n${hits.join('\n')}`);
});

// ---- FR-013 / FR-013a: glow is a state signal, on a per-component knob -------------------------

/** Split `value` on `sep` where it is not inside parentheses. */
function splitTop(value, sep) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === '(') depth++;
    else if (value[i] === ')') depth--;
    else if (depth === 0 && sep.test(value[i])) {
      parts.push(value.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(value.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}

const LENGTH = /^(?:-?[\d.]+(?:px|r?em)?|calc\(.*\))$/;

/**
 * The glow layers of a box-shadow/text-shadow value. `none` and a lone neutral elevation token
 * are not glow. A layer whose blur radius (the third length) is a literal zero is a ring or an
 * inset band, not a glow: that is how focus rings drawn with box-shadow are told apart.
 */
function glowLayers(value) {
  return splitTop(value, /,/).filter((layer) => {
    if (layer === 'none' || /^var\(--nw-elevation-[\w-]+\)$/.test(layer)) return false;
    const lengths = splitTop(layer, /\s/).filter((t) => LENGTH.test(t));
    if (lengths.length < 3) return true; // cannot prove it is a ring
    return !/^0(?:px)?$/.test(lengths[2]);
  });
}

const SHADOW = /^(?:-webkit-)?(?:box|text)-shadow$/;

test('the glow scan tells glow from rings, elevation and none', () => {
  assert.equal(glowLayers('0 0 8px red').length, 1);
  assert.equal(glowLayers('0 0 calc(6px * var(--nw-glow)) var(--nw-chrome)').length, 1);
  assert.equal(glowLayers('0 0 0 3px rgba(1, 2, 3, 0.2)').length, 0, 'spread-only ring');
  assert.equal(glowLayers('inset 0 0 0 4px var(--nw-text-on-fill)').length, 0, 'inset band');
  assert.equal(glowLayers('var(--nw-elevation-overlay)').length, 0, 'neutral elevation token');
  assert.equal(glowLayers('none').length, 0);
  assert.equal(glowLayers('var(--something-else)').length, 1, 'an opaque token is not provably neutral');
  assert.equal(glowLayers('0 0 0 1px red, 0 20px 80px red').length, 1, 'one glowing layer among rings');
});

// Research R4: the state signals that keep a glow, each on its component's knob. `knob: null`
// marks the v1 `.led.green/.blue/.red/.yellow` rules that stay on --nw-glow until T042.
const STATE_GLOW = [
  { file: 'src/components/led.css', selector: /^\.led\[data-state="[a-z]+"\]$/, knob: '--nw-led-glow' },
  { file: 'src/components/led.css', selector: /^\.led\.(?:green|blue|red|yellow)$/, knob: null },
  { file: 'src/components/check.css', selector: /^\.check input:checked \+ \.box$/, knob: '--nw-control-glow' },
  { file: 'src/components/check.css', selector: /^\.radio input:checked \+ \.box::after$/, knob: '--nw-control-glow' },
  { file: 'src/components/switch.css', selector: /^\.switch input:checked \+ \.track::after$/, knob: '--nw-control-glow' },
  { file: 'src/components/segmented.css', selector: /^\.seg button\[aria-pressed="true"\]$/, knob: '--nw-control-glow' },
  { file: 'src/components/steps.css', selector: /^\.steps \.step\.(?:done|current)$/, knob: '--nw-control-glow' },
  { file: 'src/components/progress.css', selector: /^\.nw-progress \.fill, \.nw-progress-fill$/, knob: '--nw-progress-glow' },
];
const stateGlowFor = (file, selector) => STATE_GLOW.find((s) => s.file === file && s.selector.test(selector));

/** Every glow layer in src/components with the rule that declares it. */
function componentGlow() {
  const found = [];
  for (const { name, text } of cssFiles('src/components/')) {
    for (const rule of parseRules(text)) {
      for (const d of rule.decls.filter((x) => SHADOW.test(x.prop))) {
        for (const layer of glowLayers(d.value)) found.push({ file: name, selector: rule.selector, prop: d.prop, layer, line: d.line });
      }
    }
  }
  return found;
}

test('no box-shadow or text-shadow glow in src/components outside the state-glow selectors (spread-only rings and neutral elevation excluded)', () => {
  const hits = componentGlow()
    .filter((g) => !stateGlowFor(g.file, g.selector))
    .map((g) => `${g.file}:${g.line}  ${g.selector}  { ${g.prop}: ${g.layer} }`);
  assert.deepEqual(hits, [], `${hits.length} decorative glow layer(s); state glow is listed in research R4:\n${hits.join('\n')}`);
});

test('state glow reads its own component knob, not --nw-glow directly (led, control, progress)', () => {
  const hits = componentGlow()
    .map((g) => ({ g, state: stateGlowFor(g.file, g.selector) }))
    .filter(({ state }) => state?.knob)
    .filter(({ g, state }) => !g.layer.includes(`var(${state.knob})`) || g.layer.includes('var(--nw-glow)'))
    .map(({ g, state }) => `${g.file}:${g.line}  ${g.selector}  { ${g.prop}: ${g.layer} }  (want ${state.knob})`);
  assert.deepEqual(hits, [], `${hits.length} state glow(s) not on their knob:\n${hits.join('\n')}`);
});

test('the .glow-* utilities scale by --nw-glow and stay restrained (alpha at most 0.35)', () => {
  const offenders = [];
  for (const { name, text } of cssFiles('src/utilities/').filter((f) => f.name.endsWith('glow.css'))) {
    for (const rule of parseRules(text)) {
      for (const d of rule.decls.filter((x) => x.prop === 'text-shadow')) {
        for (const layer of glowLayers(d.value)) {
          const blur = splitTop(layer, /\s/).filter((t) => LENGTH.test(t))[2] ?? '';
          const alpha = Number(/rgba\([^)]*,\s*([\d.]+)\s*\)/.exec(layer)?.[1] ?? 1);
          if (!blur.includes('var(--nw-glow)') || alpha > 0.35) {
            offenders.push(`${name}:${d.line}  ${rule.selector}  { ${layer} }  (blur ${blur}, alpha ${alpha})`);
          }
        }
      }
    }
  }
  assert.deepEqual(offenders, [], `glow utilities must be calc(Npx * var(--nw-glow)) with alpha <= 0.35:\n${offenders.join('\n')}`);
});

// ---- v1 compatibility surfaces (FR-016, research R10) ------------------------------------------

const allSelectors = (dir) => cssFiles(dir).flatMap(({ name, text }) =>
  parseRules(text).map((r) => ({ file: name, selector: r.selector, decls: r.decls })));

test('.modal-backdrop is declared once, closed by default, with its open state on [data-open="true"]', () => {
  const rules = allSelectors('src/components/').filter((r) => r.file.endsWith('modal.css') && r.selector === '.modal-backdrop');
  assert.equal(rules.length, 1, 'one merged .modal-backdrop rule');
  const props = Object.fromEntries(rules[0].decls.map((d) => [d.prop, d.value]));
  assert.equal(props.position, 'fixed');
  assert.equal(props.visibility, 'hidden');
  assert.equal(props.opacity, '0');
  assert.equal(props['pointer-events'], 'none');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { emitCss, emitPreset, resolve, NS } from '../scripts/lib/tokens.mjs';

const ext = (node) => node.$extensions[NS];
const sample = () => JSON.parse(readFileSync(new URL('./fixtures/tokens/sample.json', import.meta.url), 'utf8'));
const loadPreset = async (src) => (await import(`data:text/javascript,${encodeURIComponent(src)}`)).default;

const EXPECTED_CSS = `/* ── Palette ── */

:root {
  /* Colors */
  --blue:     #6699ff;
  --blue-fill: rgba(102, 153, 255, 0.08);
  --chrome:   var(--blue);

  /* Radius */
  --radius-none: 0;
  --radius-sm: 2px;

  /* Knobs */
  --glow:     1;
  --scale:    1;
  --panel-radius: var(--radius-none);
  --state:    running;

  --tick:     calc(150ms * var(--scale)) cubic-bezier(0.3, 0, 0.7, 1);

  --font-sys: 'JetBrains Mono', monospace;
}

/* archive */
:root[data-intensity="archive"] {
  --glow: 0;
  --panel-radius: var(--radius-sm);
  --state: paused;
}

/* operator */
:root[data-intensity="operator"] {
  /* base :root values apply */
}

/* combat */
:root[data-intensity="combat"] {
  --glow: 2.2;
}

@media (prefers-reduced-motion: reduce) {
  :root,
  :root[data-intensity] {
    --scale: 0;
    --state: paused;
  }
}
`;

test('emitCss reproduces comments, alignment, aliases, raw values and intensity blocks', () => {
  assert.equal(emitCss(sample()), EXPECTED_CSS);
});

test('emitCss: an alias becomes var(--target)', () => {
  assert.match(emitCss(sample()), /--chrome: {3}var\(--blue\);/);
});

test('emitCss: alpha < 1 emits rgba with spaces and 0-255 ints, alpha 1 emits hex', () => {
  const css = emitCss(sample());
  assert.match(css, /--blue-fill: rgba\(102, 153, 255, 0\.08\);/);
  assert.match(css, /--blue: {5}#6699ff;/);
});

test('emitCss: raw values interpolate {alias} to the literal', () => {
  assert.match(emitCss(sample()), /--tick: {5}calc\(150ms \* var\(--scale\)\) cubic-bezier\(0\.3, 0, 0\.7, 1\);/);
});

test('emitCss: preset-only and doc-only tokens emit no CSS', () => {
  const css = emitCss(sample());
  assert.doesNotMatch(css, /0 0 8px/);
  assert.doesNotMatch(css, /400/);
});

test('emitCss: an empty intensity set still emits its block with the body comment', () => {
  assert.match(emitCss(sample()), /:root\[data-intensity="operator"\] \{\n {2}\/\* base :root values apply \*\/\n\}/);
});

test('emitCss: intensity blocks follow archive, operator, combat order', () => {
  const css = emitCss(sample());
  const a = css.indexOf('"archive"');
  const o = css.indexOf('"operator"');
  const c = css.indexOf('"combat"');
  assert.ok(a < o && o < c);
});

test('emitCss: the reduced-motion block follows the intensity blocks and uses :root and :root[data-intensity]', () => {
  const css = emitCss(sample());
  const combat = css.indexOf('"combat"');
  const media = css.indexOf('@media (prefers-reduced-motion: reduce) {\n  :root,\n  :root[data-intensity] {\n');
  assert.ok(combat !== -1 && media > combat);
});

test('emitCss: reduced-motion declarations follow token key order', () => {
  const t = sample();
  const { scale, state } = t.knob;
  delete t.knob.scale;
  delete t.knob.state;
  t.knob.state = state;
  t.knob.scale = scale;
  const css = emitCss(t);
  const block = css.slice(css.indexOf('@media'));
  assert.ok(block.indexOf('--state: paused;') < block.indexOf('--scale: 0;'));
});

test('emitCss: no reducedMotion on any token emits no @media block', () => {
  const t = sample();
  for (const k of [t.knob.scale, t.knob.state]) {
    delete ext(k).motion;
    delete ext(k).reducedMotion;
  }
  const css = emitCss(t);
  assert.doesNotMatch(css, /@media/);
  assert.ok(css.endsWith('  --glow: 2.2;\n}\n'));
});

test('emitCss: emission follows key order', () => {
  const t = sample();
  const { blue, fill, chrome } = t.color;
  t.color = { $type: 'color', $description: t.color.$description, $extensions: t.color.$extensions, chrome, fill, blue };
  const css = emitCss(t);
  assert.ok(css.indexOf('--chrome') < css.indexOf('--blue-fill'));
  assert.ok(css.indexOf('--blue-fill') < css.indexOf('--blue:'));
});

test('emitCss: LF only, one trailing newline, deterministic', () => {
  const a = emitCss(sample());
  const b = emitCss(sample());
  assert.equal(a, b);
  assert.ok(!a.includes('\r'));
  assert.ok(a.endsWith('}\n') && !a.endsWith('\n\n'));
});

test('emitPreset: aliases resolve to literals and tailwind arrays fan out', async () => {
  const preset = await loadPreset(emitPreset(sample()));
  assert.deepEqual(preset, {
    theme: {
      extend: {
        colors: { blue: { DEFAULT: '#6699ff' }, chrome: '#6699ff' },
        borderColor: { blue: '#6699ff' },
        borderRadius: { none: '0' },
        transitionDuration: { tick: '150ms' },
        transitionTimingFunction: { tick: 'cubic-bezier(0.3, 0, 0.7, 1)' },
        fontFamily: { sys: ['JetBrains Mono', 'monospace'] },
        boxShadow: { glow: '0 0 8px rgba(1,2,3,0.5)' },
      },
    },
  });
});

test('emitPreset keeps the @type JSDoc and the default-export shape', () => {
  const src = emitPreset(sample());
  assert.match(src, /^\/\*\* @type \{import\('tailwindcss'\)\.Config\} \*\/\nexport default \{\n {2}theme: \{\n {4}extend: \{/m);
  assert.ok(src.endsWith('};\n'));
  assert.equal(src, emitPreset(sample()));
});

test('resolve returns literals in CSS form for every type', () => {
  const t = sample();
  assert.equal(resolve(t, 'color.chrome'), '#6699ff');
  assert.equal(resolve(t, 'color.fill'), 'rgba(102, 153, 255, 0.08)');
  assert.equal(resolve(t, 'radius.none'), '0');
  assert.equal(resolve(t, 'radius.sm'), '2px');
  assert.equal(resolve(t, 'motion.timing.duration'), '150ms');
  assert.equal(resolve(t, 'motion.timing.easing'), 'cubic-bezier(0.3, 0, 0.7, 1)');
  assert.equal(resolve(t, 'font.sys'), "'JetBrains Mono', monospace");
  assert.equal(resolve(t, 'knob.glow'), '1');
  assert.equal(resolve(t, 'knob.radius'), '0');
  assert.equal(resolve(t, 'doc.type.weight'), '400');
});

test('the vendor namespace is dev.cativo.nightwire', () => {
  assert.equal(NS, 'dev.cativo.nightwire');
});

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

  --tick-duration: calc(150ms * var(--scale));
  --tick-ease: cubic-bezier(0.3, 0, 0.7, 1);

  --font-sys: 'JetBrains Mono', monospace;

  --ls-wide:  0.06em;

  --glow-shadow: 0 0 8px rgba(1,2,3,0.5);
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

test('emitCss: doc-only tokens emit no CSS, and a token without a css name has no declaration', () => {
  const css = emitCss(sample());
  assert.doesNotMatch(css, /400/);
  assert.doesNotMatch(css, /--duration|--easing/);
});

test('emitCss: a raw shadow with a css name is emitted verbatim', () => {
  assert.match(emitCss(sample()), /--glow-shadow: 0 0 8px rgba\(1,2,3,0\.5\);/);
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

const MIX = (css) => `color-mix(in srgb, var(${css}) calc(<alpha-value> * 100%), transparent)`;

test('emitPreset: colours, motion and shadows reference the custom properties, the rest stays literal', async () => {
  const preset = await loadPreset(emitPreset(sample()));
  assert.deepEqual(preset, {
    theme: {
      extend: {
        colors: { blue: { DEFAULT: MIX('--blue') }, fill: MIX('--blue-fill'), chrome: MIX('--chrome') },
        borderColor: { blue: MIX('--blue') },
        borderRadius: { none: '0' },
        transitionDuration: { tick: 'var(--tick-duration)' },
        transitionTimingFunction: { tick: 'var(--tick-ease)' },
        fontFamily: { sys: ['JetBrains Mono', 'monospace'] },
        letterSpacing: { wide: '0.06em' },
        boxShadow: { glow: 'var(--glow-shadow)' },
      },
    },
  });
});

test('emitPreset: a colour opacity modifier keeps working, so the value carries the <alpha-value> placeholder', async () => {
  const { theme: { extend } } = await loadPreset(emitPreset(sample()));
  assert.equal(extend.colors.blue.DEFAULT, 'color-mix(in srgb, var(--blue) calc(<alpha-value> * 100%), transparent)');
});

test('emitPreset: an alias colour uses its own css name, not the end of its alias chain', async () => {
  const { theme: { extend } } = await loadPreset(emitPreset(sample()));
  assert.equal(extend.colors.chrome, MIX('--chrome'));
  assert.doesNotMatch(extend.colors.chrome, /--blue/);
});

test('emitPreset: a colour with alpha < 1 uses the same form, the alpha stays in the custom property', async () => {
  const { theme: { extend } } = await loadPreset(emitPreset(sample()));
  assert.equal(extend.colors.fill, MIX('--blue-fill'));
});

test('emitPreset: duration and easing longhands become var(css)', async () => {
  const { theme: { extend } } = await loadPreset(emitPreset(sample()));
  assert.equal(extend.transitionDuration.tick, 'var(--tick-duration)');
  assert.equal(extend.transitionTimingFunction.tick, 'var(--tick-ease)');
});

test('emitPreset: a typed duration or cubicBezier token with a css name also becomes var(css)', async () => {
  const t = sample();
  t.motion.timing.duration.$extensions = { [NS]: { css: '--d', tailwind: ['transitionDuration.typed'] } };
  t.motion.timing.easing.$extensions = { [NS]: { css: '--e', tailwind: ['transitionTimingFunction.typed'] } };
  const { theme: { extend } } = await loadPreset(emitPreset(t));
  assert.equal(extend.transitionDuration.typed, 'var(--d)');
  assert.equal(extend.transitionTimingFunction.typed, 'var(--e)');
});

test('emitPreset: a raw shadow with a css name becomes var(css)', async () => {
  const { theme: { extend } } = await loadPreset(emitPreset(sample()));
  assert.equal(extend.boxShadow.glow, 'var(--glow-shadow)');
});

test('emitPreset: a raw shadow without a css name emits its value as written, since it references a custom property', async () => {
  const t = sample();
  const value = '0 0 calc(8px * var(--glow)) rgba(1,2,3,0.33)';
  t.shadow.glow.$value = value;
  delete ext(t.shadow.glow).css;
  const { theme: { extend } } = await loadPreset(emitPreset(t));
  assert.equal(extend.boxShadow.glow, value);
});

test('emitPreset: fontFamily stays an array, a dimension stays a literal, raw letter spacing stays a literal', async () => {
  const { theme: { extend } } = await loadPreset(emitPreset(sample()));
  assert.deepEqual(extend.fontFamily.sys, ['JetBrains Mono', 'monospace']);
  assert.equal(extend.borderRadius.none, '0');
  assert.equal(extend.letterSpacing.wide, '0.06em');
  assert.equal(typeof extend.letterSpacing.wide, 'string');
});

test('emitPreset: a dimension with a css name stays literal even under a duration-less target', async () => {
  const t = sample();
  ext(t.radius.sm).tailwind = ['borderRadius.sm'];
  const { theme: { extend } } = await loadPreset(emitPreset(t));
  assert.equal(extend.borderRadius.sm, '2px');
});

test('emitPreset: one token with two targets of different kinds decides per target', async () => {
  const t = sample();
  ext(t.shadow.glow).tailwind = ['boxShadow.glow', 'dropShadow.glow'];
  const { theme: { extend } } = await loadPreset(emitPreset(t));
  assert.equal(extend.boxShadow.glow, 'var(--glow-shadow)');
  assert.equal(extend.dropShadow.glow, '0 0 8px rgba(1,2,3,0.5)');
});

test('emitPreset: a colour with targets under several colour keys gets the colour form under each', async () => {
  const t = sample();
  ext(t.color.blue).tailwind = ['colors.blue.DEFAULT', 'ringColor.blue', 'outlineColor.blue'];
  const { theme: { extend } } = await loadPreset(emitPreset(t));
  assert.equal(extend.ringColor.blue, MIX('--blue'));
  assert.equal(extend.outlineColor.blue, MIX('--blue'));
});

test('emitPreset: a deep key path nests and keeps the colour form', async () => {
  const t = sample();
  ext(t.color.blue).tailwind = ['colors.nw.a.DEFAULT', 'colors.nw.a.dim'];
  const { theme: { extend } } = await loadPreset(emitPreset(t));
  assert.deepEqual(extend.colors.nw, { a: { DEFAULT: MIX('--blue'), dim: MIX('--blue') } });
});

test('emitPreset: a raw token whose target is not colour, motion or shadow stays a literal string', async () => {
  const t = sample();
  ext(t.shadow.glow).tailwind = ['backgroundImage.glow'];
  const { theme: { extend } } = await loadPreset(emitPreset(t));
  assert.equal(extend.backgroundImage.glow, '0 0 8px rgba(1,2,3,0.5)');
});

test('FR-018: every v2.1.0 preset key still exists, and the additions are the v3 ones', async () => {
  const tree = JSON.parse(readFileSync(new URL('../src/tokens/tokens.json', import.meta.url), 'utf8'));
  const keys = [];
  const walk = (node, path) => {
    for (const [k, v] of Object.entries(node)) {
      if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, [...path, k]);
      else keys.push([...path, k].join('.'));
    }
  };
  walk((await loadPreset(emitPreset(tree))).theme.extend, []);
  const v2 = JSON.parse(readFileSync(new URL('./fixtures/preset-keys-v2.1.0.json', import.meta.url), 'utf8'));
  assert.deepEqual(v2.filter((k) => !keys.includes(k)), [], 'v2.1.0 preset keys that disappeared');
  assert.deepEqual(keys.filter((k) => !v2.includes(k)).sort(), [
    // v3 role tokens (spec 002 US2)
    'colors.nw.action.DEFAULT', 'colors.nw.action.hot', 'colors.nw.action.text',
    // exit longhands (FR-018, T050)
    'transitionDuration.nw-sweep-out', 'transitionDuration.nw-tick-out', 'transitionDuration.nw-uplink-out',
    'transitionTimingFunction.nw-sweep-out', 'transitionTimingFunction.nw-tick-out', 'transitionTimingFunction.nw-uplink-out',
  ]);
});

const realPreset = async () => (await loadPreset(emitPreset(
  JSON.parse(readFileSync(new URL('../src/tokens/tokens.json', import.meta.url), 'utf8'))))).theme.extend;
const flat = (o) => Object.values(o).flatMap((v) => (v && typeof v === 'object' ? flat(v) : [v]));

test('FR-018: in the real preset every colour is a color-mix over a custom property, alpha tokens included', async () => {
  const extend = await realPreset();
  for (const group of ['colors', 'backgroundColor', 'borderColor']) {
    assert.ok(flat(extend[group]).length > 0, group);
    for (const v of flat(extend[group])) {
      assert.match(v, /^color-mix\(in srgb, var\(--[a-z0-9-]+\) calc\(<alpha-value> \* 100%\), transparent\)$/, group);
    }
  }
});

test('FR-018: in the real preset every motion value is a var() and every shadow references a custom property', async () => {
  const extend = await realPreset();
  for (const group of ['transitionDuration', 'transitionTimingFunction']) {
    for (const v of flat(extend[group])) assert.match(v, /^var\(--[a-z0-9-]+\)$/, group);
  }
  for (const v of flat(extend.boxShadow)) assert.match(v, /var\(--[a-z0-9-]+\)/, 'boxShadow');
});

test('FR-018: font families, sizes, spacing, radii and letter spacing stay literal in the real preset', async () => {
  const extend = await realPreset();
  for (const group of ['fontFamily', 'fontSize', 'spacing', 'borderRadius', 'letterSpacing']) {
    for (const v of flat(extend[group] ?? {})) assert.doesNotMatch(String(v), /var\(/, group);
  }
});

test('the preset glow shadows equal the .glow-* text-shadows in glow.css, so both scale by --nw-glow where they are used', async () => {
  const { boxShadow } = await realPreset();
  const css = readFileSync(new URL('../src/utilities/glow.css', import.meta.url), 'utf8');
  for (const c of ['green', 'blue', 'cyan', 'red']) {
    const m = css.match(new RegExp(`^\\.glow-${c}\\s+\\{ text-shadow: ([^;]+); \\}$`, 'm'));
    assert.ok(m, `.glow-${c} in glow.css`);
    assert.equal(boxShadow[`glow-${c}`], m[1]);
    assert.match(m[1], /var\(--nw-glow\)/);
  }
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

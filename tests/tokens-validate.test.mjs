import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validate, NS } from '../scripts/lib/tokens.mjs';

const sample = () => JSON.parse(readFileSync(new URL('./fixtures/tokens/sample.json', import.meta.url), 'utf8'));
const ext = (node) => node.$extensions[NS];

/** Assert validate() throws and the message names every given fragment. */
function rejects(tree, ...fragments) {
  assert.throws(() => validate(tree), (err) => {
    for (const f of fragments) assert.match(err.message, f instanceof RegExp ? f : new RegExp(escape(f)));
    return true;
  });
}
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('the sample tree is valid', () => {
  assert.doesNotThrow(() => validate(sample()));
});

test('V-T1: a token needs at least one of css, tailwind, designMd', () => {
  const t = sample();
  t.color.orphan = { $value: { colorSpace: 'srgb', components: [0, 0, 0], hex: '#000000' } };
  rejects(t, 'color.orphan', 'at least one of css, tailwind, designMd');
});

test('V-T1: a token with no target is valid when a raw value interpolates it', () => {
  const t = sample();
  t.motion.base = { $type: 'duration', $value: { value: 90, unit: 'ms' } };
  t.motion.tick.$value = 'calc({motion.base} * 2)';
  assert.doesNotThrow(() => validate(t));
});

test('V-T1: a token with no target is valid when another token aliases it', () => {
  const t = sample();
  t.radius.hidden = { $value: { value: 8, unit: 'px' } };
  t.radius.shown = { $value: '{radius.hidden}', $extensions: { [NS]: { tailwind: ['borderRadius.shown'] } } };
  assert.doesNotThrow(() => validate(t));
});

test('V-T1: an unreferenced token still fails even when it aliases another targetless token', () => {
  const t = sample();
  t.color.hidden = { $value: { colorSpace: 'srgb', components: [0, 0, 0], hex: '#000000' } };
  t.color.hidden2 = { $value: '{color.hidden}' };
  rejects(t, 'color.hidden2', 'at least one of css, tailwind, designMd');
});

test('V-T2: css names are unique', () => {
  const t = sample();
  ext(t.color.fill).css = '--blue';
  rejects(t, 'color.fill', '--blue');
});

test('V-T2: css names match ^--[a-z][a-z0-9-]*$', () => {
  const t = sample();
  ext(t.color.blue).css = '--Blue';
  rejects(t, 'color.blue', '--Blue');
});

test('V-T3: unknown aliases are rejected', () => {
  const t = sample();
  t.color.chrome.$value = '{color.nope}';
  rejects(t, 'color.chrome', '{color.nope}');
});

test('V-T3: unknown aliases inside raw values are rejected', () => {
  const t = sample();
  t.motion.tick.$value = 'calc({motion.timing.nope} * 2)';
  rejects(t, 'motion.tick', '{motion.timing.nope}');
});

test('V-T3: alias cycles are rejected', () => {
  const t = sample();
  t.color.loop = { $value: '{color.loop2}', $extensions: { [NS]: { css: '--loop' } } };
  t.color.loop2 = { $value: '{color.loop}', $extensions: { [NS]: { css: '--loop2' } } };
  rejects(t, 'color.loop', /cycle/);
});

test('V-T4: a whole-value alias emitted to CSS needs a target with css', () => {
  const t = sample();
  t.knob.radius.$value = '{motion.timing.duration}';
  rejects(t, 'knob.radius', 'motion.timing.duration', /no css/);
});

test('V-T5: color values must be the DTCG srgb object', () => {
  const t1 = sample();
  t1.color.blue.$value = '#6699ff';
  rejects(t1, 'color.blue', /color/);

  const t2 = sample();
  t2.color.blue.$value.components = [0.4, 0.6, 1.2];
  rejects(t2, 'color.blue', /components/);

  const t3 = sample();
  delete t3.color.blue.$value.hex;
  rejects(t3, 'color.blue', /hex/);

  const t4 = sample();
  t4.color.blue.$value.hex = '#6699fe';
  rejects(t4, 'color.blue', /hex/);

  const t5 = sample();
  t5.color.fill.$value.alpha = 1.5;
  rejects(t5, 'color.fill', /alpha/);
});

test('V-T5: dimension, duration and cubicBezier shapes', () => {
  const t1 = sample();
  t1.radius.sm.$value = { value: 2, unit: 'em' };
  rejects(t1, 'radius.sm', /unit/);

  const t2 = sample();
  t2.motion.timing.duration.$value = { value: 150, unit: 'min' };
  rejects(t2, 'motion.timing.duration', /unit/);

  const t3 = sample();
  t3.motion.timing.easing.$value = [1.3, 0, 0.7, 1];
  rejects(t3, 'motion.timing.easing', /cubicBezier/);

  const t4 = sample();
  t4.motion.timing.easing.$value = [0.3, 0, 0.7];
  rejects(t4, 'motion.timing.easing', /cubicBezier/);
});

test('V-T6: $type is required unless the token is raw', () => {
  const t = sample();
  delete ext(t.knob.state).raw;
  rejects(t, 'knob.state', /\$type/);
});

test('V-T6: $type may be inherited from a group', () => {
  const t = sample();
  assert.equal(t.radius.sm.$type, undefined);
  assert.doesNotThrow(() => validate(t));
});

test('intensity overrides must target a token with css', () => {
  const t1 = sample();
  ext(t1).intensity.archive.tokens['motion.timing.duration'] = 'none';
  rejects(t1, 'archive', 'motion.timing.duration', /no css/);

  const t2 = sample();
  ext(t2).intensity.combat.tokens['knob.nope'] = 1;
  rejects(t2, 'combat', 'knob.nope');
});

test('reducedMotion is accepted on a token with css, with or without motion: true', () => {
  const t = sample();
  ext(t.knob.glow).reducedMotion = 0;
  assert.doesNotThrow(() => validate(t));
  delete ext(t.knob.scale).motion;
  assert.doesNotThrow(() => validate(t));
});

test('reducedMotion needs css on its token', () => {
  const t = sample();
  t.motion.timing.duration.$extensions = { [NS]: { reducedMotion: { value: 0, unit: 'ms' } } };
  rejects(t, 'motion.timing.duration', 'reducedMotion', /css/);
});

test('reducedMotion is shaped by the token type, like intensity overrides', () => {
  const t1 = sample();
  ext(t1.knob.scale).reducedMotion = { value: 0, unit: 'ms' };
  rejects(t1, 'knob.scale', /number/);

  const t2 = sample();
  ext(t2.radius.sm).reducedMotion = 2;
  rejects(t2, 'radius.sm', /dimension/);

  const t3 = sample();
  ext(t3.knob.state).reducedMotion = 0;
  rejects(t3, 'knob.state', /raw/, /string/);
});

test('reducedMotion strings may be aliases to tokens with css or raw text, and unknown aliases are rejected', () => {
  const t1 = sample();
  ext(t1.knob.radius).reducedMotion = '{radius.sm}';
  assert.doesNotThrow(() => validate(t1));

  const t2 = sample();
  ext(t2.knob.scale).reducedMotion = '{knob.nope}';
  rejects(t2, 'knob.scale', '{knob.nope}');

  const t3 = sample();
  ext(t3.knob.scale).reducedMotion = '{motion.timing.duration}';
  rejects(t3, 'knob.scale', 'motion.timing.duration', /no css/);
});

test('motion must be a boolean', () => {
  const t = sample();
  ext(t.knob.scale).motion = 'yes';
  rejects(t, 'knob.scale', /motion must be a boolean/);
});

test('motion: true requires reducedMotion', () => {
  const t = sample();
  delete ext(t.knob.scale).reducedMotion;
  rejects(t, 'motion token knob.scale has no reducedMotion value');
});

test('motion: false does not require reducedMotion', () => {
  const t = sample();
  delete ext(t.knob.scale).reducedMotion;
  ext(t.knob.scale).motion = false;
  assert.doesNotThrow(() => validate(t));
});

test('token and group names cannot start with $ or contain { } .', () => {
  const t1 = sample();
  t1.color['a.b'] = t1.color.blue;
  delete t1.color.blue;
  rejects(t1, 'a.b', /name/);

  const t2 = sample();
  t2.knob['{x}'] = t2.knob.glow;
  rejects(t2, '{x}', /name/);

  const t3 = sample();
  t3.knob.$weird = {};
  rejects(t3, '$weird', /name/);
});

test('two tokens cannot target the same preset or DESIGN.md path', () => {
  const t1 = sample();
  ext(t1.color.chrome).tailwind = ['colors.blue.DEFAULT'];
  rejects(t1, 'colors.blue.DEFAULT', 'color.chrome');

  const t2 = sample();
  ext(t2.radius.sm).designMd = ['rounded.none'];
  rejects(t2, 'rounded.none', 'radius.sm');
});

test('a preset or DESIGN.md path nested under another token\'s path is rejected, whatever the sort order', () => {
  const t1 = sample();
  ext(t1.color.chrome).tailwind = ['colors.blue.DEFAULT.x'];
  rejects(t1, 'colors.blue.DEFAULT.x', 'colors.blue.DEFAULT');

  const t2 = sample();
  ext(t2.color.blue).tailwind = ['colors.primary'];
  ext(t2.color.fill).tailwind = ['colors.primary-dark'];
  ext(t2.color.chrome).tailwind = ['colors.primary.500'];
  rejects(t2, 'colors.primary.500', 'colors.primary');
});

test('a DESIGN.md path needs a region and a key (at least two segments)', () => {
  const t = sample();
  ext(t.doc.type.weight).designMd = ['version'];
  rejects(t, 'doc.type.weight', 'version', /two segments/);
});

test('FR-018: a colour tailwind target needs a css name', () => {
  const t = sample();
  delete ext(t.color.fill).css;
  rejects(t, 'color.fill', 'colors.fill', 'css', 'FR-018');
});

test('FR-018: an alias colour target needs its own css name, the alias target having one is not enough', () => {
  const t = sample();
  delete ext(t.color.chrome).css;
  rejects(t, 'color.chrome', 'colors.chrome', 'FR-018');
});

test('FR-018: a duration, easing or shadow tailwind target needs a css name', () => {
  const t1 = sample();
  delete ext(t1.motion.longhand['tick-duration']).css;
  rejects(t1, 'motion.longhand.tick-duration', 'transitionDuration.tick', 'FR-018');

  const t2 = sample();
  delete ext(t2.motion.longhand['tick-ease']).css;
  rejects(t2, 'motion.longhand.tick-ease', 'transitionTimingFunction.tick', 'FR-018');

  const t3 = sample();
  delete ext(t3.shadow.glow).css;
  rejects(t3, 'shadow.glow', 'boxShadow.glow', 'FR-018');
});

test('FR-018: a typed duration with a transitionDuration target needs a css name too', () => {
  const t = sample();
  t.motion.timing.duration.$extensions = { [NS]: { tailwind: ['transitionDuration.typed'] } };
  rejects(t, 'motion.timing.duration', 'transitionDuration.typed', 'FR-018');
});

test('FR-018: fontFamily, dimension and letter-spacing targets need no css name', () => {
  const t = sample();
  t.radius.md = { $value: { value: 4, unit: 'px' }, $extensions: { [NS]: { tailwind: ['borderRadius.md'] } } };
  delete ext(t.font.sys).css;
  delete ext(t.font.tracking.wide).css;
  assert.doesNotThrow(() => validate(t));
});

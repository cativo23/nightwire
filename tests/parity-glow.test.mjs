import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseShadow, checkGlow, isStateSignalPath } from '../scripts/parity/lib/glow.mjs';

const rec = (over) => ({ page: 'p.html', state: 'operator|rm-off', path: 'html>body>span.led:nth-child(1)', prop: 'box-shadow', old: 'none', new: 'none', ...over });
const glow = (blur, colour = 'rgb(122, 237, 122)') => `${colour} 0px 0px ${blur}px 0px`;

test('parseShadow reads colour, offsets, blur, spread and inset per layer', () => {
  const layers = parseShadow('rgba(102, 153, 255, 0.25) 0px 0px 0px 1px, rgb(0, 0, 0) 0px 24px 64px 0px inset');
  assert.equal(layers.length, 2);
  assert.deepEqual(layers[0], { color: { r: 102, g: 153, b: 255, a: 0.25 }, x: 0, y: 0, blur: 0, spread: 1, inset: false });
  assert.deepEqual(layers[1], { color: { r: 0, g: 0, b: 0, a: 1 }, x: 0, y: 24, blur: 64, spread: 0, inset: true });
});

test('parseShadow reads a text-shadow (no spread) and fractional blur', () => {
  const [layer] = parseShadow('rgba(255, 255, 255, 0.5) 0px 0px 17.6px');
  assert.equal(layer.blur, 17.6);
  assert.equal(layer.spread, 0);
});

test('parseShadow gives no layers for none and <missing>', () => {
  assert.deepEqual(parseShadow('none'), []);
  assert.deepEqual(parseShadow('<missing>'), []);
});

test('operator: a smaller blur passes, and so does a glow that is gone', () => {
  const r = checkGlow([rec({ old: glow(8), new: glow(4) }), rec({ old: glow(8), new: 'none' })]);
  assert.equal(r.operator.checked, 2);
  assert.equal(r.operator.smaller, 1);
  assert.equal(r.operator.removed, 1);
  assert.equal(r.operator.violations.length, 0);
});

test('operator: an equal or larger blur is a violation, in none and operator states alike', () => {
  const r = checkGlow([
    rec({ old: glow(4), new: glow(4) }),
    rec({ state: 'none|rm-off', old: glow(4), new: glow(6) }),
  ]);
  assert.equal(r.operator.violations.length, 2);
});

test('operator: an unchanged glow is a violation too, because FR-013b says every remaining glow is weaker', () => {
  const r = checkGlow([rec({ old: glow(4), new: glow(4) })]);
  assert.equal(r.operator.checked, 1);
  assert.equal(r.operator.violations.length, 1);
});

test('operator: records at other intensities and unchanged records without a glow are not checked', () => {
  const ring = 'rgba(102, 153, 255, 0.18) 0px 0px 0px 3px';
  const r = checkGlow([rec({ old: glow(4), new: glow(4), state: 'archive|rm-off' }), rec({ old: ring, new: ring })]);
  assert.equal(r.operator.checked, 0);
});

test('operator: blur 0 on both sides is an exception, not a glow (rings, pressed state)', () => {
  const r = checkGlow([rec({ prop: 'box-shadow', old: 'rgba(0, 0, 0, 0) 0px 0px 0px 3px', new: 'rgb(0, 0, 0) 0px 0px 0px 2px inset' })]);
  assert.equal(r.operator['no-blur'], 1);
  assert.equal(r.operator.violations.length, 0);
});

test('operator: a new neutral black elevation shadow is an exception, however large', () => {
  const r = checkGlow([rec({ old: glow(40, 'rgba(102, 153, 255, 0.1)'), new: 'rgba(0, 0, 0, 0.7) 0px 24px 64px 0px' })]);
  assert.equal(r.operator.elevation, 1);
  assert.equal(r.operator.violations.length, 0);
});

test('operator: a coloured glow with no old counterpart is a violation unless it is the new active LED', () => {
  const unknown = checkGlow([rec({ path: 'html>body>div.card:nth-child(1)', old: 'none', new: glow(4, 'rgb(102, 153, 255)') })]);
  assert.equal(unknown.operator.violations.length, 1);
  const active = checkGlow([rec({ old: 'none', new: glow(4, 'rgb(102, 153, 255)') })]);
  assert.equal(active.operator['new-signal'], 1);
  assert.equal(active.operator.violations.length, 0);
});

test('operator: a plain or other-state .led that gains a glow fails; only the active LED colour (--nw-chrome) is new', () => {
  // parity paths carry no attributes, so the colour of the glow is what identifies data-state="active"
  const green = checkGlow([rec({ old: 'none', new: glow(4) })]);
  assert.equal(green.operator.violations.length, 1);
  const chromeMixed = checkGlow([rec({ old: 'none', new: `${glow(4, 'rgb(102, 153, 255)')}, ${glow(4)}` })]);
  assert.equal(chromeMixed.operator.violations.length, 1);
});

test('operator: layers are compared one by one, so a second layer that grows fails', () => {
  const r = checkGlow([rec({ prop: 'text-shadow', old: 'rgba(1, 2, 3, 0.5) 0px 0px 8px, rgba(1, 2, 3, 0.2) 0px 0px 16px', new: 'rgba(1, 2, 3, 0.33) 0px 0px 4px, rgba(1, 2, 3, 0.13) 0px 0px 16px' })]);
  assert.equal(r.operator.violations.length, 1);
});

test('archive: any coloured blur is a violation, wherever it comes from and changed or not', () => {
  const r = checkGlow([
    rec({ state: 'archive|rm-off', old: glow(4), new: glow(4), path: 'html>body>span.dot:nth-child(1)' }),
    rec({ state: 'archive|rm-off', old: glow(8), new: glow(0) }),
    rec({ state: 'archive|rm-on', old: 'none', new: 'rgba(0, 0, 0, 0.7) 0px 24px 64px 0px', path: 'html>body>div.modal:nth-child(1)' }),
  ]);
  assert.equal(r.archive.checked, 3);
  assert.equal(r.archive.violations.length, 1);
  assert.equal(r.archive.violations[0].path, 'html>body>span.dot:nth-child(1)');
});

test('combat: a blur above its operator blur fails unless the element is a state signal', () => {
  const card = 'html>body>div.card:nth-child(1)';
  const r = checkGlow([
    rec({ path: card, state: 'operator|rm-off', old: glow(8), new: glow(4) }),
    rec({ path: card, state: 'combat|rm-off', old: glow(8), new: glow(6) }),
    rec({ state: 'operator|rm-off', old: glow(8), new: glow(4) }),
    rec({ state: 'combat|rm-off', old: glow(17.6), new: glow(8) }),
  ]);
  assert.equal(r.combat.checked, 2);
  assert.equal(r.combat['state-signal'], 1);
  assert.equal(r.combat.violations.length, 1);
  assert.equal(r.combat.violations[0].path, card);
});

test('combat: a state signal must stay below its v2.1.0 combat blur', () => {
  const r = checkGlow([
    rec({ state: 'operator|rm-off', old: glow(8), new: glow(4) }),
    rec({ state: 'combat|rm-off', old: glow(6), new: glow(8) }),
  ]);
  assert.equal(r.combat.violations.length, 1);
});

test('combat: an element with no operator glow that glows at combat is compared against zero', () => {
  const r = checkGlow([rec({ path: 'html>body>div.card:nth-child(1)', state: 'combat|rm-off', old: 'none', new: glow(2) })]);
  assert.equal(r.combat.violations.length, 1);
});

test('combat: stateful sub-states pair with the same sub-state at operator', () => {
  const r = checkGlow([
    rec({ path: 'html>body>div.card:nth-child(1)', state: 'operator|rm-off|:hover@html>body>div.card:nth-child(1)', old: glow(8), new: glow(4) }),
    rec({ path: 'html>body>div.card:nth-child(1)', state: 'combat|rm-off|:hover@html>body>div.card:nth-child(1)', old: glow(8), new: glow(4) }),
  ]);
  assert.equal(r.combat.violations.length, 0);
  assert.equal(r.combat.checked, 1);
});

test('isStateSignalPath knows the elements that read the state-glow knobs, ignoring :nth-child', () => {
  for (const p of ['html>body>span.led:nth-child(2)', 'a>label.check>span.box:nth-child(1)::after', 'a>label.switch>span.track:nth-child(2)::after',
    'a>div.seg:nth-child(1)>button:nth-child(2)', 'a>div.steps>div.step:nth-child(3)', 'a>div.nw-progress:nth-child(1)>div.nw-progress-fill:nth-child(1)']) {
    assert.ok(isStateSignalPath(p), p);
  }
  for (const p of ['html>body>div.card:nth-child(1)', 'a>nav>div.nav-item:nth-child(1)::before', 'a>span.count:nth-child(1)']) {
    assert.ok(!isStateSignalPath(p), p);
  }
});

test('formatGlowReport prints one line per rule, groups exceptions, lists violations and fails on any', async () => {
  const { formatGlowReport } = await import('../scripts/parity/lib/glow.mjs');
  const ring = 'rgba(0, 0, 0, 0) 0px 0px 0px 3px';
  const r = checkGlow([
    rec({ path: 'a>input:nth-child(1)', old: ring, new: 'rgb(0, 0, 0) 0px 0px 0px 2px inset' }),
    rec({ path: 'a>input:nth-child(2)', old: ring, new: 'rgb(0, 0, 0) 0px 0px 0px 2px inset' }),
    rec({ state: 'archive|rm-off', path: 'a>span.dot:nth-child(1)', old: glow(4), new: glow(4) }),
  ]);
  const { lines, exitCode } = formatGlowReport(r);
  assert.equal(exitCode, 1);
  assert.match(lines[0], /^OPERATOR  checked=2  .*no-blur=2  .*violations=0$/);
  assert.match(lines[1], /^EXCEPTION  no-blur  2  .*\[input box-shadow\]$/);
  assert.match(lines.find((l) => l.startsWith('VIOLATION')), /^VIOLATION  archive  p\.html  \[archive\|rm-off\]  a>span\.dot:nth-child\(1\)  box-shadow/);
  assert.equal(lines.at(-1), 'RESULT  violations=1');
  assert.equal(formatGlowReport(checkGlow([])).exitCode, 0);
});

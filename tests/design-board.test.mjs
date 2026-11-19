import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseBoardArgs, outputName, parseForce, INTENSITIES } from '../scripts/design/lib/board.mjs';

const TMP = '/tmp-x';
const parse = (...argv) => parseBoardArgs(argv, { tmpdir: TMP });

test('by default both sides render: v2.1.0 as before, the working tree as after', () => {
  assert.deepEqual(parse(), {
    sheets: [{ label: 'before', spec: 'git:v2.1.0' }, { label: 'after', spec: 'nightwire.css' }],
    out: '/tmp-x/nightwire-board',
    page: 'docs/design/v3/board.html',
    width: 1280,
    wait: 0,
  });
});

test('--before and --after replace one side each and leave the other default', () => {
  assert.deepEqual(parse('--before', 'git:main').sheets, [{ label: 'before', spec: 'git:main' }, { label: 'after', spec: 'nightwire.css' }]);
  assert.deepEqual(parse('--after', 'dist/x.css').sheets, [{ label: 'before', spec: 'git:v2.1.0' }, { label: 'after', spec: 'dist/x.css' }]);
});

test('--css renders a single stylesheet labelled css', () => {
  assert.deepEqual(parse('--css', 'git:v2.0.1').sheets, [{ label: 'css', spec: 'git:v2.0.1' }]);
});

test('--css cannot be combined with --before or --after', () => {
  assert.throws(() => parse('--css', 'a.css', '--before', 'b.css'), /--css cannot be combined/);
  assert.throws(() => parse('--css', 'a.css', '--after', 'b.css'), /--css cannot be combined/);
});

test('--out, --page and --width override their defaults', () => {
  const r = parse('--out', 'shots', '--page', 'examples/html/x.html', '--width', '900');
  assert.equal(r.out, 'shots');
  assert.equal(r.page, 'examples/html/x.html');
  assert.equal(r.width, 900);
});

test('--wait is the number of milliseconds to let a page settle before the screenshots', () => {
  assert.equal(parse('--wait', '6000').wait, 6000);
  assert.equal(parse('--wait', '0').wait, 0);
});

test('--wait must be a non-negative integer', () => {
  for (const bad of ['-1', '1.5', 'soon', '']) assert.throws(() => parse(`--wait=${bad}`), /--wait must be a non-negative integer/);
});

test('--width must be a positive integer', () => {
  for (const bad of ['0', '-5', '12.5', 'wide', '']) assert.throws(() => parse(`--width=${bad}`), /--width must be a positive integer/);
});

test('unknown flags and stray positionals are usage errors', () => {
  assert.throws(() => parse('--nope'));
  assert.throws(() => parse('extra'));
});

test('the three intensities come in the order archive, operator, combat', () => {
  assert.deepEqual(INTENSITIES, ['archive', 'operator', 'combat']);
});

test('outputName is board-<label>-<intensity>.png', () => {
  assert.equal(outputName('before', 'archive'), 'board-before-archive.png');
  assert.equal(outputName('after', 'combat'), 'board-after-combat.png');
});

test('outputName rejects an unknown intensity and an unsafe label', () => {
  assert.throws(() => outputName('after', 'none'), /unknown intensity/);
  assert.throws(() => outputName('../x', 'combat'), /invalid label/);
  assert.throws(() => outputName('', 'combat'), /invalid label/);
});

test('parseForce splits on spaces and commas and maps to CDP pseudo-class names', () => {
  assert.deepEqual(parseForce(':hover'), ['hover']);
  assert.deepEqual(parseForce(':hover :focus-visible'), ['hover', 'focus-visible']);
  assert.deepEqual(parseForce(':focus,:active'), ['focus', 'active']);
  assert.deepEqual(parseForce('  :hover ,  :focus-within  '), ['hover', 'focus-within']);
});

test('parseForce drops duplicates and treats an empty value as no forced state', () => {
  assert.deepEqual(parseForce(':hover :hover'), ['hover']);
  assert.deepEqual(parseForce(''), []);
  assert.deepEqual(parseForce('   '), []);
});

test('parseForce rejects pseudo-classes it does not know, naming the offender', () => {
  assert.throws(() => parseForce(':hover :visited'), /unsupported pseudo-class ":visited"/);
  assert.throws(() => parseForce('hover'), /unsupported pseudo-class "hover"/);
});

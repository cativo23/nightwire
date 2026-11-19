import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateCategories, classify } from '../scripts/parity/lib/diff.mjs';
import { buildReport, buildJsonReport } from '../scripts/parity/lib/report.mjs';
import { loadControl, withControl, ControlError } from '../scripts/parity/lib/control.mjs';
import { COMPUTED_PROPERTIES } from '../scripts/parity/lib/computed-properties.mjs';

const SCRIPT = new URL('../scripts/parity/compare.mjs', import.meta.url).pathname;
const INVENTORY = new URL('../docs/design/v3/change-inventory.json', import.meta.url).pathname;
const run = (...args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });

const rec = (over = {}) => ({ page: 'p.html', state: 'operator|rm-off', path: 'html>body>div.panel:nth-child(1)>table', prop: 'width', old: '100px', new: '120px', ...over });
const cascade = (over = {}, match = {}) => ({
  id: 'panel-open-layout',
  kind: 'cascade',
  description: 'FR-038',
  match: { prop: '^(width|height)$', path: 'div\\.panel', page: '*.html', ...match },
  ...over,
});
const compile = (...cats) => validateCategories({ categories: cats }).categories;

// --- the property list ---------------------------------------------------------

test('the recorded property list holds the six cascade properties and many more', () => {
  for (const p of ['width', 'height', 'inline-size', 'block-size', 'transform-origin', 'perspective-origin', 'min-width', 'color']) {
    assert.ok(COMPUTED_PROPERTIES.includes(p), p);
  }
  assert.ok(COMPUTED_PROPERTIES.length > 300);
  assert.ok(COMPUTED_PROPERTIES.every((p) => !p.startsWith('--')));
});

// --- validateCategories: kind "cascade" -----------------------------------------

test('a cascade category with a size-only prop, a path and a page is accepted and keeps its kind', () => {
  const [c] = compile(cascade());
  assert.equal(c.kind, 'cascade');
  assert.ok(c.match.prop instanceof RegExp);
});

test('a cascade category needs no old or new, and may carry them', () => {
  assert.doesNotThrow(() => compile(cascade()));
  assert.doesNotThrow(() => compile(cascade({}, { old: '^\\d+px$', new: '^\\d+px$' })));
});

test('every one of the six size and origin properties is accepted, alone or together', () => {
  for (const prop of ['^width$', '^height$', '^inline-size$', '^block-size$', '^transform-origin$', '^perspective-origin$',
    '^(width|height|inline-size|block-size|transform-origin|perspective-origin)$']) {
    assert.doesNotThrow(() => compile(cascade({}, { prop })), prop);
  }
});

test('a cascade category without a page is rejected and names the category and page', () => {
  const c = cascade();
  delete c.match.page;
  assert.throws(() => compile(c), /panel-open-layout.*match\.page/i);
});

test('a cascade category without a path is rejected and names the category and path', () => {
  const c = cascade();
  delete c.match.path;
  assert.throws(() => compile(c), /panel-open-layout.*match\.path/i);
});

test('a cascade category whose prop matches anything outside the six is rejected, naming the property it caught', () => {
  assert.throws(() => compile(cascade({}, { prop: '^color$' })), /panel-open-layout.*color/);
  assert.throws(() => compile(cascade({}, { prop: 'width' })), /panel-open-layout.*also matches "[a-z-]*width"/);
  assert.throws(() => compile(cascade({}, { prop: '^width|color$' })), /panel-open-layout.*[a-z-]*color/);
  assert.throws(() => compile(cascade({}, { prop: '^(width|padding-top)$' })), /padding-top/);
});

test('a cascade prop of .* (or any pattern that reaches custom properties or element presence) is rejected', () => {
  for (const prop of ['.*', '.', '^', '^-', '^--', '--', 'size', '\\(element\\)']) {
    assert.throws(() => compile(cascade({}, { prop })), /panel-open-layout/, prop);
  }
});

test('a cascade prop that matches none of the six is rejected as dead', () => {
  assert.throws(() => compile(cascade({}, { prop: '^nonexistent$' })), /panel-open-layout.*none of/i);
});

test('an unknown kind is rejected and names the category and the kind', () => {
  assert.throws(() => compile(cascade({ kind: 'sloppy' })), /panel-open-layout.*kind.*sloppy/i);
  assert.throws(() => compile(cascade({ kind: 42 })), /panel-open-layout.*kind/i);
  assert.throws(() => compile(cascade({ kind: '' })), /panel-open-layout.*kind/i);
});

test('without a kind the existing rules stay: a colour category needs only match.prop', () => {
  const [c] = compile({ id: 'colours', match: { prop: '^color$' } });
  assert.equal(c.kind, undefined);
  assert.equal('kind' in c, false);
});

// --- classify with control -----------------------------------------------------

test('classify without control matches cascade categories like any other', () => {
  const categories = compile(cascade());
  const { counts, unexpected } = classify([rec()], categories);
  assert.equal(counts.get('panel-open-layout'), 1);
  assert.deepEqual(unexpected, []);
  assert.deepEqual(classify([rec()], categories, { control: false }).counts.get('panel-open-layout'), 1);
});

test('classify with control skips cascade categories: nothing matches them and they leave no count', () => {
  const categories = compile(cascade(), { id: 'colours', match: { prop: '^color$' } });
  const colour = rec({ prop: 'color', old: 'red', new: 'blue' });
  const { counts, unexpected } = classify([rec(), colour], categories, { control: true });
  assert.deepEqual([...counts], [['colours', 1]]);
  assert.deepEqual(unexpected, [rec()]);
});

test('classify with control still lets a later narrow category claim what a cascade category would have', () => {
  const categories = compile(cascade(), { id: 'narrow', match: { prop: '^width$' } });
  const { counts, unexpected } = classify([rec()], categories, { control: true });
  assert.deepEqual([...counts], [['narrow', 1]]);
  assert.deepEqual(unexpected, []);
});

// --- report and JSON ----------------------------------------------------------

const COVERAGE = 'COVERAGE  classes=2/2  attr-states=1/1  uncovered=none';

test('buildReport with control leaves cascade categories out of the CATEGORY lines and out of the matches', () => {
  const categories = compile(cascade(), { id: 'colours', match: { prop: '^color$' } });
  const { lines, exitCode } = buildReport({ diffs: [rec()], categories, control: true, maxLines: 200, coverageLine: COVERAGE, uncovered: 0 });
  assert.ok(lines.some((l) => l.startsWith('DIFF  p.html')));
  assert.deepEqual(lines.filter((l) => l.startsWith('CATEGORY')), ['CATEGORY  colours  0']);
  assert.equal(lines.at(-1), 'RESULT  differences=1  unexpected=1');
  assert.equal(exitCode, 1);
});

test('buildReport with control passes when only cascade-explained differences are gone', () => {
  const categories = compile(cascade());
  const { exitCode, lines } = buildReport({ diffs: [], categories, control: true, maxLines: 200, coverageLine: COVERAGE, uncovered: 0 });
  assert.equal(exitCode, 0);
  assert.equal(lines.at(-1), 'RESULT  differences=0  unexpected=0');
});

test('buildReport without control is unchanged by the option being absent', () => {
  const categories = compile(cascade());
  const { lines, exitCode } = buildReport({ diffs: [rec()], categories, maxLines: 200, coverageLine: COVERAGE, uncovered: 0 });
  assert.deepEqual(lines.filter((l) => l.startsWith('CATEGORY')), ['CATEGORY  panel-open-layout  1']);
  assert.equal(exitCode, 0);
});

test('buildJsonReport records control in meta, null when there is none, and tags diffs without cascade categories under control', () => {
  const categories = compile(cascade());
  const base = { oldSpec: 'git:v2.1.0', newSpec: 'nightwire.css', pages: ['p.html'], states: ['none|rm-off'], diffs: [rec()], shadows: [], categories };
  const plain = buildJsonReport(base);
  assert.equal(plain.meta.control, null);
  assert.equal(plain.diffs[0].category, 'panel-open-layout');
  const controlled = buildJsonReport({ ...base, control: 'control.css' });
  assert.equal(controlled.meta.control, 'control.css');
  assert.equal(controlled.diffs[0].category, null);
  assert.equal(controlled.meta.unexpected, 1);
});

// --- control helpers -----------------------------------------------------------

function withTmp(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'nw-control-'));
  try { return fn(dir); } finally { rmSync(dir, { recursive: true, force: true }); }
}

test('loadControl reads the sheet, relative to the root, and returns its path and text', () => {
  withTmp((dir) => {
    writeFileSync(join(dir, 'control.css'), '.panel{width:1px}');
    assert.deepEqual(loadControl('control.css', { expect: true, root: dir }), { path: 'control.css', css: '.panel{width:1px}' });
    assert.equal(loadControl(join(dir, 'control.css'), { expect: true, root: '/nonexistent' }).css, '.panel{width:1px}');
  });
});

test('loadControl returns null when the flag was not given', () => {
  assert.equal(loadControl(undefined, { expect: false, root: '/' }), null);
  assert.equal(loadControl(undefined, { expect: true, root: '/' }), null);
});

test('loadControl rejects --control without --expect and a sheet that is missing, with a message naming --control', () => {
  withTmp((dir) => {
    writeFileSync(join(dir, 'control.css'), '');
    assert.throws(() => loadControl('control.css', { expect: false, root: dir }), (e) => e instanceof ControlError && /--control.*--expect/.test(e.message));
    assert.throws(() => loadControl('nope.css', { expect: true, root: dir }), (e) => e instanceof ControlError && /--control.*nope\.css/.test(e.message));
    assert.throws(() => loadControl(dir, { expect: true, root: dir }), ControlError);
  });
});

test('withControl appends the control sheet after the new one so it wins at equal specificity', () => {
  assert.equal(withControl('.a{}', '.b{}'), '.a{}\n.b{}');
  assert.equal(withControl('.a{}', ''), '.a{}\n');
});

// --- the CLI flag (no browser: these all fail before Chrome starts) ---------------

test('--control without --expect exits 2 with a usage message', () => {
  withTmp((dir) => {
    writeFileSync(join(dir, 'control.css'), '');
    const r = run('--control', join(dir, 'control.css'));
    assert.equal(r.status, 2, r.stdout + r.stderr);
    assert.match(r.stderr, /--control requires --expect/);
  });
});

test('--control with a missing file exits 2 and names the file', () => {
  const r = run('--expect', INVENTORY, '--control', '/nonexistent/control.css');
  assert.equal(r.status, 2, r.stdout + r.stderr);
  assert.match(r.stderr, /--control.*\/nonexistent\/control\.css/);
});

test('the usage text documents --control', () => {
  const r = run('--bogus-flag');
  assert.equal(r.status, 2);
  assert.match(r.stderr, /--control <css>/);
});

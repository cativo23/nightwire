import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateCategories, classify, CASCADE_PROPS } from '../scripts/parity/lib/diff.mjs';
import { buildReport, buildJsonReport } from '../scripts/parity/lib/report.mjs';
import { loadControl, withControl, ControlError } from '../scripts/parity/lib/control.mjs';

const SCRIPT = new URL('../scripts/parity/compare.mjs', import.meta.url).pathname;
const INVENTORY = new URL('../docs/design/v3/change-inventory.json', import.meta.url).pathname;
const read = (rel) => readFileSync(new URL('../' + rel, import.meta.url), 'utf8');
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

// FR-038 (amended): the geometric properties the browser resolves from layout, and nothing else.
const RESOLVED = ['top', 'right', 'bottom', 'left', 'inset-block-start', 'inset-block-end', 'inset-inline-start', 'inset-inline-end',
  'margin-left', 'margin-inline-start', 'grid-template-columns', 'grid-template-rows', 'aspect-ratio'];

test('the resolved offsets, horizontal margins, grid tracks and aspect ratio are accepted, alone or together', () => {
  for (const name of RESOLVED) assert.doesNotThrow(() => compile(cascade({}, { prop: `^${name}$` })), name);
  assert.doesNotThrow(() => compile(cascade({}, { prop: `^(${RESOLVED.join('|')})$` })));
  assert.doesNotThrow(() => compile(cascade({}, { prop: '^(?:top|right|bottom|left|width|height)$' })));
  assert.deepEqual([...CASCADE_PROPS].sort(), [...RESOLVED, 'width', 'height', 'inline-size', 'block-size', 'transform-origin', 'perspective-origin'].sort());
});

test('what the browser does not resolve from layout is still rejected: colours, fonts, padding, border widths, other margins, shorthands', () => {
  for (const name of ['color', 'background-color', 'font-size', 'line-height', 'letter-spacing', 'padding-top', 'padding-left', 'border-top-width',
    'border-bottom-width', 'margin-right', 'margin-top', 'margin-inline-end', 'margin', 'inset', 'grid-template', 'grid-template-areas', 'min-width',
    'max-width', 'order', 'gap', 'display', 'translate', 'z-index', 'flex-basis']) {
    assert.throws(() => compile(cascade({}, { prop: `^${name}$` })), /panel-open-layout.*match\.prop/, name);
    assert.throws(() => compile(cascade({}, { prop: `^(width|${name})$` })), /panel-open-layout.*match\.prop/, `(width|${name})`);
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

test('a cascade prop is a closed form: ^name$, ^(name|name)$ or ^(?:name|name)$ over the six names, nothing else', () => {
  assert.doesNotThrow(() => compile(cascade({}, { prop: '^(?:width|height)$' })));
  const rejected = [
    '^color$', 'width', '^width', 'width$', '^width|color$', '^(width|padding-top)$', '^min-width$', '^(width|)$', '^$',
    '^(width|height)$|^$', '^(width|--nw-glow)$', '^width$|^--nw-color$', '^(width|nw-pulse)$', '^width$|^some-future-prop$',
    '^width$|^height$', '^wid.h$', '^widt?h$', '^(width|height)+$', '^(width|height)*$', '^(?=width)width$', '^(?!color)width$',
    '^[wh]idth$', '^width\\b$', '^(width)(height)$', '^((width))$', '^(width|height)$ ', ' ^width$',
    '.*', '.', '^', '^-', '^--', '--', 'size', '\\(element\\)', '^nonexistent$',
  ];
  for (const prop of rejected) {
    assert.throws(() => compile(cascade({}, { prop })), /panel-open-layout.*match\.prop/, prop);
  }
});

test('the closed-form rejection names the allowed shape', () => {
  assert.throws(() => compile(cascade({}, { prop: '^color$' })), /panel-open-layout.*width, height, inline-size, block-size, transform-origin, perspective-origin/);
});

test('a cascade path that can match :root or an @keyframes record is rejected', () => {
  for (const path of ['.', ':root', '^:root$', 'root', '.*', '@keyframes', '^@keyframes$', 'keyframes', '^(div|:root)$']) {
    assert.throws(() => compile(cascade({}, { path })), /panel-open-layout.*match\.path/, path);
  }
  for (const path of ['div\\.panel', 'html>body>.*div\\.panel', 'kv-row', '\\.card-header']) {
    assert.doesNotThrow(() => compile(cascade({}, { path })), path);
  }
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

// --- S1: a run with cascade categories says it is not proven without its control run ----------

test('a normal run with active cascade categories prints one CASCADE hint before RESULT and still exits 0', () => {
  const categories = compile(cascade(), cascade({ id: 'second-open-layout' }), { id: 'colours', match: { prop: '^color$' } });
  const { lines, exitCode } = buildReport({ diffs: [rec()], categories, maxLines: 200, coverageLine: COVERAGE, uncovered: 0 });
  const hint = lines.filter((l) => l.startsWith('CASCADE  '));
  assert.deepEqual(hint, ['CASCADE  2 categories active, not proven by this run: also run --control <css>']);
  assert.equal(lines.at(-2), hint[0]);
  assert.equal(lines.at(-1), 'RESULT  differences=1  unexpected=0');
  assert.equal(exitCode, 0);
});

test('the CASCADE hint names the control sheet when the category file declares one, and says "1 category" for one', () => {
  const categories = compile(cascade());
  const { lines } = buildReport({ diffs: [], categories, controlSheet: 'docs/design/v3/us5-layout-control.css', maxLines: 200, coverageLine: COVERAGE, uncovered: 0 });
  assert.ok(lines.includes('CASCADE  1 category active, not proven by this run: also run --control docs/design/v3/us5-layout-control.css'));
});

test('no CASCADE hint under --control, without cascade categories, or without --expect', () => {
  const categories = compile(cascade());
  const hint = (input) => buildReport({ maxLines: 200, coverageLine: COVERAGE, uncovered: 0, ...input }).lines.some((l) => l.startsWith('CASCADE  '));
  assert.equal(hint({ diffs: [rec()], categories, control: true }), false);
  assert.equal(hint({ diffs: [rec()], categories: compile({ id: 'colours', match: { prop: '^color$' } }) }), false);
  assert.equal(hint({ diffs: [rec()] }), false);
});

test('validateCategories passes an optional top-level control sheet through and rejects a non-string one', () => {
  assert.equal(validateCategories({ control: 'a/control.css', categories: [] }).control, 'a/control.css');
  assert.equal(validateCategories({ categories: [] }).control, undefined);
  assert.throws(() => validateCategories({ control: 3, categories: [] }), /control/);
  assert.throws(() => validateCategories({ control: '', categories: [] }), /control/);
});

test('the change inventory names the control sheet that proves its cascade categories, and the file exists', () => {
  const file = JSON.parse(read('docs/design/v3/change-inventory.json'));
  assert.equal(file.control, 'docs/design/v3/us5-layout-control.css');
  assert.ok(existsSync(new URL('../' + file.control, import.meta.url)));
});

// --- S2: a cascade category lists only the properties it was seen to explain ----------------

test('classify reports the properties each active category explained, first match only', () => {
  const categories = compile(cascade({ id: 'first' }, { prop: '^(width|height)$' }), cascade({ id: 'second' }, { prop: '^(width|height|top)$' }));
  const { used } = classify([rec(), rec({ prop: 'top' })], categories);
  assert.deepEqual([...used.get('first')], ['width']);
  assert.deepEqual([...used.get('second')], ['top']);
});

test('CASCADE-UNUSED lists the properties a cascade category allows and never explained, and fails the run', () => {
  const categories = compile(cascade({}, { prop: '^(width|height|top)$' }));
  const { lines, exitCode } = buildReport({ diffs: [rec()], categories, pages: ['p.html'], maxLines: 200, coverageLine: COVERAGE, uncovered: 0 });
  assert.ok(lines.includes('CASCADE-UNUSED  panel-open-layout  height top'), lines.join('\n'));
  assert.equal(lines.at(-1), 'RESULT  differences=1  unexpected=0');
  assert.equal(exitCode, 1);
});

test('CASCADE-UNUSED stays quiet when every listed property explained something, and for a category whose page was not in the run', () => {
  const used = compile(cascade({}, { prop: '^(width|top)$' }));
  const a = buildReport({ diffs: [rec(), rec({ prop: 'top' })], categories: used, pages: ['p.html'], maxLines: 200, coverageLine: COVERAGE, uncovered: 0 });
  assert.equal(a.lines.some((l) => l.startsWith('CASCADE-UNUSED')), false);
  assert.equal(a.exitCode, 0);
  const elsewhere = compile(cascade({}, { prop: '^(width|top)$', page: 'other/*.html' }));
  const b = buildReport({ diffs: [], categories: elsewhere, pages: ['p.html'], maxLines: 200, coverageLine: COVERAGE, uncovered: 0 });
  assert.equal(b.lines.some((l) => l.startsWith('CASCADE-UNUSED')), false);
  assert.equal(b.exitCode, 0);
});

test('CASCADE-UNUSED is not checked under --control (cascade categories are ignored there) or when no pages are given', () => {
  const categories = compile(cascade({}, { prop: '^(width|height|top)$' }));
  const c = buildReport({ diffs: [], categories, pages: ['p.html'], control: true, maxLines: 200, coverageLine: COVERAGE, uncovered: 0 });
  assert.equal(c.lines.some((l) => l.startsWith('CASCADE-UNUSED')), false);
  const d = buildReport({ diffs: [], categories, maxLines: 200, coverageLine: COVERAGE, uncovered: 0 });
  assert.equal(d.lines.some((l) => l.startsWith('CASCADE-UNUSED')), false);
});

test('buildJsonReport records control in meta, null when there is none, and tags diffs without cascade categories under control', () => {
  const categories = compile(cascade());
  const base = { oldSpec: 'git:v2.1.0', newSpec: 'nightwire.css', pages: ['p.html'], states: ['none|rm-off'], diffs: [rec()], shadows: [], categories };
  const plain = buildJsonReport(base);
  assert.equal(plain.meta.control, null);
  assert.equal(plain.diffs[0].category, 'panel-open-layout');
  const nullControl = buildJsonReport({ ...base, control: null });
  assert.equal(nullControl.meta.control, null);
  assert.equal(nullControl.diffs[0].category, 'panel-open-layout');
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

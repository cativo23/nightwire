import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collectShadows } from '../scripts/parity/lib/shadows.mjs';
import { buildJsonReport } from '../scripts/parity/lib/report.mjs';
import { validateCategories } from '../scripts/parity/lib/diff.mjs';

const SEP = '\u0001';
const PROPS = ['box-shadow', 'color', 'text-shadow'];
const row = (box, color, text) => [box, color, text].join(SEP);
const caps = (state, rows) => [{ state, rows }];

test('collectShadows keeps elements whose shadow is not none on either side, changed or not', () => {
  const oldCaps = caps('operator|rm-off', [
    ['a', row('none', 'red', 'none')],
    ['b', row('rgb(0, 0, 0) 0px 0px 8px 0px', 'red', 'none')],
    ['c', row('rgb(0, 0, 0) 0px 0px 8px 0px', 'red', 'none')],
    ['d', row('none', 'red', 'none')],
  ]);
  const newCaps = caps('operator|rm-off', [
    ['a', row('none', 'blue', 'none')],
    ['b', row('rgb(0, 0, 0) 0px 0px 4px 0px', 'red', 'none')],
    ['c', row('rgb(0, 0, 0) 0px 0px 8px 0px', 'red', 'none')],
    ['d', row('none', 'red', 'rgb(1, 2, 3) 0px 0px 2px')],
  ]);
  assert.deepEqual(collectShadows('p.html', oldCaps, newCaps, PROPS, SEP), [
    { page: 'p.html', state: 'operator|rm-off', path: 'b', prop: 'box-shadow', old: 'rgb(0, 0, 0) 0px 0px 8px 0px', new: 'rgb(0, 0, 0) 0px 0px 4px 0px' },
    { page: 'p.html', state: 'operator|rm-off', path: 'c', prop: 'box-shadow', old: 'rgb(0, 0, 0) 0px 0px 8px 0px', new: 'rgb(0, 0, 0) 0px 0px 8px 0px' },
    { page: 'p.html', state: 'operator|rm-off', path: 'd', prop: 'text-shadow', old: 'none', new: 'rgb(1, 2, 3) 0px 0px 2px' },
  ]);
});

test('collectShadows reports an element present on one side only as <missing> on the other', () => {
  const oldCaps = caps('none|rm-off', [['x', row('rgb(0, 0, 0) 0px 0px 8px 0px', 'red', 'none')]]);
  const newCaps = caps('none|rm-off', []);
  assert.deepEqual(collectShadows('p.html', oldCaps, newCaps, PROPS, SEP), [
    { page: 'p.html', state: 'none|rm-off', path: 'x', prop: 'box-shadow', old: 'rgb(0, 0, 0) 0px 0px 8px 0px', new: '<missing>' },
  ]);
});

test('collectShadows skips :root custom-property rows and @keyframes rows', () => {
  const rows = [[`:root${SEP}--nw-glow`, '1'], [`@keyframes${SEP}pulse`, '@keyframes pulse {}']];
  assert.deepEqual(collectShadows('p.html', caps('s', rows), caps('s', rows), PROPS, SEP), []);
});

test('buildJsonReport lists every difference with its category (null when none) next to the shadows', () => {
  const { categories } = validateCategories({ categories: [{ id: 'colours', match: { prop: '^color$' } }] });
  const diffs = [
    { page: 'p.html', state: 'none|rm-off', path: 'a', prop: 'color', old: 'red', new: 'blue' },
    { page: 'p.html', state: 'none|rm-off', path: 'a', prop: 'width', old: '1px', new: '2px' },
  ];
  const shadows = [{ page: 'p.html', state: 'none|rm-off', path: 'a', prop: 'box-shadow', old: 'none', new: 'x' }];
  const json = buildJsonReport({ oldSpec: 'git:v2.1.0', newSpec: 'nightwire.css', pages: ['p.html'], states: ['none|rm-off'], diffs, shadows, categories });
  assert.deepEqual(json.meta, { old: 'git:v2.1.0', new: 'nightwire.css', pages: ['p.html'], states: ['none|rm-off'], differences: 2, unexpected: 1 });
  assert.deepEqual(json.diffs.map((d) => d.category), ['colours', null]);
  assert.deepEqual(json.shadows, shadows);
});

test('buildJsonReport without categories gives every difference a null category and no unexpected count', () => {
  const diffs = [{ page: 'p.html', state: 's', path: 'a', prop: 'color', old: 'red', new: 'blue' }];
  const json = buildJsonReport({ oldSpec: 'a', newSpec: 'b', pages: [], states: [], diffs, shadows: [] });
  assert.equal(json.diffs[0].category, null);
  assert.equal(json.meta.unexpected, undefined);
  assert.equal(json.meta.differences, 1);
});

test('writeJsonReport writes the JSON to the file', async () => {
  const { mkdtempSync, readFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { writeJsonReport } = await import('../scripts/parity/lib/report.mjs');
  const dir = mkdtempSync(join(tmpdir(), 'nw-json-'));
  try {
    writeJsonReport(join(dir, 'out.json'), { meta: { differences: 0 }, diffs: [], shadows: [] });
    assert.deepEqual(JSON.parse(readFileSync(join(dir, 'out.json'), 'utf8')).meta, { differences: 0 });
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('writeJsonReport turns a write failure into an error that names the file and the cause', async () => {
  const { writeJsonReport } = await import('../scripts/parity/lib/report.mjs');
  assert.throws(
    () => writeJsonReport('/nonexistent-dir-nw/out.json', {}),
    (err) => /cannot write --json file \/nonexistent-dir-nw\/out\.json: .*ENOENT/.test(err.message),
  );
});

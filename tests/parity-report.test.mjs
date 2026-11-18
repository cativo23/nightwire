import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildReport } from '../scripts/parity/lib/report.mjs';
import { validateCategories } from '../scripts/parity/lib/diff.mjs';

const rec = (over = {}) => ({ page: 'p.html', state: 'none|rm-off', path: 'html>body', prop: 'color', old: 'red', new: 'blue', ...over });
const line = (r) => `DIFF  ${r.page}  [${r.state}]  ${r.path}  ${r.prop}  ${r.old} → ${r.new}`;
const compiled = (...cats) => validateCategories({ categories: cats }).categories;
const COVERAGE = 'COVERAGE  classes=2/2  attr-states=1/1  uncovered=none';

test('without categories the report is the classic one: sorted DIFF lines, COVERAGE, RESULT', () => {
  const b = rec({ prop: 'width' });
  const a = rec({ prop: 'color' });
  const { lines, exitCode } = buildReport({ diffs: [b, a], maxLines: 200, coverageLine: COVERAGE, uncovered: 0 });
  assert.deepEqual(lines, [line(a), line(b), COVERAGE, 'RESULT  differences=2']);
  assert.equal(exitCode, 1);
});

test('without categories and without differences the report passes', () => {
  const { lines, exitCode } = buildReport({ diffs: [], maxLines: 200, coverageLine: COVERAGE, uncovered: 0 });
  assert.deepEqual(lines, [COVERAGE, 'RESULT  differences=0']);
  assert.equal(exitCode, 0);
});

test('without categories --max-lines truncates and says how many lines were left out', () => {
  const diffs = ['a', 'b', 'c'].map((prop) => rec({ prop }));
  const { lines } = buildReport({ diffs, maxLines: 1, coverageLine: COVERAGE, uncovered: 0 });
  assert.deepEqual(lines, [line(diffs[0]), '…  2 more DIFF lines (raise --max-lines to see them)', COVERAGE, 'RESULT  differences=3']);
});

test('without categories uncovered classes fail an otherwise clean run', () => {
  const { exitCode } = buildReport({ diffs: [], maxLines: 200, coverageLine: COVERAGE, uncovered: 1 });
  assert.equal(exitCode, 1);
});

test('with categories only unexpected DIFF lines print, then one CATEGORY line per category in file order, COVERAGE, RESULT', () => {
  const categories = compiled(
    { id: 'colors', match: { prop: '^color$' } },
    { id: 'unused', match: { prop: '^height$' } },
  );
  const stray = rec({ prop: 'width' });
  const { lines, exitCode } = buildReport({
    diffs: [stray, rec(), rec({ path: 'x' })], categories, maxLines: 200, coverageLine: COVERAGE, uncovered: 0,
  });
  assert.deepEqual(lines, [
    line(stray),
    'CATEGORY  colors  2',
    'CATEGORY  unused  0',
    COVERAGE,
    'RESULT  differences=3  unexpected=1',
  ]);
  assert.equal(exitCode, 1);
});

test('with categories that explain every difference and full coverage the run passes', () => {
  const categories = compiled({ id: 'colors', match: { prop: '^color$' } });
  const { lines, exitCode } = buildReport({ diffs: [rec()], categories, maxLines: 200, coverageLine: COVERAGE, uncovered: 0 });
  assert.deepEqual(lines, ['CATEGORY  colors  1', COVERAGE, 'RESULT  differences=1  unexpected=0']);
  assert.equal(exitCode, 0);
});

test('with an empty category list and no differences the run passes with unexpected=0', () => {
  const { lines, exitCode } = buildReport({ diffs: [], categories: [], maxLines: 200, coverageLine: COVERAGE, uncovered: 0 });
  assert.deepEqual(lines, [COVERAGE, 'RESULT  differences=0  unexpected=0']);
  assert.equal(exitCode, 0);
});

test('with categories, uncovered classes still fail when unexpected=0', () => {
  const categories = compiled({ id: 'colors', match: { prop: '^color$' } });
  const { exitCode } = buildReport({ diffs: [rec()], categories, maxLines: 200, coverageLine: COVERAGE, uncovered: 2 });
  assert.equal(exitCode, 1);
});

test('with categories --max-lines applies to the unexpected DIFF lines only', () => {
  const categories = compiled({ id: 'colors', match: { prop: '^color$' } });
  const strays = ['a', 'b', 'c'].map((prop) => rec({ prop }));
  const { lines } = buildReport({ diffs: [rec(), ...strays], categories, maxLines: 2, coverageLine: COVERAGE, uncovered: 0 });
  assert.deepEqual(lines, [
    line(strays[0]), line(strays[1]),
    '…  1 more DIFF lines (raise --max-lines to see them)',
    'CATEGORY  colors  1',
    COVERAGE,
    'RESULT  differences=4  unexpected=3',
  ]);
});

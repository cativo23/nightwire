import { test } from 'node:test';
import assert from 'node:assert/strict';
import { snapshotKey, diffSnapshots } from '../scripts/parity/lib/diff.mjs';

const k = (page, state, path, prop) => snapshotKey({ page, state, path, prop });

test('identical snapshots produce no lines', () => {
  const a = new Map([[k('p.html', 'none|rm-off', 'html>body', 'color'), 'rgb(0, 0, 0)']]);
  const b = new Map(a);
  assert.deepEqual(diffSnapshots(a, b), []);
});

test('a changed value produces one DIFF line in the contract format', () => {
  const a = new Map([[k('examples/html/workshop.html', 'archive|rm-off|:hover', 'html>body>.tag::before', 'color'), 'rgb(102, 153, 255)']]);
  const b = new Map([[k('examples/html/workshop.html', 'archive|rm-off|:hover', 'html>body>.tag::before', 'color'), 'rgb(68, 119, 204)']]);
  assert.deepEqual(diffSnapshots(a, b), [
    'DIFF  examples/html/workshop.html  [archive|rm-off|:hover]  html>body>.tag::before  color  rgb(102, 153, 255) → rgb(68, 119, 204)',
  ]);
});

test('keys present on only one side are differences', () => {
  const a = new Map([[k('p', 's', 'x', 'color'), 'red']]);
  const b = new Map([[k('p', 's', 'x', 'width'), '1px']]);
  assert.deepEqual(diffSnapshots(a, b), [
    'DIFF  p  [s]  x  color  red → <missing>',
    'DIFF  p  [s]  x  width  <missing> → 1px',
  ]);
});

test('output is sorted for deterministic reports', () => {
  const a = new Map([[k('b', 's', 'x', 'p'), '1'], [k('a', 's', 'x', 'p'), '1']]);
  const b = new Map([[k('b', 's', 'x', 'p'), '2'], [k('a', 's', 'x', 'p'), '2']]);
  const lines = diffSnapshots(a, b);
  assert.ok(lines[0].startsWith('DIFF  a'));
  assert.ok(lines[1].startsWith('DIFF  b'));
});

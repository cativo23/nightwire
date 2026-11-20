import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hiddenWindow, hiddenOnTime } from '../scripts/browsers/lib/tolerance.mjs';

test('visibility must flip to hidden within [exit - 25, exit + 60] ms', () => {
  assert.deepEqual(hiddenWindow(262.5), { min: 237.5, max: 322.5 });
  assert.deepEqual(hiddenWindow(112.5), { min: 87.5, max: 172.5 });
});

test('the window follows the exit duration it is given', () => {
  assert.deepEqual(hiddenWindow(400), { min: 375, max: 460 });
});

test('both ends of the window are accepted', () => {
  assert.equal(hiddenOnTime(237.5, 262.5), true);
  assert.equal(hiddenOnTime(322.5, 262.5), true);
});

test('outside the window is rejected', () => {
  assert.equal(hiddenOnTime(237.4, 262.5), false);
  assert.equal(hiddenOnTime(322.6, 262.5), false);
});

test('never hidden (null) is rejected', () => {
  assert.equal(hiddenOnTime(null, 262.5), false);
});

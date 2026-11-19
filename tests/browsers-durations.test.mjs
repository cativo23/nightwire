import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxDurationMs, maxOfLists } from '../scripts/browsers/lib/durations.mjs';

test('takes the longest entry of a computed transition-duration list', () => {
  assert.equal(maxDurationMs('0.35s, 0s'), 350);
  assert.equal(maxDurationMs('0s, 0.2625s'), 262.5);
});

test('a single value is its own maximum', () => {
  assert.equal(maxDurationMs('0.15s'), 150);
  assert.equal(maxDurationMs('0s'), 0);
});

test('reads milliseconds as well as seconds', () => {
  assert.equal(maxDurationMs('150ms, 0s'), 150);
  assert.equal(maxDurationMs('0.1s, 120ms'), 120);
});

test('avoids floating point noise from the seconds conversion', () => {
  assert.equal(maxDurationMs('0.1125s'), 112.5);
  assert.equal(maxDurationMs('0.3s'), 300);
});

test('rejects text that is not a duration list', () => {
  assert.throws(() => maxDurationMs(''), /duration/);
  assert.throws(() => maxDurationMs('none'), /duration/);
  assert.throws(() => maxDurationMs('1x'), /duration/);
});

test('maxOfLists takes the longest across several elements', () => {
  assert.equal(maxOfLists(['0.35s, 0s', '0.2s']), 350);
  assert.equal(maxOfLists(['0s', '0.15s']), 150);
});

test('maxOfLists rejects an empty set', () => {
  assert.throws(() => maxOfLists([]), /duration/);
});

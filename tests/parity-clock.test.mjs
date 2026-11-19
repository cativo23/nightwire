import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startPausedClock, PAUSED_AT_OFFSET_MS } from '../scripts/parity/lib/clock.mjs';

const FIXED = new Date('2026-01-01T00:00:00Z');

function recordingClock() {
  const calls = [];
  return { calls, pauseAt: async (t) => { calls.push(['pauseAt', t]); }, install: async (o) => { calls.push(['install', o]); } };
}

test('pauses the page clock once, at the fixed time plus the offset', async () => {
  const clock = recordingClock();
  await startPausedClock(clock, FIXED);
  assert.equal(clock.calls.length, 1);
  assert.equal(clock.calls[0][0], 'pauseAt');
  assert.equal(clock.calls[0][1].getTime(), FIXED.getTime() + PAUSED_AT_OFFSET_MS);
});

test('never installs a running clock first: wall time between two calls must not matter', async () => {
  // install() lets the fake clock tick in real time, and pauseAt() then throws "Cannot fast-forward
  // to the past" when more than the offset has elapsed (a loaded host). It also leaves
  // performance.now() equal to the elapsed wall time, which shifts requestAnimationFrame phase.
  const clock = recordingClock();
  await startPausedClock(clock, FIXED);
  assert.ok(!clock.calls.some(([name]) => name === 'install'));
});

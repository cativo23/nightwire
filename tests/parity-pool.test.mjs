import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runPool } from '../scripts/parity/lib/pool.mjs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test('results come back in input order even when workers finish out of order', async () => {
  const delays = [30, 5, 20, 1, 15];
  const out = await runPool(delays, 3, async (ms, i) => { await sleep(ms); return `${i}:${ms}`; });
  assert.deepEqual(out, ['0:30', '1:5', '2:20', '3:1', '4:15']);
});

test('never runs more than `limit` workers at once, and does use the whole limit', async () => {
  let running = 0;
  let max = 0;
  await runPool(Array.from({ length: 12 }, (_, i) => i), 4, async () => {
    running++;
    max = Math.max(max, running);
    await sleep(5);
    running--;
  });
  assert.equal(max, 4);
});

test('limit 1 is sequential: each worker starts after the previous one finished', async () => {
  const log = [];
  await runPool([1, 2, 3], 1, async (n) => { log.push(`start ${n}`); await sleep(5 - n); log.push(`end ${n}`); });
  assert.deepEqual(log, ['start 1', 'end 1', 'start 2', 'end 2', 'start 3', 'end 3']);
});

test('a limit larger than the item count is fine', async () => {
  assert.deepEqual(await runPool([1, 2], 10, async (n) => n * 2), [2, 4]);
});

test('empty input resolves to an empty array without calling the worker', async () => {
  let calls = 0;
  assert.deepEqual(await runPool([], 3, async () => { calls++; }), []);
  assert.equal(calls, 0);
});

test('a throwing worker rejects with its error, after in-flight workers settle, and starts no new ones', async () => {
  const started = [];
  let inFlightDone = false;
  await assert.rejects(
    runPool([0, 1, 2, 3, 4, 5], 2, async (n) => {
      started.push(n);
      if (n === 0) { await sleep(1); throw new Error('boom'); }
      if (n === 1) { await sleep(30); inFlightDone = true; return; }
      await sleep(1);
    }),
    /boom/,
  );
  assert.equal(inFlightDone, true, 'rejected before the in-flight worker settled');
  assert.deepEqual(started, [0, 1]);
});

test('the worker receives the item and its index', async () => {
  const seen = [];
  await runPool(['a', 'b'], 2, async (item, i) => { seen.push([item, i]); });
  assert.deepEqual(seen.sort(), [['a', 0], ['b', 1]]);
});

test('a limit that is not a positive integer is rejected', async () => {
  for (const bad of [0, -1, 1.5, NaN, '2']) {
    await assert.rejects(runPool([1], bad, async () => {}), RangeError);
  }
});

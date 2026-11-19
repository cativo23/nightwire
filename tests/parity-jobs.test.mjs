import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolveJobs } from '../scripts/parity/lib/jobs.mjs';

test('--jobs wins over NW_PARITY_JOBS, and NW_PARITY_JOBS wins over the default', () => {
  assert.equal(resolveJobs('3', '5', 16), 3);
  assert.equal(resolveJobs(undefined, '5', 16), 5);
  assert.equal(resolveJobs('1', undefined, 16), 1);
});

test('the default is min(6, cores - 2), and never below 1', () => {
  assert.equal(resolveJobs(undefined, undefined, 16), 6);
  assert.equal(resolveJobs(undefined, '', 8), 6);
  assert.equal(resolveJobs(undefined, undefined, 5), 3);
  assert.equal(resolveJobs(undefined, undefined, 2), 1);
  assert.equal(resolveJobs(undefined, undefined, 1), 1);
});

test('a value that is not a positive integer is a usage error naming its source', () => {
  for (const bad of ['0', '-2', '1.5', 'abc', '2x', ' ']) {
    assert.throws(() => resolveJobs(bad, undefined, 8), /--jobs must be a positive integer/, bad);
  }
  assert.throws(() => resolveJobs(undefined, 'nope', 8), /NW_PARITY_JOBS must be a positive integer, got "nope"/);
  assert.throws(() => resolveJobs('9007199254740993', undefined, 8), /positive integer/);
});

test('npm run parity exits 2 on a bad --jobs, before starting a browser', () => {
  const script = new URL('../scripts/parity/compare.mjs', import.meta.url).pathname;
  const r = spawnSync(process.execPath, [script, '--jobs', '0'], { encoding: 'utf8' });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /--jobs must be a positive integer, got "0"/);
});

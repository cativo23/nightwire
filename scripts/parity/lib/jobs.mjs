// How many page captures run at once. Pure (cores are a parameter), so it is unit-tested without
// a browser; compare.mjs turns the thrown message into a usage error (exit 2).

import { availableParallelism } from 'node:os';

/** `--jobs` (arg), else `NW_PARITY_JOBS` (env), else min(6, cores - 2), at least 1. */
export function resolveJobs(arg, env, cores = availableParallelism()) {
  const raw = arg ?? env;
  if (raw === undefined || raw === '') return Math.max(1, Math.min(6, cores - 2));
  const n = Number(raw);
  if (!/^\d+$/.test(String(raw).trim()) || !Number.isSafeInteger(n) || n < 1) {
    throw new Error(`${arg === undefined ? 'NW_PARITY_JOBS' : '--jobs'} must be a positive integer, got "${raw}"`);
  }
  return n;
}

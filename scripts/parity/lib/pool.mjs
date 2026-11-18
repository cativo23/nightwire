// Bounded-concurrency map for the parity tool. Zero dependencies.

/**
 * Run `worker(item, index)` over `items` with at most `limit` calls in flight and resolve to the
 * results in input order, whatever order the workers finish in.
 *
 * If a worker throws, no further item is started; the returned promise rejects with the first
 * error only after every worker already in flight has settled, so the caller can safely tear down
 * shared resources (browser, server) in a `finally` without racing running workers.
 */
export async function runPool(items, limit, worker) {
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError(`limit must be a positive integer, got ${limit}`);
  const results = new Array(items.length);
  let next = 0;
  let failed = false;
  let firstError;
  const lane = async () => {
    while (!failed && next < items.length) {
      const index = next++;
      try {
        results[index] = await worker(items[index], index);
      } catch (err) {
        if (!failed) { failed = true; firstError = err; }
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, lane));
  if (failed) throw firstError;
  return results;
}

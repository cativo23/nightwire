const ITEM = /^(\d*\.?\d+)(ms|s)$/;

/** Longest entry of a computed `transition-duration` list ("0.35s, 0s"), in milliseconds. */
export function maxDurationMs(list) {
  const items = String(list).split(',').map((s) => s.trim());
  const ms = items.map((s) => {
    const m = ITEM.exec(s);
    if (!m) throw new Error(`not a duration list: "${list}"`);
    // Round away the float noise of seconds * 1000 (0.1125 * 1000 = 112.50000000000001).
    return Math.round((m[2] === 's' ? Number(m[1]) * 1000 : Number(m[1])) * 1e6) / 1e6;
  });
  return Math.max(...ms);
}

/** Longest duration across several elements' lists. */
export function maxOfLists(lists) {
  if (lists.length === 0) throw new Error('no duration lists to read');
  return Math.max(...lists.map(maxDurationMs));
}

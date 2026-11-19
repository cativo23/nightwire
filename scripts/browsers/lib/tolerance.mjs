/** Window in which `visibility` must flip to hidden after a close: [exit - 25, exit + 60] ms. */
export function hiddenWindow(exitMs) {
  return { min: exitMs - 25, max: exitMs + 60 };
}

/** True when the first hidden frame (ms since the toggle, or null if never) is inside the window. */
export function hiddenOnTime(hiddenAtMs, exitMs) {
  if (hiddenAtMs === null || hiddenAtMs === undefined) return false;
  const { min, max } = hiddenWindow(exitMs);
  return hiddenAtMs >= min && hiddenAtMs <= max;
}

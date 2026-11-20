// Page clock for the parity tool. Zero dependencies.

/** The page sees Date.now() = fixed time + this, from the first script onward. */
export const PAUSED_AT_OFFSET_MS = 1000;

/**
 * Give every page of the context a fake clock that is paused from the start, at
 * `fixedTime + PAUSED_AT_OFFSET_MS`, with performance.now() at 0. Timers only fire on runFor().
 *
 * Do not call clock.install() first. install() starts a clock that follows real time, and the
 * later pauseAt() then depends on how much wall time passed in between: on a loaded host it
 * throws "Cannot fast-forward to the past", and when it does not, the page starts with
 * performance.now() equal to that wall time, which moves the requestAnimationFrame phase and so
 * the order in which seeded Math.random draws are consumed. pauseAt() alone installs the clock
 * and, when each document is created, replays it as "paused at that time, zero ticks".
 *
 * @param {{ pauseAt(time: Date): Promise<void> }} clock  the Playwright page.clock (or a stand-in)
 * @param {Date} fixedTime
 */
export async function startPausedClock(clock, fixedTime) {
  await clock.pauseAt(new Date(fixedTime.getTime() + PAUSED_AT_OFFSET_MS));
}

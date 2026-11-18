// Which stylesheet is the "old" side. Pure, so the decision is unit-tested without a browser.

const DEFAULT_OLD = 'git:main';

/** A category-file baseline is a git ref such as `v2.1.0`; a `git:` prefix is accepted too. */
const asSpec = (baseline) => (baseline.startsWith('git:') ? baseline : `git:${baseline}`);

/**
 * Decide the `--old` spec.
 *
 * @param {object}  p
 * @param {boolean} [p.expect]   --expect was given
 * @param {string}  [p.baseline] optional `baseline` of the category file
 * @param {string}  [p.old]      explicit --old, undefined when the flag was not passed
 * @returns {{ old: string, warning?: string }} `warning` is one `WARN  …` line, only when
 *          --expect and --old are both given, the file has a baseline, and they differ.
 */
export function resolveOld({ expect, baseline, old }) {
  const wanted = expect && typeof baseline === 'string' && baseline !== '' ? asSpec(baseline) : undefined;
  if (old === undefined) return { old: wanted ?? DEFAULT_OLD };
  if (wanted !== undefined && old !== wanted) {
    return { old, warning: `WARN  --old ${old} differs from the category baseline ${wanted}` };
  }
  return { old };
}

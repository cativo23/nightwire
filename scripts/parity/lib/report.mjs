// Builds the parity report lines and exit code from structured differences. Pure.
import { writeFileSync } from 'node:fs';
import { formatDiff, classify, matchCategory, cascadeProps } from './diff.mjs';

/**
 * @param {object} input
 * @param {object[]} input.diffs         records from diffRecords(), any order
 * @param {object[]} [input.categories]  compiled categories (validateCategories(...).categories);
 *                                       omit for the classic report without --expect
 * @param {boolean}  [input.control]     a `--control` run: cascade categories are ignored, so they
 *                                       print no CATEGORY line and explain nothing
 * @param {string[]} [input.pages]       the pages of the run; with it, a normal run checks that every
 *                                       cascade category whose page glob matched one of them explained
 *                                       each property it lists (CASCADE-UNUSED, fails the run)
 * @param {string}   [input.controlSheet] the control sheet the category file names, for the CASCADE hint
 * @param {number}   input.maxLines      cap on printed DIFF lines
 * @param {string}   input.coverageLine  the finished COVERAGE line
 * @param {number}   input.uncovered     how many classes/attr-states no page exercised
 * @returns {{ lines: string[], exitCode: 0 | 1 }}
 *
 * Layout: DIFF lines (all of them, or only the unexpected ones with categories), the
 * truncation note, then CATEGORY lines (only with categories), CASCADE-UNUSED lines, COVERAGE, the
 * CASCADE hint (a normal run with cascade categories: they are evidence only together with the
 * --control run, FR-038), RESULT.
 */
export function buildReport({ diffs, categories, control = false, pages, controlSheet, maxLines, coverageLine, uncovered }) {
  const withCategories = categories !== undefined;
  const { counts, unexpected, used } = withCategories ? classify(diffs, categories, { control }) : { counts: new Map(), unexpected: diffs, used: new Map() };
  const shown = unexpected.map(formatDiff).sort();

  const lines = shown.slice(0, maxLines);
  if (shown.length > maxLines) lines.push(`…  ${shown.length - maxLines} more DIFF lines (raise --max-lines to see them)`);
  for (const [id, count] of counts) lines.push(`CATEGORY  ${id}  ${count}`);
  const unused = [];
  const cascade = withCategories && !control ? categories.filter((c) => c.kind === 'cascade') : [];
  if (pages !== undefined) {
    for (const c of cascade) {
      if (!pages.some((p) => c.match.page.test(p))) continue;
      const missing = cascadeProps(c).filter((p) => !used.get(c.id).has(p));
      if (missing.length) unused.push(`CASCADE-UNUSED  ${c.id}  ${missing.join(' ')}`);
    }
  }
  lines.push(...unused);
  lines.push(coverageLine);
  if (cascade.length) {
    lines.push(`CASCADE  ${cascade.length} ${cascade.length === 1 ? 'category' : 'categories'} active, not proven by this run: also run --control ${controlSheet ?? '<css>'}`);
  }
  lines.push(`RESULT  differences=${diffs.length}${withCategories ? `  unexpected=${unexpected.length}` : ''}`);

  return { lines, exitCode: unexpected.length || unused.length || uncovered ? 1 : 0 };
}

/**
 * The machine-readable form of a run, for `--json <file>`.
 * @param {object} input
 * @param {string} input.oldSpec
 * @param {string} input.newSpec
 * @param {string[]} input.pages
 * @param {string[]} input.states         base state labels
 * @param {object[]} input.diffs          records from diffRecords()
 * @param {object[]} input.shadows        records from collectShadows(), every element with a shadow
 * @param {object[]} [input.categories]   compiled categories; omit when there is no --expect
 * @param {string}   [input.control]      the --control sheet path; cascade categories explain nothing
 * @returns {{ meta: object, diffs: object[], shadows: object[] }} each diff carries `category`,
 *          the id of the first category that explains it, or null; `meta.control` is the control
 *          sheet path or null
 */
export function buildJsonReport({ oldSpec, newSpec, pages, states, diffs, shadows, categories, control }) {
  const meta = { old: oldSpec, new: newSpec, pages, states, differences: diffs.length, control: control ?? null };
  let tagged = diffs.map((d) => ({ ...d, category: null }));
  if (categories !== undefined) {
    const active = control == null ? categories : categories.filter((c) => c.kind !== 'cascade');
    tagged = diffs.map((d) => ({ ...d, category: active.find((c) => matchCategory(d, c))?.id ?? null }));
    meta.unexpected = tagged.filter((d) => d.category === null).length;
  }
  return { meta, diffs: tagged, shadows };
}

/**
 * Write the `--json` file. A failure becomes an Error naming the file and the cause, so the caller
 * can exit 2 (usage or environment error) instead of looking like unexpected differences.
 */
export function writeJsonReport(file, json) {
  try {
    writeFileSync(file, JSON.stringify(json));
  } catch (err) {
    throw new Error(`cannot write --json file ${file}: ${err.message}`);
  }
}

// Builds the parity report lines and exit code from structured differences. Pure.
import { writeFileSync } from 'node:fs';
import { formatDiff, classify, matchCategory } from './diff.mjs';

/**
 * @param {object} input
 * @param {object[]} input.diffs         records from diffRecords(), any order
 * @param {object[]} [input.categories]  compiled categories (validateCategories(...).categories);
 *                                       omit for the classic report without --expect
 * @param {number}   input.maxLines      cap on printed DIFF lines
 * @param {string}   input.coverageLine  the finished COVERAGE line
 * @param {number}   input.uncovered     how many classes/attr-states no page exercised
 * @returns {{ lines: string[], exitCode: 0 | 1 }}
 *
 * Layout: DIFF lines (all of them, or only the unexpected ones with categories), the
 * truncation note, then CATEGORY lines (only with categories), COVERAGE, RESULT.
 */
export function buildReport({ diffs, categories, maxLines, coverageLine, uncovered }) {
  const withCategories = categories !== undefined;
  const { counts, unexpected } = withCategories ? classify(diffs, categories) : { counts: new Map(), unexpected: diffs };
  const shown = unexpected.map(formatDiff).sort();

  const lines = shown.slice(0, maxLines);
  if (shown.length > maxLines) lines.push(`…  ${shown.length - maxLines} more DIFF lines (raise --max-lines to see them)`);
  for (const [id, count] of counts) lines.push(`CATEGORY  ${id}  ${count}`);
  lines.push(coverageLine);
  lines.push(`RESULT  differences=${diffs.length}${withCategories ? `  unexpected=${unexpected.length}` : ''}`);

  return { lines, exitCode: unexpected.length || uncovered ? 1 : 0 };
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
 * @returns {{ meta: object, diffs: object[], shadows: object[] }} each diff carries `category`,
 *          the id of the first category that explains it, or null
 */
export function buildJsonReport({ oldSpec, newSpec, pages, states, diffs, shadows, categories }) {
  const meta = { old: oldSpec, new: newSpec, pages, states, differences: diffs.length };
  let tagged = diffs.map((d) => ({ ...d, category: null }));
  if (categories !== undefined) {
    tagged = diffs.map((d) => ({ ...d, category: categories.find((c) => matchCategory(d, c))?.id ?? null }));
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

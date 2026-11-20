// The `--control <css>` run (FR-038): the new stylesheet plus a control sheet that restores the
// layout declarations of the components whose cascade the open layout changed. Pure apart from
// reading the one file, so the decisions are unit-tested without a browser.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export class ControlError extends Error {}

/**
 * Read the control sheet.
 *
 * @param {string|undefined} control  the --control value (a path, relative to `root`)
 * @param {object}  p
 * @param {boolean} p.expect          --expect was given
 * @param {string}  p.root            directory a relative path resolves against
 * @returns {{ path: string, css: string } | null} null when --control was not given
 * @throws {ControlError} when --control is given without --expect, or the file cannot be read
 */
export function loadControl(control, { expect, root }) {
  if (control === undefined) return null;
  if (!expect) throw new ControlError('--control requires --expect (it ignores the cascade categories of that file)');
  try {
    return { path: control, css: readFileSync(resolve(root, control), 'utf8') };
  } catch (err) {
    throw new ControlError(`cannot read --control file ${control}: ${err.message}`);
  }
}

/** The stylesheet the new side is served as: the control sheet comes last so it wins at equal specificity. */
export function withControl(newCss, controlCss) {
  return `${newCss}\n${controlCss}`;
}

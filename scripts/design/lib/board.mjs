// Pure helpers of the design-board renderer: arguments, output names, forced pseudo-states.
// No browser and no filesystem, so they are unit-tested directly.

import { parseArgs } from 'node:util';
import { join } from 'node:path';

export const INTENSITIES = ['archive', 'operator', 'combat'];

const DEFAULT_BEFORE = 'git:v2.1.0';
const DEFAULT_AFTER = 'nightwire.css';
const DEFAULT_PAGE = 'docs/design/v3/board.html';
const DEFAULT_WIDTH = 1280;

// `data-force` value -> name CDP `CSS.forcePseudoState` expects.
const FORCEABLE = new Map([':hover', ':focus', ':focus-visible', ':active', ':focus-within'].map((p) => [p, p.slice(1)]));

/**
 * @param {string[]} argv
 * @param {{ tmpdir: string }} env  injected so the default output dir is testable
 * @returns {{ sheets: {label: string, spec: string}[], out: string, page: string, width: number }}
 * @throws {Error} on any usage error (the message is user-facing)
 */
export function parseBoardArgs(argv, { tmpdir }) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: { css: { type: 'string' }, before: { type: 'string' }, after: { type: 'string' },
      out: { type: 'string' }, page: { type: 'string' }, width: { type: 'string' } },
  });
  if (positionals.length) throw new Error(`unexpected argument: ${positionals[0]}`);
  if (values.css !== undefined && (values.before !== undefined || values.after !== undefined)) {
    throw new Error('--css cannot be combined with --before or --after');
  }
  let width = DEFAULT_WIDTH;
  if (values.width !== undefined) {
    if (!/^[1-9]\d*$/.test(values.width)) throw new Error('--width must be a positive integer');
    width = Number(values.width);
  }
  const sheets = values.css !== undefined
    ? [{ label: 'css', spec: values.css }]
    : [{ label: 'before', spec: values.before ?? DEFAULT_BEFORE }, { label: 'after', spec: values.after ?? DEFAULT_AFTER }];
  return { sheets, out: values.out ?? join(tmpdir, 'nightwire-board'), page: values.page ?? DEFAULT_PAGE, width };
}

/** File name of one screenshot: `board-<label>-<intensity>.png`. */
export function outputName(label, intensity) {
  if (!INTENSITIES.includes(intensity)) throw new Error(`unknown intensity: ${intensity}`);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(label)) throw new Error(`invalid label: ${label}`);
  return `board-${label}-${intensity}.png`;
}

/**
 * Parse a `data-force` attribute (space- or comma-separated pseudo-classes) into the names
 * `CSS.forcePseudoState` takes. Duplicates collapse; an empty value forces nothing.
 */
export function parseForce(value) {
  const out = [];
  for (const token of value.split(/[\s,]+/).filter(Boolean)) {
    const name = FORCEABLE.get(token);
    if (name === undefined) throw new Error(`unsupported pseudo-class "${token}" in data-force`);
    if (!out.includes(name)) out.push(name);
  }
  return out;
}

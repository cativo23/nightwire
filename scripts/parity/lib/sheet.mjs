// Load a Nightwire stylesheet by spec: a repo-relative path or `git:<ref>` (nightwire.css at that
// ref). Shared by parity and the design board; callers decide how to surface a SheetError.

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

export class SheetError extends Error {}

/**
 * @param {string} spec  `git:<ref>` or a path relative to `root`
 * @param {string} root  repository root
 * @returns {string} the stylesheet text
 * @throws {SheetError} on an invalid or unreadable spec
 */
export function loadSheet(spec, root) {
  if (spec.startsWith('git:')) {
    const ref = spec.slice(4);
    if (!ref || ref.startsWith('-')) throw new SheetError(`invalid git ref: ${spec}`);
    try {
      return execFileSync('git', ['show', `${ref}:nightwire.css`], { cwd: root, encoding: 'utf8', maxBuffer: 64 << 20 });
    } catch {
      throw new SheetError(`cannot read nightwire.css at ${ref}`);
    }
  }
  const path = resolve(root, spec);
  if (!existsSync(path)) throw new SheetError(`stylesheet not found: ${spec}`);
  return readFileSync(path, 'utf8');
}

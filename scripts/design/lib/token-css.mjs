// The token stylesheet, built in memory from src/tokens/tokens.json with the same emitter that
// `npm run build:tokens` uses. The contrast check reads this instead of src/tokens/tokens.css,
// which is generated and git-ignored: a clean checkout has none, and a local copy can be stale.

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { emitCss } from '../../lib/tokens.mjs';

const DEFAULT_SOURCE = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'src', 'tokens', 'tokens.json');

/** `source` is a path or file URL to a tokens.json; the default is the repo's own. */
export function tokenCssFromSource(source = DEFAULT_SOURCE) {
  return emitCss(JSON.parse(readFileSync(source, 'utf8')));
}

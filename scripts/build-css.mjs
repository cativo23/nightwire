#!/usr/bin/env node
// src/index.css (ordered @import manifest) → nightwire.css. Run after build:tokens, which
// writes src/tokens/tokens.css. Usage: npm run build:css   (exit 1 naming the file on error)

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assemble } from './lib/css.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'nightwire.css');

try {
  const css = assemble(resolve(ROOT, 'src/index.css'), { root: ROOT });
  const changed = !existsSync(OUT) || readFileSync(OUT, 'utf8') !== css;
  if (changed) writeFileSync(OUT, css);
  console.log(`build:css  ${changed ? 'wrote nightwire.css' : 'up to date'}`);
} catch (err) {
  console.error(`build:css: ${err.message}`);
  process.exit(1);
}

// Counts shown by the docs (ticker, status bar, overview), computed from the repo at build time
// so they cannot drift from the sources (Principle II). Used by vite.config.ts and by
// tests/docs-site.test.mjs. Plain ESM with a .d.mts for the same reason as src/data/tokens.mjs.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { countCssTokens } from './src/data/tokens.mjs';

/** Tokens that publish a CSS custom property, and component stylesheets in src/components. */
export function docsCounts(repoRoot) {
  const tokens = JSON.parse(readFileSync(path.join(repoRoot, 'src/tokens/tokens.json'), 'utf8'));
  return {
    tokens: countCssTokens(tokens),
    components: readdirSync(path.join(repoRoot, 'src/components')).filter((f) => f.endsWith('.css')).length,
  };
}

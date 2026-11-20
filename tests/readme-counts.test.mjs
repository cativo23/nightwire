import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { docsCounts } from '../apps/docs/build-counts.mjs';

// The README states the stylesheet and token counts; the docs site derives the same two numbers
// from the repo. Pin the README to them so it cannot go stale when a piece is added.
const root = new URL('..', import.meta.url).pathname;
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const counts = docsCounts(root);

test('should_state_the_real_component_stylesheet_count_in_the_readme', () => {
  const m = readme.match(/\*\*(\d+) pure CSS component stylesheets\*\*/);
  assert.ok(m, 'README has no "N pure CSS component stylesheets" line');
  assert.equal(Number(m[1]), counts.components);
});

test('should_state_the_real_token_count_in_the_readme', () => {
  const m = readme.match(/(\d+) design tokens/);
  assert.ok(m, 'README has no "N design tokens" line');
  assert.equal(Number(m[1]), counts.tokens);
});

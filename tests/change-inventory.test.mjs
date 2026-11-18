import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateCategories } from '../scripts/parity/lib/diff.mjs';
import { NS } from '../scripts/lib/tokens.mjs';

// The inventory is checked in but parity is not in CI (it needs Chrome), so these two checks
// are what stop the file from rotting.
const read = (rel) => JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));
const inventory = read('../docs/design/v3/change-inventory.json');
const tokens = read('../src/tokens/tokens.json');

// Every token node (an object with $value) under `node`.
function* leaves(node) {
  if (node === null || typeof node !== 'object') return;
  if ('$value' in node) { yield node; return; }
  for (const [key, child] of Object.entries(node)) if (!key.startsWith('$')) yield* leaves(child);
}

const V2_1_0_MOTION = new Set(['--nw-tick', '--nw-sweep', '--nw-uplink']);

test('the checked-in change inventory passes validateCategories', () => {
  assert.doesNotThrow(() => validateCategories(inventory));
});

test('every new motion custom property is covered by the token-additions category', () => {
  const { categories } = validateCategories(inventory);
  const additions = categories.find((c) => c.id === 'token-additions');
  assert.ok(additions, 'the inventory has a token-additions category');

  const added = [...leaves(tokens.motion)]
    .map((node) => node.$extensions?.[NS]?.css)
    .filter((css) => css !== undefined && !V2_1_0_MOTION.has(css));
  assert.ok(added.length > 0, 'tokens.json has motion tokens with a css name beyond the v2.1.0 ones');
  for (const css of added) {
    assert.ok(additions.match.prop.test(css), `${css} is not matched by token-additions match.prop`);
  }
});

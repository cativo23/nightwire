import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

// FR-022 / Constitution VII: the README states the v3 look in lockstep with the stylesheet. It names
// the open panel, the outlined card, the opt-in reticle frame and the new nw- classes, and its
// design principle 4 carries the FR-034 exceptions that DESIGN.md and SKILL.md already state.
const read = (rel) => readFileSync(new URL(`../${rel}`, import.meta.url), 'utf8');
const readme = read('README.md');
const source = ['components', 'utilities', 'base']
  .flatMap((dir) => {
    const base = new URL(`../src/${dir}/`, import.meta.url);
    return readdirSync(base).map((f) => readFileSync(new URL(f, base), 'utf8'));
  })
  .join('\n');

const NEW_CLASSES = [
  'nw-section-head', 'nw-display', 'nw-lede', 'nw-chip', 'nw-index', 'nw-index-row', 'nw-accordion',
  'nw-link-arrow', 'nw-reticle', 'nw-halftone', 'nw-barcode', 'nw-wordmark', 'nw-grain',
];

test('should_name_every_new_v3_class_in_the_readme', () => {
  for (const cls of NEW_CLASSES) {
    assert.ok(readme.includes(`\`.${cls}\``), `README does not mention .${cls}`);
  }
});

test('should_only_name_nw_classes_that_exist_in_the_stylesheet_sources', () => {
  const named = new Set([...readme.matchAll(/`\.(nw-[a-z][a-z0-9-]*)`/g)].map((m) => m[1]));
  assert.ok(named.size > 0);
  for (const cls of named) {
    assert.ok(new RegExp(`\\.${cls}(?![a-z0-9-])`).test(source), `README names .${cls}, which no src component, utility or base file defines`);
  }
});

test('should_describe_the_open_panel_and_the_outlined_card_in_the_readme', () => {
  assert.match(readme, /open `\.panel`|`\.panel` is open/i);
  assert.match(readme, /`\.card`[^.\n]*outline/i);
  assert.match(readme, /`\.panel nw-reticle`|`\.panel\.nw-reticle`|`\.panel` (?:with|and) `\.nw-reticle`/);
});

test('should_list_the_fr_034_exceptions_in_design_principle_four', () => {
  const line = readme.split('\n').find((l) => /^4\. \*\*No CRT effects/.test(l));
  assert.ok(line, 'README has no design principle 4');
  assert.match(line, /grain/i);
  assert.match(line, /halftone/i);
  assert.match(line, /kanji glow/i);
  assert.match(line, /archive/i);
  assert.match(line, /every intensity/i);
});

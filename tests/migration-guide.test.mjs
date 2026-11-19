import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// FR-020 / T055: the v2 -> v3 migration guide exists, names every removal, and is linked.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(path.join(root, rel), 'utf8');
const GUIDE = 'docs/migration/v3.md';

// The code spans in the first cell of every row of the inventory's Surfaces table whose
// Decision is "Remove" (this includes the .modal-backdrop merge).
function removedSurfaces() {
  const lines = read('docs/design/v3/v1-inventory.md').split('\n');
  const start = lines.findIndex((l) => l.trim() === '## Surfaces');
  assert.notEqual(start, -1, 'inventory has no "## Surfaces" heading');
  const surfaces = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith('## ')) break;
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').map((c) => c.trim());
    const decision = cells[cells.length - 2];
    if (!decision.startsWith('**Remove')) continue;
    surfaces.push(...[...cells[1].matchAll(/`([^`]+)`/g)].map((m) => m[1]));
  }
  return surfaces;
}

test('should_have_a_migration_guide', () => {
  assert.doesNotThrow(() => read(GUIDE));
});

test('should_list_every_surface_the_inventory_removes', () => {
  const removed = removedSurfaces();
  assert.ok(removed.length >= 6, `parsed too few removed surfaces: ${removed.join(', ')}`);
  const guide = read(GUIDE);
  for (const surface of removed) {
    assert.ok(guide.includes(surface), `guide does not mention removed surface ${surface}`);
  }
});

test('should_list_the_four_led_mappings', () => {
  const guide = read(GUIDE);
  for (const text of [
    '.led.green',
    '.led.yellow',
    '.led.red',
    '.led.blue',
    '.led[data-state="ok"]',
    '.led[data-state="warn"]',
    '.led[data-state="error"]',
    '.led[data-state="active"]',
  ]) {
    assert.ok(guide.includes(text), `guide does not mention ${text}`);
  }
});

test('should_name_the_knobs_the_module_type_and_the_way_to_stay_on_v2', () => {
  const guide = read(GUIDE);
  for (const text of [
    '--nw-header-gradient',
    '--nw-header-pattern',
    '--nw-led-glow',
    '"type": "module"',
    '.default',
    'nightwire.tailwind.preset.mjs',
    'shadow-<colour>',
    '@cativo23/nightwire@^2',
    'npx @cativo23/nightwire@2',
    'v2.1.0',
    'blog.cativo.dev',
  ]) {
    assert.ok(guide.includes(text), `guide does not mention ${text}`);
  }
});

// DESIGN.md ships in the npm package and the installer copies it into consumer projects, so it
// must not keep a "written in a later phase" promise either (FR-022).
test('should_link_the_guide_from_readme_changelog_and_design', () => {
  for (const file of ['README.md', 'CHANGELOG.md', 'DESIGN.md']) {
    const text = read(file);
    assert.ok(text.includes('docs/migration/v3.md'), `${file} does not link the guide`);
    assert.ok(
      !/written (in a )?later|later phase/i.test(text),
      `${file} still says the guide is written later`,
    );
  }
});

test('should_state_the_shadow_colour_limit_in_the_skill', () => {
  assert.ok(read('skill/nightwire/SKILL.md').includes('shadow-<colour>'));
});

// FR-021 / T056: the cativo.dev validation is recorded in the guide, not left as a placeholder.
test('should_record_the_cativo_dev_validation', () => {
  const guide = read(GUIDE);
  const start = guide.indexOf('\n## cativo.dev');
  assert.notEqual(start, -1, 'guide has no "## cativo.dev" section');
  const section = guide.slice(start);
  assert.ok(!/pending/i.test(section), 'cativo.dev section still says pending');
  for (const text of [
    '2026-11-19',
    '021ae0c',
    'data-state="ok"',
    'StatusIndicator.vue',
    'Footer.vue',
    'border-nw-text-faint/30',
    'shadow-[0_0_5px_theme(colors.nw.cyan.DEFAULT)]',
  ]) {
    assert.ok(section.includes(text), `cativo.dev section does not mention ${text}`);
  }
});

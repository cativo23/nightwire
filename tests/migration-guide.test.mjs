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

// FR-037 / T080: the guide documents the US5 mockup look. The open-layout section is found by
// its heading so the assertions read the prose that explains the change, not a stray mention.
function section(heading) {
  const guide = read(GUIDE);
  const start = guide.indexOf(`\n${heading}\n`);
  assert.notEqual(start, -1, `guide has no "${heading}" heading`);
  const level = heading.match(/^#+/)[0].length;
  const rest = guide.slice(start + heading.length + 2);
  const next = rest.search(new RegExp(`^#{1,${level}} `, 'm'));
  return next === -1 ? rest : rest.slice(0, next);
}

test('should_document_the_open_panel_and_both_ways_to_get_boxes_back', () => {
  const text = section('### Open layout');
  for (const needle of [
    '.panel',
    'no fill',
    'no outline',
    '.nw-reticle',
    '<div class="panel nw-reticle">',
    'your own CSS',
  ]) {
    assert.ok(text.includes(needle), `open layout section does not mention ${needle}`);
  }
});

test('should_document_the_card_outline', () => {
  const text = section('### Open layout');
  assert.ok(/`\.card`[^.]*hairline outline[^.]*fill/.test(text), 'card outline not described');
});

test('should_document_the_section_head_look_and_data_idx', () => {
  const text = section('### Open layout');
  for (const needle of [
    '.panel-header',
    '.card-header',
    '11px',
    'data-idx="01"',
    '01 // LABEL',
    '20px',
  ]) {
    assert.ok(text.includes(needle), `open layout section does not mention ${needle}`);
  }
});

test('should_tell_headers_to_use_kanji_instead_of_tag', () => {
  const text = section('### Open layout');
  assert.ok(text.includes('<span class="tag">日本語</span>'), 'old kanji markup not shown');
  assert.ok(text.includes('<span class="kanji">日本語</span>'), 'new kanji markup not shown');
  assert.ok(/nothing breaks/i.test(text), 'guide does not say the switch is optional');
});

test('should_document_the_kv_row_rhythm', () => {
  const text = section('### Open layout');
  for (const needle of ['.kv-row', '--nw-pad-scale', '.kv-note', '.kv-swap', 'right-aligned']) {
    assert.ok(text.includes(needle), `open layout section does not mention ${needle}`);
  }
});

test('should_list_every_new_us5_class_and_knob', () => {
  const text = section('## New classes and knobs');
  for (const needle of [
    '.nw-section-head',
    '.nw-section-head-chrome',
    '.nw-display',
    '.nw-lede',
    '.nw-chip',
    '.nw-chip-solid',
    '.nw-index',
    '.nw-index-row',
    '.nw-accordion',
    '.nw-link-arrow',
    '.nw-reticle',
    '.nw-reticle-meta',
    '.nw-reticle-vlabel',
    '.nw-reticle-stamp',
    '.nw-reticle-foot',
    '.nw-halftone',
    '.nw-halftone-chrome',
    '.nw-halftone-data',
    '.nw-halftone-bone',
    '.nw-halftone-fine',
    '.nw-barcode',
    '.nw-wordmark',
    '.nw-grain',
    '--nw-grain',
    '--nw-chip-line',
    '--nw-bone',
    '--nw-kanji-glow',
  ]) {
    assert.ok(text.includes(needle), `new classes section does not mention ${needle}`);
  }
});

test('should_give_the_grain_values_per_intensity', () => {
  const text = section('## New classes and knobs');
  assert.ok(/--nw-grain[^\n]*0[^\n]*archive[^\n]*\.07[^\n]*operator[^\n]*\.1[^\n]*combat/i.test(text));
  assert.ok(text.includes('<body class="nw-grain">'), 'grain opt-in snippet missing');
});

test('should_put_the_open_layout_in_the_checklist', () => {
  const guide = read(GUIDE);
  const start = guide.indexOf('\n## Checklist');
  const end = guide.indexOf('\n## ', start + 1);
  const checklist = guide.slice(start, end);
  assert.ok(checklist.includes('#open-layout'), 'checklist does not link the open layout');
  assert.ok(checklist.includes('nw-reticle'), 'checklist does not mention the frame opt-in');
});

test('should_flag_that_cativo_dev_is_not_yet_revalidated_for_the_mockup_look', () => {
  const guide = read(GUIDE);
  const text = guide.slice(guide.indexOf('\n## cativo.dev'));
  assert.ok(/`\.panel`/.test(text) && /`\.card`/.test(text), 'section does not name .panel and .card');
  assert.ok(/re-?validat/i.test(text), 'section does not mention the re-validation');
});

// FR-037 / T080: CHANGELOG [Unreleased] records the US5 look in lockstep with the guide.
test('should_record_the_mockup_look_in_the_changelog_unreleased_section', () => {
  const log = read('CHANGELOG.md');
  const start = log.indexOf('\n## [Unreleased]');
  assert.notEqual(start, -1, 'CHANGELOG has no [Unreleased] section');
  const end = log.indexOf('\n## [', start + 1);
  const unreleased = log.slice(start, end);
  for (const text of [
    '`.panel`',
    '`.nw-reticle`',
    '`.card`',
    '`.kv-row`',
    '`.kv-note`',
    '`.kanji`',
    'data-idx',
    '`.nw-section-head`',
    '`.nw-display`',
    '`.nw-lede`',
    '`.nw-chip`',
    '`.nw-index`',
    '`.nw-accordion`',
    '`.nw-link-arrow`',
    '`.nw-halftone`',
    '`.nw-barcode`',
    '`.nw-wordmark`',
    '`.nw-grain`',
    '`--nw-grain`',
    '`--nw-chip-line`',
    '`--nw-bone`',
    '`--nw-kanji-glow`',
    'docs/migration/v3.md#open-layout',
  ]) {
    assert.ok(unreleased.includes(text), `[Unreleased] does not mention ${text}`);
  }
});

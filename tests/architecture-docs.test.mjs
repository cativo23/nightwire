import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TokenReader, KNOB_COLUMNS } from '../apps/docs/src/data/tokens.mjs';

// FR-022 / FR-031: the architecture notes state the cascade order and the intensity knobs. Derive
// what they must say from src/index.css and tokens.json, so a new component or knob cannot go
// missing from the notes.
const read = (rel) => readFileSync(new URL(`../${rel}`, import.meta.url), 'utf8');
const manifest = read('src/index.css');
const cascade = read('docs/architecture/cascade.md');
const intensity = read('docs/architecture/intensity.md');
const tokens = JSON.parse(read('src/tokens/tokens.json'));
const nw = new TokenReader(tokens);

const manifestComponents = [...manifest.matchAll(/@import "\.\/components\/([a-z0-9-]+)\.css";/g)].map((m) => m[1]);

// The "components/*" rows of the order table: the "Why here" cell is a chain `a → b → c`.
const cascadeRows = cascade.split('\n').filter((l) => /^\| \d+ \| `components\/\*`/.test(l));
const cascadeComponents = cascadeRows.flatMap((row) => {
  return row.split('|')[3].split('→').map((name) => name.trim().replace(/`/g, '')).filter(Boolean);
});

test('should_list_every_manifest_component_in_the_cascade_table_in_manifest_order', () => {
  assert.ok(manifestComponents.length > 40);
  assert.deepEqual(cascadeComponents, manifestComponents);
});

const knobRow = (css) => intensity.split('\n').find((l) => l.startsWith('|') && l.includes(`\`${css}\``));

test('should_document_the_grain_knob_with_its_three_intensity_values', () => {
  const row = knobRow('--nw-grain');
  assert.ok(row, 'intensity.md has no --nw-grain row');
  const cells = row.split('|').map((c) => c.trim());
  assert.equal(cells[2], `\`${nw.display('knob.grain')}\``);
  assert.match(cells[3], new RegExp(`^\`${nw.overrideNumber('archive', 'grain')}\``));
  assert.match(cells[4], new RegExp(`^\`${nw.overrideNumber('combat', 'grain')}\``));
});

test('should_document_the_kanji_glow_knob_with_its_base_value', () => {
  const row = knobRow('--nw-kanji-glow');
  assert.ok(row, 'intensity.md has no --nw-kanji-glow row');
  assert.ok(row.includes(nw.display('knob.kanji-glow')), 'the row does not show the token value');
});

test('should_show_grain_on_the_intensity_page_of_the_docs_site', () => {
  for (const level of ['archive', 'operator', 'combat']) {
    assert.ok(KNOB_COLUMNS[level].includes('grain'), `${level} column lacks grain`);
    assert.ok(`--nw-grain` in nw.knobs(level, KNOB_COLUMNS[level]));
  }
});

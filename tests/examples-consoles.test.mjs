// T084: the dense consoles in examples/html frame their panels with .nw-reticle, because the open
// .panel has no box and their gaps are 1-8px. workshop has 8px gaps and stays open. The frame is a
// new rendering difference on those pages, so each page carries its own narrow parity categories.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const panels = (page) => [...read(`examples/html/${page}.html`).matchAll(/<(?:div|section) class="(panel(?:\s[^"]*)?)"/g)].map((m) => m[1]);
const { categories } = JSON.parse(read('docs/design/v3/change-inventory.json'));

const FRAMED = { dashboard: 8, 'neural-ops': 10, 'synapse-ops': 5 };
const BACKGROUND = ['attachment', 'blend-mode', 'clip', 'image', 'origin', 'position', 'repeat', 'size'];

for (const [page, count] of Object.entries(FRAMED)) {
  test(`T084: all ${count} panels of ${page}.html carry nw-reticle`, () => {
    const found = panels(page);
    assert.equal(found.length, count);
    assert.deepEqual(found.filter((c) => !/\bnw-reticle\b/.test(c)), []);
  });
}

test('T084: workshop.html keeps its 3 panels open', () => {
  const found = panels('workshop');
  assert.equal(found.length, 3);
  assert.deepEqual(found.filter((c) => /\bnw-reticle\b/.test(c)), []);
});

for (const page of Object.keys(FRAMED)) {
  test(`T084: ${page}.html has page-pinned, value-pinned categories for the frame (padding and the eight background longhands)`, () => {
    const mine = categories.filter((c) => c.id.startsWith(`nw-reticle-console-${page}-`));
    for (const c of mine) {
      assert.equal(c.match.page, `examples/html/${page}.html`, `${c.id} is pinned to its page`);
      assert.ok(c.match.path && c.match.old && c.match.new, `${c.id} pins path, old and new`);
      assert.notEqual(c.kind, 'cascade', `${c.id} is a narrow category, not a cascade one`);
    }
    const ids = mine.map((c) => c.id.replace(`nw-reticle-console-${page}-`, ''));
    for (const n of BACKGROUND) assert.ok(ids.includes(`background-${n}`), `${page}: background-${n}`);
    assert.ok(ids.includes('padding'), `${page}: padding`);
  });
}

test('T084: synapse-ops.html also pins position and offsets (its panels were static; the other two already are positioned)', () => {
  const ids = categories.filter((c) => c.id.startsWith('nw-reticle-console-synapse-ops-')).map((c) => c.id);
  assert.ok(ids.includes('nw-reticle-console-synapse-ops-position'));
  assert.ok(ids.includes('nw-reticle-console-synapse-ops-offsets'));
  assert.equal(categories.filter((c) => /^nw-reticle-console-(dashboard|neural-ops)-(position|offsets)$/.test(c.id)).length, 0);
});

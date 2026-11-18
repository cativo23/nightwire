import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rewrite, emitRegions } from '../scripts/lib/designmd.mjs';

const sample = () => JSON.parse(readFileSync(new URL('./fixtures/tokens/sample.json', import.meta.url), 'utf8'));

const DOC = `---
version: "1.0"
name: Sample

# <generated:colors> — from src/tokens/tokens.json via \`npm run build:tokens\`. Do not edit.
colors:
  stale: "#000000"
# </generated:colors>

components:
  button: { color: "{colors.blue}" }   # hand-written, untouched

# <generated:rounded> — from src/tokens/tokens.json via \`npm run build:tokens\`. Do not edit.
rounded:
  none: "0px"
# </generated:rounded>
---

# Prose stays byte-identical.
`;

test('emitRegions groups DESIGN.md paths by top-level key in key order', () => {
  const regions = emitRegions(sample());
  assert.deepEqual(Object.keys(regions), ['colors', 'rounded', 'typography']);
});

test('emitRegions derives "# CSS: --x" notes from css and turns group $description into comments', () => {
  assert.equal(emitRegions(sample()).colors, [
    'colors:',
    '  # Primary colors',
    '  blue:      "#6699ff"                    # CSS: --blue',
    '  blue-fill: "rgba(102, 153, 255, 0.08)"  # CSS: --blue-fill',
  ].join('\n'));
});

test('emitRegions uses token $description as the trailing note when no CSS note applies', () => {
  assert.equal(emitRegions(sample()).rounded, [
    'rounded:',
    '  none: "0"    # default',
    '  sm:   "2px"',
  ].join('\n'));
});

test('emitRegions nests paths, puts the group comment on the mapping, and leaves numbers bare', () => {
  assert.equal(emitRegions(sample()).typography, [
    'typography:',
    '  # System text',
    '  sys:',
    '    fontWeight: 400',
    '    fontFamily: "\'JetBrains Mono\', monospace"',
  ].join('\n'));
});

test('rewrite replaces only the generated regions and keeps every other byte', () => {
  const out = rewrite(DOC, { colors: 'colors:\n  blue: "#6699ff"', rounded: 'rounded:\n  none: "0"' });
  const expected = DOC
    .replace('colors:\n  stale: "#000000"\n', 'colors:\n  blue: "#6699ff"\n')
    .replace('rounded:\n  none: "0px"\n', 'rounded:\n  none: "0"\n');
  assert.equal(out, expected);
  assert.equal(rewrite(out, { colors: 'colors:\n  blue: "#6699ff"', rounded: 'rounded:\n  none: "0"' }), out);
});

test('rewrite fails when a region has no markers', () => {
  assert.throws(() => rewrite(DOC, { colors: 'x', rounded: 'y', motion: 'z' }), /motion/);
});

test('rewrite fails when markers exist for a region that was not generated', () => {
  assert.throws(() => rewrite(DOC, { colors: 'x' }), /rounded/);
});

test('rewrite fails on duplicate markers', () => {
  const dup = DOC + '# <generated:colors>\n# </generated:colors>\n';
  assert.throws(() => rewrite(dup, { colors: 'x', rounded: 'y' }), /colors/);
});

test('rewrite fails on an unbalanced marker', () => {
  const open = DOC.replace('# </generated:rounded>\n', '');
  assert.throws(() => rewrite(open, { colors: 'x', rounded: 'y' }), /rounded/);
  const close = DOC.replace(/# <generated:rounded>.*\n/, '');
  assert.throws(() => rewrite(close, { colors: 'x', rounded: 'y' }), /rounded/);
});

test('rewrite fails on nested markers', () => {
  const nested = DOC.replace('  stale: "#000000"\n', '  stale: "#000000"\n# <generated:inner>\n# </generated:inner>\n');
  assert.throws(() => rewrite(nested, { colors: 'x', rounded: 'y', inner: 'z' }), /inner/);
});

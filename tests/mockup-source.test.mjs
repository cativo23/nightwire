import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

// US5 (spec 002, T069-T076): v3 looks like the approved mockup. Guards on the checked-in sources
// that carry it. The later tasks add their piece files to US5_FILES; the same rules apply to each.
const root = new URL('../', import.meta.url);
const read = (rel) => readFileSync(new URL(rel, root), 'utf8');

// ---- Source scanning helpers (mirrors tests/tokens-source.test.mjs; that file runs its own tests
// on import, so its helpers cannot be imported) --------------------------------------------------

const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));

/** Every rule of a stylesheet as { selector, decls: [{ prop, value, line }] }; nested blocks are walked. */
function parseRules(text) {
  const code = stripComments(text);
  const rules = [];
  const stack = [];
  let buf = '';
  let bufStart = 0;
  let paren = 0;
  const lineAt = (index) => code.slice(0, index).split('\n').length;
  const flush = () => {
    const decl = buf.trim();
    const at = bufStart + (buf.length - buf.trimStart().length);
    buf = '';
    const colon = decl.indexOf(':');
    if (!decl || colon < 0 || stack.length === 0) return;
    stack[stack.length - 1].decls.push({
      prop: decl.slice(0, colon).trim().toLowerCase(),
      value: decl.slice(colon + 1).trim().replace(/\s+/g, ' '),
      line: lineAt(at),
    });
  };
  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    if (ch === '(') paren++;
    else if (ch === ')') paren = Math.max(0, paren - 1);
    if (paren === 0 && ch === '{') {
      stack.push({ selector: buf.trim().replace(/\s+/g, ' '), decls: [] });
      rules.push(stack.at(-1));
      buf = '';
    } else if (paren === 0 && ch === '}') {
      flush();
      stack.pop();
    } else if (paren === 0 && ch === ';') {
      flush();
    } else {
      if (buf === '') bufStart = i;
      buf += ch;
    }
  }
  return rules.filter((r) => r.decls.length > 0);
}

/** The declarations of every rule whose selector list contains `selector`, last one wins per property. */
function declsOf(text, selector) {
  const out = new Map();
  for (const rule of parseRules(text)) {
    if (!rule.selector.split(/\s*,\s*/).includes(selector)) continue;
    for (const d of rule.decls) out.set(d.prop, d.value);
  }
  return out;
}

const panel = read('src/components/panel.css');
const card = read('src/components/card.css');
const kvRow = read('src/components/kv-row.css');

// ---- Manifest ------------------------------------------------------------------------------------

test('src/index.css imports components/section-head.css exactly once, after panel.css and card.css', () => {
  const imports = [...read('src/index.css').matchAll(/@import\s+"\.\/(components\/[\w-]+\.css)";/g)].map((m) => m[1]);
  assert.equal(imports.filter((f) => f === 'components/section-head.css').length, 1);
  const at = (f) => imports.indexOf(f);
  assert.ok(at('components/section-head.css') > at('components/panel.css'), 'after panel.css');
  assert.ok(at('components/section-head.css') > at('components/card.css'), 'after card.css');
});

// ---- FR-026 / FR-027: panel open, card outlined without fill -------------------------------------

const NO_FILL = (v) => v === undefined || v === 'none' || v === 'transparent';
const NO_LINE = (v) => v === undefined || v === 'none' || v === '0';

test('FR-026: .panel renders open: no fill and no outline', () => {
  const d = declsOf(panel, '.panel');
  assert.ok(NO_FILL(d.get('background')), `background: ${d.get('background')}`);
  assert.ok(NO_FILL(d.get('background-color')), `background-color: ${d.get('background-color')}`);
  assert.ok(NO_LINE(d.get('border')), `border: ${d.get('border')}`);
  assert.ok(!d.has('outline'), 'no outline');
  assert.ok(!d.has('box-shadow'), 'no ring drawn with box-shadow');
});

test('FR-027: .card loses its fill and keeps a hairline outline', () => {
  const d = declsOf(card, '.card');
  assert.ok(NO_FILL(d.get('background')), `background: ${d.get('background')}`);
  assert.match(d.get('border') ?? '', /var\(--nw-hairline\) solid var\(--nw-line\)/, 'hairline border');
});

// ---- FR-030: one section-head implementation -------------------------------------------------------

const HEAD = /^(\.panel-header|\.card-header)(?![\w-])/;

test('FR-030: the section-head look is in section-head.css only; panel.css and card.css keep the header padding and nothing else', () => {
  const offenders = [];
  for (const [file, text] of [['panel.css', panel], ['card.css', card], ['kv-row.css', kvRow]]) {
    for (const rule of parseRules(text)) {
      if (!rule.selector.split(/\s*,\s*/).some((s) => HEAD.test(s))) continue;
      for (const d of rule.decls.filter((x) => x.prop !== 'padding')) offenders.push(`${file}:${d.line}  ${rule.selector} { ${d.prop} }`);
    }
  }
  assert.deepEqual(offenders, [], `header rules outside section-head.css:\n${offenders.join('\n')}`);
});

test('FR-030: .nw-section-head, .panel-header and .card-header share one selector list in section-head.css', () => {
  const rules = parseRules(read('src/components/section-head.css'));
  const base = rules.find((r) => r.decls.some((d) => d.prop === 'display'));
  assert.deepEqual(base.selector.split(/\s*,\s*/), ['.nw-section-head', '.panel-header', '.card-header']);
  for (const piece of ['::after', '[data-idx]::before', '[data-idx] > :first-child::before', '> .kanji']) {
    const hit = rules.find((r) => r.selector.split(/\s*,\s*/).filter((s) => s.includes(piece)).length === 3);
    assert.ok(hit, `one shared rule for ${piece}`);
  }
});

// ---- FR-029: spec sheet --------------------------------------------------------------------------

test('FR-029: .kv-note is never --nw-text-disabled (it must stay AA on black)', () => {
  const hits = parseRules(kvRow).filter((r) => /\.kv-note/.test(r.selector) && r.decls.some((d) => d.value.includes('--nw-text-disabled')));
  assert.deepEqual(hits.map((r) => r.selector), []);
});

test('FR-029: .kv-row pads by --nw-pad-scale, aligns to the top, right-aligns the value and tints .kv-swap with the accent', () => {
  assert.match(declsOf(kvRow, '.kv-row').get('padding') ?? '', /var\(--nw-pad-scale\)/);
  assert.equal(declsOf(kvRow, '.kv-row').get('align-items'), 'flex-start');
  assert.equal(declsOf(kvRow, '.kv-row .kv-value').get('text-align'), 'right');
  assert.equal(declsOf(kvRow, '.kv-row .kv-note').get('color'), 'var(--nw-text-mute)');
  assert.equal(declsOf(kvRow, '.kv-row .kv-swap').get('color'), 'var(--nw-chrome)');
});

// ---- Every US5 file: tokens only, no thin outline --------------------------------------------------

// The piece files of US5, extended by each later task (display, chip, kanji index, grain, halftone...).
const US5_FILES = ['src/components/section-head.css'];

const COLOUR_LITERAL = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
const NAMED_COLOUR = /(?<![\w-])(?:white|black|red|green|blue|yellow|orange|purple|gray|grey|cyan|magenta|pink|silver|gold)(?![\w-])/i;
// Custom properties a US5 file may read: the --nw- tokens, plus the v1 scales that v3 keeps and that
// the mockup uses as they are (spacing, type scale, fonts, letter spacing, radius).
const READABLE = /^--(?:nw-|sp-|text-|font-|ls-|radius-)/;

test('the US5 file list points at files that exist', () => {
  for (const f of US5_FILES) assert.ok(existsSync(new URL(f, root)), `${f} exists`);
});

test('US5 files use no colour literal, read only system custom properties and declare only --nw- ones', () => {
  const hits = [];
  for (const file of US5_FILES) {
    const code = stripComments(read(file));
    for (const rule of parseRules(read(file))) {
      for (const d of rule.decls) {
        if (d.prop.startsWith('--') && !d.prop.startsWith('--nw-')) hits.push(`${file}:${d.line}  declares ${d.prop}`);
        if (COLOUR_LITERAL.test(d.value) || NAMED_COLOUR.test(d.value)) hits.push(`${file}:${d.line}  colour literal in ${d.prop}: ${d.value}`);
      }
    }
    for (const m of code.matchAll(/var\(\s*(--[\w-]+)/g)) {
      if (!READABLE.test(m[1])) hits.push(`${file}:${code.slice(0, m.index).split('\n').length}  reads ${m[1]}`);
    }
  }
  assert.deepEqual(hits, [], hits.join('\n'));
});

test('US5 files set no outline narrower than 2px (the focus ring contract)', () => {
  const hits = [];
  for (const file of US5_FILES) {
    for (const rule of parseRules(read(file))) {
      for (const d of rule.decls.filter((x) => /^outline(-width)?$/.test(x.prop))) {
        const width = /(?<![\w.-])(\d*\.?\d+)px/.exec(d.value);
        if (width && Number(width[1]) < 2) hits.push(`${file}:${d.line}  ${rule.selector} { ${d.prop}: ${d.value} }`);
      }
    }
  }
  assert.deepEqual(hits, [], hits.join('\n'));
});

test('the colour and outline scans catch what they are for', () => {
  assert.ok(COLOUR_LITERAL.test('1px solid #fff'));
  assert.ok(COLOUR_LITERAL.test('rgba(0, 0, 0, 0.5)'));
  assert.ok(!COLOUR_LITERAL.test('var(--nw-line)'));
  assert.ok(NAMED_COLOUR.test('1px solid red'));
  assert.ok(!NAMED_COLOUR.test('var(--nw-text-default)'));
  assert.ok(READABLE.test('--sp-3') && READABLE.test('--nw-hairline') && !READABLE.test('--void'));
});

// ---- FR-038: the layout control sheet --------------------------------------------------------------

test('FR-038: the layout control sheet exists, says which commit it restores and restores each opened component', () => {
  const sheet = read('docs/design/v3/us5-layout-control.css');
  assert.match(sheet, /3a63a86/, 'names the pre-US5 tip it restores');
  for (const selector of ['.panel', '.panel-body', '.panel-header', '.card-header', '.kv-row', '.nw-section-head']) {
    assert.ok(parseRules(sheet).some((r) => r.selector.split(/\s*,\s*/).includes(selector)), `restores ${selector}`);
  }
});

test('FR-038: every cascade category is scoped to a page and a path and explains geometry only', () => {
  const { categories } = JSON.parse(read('docs/design/v3/change-inventory.json'));
  const cascade = categories.filter((c) => c.kind === 'cascade');
  assert.ok(cascade.length > 0);
  for (const c of cascade) {
    assert.ok(c.match.page && c.match.path, `${c.id} has page and path`);
    assert.ok(c.match.path !== '.', `${c.id} path is not a catch-all`);
  }
});

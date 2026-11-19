import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { CASCADE_PROPS } from '../scripts/parity/lib/diff.mjs';

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

const HEAD = /^(\.panel-header|\.card-header|\.nw-section-head)(?![\w-])/;

// Every stylesheet source, not just the three that used to own the old header rules.
const sources = ['src/base/', 'src/components/', 'src/utilities/'].flatMap((dir) =>
  readdirSync(new URL(dir, root)).filter((f) => f.endsWith('.css')).map((f) => `${dir}${f}`));

test('FR-030: the section-head look is in section-head.css only; elsewhere in src, panel.css and card.css keep the header padding and nothing else', () => {
  assert.ok(sources.includes('src/components/section-head.css') && sources.length > 30, 'the scan covers every source');
  const offenders = [];
  for (const file of sources.filter((f) => f !== 'src/components/section-head.css')) {
    for (const rule of parseRules(read(file))) {
      if (!rule.selector.split(/\s*,\s*/).some((s) => HEAD.test(s))) continue;
      for (const d of rule.decls.filter((x) => x.prop !== 'padding')) offenders.push(`${file}:${d.line}  ${rule.selector} { ${d.prop} }`);
    }
  }
  assert.deepEqual(offenders, [], `header rules outside section-head.css:\n${offenders.join('\n')}`);
  const padded = sources.filter((f) => parseRules(read(f)).some((r) => r.selector.split(/\s*,\s*/).some((s) => HEAD.test(s))));
  assert.deepEqual(padded, ['src/components/card.css', 'src/components/panel.css', 'src/components/section-head.css']);
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
const PIECES = {
  display: 'src/components/display.css',
  chip: 'src/components/chip.css',
  linkArrow: 'src/components/link-arrow.css',
  kanjiIndex: 'src/components/kanji-index.css',
  accordion: 'src/components/accordion.css',
  reticle: 'src/components/reticle.css',
  halftone: 'src/components/halftone.css',
  barcode: 'src/components/barcode.css',
  wordmark: 'src/components/wordmark.css',
  grain: 'src/components/grain.css',
};
const US5_FILES = ['src/components/section-head.css', ...Object.values(PIECES)];

const COLOUR_LITERAL = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
// The only literals a US5 file may carry: the halftone's black and white are a mask, not palette
// (FR-030), and the wordmark's fade is a luminance-free alpha mask that needs one opaque stop.
const MASK_LITERAL = /#(?:000|fff)\b/gi;
const MASK_ALLOWED = {
  'src/components/halftone.css': (prop) => ['background', 'background-image'].includes(prop),
  'src/components/wordmark.css': (prop) => ['-webkit-mask-image', 'mask-image'].includes(prop),
};
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
        const value = MASK_ALLOWED[file]?.(d.prop) ? d.value.replace(MASK_LITERAL, '') : d.value;
        if (COLOUR_LITERAL.test(value) || NAMED_COLOUR.test(value)) hits.push(`${file}:${d.line}  colour literal in ${d.prop}: ${d.value}`);
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
  assert.ok(COLOUR_LITERAL.test('#000') && '#000 30%'.replace(MASK_LITERAL, '') === ' 30%', 'only #000 and #fff are masks');
  assert.ok(COLOUR_LITERAL.test('#d8d2c8'.replace(MASK_LITERAL, '')), 'a palette hex is never a mask');
});

// ---- T074/T075: display, chip, arrow link, kanji index, accordion ----------------------------------

const piece = (key) => (existsSync(new URL(PIECES[key], root)) ? read(PIECES[key]) : '');

/** The text between the braces of the first block whose header contains `header`, comments stripped. */
function blockOf(text, header) {
  const code = stripComments(text);
  const at = code.indexOf(header);
  if (at < 0) return null;
  const open = code.indexOf('{', at);
  let depth = 0;
  for (let i = open; i < code.length; i++) {
    if (code[i] === '{') depth++;
    else if (code[i] === '}' && --depth === 0) return { inner: code.slice(open + 1, i), outer: code.slice(0, at) + code.slice(i + 1) };
  }
  return null;
}

test('FR-030: src/index.css imports display, chip, link-arrow, kanji-index and accordion once each; kanji-index is not index.css', () => {
  const imports = [...read('src/index.css').matchAll(/@import\s+"\.\/(components\/[\w-]+\.css)";/g)].map((m) => m[1]);
  for (const file of Object.values(PIECES)) {
    const rel = file.replace('src/', '');
    assert.equal(imports.filter((f) => f === rel).length, 1, `${rel} imported once`);
  }
  assert.ok(!imports.includes('components/index.css'), 'no components/index.css');
});

test('FR-030: .nw-display is the scaled display face and .nw-lede the muted lead paragraph', () => {
  const display = declsOf(piece('display'), '.nw-display');
  assert.equal(display.get('font-family'), 'var(--font-title)');
  assert.equal(display.get('font-weight'), '900');
  assert.equal(display.get('transform'), 'scaleX(.82)');
  assert.equal(display.get('color'), 'var(--nw-text-strong)');
  assert.equal(declsOf(piece('display'), '.nw-lede').get('color'), 'var(--nw-text-mute)');
});

test('FR-030: .nw-chip reads its own border token and the shared tick; .nw-chip-solid reads the action tokens and sets the hover text colour', () => {
  const chip = piece('chip');
  assert.match(declsOf(chip, '.nw-chip').get('border') ?? '', /var\(--nw-chip-line\)/, 'the border reads --nw-chip-line');
  assert.doesNotMatch(declsOf(chip, '.nw-chip').get('border') ?? '', /--nw-line-strong/);
  assert.match(declsOf(chip, '.nw-chip').get('transition') ?? '', /var\(--nw-tick\)/);
  const solid = declsOf(chip, '.nw-chip-solid');
  assert.equal(solid.get('background'), 'var(--nw-action)');
  assert.equal(solid.get('color'), 'var(--nw-action-text)');
  const hot = declsOf(chip, '.nw-chip-solid:hover');
  assert.equal(hot.get('background'), 'var(--nw-action-hot)');
  assert.equal(hot.get('color'), 'var(--nw-action-text)', 'a:hover in reset.css must not recolour an <a class="nw-chip-solid">');
  assert.ok(declsOf(chip, '.nw-chip .sq').has('background') && declsOf(chip, '.nw-chip .star').has('color'));
});

test('FR-030: .nw-link-arrow is a chrome label link that turns hot on hover, on the shared tick', () => {
  const link = declsOf(piece('linkArrow'), '.nw-link-arrow');
  assert.equal(link.get('color'), 'var(--nw-chrome)');
  assert.match(link.get('transition') ?? '', /var\(--nw-tick\)/);
  assert.equal(declsOf(piece('linkArrow'), '.nw-link-arrow:hover').get('color'), 'var(--nw-chrome-hot)');
});

test('FR-033: .nw-index-row is a three-track grid and every child names its own column, so a hidden kanji leaves the grid as it was', () => {
  const index = piece('kanjiIndex');
  assert.equal(declsOf(index, '.nw-index-row').get('display'), 'grid');
  assert.match(declsOf(index, '.nw-index-row').get('grid-template-columns') ?? '', /^28px 1fr auto$/);
  const want = { '.kanji': '1', '.name': '2', '.count': '3', '.items': '2 / 4' };
  for (const [child, column] of Object.entries(want)) {
    assert.equal(declsOf(index, `.nw-index-row ${child}`).get('grid-column'), column, `${child} grid-column`);
    assert.ok(declsOf(index, `.nw-index-row ${child}`).has('grid-row'), `${child} grid-row`);
  }
});

test('FR-034: the index-row kanji glows on hover by --nw-kanji-glow and never reads --nw-glow', () => {
  const hover = declsOf(piece('kanjiIndex'), '.nw-index-row:hover .kanji');
  assert.match(hover.get('text-shadow') ?? '', /var\(--nw-kanji-glow\)/);
  assert.doesNotMatch(hover.get('text-shadow') ?? '', /var\(--nw-glow\)/);
});

test('FR-032: the accordion is native <details>/<summary>: no script hook, the 2px ring kept, no marker', () => {
  const accordion = piece('accordion');
  assert.ok(declsOf(accordion, '.nw-accordion details').has('border-top'));
  assert.ok(declsOf(accordion, '.nw-accordion summary').has('cursor'));
  assert.equal(declsOf(accordion, '.nw-accordion summary:focus-visible').get('outline-offset'), '4px');
  assert.ok(![...declsOf(accordion, '.nw-accordion summary:focus-visible').keys()].some((p) => p.startsWith('outline') && p !== 'outline-offset'), 'only the offset moves; width and colour stay the global ring');
  assert.doesNotMatch(accordion, /\[data-(open|state)|aria-expanded|:target/, 'no attribute a script would have to set');
});

test('FR-032: the accordion animates only inside @supports (interpolate-size), on the shared sweep tokens, and is instant elsewhere', () => {
  const accordion = piece('accordion');
  const supports = blockOf(accordion, '@supports (interpolate-size: allow-keywords)');
  assert.ok(supports, 'an @supports (interpolate-size: allow-keywords) block');
  assert.doesNotMatch(supports.outer, /details-content|interpolate-size/, 'nothing about the animation sits outside @supports');
  const closed = declsOf(supports.inner, '.nw-accordion details::details-content');
  const open = declsOf(supports.inner, '.nw-accordion details[open]::details-content');
  assert.match(closed.get('transition') ?? '', /block-size var\(--nw-sweep-out\)/, 'closing reads --nw-sweep-out');
  assert.match(closed.get('transition') ?? '', /content-visibility var\(--nw-sweep-out\) allow-discrete/);
  assert.match(open.get('transition') ?? '', /block-size var\(--nw-sweep\)(?!-)/, 'opening reads --nw-sweep');
  assert.match(open.get('transition') ?? '', /content-visibility var\(--nw-sweep\)(?!-) allow-discrete/);
  assert.equal(closed.get('block-size'), '0');
  assert.equal(open.get('block-size'), 'auto');
});

test('Constitution V: every transition in the US5 files reads a shared motion token, never a literal duration', () => {
  const hits = [];
  for (const file of US5_FILES) {
    for (const rule of parseRules(read(file))) {
      for (const d of rule.decls.filter((x) => /^transition(-duration)?$/.test(x.prop))) {
        if (!/var\(--nw-(tick|sweep|uplink)(-out)?\)/.test(d.value) || /(?<![\w-])\d*\.?\d+m?s\b/.test(d.value)) hits.push(`${file}:${d.line}  ${rule.selector} { ${d.prop}: ${d.value} }`);
      }
    }
  }
  assert.deepEqual(hits, [], hits.join('\n'));
});

test('Constitution V: the reduced-motion block zeroes the scale that every shared motion token multiplies', () => {
  const tokens = JSON.parse(read('src/tokens/tokens.json'));
  const byCss = new Map();
  (function walk(node) {
    if (node === null || typeof node !== 'object') return;
    const css = node.$extensions?.['dev.cativo.nightwire']?.css;
    if (css) byCss.set(css, node);
    for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) walk(v);
  })(tokens);
  assert.equal(byCss.get('--nw-motion-scale').$extensions['dev.cativo.nightwire'].reducedMotion, 0);
  for (const name of ['--nw-tick', '--nw-sweep', '--nw-sweep-out']) {
    assert.match(String(byCss.get(name)?.$value), /var\(--nw-motion-scale\)/, `${name} is scaled by --nw-motion-scale`);
  }
});

// ---- T076: reticle, halftone, barcode, wordmark, grain ---------------------------------------------

const T076 = ['reticle', 'halftone', 'barcode', 'wordmark', 'grain'];

test('FR-028/FR-030/FR-031: src/index.css imports reticle, halftone, barcode, wordmark and grain once each', () => {
  const imports = [...read('src/index.css').matchAll(/@import\s+"\.\/(components\/[\w-]+\.css)";/g)].map((m) => m[1]);
  for (const key of T076) {
    const rel = PIECES[key].replace('src/', '');
    assert.equal(imports.filter((f) => f === rel).length, 1, `${rel} imported once`);
  }
});

test('FR-028: .nw-reticle draws its frame with background-image only, so a .panel keeps its background colour', () => {
  const reticle = piece('reticle');
  const rules = parseRules(reticle).filter((r) => r.selector.split(/\s*,\s*/).some((s) => /^\.nw-reticle(?![\w-])/.test(s)) || /^\.panel\.nw-reticle/.test(r.selector));
  assert.ok(rules.length > 0, 'the reticle rules exist');
  for (const r of rules) {
    const bad = r.decls.filter((d) => d.prop === 'background' || d.prop === 'background-color');
    assert.deepEqual(bad.map((d) => `${r.selector} { ${d.prop} }`), [], 'no background shorthand or colour');
  }
  const d = declsOf(reticle, '.nw-reticle');
  assert.ok(d.has('background-image'), 'the corners are a background-image');
  assert.match(d.get('border') ?? '', /var\(--nw-hairline\) solid var\(--nw-line\)/);
  assert.equal(declsOf(reticle, '.panel.nw-reticle').get('border-radius'), '0');
});

test('FR-028: the reticle arms and the frame use --nw-hairline and --nw- custom properties only', () => {
  const reticle = piece('reticle');
  assert.doesNotMatch(stripComments(reticle), /(?<![\w.-])1px/, 'no literal 1px: the hairline token');
  for (const rule of parseRules(reticle)) {
    for (const d of rule.decls.filter((x) => x.prop.startsWith('--'))) assert.match(d.prop, /^--nw-reticle-/, `${d.prop} is a --nw-reticle- property`);
  }
  const d = declsOf(reticle, '.nw-reticle');
  assert.ok(d.has('--nw-reticle-c') && d.has('--nw-reticle-arm'));
});

test('FR-028: the reticle parts ship as .nw-reticle-meta, -vlabel, -stamp and -foot; the stamp leaves with the kanji at archive', () => {
  const reticle = piece('reticle');
  for (const part of ['meta', 'vlabel', 'stamp', 'foot']) assert.ok(declsOf(reticle, `.nw-reticle-${part}`).size > 0, `.nw-reticle-${part}`);
  assert.equal(declsOf(reticle, '.nw-reticle-stamp').get('display'), 'var(--nw-kanji-display)');
  assert.equal(declsOf(reticle, '.nw-reticle-meta').get('color'), 'var(--nw-text-mute)');
  assert.equal(declsOf(reticle, '.nw-reticle-vlabel').get('color'), 'var(--nw-text-mute)');
});

test('FR-030: the halftone has a grey layer, three tints and a fine size; the bone tint reads --nw-bone', () => {
  const halftone = piece('halftone');
  assert.ok(declsOf(halftone, '.nw-halftone').size > 0 && declsOf(halftone, '.nw-halftone-layer').size > 0);
  assert.equal(declsOf(halftone, '.nw-halftone-chrome').get('--nw-halftone-tint'), 'var(--nw-chrome)');
  assert.equal(declsOf(halftone, '.nw-halftone-data').get('--nw-halftone-tint'), 'var(--nw-data)');
  assert.equal(declsOf(halftone, '.nw-halftone-bone').get('--nw-halftone-tint'), 'var(--nw-bone)');
  assert.equal(declsOf(halftone, '.nw-halftone-fine .nw-halftone-layer').get('--nw-halftone-dot'), '4px');
  assert.equal(declsOf(halftone, '.nw-halftone-layer').get('--nw-halftone-dot'), '6px');
});

test('FR-030: the halftone carries no colour literal except the #000 and #fff of its masks', () => {
  const literals = [...stripComments(piece('halftone')).matchAll(/#[0-9a-f]{3,8}\b/gi)].map((m) => m[0].toLowerCase());
  assert.ok(literals.length > 0, 'the masks are there');
  assert.deepEqual(literals.filter((l) => l !== '#000' && l !== '#fff'), []);
});

test('FR-030: .nw-barcode and .nw-wordmark read the text and line tokens; the wordmark outline is a hairline', () => {
  const barcode = declsOf(piece('barcode'), '.nw-barcode');
  assert.equal(barcode.get('color'), 'var(--nw-text-default)');
  assert.match(barcode.get('background') ?? '', /repeating-linear-gradient\(90deg/);
  const wordmark = declsOf(piece('wordmark'), '.nw-wordmark');
  assert.equal(wordmark.get('color'), 'transparent');
  assert.equal(wordmark.get('-webkit-text-stroke'), 'var(--nw-hairline) var(--nw-line-chrome)');
  assert.equal(wordmark.get('font-family'), 'var(--font-title)');
});

test('FR-031: .nw-grain::before never takes pointer events, reads --nw-grain, and forced colours hides it', () => {
  const grain = piece('grain');
  const d = declsOf(grain, '.nw-grain::before');
  assert.equal(d.get('pointer-events'), 'none');
  assert.equal(d.get('opacity'), 'var(--nw-grain)');
  assert.equal(d.get('position'), 'fixed');
  const forced = blockOf(grain, '@media (forced-colors: active)');
  assert.ok(forced, 'a forced-colors media block');
  assert.equal(declsOf(forced.inner, '.nw-grain::before').get('display'), 'none');
  assert.doesNotMatch(forced.outer, /display:\s*none/, 'the hiding is only inside the block');
});

// ---- FR-038: the layout control sheet --------------------------------------------------------------

test('FR-038: the layout control sheet exists, says which commit it restores and restores each opened component', () => {
  const sheet = read('docs/design/v3/us5-layout-control.css');
  assert.match(sheet, /3a63a86/, 'names the pre-US5 tip it restores');
  for (const selector of ['.panel', '.panel-body', '.panel-header', '.card-header', '.kv-row', '.nw-section-head']) {
    assert.ok(parseRules(sheet).some((r) => r.selector.split(/\s*,\s*/).includes(selector)), `restores ${selector}`);
  }
});

test('FR-038: the control sheet also resets every piece T074/T075 added, one selector per class the cascade category covers', () => {
  const sheet = parseRules(read('docs/design/v3/us5-layout-control.css'));
  const restored = (selector) => sheet.some((r) => r.selector.split(/\s*,\s*/).includes(selector));
  for (const selector of [
    '.nw-display', '.nw-lede', '.nw-chip', '.nw-chip-solid', '.nw-chip .sq', '.nw-link-arrow',
    '.nw-index', '.nw-index-row', '.nw-index-row .kanji', '.nw-index-row .name', '.nw-index-row .count', '.nw-index-row .items',
    '.nw-accordion details', '.nw-accordion summary', '.nw-accordion summary::after', '.nw-accordion .answer',
  ]) assert.ok(restored(selector), `restores ${selector}`);
});

test('FR-038: the control sheet also resets the T076 pieces (reticle and its parts, halftone, barcode, wordmark)', () => {
  const sheet = parseRules(read('docs/design/v3/us5-layout-control.css'));
  const restored = (selector) => sheet.some((r) => r.selector.split(/\s*,\s*/).includes(selector));
  for (const selector of [
    '.nw-reticle', '.panel.nw-reticle', '.nw-reticle-meta', '.nw-reticle-vlabel', '.nw-reticle-stamp', '.nw-reticle-foot',
    '.nw-halftone', '.nw-halftone-layer', '.nw-halftone-layer img', '.nw-barcode', '.nw-wordmark',
  ]) assert.ok(restored(selector), `restores ${selector}`);
});

test('FR-038: the cascade category for the new pieces pins no value, names only geometry and is scoped to the US5 wrapper of the fixture', () => {
  const { categories } = JSON.parse(read('docs/design/v3/change-inventory.json'));
  const c = categories.find((x) => x.id === 'cascade-us5-pieces-fixture-coverage-all');
  assert.ok(c, 'the category exists');
  assert.equal(c.kind, 'cascade');
  assert.equal(c.match.page, 'scripts/parity/fixtures/coverage.html');
  assert.match(c.match.path, /fixture-us5/);
  for (const piece of ['nw-display', 'nw-lede', 'nw-chip', 'nw-link-arrow', 'nw-index', 'nw-index-row', 'nw-accordion', 'nw-reticle', 'nw-halftone', 'nw-wordmark']) assert.ok(c.match.path.includes(piece), `path names ${piece}`);
});

test('FR-038: the reticle parts that are absolutely positioned get their own cascade category for resolved offsets, scoped to those two parts; the offsets the rules set are pinned', () => {
  const { categories } = JSON.parse(read('docs/design/v3/change-inventory.json'));
  const c = categories.find((x) => x.id === 'cascade-us5-reticle-parts-fixture-coverage-all');
  assert.ok(c, 'the category exists');
  assert.equal(c.kind, 'cascade');
  assert.match(c.match.path, /nw-reticle-stamp\|nw-reticle-vlabel/);
  assert.doesNotMatch(c.match.path, /nw-chip|nw-display|nw-halftone|nw-wordmark/, 'scoped to the two parts only');
  const pinned = (id) => categories.find((x) => x.id === id);
  assert.equal(pinned('nw-reticle-stamp-right').match.new, '^24px$');
  assert.equal(pinned('nw-reticle-stamp-top').match.new, '^56px$');
  assert.equal(pinned('nw-reticle-vlabel-left').match.new, '^6px$');
  const at = (id) => categories.findIndex((x) => x.id === id);
  assert.ok(at('nw-reticle-stamp-right') < at('cascade-us5-reticle-parts-fixture-coverage-all'), 'pinned before the cascade category');
});

test('FR-028/FR-030/FR-031: every new T076 pseudo-element and piece has an old-to-new category pinned to one pair', () => {
  const { categories } = JSON.parse(read('docs/design/v3/change-inventory.json'));
  for (const id of ['nw-halftone-after-pseudo', 'nw-halftone-layer-after-pseudo', 'nw-grain-pseudo']) {
    const c = categories.find((x) => x.id === id);
    assert.ok(c, `${id} exists`);
    assert.equal(c.match.old, '^<missing>$');
    assert.equal(c.match.new, '^present$');
  }
  const t076 = categories.filter((c) => /^nw-(reticle|halftone|barcode|wordmark|grain)/.test(c.id) && !c.kind);
  assert.ok(t076.length > 90, 'the T076 facts are there');
  for (const c of t076) assert.ok(c.match.old && c.match.new && c.match.path && c.match.page, `${c.id} pins old, new, path and page`);
});

test('the coverage fixture has markup for every class the new pieces add, inside the US5 wrapper', () => {
  const html = read('scripts/parity/fixtures/coverage.html');
  const wrapper = html.slice(html.indexOf('class="fixture-us5"'));
  for (const cls of ['nw-display', 'nw-lede', 'nw-chip', 'nw-chip-solid', 'sq', 'star', 'nw-link-arrow', 'nw-index', 'nw-index-row', 'kanji', 'name', 'count', 'items', 'nw-accordion', 'answer']) {
    assert.match(wrapper, new RegExp(`class="[^"]*\\b${cls}\\b`), `.${cls} is on the fixture`);
  }
  assert.equal((wrapper.match(/<details/g) ?? []).length >= 2 && /<details open>/.test(wrapper) && /<details>/.test(wrapper), true, 'one open and one closed <details>');
});

test('the coverage fixture has markup for every T076 class, inside the US5 wrapper', () => {
  const html = read('scripts/parity/fixtures/coverage.html');
  const wrapper = html.slice(html.indexOf('class="fixture-us5"'));
  for (const cls of [
    'nw-reticle', 'nw-reticle-meta', 'nw-reticle-vlabel', 'nw-reticle-stamp', 'nw-reticle-foot', 'nw-halftone', 'nw-halftone-layer',
    'nw-halftone-chrome', 'nw-halftone-data', 'nw-halftone-bone', 'nw-halftone-fine', 'nw-barcode', 'nw-wordmark', 'nw-grain',
  ]) assert.match(wrapper, new RegExp(`class="[^"]*\\b${cls}\\b`), `.${cls} is on the fixture`);
  assert.match(wrapper, /class="[^"]*\bpanel\b[^"]*\bnw-reticle\b/, 'a .panel.nw-reticle');
});

test('FR-038: every cascade category explains geometry only: page and path set, props that are all in CASCADE_PROPS, ancestors limited to height, origin and row tracks', () => {
  const { categories } = JSON.parse(read('docs/design/v3/change-inventory.json'));
  const cascade = categories.filter((c) => c.kind === 'cascade');
  assert.ok(cascade.length > 0);
  for (const c of cascade) {
    assert.ok(c.match.page && c.match.path, `${c.id} has page and path`);
    assert.ok(c.match.path !== '.', `${c.id} path is not a catch-all`);
    const names = c.match.prop.replace(/^\^\(?(?:\?:)?/, '').replace(/\)?\$$/, '').split('|');
    for (const n of names) assert.ok(CASCADE_PROPS.includes(n), `${c.id}: ${n} is not a geometric property`);
    assert.equal(new Set(names).size, names.length, `${c.id} lists a property twice`);
    if (c.id.includes('page-box')) assert.ok(!names.some((n) => /^(top|right|bottom|left|inset-.*|margin-.*|aspect-ratio|grid-template-columns|width|inline-size)$/.test(n)), `${c.id}: an ancestor box only changes in height, origin and row tracks`);
    else assert.ok(names.length <= CASCADE_PROPS.length);
    assert.ok(!c.match.old && !c.match.new, `${c.id} pins no value`);
  }
});

test('the cascade prop reader catches what it is for', () => {
  const read2 = (p) => p.replace(/^\^\(?(?:\?:)?/, '').replace(/\)?\$$/, '').split('|');
  assert.deepEqual(read2('^width$'), ['width']);
  assert.deepEqual(read2('^(width|height)$'), ['width', 'height']);
  assert.deepEqual(read2('^(?:top|left)$'), ['top', 'left']);
});

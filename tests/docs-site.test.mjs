import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { docsCounts } from '../apps/docs/build-counts.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// FR-022 / T058: the docs site moves in lockstep with v3. Token values come from tokens.json
// (Principle II), the v2 "NEW" chrome is gone, stale strings are fixed, and decorative glow and
// blue chrome are removed. The sources are read as text; the build is checked separately by
// `npm run docs:build`.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = 'apps/docs/src';
const read = (rel) => readFileSync(path.join(root, rel), 'utf8');

function walk(rel) {
  const out = [];
  for (const name of readdirSync(path.join(root, rel))) {
    const child = `${rel}/${name}`;
    if (statSync(path.join(root, child)).isDirectory()) out.push(...walk(child));
    else out.push(child);
  }
  return out;
}
const sources = walk(SRC).filter((f) => /\.(tsx?|css)$/.test(f));

// Files under apps/docs/src that match `re`, as "file:line" offenders.
function offenders(re, files = sources) {
  const hits = [];
  for (const file of files) {
    read(file).split('\n').forEach((line, i) => {
      if (re.test(line)) hits.push(`${file}:${i + 1}: ${line.trim()}`);
    });
  }
  return hits;
}

test('should_not_carry_the_new_in_v2_badge_or_its_flags', () => {
  assert.equal(existsSync(path.join(root, SRC, 'components/NewBadge.tsx')), false, 'NewBadge.tsx still exists');
  assert.deepEqual(offenders(/NewBadge|isNewV2|NEW IN V2/), []);
});

test('should_not_label_content_as_new_against_v1_or_v2', () => {
  // `<!-- new -->` code comments and "NEW" tier notes compared the page against an older release.
  assert.deepEqual(offenders(/<!--\s*new\s*-->|\bNEW\b\s*(—|tier|\))|\(NEW/), []);
});

test('should_import_motion_and_intensity_values_from_tokens_json', () => {
  const data = read(`${SRC}/data/index.ts`);
  assert.match(data, /from\s+'(\.\.\/)+src\/tokens\/tokens\.json'/, 'data/index.ts does not import src/tokens/tokens.json');
  assert.doesNotMatch(data, /cubic-bezier\(/, 'a hand-written easing curve is left in data/index.ts');
  const knobLiterals = data.split('\n').filter((l) => /'--nw-[a-z-]+':\s*'/.test(l));
  assert.deepEqual(knobLiterals, [], 'an intensity knob value is still written by hand');
  const motionLiterals = data.split('\n').filter((l) => /value:\s*'\d+(\.\d+)?m?s\b/.test(l));
  assert.deepEqual(motionLiterals, [], 'a motion duration is still written by hand');
});

test('should_not_show_stale_package_or_version_strings', () => {
  assert.deepEqual(offenders(/nightwire-css/), [], 'old package name');
  assert.deepEqual(offenders(/Nightwire v1\.0|DESIGN SYSTEM v1\.0/), [], 'stale v1.0 label');
  const ticker = read(`${SRC}/components/Ticker.tsx`);
  assert.doesNotMatch(ticker, /COMPONENTS: 24\+|TOKENS: 42/, 'ticker counts are stale');
  const overview = read(`${SRC}/pages/OverviewPage.tsx`);
  assert.doesNotMatch(overview, /m-value">(42|24\+)</, 'overview counts are stale');
  const quick = read(`${SRC}/pages/QuickStartPage.tsx`);
  assert.match(quick, /npm install @cativo23\/nightwire/, 'quick start does not name the published package');
});

test('should_not_compare_with_v1_or_v2_on_the_buttons_layer2_and_intensity_pages', () => {
  for (const page of ['ButtonsPage', 'Layer2TokensPage', 'IntensityPage']) {
    const hits = offenders(/\bv[12]\b|\bwas:|<!--\s*was\b/i, [`${SRC}/pages/${page}.tsx`]);
    assert.deepEqual(hits, [], `${page} still carries v1/v2 comparison copy`);
  }
  assert.doesNotMatch(read(`${SRC}/App.tsx`), /v2 transversal/);
});

test('should_not_use_a_decorative_text_shadow_in_the_docs_stylesheets', () => {
  const css = sources.filter((f) => f.endsWith('.css'));
  assert.deepEqual(offenders(/text-shadow/, css), []);
});

test('should_keep_blue_chrome_for_links_only_not_decorative_borders_and_labels', () => {
  for (const file of ['App.tsx', 'pages/OverviewPage.tsx', 'console.css']) {
    assert.deepEqual(offenders(/primary-dim/, [`${SRC}/${file}`]), [], `${file} has decorative primary-dim chrome`);
  }
  // The sidebar is neutral too: its GitHub link is muted like the rest of the footer.
  const sidebar = offenders(/primary-dim/, [`${SRC}/components/Sidebar.tsx`]);
  assert.deepEqual(sidebar, [], `Sidebar.tsx has decorative primary-dim chrome: ${sidebar.join(' | ')}`);
});

test('should_dress_the_docs_shell_in_the_mockup_chrome_not_the_blue_logotype', () => {
  const app = read(`${SRC}/App.tsx`);
  assert.match(app, /className="brand"[\s\S]*夜[\s\S]*nightwire/, 'top bar lacks the 夜 nightwire wordmark');
  assert.match(app, /nw-chip nw-chip-solid/, 'top bar lacks the solid INSTALL chip');
  assert.doesNotMatch(app, /org-mark/, 'the wide-tracked org-mark logotype is back');
  const sidebar = read(`${SRC}/components/Sidebar.tsx`);
  assert.doesNotMatch(sidebar, /compressed-title|nw-primary/, 'the sidebar has the blue logotype again');
  assert.match(sidebar, /sidebar-item\$\{isActive \? ' active'/, 'sidebar lost the active state');
  const css = read(`${SRC}/console.css`);
  const active = css.match(/\.sidebar-item\.active \{[^}]*\}/);
  assert.ok(active, 'console.css does not restyle the active sidebar item');
  assert.doesNotMatch(active[0], /primary|chrome/, 'the active sidebar item is filled or marked in blue');
});

test('should_copy_tokens_json_into_the_docs_images_that_now_import_it', () => {
  for (const file of ['apps/docs/Dockerfile', 'apps/docs/Dockerfile.dev']) {
    assert.match(read(file), /src\/tokens\/tokens\.json/, `${file} does not copy tokens.json`);
  }
  assert.match(read('docker-compose.dev.yml'), /src\/tokens\/tokens\.json/, 'dev compose does not mount tokens.json');
});

// The numbers a source file writes as text a reader sees: JSX text nodes and string or template
// literals. Style objects (`fontSize: 36`), numeric props and comments are not text, so a count
// that equals a style number does not collide. A number glued to a unit or word (`36px`, `46rem`)
// is a size, not a count.
function renderedNumbers(source) {
  const spans = [
    ...[...source.matchAll(/>([^<>]+)</g)].map((m) => m[1]),
    ...[...source.matchAll(/'([^'\\\n]*)'|"([^"\\\n]*)"|`([^`]*)`/g)].map((m) => m[1] ?? m[2] ?? m[3]),
  ];
  return spans.flatMap((span) => [...span.matchAll(/(?<![\w.#$-])\d+(?![\w%]|\.\d)/g)].map((m) => Number(m[0])));
}

function hardCodedCounts(source, counts) {
  const wanted = new Set([counts.tokens, counts.components]);
  return renderedNumbers(source).filter((n) => wanted.has(n));
}

test('should_match_a_hard_coded_count_only_in_text_and_strings', () => {
  const counts = { tokens: 134, components: 36 };
  // A style number that equals a count is not a count.
  assert.deepEqual(hardCodedCounts(`<div style={{ fontSize: 36, gap: 134 }}>NIGHTWIRE</div>`, counts), []);
  assert.deepEqual(hardCodedCounts(`<div style={{ fontSize: '36px', width: '134%' }} />`, counts), []);
  assert.deepEqual(hardCodedCounts(`// 36 components, 134 tokens\nconst a = 1;`, counts), []);
  // A real count in JSX text, in a string and in a template literal is.
  assert.deepEqual(hardCodedCounts(`<span>TOKENS: 134</span>`, counts), [134]);
  assert.deepEqual(hardCodedCounts(`const x = '36 components';`, counts), [36]);
  assert.deepEqual(hardCodedCounts('const x = `${a} of 134 tokens`;', counts), [134]);
  assert.deepEqual(hardCodedCounts(`<b>{__NW_TOKEN_COUNT__} of 36</b>`, counts), [36]);
  assert.deepEqual(hardCodedCounts(`<b>{134}</b>`, counts), [134]);
  assert.deepEqual(hardCodedCounts(`<b>{__NW_TOKEN_COUNT__} tokens</b>`, counts), []);
});

// T058 fix 2 (Principle II): the token and component counts are computed at build time.
test('should_compute_the_token_and_component_counts_instead_of_writing_them', () => {
  const counts = docsCounts(root);
  assert.equal(counts.components, readdirSync(path.join(root, 'src/components')).filter((f) => f.endsWith('.css')).length);
  assert.equal(counts.tokens, (read('src/tokens/tokens.json').match(/"css":/g) ?? []).length);
  const users = {
    'components/Ticker.tsx': ['__NW_TOKEN_COUNT__', '__NW_COMPONENT_COUNT__'],
    'components/StatusBar.tsx': ['__NW_TOKEN_COUNT__', '__NW_COMPONENT_COUNT__'],
    'pages/OverviewPage.tsx': ['__NW_TOKEN_COUNT__', '__NW_COMPONENT_COUNT__'],
  };
  for (const [file, defines] of Object.entries(users)) {
    const text = read(`${SRC}/${file}`);
    for (const d of defines) assert.match(text, new RegExp(d), `${file} does not use ${d}`);
    assert.deepEqual(hardCodedCounts(text, counts), [], `${file} hard-codes a count`);
  }
  const vite = read('apps/docs/vite.config.ts');
  assert.match(vite, /__NW_TOKEN_COUNT__/);
  assert.match(vite, /__NW_COMPONENT_COUNT__/);
  assert.match(read('apps/docs/src/vite-env.d.ts'), /__NW_TOKEN_COUNT__[\s\S]*__NW_COMPONENT_COUNT__/);
});

test('should_copy_the_component_stylesheets_into_the_docs_images_that_count_them', () => {
  for (const file of ['apps/docs/Dockerfile', 'apps/docs/Dockerfile.dev']) {
    assert.match(read(file), /COPY src\/components\/ \/app\/src\/components\//, `${file} does not copy src/components`);
  }
  assert.match(read('docker-compose.dev.yml'), /\.\/src\/components:\/app\/src\/components/, 'dev compose does not mount src/components');
});

// ── US5 look (T082) ────────────────────────────────────────────────────────────────────────
// The docs site follows the mockup look: the kanji in a header is a `.kanji`, not a `.tag`; a
// dense console demo opts into `.nw-reticle`; the new pieces have a page; counts follow the build.

const JP = '[\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}ー・]';
test('should_write_the_header_kanji_as_kanji_and_not_as_a_tag', () => {
  // `.tag` is a status or a latin label. A tag that holds any Japanese, alone (`日本語`) or mixed
  // with latin (`構造CSS`, `KV対`), is the kanji of a header.
  const re = new RegExp(`class(?:Name)?="tag"[^>]*>[^<]*${JP}[^<]*</span>`, 'u');
  const hits = sources.filter((f) => f.endsWith('.tsx') && re.test(read(f)));
  assert.deepEqual(hits, [], 'a .tag holds kanji; use .kanji');
  // The two places that take the kanji as a value.
  assert.match(read(`${SRC}/components/PageHead.tsx`), /className="kanji">\{kanji\}/, 'PageHead does not render a .kanji');
  assert.match(read(`${SRC}/pages/Layer2TokensPage.tsx`), /className="kanji">\{kanji\}/, 'Layer2TokensPage does not render a .kanji');
  assert.doesNotMatch(read(`${SRC}/components/PageHead.tsx`), /className="tag"/, 'PageHead renders a .tag');
  // Every page opens with the PageHead (the page title), not a small header that looks like a sub-section.
  const pages = sources.filter((f) => /\/pages\/\w+Page\.tsx$/.test(f));
  assert.equal(pages.length, 19, 'expected 19 docs pages');
  assert.deepEqual(pages.filter((f) => !/<PageHead\b/.test(read(f))), [], 'a page does not open with a PageHead');
  assert.deepEqual(offenders(/SectionTitle/), [], 'SectionTitle is gone; the page title is the PageHead');
  // The same switch in the HTML the pages teach.
  assert.doesNotMatch(read(`${SRC}/pages/PanelsPage.tsx`), /class="tag">日本語タグ/, 'PanelsPage teaches the .tag kanji');
});

test('should_teach_the_two_pixel_gap_for_framed_panels_only', () => {
  const panels = read(`${SRC}/pages/PanelsPage.tsx`);
  assert.doesNotMatch(panels, /8px uppercase headers/, 'PanelsPage still teaches 8px headers');
  assert.doesNotMatch(panels, /2px gaps are standard/, 'PanelsPage still says 2px gaps are standard');
  assert.doesNotMatch(panels, /8px font header/, 'PanelsPage still says 8px font header');
  assert.match(panels, /11px/, 'PanelsPage does not state the 11px header');
  assert.match(panels, /framed/i);
  assert.match(panels, /--sp-8/, 'PanelsPage does not name the open-panel gap');
  // The open panel next to the card is not set 2px apart in the live sample either.
  assert.doesNotMatch(panels, /className="grid-2" style=\{\{ gap: 2,/, 'open panel and card sit 2px apart');
});

test('should_frame_the_panels_of_the_dense_console_sample', () => {
  const templates = read(`${SRC}/pages/TemplatesPage.tsx`);
  assert.doesNotMatch(templates, /class="panel"/, 'the dense console sample has a bare open panel in a 2px grid');
  assert.ok((templates.match(/class="panel nw-reticle"/g) ?? []).length >= 3, 'the sample panels do not opt into nw-reticle');
});

test('should_keep_tag_where_it_is_a_status_or_a_label', () => {
  // The kanji switch must not eat the real tags: statuses and the latin labels stay `.tag`.
  const buttons = read(`${SRC}/pages/ButtonsPage.tsx`);
  for (const status of ['tag-success', 'tag-danger', 'tag-warn', 'tag-info', 'tag-chrome', 'tag-ai']) {
    assert.match(buttons, new RegExp(status), `ButtonsPage lost ${status}`);
  }
  assert.match(read(`${SRC}/pages/QuickStartPage.tsx`), /tag tag-success">Online/);
});

test('should_not_describe_a_panel_as_filled_or_a_card_as_rounded', () => {
  assert.deepEqual(offenders(/Panel fill|border-radius and are intended/), []);
});

test('should_not_hard_code_a_token_count_in_the_event_stream', () => {
  const data = read(`${SRC}/data/index.ts`);
  assert.doesNotMatch(data, /custom properties: \d+ active/);
  assert.match(data, /__NW_TOKEN_COUNT__/);
});

const PIECES = [
  'nw-section-head', 'nw-section-head-chrome', 'nw-display', 'nw-lede', 'nw-chip', 'nw-chip-solid',
  'nw-index', 'nw-index-row', 'nw-accordion', 'nw-link-arrow', 'nw-reticle', 'nw-halftone',
  'nw-halftone-layer', 'nw-barcode', 'nw-wordmark', 'nw-grain',
];

test('should_route_a_page_for_the_new_pieces_and_list_it_in_the_sidebar', () => {
  const page = `${SRC}/pages/PiecesPage.tsx`;
  assert.equal(existsSync(path.join(root, page)), true, 'PiecesPage.tsx is missing');
  const app = read(`${SRC}/App.tsx`);
  assert.match(app, /import \{ PiecesPage \} from '\.\/pages\/PiecesPage'/);
  assert.match(app, /path="\/pieces" element=\{<PiecesPage \/>\}/);
  assert.match(read(`${SRC}/data/index.ts`), /id: 'pieces'/, 'the sidebar does not list the pieces page');
  assert.match(read('apps/docs/README.md'), /PiecesPage\.tsx/, 'the README structure omits PiecesPage');
});

test('should_show_every_new_piece_on_the_pieces_page_and_in_the_registry', () => {
  const page = read(`${SRC}/pages/PiecesPage.tsx`);
  const registry = read(`${SRC}/data/index.ts`);
  for (const cls of PIECES) {
    assert.match(page, new RegExp(`(^|[^\\w-])${cls}([^\\w-]|$)`), `PiecesPage does not show .${cls}`);
  }
  for (const cls of ['nw-section-head', 'nw-display', 'nw-chip', 'nw-index', 'nw-accordion', 'nw-link-arrow', 'nw-reticle', 'nw-halftone', 'nw-barcode', 'nw-wordmark', 'nw-grain']) {
    assert.match(registry, new RegExp(`name: '\\.${cls}`), `the registry does not list .${cls}`);
  }
});

test('should_put_grain_on_the_docs_body_once_and_keep_the_grain_demo_scoped', () => {
  // .nw-grain belongs on <body>, set once in index.html (the v3 look). Nothing toggles it from
  // script, and the Pieces page still demos it in a box instead of flipping the whole site.
  assert.match(read('apps/docs/index.html'), /<body class="nw-grain">/);
  assert.doesNotMatch(read(`${SRC}/main.tsx`), /nw-grain/);
  const page = read(`${SRC}/pages/PiecesPage.tsx`);
  assert.match(page, /<body class="nw-grain">/, 'the page does not show the body hook');
  assert.doesNotMatch(page, /document\.body\.classList/, 'the demo must not put grain on the whole site');
});

test('should_ship_the_halftone_scene_inside_the_docs_app', () => {
  const svg = path.join(root, SRC, 'assets/scene.svg');
  assert.equal(existsSync(svg), true, 'scene.svg is not in apps/docs/src/assets');
  assert.equal(readFileSync(svg, 'utf8'), read('docs/design/v3/scene.svg'), 'scene.svg drifted from docs/design/v3/scene.svg');
});

test('should_opt_the_dense_console_demos_into_the_reticle', () => {
  // The panel is open in v3; a demo that is a console tile keeps its box with .nw-reticle.
  const examples = read(`${SRC}/pages/ExamplesPage.tsx`);
  const panels = examples.match(/className="panel(?:\s[^"]*)?"/g) ?? [];
  assert.ok(panels.length >= 4, 'ExamplesPage lost its console tiles');
  assert.deepEqual(panels.filter((p) => !/nw-reticle/.test(p)), [], 'an ExamplesPage tile is not a .panel.nw-reticle');
  assert.match(read(`${SRC}/pages/PanelsPage.tsx`), /panel nw-reticle/, 'PanelsPage does not show the opt-in frame');
});

// M11: the decorative pieces are hidden from assistive tech, in the markup the page teaches and
// in the markup it renders.
test('should_hide_the_decorative_pieces_from_assistive_tech_on_the_pieces_page', () => {
  const page = read(`${SRC}/pages/PiecesPage.tsx`);
  for (const cls of ['nw-barcode', 'nw-wordmark', 'nw-reticle-stamp', 'nw-reticle-vlabel']) {
    const tags = page.match(new RegExp(`<[a-z]+ [^<>]*class(?:Name)?="${cls}"[^<>]*>`, 'g')) ?? [];
    assert.ok(tags.length >= 2, `PiecesPage shows .${cls} fewer than twice (code and demo)`);
    assert.deepEqual(
      tags.filter((t) => !/aria-hidden="true"/.test(t)),
      [],
      `a .${cls} on PiecesPage is not aria-hidden`,
    );
  }
  assert.match(
    page,
    /<code>aria-hidden=&quot;true&quot;<\/code>[^<]*<code>\.nw-barcode<\/code>/,
    'PiecesPage does not tell the reader to hide the decorative pieces',
  );
});

test('should_not_export_the_unused_v2_component_registry', () => {
  // T058 left COMPONENTS_V2 for Polish: nothing imports it and its rows are the v2-era registry.
  const offenders = sources.filter((f) => /COMPONENTS_V2/.test(read(f)));
  assert.deepEqual(offenders, [], 'COMPONENTS_V2 is still defined or imported');
});

// Neutral-first docs chrome: a docs page does not decorate itself with signal colour. Colour stays
// on the demos (buttons, tags, toasts, state cells) and on chart series, so the allowlist below is
// the full list of files that may set a signal colour inline.
test('should_keep_decorative_signal_colour_out_of_the_docs_page_markup', () => {
  const inlineSignal = /color:\s*'var\(--nw-(cyan|green|purple|yellow|primary|chrome)\b/;
  const allowed = new Set([
    `${SRC}/pages/ButtonsPage.tsx`,   // state of the segmented demo
    `${SRC}/pages/DataPage.tsx`,      // metric, kv and stat colour demos
    `${SRC}/pages/FeedbackPage.tsx`,  // toast triggers, banner and drawer demos
    `${SRC}/pages/IntensityPage.tsx`, // the active-mode column is state
    `${SRC}/pages/PanelsPage.tsx`,    // the node-card status LED line
    `${SRC}/pages/PiecesPage.tsx`,    // the barcode tint demo
    `${SRC}/components/Waveform.tsx`, // series dots of the chart legend
    `${SRC}/components/CodeBlock.tsx`,
  ]);
  const files = sources.filter((f) => f.endsWith('.tsx') && !allowed.has(f));
  assert.deepEqual(offenders(inlineSignal, files), []);
  // Inline code and token-name cells are plain text, not a coloured run.
  assert.deepEqual(offenders(/<code style=\{\{ color/), []);
  assert.deepEqual(offenders(/<td style=\{\{ color: 'var\(--nw-(cyan|green)\)'/), []);
});

test('should_style_the_docs_private_pieces_with_neutral_labels_and_a_quiet_copy_button', () => {
  const css = read(`${SRC}/console.css`);
  const rule = (sel) => {
    const m = css.match(new RegExp(`${sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`));
    assert.ok(m, `${sel} rule missing`);
    return m[1];
  };
  for (const sel of ['.waveform-wrap .readout-label', '.node-card .nc-id', '.color-swatch .swatch-name', '.color-swatch .swatch-hex']) {
    assert.doesNotMatch(rule(sel), /--nw-(primary|cyan|green|chrome)\b/, `${sel} is coloured`);
  }
  assert.doesNotMatch(rule('.node-card .nc-row .val'), /--nw-green/);
  assert.match(rule('.docs-copy'), /--nw-text-mute/);
  assert.match(read(`${SRC}/components/CodeBlock.tsx`), /className="docs-copy"/);
  assert.doesNotMatch(read(`${SRC}/components/CodeBlock.tsx`), /nw-primary/);
  assert.doesNotMatch(read(`${SRC}/pages/OverviewPage.tsx`), /nw-section-head-chrome/);
});

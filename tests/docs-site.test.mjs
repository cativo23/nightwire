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
  // The sidebar keeps primary-dim on its GitHub link, and nowhere else.
  const sidebar = offenders(/primary-dim/, [`${SRC}/components/Sidebar.tsx`]);
  assert.equal(sidebar.length, 1, `Sidebar.tsx should keep primary-dim only on the link: ${sidebar.join(' | ')}`);
});

test('should_copy_tokens_json_into_the_docs_images_that_now_import_it', () => {
  for (const file of ['apps/docs/Dockerfile', 'apps/docs/Dockerfile.dev']) {
    assert.match(read(file), /src\/tokens\/tokens\.json/, `${file} does not copy tokens.json`);
  }
  assert.match(read('docker-compose.dev.yml'), /src\/tokens\/tokens\.json/, 'dev compose does not mount tokens.json');
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
    assert.doesNotMatch(text, new RegExp(`\\b(${counts.tokens}|${counts.components})\\b`), `${file} hard-codes a count`);
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

const CJK = '[\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}ー・\\s]';

test('should_write_the_header_kanji_as_kanji_and_not_as_a_tag', () => {
  // `.tag` is a status. A tag that holds only Japanese is the kanji of a header.
  const re = new RegExp(`class(?:Name)?="tag"[^>]*>${CJK}+</span>`, 'u');
  const hits = sources.filter((f) => f.endsWith('.tsx') && re.test(read(f)));
  assert.deepEqual(hits, [], 'a .tag holds only kanji; use .kanji');
  // The two places that take the kanji as a value.
  assert.match(read(`${SRC}/components/CodeBlock.tsx`), /className="kanji">\{kanji\}/, 'SectionTitle does not render a .kanji');
  assert.match(read(`${SRC}/pages/Layer2TokensPage.tsx`), /className="kanji">\{kanji\}/, 'Layer2TokensPage does not render a .kanji');
  assert.doesNotMatch(read(`${SRC}/components/CodeBlock.tsx`), /className="tag"/, 'SectionTitle still renders a .tag');
  // The same switch in the HTML the pages teach.
  assert.doesNotMatch(read(`${SRC}/pages/PanelsPage.tsx`), /class="tag">日本語タグ/, 'PanelsPage teaches the .tag kanji');
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

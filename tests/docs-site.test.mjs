import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
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

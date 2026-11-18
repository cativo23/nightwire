import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  snapshotKey,
  diffSnapshots,
  diffRecords,
  formatDiff,
  matchCategory,
  classify,
  validateCategories,
} from '../scripts/parity/lib/diff.mjs';

const k = (page, state, path, prop) => snapshotKey({ page, state, path, prop });

const diff = (over = {}) => ({
  page: 'examples/html/workshop.html',
  state: 'operator|rm-off',
  path: 'html>body>.tag',
  prop: 'color',
  old: 'rgb(102, 153, 255)',
  new: 'rgb(68, 119, 204)',
  ...over,
});

// Compile a single raw category the way callers do, through validateCategories.
const compile = (cat) => validateCategories({ baseline: 'git:v2.1.0', categories: [cat] }).categories[0];
const cat = (id, match, description = 'test') => ({ id, description, match });

// --- diffRecords / formatDiff -------------------------------------------------

test('diffRecords splits each difference into page, state, path, prop, old and new', () => {
  const a = new Map([[k('p.html', 'combat|rm-on', 'html>body', 'color'), 'red']]);
  const b = new Map([[k('p.html', 'combat|rm-on', 'html>body', 'color'), 'blue']]);
  assert.deepEqual(diffRecords(a, b), [
    { page: 'p.html', state: 'combat|rm-on', path: 'html>body', prop: 'color', old: 'red', new: 'blue' },
  ]);
});

test('diffRecords marks a key present on one side only as <missing>', () => {
  const a = new Map([[k('p', 's', 'x', 'color'), 'red']]);
  const b = new Map([[k('p', 's', 'x', 'width'), '1px']]);
  assert.deepEqual(diffRecords(a, b), [
    { page: 'p', state: 's', path: 'x', prop: 'color', old: 'red', new: '<missing>' },
    { page: 'p', state: 's', path: 'x', prop: 'width', old: '<missing>', new: '1px' },
  ]);
});

test('formatDiff renders the contract line and diffSnapshots is exactly diffRecords mapped through it', () => {
  const a = new Map([
    [k('b', 's', 'x', 'p'), '1'],
    [k('a', 's', 'x', 'p'), '1'],
    [k('a', 's', 'x', 'q'), 'only-old'],
  ]);
  const b = new Map([
    [k('b', 's', 'x', 'p'), '2'],
    [k('a', 's', 'x', 'p'), '2'],
    [k('a', 's', 'x', 'r'), 'only-new'],
  ]);
  assert.equal(formatDiff(diff()), 'DIFF  examples/html/workshop.html  [operator|rm-off]  html>body>.tag  color  rgb(102, 153, 255) → rgb(68, 119, 204)');
  assert.deepEqual(diffSnapshots(a, b), diffRecords(a, b).map(formatDiff));
});

// --- matchCategory ------------------------------------------------------------

test('matchCategory matches on prop alone when it is the only field', () => {
  const c = compile(cat('colors', { prop: '^color$' }));
  assert.equal(matchCategory(diff(), c), true);
  assert.equal(matchCategory(diff({ prop: 'width' }), c), false);
});

test('matchCategory regexes are unanchored, like RegExp.test', () => {
  const c = compile(cat('any-border', { prop: 'border' }));
  assert.equal(matchCategory(diff({ prop: 'border-top-color' }), c), true);
});

test('matchCategory requires every present field to match', () => {
  const c = compile(
    cat('all-fields', {
      prop: '^color$',
      path: '\\.tag$',
      page: 'examples/html/*.html',
      state: 'operator\\|rm-off',
      old: '^rgb\\(102',
      new: '^rgb\\(68',
    }),
  );
  assert.equal(matchCategory(diff(), c), true);
  assert.equal(matchCategory(diff({ path: 'html>body>.card' }), c), false);
  assert.equal(matchCategory(diff({ page: 'examples/html/sub/workshop.html' }), c), false);
  assert.equal(matchCategory(diff({ state: 'combat|rm-off' }), c), false);
  assert.equal(matchCategory(diff({ old: 'rgb(0, 0, 0)' }), c), false);
  assert.equal(matchCategory(diff({ new: 'rgb(1, 1, 1)' }), c), false);
});

test('matchCategory state: an unescaped | is regex alternation, so only the escaped form pins one label', () => {
  // State labels use | as a separator (`combat|rm-off`, `combat|rm-off|:hover@<path>`). In a
  // JSON regex an unescaped | means "or", so it also matches any label containing the other
  // side. Behaviour pin: do not "fix" this in matchCategory; escape the pipe in the file.
  const loose = compile(cat('loose', { prop: '^color$', state: 'combat|rm-off' }));
  const strict = compile(cat('strict', { prop: '^color$', state: '^combat\\|rm-off' }));
  const archive = diff({ state: 'archive|rm-off' });
  assert.equal(matchCategory(archive, loose), true);
  assert.equal(matchCategory(archive, strict), false);
  assert.equal(matchCategory(diff({ state: 'archive|rm-off|:hover@x' }), loose), true);
  assert.equal(matchCategory(diff({ state: 'combat|rm-off' }), strict), true);
  assert.equal(matchCategory(diff({ state: 'combat|rm-off|:hover@x' }), strict), true);
});

test('matchCategory tests state against the full label, including forced pseudo-state suffixes', () => {
  const c = compile(cat('hover-only', { prop: 'color', state: '\\|:hover@' }));
  assert.equal(matchCategory(diff({ state: 'operator|rm-off|:hover@html>body>a' }), c), true);
  assert.equal(matchCategory(diff({ state: 'operator|rm-off' }), c), false);
});

test('matchCategory matches <missing> values like any other string', () => {
  const c = compile(cat('removed', { prop: '^--legacy-', new: '^<missing>$' }));
  assert.equal(matchCategory(diff({ prop: '--legacy-x', new: '<missing>' }), c), true);
  assert.equal(matchCategory(diff({ prop: '--legacy-x', new: '1px' }), c), false);
});

test('match.page glob: * does not cross a slash', () => {
  const c = compile(cat('g', { prop: 'color', page: 'examples/*/workshop.html' }));
  assert.equal(matchCategory(diff({ page: 'examples/html/workshop.html' }), c), true);
  assert.equal(matchCategory(diff({ page: 'examples/a/b/workshop.html' }), c), false);
});

test('match.page glob: ** crosses slashes', () => {
  const c = compile(cat('g', { prop: 'color', page: 'examples/**/workshop.html' }));
  assert.equal(matchCategory(diff({ page: 'examples/a/b/workshop.html' }), c), true);
  assert.equal(matchCategory(diff({ page: 'other/workshop.html' }), c), false);
});

test('match.page glob: ? matches exactly one non-slash character', () => {
  const c = compile(cat('g', { prop: 'color', page: 'p?.html' }));
  assert.equal(matchCategory(diff({ page: 'p1.html' }), c), true);
  assert.equal(matchCategory(diff({ page: 'p.html' }), c), false);
  assert.equal(matchCategory(diff({ page: 'p/.html' }), c), false);
});

test('match.page glob is anchored to the full page string and treats regex metacharacters literally', () => {
  const c = compile(cat('g', { prop: 'color', page: 'examples/html/*.html' }));
  assert.equal(matchCategory(diff({ page: 'x/examples/html/a.html' }), c), false);
  assert.equal(matchCategory(diff({ page: 'examples/html/a.html.bak' }), c), false);
  // the dot is literal, not "any character"
  assert.equal(matchCategory(diff({ page: 'examples/html/aXhtml' }), c), false);
  const paren = compile(cat('g2', { prop: 'color', page: 'a(1)+[b].html' }));
  assert.equal(matchCategory(diff({ page: 'a(1)+[b].html' }), paren), true);
});

// --- classify -----------------------------------------------------------------

test('classify returns per-category counts in category order, with unused categories at 0', () => {
  const { categories } = validateCategories({
    baseline: 'git:v2.1.0',
    categories: [
      cat('colors', { prop: '^color$' }),
      cat('widths', { prop: '^width$' }),
      cat('unused', { prop: '^height$' }),
    ],
  });
  const diffs = [diff(), diff({ path: 'a' }), diff({ prop: 'width' })];
  const { counts, unexpected } = classify(diffs, categories);
  assert.ok(counts instanceof Map);
  assert.deepEqual([...counts], [['colors', 2], ['widths', 1], ['unused', 0]]);
  assert.deepEqual(unexpected, []);
});

test('classify lists differences that no category matches as unexpected', () => {
  const { categories } = validateCategories({
    categories: [cat('colors', { prop: '^color$' })],
  });
  const stray = diff({ prop: 'margin-top' });
  const { counts, unexpected } = classify([diff(), stray], categories);
  assert.equal(counts.get('colors'), 1);
  assert.deepEqual(unexpected, [stray]);
});

test('classify counts a difference toward the FIRST matching category only, so counts plus unexpected equal the total', () => {
  const { categories } = validateCategories({
    categories: [
      cat('broad', { prop: 'color' }),
      cat('narrow', { prop: '^color$', path: '\\.tag$' }),
      cat('other', { prop: '^width$' }),
    ],
  });
  const diffs = [diff(), diff({ prop: 'border-color' }), diff({ prop: 'width' }), diff({ prop: 'height' })];
  const { counts, unexpected } = classify(diffs, categories);
  assert.deepEqual([...counts], [['broad', 2], ['narrow', 0], ['other', 1]]);
  assert.equal(unexpected.length, 1);
  const total = [...counts.values()].reduce((s, n) => s + n, 0) + unexpected.length;
  assert.equal(total, diffs.length);
});

test('classify with no differences returns all-zero counts and nothing unexpected', () => {
  const { categories } = validateCategories({ categories: [cat('a', { prop: 'x' }), cat('b', { prop: 'y' })] });
  const { counts, unexpected } = classify([], categories);
  assert.deepEqual([...counts], [['a', 0], ['b', 0]]);
  assert.deepEqual(unexpected, []);
});

test('classify with no categories flags every difference as unexpected', () => {
  const diffs = [diff(), diff({ prop: 'width' })];
  const { counts, unexpected } = classify(diffs, []);
  assert.equal(counts.size, 0);
  assert.deepEqual(unexpected, diffs);
});

// --- validateCategories -------------------------------------------------------

test('validateCategories accepts a well-formed file, keeps baseline and ids, and compiles in order', () => {
  const out = validateCategories({
    baseline: 'git:v2.1.0',
    categories: [
      cat('first-one', { prop: '^color$' }, 'FR-001'),
      cat('second', { prop: 'x', path: 'y', page: 'a/*.html', state: 'z', old: 'o', new: 'n' }),
    ],
  });
  assert.equal(out.baseline, 'git:v2.1.0');
  assert.deepEqual(out.categories.map((c) => c.id), ['first-one', 'second']);
  assert.equal(out.categories[0].description, 'FR-001');
});

test('validateCategories accepts an empty categories array', () => {
  assert.deepEqual(validateCategories({ baseline: 'b', categories: [] }).categories, []);
});

test('validateCategories rejects categories that is not an array', () => {
  assert.throws(() => validateCategories({ categories: {} }), /categories.*array/i);
  assert.throws(() => validateCategories({}), /categories.*array/i);
  assert.throws(() => validateCategories(null), /categories.*array/i);
});

test('validateCategories rejects a missing id', () => {
  assert.throws(() => validateCategories({ categories: [{ match: { prop: 'x' } }] }), /id/i);
});

test('validateCategories rejects ids that are not kebab-case', () => {
  for (const id of ['Colors', 'my_cat', 'has space', '-lead', 'trail-', 'dou--ble', '', 42]) {
    assert.throws(
      () => validateCategories({ categories: [cat(id, { prop: 'x' })] }),
      /kebab-case/i,
      `id ${JSON.stringify(id)} should be rejected`,
    );
  }
  assert.doesNotThrow(() => validateCategories({ categories: [cat('a1-b2-c3', { prop: 'x' })] }));
});

test('validateCategories rejects duplicate ids and names the id', () => {
  assert.throws(
    () => validateCategories({ categories: [cat('dup', { prop: 'x' }), cat('dup', { prop: 'y' })] }),
    /duplicate.*dup/i,
  );
});

test('validateCategories rejects a missing match.prop and names the category', () => {
  assert.throws(() => validateCategories({ categories: [cat('no-prop', { path: 'x' })] }), /no-prop.*match\.prop/i);
  assert.throws(() => validateCategories({ categories: [{ id: 'no-match' }] }), /no-match.*match\.prop/i);
});

test('validateCategories rejects an unknown match key and names the category and key', () => {
  assert.throws(
    () => validateCategories({ categories: [cat('typo', { prop: 'x', pth: 'y' })] }),
    /typo.*pth/i,
  );
});

test('validateCategories rejects an invalid regex naming the category id, the field and the regex error', () => {
  for (const field of ['prop', 'path', 'state', 'old', 'new']) {
    const match = { prop: 'ok', [field]: '(unclosed' };
    assert.throws(
      () => validateCategories({ categories: [cat('bad-re', match)] }),
      (err) => {
        assert.ok(err instanceof Error);
        assert.match(err.message, /bad-re/);
        assert.ok(err.message.includes(`match.${field}`), `message names match.${field}: ${err.message}`);
        assert.match(err.message, /\(unclosed/);
        assert.match(err.message, /Invalid regular expression|Unterminated group/i);
        return true;
      },
    );
  }
});

test('validateCategories rejects a non-string match field', () => {
  assert.throws(() => validateCategories({ categories: [cat('num', { prop: 5 })] }), /num.*match\.prop.*string/i);
});

test('validateCategories rejects an empty-string match field, which would be a catch-all', () => {
  for (const field of ['prop', 'path', 'state', 'old', 'new', 'page']) {
    const match = { prop: 'ok', [field]: '' };
    assert.throws(
      () => validateCategories({ categories: [cat('catch-all', match)] }),
      (err) => {
        assert.match(err.message, /catch-all/);
        assert.ok(err.message.includes(`match.${field}`), `message names match.${field}: ${err.message}`);
        assert.match(err.message, /empty/i);
        return true;
      },
    );
  }
});

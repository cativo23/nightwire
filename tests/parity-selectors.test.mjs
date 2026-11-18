import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { extractSelectors, analyzeSelectors } from '../scripts/parity/lib/selectors.mjs';

const css = readFileSync(new URL('./fixtures/selectors.css', import.meta.url), 'utf8');

test('extractSelectors splits selector lists, ignores comments and keyframe steps', () => {
  const sels = extractSelectors(css);
  assert.ok(sels.includes('.btn:active'));
  assert.ok(sels.includes('.btn:focus'));
  assert.ok(sels.includes('html'));
  assert.ok(!sels.some((s) => s.includes('not-a-class')), 'comment content must be ignored');
  assert.ok(!sels.includes('0%') && !sels.includes('to'), 'keyframe steps are not selectors');
});

test('extractSelectors includes rules nested in @media and @supports', () => {
  const sels = extractSelectors(css);
  assert.ok(sels.includes('.uplink'));
  assert.ok(sels.includes('.grid-2'));
});

test('analyzeSelectors collects every class, including inside :not() and :is()', () => {
  const { classes } = analyzeSelectors(extractSelectors(css));
  for (const c of ['btn', 'tabs', 'tab', 'card', 'card-title', 'x', 'y', 'z', 'p', 'q',
    'list', 'item-a', 'item-b', 'modal-backdrop', 'led', 'seg', 'field', 'uplink', 'grid-2']) {
    assert.ok(classes.has(c), `missing class ${c}`);
  }
  assert.ok(!classes.has('not-a-class'));
});

test('analyzeSelectors normalizes attribute-selector states to double quotes', () => {
  const { attrStates } = analyzeSelectors(extractSelectors(css));
  for (const a of ['[data-intensity="archive"]', '[data-open="true"]', '[data-state="ok"]',
    '[aria-pressed="true"]', '[open]']) {
    assert.ok(attrStates.has(a), `missing attribute state ${a}`);
  }
  assert.ok(!attrStates.has('[data-ignored]'));
});

test('analyzeSelectors lists stateful targets with the compound that carries the state', () => {
  const { stateful } = analyzeSelectors(extractSelectors(css));
  const has = (target, pseudo) => stateful.some((s) => s.target === target && s.pseudos.includes(pseudo));
  assert.ok(has('.btn', 'hover'), '.btn:hover::before → force hover on .btn');
  assert.ok(has('.tabs .tab', 'focus-visible'));
  assert.ok(has('.card', 'hover'), 'state on an ancestor compound targets that ancestor');
  assert.ok(has('.btn', 'active'));
  assert.ok(has('.btn', 'focus'));
  assert.ok(!stateful.some((s) => s.pseudos.includes('placeholder')), 'pseudo-elements are not states');
});

test('analyzeSelectors deduplicates stateful targets', () => {
  const { stateful } = analyzeSelectors(['.a:hover', '.a:hover::after', '.a:hover']);
  assert.equal(stateful.filter((s) => s.target === '.a' && s.pseudos.join() === 'hover').length, 1);
});

test('extractSelectors honours backslash escapes and semicolons inside strings', () => {
  const sels = extractSelectors('.a::before { content: "\\""; } .b { } a[href=";"]:hover { } .d:hover { }');
  assert.deepEqual(sels, ['.a::before', '.b', 'a[href=";"]:hover', '.d:hover']);
});

test('extractSelectors walks @scope and @starting-style blocks', () => {
  assert.deepEqual(extractSelectors('@scope (.card) { .x { } } @starting-style { .y { } }'), ['.x', '.y']);
});

test('extractSelectors fails loudly on native CSS nesting instead of skipping rules', () => {
  assert.throws(() => extractSelectors('.n { color: red; &:hover { color: blue; } }'), /nest/);
});

test(':focus-within is a forced state', () => {
  const { stateful } = analyzeSelectors(['.combo:focus-within']);
  assert.deepEqual(stateful, [{ target: '.combo', pseudos: ['focus-within'] }]);
});

test('states in one compound are forced together, including inside :is() and :where()', () => {
  const { stateful } = analyzeSelectors(['.a:hover:active', '.b:is(:hover, :focus)', '.c:where(:focus-visible)']);
  assert.deepEqual(stateful, [
    { target: '.a', pseudos: ['active', 'hover'] },
    { target: '.b', pseudos: ['focus', 'hover'] },
    { target: '.c', pseudos: ['focus-visible'] },
  ]);
});

test('states on two different compounds fail loudly (not supported by the forcing model)', () => {
  assert.throws(() => analyzeSelectors(['.a:hover .b:focus']), /more than one compound/);
});

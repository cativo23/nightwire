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
  const has = (target, pseudo) => stateful.some((s) => s.target === target && s.pseudo === pseudo);
  assert.ok(has('.btn', 'hover'), '.btn:hover::before → force hover on .btn');
  assert.ok(has('.tabs .tab', 'focus-visible'));
  assert.ok(has('.card', 'hover'), 'state on an ancestor compound targets that ancestor');
  assert.ok(has('.btn', 'active'));
  assert.ok(has('.btn', 'focus'));
  assert.ok(!stateful.some((s) => s.pseudo === 'placeholder'), 'pseudo-elements are not states');
});

test('analyzeSelectors deduplicates stateful targets', () => {
  const { stateful } = analyzeSelectors(['.a:hover', '.a:hover::after', '.a:hover']);
  assert.equal(stateful.filter((s) => s.target === '.a' && s.pseudo === 'hover').length, 1);
});

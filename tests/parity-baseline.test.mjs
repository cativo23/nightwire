import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveOld } from '../scripts/parity/lib/baseline.mjs';

test('without --expect and without --old the default is git:main and nothing warns', () => {
  assert.deepEqual(resolveOld({}), { old: 'git:main' });
  assert.deepEqual(resolveOld({ baseline: 'v2.1.0' }), { old: 'git:main' });
});

test('with --expect and no --old the category baseline is the default, as a git ref', () => {
  assert.deepEqual(resolveOld({ expect: true, baseline: 'v2.1.0' }), { old: 'git:v2.1.0' });
});

test('a baseline that is already a git: spec is used as is', () => {
  assert.deepEqual(resolveOld({ expect: true, baseline: 'git:v2.1.0' }), { old: 'git:v2.1.0' });
});

test('with --expect, no --old and no baseline the default stays git:main', () => {
  assert.deepEqual(resolveOld({ expect: true }), { old: 'git:main' });
});

test('an explicit --old that differs from the baseline wins and produces one warning line', () => {
  assert.deepEqual(resolveOld({ expect: true, baseline: 'v2.1.0', old: 'git:main' }), {
    old: 'git:main',
    warning: 'WARN  --old git:main differs from the category baseline git:v2.1.0',
  });
});

test('an explicit --old equal to the baseline does not warn, with or without the git: prefix', () => {
  assert.deepEqual(resolveOld({ expect: true, baseline: 'v2.1.0', old: 'git:v2.1.0' }), { old: 'git:v2.1.0' });
  assert.deepEqual(resolveOld({ expect: true, baseline: 'git:v2.1.0', old: 'git:v2.1.0' }), { old: 'git:v2.1.0' });
});

test('an explicit --old with --expect and no baseline never warns', () => {
  assert.deepEqual(resolveOld({ expect: true, old: 'nightwire.css' }), { old: 'nightwire.css' });
});

test('an explicit --old without --expect is returned untouched', () => {
  assert.deepEqual(resolveOld({ old: 'git:v1.0.0', baseline: 'v2.1.0' }), { old: 'git:v1.0.0' });
});

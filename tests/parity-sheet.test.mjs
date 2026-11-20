import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSheet, SheetError } from '../scripts/parity/lib/sheet.mjs';
import { routeAction } from '../scripts/parity/lib/route.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'http://127.0.0.1:4000';

test('loadSheet reads a stylesheet from a repo-relative path', () => {
  assert.match(loadSheet('nightwire.css', ROOT), /--font-title:/);
});

test('loadSheet reads a stylesheet from a git ref', () => {
  assert.match(loadSheet('git:HEAD', ROOT), /--font-title:/);
});

test('loadSheet rejects a git ref that starts with a dash', () => {
  assert.throws(() => loadSheet('git:--output=x', ROOT), (e) => e instanceof SheetError && /invalid git ref: git:--output=x/.test(e.message));
});

test('loadSheet rejects an empty git ref', () => {
  assert.throws(() => loadSheet('git:', ROOT), (e) => e instanceof SheetError && /invalid git ref/.test(e.message));
});

test('loadSheet reports a git ref that does not exist', () => {
  assert.throws(() => loadSheet('git:no-such-ref-xyz', ROOT), (e) => e instanceof SheetError && /cannot read nightwire\.css at no-such-ref-xyz/.test(e.message));
});

test('loadSheet reports a path that does not exist', () => {
  assert.throws(() => loadSheet('nope/missing.css', ROOT), (e) => e instanceof SheetError && /stylesheet not found: nope\/missing\.css/.test(e.message));
});

test('routeAction substitutes nightwire.css from the local origin', () => {
  assert.equal(routeAction(`${ORIGIN}/nightwire.css`, ORIGIN), 'css');
  assert.equal(routeAction(`${ORIGIN}/docs/design/v3/nightwire.css?x=1`, ORIGIN), 'css');
});

test('routeAction lets other local files through', () => {
  assert.equal(routeAction(`${ORIGIN}/docs/design/v3/board.html`, ORIGIN), 'continue');
});

test('routeAction aborts every other origin by default', () => {
  assert.equal(routeAction('https://fonts.googleapis.com/css2?family=X', ORIGIN), 'abort');
  assert.equal(routeAction('https://evil.test/nightwire.css', ORIGIN), 'abort');
});

test('routeAction lets an allowed origin through, and never substitutes the stylesheet there', () => {
  const allow = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
  assert.equal(routeAction('https://fonts.googleapis.com/css2?family=X', ORIGIN, allow), 'continue');
  assert.equal(routeAction('https://fonts.gstatic.com/s/x.woff2', ORIGIN, allow), 'continue');
  assert.equal(routeAction('https://fonts.gstatic.com/nightwire.css', ORIGIN, allow), 'continue');
  assert.equal(routeAction('https://evil.test/x', ORIGIN, allow), 'abort');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { parseBrowserArgs } from '../scripts/browsers/lib/args.mjs';

test('defaults to every engine and a temp output directory', () => {
  const a = parseBrowserArgs([]);
  assert.deepEqual(a.engines, ['chrome', 'firefox']);
  assert.equal(a.out, path.join(os.tmpdir(), 'nightwire-browsers'));
});

test('--engine selects one engine', () => {
  assert.deepEqual(parseBrowserArgs(['--engine', 'firefox']).engines, ['firefox']);
  assert.deepEqual(parseBrowserArgs(['--engine', 'chrome']).engines, ['chrome']);
  assert.deepEqual(parseBrowserArgs(['--engine', 'all']).engines, ['chrome', 'firefox']);
});

test('--out is resolved to an absolute path', () => {
  assert.equal(parseBrowserArgs(['--out', 'some/dir']).out, path.resolve('some/dir'));
});

test('an unknown engine is rejected with a message naming the choices', () => {
  assert.throws(() => parseBrowserArgs(['--engine', 'safari']), /chrome\|firefox\|all/);
});

test('an unknown option is rejected', () => {
  assert.throws(() => parseBrowserArgs(['--nope']));
});

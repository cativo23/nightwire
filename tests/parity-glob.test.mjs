import { test } from 'node:test';
import assert from 'node:assert/strict';
import { globToRegExp } from '../scripts/parity/lib/glob.mjs';

const m = (glob, s) => globToRegExp(glob).test(s);

test('* matches within one path segment and never crosses a slash', () => {
  assert.equal(m('examples/*/a.html', 'examples/html/a.html'), true);
  assert.equal(m('examples/*/a.html', 'examples/x/y/a.html'), false);
  assert.equal(m('*.html', 'a.html'), true);
  assert.equal(m('*.html', 'dir/a.html'), false);
  assert.equal(m('a*', 'a'), true);
});

test('? matches exactly one character that is not a slash', () => {
  assert.equal(m('p?.html', 'p1.html'), true);
  assert.equal(m('p?.html', 'p.html'), false);
  assert.equal(m('p?.html', 'p12.html'), false);
  assert.equal(m('p?.html', 'p/.html'), false);
});

test('** crosses slashes', () => {
  assert.equal(m('examples/**', 'examples/a/b/c.html'), true);
  assert.equal(m('examples/**.html', 'examples/a/b/c.html'), true);
  assert.equal(m('examples/**', 'other/a.html'), false);
});

test('**/ matches zero or more whole directories', () => {
  assert.equal(m('examples/**/x.html', 'examples/x.html'), true);
  assert.equal(m('examples/**/x.html', 'examples/a/x.html'), true);
  assert.equal(m('examples/**/x.html', 'examples/a/b/x.html'), true);
  assert.equal(m('examples/**/x.html', 'examples/ax.html'), false);
  assert.equal(m('**/x.html', 'x.html'), true);
});

test('a glob is anchored to the whole string', () => {
  assert.equal(m('examples/*.html', 'x/examples/a.html'), false);
  assert.equal(m('examples/*.html', 'examples/a.html.bak'), false);
  assert.equal(m('a.html', 'a.html'), true);
});

test('regex metacharacters in a glob are literal', () => {
  assert.equal(m('a.html', 'aXhtml'), false);
  assert.equal(m('a(1)+[b]${x}|y^.html', 'a(1)+[b]${x}|y^.html'), true);
  assert.equal(m('a\\b', 'a\\b'), true);
  assert.equal(m('a(1)', 'a1'), false);
});

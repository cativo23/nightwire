import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Structural guard on the six overlay stylesheets. An overlay animates out only because its
// closed rule holds `visibility` back by the exit duration; drop that delay and the exit fade
// is cut off the moment `visibility` flips, with no error anywhere. The test pins the shape of
// the transition (which property, which delay token), never its values: the step (tick or
// sweep), the curve and the other properties stay free to retune.

const root = new URL('../', import.meta.url);
const OVERLAYS = ['drawer', 'modal', 'cmdk', 'dropdown', 'tooltip', 'toast'];

// `visibility 0s linear var(--nw-tick-out-duration)` or the sweep equivalent: closing.
const CLOSING = /^visibility 0s linear var\(--nw-(tick|sweep)-out-duration\)$/;
// `visibility 0s` and nothing after it: opening, flips at once.
const OPENING = /^visibility 0s$/;

/** Comma-separated list items, ignoring commas inside parentheses. */
function splitTopLevel(value) {
  const items = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === '(') depth++;
    else if (value[i] === ')') depth--;
    else if (value[i] === ',' && depth === 0) { items.push(value.slice(start, i)); start = i + 1; }
  }
  items.push(value.slice(start));
  return items.map((item) => item.trim().replace(/\s+/g, ' ')).filter(Boolean);
}

/** Every `selector { declarations }` rule of a flat stylesheet, comments removed. */
function parseRules(css) {
  const code = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [];
  for (const m of code.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const decls = {};
    for (const decl of m[2].split(';')) {
      const i = decl.indexOf(':');
      if (i > 0) decls[decl.slice(0, i).trim()] = decl.slice(i + 1).trim().replace(/\s+/g, ' ');
    }
    rules.push({ selector: m[1].trim().replace(/\s+/g, ' '), decls });
  }
  return rules;
}

/**
 * Problems found in one overlay stylesheet: a closing rule (sets visibility: hidden) or an
 * opening rule (sets visibility: visible) with the wrong visibility transition, a rule that
 * transitions visibility in neither shape, and a missing closed or open rule.
 */
function overlayProblems(name, css) {
  const problems = [];
  let closed = 0;
  let open = 0;
  for (const { selector, decls } of parseRules(css)) {
    const where = `${name}.css  ${selector}`;
    const visibilityItems = splitTopLevel(decls.transition ?? '').filter((item) => item.startsWith('visibility'));
    if (decls.visibility === 'hidden') {
      closed++;
      if (!visibilityItems.some((item) => CLOSING.test(item))) {
        problems.push(`${where}: closes the overlay without "visibility 0s linear var(--nw-(tick|sweep)-out-duration)" in its transition`);
      }
    }
    if (decls.visibility === 'visible') {
      if (!visibilityItems.some((item) => OPENING.test(item))) {
        problems.push(`${where}: opens the overlay without "visibility 0s" (no delay) in its transition`);
      }
    }
    // An always-open overlay (dropdown, toast) never sets visibility: visible; its base rule
    // carries the opening transition. Either way, that rule is the open rule.
    if (decls.visibility === 'visible' || visibilityItems.some((item) => OPENING.test(item))) open++;
    for (const item of visibilityItems) {
      if (!CLOSING.test(item) && !OPENING.test(item)) problems.push(`${where}: unexpected visibility transition "${item}"`);
    }
  }
  if (closed === 0) problems.push(`${name}.css: no rule sets visibility: hidden`);
  if (open === 0) problems.push(`${name}.css: no open rule (visibility: visible, or a "visibility 0s" transition)`);
  return problems;
}

for (const name of OVERLAYS) {
  test(`${name} closes with a delayed visibility flip and opens with an immediate one`, () => {
    const css = readFileSync(new URL(`src/components/${name}.css`, root), 'utf8');
    assert.deepEqual(overlayProblems(name, css), []);
  });
}

// The helper itself, against small fixtures: it must fail where it should, or the checks above
// prove nothing.
const GOOD = `
.x { visibility: hidden; opacity: 0; transition: opacity var(--nw-sweep-out), visibility 0s linear var(--nw-sweep-out-duration); }
.x[data-open="true"] { visibility: visible; opacity: 1; transition: opacity var(--nw-sweep), visibility 0s; }
`;

test('overlayProblems accepts a well-formed overlay and ignores values', () => {
  assert.deepEqual(overlayProblems('x', GOOD), []);
  const retuned = GOOD.replaceAll('sweep', 'tick').replace('opacity var(--nw-tick)', 'opacity 1s ease');
  assert.deepEqual(overlayProblems('x', retuned), [], 'step and curve are free to change');
});

test('overlayProblems fails a closing rule that lost its visibility delay', () => {
  const broken = GOOD.replace(', visibility 0s linear var(--nw-sweep-out-duration)', '');
  assert.match(overlayProblems('x', broken).join('\n'), /closes the overlay without/);
});

test('overlayProblems fails a closing rule whose delay is not an exit duration', () => {
  const broken = GOOD.replace('--nw-sweep-out-duration', '--nw-sweep-duration');
  assert.match(overlayProblems('x', broken).join('\n'), /closes the overlay without/);
});

test('overlayProblems fails an opening rule that delays visibility', () => {
  const broken = GOOD.replace('visibility 0s; }', 'visibility 0s linear var(--nw-sweep-duration); }');
  assert.match(overlayProblems('x', broken).join('\n'), /opens the overlay without/);
});

test('overlayProblems fails an overlay with no open rule', () => {
  const closedOnly = GOOD.split('\n').filter((line) => !line.includes('visible')).join('\n');
  assert.match(overlayProblems('x', closedOnly).join('\n'), /no open rule/);
});

test('overlayProblems fails an overlay with no closed rule', () => {
  const openOnly = GOOD.split('\n').filter((line) => !line.includes('hidden')).join('\n');
  assert.match(overlayProblems('x', openOnly).join('\n'), /no rule sets visibility: hidden/);
});

test('overlayProblems accepts an always-open base rule as the open rule (dropdown, toast)', () => {
  const css = `
.t { transition: opacity var(--nw-sweep), visibility 0s; }
.t[data-open="false"] { visibility: hidden; transition: opacity var(--nw-sweep-out), visibility 0s linear var(--nw-sweep-out-duration); }
`;
  assert.deepEqual(overlayProblems('t', css), []);
});

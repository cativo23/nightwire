import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SCRIPT = new URL('../scripts/parity/glow-check.mjs', import.meta.url).pathname;
const run = (...args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });

const rec = (over) => ({ page: 'p.html', state: 'operator|rm-off', path: 'html>body>span.led:nth-child(1)', prop: 'box-shadow', old: 'none', new: 'none', ...over });
const glow = (blur) => `rgb(122, 237, 122) 0px 0px ${blur}px 0px`;

function withJson(json, fn) {
  const dir = mkdtempSync(join(tmpdir(), 'nw-glow-'));
  try {
    const file = join(dir, 'parity.json');
    writeFileSync(file, typeof json === 'string' ? json : JSON.stringify(json));
    return fn(file);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('exit 0 when every glow is smaller than v2.1.0 or gone', () => {
  const r = withJson({ meta: { old: 'git:v2.1.0', new: 'nightwire.css' }, shadows: [rec({ old: glow(8), new: glow(4) }), rec({ old: glow(8), new: 'none' })] }, run);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^GLOW-CHECK  old=git:v2\.1\.0  new=nightwire\.css  shadows=2/m);
});

test('exit 1 and a printed violation when a glow got bigger at operator', () => {
  const r = withJson({ shadows: [rec({ old: glow(4), new: glow(8) })] }, run);
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stdout, /html>body>span\.led:nth-child\(1\)/);
});

test('exit 2 with a usage line when the file argument is missing or there are two', () => {
  for (const args of [[], ['a.json', 'b.json']]) {
    const r = run(...args);
    assert.equal(r.status, 2);
    assert.match(r.stderr, /usage: node scripts\/parity\/glow-check\.mjs <parity\.json>/);
  }
});

test('exit 2 when the file is missing, is not JSON, or has no shadows array', () => {
  assert.equal(run('/nonexistent/parity.json').status, 2);
  const notJson = withJson('{not json', run);
  assert.equal(notJson.status, 2);
  assert.match(notJson.stderr, /glow-check: cannot read/);
  const noShadows = withJson({ meta: {} }, run);
  assert.equal(noShadows.status, 2);
  assert.match(noShadows.stderr, /no "shadows" array/);
});

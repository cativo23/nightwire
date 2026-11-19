import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// FR-019 / K5: the package is an ES module, and the compiled CommonJS CLI keeps working.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (args) =>
  spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });

// CI runs `npm test` before `npm run build` and dist/ is git-ignored, so build the CLI here.
before(() => {
  const built = run(['scripts/build-cli.mjs']);
  assert.equal(built.status, 0, `build-cli failed:\n${built.stdout}${built.stderr}`);
});

test('package.json declares type module and still has no exports or engines', () => {
  const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.equal(pkg.type, 'module');
  assert.equal('exports' in pkg, false);
  assert.equal('engines' in pkg, false);
});

test('the build writes dist/package.json pinning the compiled CLI to commonjs', () => {
  const nested = JSON.parse(readFileSync(path.join(root, 'dist/package.json'), 'utf8'));
  assert.deepEqual(nested, { type: 'commonjs' });
});

test('the compiled CLI still starts and rejects an unknown command', () => {
  const r = run(['dist/index.js', 'not-a-command']);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /Unknown command: not-a-command/);
});

test('tailwind.preset.js loads as an ES module with no warning', () => {
  const r = run([
    '--input-type=module',
    '-e',
    "const m = await import('./tailwind.preset.js'); if (!m.default.theme.extend) process.exit(2);",
  ]);
  assert.equal(r.stderr, '');
  assert.equal(r.status, 0);
});

// SC-013: the installer copies the preset as .mjs so it never warns MODULE_TYPELESS_PACKAGE_JSON
// in a consumer project that has no "type": "module".
test('the installer copies the preset as .mjs, prints a matching import, and it loads warning-free', async () => {
  const require = createRequire(import.meta.url);
  const prompts = require('prompts');
  const { install } = require(path.join(root, 'dist/commands/install.js'));
  const scratch = mkdtempSync(path.join(os.tmpdir(), 'nightwire-install-'));
  const logged = [];
  const realLog = console.log;
  try {
    writeFileSync(path.join(scratch, 'package.json'), '{}');
    // confirm install, include Tailwind preset, skip the AI skill files
    prompts.inject([true, true, false]);
    console.log = (...a) => logged.push(a.join(' '));
    await install(scratch);
    console.log = realLog;

    assert.equal(existsSync(path.join(scratch, 'nightwire.tailwind.preset.mjs')), true);
    assert.equal(existsSync(path.join(scratch, 'nightwire.tailwind.preset.js')), false);
    // eslint-disable-next-line no-control-regex
    const out = logged.join('\n').replace(/\u001b\[[0-9;]*m/g, '');
    assert.match(out, /import nightwirePreset from '\.\/nightwire\.tailwind\.preset\.mjs'/);

    const r = spawnSync(
      process.execPath,
      ['--input-type=module', '-e',
       "const m = await import('./nightwire.tailwind.preset.mjs'); if (!m.default.theme.extend) process.exit(2);"],
      { cwd: scratch, encoding: 'utf8' },
    );
    assert.equal(r.stderr, '');
    assert.equal(r.status, 0);
  } finally {
    console.log = realLog;
    rmSync(scratch, { recursive: true, force: true });
  }
});

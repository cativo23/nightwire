import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
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

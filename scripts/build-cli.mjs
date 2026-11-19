// Compile cli/ to dist/ and pin dist/ to CommonJS.
// tsc emits CommonJS, but the root package.json is "type": "module" (K5), so Node would load
// dist/index.js as ESM and fail. dist/package.json overrides the type for everything below it.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc');

const result = spawnSync(process.execPath, [tsc], { cwd: root, stdio: 'inherit' });
if (result.status !== 0) {
  // status is null when tsc never started or was killed by a signal: say why instead of exiting silently
  if (result.status === null) console.error(`build-cli: tsc did not finish: ${result.error ?? result.signal}`);
  process.exit(result.status ?? 1);
}

const dist = path.join(root, 'dist');
mkdirSync(dist, { recursive: true });
writeFileSync(path.join(dist, 'package.json'), `${JSON.stringify({ type: 'commonjs' })}\n`);

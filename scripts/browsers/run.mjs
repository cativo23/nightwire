// Overlay open/close checks in real Chrome and Firefox. Not part of `npm test`: it needs both
// browsers installed. Usage: node scripts/browsers/run.mjs [--engine chrome|firefox|all] [--out <dir>]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parseBrowserArgs } from './lib/args.mjs';
import { writePages, ROOT_DIR } from './lib/pages.mjs';
import { runEngine, LaunchError } from './lib/checks.mjs';
import { buildMarkdown } from './lib/report.mjs';

const usage = (msg) => { console.error(`browsers: ${msg}\nusage: node scripts/browsers/run.mjs [--engine chrome|firefox|all] [--out <dir>]`); process.exit(2); };
const git = (...a) => { try { return execFileSync('git', ['-C', ROOT_DIR, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return 'unknown'; } };

let args;
try { args = parseBrowserArgs(process.argv.slice(2)); } catch (err) { usage(err.message); }

if (!fs.existsSync(path.join(ROOT_DIR, 'nightwire.css'))) usage('nightwire.css not found: run npm run build');
writePages(args.out);

const results = [];
for (const engine of args.engines) {
  console.log(`\n== ${engine} ==`);
  try {
    results.push(await runEngine(engine, args.out));
  } catch (err) {
    if (err instanceof LaunchError) { console.error(`browsers: ${err.message}`); process.exit(2); }
    throw err;
  }
}

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8')).devDependencies;
const md = buildMarkdown(results, {
  date: new Date().toISOString().slice(0, 10),
  head: git('rev-parse', '--short', 'HEAD'),
  branch: git('branch', '--show-current') || 'detached',
  playwright: pkg['playwright-core'],
  puppeteer: pkg['puppeteer-core'],
});
fs.writeFileSync(path.join(args.out, 'results.md'), md);

console.log('');
let failed = 0;
for (const r of results) {
  const pass = r.rows.filter((x) => x.pass).length;
  failed += r.rows.length - pass;
  console.log(`${r.engine}: ${pass}/${r.rows.length} PASS`);
}
console.log(`report: ${path.join(args.out, 'results.md')}`);
process.exit(failed === 0 ? 0 : 1);

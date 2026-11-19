#!/usr/bin/env node
// WCAG contrast check for Nightwire's colour pairings (FR-014, SC-005).
//
//   npm run design:contrast -- [--pairs <file>] [--css <file>] [--quiet]
//
// Reads docs/design/v3/contrast-pairs.json and the built tokens (src/tokens/tokens.css), prints one
// line per pairing (PASS|FAIL id ratio required), then a summary. Exits 1 when any pairing fails,
// 2 on a usage or data error. Exempt entries (disabled controls, decoration) are listed, not checked.

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluatePairs } from './lib/contrast.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

function parseArgs(argv) {
  const opts = { pairs: resolve(ROOT, 'docs/design/v3/contrast-pairs.json'), css: resolve(ROOT, 'src/tokens/tokens.css'), quiet: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--quiet') opts.quiet = true;
    else if (a === '--pairs' || a === '--css') {
      if (!argv[i + 1]) throw new Error(`${a} needs a value`);
      opts[a.slice(2)] = resolve(process.cwd(), argv[++i]);
    } else throw new Error(`unknown argument ${a}`);
  }
  return opts;
}

// Floor, not round: a ratio of 4.496 must not print as a passing-looking 4.50.
const fmt = (n) => (Math.floor(n * 100) / 100).toFixed(2);

function main() {
  let opts;
  let results;
  let spec;
  try {
    opts = parseArgs(process.argv.slice(2));
    spec = JSON.parse(readFileSync(opts.pairs, 'utf8'));
    results = evaluatePairs(spec, readFileSync(opts.css, 'utf8'));
  } catch (err) {
    console.error(`design:contrast: ${err.message}`);
    process.exit(2);
  }

  for (const r of results) {
    if (opts.quiet && r.pass) continue;
    console.log(`${r.pass ? 'PASS' : 'FAIL'} ${r.id} ${fmt(r.ratio)} ${r.required}`);
  }
  for (const e of spec.exempt ?? []) console.log(`EXEMPT ${e.id} ${e.reason}`);

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length} pairings, ${results.length - failed.length} pass, ${failed.length} fail, ${(spec.exempt ?? []).length} exempt`);
  if (failed.length) {
    console.log('failing:');
    for (const r of failed) console.log(`  ${r.id}: ${fmt(r.ratio)} < ${r.required} (${r.kind}; ${r.where})`);
    process.exit(1);
  }
}

main();

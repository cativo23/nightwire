#!/usr/bin/env node
// FR-013b / SC-012 glow check over a parity --json file.
//
//   npm run parity -- --old git:v2.1.0 --expect docs/design/v3/change-inventory.json --json parity.json
//   node scripts/parity/glow-check.mjs parity.json
//
// Rules (see lib/glow.mjs): at none and operator every glow is a smaller blur than v2.1.0's or gone;
// at archive no element has a coloured blur; at combat only state signals blur more than at
// operator, and stay below v2.1.0's combat blur. Prints one line per rule, the accepted exceptions
// and every violation. Exit 0 = no violation, 1 = violations, 2 = usage error.

import { readFileSync } from 'node:fs';
import { checkGlow, formatGlowReport } from './lib/glow.mjs';

const file = process.argv[2];
if (!file || process.argv.length > 3) {
  console.error('usage: node scripts/parity/glow-check.mjs <parity.json>   (written by npm run parity -- --json <file>)');
  process.exit(2);
}
let json;
try {
  json = JSON.parse(readFileSync(file, 'utf8'));
  if (!Array.isArray(json.shadows)) throw new Error('no "shadows" array: was it written by npm run parity -- --json?');
} catch (err) {
  console.error(`glow-check: cannot read ${file}: ${err.message}`);
  process.exit(2);
}
console.log(`GLOW-CHECK  old=${json.meta?.old}  new=${json.meta?.new}  shadows=${json.shadows.length}`);
const { lines, exitCode } = formatGlowReport(checkGlow(json.shadows));
lines.forEach((l) => console.log(l));
process.exit(exitCode);

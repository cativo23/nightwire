import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TokenReader, KNOB_COLUMNS, motionVocab, countCssTokens } from '../apps/docs/src/data/tokens.mjs';

// T058 fix 1: the docs site derives the Motion and Intensity tables from tokens.json through
// TokenReader. tsc and vite never evaluate that module, so a renamed knob or a dropped override
// would blank the SPA while every build stays green. These tests run it for real.
const raw = readFileSync(new URL('../src/tokens/tokens.json', import.meta.url), 'utf8');
const tokens = JSON.parse(raw);
const clone = () => JSON.parse(raw);

test('should_read_motion_values_from_tokens_json', () => {
  const nw = new TokenReader(tokens);
  assert.equal(nw.motion('tick', 'in'), '150ms cubic-bezier(0.3, 0, 0.7, 1)');
  assert.equal(nw.motion('sweep', 'in'), '350ms cubic-bezier(0.2, 0.8, 0.2, 1)');
  assert.equal(nw.motion('uplink', 'in'), '400ms cubic-bezier(0, 0.6, 0.4, 1)');
  assert.equal(nw.motion('tick', 'out'), '100ms cubic-bezier(0.4, 0, 1, 1)');
  assert.equal(nw.motion('sweep', 'out'), '250ms cubic-bezier(0.4, 0, 1, 1)');
  assert.equal(nw.motion('uplink', 'out'), '300ms cubic-bezier(0.4, 0, 1, 1)');
});

test('should_build_the_motion_vocabulary_the_page_shows', () => {
  const rows = Object.fromEntries(motionVocab(new TokenReader(tokens)).map((r) => [r.token, r]));
  assert.equal(rows['--nw-stagger'].value, '50ms');
  assert.equal(rows['--nw-loop-spin'].value, '800ms (cycle)');
  assert.equal(rows['--nw-loop-shimmer'].value, '1200ms (cycle)');
  assert.equal(rows['--nw-loop-state'].value, 'running | paused');
  assert.equal(rows['--nw-pulse-state'].value, 'running | paused');
  assert.equal(rows['--nw-pulse-speed'].value, '1.6s (every level)');
  assert.match(rows['--nw-pulse-speed'].use, /combat runs at 1\.333s/);
  assert.match(rows['--nw-<step>-duration, --nw-<step>-ease'].value, /\(350ms\)/);
  assert.match(rows['--nw-<step>-out-duration, --nw-<step>-out-ease'].value, /\(250ms\)/);
  assert.equal(Object.keys(rows).length, 14);
});

test('should_build_every_intensity_column_from_the_knob_lists_the_page_uses', () => {
  const nw = new TokenReader(tokens);
  const col = (level) => nw.knobs(level, KNOB_COLUMNS[level]);
  assert.deepEqual(col('archive'), {
    '--nw-glow': '0', '--nw-motion-scale': '0.6', '--nw-pad-scale': '1.35', '--nw-base-font': '15px',
    '--nw-pulse-state': 'paused', '--nw-kanji-display': 'none', '--nw-panel-radius': '2px', '--nw-value-weight': '400',
  });
  assert.deepEqual(col('operator'), {
    '--nw-glow': '0.5', '--nw-motion-scale': '1', '--nw-pad-scale': '1', '--nw-base-font': '14px',
    '--nw-pulse-state': 'running', '--nw-kanji-display': 'inline', '--nw-panel-radius': '0', '--nw-value-weight': '500',
  });
  assert.deepEqual(col('combat'), {
    '--nw-led-glow': 'calc(var(--nw-glow) * 2)', '--nw-control-glow': 'calc(var(--nw-glow) * 2)',
    '--nw-progress-glow': 'calc(var(--nw-glow) * 2)', '--nw-motion-scale': '1.2', '--nw-density': '0.85',
    '--nw-pad-scale': '0.7', '--nw-base-font': '13px',
  });
});

test('should_fail_when_a_listed_knob_loses_its_override', () => {
  const t = clone();
  delete t.$extensions['dev.cativo.nightwire'].intensity.combat.tokens['knob.density'];
  assert.throws(() => new TokenReader(t).knobs('combat', KNOB_COLUMNS.combat), /combat does not override knob\.density/);
});

test('should_fail_when_a_listed_knob_is_renamed', () => {
  const t = clone();
  t.knob['density-scale'] = t.knob.density;
  delete t.knob.density;
  assert.throws(() => new TokenReader(t).knobs('operator', ['density']), /no "knob\.density"/);
});

test('should_count_tokens_that_publish_a_custom_property', () => {
  // Independent count: every token's css name is a "css": key in the raw file.
  assert.equal(countCssTokens(tokens), (raw.match(/"css":/g) ?? []).length);
  assert.ok(countCssTokens(tokens) > 100);
});

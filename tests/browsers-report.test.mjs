import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMarkdown } from '../scripts/browsers/lib/report.mjs';

const row = (check, pass, detail = 'ok') => ({ check, overlay: 'drawer', pass, detail });
const result = (engine, rows, durations = { drawer: { enter: 350, exit: 262.5 } }) =>
  ({ engine, version: engine + ' 1.0', ua: 'UA/' + engine, rows, durations });
const meta = { date: '2031-02-03', head: 'abc1234', branch: 'feat/x', playwright: '1.2.3', puppeteer: '4.5.6' };

test('takes the date, commit and branch from the run, not from constants', () => {
  const md = buildMarkdown([result('chrome', [row('1 a', true)])], meta);
  assert.match(md, /Date: 2031-02-03/);
  assert.match(md, /abc1234/);
  assert.match(md, /feat\/x/);
});

test('headlines each engine with its pass count', () => {
  const md = buildMarkdown([result('chrome', [row('1 a', true), row('2 b', false)]), result('firefox', [row('1 a', true)])], meta);
  assert.match(md, /## Chrome: chrome 1\.0 \(1\/2 PASS\)/);
  assert.match(md, /## Firefox: firefox 1\.0 \(1\/1 PASS\)/);
});

test('marks failing rows FAIL and escapes pipes in details', () => {
  const md = buildMarkdown([result('chrome', [row('1 a', false, 'a|b')])], meta);
  assert.match(md, /\| 1 a \| drawer \| FAIL \| a\\\|b \|/);
});

test('states the durations measured from the stylesheet', () => {
  const md = buildMarkdown([result('chrome', [row('1 a', true)], { drawer: { enter: 123, exit: 45.5 } })], meta);
  assert.match(md, /drawer 123ms in \/ 45\.5ms out/);
});

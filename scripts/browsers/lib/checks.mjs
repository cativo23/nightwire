import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { maxOfLists } from './durations.mjs';
import { hiddenOnTime } from './tolerance.mjs';

// Browser-driving code: 65 checks over the six overlays (drawer, modal, cmdk, dropdown, toast,
// tooltip) in real Chrome (playwright-core) or Firefox (puppeteer-core). Engines run one after
// the other, so the state below is per run and reset by runEngine().
let engine;
let OUT;
let DUR;
const R = []; // rows
const consoleMsgs = [];
const add = (check, overlay, pass, detail) => { R.push({ check, overlay, pass, detail }); console.log((pass ? 'PASS' : 'FAIL'), check, overlay, detail); };
const url = (f) => pathToFileURL(path.join(OUT, f)).href;

/** Thrown when a browser cannot be started; the CLI turns it into exit code 2. */
export class LaunchError extends Error {}

// ---------- adapters ----------
async function launch(rm) {
  if (engine === 'chrome') {
    const { chromium } = await import('playwright-core');
    let browser;
    try {
      browser = process.env.NW_CHROME_PATH
        ? await chromium.launch({ executablePath: process.env.NW_CHROME_PATH })
        : await chromium.launch({ channel: 'chrome' });
    } catch (err) {
      throw new LaunchError(`cannot launch Chrome (${err.message.split('\n')[0]}). Install Google Chrome or set NW_CHROME_PATH.`);
    }
    return { version: 'Chrome ' + browser.version(), async newPage() {
      const ctx = await browser.newContext({ viewport: { width: 1000, height: 700 } });
      const page = await ctx.newPage();
      await page.emulateMedia({ reducedMotion: rm ? 'reduce' : 'no-preference' });
      hook(page); return page; }, close: () => browser.close() };
  }
  const { default: puppeteer } = await import('puppeteer-core');
  let browser;
  try {
    browser = await puppeteer.launch({ browser: 'firefox', executablePath: process.env.NW_FIREFOX_PATH || '/usr/bin/firefox', headless: true,
      extraPrefsFirefox: rm ? { 'ui.prefersReducedMotion': 1 } : {} });
  } catch (err) {
    throw new LaunchError(`cannot launch Firefox (${err.message.split('\n')[0]}). Install Firefox or set NW_FIREFOX_PATH.`);
  }
  return { version: await browser.version(), async newPage() {
    const page = await browser.newPage(); await page.setViewport({ width: 1000, height: 700 }); hook(page); return page; }, close: () => browser.close() };
}
function hook(page) {
  page.on('console', m => { if (['error', 'warning', 'warn'].includes(m.type())) consoleMsgs.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => consoleMsgs.push('pageerror: ' + (e.message || e)));
  page.on('requestfailed', r => consoleMsgs.push('requestfailed: ' + r.url()));
}
const ev = (page, fn, arg) => page.evaluate(fn, arg);
const T = (page, call) => page.evaluate(`(async()=>JSON.stringify((v=>v===undefined?null:v)(await T.${call})))()`).then(JSON.parse);
async function go(page, f, intensity) {
  await page.goto(url(f), { waitUntil: 'load' });
  if (intensity) await page.evaluate(`document.documentElement.setAttribute('data-intensity','${intensity}')`);
  await T(page, 'sleep(100)');
}
const fmt = n => (typeof n === 'number' ? +n.toFixed(3) : n);

// ---------- overlay model ----------
const OV = {
  drawer:   { toggle: ['#drawer-bd', '#drawer'], sels: ['#drawer-bd', '#drawer'], props: { '#drawer-bd': ['o'], '#drawer': ['t'] }, hit: ['#drawer-bd', '#drawer'] },
  modal:    { toggle: ['#modal-bd'], sels: ['#modal-bd', '#modal'], props: { '#modal-bd': ['o'], '#modal': ['t'] }, hit: ['#modal-bd', '#modal'] },
  cmdk:     { toggle: ['#cmdk-bd'], sels: ['#cmdk-bd', '#cmdk'], props: { '#cmdk-bd': ['o'], '#cmdk': ['t'] }, hit: ['#cmdk-bd', '#cmdk'] },
  dropdown: { toggle: ['#dd'], sels: ['#dd-menu'], props: { '#dd-menu': ['o', 't'] }, hit: ['#dd-menu', '#dd-item'] },
  toast:    { toggle: ['#toast'], sels: ['#toast'], props: { '#toast': ['o', 't'] }, hit: ['#toast', '#toast-btn'] },
  tooltip:  { toggle: ['#tt'], sels: ['#tt-content'], props: { '#tt-content': ['o'] }, hit: ['#tt-content', '#tt-inner'] },
};
const ALL_SELS = [...new Set(Object.values(OV).flatMap(o => o.sels))];
const HIT_SELS = [...new Set(Object.values(OV).flatMap(o => o.hit))];
const CLOSED_FOCUSABLE = ['drawer-btn', 'drawer-in', 'modal-btn', 'cmdk-in', 'dd-item', 'toast-btn', 'tt-inner'];
const setAll = (page, v) => page.evaluate(`T.set(${JSON.stringify(Object.values(OV).flatMap(o => o.toggle))}, ${JSON.stringify(v)})`);

// ---------- checks ----------
async function check1(page) {
  await go(page, 'page.html');
  const D = await durations(page);
  for (const [name, o] of Object.entries(OV)) {
    for (const dir of ['open', 'close']) {
      // settle in opposite state
      await T(page, `set(${JSON.stringify(o.toggle)}, ${dir === 'open' ? '"false"' : '"true"'})`);
      await T(page, 'sleep(700)');
      const val = dir === 'open' ? 'true' : 'false';
      const dur = dir === 'open' ? D[name].enter : D[name].exit;
      const fr = await T(page, `run(${JSON.stringify(o.toggle)}, ${JSON.stringify(val)}, ${JSON.stringify(o.sels)}, ${dur + 250})`);
      const first = fr[0], last = fr[fr.length - 1];
      const mid = fr.reduce((b, f) => Math.abs(f.t - dur / 2) < Math.abs(b.t - dur / 2) ? f : b, fr[0]);
      const probs = []; const obs = [];
      for (const [sel, ps] of Object.entries(o.props)) for (const p of ps) {
        const key = p === 'o' ? 'o' : 't';
        const a = first.s[sel][key], b = last.s[sel][key];
        const inter = fr.some(f => { const v = f.s[sel][key]; return v !== a && v !== b; });
        if (!inter) probs.push(`${sel}.${p}: no intermediate value (${a} -> ${b})`);
        obs.push(`${sel}.${p} t0=${p === 'o' ? fmt(a) : 'm'} mid(t=${fmt(mid.t)})=${p === 'o' ? fmt(mid.s[sel][key]) : mid.s[sel][key].replace('matrix','m')} end=${p === 'o' ? fmt(b) : 'm'}`);
      }
      // visibility checks on every sampled element
      const vis = [];
      for (const sel of o.sels) {
        const f0 = first.s[sel].v, fl = last.s[sel].v, fm = mid.s[sel].v;
        if (dir === 'open') { if (f0 !== 'visible') probs.push(`${sel}: visibility ${f0} at t=0 (want visible)`); if (fl !== 'visible') probs.push(`${sel}: end visibility ${fl}`); vis.push(`${sel} vis t0=${f0}`); }
        else {
          const hiddenAt = fr.find(f => f.s[sel].v === 'hidden');
          const tH = hiddenAt ? hiddenAt.t : null;
          if (fm !== 'visible') probs.push(`${sel}: visibility ${fm} at mid (want visible)`);
          if (fl !== 'hidden') probs.push(`${sel}: end visibility ${fl}`);
          if (!hiddenOnTime(tH, dur)) probs.push(`${sel}: hidden at t=${tH && fmt(tH)} (want ~${dur})`);
          vis.push(`${sel} hidden@${tH && Math.round(tH)}ms`);
        }
      }
      add('1 animates ' + dir, name, probs.length === 0, probs.length ? probs.join('; ') : `${obs.join(' | ')} | ${vis.join(', ')}`);
    }
  }
}

async function rectsOpen(page) {
  await setAll(page, 'true'); await T(page, 'sleep(800)');
  const r = await T(page, `rects(${JSON.stringify(HIT_SELS)})`);
  await setAll(page, 'false'); await T(page, 'sleep(800)');
  return r;
}
async function inertCheck(page, label, openRects) {
  const closedRects = await T(page, `rects(${JSON.stringify(HIT_SELS)})`);
  for (const [name, o] of Object.entries(OV)) {
    const items = [];
    for (const s of o.hit) { items.push({ sel: s, ...closedRects[s] }); items.push({ sel: s, ...openRects[s] }); }
    const bad = await T(page, `hits(${JSON.stringify(items)})`);
    add(`2 closed inert: elementFromPoint ${label}`, name, bad.length === 0, bad.length ? bad.join('; ') : `no hit at closed or open centres of ${o.hit.join(', ')}`);
  }
  // keyboard
  await page.mouse.move(990, 690);
  await ev(page, () => document.activeElement && document.activeElement.blur());
  const seq = [];
  for (let i = 0; i < 9; i++) { await page.keyboard.press('Tab'); seq.push(await T(page, 'active()')); }
  const bad = seq.filter(id => CLOSED_FOCUSABLE.includes(id));
  add(`2 closed inert: Tab ${label}`, 'all', bad.length === 0 && seq.includes('dd-trigger'), `focus order: ${seq.join(' > ')}${bad.length ? ' | REACHED CLOSED: ' + bad.join(',') : ''}`);
}
async function check2(page) {
  await go(page, 'page.html');
  const openRects = await rectsOpen(page);
  // initial closed (attribute absent on drawer/modal/cmdk, "false" on others) after having cycled once
  await go(page, 'page.html');
  await inertCheck(page, '(initial, no cycle)', openRects);
  await setAll(page, 'true'); await T(page, 'sleep(700)'); await setAll(page, 'false'); await T(page, 'sleep(700)');
  await inertCheck(page, '(after open->close cycle)', openRects);
  // control: the same probes DO find an overlay when it is open (proves the probes can fail)
  for (const [name, o] of Object.entries(OV)) {
    await setAll(page, 'false'); await T(page, 'sleep(500)');
    await T(page, `set(${JSON.stringify(o.toggle)}, "true")`); await T(page, 'sleep(700)');
    const inner = o.hit[1]; const rc = await T(page, `rects(["${inner}"])`);
    const bad = await T(page, `hits(${JSON.stringify([{ sel: inner, ...rc[inner] }])})`);
    const id = inner.slice(1); await ev(page, () => document.activeElement && document.activeElement.blur());
    const seq = []; for (let i = 0; i < 9; i++) { await page.keyboard.press('Tab'); seq.push(await T(page, 'active()')); }
    const reached = CLOSED_FOCUSABLE.includes(id) ? seq.includes(id) : true;
    const hitOk = name === 'tooltip' ? true : bad.length === 1; // tooltip content is pointer-events:none by design
    add('2 control: probes detect an OPEN overlay', name, hitOk && reached, `open: elementFromPoint hits ${inner}=${bad.length === 1}${name === 'tooltip' ? ' (n/a: tooltip is pointer-events none by design)' : ''}; Tab reaches ${id}=${reached}`);
  }
  await setAll(page, 'false'); await T(page, 'sleep(500)');
}
async function check3(page) {
  await go(page, 'page.html');
  const D = await durations(page);
  for (const [name, o] of Object.entries(OV)) {
    await T(page, `set(${JSON.stringify(o.toggle)}, "true")`); await T(page, 'sleep(700)');
    const r = await T(page, `reopen(${JSON.stringify(o.toggle)}, ${JSON.stringify(o.sels)}, ${D[name].exit}, 0.4, ${D[name].enter + 200})`);
    const probs = []; const obs = [];
    for (const sel of o.sels) {
      const vs = r.out.map(f => f.s[sel].v); const os = r.out.map(f => f.s[sel].o);
      if (vs.some(v => v !== 'visible')) probs.push(`${sel}: visibility ${vs.find(v => v !== 'visible')} after re-open`);
      const hasO = (o.props[sel] || []).includes('o');
      if (hasO) {
        if (os.some(v => v <= 0)) probs.push(`${sel}: opacity hit ${Math.min(...os)} after re-open`);
        obs.push(`${sel} opacity at re-open=${fmt(r.pre[sel].o)} min-after=${fmt(Math.min(...os))} end=${fmt(os[os.length - 1])}`);
      } else obs.push(`${sel} vis always visible; transform at re-open=${r.pre[sel].t.replace('matrix', 'm')}`);
    }
    add('3 re-open mid-close no flash', name, probs.length === 0, probs.length ? probs.join('; ') : `re-opened at ${fmt(r.elapsed)}ms of ${D[name].exit}ms exit, ${r.out.length} frames | ${obs.join(' | ')}`);
  }
}

async function check4(page) {
  await page.goto(url('page-open.html'), { waitUntil: 'load' });
  for (let i = 0; i < 40 && !(await page.evaluate(() => window.__first.length >= 2)); i++) await T(page, 'sleep(50)');
  const d = await page.evaluate(() => ({ first: window.__first, tr: window.__tr, now: document.getAnimations().length,
    st: Object.fromEntries(['#drawer-bd','#drawer','#modal-bd','#modal','#cmdk-bd','#cmdk','#dd-menu','#toast','#tt-content'].map(s => { const c = getComputedStyle(document.querySelector(s)); return [s, c.opacity + '/' + c.visibility]; })) }));
  await T(page, 'sleep(50)');
  const allOne = Object.values(d.st).every(v => v === '1/visible');
  const noAnim = d.now === 0 && d.first.every(n => n === 0) && d.tr.length === 0;
  add('4 first paint data-open=true no animation', 'all', allOne && noAnim && d.first.length >= 1, `getAnimations: first rAF frames=[${d.first}], after load=${d.now}; transitionrun/start events=${d.tr.length}${d.tr.length ? ' ' + d.tr.slice(0, 4).join(',') : ''}; opacity/visibility=${Object.values(d.st).join(' ')}`);
}

async function check5(page, intensity) {
  await go(page, 'page.html', intensity);
  const k = await page.evaluate(() => ({ rm: matchMedia('(prefers-reduced-motion: reduce)').matches, scale: T.root('--nw-motion-scale'), pulse: T.root('--nw-pulse-state'), loop: T.root('--nw-loop-state'), inten: document.documentElement.dataset.intensity }));
  add(`5 reduced motion @${intensity}: knobs`, 'root', k.rm && k.scale === '0' && k.pulse === 'paused' && k.loop === 'paused', `matchMedia(rm)=${k.rm} data-intensity=${k.inten} --nw-motion-scale=${k.scale} --nw-pulse-state=${k.pulse} --nw-loop-state=${k.loop}`);
  for (const [name, o] of Object.entries(OV)) {
    const probs = []; const obs = [];
    for (const val of ['true', 'false', 'true']) {
      const r = await page.evaluate(([toggle, sels, val]) => {
        T.set(toggle, val);
        const sync = T.snap(sels); const anims = document.getAnimations().length;
        return new Promise(res => requestAnimationFrame(() => requestAnimationFrame(() => res({ sync, anims, after: T.snap(sels), animsAfter: document.getAnimations().length }))));
      }, [o.toggle, o.sels, val]);
      await T(page, 'sleep(500)');
      const settled = await T(page, `snap(${JSON.stringify(o.sels)})`);
      if (r.anims !== 0 || r.animsAfter !== 0) probs.push(`${val}: getAnimations=${r.anims}/${r.animsAfter}`);
      for (const s of o.sels) {
        for (const key of ['o', 't', 'v']) if (r.sync[s][key] !== settled[s][key]) probs.push(`${val} ${s}.${key}: sync ${r.sync[s][key]} != settled ${settled[s][key]}`);
        const wantV = val === 'true' ? 'visible' : 'hidden';
        if (r.sync[s].v !== wantV) probs.push(`${val} ${s}: visibility ${r.sync[s].v}`);
        if ((o.props[s] || []).includes('o')) { const wantO = val === 'true' ? 1 : 0; if (r.sync[s].o !== wantO) probs.push(`${val} ${s}: opacity ${r.sync[s].o}`); }
      }
      obs.push(`${val}: anims=${r.anims}, sync==settled`);
    }
    add(`5 reduced motion @${intensity}: instant switch`, name, probs.length === 0, probs.length ? probs.slice(0, 4).join('; ') : obs.join(', '));
  }
  const led = await page.evaluate(() => { const l = document.getElementById('led'); const c = getComputedStyle(l); return { name: c.animationName, state: c.animationPlayState, anims: l.getAnimations().length, doc: document.getAnimations().length }; });
  add(`5 reduced motion @${intensity}: LED does not animate`, 'led', led.name === 'none' && led.anims === 0 && led.doc === 0, `animation-name=${led.name} play-state=${led.state} led.getAnimations()=${led.anims} document.getAnimations()=${led.doc}`);
}

async function check6(page) {
  for (const intensity of ['archive', 'operator', 'combat']) {
    await go(page, 'page.html', intensity);
    const led = await page.evaluate(() => { const l = document.getElementById('led'); const c = getComputedStyle(l); const a = l.getAnimations()[0]; return { ps: c.animationPlayState, name: c.animationName, dur: c.animationDuration, api: a ? a.playState : 'none', scale: T.root('--nw-motion-scale'), pulse: T.root('--nw-pulse-state'), o1: c.opacity }; });
    await T(page, 'sleep(400)');
    const o2 = await page.evaluate(() => getComputedStyle(document.getElementById('led')).opacity);
    const want = intensity === 'archive' ? 'paused' : 'running';
    add(`6 LED pulse @${intensity} (no reduced motion)${intensity === 'archive' ? '' : ' [control]'}`, 'led', led.ps === want && led.api === want, `animation-play-state=${led.ps} Animation.playState=${led.api} name=${led.name} dur=${led.dur} scale=${led.scale} --nw-pulse-state=${led.pulse} opacity ${led.o1} -> ${o2} (${intensity === 'archive' ? 'frozen' : 'varies'})`);
  }
}

async function rectOf(page, sel) { return T(page, `rects(["${sel}"])`).then(r => r[sel]); }
async function tipState(page) { const s = await T(page, 'snap(["#tt-content"])'); return s['#tt-content']; }
async function tabTo(page, id) { await ev(page, () => document.activeElement && document.activeElement.blur()); for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); if ((await T(page, 'active()')) === id) return true; } return false; }
async function check7(page) {
  const tipOpen = s => s.o === 1 && s.v === 'visible', tipClosed = s => s.o === 0 && s.v === 'hidden';
  const str = s => `opacity=${s.o} visibility=${s.v}`;
  // a: no attribute
  await go(page, 'page-v2.html');
  await page.mouse.move(990, 690); await T(page, 'sleep(400)');
  let s = await tipState(page); const c0 = tipClosed(s);
  const r = await rectOf(page, '#tt-trigger');
  await page.mouse.move(r.x, r.y); await T(page, 'sleep(500)'); const sh = await tipState(page);
  await page.mouse.move(990, 690); await T(page, 'sleep(500)'); const sa = await tipState(page);
  add('7 tooltip opens on hover', 'tooltip', tipClosed(s) && tipOpen(sh) && tipClosed(sa), `idle: ${str(s)} | hover: ${str(sh)} | mouse away: ${str(sa)}`);
  const ok = await tabTo(page, 'tt-trigger'); await T(page, 'sleep(500)'); const sf = await tipState(page);
  await ev(page, () => document.activeElement.blur()); await T(page, 'sleep(500)'); const sb = await tipState(page);
  add('7 tooltip opens on keyboard focus (:focus-within)', 'tooltip', ok && tipOpen(sf) && tipClosed(sb), `Tab reached trigger=${ok} | focused: ${str(sf)} | blurred: ${str(sb)}`);
  // data-open=true: no hover, no focus
  await go(page, 'page.html'); await page.mouse.move(990, 690);
  await T(page, 'set(["#tt"], "true")'); await T(page, 'sleep(500)'); const st = await tipState(page);
  const act = await T(page, 'active()');
  add('7 tooltip data-open="true" opens without hover/focus', 'tooltip', tipOpen(st) && act !== 'tt-trigger', `${str(st)} | activeElement=${act}`);
  // data-open=false stays closed under hover and focus
  await T(page, 'set(["#tt"], "false")'); await T(page, 'sleep(500)');
  const rr = await rectOf(page, '#tt-trigger');
  await page.mouse.move(rr.x, rr.y); await T(page, 'sleep(500)'); const sfh = await tipState(page);
  await page.mouse.move(990, 690);
  const ok2 = await tabTo(page, 'tt-trigger'); await T(page, 'sleep(500)'); const sff = await tipState(page);
  add('7 tooltip data-open="false" stays closed under hover and focus', 'tooltip', tipClosed(sfh) && ok2 && tipClosed(sff), `hover: ${str(sfh)} | focus (Tab reached=${ok2}): ${str(sff)}`);
}

async function check8(page) {
  await go(page, 'page-v2.html');
  const st = await page.evaluate(() => Object.fromEntries(['#dd-menu', '#toast'].map(s => { const c = getComputedStyle(document.querySelector(s)); return [s, { o: c.opacity, v: c.visibility, pe: c.pointerEvents }]; })));
  const hit = await T(page, `hits(${JSON.stringify([])})`);
  const rm = await T(page, 'rects(["#dd-item","#toast-btn"])');
  // hit test: element at centre of item must be the item (positive)
  const pos = await page.evaluate(([a, b]) => [document.elementFromPoint(a.x, a.y).id, document.elementFromPoint(b.x, b.y).id], [rm['#dd-item'], rm['#toast-btn']]);
  await page.evaluate(() => { window.__clicks = []; for (const id of ['dd-item', 'toast-btn']) document.getElementById(id).addEventListener('click', () => window.__clicks.push(id)); });
  await page.mouse.click(rm['#dd-item'].x, rm['#dd-item'].y); await page.mouse.click(rm['#toast-btn'].x, rm['#toast-btn'].y);
  const clicks = await page.evaluate(() => window.__clicks);
  const seq = []; for (let i = 0; i < 8; i++) { await page.keyboard.press('Tab'); seq.push(await T(page, 'active()')); }
  const vis = x => x.o === '1' && x.v === 'visible' && x.pe === 'auto';
  add('8 v2 markup (no data-open) visible and interactive', 'dropdown', vis(st['#dd-menu']) && pos[0] === 'dd-item' && clicks.includes('dd-item') && seq.includes('dd-item'), `opacity=${st['#dd-menu'].o} visibility=${st['#dd-menu'].v} pointer-events=${st['#dd-menu'].pe} | elementFromPoint=${pos[0]} | click fired=${clicks.includes('dd-item')} | Tab reaches item=${seq.includes('dd-item')}`);
  add('8 v2 markup (no data-open) visible and interactive', 'toast', vis(st['#toast']) && pos[1] === 'toast-btn' && clicks.includes('toast-btn') && seq.includes('toast-btn'), `opacity=${st['#toast'].o} visibility=${st['#toast'].v} pointer-events=${st['#toast'].pe} | elementFromPoint=${pos[1]} | click fired=${clicks.includes('toast-btn')} | Tab reaches button=${seq.includes('toast-btn')}`);
}


// Expected enter/exit durations come from the stylesheet: the longest computed transition-duration
// of an overlay's elements in its open state (enter) and in its closed state (exit). Measured once
// per run; a US2 retune of the motion tokens changes the expectation with it.
async function durations(page) {
  if (DUR) return DUR;
  const d = {};
  for (const [name, o] of Object.entries(OV)) {
    const raw = await T(page, `durations(${JSON.stringify(o.toggle)}, ${JSON.stringify(o.sels)})`);
    d[name] = { enter: maxOfLists(raw.enter), exit: maxOfLists(raw.exit) };
    if (!(d[name].enter > 0 && d[name].exit > 0)) {
      throw new Error(`${name}: computed transition-duration is 0 (enter=${raw.enter}, exit=${raw.exit}); nothing to animate`);
    }
  }
  await T(page, 'sleep(800)'); // let the transitions started by the measurement settle
  return (DUR = d);
}

// ---------- main ----------
/** Run all checks in one engine ('chrome' | 'firefox'); pages must already be in outDir. */
export async function runEngine(engineName, outDir) {
  engine = engineName; OUT = outDir; DUR = undefined; R.length = 0; consoleMsgs.length = 0;
  const out = { engine, rows: R, console: consoleMsgs };
  const normal = await launch(false);
  out.version = normal.version;
  const page = await normal.newPage();
  out.ua = await (async () => { await go(page, 'page.html'); return page.evaluate(() => navigator.userAgent); })();
  out.normalRm = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  for (const [n, f] of [['1', check1], ['2', check2], ['3', check3], ['4', check4], ['6', check6], ['7', check7], ['8', check8]]) {
    try { await f(page); } catch (e) { add(n + ' (script error)', '-', false, String(e.stack || e).split('\n').slice(0, 3).join(' / ')); }
  }
  await normal.close();
  const rmb = await launch(true);
  const rp = await rmb.newPage();
  for (const i of ['archive', 'combat']) { try { await check5(rp, i); } catch (e) { add('5 ' + i + ' (script error)', '-', false, String(e.stack || e).split('\n').slice(0, 3).join(' / ')); } }
  await rmb.close();
  const errs = consoleMsgs.filter(m => !m.startsWith('warning') && !m.startsWith('warn'));
  add('9 console', 'all', errs.length === 0, errs.length ? errs.slice(0, 5).join(' | ') : `no errors (${consoleMsgs.length} warnings/other)`);
  out.durations = DUR ?? {};
  fs.writeFileSync(path.join(OUT, `results-${engine}.json`), JSON.stringify(out, null, 1));
  console.log('done', R.filter(r => r.pass).length, '/', R.length);
  return out;
}

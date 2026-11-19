import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// The pages link the repo-root nightwire.css, located from this file, never from a fixed path.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
export const CSS_FILE = path.join(ROOT, 'nightwire.css');
export const ROOT_DIR = ROOT;

const helper = `
window.__tr = [];
for (const ev of ['transitionrun','transitionstart']) document.addEventListener(ev, e => window.__tr.push(ev+':'+(e.target.id||e.target.className)+':'+e.propertyName), true);
window.T = {
  sleep: ms => new Promise(r => setTimeout(r, ms)),
  raf: () => new Promise(r => requestAnimationFrame(() => r())),
  snap(sels) { const o = {}; for (const s of sels) { const e = document.querySelector(s); const c = getComputedStyle(e); o[s] = { o: +c.opacity, t: c.transform, v: c.visibility, pe: c.pointerEvents }; } return o; },
  set(sels, val) { for (const s of sels) { const e = document.querySelector(s); if (val === null) e.removeAttribute('data-open'); else e.setAttribute('data-open', val); } },
  // computed transition-duration lists of sels once open and once closed; the toggle attributes are restored
  durations(toggle, sels) {
    const prev = toggle.map(s => document.querySelector(s).getAttribute('data-open'));
    const read = () => sels.map(s => getComputedStyle(document.querySelector(s)).transitionDuration);
    T.set(toggle, 'true'); const enter = read();
    T.set(toggle, 'false'); const exit = read();
    toggle.forEach((s, i) => T.set([s], prev[i]));
    return { enter, exit };
  },
  // toggle then sample sync + every frame for ms
  run(toggle, val, sels, ms) {
    return new Promise(res => {
      const out = []; const t0 = performance.now();
      T.set(toggle, val);
      out.push({ t: 0, s: T.snap(sels) });
      const tick = () => { const t = performance.now() - t0; out.push({ t, s: T.snap(sels) }); if (t < ms) requestAnimationFrame(tick); else res(out); };
      requestAnimationFrame(tick);
    });
  },
  // close, wait until frac*exitMs elapsed, reopen, sample frames for ms
  reopen(toggle, sels, exitMs, frac, ms) {
    return new Promise(res => {
      const t0 = performance.now(); T.set(toggle, 'false');
      const wait = () => {
        const el = performance.now() - t0;
        if (el < frac * exitMs) return requestAnimationFrame(wait);
        const pre = T.snap(sels); T.set(toggle, 'true');
        const t1 = performance.now(); const out = [{ t: 0, s: T.snap(sels) }];
        const tick = () => { const t = performance.now() - t1; out.push({ t, s: T.snap(sels) }); if (t < ms) requestAnimationFrame(tick); else res({ elapsed: el, pre, out }); };
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(wait);
    });
  },
  rects(sels) { const o = {}; for (const s of sels) { const r = document.querySelector(s).getBoundingClientRect(); o[s] = { x: r.x + r.width/2, y: r.y + r.height/2, w: r.width, h: r.height }; } return o; },
  hits(items) { // items: [{sel, x, y}] -> list of selectors whose element or descendant is hit
    const bad = []; for (const it of items) { const e = document.querySelector(it.sel); const h = document.elementFromPoint(it.x, it.y); if (h && (h === e || e.contains(h))) bad.push(it.sel + '@' + Math.round(it.x) + ',' + Math.round(it.y) + ' -> ' + (h.id || h.className)); } return bad;
  },
  active() { const a = document.activeElement; return a ? (a.id || a.tagName) : 'null'; },
  root(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); },
};
`;

function page(css, open) {
  const o = (v) => (open ? ' data-open="true"' : v);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>overlays</title>
<link rel="stylesheet" href="${css}">
<style>body{margin:0;padding:0;min-height:700px} #pos-dd{position:absolute;left:40px;top:40px} #toast{position:absolute;left:40px;top:220px;width:300px} #pos-tt{position:absolute;left:480px;top:160px} #pos-led{position:absolute;left:40px;top:340px}</style>
<script>${helper}</script></head><body>
<div class="drawer-backdrop" id="drawer-bd"${o('')}></div>
<aside class="drawer" id="drawer"${o('')}><div class="drawer-header">Drawer <button class="btn" id="drawer-btn">Close</button></div><div class="drawer-body"><input id="drawer-in"></div></aside>
<div class="modal-backdrop" id="modal-bd"${o('')}><div class="modal" id="modal"><div class="modal-header">Modal</div><div class="modal-body">Body</div><div class="modal-footer"><button class="btn" id="modal-btn">OK</button></div></div></div>
<div class="cmdk-backdrop" id="cmdk-bd"${o('')}><div class="cmdk" id="cmdk"><input id="cmdk-in" placeholder="Search"></div></div>
<div id="pos-dd"><div class="dropdown" id="dd"${o(' data-open="false"')}><button class="btn" id="dd-trigger">Menu</button><div class="dropdown-menu" id="dd-menu"><button class="dropdown-item" id="dd-item">Item</button></div></div></div>
<div class="toast toast-info" id="toast"${o(' data-open="false"')}>Saved <button class="btn" id="toast-btn">Undo</button></div>
<div id="pos-tt"><span class="tooltip" id="tt"${o(' data-open="false"')}><button class="btn" id="tt-trigger">Hover me</button><span class="tooltip-content" id="tt-content">Tip <button id="tt-inner">x</button></span></span></div>
${open ? '' : '<div id="pos-led"><span class="led" data-pulse data-state="ok" id="led"></span></div>'}
<script>window.__first=[];requestAnimationFrame(()=>{window.__first.push(document.getAnimations().length);requestAnimationFrame(()=>window.__first.push(document.getAnimations().length))});</script>
</body></html>`;
}

/** Write page.html, page-open.html and page-v2.html into outDir. */
export function writePages(outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const css = pathToFileURL(CSS_FILE).href;
  // closed page: drawer/modal/cmdk without attribute (v1-style absent), dropdown/toast/tooltip data-open=false
  fs.writeFileSync(path.join(outDir, 'page.html'), page(css, false));
  fs.writeFileSync(path.join(outDir, 'page-open.html'), page(css, true));
  // v2 page: dropdown, toast and tooltip without data-open
  const v2 = page(css, false).replace(' data-open="false"', '').replace(/( id="toast") data-open="false"/, '$1').replace(/( id="tt") data-open="false"/, '$1');
  fs.writeFileSync(path.join(outDir, 'page-v2.html'), v2);
}

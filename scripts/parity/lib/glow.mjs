// The glow rules of FR-013b / SC-012, checked over parity shadow records. Pure, zero dependencies.
//
//   operator  every box-shadow / text-shadow difference at none and operator, and every glow that
//             did not change, is a smaller blur than v2.1.0's (or no glow at all), layer by layer
//   archive   no element has a coloured blur
//   combat    no element blurs more than it does at operator, unless it is a state signal, and a
//             state signal stays below its v2.1.0 combat blur
//   FR-034    the decorative glows approved with the mockup are named exceptions (see FR034 below)
//
// A "glow" is a layer with a blur radius that is not neutral black. Black layers are elevation
// (the overlay shadow), and layers without blur are rings, borders or pressed states.

const SPLIT_LAYERS = /,(?![^(]*\))/;
const COLOUR = /(?:rgba?|hsla?)\([^)]*\)/;

/** Layers of a computed box-shadow or text-shadow; none and <missing> give []. */
export function parseShadow(value) {
  if (value === 'none' || value === '<missing>') return [];
  return value.split(SPLIT_LAYERS).map((raw) => {
    const text = raw.trim();
    const m = text.match(COLOUR);
    let color = null;
    if (m) {
      const nums = m[0].slice(m[0].indexOf('(') + 1, -1).split(/[ ,/]+/).filter(Boolean).map(Number);
      color = { r: nums[0], g: nums[1], b: nums[2], a: nums[3] ?? 1 };
    }
    const rest = text.replace(COLOUR, ' ');
    const inset = /\binset\b/.test(rest);
    const [x = 0, y = 0, blur = 0, spread = 0] = (rest.match(/-?\d*\.?\d+(?=px)/g) ?? []).map(Number);
    return { color, x, y, blur, spread, inset };
  });
}

const isElevation = (l) => l.color !== null && l.color.r === 0 && l.color.g === 0 && l.color.b === 0;
const isGlow = (l) => l.blur > 0 && !isElevation(l);

const plain = (path) => path.replace(/:nth-child\(\d+\)/g, '');

// Elements that read the state-glow knobs (--nw-led-glow, --nw-control-glow, --nw-progress-glow),
// the only ones FR-013b lets glow more at combat than at operator.
const STATE_SIGNAL = [
  /(^|>)span\.led(::(before|after))?$/,
  /(^|>)span\.box(::(before|after))?$/,
  /(^|>)span\.track(::(before|after))?$/,
  /(^|>)div\.seg>button$/,
  /(^|>)div\.step$/,
  /(^|>)div\.nw-progress-fill$/,
];
export const isStateSignalPath = (path) => STATE_SIGNAL.some((re) => re.test(plain(path)));

// Example-page rules that carry their own status glow and read the state knobs through
// calc(Npx * var(--nw-led-glow | --nw-progress-glow, var(--nw-glow))). They are accepted by page
// and path so the library list above does not learn page-local class names.
const PAGE_STATE_SIGNAL = [
  { page: 'examples/html/synapse-ops.html', re: /(^|>)(span\.(dot|ev-dot)|div\.rbar-fill)$/ },
  { page: 'examples/html/neural-ops.html', re: /(^|>)div\.layer-fill$/ },
];
export const isPageStateSignal = (page, path) => PAGE_STATE_SIGNAL.some((e) => e.page === page && e.re.test(plain(path)));

// A glow that did not exist in v2.1.0 is acceptable on a state that is new in v3: the active LED.
// Parity paths carry no attributes, so the state is recognised by the glow colour, which is
// --nw-chrome (#6699ff) for data-state="active" and the colour of no other LED state. Every layer
// must have it, so a plain .led or another state that gains a glow still fails.
const CHROME = { r: 102, g: 153, b: 255 };
const isChrome = (l) => l.color !== null && l.color.r === CHROME.r && l.color.g === CHROME.g && l.color.b === CHROME.b;
const NEW_SIGNAL = [
  {
    re: /(^|>)span\.led$/,
    layers: (glows) => glows.every(isChrome),
    reason: '.led[data-state="active"] is new in v3 (T042); it glows like the other LED states, at --nw-led-glow',
  },
];
const newSignalReason = (path, glows) => NEW_SIGNAL.find(({ re, layers }) => re.test(plain(path)) && layers(glows))?.reason;

// FR-034: the decorative glows approved with the mockup, each scaled by a knob and 0 at archive.
// Two so far, both on --nw-kanji-glow: the kanji of .nw-section-head-chrome, and the kanji of
// .nw-index-row on hover. Parity paths name only the first class of an element, so the chrome
// variant is told from a plain .nw-section-head by the glow colour, --nw-chrome, as the active LED
// is above; the kanji of .panel-header and .card-header has no glow and is not listed. The
// exception is for text-shadow only and for a glow with no v2.1.0 counterpart: an existing glow is
// still compared against its old blur.
const FR034 = [
  {
    re: /(^|>)[a-z0-9]+\.nw-section-head(-chrome)?>[a-z0-9]+\.kanji$/,
    prop: 'text-shadow',
    layers: (glows) => glows.every(isChrome),
    reason: 'FR-034: the kanji of .nw-section-head-chrome glows at --nw-kanji-glow (10px at operator, 0 at archive)',
  },
  {
    re: /(^|>)[a-z0-9]+\.nw-index-row>[a-z0-9]+\.kanji$/,
    prop: 'text-shadow',
    layers: (glows) => glows.every(isChrome),
    reason: 'FR-034: the kanji of .nw-index-row glows on hover at --nw-kanji-glow x .8 (8px at operator, 0 at archive)',
  },
];
const fr034For = (record, glows) => FR034.find(({ re, prop, layers }) => prop === record.prop && re.test(plain(record.path)) && layers(glows));

const operatorState = (state) => /^(none|operator)\|/.test(state);

function judgeOperator(record) {
  const before = parseShadow(record.old);
  const after = parseShadow(record.new);
  const glows = after.map((layer, i) => ({ layer, old: before[i] })).filter(({ layer }) => isGlow(layer));
  if (!glows.length) {
    if (after.some((l) => isElevation(l) && l.blur > 0)) return { kind: 'elevation', reason: 'neutral black elevation shadow, not a glow' };
    if (before.some(isGlow)) return { kind: 'removed' };
    return { kind: 'no-blur', reason: 'no blur radius (focus ring, border or pressed state), not a glow' };
  }
  if (glows.every(({ layer, old }) => old && layer.blur < old.blur)) return { kind: 'smaller' };
  if (glows.some(({ layer, old }) => old && layer.blur >= old.blur)) return { kind: 'violation', reason: 'blur is not smaller than in v2.1.0' };
  const exception = fr034For(record, glows.map(({ layer }) => layer));
  if (exception) return { kind: 'fr-034', reason: exception.reason };
  const reason = newSignalReason(record.path, glows.map(({ layer }) => layer));
  if (reason) return { kind: 'new-signal', reason };
  return { kind: 'violation', reason: 'a glow with no v2.1.0 counterpart' };
}

/**
 * @param {{page:string,state:string,path:string,prop:string,old:string,new:string}[]} shadows
 *        the `shadows` of a parity --json file
 */
export function checkGlow(shadows) {
  const operator = { checked: 0, smaller: 0, removed: 0, 'no-blur': 0, elevation: 0, 'new-signal': 0, 'fr-034': 0, exceptions: [], violations: [] };
  const archive = { checked: 0, violations: [] };
  const combat = { checked: 0, 'at-or-below-operator': 0, 'state-signal': 0, 'fr-034': 0, violations: [] };

  const operatorNew = new Map(); // key of the operator state -> layers
  const key = (r, state) => [r.page, state, r.path, r.prop].join('\u0000');
  for (const r of shadows) if (r.state.startsWith('operator|')) operatorNew.set(key(r, r.state), parseShadow(r.new));

  for (const r of shadows) {
    if (operatorState(r.state) && (r.old !== r.new || parseShadow(r.new).some(isGlow))) {
      operator.checked++;
      const verdict = judgeOperator(r);
      if (verdict.kind === 'violation') operator.violations.push({ ...r, reason: verdict.reason });
      else {
        operator[verdict.kind]++;
        if (verdict.reason) operator.exceptions.push({ ...r, kind: verdict.kind, reason: verdict.reason });
      }
    }

    if (r.state.startsWith('archive|')) {
      const after = parseShadow(r.new);
      if (after.length) archive.checked++;
      if (after.some(isGlow)) archive.violations.push({ ...r, reason: 'coloured blur at archive' });
    }

    if (r.state.startsWith('combat|')) {
      const after = parseShadow(r.new);
      if (!after.some(isGlow)) continue;
      combat.checked++;
      const atOperator = operatorNew.get(key(r, r.state.replace(/^combat\|/, 'operator|'))) ?? [];
      const before = parseShadow(r.old);
      const rising = after.map((layer, i) => ({ layer, op: atOperator[i], old: before[i] })).filter(({ layer, op }) => isGlow(layer) && layer.blur > (op?.blur ?? 0));
      if (!rising.length) { combat['at-or-below-operator']++; continue; }
      if (fr034For(r, rising.map(({ layer }) => layer)) && rising.every(({ old }) => !old)) { combat['fr-034']++; continue; }
      if (!isStateSignalPath(r.path) && !isPageStateSignal(r.page, r.path)) combat.violations.push({ ...r, reason: 'blurs more than at operator and is not a state signal' });
      else if (rising.some(({ layer, old }) => old && !(layer.blur < old.blur))) combat.violations.push({ ...r, reason: 'state signal is not below its v2.1.0 combat blur' });
      else combat['state-signal']++;
    }
  }
  return { operator, archive, combat };
}

const last = (path) => plain(path).split('>').pop();

/** Printable report and exit code (1 when any rule has a violation) for a checkGlow() result. */
export function formatGlowReport({ operator, archive, combat }) {
  const lines = [];
  lines.push(`OPERATOR  checked=${operator.checked}  smaller=${operator.smaller}  removed=${operator.removed}  no-blur=${operator['no-blur']}  elevation=${operator.elevation}  new-signal=${operator['new-signal']}  fr-034=${operator['fr-034']}  violations=${operator.violations.length}`);
  const groups = new Map();
  for (const e of operator.exceptions) {
    const k = `${e.kind}\u0000${e.reason}`;
    const g = groups.get(k) ?? { kind: e.kind, reason: e.reason, count: 0, elements: new Set() };
    g.count++;
    g.elements.add(`${last(e.path)} ${e.prop}`);
    groups.set(k, g);
  }
  for (const g of groups.values()) lines.push(`EXCEPTION  ${g.kind}  ${g.count}  ${g.reason}  [${[...g.elements].sort().join('; ')}]`);
  lines.push(`ARCHIVE  checked=${archive.checked}  violations=${archive.violations.length}`);
  lines.push(`COMBAT  checked=${combat.checked}  at-or-below-operator=${combat['at-or-below-operator']}  state-signal=${combat['state-signal']}  fr-034=${combat['fr-034']}  violations=${combat.violations.length}`);
  for (const [area, list] of [['operator', operator.violations], ['archive', archive.violations], ['combat', combat.violations]]) {
    for (const v of list) lines.push(`VIOLATION  ${area}  ${v.page}  [${v.state}]  ${v.path}  ${v.prop}  ${v.old} → ${v.new}  (${v.reason})`);
  }
  const violations = operator.violations.length + archive.violations.length + combat.violations.length;
  lines.push(`RESULT  violations=${violations}`);
  return { lines, exitCode: violations ? 1 : 0 };
}

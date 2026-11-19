// WCAG 2.x contrast maths and the pair evaluator behind `npm run design:contrast`.
// Zero-dependency Node ESM. See docs/design/v3/contrast-pairs.json for the pairings it checks.

/** Minimum ratio per pair kind (FR-014): AA text, and AA large text / UI components (WCAG 1.4.11). */
export const REQUIRED = Object.freeze({ text: 4.5, 'large-text': 3, ui: 3 });

export const LEVELS = Object.freeze(['archive', 'operator', 'combat']);

const colourError = (input, why) => new Error(`cannot parse colour ${JSON.stringify(input)}: ${why}`);

function channel(text, input) {
  const n = Number(text);
  if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(text) || !(n >= 0 && n <= 255)) throw colourError(input, `channel ${text} is not 0-255`);
  return n;
}

function alpha(text, input) {
  const pct = text.endsWith('%');
  const n = Number(pct ? text.slice(0, -1) : text);
  const value = pct ? n / 100 : n;
  if (!/^[+-]?(\d+\.?\d*|\.\d+)%?$/.test(text) || !(value >= 0 && value <= 1)) throw colourError(input, `alpha ${text} is not 0-1`);
  return value;
}

/** Parse #rgb, #rrggbb, rgb() and rgba() (comma or space syntax) into {r, g, b, a}. */
export function parseColor(input) {
  if (typeof input !== 'string') throw colourError(input, 'not a string');
  const text = input.trim();
  let m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
  if (m) {
    const hex = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
    return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16), a: 1 };
  }
  m = /^rgba?\(\s*([^)]*)\)$/i.exec(text);
  if (!m) throw colourError(input, 'expected #rgb, #rrggbb, rgb() or rgba()');
  const inner = m[1].trim();
  let parts;
  if (inner.includes(',')) {
    parts = inner.split(',').map((s) => s.trim());
  } else {
    const [rgb, a] = inner.split('/').map((s) => s.trim());
    parts = rgb.split(/\s+/);
    if (a !== undefined) parts.push(a);
  }
  if (parts.length !== 3 && parts.length !== 4) throw colourError(input, 'expected 3 channels and an optional alpha');
  return {
    r: channel(parts[0], input),
    g: channel(parts[1], input),
    b: channel(parts[2], input),
    a: parts.length === 4 ? alpha(parts[3], input) : 1,
  };
}

const asColor = (c) => (typeof c === 'string' ? parseColor(c) : c);

/** Composite `fg` (any alpha) over an opaque `bg`; the result is opaque. */
export function composite(fg, bg) {
  if (bg.a !== 1) throw new Error('composite needs an opaque background');
  const a = fg.a;
  return { r: a * fg.r + (1 - a) * bg.r, g: a * fg.g + (1 - a) * bg.g, b: a * fg.b + (1 - a) * bg.b, a: 1 };
}

/** Composite a stack of layers, bottom first. The bottom layer must be opaque. */
export function flatten(layers) {
  if (!Array.isArray(layers) || layers.length === 0) throw new Error('flatten needs at least one layer');
  let acc = asColor(layers[0]);
  if (acc.a !== 1) throw new Error('the bottom layer of a stack must be opaque');
  for (const layer of layers.slice(1)) acc = composite(asColor(layer), acc);
  return acc;
}

/** WCAG relative luminance of an opaque colour. */
export function relativeLuminance({ r, g, b }) {
  const lin = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/**
 * Contrast ratio of `fg` against `bg`. `bg` is a colour or a stack (bottom first). A translucent
 * `fg` is composited over the flattened background first; `opacity` multiplies its alpha (the
 * CSS `opacity` on a placeholder).
 */
export function contrastRatio(fg, bg, { opacity = 1 } = {}) {
  const surface = flatten(Array.isArray(bg) ? bg : [bg]);
  const f = asColor(fg);
  const ink = composite({ ...f, a: f.a * opacity }, surface);
  const l1 = relativeLuminance(ink);
  const l2 = relativeLuminance(surface);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// ── Tokens ───────────────────────────────────────────────────────────────────────────────────

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

function declarations(body) {
  const map = new Map();
  for (const decl of body.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const name = decl.slice(0, i).trim();
    if (name.startsWith('--')) map.set(name, decl.slice(i + 1).trim());
  }
  return map;
}

/**
 * Read custom properties from top-level `:root` (base) and `:root[data-intensity="<level>"]`
 * rules. Rules nested inside any at-rule (@media, @supports, ...) are ignored, tracked by brace
 * depth, so a `:root {}` inside @media is never mistaken for a base token.
 */
export function parseTokenCss(css) {
  const base = new Map();
  const levels = Object.fromEntries(LEVELS.map((l) => [l, new Map()]));
  const text = stripComments(css);
  let depth = 0;
  let preludeStart = 0;
  let open = null; // the depth-0 rule being read: { selector, bodyStart, nested }
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') {
      if (depth === 0) open = { selector: text.slice(preludeStart, i).trim(), bodyStart: i + 1, nested: false };
      else if (open) open.nested = true;
      depth++;
    } else if (ch === '}') {
      depth = Math.max(0, depth - 1);
      if (depth === 0) {
        if (open && !open.nested) {
          const sel = open.selector;
          const target = sel === ':root' ? base : levels[/^:root\[data-intensity=["']?(\w+)["']?\]$/.exec(sel)?.[1]];
          if (target) for (const [k, v] of declarations(text.slice(open.bodyStart, i))) target.set(k, v);
        }
        open = null;
        preludeStart = i + 1;
      }
    } else if (ch === ';' && depth === 0) {
      preludeStart = i + 1; // @import / @charset statements
    }
  }
  return { base, levels };
}

/** The custom properties as they compute at one intensity: base, overridden by that level. */
export function tokensForLevel(parsed, level) {
  if (!LEVELS.includes(level)) throw new Error(`unknown intensity level ${JSON.stringify(level)} (expected ${LEVELS.join(', ')})`);
  return new Map([...parsed.base, ...parsed.levels[level]]);
}

const VAR = /var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*?))?\s*\)/g;

function resolveName(name, map, stack) {
  if (stack.includes(name)) throw new Error(`token cycle: ${[...stack, name].join(' -> ')}`);
  if (!map.has(name)) throw new Error(`token ${name} is not defined`);
  return map.get(name).replace(VAR, (_, ref, fallback) => {
    if (map.has(ref)) return resolveName(ref, map, [...stack, name]);
    if (fallback !== undefined) return fallback;
    throw new Error(`token ${ref} is not defined (referenced by ${name})`);
  });
}

/** Resolve a custom property to a colour, following var() chains. calc() and the like are errors. */
export function resolveColorToken(name, map) {
  const value = resolveName(name, map, []);
  if (/calc\(/i.test(value)) throw new Error(`token ${name} resolves to a calc() value (${value}), not a colour`);
  try {
    return parseColor(value);
  } catch (err) {
    throw new Error(`token ${name}: ${err.message}`);
  }
}

// ── Pairs ────────────────────────────────────────────────────────────────────────────────────

const REQUIRED_FIELDS = ['id', 'fg', 'bg', 'kind', 'where'];

function validatePair(pair) {
  for (const f of REQUIRED_FIELDS) {
    if (pair[f] === undefined || pair[f] === '') throw new Error(`pair ${pair.id ?? '(no id)'} is missing ${f}`);
  }
  if (!Array.isArray(pair.bg) || pair.bg.length === 0) throw new Error(`pair ${pair.id}: bg must be a non-empty array (surface stack, bottom first)`);
  if (!(pair.kind in REQUIRED)) throw new Error(`pair ${pair.id}: unknown kind ${JSON.stringify(pair.kind)} (expected ${Object.keys(REQUIRED).join(', ')})`);
  if (pair.levels !== undefined && (!Array.isArray(pair.levels) || pair.levels.length === 0)) throw new Error(`pair ${pair.id}: levels must be a non-empty array`);
}

const resolveRef = (ref, map) => (ref.startsWith('--') ? resolveColorToken(ref, map) : parseColor(ref));

/**
 * Evaluate every pair in `spec.pairs` against the tokens in `tokenCss`. A pair with several
 * `levels` yields one result per level, with ids suffixed `@level`.
 */
export function evaluatePairs(spec, tokenCss) {
  const parsed = parseTokenCss(tokenCss);
  const seen = new Set();
  const results = [];
  for (const pair of spec.pairs) {
    validatePair(pair);
    if (seen.has(pair.id)) throw new Error(`duplicate pair id ${pair.id}`);
    seen.add(pair.id);
    const levels = pair.levels ?? ['operator'];
    for (const level of levels) {
      const map = tokensForLevel(parsed, level);
      let ratio;
      try {
        ratio = contrastRatio(resolveRef(pair.fg, map), pair.bg.map((b) => resolveRef(b, map)), { opacity: pair.opacity ?? 1 });
      } catch (err) {
        throw new Error(`pair ${pair.id}@${level}: ${err.message}`);
      }
      const required = REQUIRED[pair.kind];
      results.push({
        id: levels.length > 1 ? `${pair.id}@${level}` : pair.id,
        level,
        fg: pair.fg,
        bg: pair.bg,
        kind: pair.kind,
        where: pair.where,
        ratio,
        required,
        pass: ratio >= required,
      });
    }
  }
  return results;
}

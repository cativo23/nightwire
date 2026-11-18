// Design-token model for src/tokens/tokens.json (W3C DTCG 2025.10). Zero dependencies.
//
// validate(tree)   throws on the first rule violation, naming the token path
// resolve(tree, p) the literal CSS-form value of a token (aliases followed to the end)
// emitCss(tree)    the :root block and the three intensity blocks (src/tokens/tokens.css)
// emitPreset(tree) the Tailwind preset module (tailwind.preset.js)
//
// Nightwire metadata lives under $extensions["dev.cativo.nightwire"]. See
// docs/architecture/tokens.md for every key and for the documented deviation (raw tokens).

export const NS = 'dev.cativo.nightwire';

const LEVELS = ['archive', 'operator', 'combat'];
const TYPES = new Set(['color', 'dimension', 'fontFamily', 'fontWeight', 'number', 'duration', 'cubicBezier']);
const TOKEN_PROPS = new Set(['$value', '$type', '$description', '$extensions', '$deprecated']);
const GROUP_PROPS = new Set(['$type', '$description', '$extensions', '$deprecated', '$schema']);
const GENERIC_FAMILIES = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui',
  'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'emoji', 'math', 'fangsong']);
const CSS_NAME = /^--[a-z][a-z0-9-]*$/;
const WHOLE_ALIAS = /^\{([^{}]+)\}$/;
const ANY_ALIAS = /\{([^{}]+)\}/g;

export class TokenError extends Error {}
const fail = (where, message) => { throw new TokenError(`${where}: ${message}`); };

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isToken = (node) => isObject(node) && '$value' in node;
const extOf = (node) => (isObject(node?.$extensions?.[NS]) ? node.$extensions[NS] : {});
const wholeAlias = (value) => (typeof value === 'string' ? value.match(WHOLE_ALIAS)?.[1] : undefined);

// ---- index ----------------------------------------------------------------------------------

/**
 * Walk the tree once, in key order. Returns every token with its inherited group type,
 * inherited formatting keys and parent group. Name rules are checked here.
 */
function index(tree) {
  const tokens = new Map();
  const visit = (group, path, inheritedType, inheritedFmt) => {
    const gext = extOf(group);
    const fmt = { ...inheritedFmt };
    if ('designMdCssNote' in gext) fmt.designMdCssNote = gext.designMdCssNote;
    const groupType = group.$type ?? inheritedType;
    for (const key of Object.keys(group)) {
      const where = [...path, key].join('.');
      if (key.startsWith('$')) {
        if (!GROUP_PROPS.has(key) || (key === '$schema' && path.length)) fail(where, `invalid name "${key}"`);
        continue;
      }
      if (/[{}.]/.test(key)) fail(where, `invalid name "${key}" (names cannot contain { } .)`);
      const child = group[key];
      if (!isObject(child)) fail(where, 'expected a token or a group object');
      if (isToken(child)) {
        for (const prop of Object.keys(child)) {
          if (prop.startsWith('$') && !TOKEN_PROPS.has(prop)) fail(`${where}.${prop}`, `invalid name "${prop}"`);
        }
        tokens.set(where, { path: where, node: child, ext: extOf(child), groupType, fmt, group, groupPath: path.join('.') });
      } else {
        visit(child, [...path, key], groupType, fmt);
      }
    }
  };
  if (!isObject(tree)) fail('(root)', 'tokens.json must be an object');
  visit(tree, [], undefined, {});
  return tokens;
}

// ---- type, literal and CSS value --------------------------------------------------------------

function makeResolver(tokens) {
  const get = (path, from) => {
    const t = tokens.get(path);
    if (!t) fail(from, `unknown alias {${path}}`);
    return t;
  };

  /** Resolved $type: the alias target's type, then the token's own, then the group's. 'raw' for raw. */
  const typeOf = (path, seen = []) => {
    if (seen.includes(path)) fail(seen[0], `alias cycle ${[...seen, path].join(' → ')}`);
    const t = get(path, seen.at(-1) ?? path);
    if (t.ext.raw) return 'raw';
    const target = wholeAlias(t.node.$value);
    if (target) return typeOf(target, [...seen, path]);
    return t.node.$type ?? t.groupType;
  };

  const literal = (path, seen = []) => {
    if (seen.includes(path)) fail(seen[0], `alias cycle ${[...seen, path].join(' → ')}`);
    const t = get(path, seen.at(-1) ?? path);
    const value = t.node.$value;
    if (t.ext.raw) return interpolate(value, [...seen, path]);
    const target = wholeAlias(value);
    if (target) return literal(target, [...seen, path]);
    return formatTyped(typeOf(path), value);
  };

  const interpolate = (text, seen) => String(text).replace(ANY_ALIAS, (_, p) => literal(p, seen));

  const cssValue = (path) => {
    const t = tokens.get(path);
    const target = !t.ext.raw && wholeAlias(t.node.$value);
    if (target) return `var(${tokens.get(target).ext.css})`;
    return literal(path);
  };

  /** Value of an intensity override for the token at `path`. */
  const overrideCss = (path, value) => {
    if (typeof value === 'string') {
      const target = wholeAlias(value);
      if (target) return `var(${get(target, path).ext.css})`;
      return interpolate(value, [path]);
    }
    return formatTyped(typeOf(path), value);
  };

  /** Preset form: fontFamily stays an array, everything else is the literal string. */
  const presetValue = (path) => {
    let p = path;
    for (let target; (target = !tokens.get(p).ext.raw && wholeAlias(tokens.get(p).node.$value));) p = target;
    const t = tokens.get(p);
    if (typeOf(p) === 'fontFamily') return Array.isArray(t.node.$value) ? [...t.node.$value] : [t.node.$value];
    return literal(p);
  };

  return { get, typeOf, literal, cssValue, overrideCss, presetValue };
}

function formatTyped(type, value) {
  switch (type) {
    case 'color': {
      if (value.alpha === undefined || value.alpha === 1) return value.hex.toLowerCase();
      const [r, g, b] = value.components.map((c) => Math.round(c * 255));
      return `rgba(${r}, ${g}, ${b}, ${value.alpha})`;
    }
    case 'dimension': return value.value === 0 ? '0' : `${value.value}${value.unit}`;
    case 'duration': return `${value.value}${value.unit}`;
    case 'number':
    case 'fontWeight': return String(value);
    case 'cubicBezier': return `cubic-bezier(${value.join(', ')})`;
    case 'fontFamily': return Array.isArray(value)
      ? value.map((f) => (GENERIC_FAMILIES.has(f) ? f : `'${f}'`)).join(', ')
      : value;
    default: throw new TokenError(`cannot format a value of type ${type}`);
  }
}

// ---- validation -------------------------------------------------------------------------------

const isNum = (n) => typeof n === 'number' && Number.isFinite(n);
const inUnit = (n) => isNum(n) && n >= 0 && n <= 1;

function checkShape(where, type, value) {
  switch (type) {
    case 'color': {
      if (!isObject(value)) fail(where, 'a color $value must be a DTCG color object {colorSpace, components, alpha?, hex}');
      if (value.colorSpace !== 'srgb') fail(where, 'color colorSpace must be "srgb"');
      if (!Array.isArray(value.components) || value.components.length !== 3 || !value.components.every(inUnit)) {
        fail(where, 'color components must be 3 numbers in [0, 1]');
      }
      if (value.alpha !== undefined && !inUnit(value.alpha)) fail(where, 'color alpha must be a number in [0, 1]');
      if (typeof value.hex !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(value.hex)) fail(where, 'color hex must be a 6-digit #rrggbb string');
      const fromComponents = '#' + value.components.map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('');
      if (fromComponents !== value.hex.toLowerCase()) fail(where, `color hex ${value.hex} does not match components (${fromComponents})`);
      return;
    }
    case 'dimension':
      if (!isObject(value) || !isNum(value.value) || !['px', 'rem'].includes(value.unit)) fail(where, 'dimension must be {value, unit} with unit px or rem');
      return;
    case 'duration':
      if (!isObject(value) || !isNum(value.value) || !['ms', 's'].includes(value.unit)) fail(where, 'duration must be {value, unit} with unit ms or s');
      return;
    case 'cubicBezier':
      if (!Array.isArray(value) || value.length !== 4 || !value.every(isNum) || !inUnit(value[0]) || !inUnit(value[2])) {
        fail(where, 'cubicBezier must be 4 numbers with x1 and x2 in [0, 1]');
      }
      return;
    case 'number':
    case 'fontWeight':
      if (!isNum(value)) fail(where, `${type} must be a number`);
      return;
    case 'fontFamily':
      if (!(typeof value === 'string' || (Array.isArray(value) && value.length && value.every((v) => typeof v === 'string')))) {
        fail(where, 'fontFamily must be a string or a non-empty array of strings');
      }
      return;
    default:
      fail(where, `unsupported $type "${type}"`);
  }
}

function checkTargets(tokens, key) {
  const owners = new Map();
  for (const t of tokens.values()) {
    const list = t.ext[key];
    if (list === undefined) continue;
    if (!Array.isArray(list) || !list.every((p) => typeof p === 'string' && p)) fail(t.path, `${key} must be an array of dot paths`);
    for (const p of list) {
      if (owners.has(p)) fail(t.path, `${key} path ${p} is already produced by ${owners.get(p)}`);
      owners.set(p, t.path);
    }
  }
  const paths = [...owners.keys()].sort();
  for (let i = 1; i < paths.length; i++) {
    if (paths[i].startsWith(paths[i - 1] + '.')) {
      fail(owners.get(paths[i]), `${key} path ${paths[i]} is nested under ${paths[i - 1]} (${owners.get(paths[i - 1])})`);
    }
  }
}

export function validate(tree) {
  const tokens = index(tree);
  const r = makeResolver(tokens);
  const cssOwners = new Map();

  for (const t of tokens.values()) {
    const { path, node, ext } = t;
    if (!ext.css && !ext.tailwind?.length && !ext.designMd?.length) {
      fail(path, 'a token needs at least one of css, tailwind, designMd');
    }
    if (ext.css !== undefined) {
      if (typeof ext.css !== 'string' || !CSS_NAME.test(ext.css)) fail(path, `css name ${ext.css} must match ^--[a-z][a-z0-9-]*$`);
      if (cssOwners.has(ext.css)) fail(path, `css name ${ext.css} is already used by ${cssOwners.get(ext.css)}`);
      cssOwners.set(ext.css, path);
    }
    if (ext.raw !== undefined && typeof ext.raw !== 'boolean') fail(path, 'raw must be a boolean');

    const value = node.$value;
    if (ext.raw) {
      if (typeof value !== 'string') fail(path, 'a raw token $value must be a string');
      for (const [, ref] of value.matchAll(ANY_ALIAS)) {
        if (!tokens.has(ref)) fail(path, `unknown alias {${ref}}`);
      }
      r.literal(path);
      continue;
    }
    const target = wholeAlias(value);
    if (target) {
      if (!tokens.has(target)) fail(path, `unknown alias {${target}}`);
      r.typeOf(path);
      r.literal(path);
      if (ext.css && !tokens.get(target).ext.css) fail(path, `alias {${target}} is emitted as var() but ${target} has no css`);
      continue;
    }
    const type = node.$type ?? t.groupType;
    if (!type) fail(path, '$type is required (directly or from a group) unless the token is raw');
    if (!TYPES.has(type)) fail(path, `unsupported $type "${type}"`);
    checkShape(path, type, value);
  }

  checkTargets(tokens, 'tailwind');
  checkTargets(tokens, 'designMd');

  const intensity = extOf(tree).intensity ?? {};
  for (const [level, set] of Object.entries(intensity)) {
    const where = `intensity.${level}`;
    if (!LEVELS.includes(level)) fail(where, `unknown intensity level (expected ${LEVELS.join(', ')})`);
    for (const [p, v] of Object.entries(set.tokens ?? {})) {
      const t = tokens.get(p);
      if (!t) fail(where, `unknown token ${p}`);
      if (!t.ext.css) fail(where, `${p} has no css, so it cannot be overridden`);
      if (typeof v === 'string') {
        const target = wholeAlias(v);
        if (target && !tokens.get(target)?.ext.css) fail(where, `${p}: alias {${target}} has no css`);
        for (const [, ref] of v.matchAll(ANY_ALIAS)) if (!tokens.has(ref)) fail(where, `${p}: unknown alias {${ref}}`);
      } else {
        const type = r.typeOf(p);
        if (type === 'raw') fail(where, `${p} is raw, so its override must be a string`);
        checkShape(`${where}.${p}`, type, v);
      }
    }
  }
  return tokens;
}

// ---- emitters -----------------------------------------------------------------------------------

export function resolve(tree, path) {
  return makeResolver(index(tree)).literal(path);
}

const hasCss = (group) => Object.entries(group).some(([k, v]) =>
  !k.startsWith('$') && isObject(v) && (isToken(v) ? Boolean(extOf(v).css) : hasCss(v)));

export function emitCss(tree) {
  const tokens = validate(tree);
  const r = makeResolver(tokens);
  const rootExt = extOf(tree);
  const lines = [];
  let lastWasDecl = false;
  const push = (line, isDecl = false) => { lines.push(line); lastWasDecl = isDecl; };

  if (rootExt.cssComment) {
    for (const l of rootExt.cssComment.split('\n')) push(l);
    push('');
  }
  push(':root {');

  const emitGroup = (group, path, align) => {
    for (const key of Object.keys(group)) {
      if (key.startsWith('$')) continue;
      const child = group[key];
      const childPath = [...path, key].join('.');
      if (isToken(child)) {
        const ext = extOf(child);
        if (!ext.css) continue;
        const lhs = `${ext.css}:`;
        const width = ext.cssAlign ?? align;
        push(`  ${lhs}${' '.repeat(Math.max(1, width - lhs.length))}${r.cssValue(childPath)};`, true);
        continue;
      }
      if (!hasCss(child)) continue;
      const gext = extOf(child);
      if (lastWasDecl) push('');
      if (gext.cssComment) for (const l of gext.cssComment.split('\n')) push(l ? `  ${l}` : '');
      emitGroup(child, [...path, key], gext.cssAlign ?? align);
    }
  };
  emitGroup(tree, [], rootExt.cssAlign ?? 0);
  push('}');

  for (const level of LEVELS) {
    const set = rootExt.intensity?.[level];
    if (!set) continue;
    push('');
    if (set.comment) for (const l of set.comment.split('\n')) push(l);
    push(`:root[data-intensity="${level}"] {`);
    if (set.body) for (const l of set.body.split('\n')) push(`  ${l}`);
    for (const [p, v] of Object.entries(set.tokens ?? {})) push(`  ${tokens.get(p).ext.css}: ${r.overrideCss(p, v)};`);
    push('}');
  }
  return lines.join('\n') + '\n';
}

const jsKey = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : jsString(k));
const jsString = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
function jsValue(v, indent) {
  if (Array.isArray(v)) return `[${v.map((x) => jsValue(x, indent)).join(', ')}]`;
  if (isObject(v)) {
    const pad = ' '.repeat(indent);
    const body = Object.entries(v).map(([k, x]) => `${pad}  ${jsKey(k)}: ${jsValue(x, indent + 2)},`).join('\n');
    return `{\n${body}\n${pad}}`;
  }
  return jsString(v);
}

export function emitPreset(tree) {
  const tokens = validate(tree);
  const r = makeResolver(tokens);
  const extend = {};
  for (const t of tokens.values()) {
    for (const p of t.ext.tailwind ?? []) {
      const segs = p.split('.');
      let node = extend;
      for (const s of segs.slice(0, -1)) node = node[s] ??= {};
      node[segs.at(-1)] = r.presetValue(t.path);
    }
  }
  return [
    "/** @type {import('tailwindcss').Config} */",
    'export default {',
    '  theme: {',
    `    extend: ${jsValue(extend, 4)},`,
    '  },',
    '};',
    '',
  ].join('\n');
}

/** Internal helpers shared with designmd.mjs. */
export function tokenIndex(tree) {
  const tokens = validate(tree);
  return { tokens, ...makeResolver(tokens) };
}

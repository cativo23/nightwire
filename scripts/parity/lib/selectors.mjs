// Pure selector analysis for the parity tool. Zero dependencies.
// extractSelectors(css)   → every style-rule selector (nested @media/@supports included,
//                            @keyframes/@font-face/@page skipped, comments ignored)
// analyzeSelectors(sels)  → { classes, attrStates, stateful } used for coverage and for
//                            forcing :hover/:focus/:focus-visible/:active during capture.

const SKIP_BLOCK_AT_RULES = /^@(-[a-z]+-)?(keyframes|font-face|page|counter-style|property)\b/i;
const NESTING_AT_RULES = /^@(media|supports|layer|container|document)\b/i;
const STATE_PSEUDOS = ['hover', 'active', 'focus-visible', 'focus'];

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Index of the brace matching the `{` at `open`, skipping strings. */
function matchBrace(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' || ch === "'") {
      const end = text.indexOf(ch, i + 1);
      i = end === -1 ? text.length : end;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) return i;
  }
  return text.length;
}

/** Split on `sep` characters that are not inside (), [] or quotes. */
function splitTopLevel(text, isSep) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) { if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    else if (depth === 0 && isSep(ch)) { parts.push(text.slice(start, i)); start = i + 1; }
  }
  parts.push(text.slice(start));
  return parts;
}

function walk(text, out) {
  let i = 0;
  while (i < text.length) {
    const brace = text.indexOf('{', i);
    const semi = text.indexOf(';', i);
    if (brace === -1) break;
    if (semi !== -1 && semi < brace) { i = semi + 1; continue; } // @import/@charset statements
    const prelude = text.slice(i, brace).trim();
    const close = matchBrace(text, brace);
    const body = text.slice(brace + 1, close);
    if (SKIP_BLOCK_AT_RULES.test(prelude)) {
      // skip entirely
    } else if (NESTING_AT_RULES.test(prelude)) {
      walk(body, out);
    } else if (prelude && !prelude.startsWith('@')) {
      for (const sel of splitTopLevel(prelude, (c) => c === ',')) {
        const s = sel.replace(/\s+/g, ' ').trim();
        if (s) out.push(s);
      }
    }
    i = close + 1;
  }
}

export function extractSelectors(css) {
  const out = [];
  walk(stripComments(css), out);
  return out;
}

/** Blank out the contents of () and [] so top-level matching ignores them. */
function blankNested(s) {
  let depth = 0;
  let res = '';
  for (const ch of s) {
    if (ch === '(' || ch === '[') { depth++; res += ch; continue; }
    if (ch === ')' || ch === ']') { depth--; res += ch; continue; }
    res += depth > 0 ? ' ' : ch;
  }
  return res;
}

/** Tokenize a selector into [compound, combinator, compound, …] at top level. */
function compounds(selector) {
  const tokens = [];
  let depth = 0;
  let quote = null;
  let cur = '';
  const flush = () => { if (cur.trim()) tokens.push(cur.trim()); cur = ''; };
  for (let i = 0; i < selector.length; i++) {
    const ch = selector[i];
    if (quote) { cur += ch; if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; cur += ch; continue; }
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (depth === 0 && (ch === '>' || ch === '+' || ch === '~' || ch === ' ')) {
      flush();
      if (ch !== ' ') tokens.push(ch);
      else if (tokens.length && !['>', '+', '~', ' '].includes(tokens[tokens.length - 1])) tokens.push(' ');
      continue;
    }
    cur += ch;
  }
  flush();
  // Collapse a descendant ' ' that sits next to an explicit combinator.
  const clean = [];
  for (const t of tokens) {
    const prev = clean[clean.length - 1];
    if (['>', '+', '~'].includes(t) && prev === ' ') clean[clean.length - 1] = t;
    else if (t === ' ' && ['>', '+', '~'].includes(prev)) continue;
    else clean.push(t);
  }
  if (clean[clean.length - 1] === ' ') clean.pop();
  return clean;
}

function stripPseudoElements(compound) {
  return compound
    .replace(/::[\w-]+(\([^)]*\))?/g, '')
    .replace(/:(before|after|first-line|first-letter)(?![\w-])/g, '');
}

function statePseudosIn(compound) {
  const top = blankNested(compound);
  return STATE_PSEUDOS.filter((p) => new RegExp(`:${p}(?![\\w-])`).test(top));
}

function stripStates(compound) {
  let out = compound;
  for (const p of STATE_PSEUDOS) out = out.replace(new RegExp(`:${p}(?![\\w-])`, 'g'), '');
  return out;
}

function joinTokens(tokens) {
  return tokens.map((t) => (['>', '+', '~'].includes(t) ? ` ${t} ` : t)).join('').replace(/\s+/g, ' ').trim();
}

export function analyzeSelectors(selectors) {
  const classes = new Set();
  const attrStates = new Set();
  const statefulMap = new Map();

  for (const sel of selectors) {
    const noStrings = sel.replace(/(["'])(?:\\.|(?!\1).)*\1/g, '""');
    const noAttrs = noStrings.replace(/\[[^\]]*\]/g, '');
    for (const m of noAttrs.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) classes.add(m[1]);

    for (const m of sel.matchAll(/\[\s*([\w-]+)\s*(?:([~|^$*]?=)\s*("[^"]*"|'[^']*'|[^\]\s]+))?\s*\]/g)) {
      const [, name, op, raw] = m;
      if (!op) { attrStates.add(`[${name}]`); continue; }
      const value = raw.replace(/^["']|["']$/g, '');
      attrStates.add(`[${name}${op}"${value}"]`);
    }

    const tokens = compounds(sel);
    tokens.forEach((tok, idx) => {
      if (['>', '+', '~', ' '].includes(tok)) return;
      for (const pseudo of statePseudosIn(tok)) {
        const head = tokens.slice(0, idx + 1).map((t) =>
          ['>', '+', '~', ' '].includes(t) ? t : stripStates(stripPseudoElements(t)));
        const target = joinTokens(head) || '*';
        statefulMap.set(`${target}\u0000${pseudo}`, { target, pseudo });
      }
    });
  }

  return { classes, attrStates, stateful: [...statefulMap.values()] };
}

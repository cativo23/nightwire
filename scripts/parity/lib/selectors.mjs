// Pure selector analysis for the parity tool. Zero dependencies.
// extractSelectors(css)   → every style-rule selector (nested @media/@supports included,
//                            @keyframes/@font-face/@page skipped, comments ignored)
// analyzeSelectors(sels)  → { classes, attrStates, stateful } used for coverage and for
//                            forcing :hover/:focus/:focus-visible/:focus-within/:active.
// Constructs the tool cannot model (native nesting, states on two compounds) throw instead
// of being skipped, so a parity run can never pass by ignoring rules.

const SKIP_BLOCK_AT_RULES = /^@(-[a-z]+-)?(keyframes|font-face|page|counter-style|property)\b/i;
const NESTING_AT_RULES = /^@(media|supports|layer|container|document|scope|starting-style)\b/i;
const STATE_PSEUDOS = ['hover', 'active', 'focus-visible', 'focus-within', 'focus'];

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Index just past the string that opens at `i` (backslash escapes honoured). */
function skipString(text, i) {
  const q = text[i];
  for (let j = i + 1; j < text.length; j++) {
    if (text[j] === '\\') { j++; continue; }
    if (text[j] === q) return j;
  }
  return text.length;
}

/** Index of the brace matching the `{` at `open`, skipping strings. */
function matchBrace(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' || ch === "'") { i = skipString(text, i); continue; }
    if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) return i;
  }
  return text.length;
}

/** First `{` or `;` at or after `i` that is outside strings, () and []. */
function nextBlockOrStatement(text, i) {
  let depth = 0;
  for (let j = i; j < text.length; j++) {
    const ch = text[j];
    if (ch === '"' || ch === "'") { j = skipString(text, j); continue; }
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    else if (depth === 0 && (ch === '{' || ch === ';')) return j;
  }
  return -1;
}

/** True if `body` (a declaration block) contains a nested `{`, i.e. native CSS nesting. */
function hasNestedBlock(body) {
  for (let j = 0; j < body.length; j++) {
    const ch = body[j];
    if (ch === '"' || ch === "'") { j = skipString(body, j); continue; }
    if (ch === '{') return true;
  }
  return false;
}

/** Split on `sep` characters that are not inside (), [] or quotes. */
function splitTopLevel(text, isSep) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) { if (ch === '\\') i++; else if (ch === quote) quote = null; continue; }
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
    const at = nextBlockOrStatement(text, i);
    if (at === -1) break;
    if (text[at] === ';') { i = at + 1; continue; } // @import/@charset statements
    const prelude = text.slice(i, at).trim();
    const close = matchBrace(text, at);
    const body = text.slice(at + 1, close);
    if (SKIP_BLOCK_AT_RULES.test(prelude)) {
      // skip entirely
    } else if (NESTING_AT_RULES.test(prelude)) {
      walk(body, out);
    } else if (prelude && !prelude.startsWith('@')) {
      if (hasNestedBlock(body)) throw new Error(`native CSS nesting inside "${prelude}" is not supported by the parity tool`);
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

/** Tokenize a selector into [compound, combinator, compound, …] at top level. */
function compounds(selector) {
  const tokens = [];
  let depth = 0;
  let quote = null;
  let cur = '';
  const flush = () => { if (cur.trim()) tokens.push(cur.trim()); cur = ''; };
  for (let i = 0; i < selector.length; i++) {
    const ch = selector[i];
    if (quote) {
      cur += ch;
      if (ch === '\\' && i + 1 < selector.length) cur += selector[++i];
      else if (ch === quote) quote = null;
      continue;
    }
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
  const noStrings = compound.replace(/(["'])(?:\\.|(?!\1).)*\1/g, '""');
  return STATE_PSEUDOS.filter((p) => new RegExp(`:${p}(?![\\w-])`).test(noStrings)).sort();
}

function stripStates(compound) {
  let out = compound;
  for (const p of STATE_PSEUDOS) out = out.replace(new RegExp(`:${p}(?![\\w-])`, 'g'), '');
  // :is()/:where()/:not() left with nothing but separators were state-only: drop them.
  return out.replace(/:(is|where|not)\(\s*(,\s*)*\)/g, '');
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
    const withStates = tokens
      .map((tok, idx) => ({ tok, idx }))
      .filter(({ tok }) => !['>', '+', '~', ' '].includes(tok) && statePseudosIn(tok).length);
    if (withStates.length > 1) {
      throw new Error(`"${sel}" has interaction states on more than one compound; the parity tool cannot force that combination`);
    }
    for (const { tok, idx } of withStates) {
      const pseudos = statePseudosIn(tok);
      const head = tokens.slice(0, idx + 1).map((t) =>
        ['>', '+', '~', ' '].includes(t) ? t : stripStates(stripPseudoElements(t)));
      const target = joinTokens(head) || '*';
      statefulMap.set(`${target}\u0000${pseudos.join()}`, { target, pseudos });
    }
  }

  return { classes, attrStates, stateful: [...statefulMap.values()] };
}

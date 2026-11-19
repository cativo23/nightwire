// Pure snapshot diff and change-category matching for the parity tool. Zero dependencies.
// A snapshot is a Map<key, value>; keys are built with snapshotKey().

import { globToRegExp } from './glob.mjs';

const SEP = '\u0000';

export function snapshotKey({ page, state, path, prop }) {
  return [page, state, path, prop].join(SEP);
}

/**
 * Structured differences between two snapshots, sorted like the printed lines.
 * A value absent on one side is '<missing>'.
 * @returns {{page:string,state:string,path:string,prop:string,old:string,new:string}[]}
 */
export function diffRecords(oldSnap, newSnap) {
  const keys = new Set([...oldSnap.keys(), ...newSnap.keys()]);
  const records = [];
  for (const key of keys) {
    const a = oldSnap.has(key) ? oldSnap.get(key) : '<missing>';
    const b = newSnap.has(key) ? newSnap.get(key) : '<missing>';
    if (a === b) continue;
    const [page, state, path, prop] = key.split(SEP);
    records.push({ page, state, path, prop, old: a, new: b });
  }
  // Sort by the rendered line so the order is the one the report always had.
  return records
    .map((record) => [formatDiff(record), record])
    .sort(([x], [y]) => (x < y ? -1 : x > y ? 1 : 0))
    .map(([, record]) => record);
}

export function formatDiff({ page, state, path, prop, old, new: next }) {
  return `DIFF  ${page}  [${state}]  ${path}  ${prop}  ${old} → ${next}`;
}

export function diffSnapshots(oldSnap, newSnap) {
  return diffRecords(oldSnap, newSnap).map(formatDiff);
}

// --- Change categories (docs/design/v3/change-inventory.json) ------------------

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const REGEX_FIELDS = ['prop', 'path', 'state', 'old', 'new'];
const MATCH_KEYS = new Set([...REGEX_FIELDS, 'page']);

// A `kind: "cascade"` category may only explain size and origin properties (FR-038): the ones an
// ancestor's layout moves without any declaration on the element itself.
export const CASCADE_PROPS = Object.freeze(['width', 'height', 'inline-size', 'block-size', 'transform-origin', 'perspective-origin']);
const KINDS = new Set(['cascade']);

/**
 * Validate a parsed change-inventory file and compile it once.
 *
 * Input:  `{ baseline?, categories: [{ id, kind?, description?, match: { prop, path?, page?, state?, old?, new? } }] }`
 * Output: `{ baseline, categories: Compiled[] }`, in file order, where
 *         `Compiled = { id, description, kind?, match: { prop: RegExp, path?: RegExp, state?: RegExp,
 *                     old?: RegExp, new?: RegExp, page?: RegExp } }`.
 *         `match.page` is the glob already translated to an anchored RegExp. This compiled
 *         form is what `matchCategory` and `classify` take.
 *
 * `kind` is optional; the only value is `"cascade"` (FR-038), for geometry that an ancestor's layout
 * moves. Such a category must set `match.path` and `match.page`; its `match.path` may not match
 * `:root` or `@keyframes`; and its `match.prop` must be exactly `^name$`, `^(name|name…)$` or
 * `^(?:name|name…)$` with each name one of `width`, `height`, `inline-size`, `block-size`,
 * `transform-origin`, `perspective-origin`. `old` and `new` are optional for it. `kind` is copied to the compiled form only when it is `"cascade"`.
 *
 * @throws {Error} with a message naming the category (and field) on any invalid input.
 */
export function validateCategories(file) {
  const categories = file == null ? undefined : file.categories;
  if (!Array.isArray(categories)) {
    throw new Error('change categories: "categories" must be an array');
  }
  const seen = new Set();
  const compiled = categories.map((raw, index) => {
    const id = raw == null ? undefined : raw.id;
    if (id === undefined) {
      throw new Error(`change categories: entry #${index} is missing "id"`);
    }
    if (typeof id !== 'string' || !KEBAB.test(id)) {
      throw new Error(`change category ${JSON.stringify(id)} (entry #${index}): id must be a kebab-case string (lowercase letters, digits, single hyphens)`);
    }
    if (seen.has(id)) {
      throw new Error(`change categories: duplicate id "${id}"`);
    }
    seen.add(id);

    const kind = raw.kind;
    if (kind !== undefined && !KINDS.has(kind)) {
      throw new Error(`change category "${id}": unknown kind ${JSON.stringify(kind)} (allowed: ${[...KINDS].map((k) => JSON.stringify(k)).join(', ')}, or none)`);
    }

    const match = raw.match;
    if (match == null || typeof match !== 'object' || match.prop === undefined) {
      throw new Error(`change category "${id}": match.prop is required`);
    }
    for (const key of Object.keys(match)) {
      if (!MATCH_KEYS.has(key)) {
        throw new Error(`change category "${id}": unknown match key "${key}" (allowed: ${[...MATCH_KEYS].join(', ')})`);
      }
    }

    const out = {};
    for (const field of [...REGEX_FIELDS, 'page']) {
      const value = match[field];
      if (value === undefined) continue;
      if (typeof value !== 'string') {
        throw new Error(`change category "${id}": match.${field} must be a string`);
      }
      if (value === '') {
        throw new Error(`change category "${id}": match.${field} must not be empty (an empty pattern matches every difference)`);
      }
      if (field === 'page') {
        out.page = globToRegExp(value);
        continue;
      }
      try {
        out[field] = new RegExp(value);
      } catch (err) {
        throw new Error(`change category "${id}": match.${field} is not a valid regex /${value}/: ${err.message}`);
      }
    }
    const category = { id, description: raw.description, match: out };
    if (kind === 'cascade') {
      assertCascade(id, match.prop, out);
      category.kind = kind;
    }
    return category;
  });
  return { baseline: file.baseline, categories: compiled };
}

// The shape a cascade `match.prop` must have: `^name$`, `^(name|name…)$` or `^(?:name|name…)$`,
// every name one of CASCADE_PROPS. A closed form instead of probing a property list, because the
// snapshot also records custom properties and @keyframes names under their own names, which no
// fixed list can enumerate.
const CASCADE_NAME = CASCADE_PROPS.map((n) => n.replace(/-/g, '\\-')).join('|');
const CASCADE_PROP_FORM = new RegExp(`^\\^(?:(?:${CASCADE_NAME})|\\((?:\\?:)?(?:${CASCADE_NAME})(?:\\|(?:${CASCADE_NAME}))*\\))\\$$`);
// Records that are not element geometry: custom properties on :root and @keyframes rules.
const NON_GEOMETRY_PATHS = [':root', '@keyframes'];

/** The extra rules of `kind: "cascade"`. `rawProp` is the `match.prop` source. Throws naming the category. */
function assertCascade(id, rawProp, match) {
  for (const field of ['path', 'page']) {
    if (match[field] === undefined) {
      throw new Error(`change category "${id}": a cascade category requires match.${field} (it may only explain geometry in a named place)`);
    }
  }
  if (!CASCADE_PROP_FORM.test(rawProp)) {
    throw new Error(`change category "${id}": a cascade category's match.prop must be ^name$ or ^(name|name)$ with each name one of ${CASCADE_PROPS.join(', ')}, got ${JSON.stringify(rawProp)}`);
  }
  const caught = NON_GEOMETRY_PATHS.find((where) => match.path.test(where));
  if (caught !== undefined) {
    throw new Error(`change category "${id}": a cascade category's match.path /${match.path.source}/ also matches "${caught}", which holds custom properties or @keyframes, not geometry; scope it to the opened components`);
  }
}

/**
 * True when every field present in the compiled category's `match` matches the
 * diff record. All fields, including `page` (glob) and `state` (full label such as
 * `operator|rm-off|:hover@<dom path>`), are tested unanchored against the record's
 * field of the same name, except `page` which is anchored by its glob.
 */
export function matchCategory(diff, category) {
  for (const [field, re] of Object.entries(category.match)) {
    if (!re.test(diff[field])) return false;
  }
  return true;
}

/**
 * Split differences into per-category counts and the unexpected rest. A difference
 * counts toward the FIRST matching category only, so the counts plus
 * `unexpected.length` always equal `diffs.length`.
 *
 * With `{ control: true }` (the `--control` run) the `kind: "cascade"` categories are skipped: they
 * match nothing and have no entry in `counts`, so what they explain shows up as unexpected unless
 * the control sheet removed it.
 * @returns {{ counts: Map<string, number>, unexpected: object[] }} counts has every
 *          active category, in order, 0 when unused.
 */
export function classify(diffs, categories, { control = false } = {}) {
  const active = control ? categories.filter((c) => c.kind !== 'cascade') : categories;
  const counts = new Map(active.map((c) => [c.id, 0]));
  const unexpected = [];
  for (const d of diffs) {
    const hit = active.find((c) => matchCategory(d, c));
    if (hit) counts.set(hit.id, counts.get(hit.id) + 1);
    else unexpected.push(d);
  }
  return { counts, unexpected };
}

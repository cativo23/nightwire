// DESIGN.md generated regions. Zero dependencies.
//
// emitRegions(tree)       { <region>: text } built from every token's designMd paths
// rewrite(text, regions)  replaces the lines between `# <generated:NAME>` and
//                         `# </generated:NAME>` and keeps every other byte
//
// Region text: the first path segment opens the region (`colors:`); deeper segments nest with
// two-space indentation. A group's $description becomes a `# comment` before the group's first
// entry, and a blank line separates groups. The trailing note of a leaf is, in order: the
// token's designMdNote (string, or false for none), `CSS: --x` when designMdCssNote is on for
// the token's group, otherwise the token's $description. Numbers are bare; everything else is a
// double-quoted string.

import { tokenIndex } from './tokens.mjs';

const OPEN = /^# <generated:([a-z0-9-]+)>/;
const CLOSE = /^# <\/generated:([a-z0-9-]+)>\s*$/;
const BARE_TYPES = new Set(['number', 'fontWeight']);

const yamlString = (s) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

function commonPrefix(lists) {
  const first = lists[0];
  let n = first.length;
  for (const l of lists) {
    let i = 0;
    while (i < n && i < l.length && l[i] === first[i]) i++;
    n = i;
  }
  return first.slice(0, n);
}

export function emitRegions(tree) {
  const { tokens, typeOf, literal } = tokenIndex(tree);
  const regions = new Map();

  for (const t of tokens.values()) {
    for (const p of t.ext.designMd ?? []) {
      const segs = p.split('.');
      const type = typeOf(t.path);
      const value = literal(t.path);
      let note;
      if (typeof t.ext.designMdNote === 'string') note = t.ext.designMdNote;
      else if (t.ext.designMdNote === false) note = undefined;
      else if ((t.ext.designMdCssNote ?? t.fmt.designMdCssNote) && t.ext.css) note = `CSS: ${t.ext.css}`;
      else note = t.node.$description;
      const entry = { segs, scalar: BARE_TYPES.has(type) ? value : yamlString(value), note,
        group: t.groupPath, groupDescription: t.group.$description };
      if (!regions.has(segs[0])) regions.set(segs[0], []);
      regions.get(segs[0]).push(entry);
    }
  }

  const out = {};
  for (const [name, entries] of regions) out[name] = renderRegion(name, entries);
  return out;
}

function renderRegion(name, entries) {
  // Key width and note column per parent mapping.
  const parentOf = (e) => e.segs.slice(0, -1).join('.');
  const keyWidth = new Map();
  for (const e of entries) {
    const k = parentOf(e);
    keyWidth.set(k, Math.max(keyWidth.get(k) ?? 0, e.segs.at(-1).length + 2));
  }
  const body = (e) => `${'  '.repeat(e.segs.length - 1)}${(e.segs.at(-1) + ':').padEnd(keyWidth.get(parentOf(e)))}${e.scalar}`;
  const noteCol = new Map();
  for (const e of entries) {
    const k = parentOf(e);
    noteCol.set(k, Math.max(noteCol.get(k) ?? 0, body(e).length + 2));
  }

  const groupPrefix = new Map();
  for (const e of entries) {
    if (!groupPrefix.has(e.group)) groupPrefix.set(e.group, commonPrefix(entries.filter((x) => x.group === e.group).map((x) => x.segs.slice(0, -1))));
  }

  const lines = [];
  const closed = new Set();
  let open = [];
  let prevGroup = null;
  for (const e of entries) {
    const parent = e.segs.slice(0, -1);
    let k = 0;
    while (k < open.length && k < parent.length && open[k] === parent[k]) k++;
    for (let d = k; d < open.length; d++) closed.add(open.slice(0, d + 1).join('.'));
    const fresh = [];
    for (let d = k; d < parent.length; d++) {
      const key = parent.slice(0, d + 1).join('.');
      if (closed.has(key)) throw new Error(`DESIGN.md region ${name}: ${key} is split by other entries; keep its tokens together`);
      fresh.push({ depth: d, text: `${'  '.repeat(d)}${parent[d]}:` });
    }
    const leaf = body(e);
    const k2 = parentOf(e);
    fresh.push({ depth: parent.length, text: e.note ? `${leaf.padEnd(noteCol.get(k2))}# ${e.note}` : leaf });

    if (e.group !== prevGroup) {
      const threshold = Math.max(1, groupPrefix.get(e.group).length - 1);
      const at = fresh.findIndex((f) => f.depth >= threshold);
      const extra = [];
      if (prevGroup !== null) extra.push({ depth: 0, text: '' });
      if (e.groupDescription) extra.push({ depth: fresh[at].depth, text: `${'  '.repeat(fresh[at].depth)}# ${e.groupDescription}` });
      fresh.splice(at, 0, ...extra);
      prevGroup = e.group;
    }
    lines.push(...fresh.map((f) => f.text));
    open = parent;
  }
  return lines.join('\n');
}

export function rewrite(text, regions) {
  const lines = text.split('\n');
  const spans = new Map();
  let current = null;
  lines.forEach((line, i) => {
    const o = line.match(OPEN);
    if (o) {
      const name = o[1];
      if (current) throw new Error(`DESIGN.md: marker <generated:${name}> is nested inside <generated:${current.name}>`);
      if (spans.has(name)) throw new Error(`DESIGN.md: duplicate marker <generated:${name}>`);
      current = { name, start: i };
      return;
    }
    const c = line.match(CLOSE);
    if (c) {
      const name = c[1];
      if (!current || current.name !== name) throw new Error(`DESIGN.md: </generated:${name}> has no matching open marker`);
      spans.set(name, { start: current.start, end: i });
      current = null;
    }
  });
  if (current) throw new Error(`DESIGN.md: <generated:${current.name}> is never closed`);

  for (const name of Object.keys(regions)) {
    if (!spans.has(name)) throw new Error(`DESIGN.md: no markers for generated region ${name}`);
  }
  for (const name of spans.keys()) {
    if (!(name in regions)) throw new Error(`DESIGN.md: markers for region ${name} but tokens.json generates no such region`);
  }

  const ordered = [...spans.entries()].sort((a, b) => b[1].start - a[1].start);
  for (const [name, { start, end }] of ordered) {
    lines.splice(start + 1, end - start - 1, ...regions[name].split('\n'));
  }
  return lines.join('\n');
}

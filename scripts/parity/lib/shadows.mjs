// Shadow values of every element in a parity capture, changed or not. Pure, zero dependencies.
//
// The difference list only holds what changed, so it cannot say that an unchanged hard-coded glow
// is still there at archive. This list can: it keeps every element whose box-shadow or text-shadow
// is not `none` on either side. The glow check (glow.mjs) reads it.

export const SHADOW_PROPS = ['box-shadow', 'text-shadow'];

/**
 * @param {string} pageName
 * @param {{state:string, rows:[string,string][]}[]} oldCaps  captures of the old stylesheet
 * @param {{state:string, rows:[string,string][]}[]} newCaps  captures of the new stylesheet
 * @param {string[]} props  the property order of the joined row values
 * @param {string} sep      the separator of the joined row values
 * @returns {{page:string,state:string,path:string,prop:string,old:string,new:string}[]}
 */
export function collectShadows(pageName, oldCaps, newCaps, props, sep) {
  const index = (caps) => new Map(caps.map((c) => [c.state, new Map(c.rows)]));
  const a = index(oldCaps);
  const b = index(newCaps);
  const slots = SHADOW_PROPS.map((prop) => [prop, props.indexOf(prop)]).filter(([, i]) => i >= 0);
  const out = [];
  for (const state of new Set([...a.keys(), ...b.keys()])) {
    const ra = a.get(state) ?? new Map();
    const rb = b.get(state) ?? new Map();
    for (const path of new Set([...ra.keys(), ...rb.keys()])) {
      if (path.includes(sep)) continue; // ':root' custom properties and '@keyframes' rules
      const xa = ra.get(path)?.split(sep);
      const xb = rb.get(path)?.split(sep);
      for (const [prop, i] of slots) {
        const before = xa ? xa[i] : '<missing>';
        const after = xb ? xb[i] : '<missing>';
        if (!isShadow(before) && !isShadow(after)) continue;
        out.push({ page: pageName, state, path, prop, old: before, new: after });
      }
    }
  }
  return out;
}

const isShadow = (value) => value !== 'none' && value !== '<missing>';

// Pure snapshot diff for the parity tool. Zero dependencies.
// A snapshot is a Map<key, value>; keys are built with snapshotKey().

const SEP = '\u0000';

export function snapshotKey({ page, state, path, prop }) {
  return [page, state, path, prop].join(SEP);
}

export function diffSnapshots(oldSnap, newSnap) {
  const keys = new Set([...oldSnap.keys(), ...newSnap.keys()]);
  const lines = [];
  for (const key of keys) {
    const a = oldSnap.has(key) ? oldSnap.get(key) : '<missing>';
    const b = newSnap.has(key) ? newSnap.get(key) : '<missing>';
    if (a === b) continue;
    const [page, state, path, prop] = key.split(SEP);
    lines.push(`DIFF  ${page}  [${state}]  ${path}  ${prop}  ${a} → ${b}`);
  }
  return lines.sort();
}

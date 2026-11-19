// Reads displayed values out of src/tokens/tokens.json (W3C DTCG + `dev.cativo.nightwire`
// extensions), so the docs never copy a duration, curve or intensity knob by hand. The JSON is
// passed in by data/index.ts; this file only knows how to walk and format it.
//
// Plain ESM with a hand-written tokens.d.mts, not TypeScript: tests/docs-site-tokens.test.mjs
// imports it from Node directly (CI runs Node 20, which cannot strip types), and vite.config.ts
// imports it to count tokens. tsc and vite never evaluate this module on their own, so only that
// test notices a renamed knob or a dropped override.

const EXT = 'dev.cativo.nightwire';

const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Knobs listed in each column of the Intensity page. Archive and combat list knobs the level
 *  overrides; operator lists base `:root` values. */
export const KNOB_COLUMNS = {
  archive: ['glow', 'motion-scale', 'pad-scale', 'base-font', 'pulse-state', 'kanji-display', 'panel-radius', 'value-weight', 'grain'],
  operator: ['glow', 'motion-scale', 'pad-scale', 'base-font', 'pulse-state', 'kanji-display', 'panel-radius', 'value-weight', 'grain'],
  combat: ['led-glow', 'control-glow', 'progress-glow', 'motion-scale', 'density', 'pad-scale', 'base-font', 'grain'],
};

/** Number of tokens that publish a CSS custom property (the `css` extension key). */
export function countCssTokens(file) {
  let n = 0;
  const walk = (node) => {
    if (!isObject(node)) return;
    if ('$value' in node) {
      const ext = node.$extensions;
      if (isObject(ext) && isObject(ext[EXT]) && typeof ext[EXT].css === 'string') n += 1;
      return;
    }
    for (const [key, child] of Object.entries(node)) if (key !== '$extensions') walk(child);
  };
  walk(file);
  return n;
}

export class TokenReader {
  #file;

  constructor(file) {
    this.#file = file;
  }

  /** The token or group at a dotted path such as `motion.timing.tick.in.duration`. */
  node(dotted) {
    let cur = this.#file;
    for (const part of dotted.split('.')) {
      if (!isObject(cur) || !(part in cur)) throw new Error(`tokens.json has no "${dotted}"`);
      cur = cur[part];
    }
    if (!isObject(cur)) throw new Error(`tokens.json "${dotted}" is not a token or group`);
    return cur;
  }

  #raw(dotted) {
    const n = this.node(dotted);
    if (!('$value' in n)) throw new Error(`tokens.json "${dotted}" has no $value`);
    return n.$value;
  }

  /** Display text of a token value: `150ms`, `0`, `cubic-bezier(0.3, 0, 0.7, 1)`, or a raw string. */
  format(value) {
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') {
      const alias = /^\{(.+)\}$/.exec(value);
      return alias ? this.format(this.#raw(alias[1])) : value;
    }
    if (Array.isArray(value)) return `cubic-bezier(${value.join(', ')})`;
    if (isObject(value) && typeof value.value === 'number' && typeof value.unit === 'string') {
      return value.value === 0 ? '0' : `${value.value}${value.unit}`;
    }
    throw new Error(`cannot display token value ${JSON.stringify(value)}`);
  }

  /** Display text of the token at a dotted path. */
  display(dotted) {
    return this.format(this.#raw(dotted));
  }

  /** The numeric part of a duration or number token. */
  number(dotted) {
    const v = this.#raw(dotted);
    const n = isObject(v) ? v.value : v;
    if (typeof n !== 'number') throw new Error(`tokens.json "${dotted}" is not numeric`);
    return n;
  }

  // ── Motion ────────────────────────────────────────────────────────────────
  /** `150ms cubic-bezier(0.3, 0, 0.7, 1)`: the duration and curve of one step, enter or exit. */
  motion(step, dir) {
    return `${this.display(`motion.timing.${step}.${dir}.duration`)} ${this.display(`motion.timing.${step}.${dir}.easing`)}`;
  }

  duration(step, dir) {
    return this.display(`motion.timing.${step}.${dir}.duration`);
  }

  /** The value a motion knob takes under `prefers-reduced-motion: reduce`. */
  reducedMotion(knob) {
    const ext = this.node(`knob.${knob}`).$extensions;
    const value = isObject(ext) && isObject(ext[EXT]) ? ext[EXT].reducedMotion : undefined;
    if (value === undefined) throw new Error(`knob.${knob} has no reducedMotion value`);
    return this.format(value);
  }

  // ── Intensity ─────────────────────────────────────────────────────────────
  #override(level, knob) {
    const ext = this.#file.$extensions;
    const intensity = isObject(ext) && isObject(ext[EXT]) ? ext[EXT].intensity : undefined;
    const tokens = isObject(intensity) && isObject(intensity[level]) ? intensity[level].tokens : undefined;
    return isObject(tokens) ? tokens[`knob.${knob}`] : undefined;
  }

  /** The numeric intensity override of a knob at a level (for derived values). */
  overrideNumber(level, knob) {
    const v = this.#override(level, knob);
    if (typeof v !== 'number') throw new Error(`${level} has no numeric override for knob.${knob}`);
    return v;
  }

  /**
   * Knob values for one intensity column, keyed by custom property (`--nw-glow`). Operator is the
   * base `:root` value; archive and combat are their overrides, and a listed knob that a level
   * does not override is an error (the page would show a stale row).
   */
  knobs(level, names) {
    const out = {};
    for (const name of names) {
      const ext = this.node(`knob.${name}`).$extensions;
      const css = isObject(ext) && isObject(ext[EXT]) ? ext[EXT].css : undefined;
      if (typeof css !== 'string') throw new Error(`knob.${name} has no css name`);
      if (level === 'operator') {
        out[css] = this.display(`knob.${name}`);
      } else {
        const v = this.#override(level, name);
        if (v === undefined) throw new Error(`${level} does not override knob.${name}`);
        out[css] = this.format(v);
      }
    }
    return out;
  }
}

/** Rows of the Motion vocabulary table: values from the JSON, human `use` copy written here. */
export function motionVocab(nw) {
  const combatPulse = parseFloat(
    (nw.number('knob.pulse-speed') / nw.overrideNumber('combat', 'motion-scale')).toFixed(3),
  );
  return [
    // Enter composites: fill the `transition` / `animation` shorthand slot.
    { token: '--nw-tick',   value: nw.motion('tick', 'in'),   use: 'Enter: clicks, toggles, micro-feedback' },
    { token: '--nw-sweep',  value: nw.motion('sweep', 'in'),  use: 'Enter: panels, modals, drawers' },
    { token: '--nw-uplink', value: nw.motion('uplink', 'in'), use: 'Enter: data load reveal (staggered)' },
    // Exit composites: shorter and accelerating. Final, approved on the v3 direction board.
    { token: '--nw-tick-out',   value: nw.motion('tick', 'out'),   use: 'Exit: dropdowns, tooltips' },
    { token: '--nw-sweep-out',  value: nw.motion('sweep', 'out'),  use: 'Exit: modals, drawers, command palette, toasts' },
    { token: '--nw-uplink-out', value: nw.motion('uplink', 'out'), use: 'Exit: data load reveal' },
    // Longhands: build a transition piece by piece, e.g. to delay `visibility` until an exit ends.
    { token: '--nw-<step>-duration, --nw-<step>-ease', value: `e.g. --nw-sweep-duration (${nw.duration('sweep', 'in')}), --nw-sweep-ease`, use: 'Enter longhands for tick, sweep and uplink' },
    { token: '--nw-<step>-out-duration, --nw-<step>-out-ease', value: `e.g. --nw-sweep-out-duration (${nw.duration('sweep', 'out')})`, use: 'Exit longhands: delay visibility until the exit ends' },
    // Stagger and loops.
    { token: '--nw-stagger',      value: nw.display('motion.timing.stagger'), use: 'Delay step between items revealed in sequence; multiply by the item index' },
    { token: '--nw-loop-spin',    value: `${nw.display('motion.timing.loop.spin')} (cycle)`, use: 'Spinner cycle; scales inversely with motion scale' },
    { token: '--nw-loop-shimmer', value: `${nw.display('motion.timing.loop.shimmer')} (cycle)`, use: 'Skeleton shimmer cycle; scales inversely with motion scale' },
    { token: '--nw-loop-state',   value: `${nw.display('knob.loop-state')} | ${nw.reducedMotion('loop-state')}`, use: 'Play state of spinner and shimmer; paused by reduced motion' },
    { token: '--nw-pulse-speed',  value: `${nw.display('knob.pulse-speed')} (every level)`, use: `LED heartbeat cycle; scales inversely with motion scale, so combat runs at ${combatPulse}s` },
    { token: '--nw-pulse-state',  value: `${nw.display('knob.pulse-state')} | ${nw.reducedMotion('pulse-state')}`, use: 'LED heartbeat play state; paused in archive and by reduced motion' },
  ];
}

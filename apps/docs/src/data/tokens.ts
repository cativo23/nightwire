// Reads displayed values out of src/tokens/tokens.json (W3C DTCG + `dev.cativo.nightwire`
// extensions), so the docs never copy a duration, curve or intensity knob by hand. The JSON is
// passed in by data/index.ts; this file only knows how to walk and format it.

type Json = { [key: string]: unknown };

const EXT = 'dev.cativo.nightwire';

const isObject = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);

export type IntensityLevel = 'archive' | 'operator' | 'combat';

export class TokenReader {
  private readonly file: Json;

  constructor(file: object) {
    this.file = file as Json;
  }

  /** The token or group at a dotted path such as `motion.timing.tick.in.duration`. */
  node(dotted: string): Json {
    let cur: unknown = this.file;
    for (const part of dotted.split('.')) {
      if (!isObject(cur) || !(part in cur)) throw new Error(`tokens.json has no "${dotted}"`);
      cur = cur[part];
    }
    if (!isObject(cur)) throw new Error(`tokens.json "${dotted}" is not a token or group`);
    return cur;
  }

  private raw(dotted: string): unknown {
    const n = this.node(dotted);
    if (!('$value' in n)) throw new Error(`tokens.json "${dotted}" has no $value`);
    return n.$value;
  }

  /** Display text of a token value: `150ms`, `0`, `cubic-bezier(0.3, 0, 0.7, 1)`, or a raw string. */
  format(value: unknown): string {
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') {
      const alias = /^\{(.+)\}$/.exec(value);
      return alias ? this.format(this.raw(alias[1])) : value;
    }
    if (Array.isArray(value)) return `cubic-bezier(${value.join(', ')})`;
    if (isObject(value) && typeof value.value === 'number' && typeof value.unit === 'string') {
      return value.value === 0 ? '0' : `${value.value}${value.unit}`;
    }
    throw new Error(`cannot display token value ${JSON.stringify(value)}`);
  }

  /** Display text of the token at a dotted path. */
  display(dotted: string): string {
    return this.format(this.raw(dotted));
  }

  /** The numeric part of a duration or number token. */
  number(dotted: string): number {
    const v = this.raw(dotted);
    const n = isObject(v) ? v.value : v;
    if (typeof n !== 'number') throw new Error(`tokens.json "${dotted}" is not numeric`);
    return n;
  }

  // ── Motion ────────────────────────────────────────────────────────────────
  /** `150ms cubic-bezier(0.3, 0, 0.7, 1)`: the duration and curve of one step, enter or exit. */
  motion(step: 'tick' | 'sweep' | 'uplink', dir: 'in' | 'out'): string {
    return `${this.display(`motion.timing.${step}.${dir}.duration`)} ${this.display(`motion.timing.${step}.${dir}.easing`)}`;
  }

  duration(step: 'tick' | 'sweep' | 'uplink', dir: 'in' | 'out'): string {
    return this.display(`motion.timing.${step}.${dir}.duration`);
  }

  /** The value a motion knob takes under `prefers-reduced-motion: reduce`. */
  reducedMotion(knob: string): string {
    const ext = this.node(`knob.${knob}`).$extensions;
    const value = isObject(ext) && isObject(ext[EXT]) ? ext[EXT].reducedMotion : undefined;
    if (value === undefined) throw new Error(`knob.${knob} has no reducedMotion value`);
    return this.format(value);
  }

  // ── Intensity ─────────────────────────────────────────────────────────────
  private override(level: 'archive' | 'combat', knob: string): unknown {
    const ext = this.file.$extensions;
    const intensity = isObject(ext) && isObject(ext[EXT]) ? ext[EXT].intensity : undefined;
    const tokens = isObject(intensity) && isObject(intensity[level]) ? intensity[level].tokens : undefined;
    return isObject(tokens) ? tokens[`knob.${knob}`] : undefined;
  }

  /** The numeric intensity override of a knob at a level (for derived values). */
  overrideNumber(level: 'archive' | 'combat', knob: string): number {
    const v = this.override(level, knob);
    if (typeof v !== 'number') throw new Error(`${level} has no numeric override for knob.${knob}`);
    return v;
  }

  /**
   * Knob values for one intensity column, keyed by custom property (`--nw-glow`). Operator is the
   * base `:root` value; archive and combat are their overrides, and a listed knob that a level
   * does not override is an error (the page would show a stale row).
   */
  knobs(level: IntensityLevel, names: readonly string[]): Record<string, string> {
    const out: Record<string, string> = {};
    for (const name of names) {
      const ext = this.node(`knob.${name}`).$extensions;
      const css = isObject(ext) && isObject(ext[EXT]) ? ext[EXT].css : undefined;
      if (typeof css !== 'string') throw new Error(`knob.${name} has no css name`);
      if (level === 'operator') {
        out[css] = this.display(`knob.${name}`);
      } else {
        const v = this.override(level, name);
        if (v === undefined) throw new Error(`${level} does not override knob.${name}`);
        out[css] = this.format(v);
      }
    }
    return out;
  }
}

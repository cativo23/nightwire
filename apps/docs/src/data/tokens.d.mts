export type IntensityLevel = 'archive' | 'operator' | 'combat';

export const KNOB_COLUMNS: Record<IntensityLevel, readonly string[]>;

export function countCssTokens(file: object): number;

export class TokenReader {
  constructor(file: object);
  node(dotted: string): Record<string, unknown>;
  format(value: unknown): string;
  display(dotted: string): string;
  number(dotted: string): number;
  motion(step: 'tick' | 'sweep' | 'uplink', dir: 'in' | 'out'): string;
  duration(step: 'tick' | 'sweep' | 'uplink', dir: 'in' | 'out'): string;
  reducedMotion(knob: string): string;
  overrideNumber(level: 'archive' | 'combat', knob: string): number;
  knobs(level: IntensityLevel, names: readonly string[]): Record<string, string>;
}

export function motionVocab(nw: TokenReader): { token: string; value: string; use: string }[];

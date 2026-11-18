# Tokens

`src/tokens/tokens.json` is the only hand-edited home for design tokens. `npm run build:tokens`
generates three things from it:

| Output | What it gets |
|--------|--------------|
| `src/tokens/tokens.css` (gitignored, inlined into `nightwire.css`) | The `:root` custom properties and the three intensity blocks |
| `tailwind.preset.js` | `theme.extend`, with every value resolved to a literal |
| `DESIGN.md` | The `colors`, `typography`, `spacing`, `rounded` and `motion` regions between `# <generated:NAME>` markers |

Edit `tokens.json`, run `npm run build`, commit the source and the regenerated files together.
CI fails if they disagree (see [build.md](build.md)).

## Format: W3C DTCG 2025.10

The file follows the [Design Tokens Community Group format, 2025.10](https://www.designtokens.org/TR/2025.10/format/).

- **Tokens and groups.** An object with `$value` is a token, and any other object is a group. A
  group's `$type` applies to every token below it that does not set its own.
- **Names.** A name cannot start with `$` and cannot contain `{`, `}` or `.`.
- **Typed values.**
  - `color`: `{ "colorSpace": "srgb", "components": [r, g, b], "alpha"?: a, "hex": "#rrggbb" }`.
    Components are 0–1. `hex` must match the components, and the build checks that.
  - `dimension`: `{ "value": n, "unit": "px" | "rem" }`.
  - `duration`: `{ "value": n, "unit": "ms" | "s" }`.
  - `cubicBezier`: `[x1, y1, x2, y2]`, with x1 and x2 in [0, 1].
  - `fontFamily`: a string or an array of family names.
  - `fontWeight` and `number`: a number.
- **Aliases.** `"$value": "{group.token}"` references another token. Cycles and unknown targets are
  build errors.

## The `dev.cativo.nightwire` extension

Nightwire's metadata lives under `$extensions["dev.cativo.nightwire"]`.

On a token:

| Key | Meaning |
|-----|---------|
| `css` | Custom property to emit, e.g. `--nw-primary`. Unique, `^--[a-z][a-z0-9-]*$` |
| `tailwind` | Array of dot paths under the preset's `theme.extend`, e.g. `["colors.nw.primary.DEFAULT"]` |
| `designMd` | Array of dot paths in the `DESIGN.md` frontmatter, e.g. `["colors.primary"]` |
| `raw` | `true` emits `$value` verbatim (see below) |
| `cssAlign` | Column the CSS value starts at (formatting only) |
| `motion` | `true` marks a motion knob. A boolean; a motion knob must also have `reducedMotion` (see below) |
| `reducedMotion` | Value the token takes under `prefers-reduced-motion: reduce`. Only on tokens with `css`. Shaped like an intensity override: a string is raw text or an alias, anything else is typed by the token's type |
| `designMdNote` | Trailing `# note` in `DESIGN.md`; `false` for none |

On a group: `cssComment` (comment printed before the group's declarations), `cssAlign`
(inherited), `designMdCssNote` (inherited: annotate `DESIGN.md` entries with `# CSS: --x`).

At the root, `cssComment` (printed above `:root`), `cssAlign`, and `intensity`:

```json
"intensity": {
  "archive":  { "comment": "/* … */", "tokens": { "knob.glow": 0, "knob.panel-radius": "{radius.sm}" } },
  "operator": { "comment": "/* … */", "body": "/* base :root values apply */", "tokens": {} },
  "combat":   { "comment": "/* … */", "tokens": { "knob.glow": 2.2 } }
}
```

Override keys are token paths and must point at tokens with `css`. A string override is raw (or
an alias); any other value is typed by the overridden token's type. See [intensity.md](intensity.md).

Every token needs at least one of `css`, `tailwind` or `designMd`, so the file holds no dead
data. A token with none of them is still valid when another token's `$value` references it, by
alias or by `{...}` interpolation in a raw value; that is how values that only feed other tokens
(the exit durations, the loop base durations) stay typed. Two tokens cannot write the same preset
or `DESIGN.md` path.

### Reduced motion

A token with `reducedMotion` gets a declaration in a generated block at the very end of
`src/tokens/tokens.css`, after the intensity blocks, in token key order. No token carries
`reducedMotion` yet, so the build emits no such block today. Once the motion knobs do (v3 motion
phase), it looks like this:

```css
@media (prefers-reduced-motion: reduce) {
  :root,
  :root[data-intensity] {
    --nw-motion-scale: 0;
    --nw-pulse-state: paused;
  }
}
```

The selector list is deliberate. `:root[data-intensity]` has the same specificity as
`:root[data-intensity="combat"]`, and the block comes later in source order, so the reduced value
beats every intensity level (known issue K1; verified in Chrome, research R1). `:root` covers a page
with no `data-intensity` attribute at all. If no token has `reducedMotion`, nothing is emitted,
not even a blank line.

`motion: true` is the guard against forgetting. A token marked `motion: true` without a
`reducedMotion` value fails the build with `motion token <path> has no reducedMotion value`.
`reducedMotion` without `motion: true` is allowed; only the reverse is an error.

## How values are emitted

| Target | Alias | Typed value | Raw value |
|--------|-------|-------------|-----------|
| CSS | `var(--target)` | `#rrggbb`, or `rgba(R, G, B, A)` when alpha < 1; `N<unit>` (`4px`, `1.5rem`); zero dimensions as `0` | verbatim, `{x}` replaced by x's literal |
| Preset | the final literal | same as CSS (font families stay arrays) | verbatim with literals |
| `DESIGN.md` | the final literal | same as CSS; numbers unquoted | verbatim |

Aliases stay `var()` in CSS on purpose. `--nw-surface-0: var(--void)` means overriding `--void`
at runtime still reaches every v2 consumer. The preset and `DESIGN.md` need concrete values, so
they get the resolved literal.

Emission follows key order, which mirrors the original `:root` order, so the generated block reads
like the hand-written one did.

## The raw-value deviation

DTCG has no type for `calc()` compositions, gradients, CSS keywords (`running`, `inline`, `none`),
letter spacing in `em`, or multi-layer shadows. Those tokens omit `$type` and set `raw: true`, and
their `$value` is a CSS string. A strict DTCG tool will reject them. We accept that because the
alternative was a second hand-edited token file, and the point of this file is to be the only one.

Raw values can interpolate aliases: `"calc({motion.timing.tick.in.duration} * var(--nw-motion-scale)) {motion.timing.tick.in.easing}"`
emits `calc(150ms * var(--nw-motion-scale)) cubic-bezier(0.3, 0, 0.7, 1)`. The 150 ms and the curve
live once, in `motion.timing.tick.in`, and feed both `--nw-tick` and the preset's
`transitionDuration`/`transitionTimingFunction`.

Every raw token today, and why it cannot be typed:

| Token | Value | Emitted as | Why raw |
|-------|-------|------------|---------|
| `font.tracking.tight` / `normal` / `wide` / `ultra` | `-0.01em`, `0`, `0.06em`, `0.2em` | `--ls-*`, preset `letterSpacing.nw-*` (not `normal`) | `em` is not a DTCG dimension unit |
| `knob.pulse-state` | `running` | `--nw-pulse-state` | CSS keyword |
| `knob.kanji-display` | `inline` | `--nw-kanji-display` | CSS keyword |
| `knob.header-gradient` | `linear-gradient(180deg, rgba(102, 153, 255, 0.06), transparent 80%)` | `--nw-header-gradient` | CSS gradient |
| `knob.header-pattern` | `none` | `--nw-header-pattern` | CSS keyword (combat sets a gradient) |
| `motion.tick` / `sweep` / `uplink` | `calc({motion.timing.<name>.in.duration} * var(--nw-motion-scale)) {motion.timing.<name>.in.easing}` | `--nw-tick`, `--nw-sweep`, `--nw-uplink` | `calc()` with a runtime `var()` |
| `motion.exit.*`, `motion.longhand.*`, `motion.longhand-out.*` | the same shape over `out.*`, and the bare `calc()` duration or curve | `--nw-<step>-out`, `--nw-<step>-duration`, `--nw-<step>-ease`, `--nw-<step>-out-duration`, `--nw-<step>-out-ease` | `calc()` with a runtime `var()`; a bare curve interpolated from a typed token |
| `motion.cycle.*` | `calc({motion.timing.stagger} * var(--nw-motion-scale))`; loops divide by `var(--nw-motion-scale)` | `--nw-stagger`, `--nw-loop-spin`, `--nw-loop-shimmer` | `calc()` with a runtime `var()` |
| `shadow.glow-green` / `blue` / `cyan` / `red` | `0 0 8px rgba(…,0.5), 0 0 16px rgba(…,0.2)` (red: `0.3`) | preset `boxShadow.glow-*` | Kept byte-for-byte as the preset had it |
| `doc.typography.title.transform` | `scaleX(0.82)` | `DESIGN.md` only | CSS transform |
| `doc.typography.title.textTransform`, `doc.typography.stamp.textTransform` | `uppercase` | `DESIGN.md` only | CSS keyword |

Intensity overrides that are strings (`paused`, `none`, the combat gradients, `0.14em`) are raw in
the same way.

## Preset-only and doc-only tokens

Some values exist only in one output, and they stay that way so this refactor changes no public
surface:

- **Preset-only:** `shadow.glow-*` (the `boxShadow.glow-*` utilities have no custom property).
- **Doc-only:** `doc.*` holds the `DESIGN.md` views. `doc.typography.*` mostly aliases the font and
  size tokens and adds weights and line heights. The `motion` region of `DESIGN.md` has no doc-only
  tokens: it lists the real `motion.*` tokens through their `designMd` targets.

## Adding or changing a token

1. Edit `src/tokens/tokens.json`. For a new token, place it where it should appear in `:root` and
   give it at least one target.
2. Run `npm run build` and `npm test`.
3. Check the diff: `nightwire.css`, `tailwind.preset.js` and `DESIGN.md` should change only where
   you meant them to.
4. A value change is a visual change. Run `npm run parity` and expect differences only for that
   token (see [CONTRIBUTING.md](../../CONTRIBUTING.md)).

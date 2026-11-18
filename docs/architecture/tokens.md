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

Every token needs at least one of `css`, `tailwind` or `designMd`, so the file holds no dead data.
Two tokens cannot write the same preset or `DESIGN.md` path.

## How values are emitted

| Target | Alias | Typed value | Raw value |
|--------|-------|-------------|-----------|
| CSS | `var(--target)` | `#rrggbb`, or `rgba(R, G, B, A)` when alpha < 1; `Npx`; zero dimensions as `0` | verbatim, `{x}` replaced by x's literal |
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

Raw values can interpolate aliases: `"calc({motion.timing.tick.duration} * var(--nw-motion-scale)) {motion.timing.tick.easing}"`
emits `calc(150ms * var(--nw-motion-scale)) cubic-bezier(0.3, 0, 0.7, 1)`. The 150 ms and the curve
live once, in `motion.timing.tick`, and feed both `--nw-tick` and the preset's
`transitionDuration`/`transitionTimingFunction`.

## Preset-only and doc-only tokens

Some values exist only in one output, and they stay that way so this refactor changes no public
surface:

- **Preset-only:** `shadow.glow-*` (the `boxShadow.glow-*` utilities have no custom property).
- **Doc-only:** `doc.*` holds the `DESIGN.md` views. `doc.typography.*` mostly aliases the font and
  size tokens and adds weights and line heights; `doc.motion.*` keeps the `DESIGN.md` motion
  vocabulary, which does not match the CSS yet (known issue K2 in [intensity.md](intensity.md)).

## Adding or changing a token

1. Edit `src/tokens/tokens.json`. For a new token, place it where it should appear in `:root` and
   give it at least one target.
2. Run `npm run build` and `npm test`.
3. Check the diff: `nightwire.css`, `tailwind.preset.js` and `DESIGN.md` should change only where
   you meant them to.
4. A value change is a visual change. Run `npm run parity` and expect differences only for that
   token (see [CONTRIBUTING.md](../../CONTRIBUTING.md)).

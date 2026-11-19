# Intensity

One attribute on `<html>` retunes the whole system:

```html
<html data-intensity="archive">   <!-- docs, blogs: no glow, calmer, roomier -->
<html data-intensity="operator">  <!-- the default; same as no attribute -->
<html data-intensity="combat">    <!-- ops consoles: state glow doubles, denser, faster pulse -->
```

The levels are blocks of custom-property overrides, generated from the `intensity` key in
`src/tokens/tokens.json` (see [tokens.md](tokens.md)). Components never test the attribute
themselves; they read the knobs.

## Knobs

| Knob | Operator (base) | Archive | Combat | Read by |
|------|-----------------|---------|--------|---------|
| `--nw-glow` | `0.5` | `0` | — (no combat override; see [direction.md](../design/v3/direction.md)) | the `.glow-*` utilities, which read it wherever it is set; the three state-glow knobs below take its value from `:root` (see the note under this table) |
| `--nw-density` | `1` | — | `0.85` | layout primitives |
| `--nw-motion-scale` | `1` | `0.6` | `1.2` | every motion token (`--nw-tick`, `--nw-sweep`, `--nw-uplink`, `-out`, longhands, `--nw-stagger`; the loop cycles inversely) |
| `--nw-pad-scale` | `1` | `1.35` | `0.7` | stat |
| `--nw-base-font` | `var(--text-base)` | `15px` | `13px` | reset (`body`) |
| `--nw-pulse-state` | `running` | `paused` | `running` | led |
| `--nw-led-glow`, `--nw-control-glow`, `--nw-progress-glow` | `var(--nw-glow)` | — (follows `--nw-glow`, so 0) | `calc(var(--nw-glow) * 2)`, effective 1 | state glow only, never decoration: led reads the first, check, radio, switch, segmented and steps the second, progress the third |
| `--nw-pulse-speed` | `1.6s` | — | — (no combat override; the motion scale divides it, so combat pulses in 1.333s) | led |
| `--nw-loop-state` | `running` | — | — | button spinner, skeleton shimmer |
| `--nw-panel-radius` | `var(--radius-none)` | `var(--radius-sm)` | — | panel |
| `--nw-value-color` | `var(--nw-data)` | `var(--nw-green-dim)` | `var(--nw-green-dim)` | stat |
| `--nw-value-weight` | `500` | `400` | — | stat |
| `--nw-kanji-display` | `inline` | `none` | — | `.kanji` |
| `--nw-hairline`, `--nw-rule`, `--nw-accent-width` | `1px`, `1.5px`, `2px` | — | — | structural borders (hairline), marks drawn inside controls (rule: check strokes, spinner ring), accent bars (tabs, sidebar, diff, toast). No per-level overrides in v3: combat energy comes from state glow, pulse and density, not heavier lines. The knobs exist so a level can set one later |
| `--nw-label-spacing` | `var(--ls-ultra)` | `0.14em` | — | stat |

"—" means the level keeps the base value. The operator block is intentionally empty.

The state-glow knobs are declared as `var(--nw-glow)` on `:root`, so they follow `--nw-glow` when it
is set on `:root` or on the element that carries `data-intensity`. A `--nw-glow` set on a single
element does not reach the LED, check, switch or progress inside it (v2.1.0's `.led` read
`--nw-glow` directly, so it did); to tune one element, set `--nw-led-glow`, `--nw-control-glow` or
`--nw-progress-glow` on it. The `.glow-*` utilities still read `--nw-glow` where they are used.

Combat is still different from operator without decoration. Only state signals glow brighter (1
against 0.5, and below v2.1.0's combat 2.2), the pulse runs faster through the motion scale, and
spacing is denser. The v2 combat header gradient and scanlines (`--nw-header-gradient`,
`--nw-header-pattern`) are removed. The glow rules are checked by
`scripts/parity/glow-check.mjs` (see [CONTRIBUTING.md](../../CONTRIBUTING.md)).

## Known issues

These exist in 2.0.1 and were preserved exactly by the restructure, because fixing any of them
changes rendering or the published surface. Each has an owner. Resolved entries say so and stay
here for the record. "Sub-project 2" is the visual direction work reserved in
[docs/design/](../design/README.md), which follows this restructure.

### K1. Reduced motion loses to an explicit intensity (resolved in v3)

**Resolved.** Reduced motion now wins at every intensity level. The build generates
`@media (prefers-reduced-motion: reduce) { :root, :root[data-intensity] { … } }` from token data
(every token with a `reducedMotion` value: `--nw-motion-scale: 0`, `--nw-pulse-state: paused`,
`--nw-loop-state: paused`) and emits it after the intensity blocks. `:root[data-intensity]` has the
same specificity as `:root[data-intensity="combat"]` and comes later, so it beats every level. The
hand-written `src/base/reduced-motion.css` is deleted. See
[cascade.md](cascade.md#the-reduced-motion-block) and [tokens.md](tokens.md#reduced-motion).

The 2.x problem, kept for the record: `base/reduced-motion.css` set the two knobs on `:root`
(specificity 0,1,0), the intensity blocks used `:root[data-intensity="…"]` (0,2,0), and with
`data-intensity="archive"` or `"combat"` they won. The blanket
`* { animation: none !important; transition: none !important; }` in `base/accessibility.css` still
stopped everything, but any component that read a knob saw the wrong value.

### K2. Components hardcode motion durations instead of reading the tokens (resolved in v3)

**Resolved.** Components read the motion tokens. Every transition and animation in
`src/components/` uses `--nw-tick`, `--nw-sweep`, `--nw-uplink`, their `-out` and longhand forms,
`--nw-stagger`, or the loop tokens; the only literal time left is the `0s` of a `visibility` flip. A
test in `npm test` fails if a component hardcodes a duration. The loops scale inversely with
`--nw-motion-scale` (`--nw-loop-spin`, `--nw-loop-shimmer`, and the LED pulse), and pause through
`--nw-loop-state` and `--nw-pulse-state`. `DESIGN.md` lists the real tokens in its generated
`motion` region instead of the doc-only `duration-*` and `easing-*` names.

### K3. The Tailwind preset has no `var()` (resolved in v3)

**Resolved.** Colour, glow shadow and motion values in the preset reference the custom properties,
so `bg-nw-chrome`, `shadow-glow-cyan` and `duration-nw-tick` follow `data-intensity` and runtime
overrides. Colours are `color-mix(in srgb, var(--nw-x) calc(<alpha-value> * 100%), transparent)`,
which keeps opacity modifiers such as `bg-nw-cyan/40` generating; a plain `var()` would drop them.
Font families, sizes, letter spacing, spacing and radii stay literal, since no intensity changes
them. See [tokens.md](tokens.md#how-values-are-emitted).

The 2.x problem, kept for the record: every preset value was a literal, so the utilities ignored
the intensity level while the CSS classes followed it.

### K4. Example pages redeclare tokens inline (resolved in v3)

**Resolved.** The seven pages that carried their own token values (`dashboard.html`,
`neural-ops.html` and the five under `components/`) now load `nightwire.css`, and the legacy
`--nerv-*` names are gone. Every page under `examples/html/` is a parity page, so a stylesheet change
that alters an example shows up in `npm run parity`. Page-local classes (the ops-console layout, the
ticker, the event log) stay in each page's own `<style>`, and where they glow they read the state
knobs, not a literal blur.

The 2.x problem, kept for the record: these pages declared token values inline and did not load the
stylesheet, so the restructure could not change them and parity did not cover them.

### K5. The preset is ESM in a package without `"type": "module"`

`tailwind.preset.js` uses `export default`, but `package.json` declares no module type. Tailwind's
config loader handles it; plain Node prints `MODULE_TYPELESS_PACKAGE_JSON` and reparses the file as
ESM. Adding `"type": "module"` or `exports` changes how every consumer resolves the package, so it
waits for a major release. Owner: a future major.

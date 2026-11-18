# Intensity

One attribute on `<html>` retunes the whole system:

```html
<html data-intensity="archive">   <!-- docs, blogs: no glow, calmer, roomier -->
<html data-intensity="operator">  <!-- the default; same as no attribute -->
<html data-intensity="combat">    <!-- ops consoles: more glow, denser, faster pulse -->
```

The levels are blocks of custom-property overrides, generated from the `intensity` key in
`src/tokens/tokens.json` (see [tokens.md](tokens.md)). Components never test the attribute
themselves; they read the knobs.

## Knobs

| Knob | Operator (base) | Archive | Combat | Read by |
|------|-----------------|---------|--------|---------|
| `--nw-glow` | `0.5` | `0` | `0.5` (proposed, pending the v3 direction gate; see [direction.md](../design/v3/direction.md)) | led, button, switch, check, segmented, progress, steps, drawer, cmdk, ai-block, stat |
| `--nw-density` | `1` | — | `0.85` | layout primitives |
| `--nw-motion-scale` | `1` | `0.6` | `1.2` | every motion token (`--nw-tick`, `--nw-sweep`, `--nw-uplink`, `-out`, longhands, `--nw-stagger`; the loop cycles inversely) |
| `--nw-pad-scale` | `1` | `1.35` | `0.7` | stat |
| `--nw-base-font` | `var(--text-base)` | `15px` | `13px` | reset (`body`) |
| `--nw-pulse-state` | `running` | `paused` | `running` | led |
| `--nw-led-glow`, `--nw-control-glow`, `--nw-progress-glow` | `var(--nw-glow)` | — | `calc(var(--nw-glow) * 2)` | led now; the control and progress knobs are read by check, switch, segmented, steps and progress in T038 |
| `--nw-pulse-speed` | `1.6s` | — | — (scaled by `--nw-motion-scale`, so combat runs faster) | led |
| `--nw-loop-state` | `running` | — | — | button spinner, skeleton shimmer |
| `--nw-panel-radius` | `var(--radius-none)` | `var(--radius-sm)` | — | panel |
| `--nw-value-color` | `var(--nw-data)` | `var(--nw-green-dim)` | `var(--nw-green-dim)` | stat |
| `--nw-value-weight` | `500` | `400` | — | stat |
| `--nw-kanji-display` | `inline` | `none` | — | `.kanji` |
| `--nw-header-gradient` | blue 6% → transparent 80% | `none` | blue 18% → transparent 70% | panel header |
| `--nw-header-pattern` | `none` | — | 1px scanlines | panel header |
| `--nw-hairline`, `--nw-rule`, `--nw-accent-width` | `1px`, `1.5px`, `2px` | — | — | structural borders, drawn marks, accent bars (no per-level overrides) |
| `--nw-label-spacing` | `var(--ls-ultra)` | `0.14em` | — | stat |

"—" means the level keeps the base value. The operator block is intentionally empty.

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

### K3. The Tailwind preset has no `var()`

Every preset value is a literal, so Tailwind utilities (`bg-nw-chrome`, `duration-nw-tick`) do not
follow runtime overrides or intensity levels. Switching to `var()` would change what those
utilities render. Owner: sub-project 2.

### K4. Example pages redeclare tokens inline

Seven example pages (`dashboard.html`, `neural-ops.html` and the five under `components/`) carry
their own `<style>` blocks with token values instead of loading `nightwire.css`, and
`dashboard.html` declares legacy `--nerv-*` names. These pages do not load the stylesheet, so the
restructure cannot change them and parity does not cover them. Owner: sub-project 2 (examples
cleanup).

### K5. The preset is ESM in a package without `"type": "module"`

`tailwind.preset.js` uses `export default`, but `package.json` declares no module type. Tailwind's
config loader handles it; plain Node prints `MODULE_TYPELESS_PACKAGE_JSON` and reparses the file as
ESM. Adding `"type": "module"` or `exports` changes how every consumer resolves the package, so it
waits for a major release. Owner: a future major.

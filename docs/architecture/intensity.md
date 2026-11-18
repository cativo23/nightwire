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
| `--nw-glow` | `1` | `0` | `2.2` | led, button, switch, check, segmented, progress, steps, drawer, cmdk, ai-block, stat |
| `--nw-density` | `1` | — | `0.85` | layout primitives |
| `--nw-motion-scale` | `1` | `0.6` | `1.2` | `--nw-tick`, `--nw-sweep`, `--nw-uplink` |
| `--nw-pad-scale` | `1` | `1.35` | `0.7` | stat |
| `--nw-base-font` | `var(--text-base)` | `15px` | `13px` | reset (`body`) |
| `--nw-pulse-state` | `running` | `paused` | `running` | led |
| `--nw-pulse-speed` | `1.4s` | — | `0.7s` | led |
| `--nw-panel-radius` | `var(--radius-none)` | `var(--radius-sm)` | — | panel |
| `--nw-value-color` | `var(--nw-data)` | `var(--nw-green-dim)` | `var(--nw-green-dim)` | stat |
| `--nw-value-weight` | `500` | `400` | — | stat |
| `--nw-kanji-display` | `inline` | `none` | — | `.kanji` |
| `--nw-header-gradient` | blue 6% → transparent 80% | `none` | blue 18% → transparent 70% | panel header |
| `--nw-header-pattern` | `none` | — | 1px scanlines | panel header |
| `--nw-label-spacing` | `var(--ls-ultra)` | `0.14em` | — | stat |

"—" means the level keeps the base value. The operator block is intentionally empty.

## Known issues

These exist in 2.0.1 and are preserved exactly by the restructure, because fixing any of them
changes rendering or the published surface. Each has an owner.

### K1. Reduced motion loses to an explicit intensity

`base/reduced-motion.css` sets `--nw-motion-scale: 0` and `--nw-pulse-state: paused` on `:root`
(specificity 0,1,0). The intensity blocks use `:root[data-intensity="…"]` (0,2,0), so with
`data-intensity="archive"` or `"combat"` they win: motion scale stays 0.6 or 1.2, and combat keeps
the pulse `running`. Only pages without the attribute, or with `operator`, get the reduced values
through the knobs.

Effect: users who ask for reduced motion are still protected by the blanket
`* { animation: none !important; transition: none !important; }` in `base/accessibility.css`, so
nothing animates. But any component that reads the knobs directly sees the wrong values.
Owner: sub-project 2 (motion system).

### K2. `DESIGN.md` motion vocabulary does not match the CSS

`DESIGN.md` describes `duration-fast/base/slow` and `easing-standard/decelerate`. The CSS uses
`--nw-tick`, `--nw-sweep` and `--nw-uplink`. `duration-fast` and `duration-slow` are aliased to the
tick and uplink durations; `duration-base` (250 ms) and both easings exist only in the doc, as
doc-only tokens. Owner: sub-project 2 (motion system).

### K3. The Tailwind preset has no `var()`

Every preset value is a literal, so Tailwind utilities (`bg-nw-chrome`, `duration-nw-tick`) do not
follow runtime overrides or intensity levels. Switching to `var()` would change what those
utilities render. Owner: sub-project 2.

### K4. Example pages redeclare tokens inline

Seven example pages carry their own `<style>` blocks with token values, and `dashboard.html`
declares legacy `--nerv-*` names. Inline declarations win the same way before and after the
restructure, so parity is unaffected. Owner: sub-project 2 (examples cleanup).

### K5. The preset is ESM in a package without `"type": "module"`

`tailwind.preset.js` uses `export default`, but `package.json` declares no module type. Tailwind's
config loader handles it; plain Node prints `MODULE_TYPELESS_PACKAGE_JSON` and reparses the file as
ESM. Adding `"type": "module"` or `exports` changes how every consumer resolves the package, so it
waits for a major release. Owner: next major.

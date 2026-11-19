# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

> **Status:** v3 in progress on `next/v3`. Not released. This is a **major** release: it replaces the
> look of every component and removes the v1 compatibility surfaces. Items marked **Breaking** need a
> change in consuming code. The migration guide (`docs/migration/v3.md`) is written later in this
> release; until then [docs/design/v3/v1-inventory.md](docs/design/v3/v1-inventory.md) lists each
> removal with its replacement.

### Added

- **Motion vocabulary: exit variants and longhands.** Each step (`tick`, `sweep`, `uplink`) now
  publishes an exit composite (`--nw-tick-out`, …), and duration and easing longhands for both
  directions (`--nw-tick-duration`, `--nw-tick-ease`, `--nw-tick-out-duration`,
  `--nw-tick-out-ease`, …). Durations scale with `--nw-motion-scale`. The exit values are final,
  approved on the v3 direction board: 100ms, 250ms and 300ms with `cubic-bezier(0.4, 0, 1, 1)`, each
  shorter than its enter. `--nw-tick`, `--nw-sweep` and `--nw-uplink` are unchanged.
- **`--nw-stagger`, `--nw-loop-spin` and `--nw-loop-shimmer`.** Stagger scales with
  `--nw-motion-scale`; the loop cycles scale inversely (`calc(<ms> / var(--nw-motion-scale))`), so
  archive loops run slower and combat faster. Components read them (see Changed).
- **Token generator:** the `motion` and `reducedMotion` extension keys. A token with
  `reducedMotion` gets its value inside a generated
  `@media (prefers-reduced-motion: reduce) { :root, :root[data-intensity] { … } }` block, which
  beats every intensity level. `motion: true` makes `reducedMotion` required. `--nw-motion-scale`,
  `--nw-pulse-state` and `--nw-loop-state` use them.
- **Overlays animate out as well as in.** The drawer, modal and command palette fade and slide on
  `--nw-sweep` when they open and on `--nw-sweep-out` when they close, instead of snapping shut. A
  closed overlay is hidden and not clickable, not focusable and not in the accessibility tree.
  Re-opening while one is still closing reverses from where it stands, and first paint does not
  animate. Browsers outside the latest 2 versions of Chrome, Edge, Firefox and Safari open and
  close instantly (see the README for the baseline).
- **`data-open` on dropdown, toast and tooltip.** `.dropdown` and `.toast` take
  `data-open="true" | "false"`; `"false"` closes them with an exit animation (`--nw-tick-out` and
  `--nw-sweep-out`). Without the attribute they stay open, exactly as in 2.1.0. `.tooltip` takes
  it too: `"true"` pins it open, `"false"` keeps it closed even on hover, and without the attribute
  it opens on hover as before.
- **Tooltips open on keyboard focus.** `.tooltip` opens on `:focus-within` as well as `:hover`.
- **`--nw-loop-state` knob** (`running` | `paused`), read by the button spinner and the skeleton
  shimmer. Reduced motion pauses it.
- **Parity tool:** `--expect <file>` classifies every difference against declared change
  categories (`docs/design/v3/change-inventory.json`) and fails only on differences no category
  explains. Without `--expect`, the output and exit codes are unchanged.
- **New tokens.** `--nw-led-glow`, `--nw-control-glow` and `--nw-progress-glow` (per-component state
  glow, declared as `var(--nw-glow)` on `:root`; combat doubles each); `--nw-hairline` (1px), `--nw-rule` (1.5px) and
  `--nw-accent-width` (2px), the line-weight knobs that structural borders, drawn marks and accent
  bars read; `--nw-elevation-overlay` (`0 24px 64px rgba(0, 0, 0, 0.7)`, the neutral overlay shadow);
  and the role tokens `--nw-action` (bone `#e6e6e6`), `--nw-action-hot` (`#99bbff`) and
  `--nw-action-text` (`#000000`), with Tailwind mappings `nw.action.DEFAULT`, `.hot` and `.text`.
- **Preset `-out` keys.** `duration-nw-{tick,sweep,uplink}-out` and
  `ease-nw-{tick,sweep,uplink}-out`, the exit counterparts of the existing `duration-nw-*` and
  `ease-nw-*` keys.
- **`.led[data-state="active"]`** (`--nw-chrome`), the replacement for `.led.blue`, which v2 had no
  state for.
- **Tooling.**
  - `npm run test:browsers` opens the six overlays in real Chrome and Firefox and runs the open,
    close, first-paint, reduced-motion and console checks (`puppeteer-core` is a dev dependency).
  - `npm run design:board` renders the direction board (`docs/design/v3/board.html`, or any page
    with `--page`) as full-page PNGs, before (`git:v2.1.0`) and after, at each intensity;
    `--wait MS` lets a page with a boot sequence settle before the first shot.
  - `npm run design:contrast` checks every colour pairing in `docs/design/v3/contrast-pairs.json`
    against WCAG (4.5:1 text, 3:1 boundaries); `tests/contrast.test.mjs` runs it in `npm test`.
  - `npm run parity` captures pages concurrently (`--jobs N`, default `min(6, cores - 2)`), starts
    the page clock paused so a capture does not depend on host load, and writes
    `--json <file>` (differences with their category, plus every element's shadows).
    `scripts/parity/glow-check.mjs <file>` checks the glow rules (FR-013b, SC-012) over that file.
    The categories in `change-inventory.json` are pinned to one intensity level and one exact old
    and new value each.

### Changed

- **The visual direction (approved 2026-11-18, two rounds; every value and reason is in
  [docs/design/v3/direction.md](docs/design/v3/direction.md)).** Every component changes at every
  intensity. **Breaking** for anyone who relies on the old look or on literal values:
  - **Glow.** `--nw-glow` is 0.5 at operator (was 1) and 0 at archive, with no combat override (was
    2.2). State signals (LED, check, radio, switch, segmented, steps, progress) read their own knob,
    so at combat they reach an effective 1, still below 2.1.0's 2.2. Decorative glow is gone: the
    `.btn-success` and `.btn-ai` resting shadow, the `.stat-value`, `.m-value` and AI-block glyph
    `text-shadow`, and the panel header gradient and scanlines. The `.glow-*` utilities now read
    `--nw-glow` and are weaker (alpha 0.33 and 0.13, was 0.5 and 0.2; red's second layer is 0.2, was 0.3).
    **Behaviour change:** the LED, control and progress glow read their own knob, and each knob is
    `var(--nw-glow)` resolved on `:root`. A `--nw-glow` override on `:root` (or on the element with
    `data-intensity`) still reaches them, but one on a single element no longer does, where in
    2.1.0 `.led` read `--nw-glow` directly. Set `--nw-led-glow`, `--nw-control-glow` or
    `--nw-progress-glow` on that element instead.
  - **Lines.** `--nw-text-faint` is 0.08 (was 0.06), `--nw-text-line` and `--nw-line` 0.14 (was
    0.12), and `--nw-line-strong` 0.36 (was 0.18), the 3:1 control boundary, now used by form
    controls, check, switch, segmented, combo, kbd, modal, dropdown, tooltip and toast. Placeholder
    text is opacity 0.75 (was 0.6). Header rules (`.panel-header`, `.modal-header`, `.nw-table th`)
    are a neutral `--nw-line` hairline.
  - **Labels.** Panel, card, modal and sidebar headers, table headers, field labels, stat labels
    and metric labels are `--nw-text-mute` (were blue), and a `.kanji` inside a header is
    `--nw-text-default`. `.nw-table td` is `--nw-text-default` (was green) and its row hover is
    neutral. The data colour stays on stat and metric values.
  - **Corners.** `.btn`, `.btn-ghost`, `.btn-danger`, inputs, `.tag`, `.modal`, `.card`, `.combo`
    and the code blocks use `--radius-sm` (were `--radius-md`, `--radius-lg` or fully round for
    `.tag`). So do `.cmdk` (was `--radius-lg`, 8px), `.dropdown-menu`, `.tooltip-content` and
    `.diff` (were `--radius-md`, 4px); all are 2px now.
  - **Buttons.** `.btn` is a bone solid (`--nw-action`, black text; hover `--nw-action-hot`) and was
    blue. `.btn-chrome` is the blue solid. `.btn-ghost` is `--nw-text-default` on a
    `--nw-line-strong` border and lifts instead of filling on hover. `.btn-success` and `.btn-ai`
    keep their coloured text with a `--nw-line-strong` border.
  - **Default `.tag` and `.badge` are neutral** (`--nw-text-default` on `--nw-text-faint`; the badge
    border is `--nw-line-strong`). Blue is `.tag-chrome`.
  - **Toast** has a `1px --nw-line-strong` boundary on the top, right and bottom, and its left
    accent is 2px (`--nw-accent-width`, was 3px). The `.toast-*` variants still colour the accent.
  - **Overlays.** `.modal`, `.drawer` and `.cmdk` take `--nw-elevation-overlay` and a
    `--nw-line-strong` border; the open modal has no residual `transform`.
  - **Tabs and sidebar.** The selected `.tab` keeps a blue underline, and the current
    `.sidebar-item` keeps its blue line and its blue `--nw-primary-fill` background (the fill is
    the same as in 2.1.0); their labels are neutral (`--nw-text-default` when selected, were
    blue), and hover is `--nw-text-strong`.
  - **Dropdown and command palette.** `.dropdown-item` is `--nw-text-default` at rest (was
    `--nw-text-dim`, #aaaaaa). `.dropdown-item:hover` and `.cmdk-item:hover` are `--nw-text-strong`
    on a neutral `--nw-text-faint` fill; in 2.1.0 the dropdown hover was `--nw-text` on the blue
    `--nw-primary-fill`, and the palette hover was a blue `--nw-chrome` label on a blue fill. The
    `.cmdk-item.active` row, the keyboard cursor, keeps its blue label and blue fill.
  - **Smaller changes.** `.code-inline` and `.kv-value` are `--nw-text-default` (were green); the
    `.empty` glyph and the skeleton shimmer are neutral (were blue); `.avatar` and `.combo .chip`
    are a neutral fill, edge and text (were blue); `.cmdk-section` is `--nw-text-mute` (was
    `--nw-chrome-mute`); `.kv-label` is `--nw-text-mute` (was `--nw-primary-dim`);
    `.cmdk-item.active` fills at `--nw-primary-fill`, 0.08 (was 0.1); `.divider` and
    `.dropdown-divider` are `--nw-line` (were `--nw-text-faint`); the `.ai-block` rule and fill are quieter and
    `--nw-purple-fill` is 0.06 alpha (was 0.1) so purple text passes AA on raised surfaces;
    `.nw-progress` has a `--nw-line` edge; every structural border reads `--nw-hairline`.
  - **Motion values.** `--nw-pulse-speed` is 1.6s (was 1.4s) with no combat override (was 0.7s);
    combat pulses in 1.333s through the motion scale. The exit tokens are new in v3 (see Added): 100ms,
    250ms and 300ms, so the longest overlay exit at combat is 300ms.
- **The Tailwind preset follows the custom properties (K3, FR-018).** Colours are
  `color-mix(in srgb, var(--nw-x) calc(<alpha-value> * 100%), transparent)`, so utilities follow
  `data-intensity`, runtime overrides and sub-tree overrides of colour tokens, and opacity
  modifiers such as `bg-nw-cyan/40` keep generating. `duration-nw-*` and `ease-nw-*` are
  `var(--nw-*-duration)` and `var(--nw-*-ease)`, so they scale with `--nw-motion-scale` and drop to
  0 under reduced motion. Font families, sizes, letter spacing, spacing and radii stay literal.
  - **Breaking: `shadow-glow-{green,blue,cyan,red}` change value.** They use the same string as the
    `.glow-*` classes, `0 0 calc(8px * var(--nw-glow)) rgba(…,0.33), 0 0 calc(16px * var(--nw-glow)) rgba(…,0.13)`
    (red's second layer is 0.2): 4px and 8px blur at operator, none at archive. 2.1.0 had a fixed
    `0 0 8px rgba(…,0.5), 0 0 16px rgba(…,0.2)` (red's second layer was 0.3).
  - **Known limit.** The tokens that carry their own alpha (`bg-nw-primary-fill`, `-green-faint`,
    `-green-fill`, `-cyan-glow`, `-red-fill`, and the faint, line, `line-strong` and `line-chrome`
    colours) multiply with an opacity modifier: `bg-nw-primary-fill/40` is 0.4 × 0.08, where v2
    replaced the alpha.
  - **Sub-tree overrides.** Colour tokens and `--nw-glow` follow when set on a sub-tree.
    `--nw-motion-scale` and alias tokens such as `--nw-chrome` resolve on `:root`: set them on
    `:root` or on the `data-intensity` element, or override the derived token itself.
- **Breaking: the package is an ES module (K5, FR-019).** `package.json` has `"type": "module"`, and
  `dist/package.json` (`{"type":"commonjs"}`, written by `scripts/build-cli.mjs`) keeps the CLI
  CommonJS. `import preset from '@cativo23/nightwire/tailwind.preset.js'` loads without a
  `MODULE_TYPELESS_PACKAGE_JSON` warning. A CommonJS Tailwind config must use
  `require('@cativo23/nightwire/tailwind.preset.js').default`: a bare `require()` returns the module
  namespace and Tailwind 3.4 drops it without an error, so no `nw-*` utility is generated (checked
  on Node 24.15 with Tailwind 3.4.19). File names and locations are unchanged.
- **Breaking for re-installs: the installer copies the preset as `nightwire.tailwind.preset.mjs`**
  (was `.js`). A `.mjs` file is always ES module, so there is no module-type warning even in a
  project without `"type": "module"`. Re-running the installer in an old project leaves the old
  `.js` copy behind; point the Tailwind config at the `.mjs` one and delete the old file.
- **Identity unchanged (FR-012):** the four typefaces, kanji labels, compressed title and the three
  intensities.
- **The example pages load `nightwire.css`.** `dashboard.html`, `neural-ops.html` and the five pages
  under `examples/html/components/` no longer redeclare tokens, and the legacy `--nerv-*` names are
  gone. `synapse-ops.html` and `workshop.html` use `.nw-progress-fill`, and page-local status
  glows read the state knobs. Known issue K4 is resolved.
- **Docs.** `DESIGN.md`, `README.md`, `skill/nightwire/` and the docs site describe the v3 look and
  use the v3 forms of LED, tag and progress. `DESIGN.md` replaces its v2-alpha and backward
  compatibility sections with the v3 contract and states that elevation is tone plus one neutral
  overlay shadow, not "no shadows". `docs/architecture/intensity.md` has the v3 knobs table and K4
  resolved. The generated `DESIGN.md` `rounded`, `colors` and `typography` comments are corrected
  at their source in `tokens.json` (the radius steps and surfaces as v3 uses them, buttons in the
  system font). Direction approval, the SC-006 review and the v1 inventory are recorded under
  `docs/design/v3/`. SC-006: the maintainer approved the refresh across the 35 component
  stylesheets at all three intensities, with the default `.tag` neutral, the `.tab` and
  `.sidebar-item` hover at `--nw-text-strong`, and the toast boundary above; `.code-inline`, `.kv-value` and `.dropdown-item` at `--nw-text-default`
  (were green, green and `--nw-text-dim`) and the skeleton shimmer neutral (was blue).
- `DESIGN.md`: the generated `motion` region lists the real motion custom properties instead of
  the doc-only `duration-*` and `easing-*` names, and the `ticker-scroll` and `led-blink`
  animations, which had no CSS behind them, are gone.
- Token validation accepts a token with no output of its own when another token references it.
- **Every component transition and animation reads the motion tokens.** Hover, focus and press
  feedback in button, form fields, tabs, sidebar and breadcrumbs, and the dropdown items, now run
  on `--nw-tick` instead of literal `0.15s` and `0.1s`. At operator the button press transition is
  150ms where it was 100ms. The uplink stagger uses `--nw-stagger` (50ms at operator, as before).
  The easing is the `--nw-tick` curve rather than `ease`. Durations now multiply by
  `--nw-motion-scale` (archive 0.6, combat 1.2), where 2.1.0 used fixed values.
- **Loops follow the intensity.** The button spinner (`--nw-loop-spin`), skeleton shimmer
  (`--nw-loop-shimmer`) and LED pulse (`--nw-pulse-speed`) cycle lengths divide by
  `--nw-motion-scale`: archive loops run slower, combat loops faster. Spinner and shimmer also read
  `--nw-loop-state`.
- **A closed tooltip leaves the accessibility tree.** `.tooltip-content` is now `visibility: hidden`
  when closed, so its text is no longer in the accessibility tree until the tooltip opens (in 2.1.0
  it was, at opacity 0). Give the trigger `aria-describedby` pointing at the content's `id`, and the
  content `role="tooltip"`: `aria-describedby` still reads hidden content, so the description
  survives.
- `docs/architecture/intensity.md`: known issues K1, K2, K3, K4 and K5 are marked resolved.

### Removed

- **Breaking: `.led.green`, `.led.blue`, `.led.red`, `.led.yellow`.** Use `.led[data-state="ok"]`,
  `"active"`, `"error"` and `"warn"`. The state glow is `8px * --nw-led-glow`, not the v1
  `4px * --nw-glow`, so the migration is not pixel-identical.
- **Breaking: `.tag-warning`.** Use `.tag-warn`, which was always the same colour and fill.
- **Breaking: `.nw-progress .fill`.** Use `.nw-progress-fill`. 2.1.0 had called it a deprecation
  candidate for v3; earlier notes that said it was "kept indefinitely" are superseded.
- **Breaking: `.stack`.** Use `.nw-stack`, which also honours `--nw-density`.
- **Breaking: `--nw-header-gradient` and `--nw-header-pattern`.** Panel headers have no gradient or
  scanlines at any intensity.
- **Breaking: the combat-only `--nw-glow` of 2.2 and the combat `--nw-pulse-speed` of 0.7s.** Combat
  no longer overrides either; see Changed.
- The always-visible `.modal-backdrop` rules and the "v1 markup still works" comment were dead code
  (a later rule already hid the backdrop) and are merged into one closed-by-default rule. Rendering
  does not change.

Kept on purpose: `.modal-header`, `.badge-warning`, `.toast-warning`, `.text-warning`, `.tag-info`,
`.tab.active`, `.sidebar-item.active`, `.grid-2|3|4`, and dropdown and toast being open when
`data-open` is absent. The reasons are in `docs/design/v3/v1-inventory.md`.

### Fixed

- **Reduced motion wins over every intensity (K1).** With `data-intensity="archive"` or `"combat"`
  the intensity block used to beat the reduced-motion block, so `--nw-motion-scale` stayed 0.6 or
  1.2 and combat kept the LED pulse running. The generated block now comes after the intensity
  blocks with equal specificity, so `prefers-reduced-motion: reduce` sets the scale to `0` and
  pauses pulse and loops at every level.
- **The reduced-motion backstop reaches pseudo-elements.** The button spinner, the skeleton shimmer
  and the switch knob kept moving under reduced motion because `*` does not match `::before` and
  `::after`. The kill switch now covers both.
- **`.uplink` content stays visible under reduced motion.** The children start at opacity 0 and
  only the animation revealed them, so removing the animation hid them. They now show at their end
  state.
- **The button press shift is actually removed under reduced motion.** 2.1.0 said it was, but the
  rule lost to `.btn:active` on load order, so `.btn`, `.btn-ghost` and `.btn-danger` still moved
  down 1px. It now wins.
- **Visible keyboard focus on the command palette input, `.check`, `.radio`, `.switch` and the
  segmented control.** The palette input had `outline: none` with nothing in its place, the native
  inputs of check, radio and switch are hidden, and the segmented control clips with
  `overflow: hidden`. Each now draws a `--nw-focus-ring` outline, inside the control where it would
  otherwise be cut off.

## [2.1.0] — 2026-11-18

> **Status:** Minor. Additive: two new preset colors and a button press state. Existing tokens,
> classes and package files are unchanged.

### Added

- **`nw.text.faint` and `nw.text.line` in the Tailwind preset.** The `--nw-text-faint` and
  `--nw-text-line` custom properties existed, but the preset had no matching colors, so
  `text-`/`bg-`/`border-nw-text-faint` and `-line` resolved to nothing. Values:
  `rgba(255, 255, 255, 0.06)` and `rgba(255, 255, 255, 0.12)`.
- **Button press state.** `.btn`, `.btn-ghost` and `.btn-danger` move down 1px on `:active`
  (`transform 0.1s`). Under `prefers-reduced-motion: reduce` the shift is removed as well.

### Changed

- **Repository restructure. No consumer action required.** `nightwire.css` and
  `tailwind.preset.js` stay at the repo root and in the npm package, and the package ships the same
  13 files. What changed is how they are made:
  - `src/tokens/tokens.json` (W3C DTCG) is now the single token source. It generates the
    stylesheet's custom properties, `tailwind.preset.js` and the token sections of `DESIGN.md`.
  - `nightwire.css` is assembled from one file per component under `src/`, in the order fixed by
    `src/index.css`. A computed-style parity check reports zero differences against 2.0.1 on the
    two example pages that load `nightwire.css` and a coverage fixture that exercises every class,
    in all intensity and reduced-motion states.
  - The CLI source moved to `cli/`; the docs site moved to `apps/docs/` and now uses the root
    stylesheet and preset instead of its own copies.
  - CI fails when a committed generated file is stale.
- `DESIGN.md`: `rounded.none` reads `"0"` (was `"0px"`, the stylesheet has always used `0`), and
  rgba values are written with spaces, as in the stylesheet.
- `tailwind.preset.js` is reformatted with a generated header; its values are unchanged.

### Fixed

- Docs site install instructions used package paths that do not exist (`nightwire/…`,
  `npx nightwire-cli`). They now use `@cativo23/nightwire`.
- The docs Docker builds use the repo root as context, so the compose files work again.

See [docs/architecture/](docs/architecture/) for how tokens, the build and the cascade work.

## [2.0.1] — 2026-05-27

> **Status:** Patch. Fully additive — operator-mode (default) rendering is byte-for-byte unchanged. Safe drop-in over 2.0.0.

### Fixed

- **v1 status LEDs are now glow-aware.** `.led.green/.blue/.red/.yellow` previously used a fixed `0 0 4px` shadow, so they ignored the intensity system: they stayed lit in `archive` (glow off) and never intensified in `combat`. They now use `0 0 calc(4px * var(--nw-glow))`, matching the v2 `.led[data-state]` API. Measured output: operator `4px` (unchanged), combat `8.8px`, archive `0px`.
- **`.nw-progress` fill shadow** made glow-aware in the same pass for consistency (operator unchanged at 4px).

### Added

- **`.nw-progress-fill`** is now a first-class selector alongside `.nw-progress .fill`. The generic `.fill` child class collided with utility frameworks (Bootstrap/Tailwind) and was unguessable from the parent name. Existing `.fill` markup keeps working — this is an alias, not a rename. `.fill` is a deprecation candidate for v3.

## [2.0.0]

> **Status:** Stable release. API frozen. All v1 consumers keep working with zero changes.
> Install with `npm i @cativo23/nightwire` (now the default `latest` tag).

### What's new since alpha.1

- **Docs site** (`nightwire.cativo.dev`) — favicon, workshop link, and all example HTML files now served correctly in production
- **Workshop** (`/examples/html/workshop.html`) — fully expanded with all v2 components: interactive drawer, modal, Cmd K palette, AI block showcase, LED state guide, code-block with syntax tokens, diff, empty state, progress + stepper, and a real dashboard with fleet/incident panels
- **Live examples** — all three demo cards (Alchemix, Neural-Ops, Workshop) now open correctly from the docs site

### Migration guide — v1.x → v2.0.0

v2 is **fully additive**. Upgrade by bumping the version; nothing breaks.

**To adopt v2 features:**

1. Add `data-intensity="operator"` to your `<html>` tag (or `archive` for docs/blogs, `combat` for dashboards):
   ```html
   <html data-intensity="operator">
   ```

2. Replace hardcoded colors with the new semantic tokens where convenient:
   | v1 token | v2 equivalent |
   |---|---|
   | `--nw-primary` | `--nw-chrome` |
   | `--nw-text` | `--nw-text-default` |
   | `--nw-text-dim` | `--nw-text-mute` |
   | `--void` | `--nw-surface-0` |
   | `--void-panel` | `--nw-surface-1` |

3. Use new components as needed — see the [workshop](https://nightwire.cativo.dev/examples) for live examples of every v2 primitive.

### Behavior changes (from alpha.1, none new in stable)

- **`.modal-backdrop`** requires `data-open="true"` to be visible. Projects that always render the backdrop must add the attribute; projects that mount it conditionally are unaffected.
- **`.panel-header`** has a subtle `rgba(102,153,255,0.06)` gradient tint at `operator` intensity. Override with `background-image: none` on `.panel-header` to opt out.

### API freeze

All token names, class names, and modifier conventions are now stable. No renames or removals will happen in the v2.x line without a semver-major bump.

---

## [2.0.0-alpha.1]

> **Status:** First alpha release. Fully additive — v1 consumers (cativo.dev, blog.cativo.dev) keep working without changes. Install with `npm i @cativo23/nightwire@alpha`.

### Added — CSS

- **Layer 2 semantic tokens** alongside v1 (zero rename). New names reference the role, not the hue, so palettes can be forked without touching components:
  - Surfaces: `--nw-surface-0..4` (the 4th is new for overlays)
  - Text tiers: `--nw-text-strong`, `--nw-text-default`, `--nw-text-mute`, `--nw-text-disabled`
  - Roles: `--nw-chrome`, `--nw-data`, `--nw-signal-info/warn/error`, `--nw-ai`
  - Lines: `--nw-line`, `--nw-line-strong`, `--nw-line-chrome`
- **Intensity system** via `<html data-intensity="...">`:
  - `archive` — glow off, paused pulses, larger padding, no kanji, slower motion. For docs and blogs.
  - `operator` (default) — current Nightwire look
  - `combat` — extra glow, faster pulses, denser padding, scanline overlay. For ops consoles.
- **Knobs** that respond to intensity: `--nw-glow`, `--nw-density`, `--nw-motion-scale`, `--nw-pad-scale`, `--nw-kanji-display`, `--nw-pulse-state`, `--nw-header-gradient`.
- **Motion vocabulary**: `--nw-tick` (150ms), `--nw-sweep` (350ms), `--nw-uplink` (400ms). All multiplied by `--nw-motion-scale`.
- `prefers-reduced-motion` contract: sets `--nw-motion-scale: 0` and pauses pulses.

### Added — Components

- **Tag variants**: `.tag-chrome`, `.tag-warn`, `.tag-ai`
- **Button variants**: `.btn-success`, `.btn-ai`, `.btn-icon`, `.btn-xs`, `.btn-lg`, `.btn-loading`
- **Form suite**: `.field` (default/success/error states), `.switch`, `.check`, `.radio`, `.combo` (multiselect with chips), `.kbd`, `.seg` (segmented control)
- **Overlays**: `.drawer` + `.drawer-backdrop`, `.cmdk` + `.cmdk-section`/`.cmdk-item`, `.modal-title`
- **Data display**: `.code-block` with syntax tokens, `.code-inline`, `.diff` with add/del lines, `.steps` stepper
- **State**: `.led[data-state="ok|warn|error|info|ai"]`, `.led[data-pulse]`, `.empty`, `.ai-block`
- **Stat card** with sparkline support (`.stat`, `.stat-label`, `.stat-value`, `.stat-spark`)
- **Layout primitives**: `.nw-frame`, `.nw-stack`, `.nw-cluster`, `.nw-split`
- **Banner**: system-wide notice strip
- **Uplink reveal**: staggered enter animation on `.uplink > *`

### Added — Tailwind preset

- Semantic color aliases: `nw-chrome`, `nw-data`, `nw-signal-info/warn/error`, `nw-ai`
- Text tier split: `nw-text-strong/default/mute/disabled`
- New surface tier: `void-surface` (#242424)
- Stronger border colors: `nw-line-strong`, `nw-line-chrome`
- Motion timing utilities: `duration-nw-tick/sweep/uplink`, `ease-nw-tick/sweep/uplink`

### Added — Examples

- `examples/html/workshop.html` — v2 showcase with live intensity toggle, dashboard view, components workshop (Forms / Buttons / Data / Feedback tabs), Cmd K palette, toast stack, debug HUD

### Compatibility

- All v1 tokens (`--nw-primary`, `--void`, `--nw-text-dim`, etc.) untouched. Existing projects keep working with zero changes.
- All v1 classes (`.btn`, `.panel`, `.tag`, `.card`, `.nw-table`, etc.) untouched.
- Opt-in to v2 via `data-intensity` attribute or by using new class names directly.

> **Behavior change** — `.modal-backdrop` now defaults to `visibility: hidden; opacity: 0` and requires `data-open="true"` to become visible. v1 consumers that mount the backdrop conditionally (only when modal is open) are unaffected; consumers that always render the backdrop must add the `data-open` attribute.

> **Visual delta** — `.panel-header` now applies a subtle blue gradient overlay (`rgba(102,153,255,0.06)` at default intensity). Existing v1 markup will see a faint tint on panel headers. This is purely additive and intentional; to opt out, override `background-image: none` on `.panel-header` in your project CSS.

## [1.0.16]

### Fixed
- Include `package-lock.json` in repository for `npm ci` in GitHub Actions workflow
- Remove `package-lock.json` from `.gitignore` to ensure consistent dependency installation

## [1.0.15]

### Changed
- Restructured project to move CLI from `packages/cli/` to root directory
- Simplified npm publishing workflow to match Lumira's structure (no subdirectory)
- Removed `repository.directory` field requirement for npm OIDC Trusted Publishing
- Updated GitHub Actions workflow to publish from root instead of `packages/cli/`
- Consolidated package.json with CLI configuration at root level
- Updated README with CLI installation instructions as recommended method

### Removed
- Eliminated duplicate files between root and `packages/cli/`
- Removed `packages/cli/` directory entirely

## [1.0.14]

### Fixed
- Reverted to `@cativo23/nightwire` package name.
- Match `lumira`'s exact workflow step naming (`npm-publish` rather than `npm-publish-cli`) and structure.
- Removed `--provenance` since lumira doesn't use it explicitly.
- The npm setup is now identically modeled after `lumira` which successfully publishes to the user's scope.

## [1.0.13]

### Fixed
- Changed the npm package name from `@cativo23/nightwire` back to `nightwire-cli` or just without the `@cativo23` scope. The 404 is happening specifically because npm is returning 404 on the scoped package PUT. If the token is empty (because `secrets.NPM_TOKEN` doesn't exist), you can't publish scoped packages without it throwing a 404. Let's try changing the name.

## [1.0.12]

### Fixed
- Add back explicit `NPM_TOKEN` environment variable and `registry-url` to GitHub Actions publishing flow.

## [1.0.11]

### Fixed
- Re-removed registry-url from github actions, it may be causing the action to expect a NODE_AUTH_TOKEN again even with --provenance. Lumira has it setup correctly using `registry-url` but it publishes to the user's scope automatically without explicit secrets somehow. Let's see if dropping `registry-url` but keeping `--provenance` works.

## [1.0.10]

### Fixed
- Changed relative paths inside the CLI installer script so `npx` points directly to the bundled assets inside the package instead of looking outside to a monorepo root.

## [1.0.9]

### Fixed
- Fixed missing files when running via `npx` by bundling assets into the `packages/cli` distribution.
- Changed the root directory resolution so `install.js` looks internally instead of globally.

## [1.0.8]

### Fixed
- Attempt 8: Use `--provenance` explicit flag without explicit ENV tokens since Lumira has no secrets configured. It turns out Lumira does *not* have an `NPM_TOKEN` secret despite it referencing one in the yaml. Thus we must use true secretless OIDC publishing.

## [1.0.7]

### Fixed
- Attempt 7: Run npm publish from root (with `cd packages/cli`) rather than `working-directory`

## [1.0.6]

### Fixed
- Attempt 6 at npm publish with GitHub Actions

## [1.0.5]

### Fixed
- Reverted registry-url and use NODE_AUTH_TOKEN explicitly from NPM_TOKEN secret for npm publish

## [1.0.4]

### Fixed
- npm publish via GitHub Actions OIDC Trusted Publishing (removed registry-url from setup-node)

## [1.0.3]

### Fixed
- GitHub Actions workflow: run npm publish from repo root to fix OIDC Trusted Publishing

## [1.0.2]

### Fixed
- npm publish via GitHub Actions OIDC Trusted Publishing now works correctly

## [1.0.1]

### Changed
- CLI install command now shows ASCII art banner on startup
- Renamed npm package to `@cativo23/nightwire`, binary to `nightwire`
- Switched npm publish to OIDC Trusted Publishing (no tokens required)

## [1.0.0]

### Added
- `nightwire.css` — 24+ pure CSS components, 42 design tokens, cyberpunk aesthetic
- `tailwind.preset.js` — full token mapping for Tailwind CSS v3+
- `DESIGN.md` — Google design.md standard spec (9.5/10 AI-readability)
- `SKILL.md` — Anthropic skill standard (279 lines) with `references/layouts.md` and `references/examples.md`
- `packages/cli/` — `nightwire-cli` interactive installer with project type detection
- `docs/` — React + Vite documentation site with 16 pages, real routes, responsive layout, Docker support
- `examples/` — `dashboard.html` and `neural-ops.html` demos with Three.js
- GitHub Actions workflow for auto release and npm publish

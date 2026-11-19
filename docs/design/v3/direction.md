# v3 visual direction

Status: approved (2026-11-18, round 2)

The proposed look for the v3 refresh, recorded once so the maintainer can approve or amend it on
the direction board (`npm run design:board`, page `docs/design/v3/board.html`) before it reaches
the other components. The values live in `src/tokens/tokens.json`; this file explains each one.
The Approval section below records the decision.

What already reaches the whole system: the token values in this proposal are on `:root`, so every
component that reads them changes now, not only the nine board components. That is `--nw-glow` (every
remaining glow halves at operator and stops rising at combat), `--nw-text-faint`, `--nw-text-line` and
`--nw-line` (every quiet divider and edge), `--nw-line-strong` (every control boundary: check, switch,
segmented, combo, kbd), `--nw-pulse-speed` and the exit durations. What waits for approval is the
per-component work on the other 25 components: moving glow onto the glow knobs (T038, T039), removing
decorative glow (T039), moving line weights onto the line knobs (T040) and the group-by-group
application (T043, T044). Rejecting a value here means reverting that token.

Constraints: FR-013a (decorative sci-fi treatments are gone at every intensity; combat adds
energy only through state signals), FR-013b (no glow at archive; at operator every remaining glow
is weaker than in v2.1.0; at combat only state signals may exceed operator) and FR-014 (WCAG AA
on the black surfaces).

## Values

| Token / surface | v2.1.0 | v3 proposal | Why |
|---|---|---|---|
| `--nw-glow` | archive 0, operator 1, combat 2.2 | archive 0, operator 0.5, combat 0.5 (no combat override) | The ambient glow halves at operator (FR-013b) and does not rise at combat, so nothing that is not a state signal glows more at combat than at operator. The `.glow-*` utilities will read it (T039). |
| `--nw-led-glow`, `--nw-control-glow`, `--nw-progress-glow` (new) | none (components read `--nw-glow`) | base `var(--nw-glow)`; combat `calc(var(--nw-glow) * 2)`, so effective 0, 0.5, 1 | Per-component tuning (proposal 005). Only state signals rise at combat (FR-013a) and they stay below v2.1.0 combat (2.2). A multiple of `--nw-glow` keeps a consumer override of `--nw-glow` effective at every level. |
| `--nw-hairline` (new) | literal `1px`, 47 uses | `1px` | Every structural border reads it. Thin by default. |
| `--nw-rule` (new) | literal `1.5px`, 3 uses (check strokes, spinner ring) | `1.5px` | Marks drawn inside controls. |
| `--nw-accent-width` (new) | literal `2px` (tabs, sidebar, diff) and `3px` (toast) | `2px` | One accent weight. The toast accent goes from 3px to 2px in T040. |
| `--nw-text-faint` | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.08)` | Quiet dividers and panel edges read a little clearer. They are decorative, not control boundaries. |
| `--nw-text-line`, `--nw-line` | `rgba(255,255,255,0.12)` | `rgba(255,255,255,0.14)` | Same, one step up. |
| `--nw-line-strong` | `rgba(255,255,255,0.18)` (1.6:1) | `rgba(255,255,255,0.36)` (at least 3:1 on `--void`, `--void-warm` and `--void-panel`) | It is the control-boundary colour (check, switch, segmented, combo, kbd). WCAG 1.4.11 needs 3:1. |
| Form control border (`input`, `select`, `textarea`) | `--nw-text-line` | `--nw-line-strong` | Inputs are controls, so they get the same 3:1 boundary. |
| Placeholder | `--nw-text-dim` at opacity 0.6 (3.64:1 on `--void-panel`) | same colour at opacity 0.75 (5.03:1) | AA for text. |
| Header rules (`.panel-header`, `.modal-header`, `.nw-table th` border-bottom) | `--nw-primary-dim`, solid | `--nw-line-chrome` (primary at 0.35) | Quieter hairline rules. The chrome colour stays in the label text. |
| Panel header `background-image` (gradient; scanlines at combat) | on | removed | FR-013a. The `knob.header-*` tokens are deleted in T037. |
| `.btn-success` and `.btn-ai` box-shadow at rest | `0 0 calc(10px * glow)`, coloured | none | Decorative glow. |
| `.stat .stat-value` text-shadow | two coloured layers times glow | none | Decorative glow. |
| `.metric-cell .m-value` and `.highlight .m-value` text-shadow | hardcoded, coloured | none | Decorative glow. |
| `.led[data-state]` glow | `calc(8px * var(--nw-glow))` | `calc(8px * var(--nw-led-glow))` | State glow moves onto its own knob. The v1 `.led.green`, `.blue`, `.red` and `.yellow` rules stay until T042. |
| `--nw-elevation-overlay` (new, not a knob) | none | `0 24px 64px rgba(0, 0, 0, 0.7)` | Neutral, non-coloured elevation for overlays. `.modal` adopts it now; cmdk and drawer adopt it in T039. |
| `.modal` inside an open backdrop | `transform: scale(1)` | `transform: none` | Like `.cmdk`: no residual transform when open (crisp text, no containing-block side effects). Closed stays `scale(0.96)`. |
| `--nw-pulse-speed` | 1.4s; combat 0.7s, effectively 0.583s after the motion scale | 1.6s, no combat override: effective operator 1.6s, combat 1.333s | One knob, scaled once by `--nw-motion-scale`. Combat is still faster (FR-013a). Archive keeps the pulse paused. |
| Exit durations `--nw-tick-out`, `--nw-sweep-out`, `--nw-uplink-out` and their `-duration` longhands | 112.5ms, 262.5ms, 300ms (provisional: enter times 0.75) | 100ms, 250ms, 300ms | Final round values, still shorter than enter (150, 350, 400). |
| Enter durations and all curves | 150, 350, 400ms; enter `cubic-bezier(0.3,0,0.7,1)`, `(0.2,0.8,0.2,1)`, `(0,0.6,0.4,1)`; exit `(0.4,0,1,1)` | unchanged | Approved in US1; listed so the table is complete. |
| Line-weight knobs per intensity | none | no per-level overrides in v3 | Combat energy comes from state glow, pulse and density, not heavier lines. The knobs exist so a level can change them later. |
| Reduced-motion review: static spinner ring, static skeleton shimmer, segmented focus ring next to a selected segment | not reviewed | spinner and shimmer stay static; the segmented ring is addressed in T044 | Recorded as reviewed. |

## Round 2

The maintainer rejected round 1 at the approval gate: it looked too close to v2.1.0 and did not
follow the approved mockup, because it only retuned alphas and glow. Round 2 keeps everything in the
table above and adds the mockup's patterns on the board set (panel, button, stat,
table, form, modal, tag, metrics; the LED is unchanged). The patterns are neutral-first colour,
neutral hairlines, square corners, and one solid action in bone with outline secondaries. Only
ryoku.dev patterns are taken: no palette, no fonts (constitution, principle IV).

| Surface | Round 1 | Round 2 | Why |
|---|---|---|---|
| Label colour: `.panel-header`, `.modal-header`, `.modal-title`, `.nw-table th`, `.stat .stat-label`, `.metric-cell .m-label`, `.field-label` | `--nw-primary` or `--nw-chrome` | `--nw-text-mute` | Labels are quiet. Blue is kept for focus and accents, so it still means something. |
| Kanji inside `.panel-header` and `.modal-header` | inherits the blue label | `--nw-text-default`, set inside `:where()` so colour utilities still win | The glyph is the one bright mark in a quiet header. The default has specificity 0, so `.text-dim` or a Tailwind colour class on the kanji overrides it in any load order (a colour inherited from an ancestor does not). |
| Header rules: `.panel-header`, `.modal-header`, `.nw-table th` border-bottom | `--nw-line-chrome` | `--nw-line` | A neutral hairline, like the mockup's. |
| `.panel` border | `--nw-text-faint` | `--nw-line` | One step clearer so the panel edge reads against the page. |
| `.modal` border | `--nw-primary-dim` | `--nw-line-strong` | Neutral, and the same 3:1 boundary as the other controls. |
| `.modal-footer` border-top | `--nw-text-faint` | `--nw-line` | Matches the header rule. |
| `.nw-table td` colour | `--nw-green` | `--nw-text-default` | Table text is content, not a data readout. The data colour lives on stat and metric values (`--nw-value-color`), unchanged. |
| `.nw-table tr:hover td` background | `--nw-green-faint` | `--nw-text-faint` | Neutral row hover. |
| Corners: `.btn`, `.btn-ghost`, `.btn-danger`, `input`, `select`, `textarea`, `.tag`, `.modal` | `--radius-md`, `--radius-full` (tag), `--radius-lg` (modal) | `--radius-sm` | Square corners, the mockup's silhouette. |
| `.btn` (primary) | blue solid | bone solid: background and border `--nw-action`, text `--nw-action-text`; hover background and border `--nw-action-hot` | The single solid action, like the mockup's INSTALL chip. |
| `.btn-chrome` | blue solid, shared with `.btn` | blue solid: `--nw-chrome`, hover `--nw-chrome-hot`, text `--void` | The only blue solid left, for UI-chrome actions. |
| `.btn-ghost` | blue text, `--nw-primary-dim` border, filled hover | text `--nw-text-default`, border `--nw-line-strong`; hover: transparent, border `--nw-line-chrome`, text `--nw-text-strong` | An outline secondary that lifts instead of filling. |
| `.btn-success`, `.btn-ai` | coloured text, coloured mute border | coloured text kept, border `--nw-line-strong`; hover keeps the coloured fill and takes the coloured mute border (`--nw-data-mute`, `--nw-ai-mute`) | Colour stays in the text and on hover. |
| Stat and metrics values | data green, highlight blue | unchanged | Data colour means data. |

### New role tokens

Added next to `--nw-chrome` in `src/tokens/tokens.json`, with Tailwind mappings like the chrome
tokens (`nw.action.DEFAULT`, `nw.action.hot`, `nw.action.text`).

| Token | Value | Use |
|---|---|---|
| `--nw-action` | `var(--nw-text-default)` (#e6e6e6) | The primary action fill. |
| `--nw-action-hot` | `var(--nw-chrome-hot)` (#99bbff) | Its hover. |
| `--nw-action-text` | `var(--void)` (#000000) | Text on the action fill. |

### Contrast (FR-014)

WCAG contrast ratios, computed from the sRGB values (relative luminance, ratio of
(L1 + 0.05) / (L2 + 0.05)). AA needs 4.5:1 for text, and 3:1 for large text and UI boundaries
such as focus rings.

The check is repeatable: `npm run design:contrast` evaluates every pairing in
`docs/design/v3/contrast-pairs.json` (text, labels, signal colours, button labels, tags,
placeholders, focus rings and control boundaries, on each surface they sit on; value colours at
all three intensities) against the tokens emitted from `src/tokens/tokens.json`, and `tests/contrast.test.mjs` fails the
suite on any pairing below its threshold. Tinted fills (tags, `.ai-block`, the `.btn-success` and
`.btn-ai` hover fills) are checked over all four component surfaces. `--nw-surface-4` is checked for
body text, muted labels and control boundaries only: no component sits on it yet.

One token changed to pass: `--nw-purple-fill` alpha 0.1 → 0.06. `--nw-ai` on that fill over
`--void-raised` measured 4.32:1 (`.tag-ai`, `.ai-block` and the `.btn-ai` hover can sit in a
dropdown, tooltip or raised panel). At 0.06 it is 4.55:1; 0.065 is the largest alpha that passes,
and 0.06 leaves a margin for the browser's 8-bit rounding. The purple text colour is untouched. It
is the only fill that failed, and it reaches `.tag-ai`, `.ai-block` and the `.btn-ai` hover fill.
Parity categories `refresh-contrast-purple-fill-*` pin the rendered differences.

The lowest margins are `--nw-line-strong` on `--void` at 3.13:1 and `--nw-ai` on `--void-raised`
at 4.86:1. Two hover borders are not passing pairs (see `exempt` in the pairs file):
`.btn-ghost:hover` (`--nw-line-chrome`, 1.74:1) and `.btn-ai:hover` on `--void-raised`
(`--nw-ai-mute`, 2.97:1) are exempt: hover is not a state the control needs to be identified by,
because the label and the resting `--nw-line-strong` boundary (3:1) already identify it. The table below keeps the hand-computed examples.

| Pair | Ratio | Result |
|---|---|---|
| `--nw-action-text` (#000000) on `--nw-action` (#e6e6e6) | 16.83:1 | pass |
| `--nw-action-text` (#000000) on `--nw-action-hot` (#99bbff) | 10.91:1 | pass |
| `--nw-text-mute` (#aaaaaa) 9px and 10px labels on `--void` (#000000) | 9.04:1 | pass |
| `--nw-text-mute` on `--void-warm` (#0a0a0a) | 8.52:1 | pass |
| `--nw-text-mute` on `--void-panel` (#111111) | 8.13:1 | pass |
| `--nw-text-default` (#e6e6e6) table text on `--void-warm` (#0a0a0a) | 15.86:1 | pass |
| Disabled `.btn` (opacity 0.4): text over the dimmed bone fill | 3.14:1 | exempt (inactive control, WCAG 1.4.3) |

## Reference

The ryoku-inspired mockup the maintainer approved on 2026-11-13 informs patterns only: thin
hairlines, restrained glow and quiet header rules. No palette, font, artwork or copy is taken from
it (constitution, principle IV).

## Approval

- **Approver:** Carlos Cativo (maintainer).
- **Date:** 2026-11-18.
- **Round 1:** rejected. It read as v2.1.0 with lower alphas and did not follow the approved
  mockup's language.
- **Round 2:** approved, with the primary `.btn` as a bone solid (`--nw-action`), like the mockup's
  INSTALL chip. Reviewed on the board rendered from `e566677` (round 2) at archive, operator and
  combat, before and after; `3732f7a` changes no board render.
- **Identity (FR-012):** confirmed on the board: the four typefaces, kanji labels, the compressed
  title and three distinct intensities.
- **Not in this refresh:** the mockup's new pieces (grain, chips, section heads, spec sheets, kanji
  index, accordion, reticle, halftone, barcode, outline wordmark) are approved patterns, but they
  are new components, which spec 002 leaves to the next spec.

## SC-006 review (2026-11-18)

The maintainer reviewed the before and after renders of the 34 components at all three intensities
and approved the refresh (SC-006) with six detail decisions, numbered as in the review.

| # | Surface | Decision | Reason |
|---|---|---|---|
| 1 | `.tag` default | Changed: neutral, `--nw-text-default` on `--nw-text-faint` | Rule 2: a default look is neutral. Blue stays on `.tag-chrome`. |
| 2 | `.code-inline`, `.kv-value` | Kept white | Like the spec-sheet values in the approved mockup. |
| 3 | `.dropdown-item` | Kept white | A menu is read and chosen from, so it uses body text, not a muted label. |
| 4 | `.tab:hover`, `.sidebar-item:hover` | Changed: `--nw-text-strong` | Same as `.dropdown-item` and `.cmdk-item`, so hover reads the same on every list-like control. Backgrounds and active states unchanged. |
| 5 | Skeleton shimmer | Kept neutral | A loading placeholder carries no signal, so it takes no colour. |
| 6 | `.toast` | Changed: `1px solid --nw-line-strong` on top, right and bottom | Rule 3: a surface needs an edge, the modal's. The 2px left accent and the `.toast-*` variants still win. |

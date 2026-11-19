# v3 visual direction

Status: approved (2026-11-18, round 2)

The look of the v3 refresh, recorded once so the maintainer could approve or amend it on
the direction board (`npm run design:board`, page `docs/design/v3/board.html`) before it reaches
the other components. The values live in `src/tokens/tokens.json`; this file explains each one.
The Approval section below records the decision.

What reached the whole system at once: the token values in this proposal are on `:root`, so every
component that reads them changed, not only the nine board components (button, panel, stat,
metrics, LED, tag, table, form fields and modal). That is `--nw-glow` (every
remaining glow halves at operator and stops rising at combat), `--nw-text-faint`, `--nw-text-line` and
`--nw-line` (every quiet divider and edge), `--nw-line-strong` (every control boundary: check, switch,
segmented, combo, kbd), `--nw-pulse-speed` and the exit durations. What waited for
approval was the per-component work on the remaining component stylesheets: moving glow onto the
glow knobs (T038, T039), removing decorative glow (T039), moving line weights onto the line knobs
(T040) and the group-by-group application (T043, T044). It shipped after the approval recorded
below. Rejecting a value here would have meant reverting that token.

Constraints: FR-013a (decorative sci-fi treatments are gone at every intensity; combat adds
energy only through state signals), FR-013b (no glow at archive; at operator every remaining glow
is weaker than in v2.1.0; at combat only state signals may exceed operator) and FR-014 (WCAG AA
on the black surfaces).

## Values

| Token / surface | v2.1.0 | v3 proposal | Why |
|---|---|---|---|
| `--nw-glow` | archive 0, operator 1, combat 2.2 | archive 0, operator 0.5, combat 0.5 (no combat override) | The ambient glow halves at operator (FR-013b) and does not rise at combat, so nothing that is not a state signal glows more at combat than at operator. The `.glow-*` utilities read it (T039). |
| `--nw-led-glow`, `--nw-control-glow`, `--nw-progress-glow` (new) | none (components read `--nw-glow`) | base `var(--nw-glow)`; combat `calc(var(--nw-glow) * 2)`, so effective 0, 0.5, 1 | Per-component tuning (proposal 005). Only state signals rise at combat (FR-013a) and they stay below v2.1.0 combat (2.2). A multiple of `--nw-glow` keeps a consumer override of `--nw-glow` effective at every level. |
| `--nw-hairline` (new) | literal `1px`, 47 uses | `1px` | Every structural border reads it. Thin by default. |
| `--nw-rule` (new) | literal `1.5px`, 3 uses (check strokes, spinner ring) | `1.5px` | Marks drawn inside controls. |
| `--nw-accent-width` (new) | literal `2px` (tabs, sidebar, diff) and `3px` (toast) | `2px` | One accent weight. The toast accent went from 3px to 2px in T040. |
| `--nw-text-faint` | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.08)` | Quiet dividers and panel edges read a little clearer. They are decorative, not control boundaries. |
| `--nw-text-line`, `--nw-line` | `rgba(255,255,255,0.12)` | `rgba(255,255,255,0.14)` | Same, one step up. |
| `--nw-line-strong` | `rgba(255,255,255,0.18)` (1.6:1) | `rgba(255,255,255,0.36)` (at least 3:1 on `--void`, `--void-warm` and `--void-panel`) | It is the control-boundary colour (check, switch, segmented, combo, kbd). WCAG 1.4.11 needs 3:1. |
| Form control border (`input`, `select`, `textarea`) | `--nw-text-line` | `--nw-line-strong` | Inputs are controls, so they get the same 3:1 boundary. |
| Placeholder | `--nw-text-dim` at opacity 0.6 (3.64:1 on `--void-panel`) | same colour at opacity 0.75 (5.03:1) | AA for text. |
| Header rules (`.panel-header`, `.modal-header`, `.nw-table th` border-bottom) | `--nw-primary-dim`, solid | `--nw-line-chrome` (primary at 0.35) | Quieter hairline rules. The chrome colour stays in the label text. |
| Panel header `background-image` (gradient; scanlines at combat) | on | removed | FR-013a. The `knob.header-*` tokens were deleted in T037. |
| `.btn-success` and `.btn-ai` box-shadow at rest | `0 0 calc(10px * glow)`, coloured | none | Decorative glow. |
| `.stat .stat-value` text-shadow | two coloured layers times glow | none | Decorative glow. |
| `.metric-cell .m-value` and `.highlight .m-value` text-shadow | hardcoded, coloured | none | Decorative glow. |
| `.led[data-state]` glow | `calc(8px * var(--nw-glow))` | `calc(8px * var(--nw-led-glow))` | State glow moves onto its own knob. The v1 `.led.green`, `.blue`, `.red` and `.yellow` rules were removed in T042. |
| `--nw-elevation-overlay` (new, not a knob) | none | `0 24px 64px rgba(0, 0, 0, 0.7)` | Neutral, non-coloured elevation for overlays. `.modal` adopted it first; `.cmdk` and `.drawer` adopted it in T039. |
| `.modal` inside an open backdrop | `transform: scale(1)` | `transform: none` | Like `.cmdk`: no residual transform when open (crisp text, no containing-block side effects). Closed stays `scale(0.96)`. |
| `--nw-pulse-speed` | 1.4s; combat 0.7s, effectively 0.583s after the motion scale | 1.6s, no combat override: effective operator 1.6s, combat 1.333s | One knob, scaled once by `--nw-motion-scale`. Combat is still faster (FR-013a). Archive keeps the pulse paused. |
| Exit durations `--nw-tick-out`, `--nw-sweep-out`, `--nw-uplink-out` and their `-duration` longhands | 112.5ms, 262.5ms, 300ms (provisional: enter times 0.75) | 100ms, 250ms, 300ms | Final round values, still shorter than enter (150, 350, 400). |
| Enter durations and all curves | 150, 350, 400ms; enter `cubic-bezier(0.3,0,0.7,1)`, `(0.2,0.8,0.2,1)`, `(0,0.6,0.4,1)`; exit `(0.4,0,1,1)` | unchanged | Approved in US1; listed so the table is complete. |
| Line-weight knobs per intensity | none | no per-level overrides in v3 | Combat energy comes from state glow, pulse and density, not heavier lines. The knobs exist so a level can change them later. |
| Reduced-motion review: static spinner ring, static skeleton shimmer, segmented focus ring next to a selected segment | not reviewed | spinner and shimmer stay static; the segmented ring was addressed in T044 | Recorded as reviewed. |

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

The maintainer reviewed the before and after renders of the 35 component stylesheets at all three
intensities and approved the refresh (SC-006) with six detail decisions, numbered as in the review.

| # | Surface | Decision | Reason |
|---|---|---|---|
| 1 | `.tag` default | Changed: neutral, `--nw-text-default` on `--nw-text-faint` | Rule 2: a default look is neutral. Blue stays on `.tag-chrome`. |
| 2 | `.code-inline`, `.kv-value` | Kept white | Like the spec-sheet values in the approved mockup. |
| 3 | `.dropdown-item` | Kept white | A menu is read and chosen from, so it uses body text, not a muted label. |
| 4 | `.tab:hover`, `.sidebar-item:hover` | Changed: `--nw-text-strong` | Same as `.dropdown-item` and `.cmdk-item`, so hover reads the same on every list-like control. Backgrounds and active states unchanged. |
| 5 | Skeleton shimmer | Kept neutral | A loading placeholder carries no signal, so it takes no colour. |
| 6 | `.toast` | Changed: `1px solid --nw-line-strong` on top, right and bottom | Rule 3: a surface needs an edge, the modal's. The 2px left accent and the `.toast-*` variants still win. |

## US5: the approved mockup in v3 (2026-11-19)

Status: approved (2026-11-19, direction gate T067)

The maintainer decided on 2026-11-19 that v3 does not ship without the mockup's look
(`ryoku-inspo.html`, 2026-11-13). This reverses the "Not in this refresh" line above.

- **Open by default, box opt-in:**
  - `.panel` loses its fill and outline;
  - `.card` keeps a hairline outline;
  - dense consoles opt into `.nw-reticle`.
- **Gate:** `docs/design/v3/mockup.html` is a replica of the mockup built with v3 classes. It
  loads `nightwire.css` and the proposal `docs/design/v3/mockup-proposal.css`, and is served next
  to the original on localhost.

### Values and why

| Piece | Value | Why |
|---|---|---|
| `--nw-grain` (knob) | archive 0, operator .07, combat .10 | .07 is the mockup's operator value. It needs its own knob because v3's `--nw-glow` is .5 at both operator and combat, so the mockup's `.07 × glow` would halve it and stay flat at combat. |
| `--nw-chip-line` | `rgba(255,255,255,.18)` | The mockup's chip border was `--nw-line-strong` at v2 (.18). In v3 that token is .36, which doubles the border. |
| `--nw-kanji-glow` | `calc(20px × --nw-glow)`: 0 / 10px / 10px | 10px is the mockup's value at operator. The FR-034 exception: `.nw-section-head-chrome` kanji, plus the `.nw-index-row:hover` kanji at 0.8×. |
| `--nw-bone` | `#d8d2c8` | The mockup's bone halftone tint. No v3 token carries it. |
| Section head on `.panel-header` / `.card-header` | Same markup. The hairline is drawn by `::after`; `data-idx` adds `01 //`; a `.kanji` in the slot is 20px. | FR-026, with one implementation shared with `.nw-section-head`. |
| `.panel` | No fill, no outline, no radius. Header padding `0 0 sp-3`, body `sp-3 0`. | Open layout: content sits flush with the section head, like the mockup. |
| `.card` | Fill removed, hairline kept | The maintainer's choice: a card is an object, a panel is a section. |
| `.kv-row` | Padding `sp-3 × --nw-pad-scale`, top-aligned, right-aligned value | The mockup's spec sheet. It follows density, so archive is airier and combat compact. |
| `.kv-note`, `.nw-index-row .items`, `.nw-reticle-vlabel` | `--nw-text-mute` instead of `--nw-text-disabled` | AA: disabled is 3.04:1 and reserved for disabled states. These read slightly brighter than in the mockup. |
| `.nw-index-row` | Explicit grid columns | At archive the kanji is hidden. In the original mockup the name then falls into the kanji column and the counts drop to a new line; the replica keeps the grid. |
| `.nw-accordion` | Global 2px focus (offset 4px). Animates `<details>` with `--nw-sweep` / `--nw-sweep-out` under `@supports (interpolate-size)`. | The mockup weakened focus to 1px (FR-015). The maintainer asked for accordions that open and close smoothly. |

### Unchanged shared values

The mockup used v2 values for `--nw-line` (.12) and `--nw-text-faint` (.06). v3 has .14 and .08
(US2, approved). This proposal keeps the v3 values, so the hairlines are 2% more opaque.

### Pre-show comparison (T066, headless Chrome 1280 px, full page)

At operator, the mockup's pieces match. Pixel difference, 3% fuzz:
- 0.05% in the top 1000 px;
- 0.3% in the next 1000 px (the brighter `.kv-note`).

Intended differences:
1. `.tag` in the "vs .tag actual" row is neutral, as approved in US2; the mockup shows v2's blue pill.
2. The left `.kv-row` column now has the spec rhythm.
3. The notes and the index `items` lines are brighter (AA).
4. At archive, the index keeps its grid.
5. At combat, `.kv-row` is compact.
6. New section E shows existing components with the open layout.

Measured in the replica:

| Value | archive | operator | combat |
|---|---|---|---|
| Grain | 0 | .07 | .10 |
| Kanji glow | 0 | 10px | 10px |

- At all 3 intensities: `.panel` is transparent with no border, `.card` is transparent with a
  1px .14 border, and the chip border is .18.
- Accordion: the focus ring is 2px; the open animation runs in Chrome.

### Approval (T067)

- **Approver:** Carlos Cativo (maintainer).
- **Date:** 2026-11-19.
- **Reviewed:** the replica next to the original on localhost, and side-by-side renders at the
  three intensities.
- **Outcome:** approved as proposed, including the six intended differences and section E.
- **Note:** everything in the repository is in English. The replica's demo copy was translated
  from the mockup's Spanish before the commit. The `lo quiero` buttons were dropped. The version
  chips read v3.

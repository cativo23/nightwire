# v3 visual direction

Status: pending

The proposed look for the v3 refresh, recorded once so the maintainer can approve or amend it on
the direction board (`npm run design:board`, page `docs/design/v3/board.html`) before it reaches
the other components. The values live in `src/tokens/tokens.json`; this file explains each one.
Until the Approval section below is filled, nothing here is final.

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

## Reference

The ryoku-inspired mockup the maintainer approved on 2026-11-13 informs patterns only: thin
hairlines, restrained glow and quiet header rules. No palette, font, artwork or copy is taken from
it (constitution, principle IV).

## Approval

<!-- Filled at the gate: approver, date, decision (approved, approved with changes, rejected), and
the changes requested. -->

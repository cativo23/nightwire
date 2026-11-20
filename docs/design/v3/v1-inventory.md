# v1 compatibility inventory

Status: decided (2026-11-18)

v2 kept the v1 spellings working next to the v2 ones. v3 is a major, so this inventory lists every
v1 compatibility surface found in `src/`, whether cativo.dev still depends on it, and what was
decided. Requirement: FR-016 and FR-016a; research R10. Locations are `file:line` at `024bb48`, the
commit before the removals. The rows marked remove are copied into the migration guide (T055).

cativo.dev evidence is from `~/projects/personal/portfolio/src`.

## Surfaces

| Surface | Location | v3 replacement | Used by cativo.dev | Decision |
|---|---|---|---|---|
| `.nw-progress .fill` | `src/components/progress.css:10` (shared rule 10-15) | `.nw-progress-fill` | No | **Remove.** The rule is shared with `.nw-progress-fill`, which stays. `docs/roadmap.md:22,70` and `CHANGELOG.md:139` called `.fill` "kept indefinitely"; research R10 and FR-016 supersede that, and CHANGELOG 2.1.0 already named it "a deprecation candidate for v3". |
| `.modal-backdrop` always-visible rule, and the "v1 markup still works" comment | `src/components/modal.css:3-11`; comment `63-69`; hidden rule `70-75`; `data-open` block `77-91` | one merged `.modal-backdrop` rule (closed by default) plus `.modal-backdrop[data-open="true"]` | No (cativo.dev uses only `aria-modal`) | **Remove as a merge.** The later hidden rule already won the cascade, so the always-visible declarations were dead and rendering does not change. The `.modal-backdrop .modal` transform rules stay. |
| `.led.green`, `.led.blue`, `.led.red`, `.led.yellow` | `src/components/led.css:11-14` | `.led[data-state="ok"]`, `"error"`, `"warn"`; blue becomes the new `.led[data-state="active"]` | **Yes, 11 sites:** `components/home/LatestPosts.vue:7`, `home/Hero.vue:28`, `main/Header.vue:30,83`, `pages/about.vue:32`, `pages/admin/index.vue:25`, `home/ProofOfWork.vue:68`, `main/Footer.vue:21,105-109`, `chat/Widget.vue:71,93`, `ui/StatusIndicator.vue:7,31-35` (used by `ui/HealthBadge.vue:5` and `pages/health.vue:31,50`). cativo.dev uses no `data-state`. It defines its own `.led.blink` (`assets/css/main.css:166`). | **Remove.** v2 had no blue state, so `data-state="active"` is added (below). The migration is not pixel-identical: the v1 glow was `4px * --nw-glow`, the v2 state glow is `8px * --nw-led-glow`. |
| `.tag-warning` | `src/components/tag.css:20` | `.tag-warn` | No (cativo.dev uses `.tag-info`, which stays) | **Remove.** True duplicate: `--nw-warning` and `--nw-signal-warn` both resolve to `--nw-yellow`, and the background is the same literal. |
| `.stack` | `src/utilities/layout.css:6` | `.nw-stack` | Not as the Nightwire class. `pages/cv.vue:96,113,127` use `class="stack"` styled by cv.vue's own scoped rule (`:339-344`); Nightwire's global `.stack` also matched them incidentally (it adds flex to a one-child `<p>`). | **Remove.** Equivalent to `.nw-stack` at default density; `.nw-stack` also honours `--nw-density`. |
| `.modal-header` | `src/components/modal.css:24-35` | none: `.modal-title` is not equivalent (the header is a flex container with padding and a border; the title is a stamp-font label) | No | **Keep.** It is used nested with `.modal-title`, and `:where(.modal-header .kanji)` depends on it. |
| DESIGN.md "v2-alpha" section and "Backward compatibility contract" | `DESIGN.md:628` (`## v2-alpha`), `DESIGN.md:840` (`### Backward compatibility contract`) | rewritten for v3 | n/a | **Rewrite in T048**, which owns DESIGN.md. Not part of this task. |

## New state: `.led[data-state="active"]`

v1 `.led.blue` had no v2 equivalent: the v2 states are `ok`, `warn`, `error`, `info` and `ai`, and
`info` is a different colour (`--nw-signal-info`). So v3 adds `data-state="active"`, drawn with
`--nw-chrome` (#6699ff) and the same glow rule as the other states,
`calc(8px * var(--nw-led-glow))`. cativo.dev's chat widget (`chat/Widget.vue:71,93`) and the
`info` mapping of `StatusIndicator.vue:35` are the two blue consumers.

Mapping for the migration guide:

| v1 | v3 |
|---|---|
| `.led.green` | `.led[data-state="ok"]` |
| `.led.yellow` | `.led[data-state="warn"]` |
| `.led.red` | `.led[data-state="error"]` |
| `.led.blue` | `.led[data-state="active"]` |

## Beyond the provisional list

Found by grepping `src/` for v1 paths with a v2 equivalent, then shown to the maintainer, who
agreed with the recommendation.

| Surface | Location | Decision |
|---|---|---|
| Dropdown and toast open by default when `data-open` is absent (v1 behaviour; the v2 spelling is `data-open="true"`) | `src/components/dropdown.css:19-24`, `src/components/toast.css:9-13` | **Keep.** cativo.dev's toast (`components/base/Toast.vue:69`) renders without `data-open`. |

Not compatibility surfaces, so they stay: `.badge-warning`, `.toast-warning` and `.text-warning`
(no `-warn` twin exists), `.metric-cell` next to `.stat` (different components), `.tab.active`,
`.sidebar-item.active` and `.cmdk-item.active`, `.tag-info`, `.tag-success` and `.tag-danger`, and
`.grid-2`, `.grid-3` and `.grid-4`.

`.btn-chrome` was checked for de-duplication with `.btn` and needs none: it is only used as a
modifier next to `.btn` (`examples/html/workshop.html`), and since direction round 2 it declares
only colours that differ from `.btn`'s, so no declaration is shared.

## Decisions

Maintainer decisions, 2026-11-18: the removals marked remove above are approved (spec FR-016,
research R10), the blue LED state is `data-state="active"`, and AGENTS.md's "do not remove
published classes" is superseded for these surfaces by FR-016 in this major.

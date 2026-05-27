# Nightwire Roadmap — Post-2.0.0

Derived from [SUGGESTIONS.md](./SUGGESTIONS.md). Sequenced by semver impact, not by raw priority.

## Versioning rules

Nightwire is on stable semver as of 2.0.0 (API frozen). These rules decide which release a change lands in:

- **Patch (`2.0.x`)** — bug fixes + docs. Operator-mode (default) rendered output must be **byte-for-byte unchanged**. Changes may only affect non-default intensity modes (archive/combat) or add docs.
- **Minor (`2.x.0`)** — new **additive** classes, components, or tokens. Nothing renamed, nothing removed, no change to existing rendered output in any mode.
- **Major (`3.0.0`)** — renames, removals, or any change to *default* rendered output. Requires a migration guide.

---

## ✅ 2.0.1 — Intensity consistency (shipped this cycle)

Both verified in-browser; operator output unchanged.

| # | Change | Notes |
|---|--------|-------|
| 1 | v1 `.led.color` LEDs now glow-aware (`calc(4px * --nw-glow)`) | operator 4px · combat 8.8px · archive 0px |
| 3 | `.nw-progress-fill` alias added alongside `.nw-progress .fill` | additive; `.fill` deprecated for v3 |

---

## 2.0.2 — Docs & a11y patches (next, low-risk)

No CSS behavior change — documentation and example hardening only.

| # | Change | Why now |
|---|--------|---------|
| 2 | Document the `.panel-header` left-group pattern (`<span>` wrapper for LED+title) | Every panel needs it; currently learn-by-breaking. Cheap, high-friction-removal. |
| 12 | Add `aria-hidden="true"` to all `.kanji` decorators in examples + DESIGN.md | Screen readers announce decorative kanji as Japanese inside English UIs. |

**Bonus (same patch):** convert the SYNAPSE demo's local `.dot` helpers to the real `.led` class so the showcase dogfoods the component it's meant to prove.

---

## 2.1.0 — Ops-center primitives (additive minor)

The patterns every dashboard rebuilds by hand. Highest consumer value.

| # | Change | Impact |
|---|--------|--------|
| 6 | `.nw-log` / `.nw-log-item` event-stream component (`data-level` → existing color semantics) | Very High |
| 7 | `.nw-ticker` / `.nw-ticker-tape` scrolling tape (ship the seamless-loop CSS) | High |
| 5 | Per-component glow tokens: `--nw-glow-primary / -data / -signal` | Medium |
| 9 | `.stat-value` density-aware via `* var(--nw-pad-scale)` (only affects archive/combat) | Low |
| 10 | `.compressed-title.flat` opt-out modifier (default stays scaled — additive) | Medium |
| 11 | Sparkline reference + JS/web-component helper for `.stat-spark` | High |

> #6 and #7 are both extracted directly from the SYNAPSE demo, where they were hand-rolled. Lift the demo's CSS into the library.

---

## 2.2.0 — Light mode (additive minor, large)

| # | Change | Impact |
|---|--------|--------|
| 4 | `[data-intensity="chalk"]` light variant — invert surfaces, dim neons ~30%, reuse all component classes | Very High |

Gets its own release: needs a full QA pass across every component, plus contrast re-validation on light backgrounds. No new classes — just a new intensity block, so it stays minor.

---

## 3.0.0 — Not planned (and probably never needed)

**Why this section is empty.** Nightwire's defining contract is *additive*: every v2 feature ships alongside v1 with nothing renamed or removed (see the 2.0.0 API freeze). A major version exists only to **break** things — and almost nothing here needs breaking:

- **`.fill` vs `.nw-progress-fill`** — both work; the alias costs one extra selector. Keeping both forever is cheaper than forcing a migration on every consumer.
- **`.led.color` vs `.led[data-state]`** — same story. Two APIs, near-zero maintenance, nobody forced to move.
- **`.compressed-title` scale** — the alignment fix lands additively in 2.1.0 as a `.flat` opt-out; the default is untouched, so there's no break to schedule.

A 3.0.0 only becomes justified if one of these turns true:
1. Bundle size becomes a *measured* problem (unlikely for one hand-tuned CSS file).
2. The dual APIs cause real, documentation-resistant confusion.
3. A color-model / token change is needed that genuinely can't be expressed additively.

Until then, deprecated selectors stay put and the system keeps its promise: **upgrade by bumping the version, nothing breaks.**

---

## Consumer impact check

Production consumers must keep working at every step:
- **cativo.dev** (raw CSS classes) — unaffected through 2.x; only 3.0.0 requires migration.
- **blog.cativo.dev** (Tailwind preset) — token-only consumer; component renames in 3.0.0 don't touch it. New tokens (#5, chalk) are additive.

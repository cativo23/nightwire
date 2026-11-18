# 001. Semantic LED states should align with the `.led.color` API

- **Status:** Done (2.0.1)
- **Effort:** Low · **Impact:** Medium
- **Source:** observations from building the SYNAPSE ops-center demo (`examples/html/synapse-ops.html`)

**Problem:** Two parallel LED APIs exist with overlapping but incompatible semantics:
- `class="led green"` — v1, sets color via class
- `data-state="ok"` — v2, sets color via attribute + applies `--nw-glow`

The v2 `data-state` LEDs were glow-aware (respect `--nw-glow`) but the v1 class LEDs were not — a fixed `0 0 4px`. In **combat** mode v1 LEDs looked flat; in **archive** mode they still glowed when everything else was supposed to be dark.

**Resolved:** v1 LEDs now use `box-shadow: 0 0 calc(4px * var(--nw-glow)) <color>`. Operator (glow=1) is unchanged at 4px — fully backward compatible. Archive (glow=0) goes flat like the rest of the system; combat (glow=2.2) amplifies. The `.nw-progress` fill shadow was made glow-aware in the same pass for consistency.

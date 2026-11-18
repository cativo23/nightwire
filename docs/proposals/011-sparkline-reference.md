# 011. Add SVG/sparkline tokens for data visualization

- **Status:** Open
- **Effort:** Medium · **Impact:** High
- **Source:** observations from building the SYNAPSE ops-center demo (`examples/html/synapse-ops.html`)

**Problem:** The `.stat-spark` component exists but provides no guidance on how to build the actual SVG waveform. Teams have to write arbitrary SVG from scratch every time.

**Suggestion:** Document a micro reference for the sparkline pattern used with `.stat-spark path` + `.stat-spark .area`. Include a JS snippet (or a web component) that takes an array of values and renders the SVG path. This is a two-hour task that saves every consumer several hours.

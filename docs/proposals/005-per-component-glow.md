# 005. `--nw-glow-color` token per component

- **Status:** Open
- **Effort:** Medium · **Impact:** Medium
- **Source:** observations from building the SYNAPSE ops-center demo (`examples/html/synapse-ops.html`)

**Problem:** The global `--nw-glow` intensity knob adjusts ALL glow uniformly. There's no way to say "this panel's LED should glow strongly but the chart lines should glow subtly."

**Suggestion:** Add a companion token:

```css
--nw-glow-primary: calc(var(--nw-glow) * 1);   /* default */
--nw-glow-data:    calc(var(--nw-glow) * 0.7);  /* softer for data */
--nw-glow-signal:  calc(var(--nw-glow) * 1.4);  /* stronger for alerts */
```

Components would use their specific multiplier. Users can override per-component without blowing up the entire intensity system.

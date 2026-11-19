# 005. `--nw-glow-color` token per component

- **Status:** Done (v3)
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

**Resolved:** v3 ships per-component state-glow knobs, named by what they drive instead of the
suggested `-primary`, `-data` and `-signal`: `--nw-led-glow` (the LED), `--nw-control-glow` (check,
radio, switch, segmented, steps) and `--nw-progress-glow` (the progress fill). Each is an alias of
`--nw-glow`, so an override of `--nw-glow` still reaches all of them, and each can be overridden on
its own. Combat sets each to `calc(var(--nw-glow) * 2)`, so only state signals glow brighter there.
Decorative glow was removed rather than given a knob. See
[docs/architecture/intensity.md](../architecture/intensity.md) and
[docs/design/v3/direction.md](../design/v3/direction.md).

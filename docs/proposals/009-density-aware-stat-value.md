# 009. `.stat` component needs `.stat-value` size token

- **Status:** Open
- **Effort:** Low · **Impact:** Low
- **Source:** observations from building the SYNAPSE ops-center demo (`examples/html/synapse-ops.html`)

**Problem:** `.stat .stat-value` has a fixed `font-size: var(--text-xl)`. In combat mode (dense layout), this is too large. In archive mode (relaxed layout), it could be larger.

**Suggestion:** Make it density-aware:

```css
.stat .stat-value {
  font-size: calc(var(--text-xl) * var(--nw-pad-scale, 1));
}
```

Since `--nw-pad-scale` is 0.7 in combat and 1.35 in archive, the stat value would scale naturally with the intensity.

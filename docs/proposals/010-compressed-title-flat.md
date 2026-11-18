# 010. `.compressed-title` transform should be opt-in, not automatic

- **Status:** Open
- **Effort:** Low · **Impact:** Medium
- **Source:** observations from building the SYNAPSE ops-center demo (`examples/html/synapse-ops.html`)

**Problem:** `.compressed-title` applies `transform: scaleX(0.82)` unconditionally. When used inside a flex container (panel header, nav bar), the surrounding elements don't account for the visual narrowing, causing subtle alignment issues.

**Suggestion (additive — keeps default):** The scale is beautiful on hero text but awkward in tight flex containers. Rather than making scale opt-*in* (which would change default rendering and force a major bump), add an opt-*out* modifier:

```css
.compressed-title.flat { transform: none; }
```

The default stays scaled (no break for existing hero usage); tight containers add `.flat`. Ships in a minor.

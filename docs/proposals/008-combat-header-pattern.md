# 008. ~~`[data-intensity="combat"]` needs a header pattern~~ — WITHDRAWN (already implemented)

- **Status:** Withdrawn (already shipped)
- **Effort:** — · **Impact:** —
- **Source:** observations from building the SYNAPSE ops-center demo (`examples/html/synapse-ops.html`)

**Correction:** This suggestion was based on a faulty reading of the CSS. Combat mode **already** sets a header pattern (then `nightwire.css:192`; now the `knob.header-pattern` combat override in `src/tokens/tokens.json`):

```css
:root[data-intensity="combat"] {
  --nw-header-pattern: repeating-linear-gradient(0deg, rgba(102, 153, 255, 0.05) 0 1px, transparent 1px 3px);
}
```

A horizontal scanline tint is layered into `.panel-header` via `background-image`. No change needed. *(Possible refinement: the current pattern is subtle at small panel-header heights — a slightly higher alpha or a diagonal variant could read more clearly, but this is taste, not a gap.)*

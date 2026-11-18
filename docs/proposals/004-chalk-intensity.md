# 004. Light/chalk intensity variant

- **Status:** Open
- **Effort:** High · **Impact:** Very High
- **Source:** observations from building the SYNAPSE ops-center demo (`examples/html/synapse-ops.html`)

**Problem:** The system is hard-coded dark-only. Teams building docs sites, marketing pages, or light-themed admin panels need an alternative, but adopting Nightwire today means committing to black backgrounds.

**Suggestion:** Add a `[data-intensity="chalk"]` variant that:
- Inverts surfaces: `--void: #f8f8f5`, `--void-warm: #f0f0ec`, `--void-panel: #e8e8e3`
- Dims all neon colors by 30% toward dark versions for visibility on light backgrounds
- Preserves all component structure (no new classes needed)

This would let a single design system span a product's dark console **and** its public-facing docs/marketing site.

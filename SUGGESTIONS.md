# Nightwire Design System — Improvement Suggestions

Observations made while building the SYNAPSE ops-center demo. Ordered by impact.

---

## 1. Semantic LED states should align with the `.led.color` API ✅ DONE

**Problem:** Two parallel LED APIs exist with overlapping but incompatible semantics:
- `class="led green"` — v1, sets color via class
- `data-state="ok"` — v2, sets color via attribute + applies `--nw-glow`

The v2 `data-state` LEDs were glow-aware (respect `--nw-glow`) but the v1 class LEDs were not — a fixed `0 0 4px`. In **combat** mode v1 LEDs looked flat; in **archive** mode they still glowed when everything else was supposed to be dark.

**Resolved:** v1 LEDs now use `box-shadow: 0 0 calc(4px * var(--nw-glow)) <color>`. Operator (glow=1) is unchanged at 4px — fully backward compatible. Archive (glow=0) goes flat like the rest of the system; combat (glow=2.2) amplifies. The `.nw-progress` fill shadow was made glow-aware in the same pass for consistency.

---

## 2. Add `.panel-header` flex alignment helper

**Problem:** `.panel-header` uses `justify-content: space-between`, which means any multi-item left side requires an extra wrapper `<span>`. Every panel header in the demo needed one.

**Suggestion:** Document (or add a utility class `.ph-start`) that groups left-side header content, so users don't have to figure out the wrapper pattern themselves. Example:

```html
<!-- Recommended pattern (document this) -->
<div class="panel-header">
  <span class="ph-start">
    <span class="led" data-state="error"></span>
    Panel Title
  </span>
  <span class="kanji">日本語</span>
</div>
```

---

## 3. `.nw-progress` child class should be namespaced, not `.fill` ✅ DONE

**Problem:** The progress bar uses `<div class="nw-progress"><div class="fill">`. The child class `.fill` is too generic and collides with utility classes in frameworks like Bootstrap/Tailwind if used alongside them. It's also unguessable from the parent name.

**Resolved (additively, not a rename):** `.nw-progress-fill` is now a first-class selector alongside the existing `.nw-progress .fill`. New code can use the namespaced class; existing consumers using `.fill` keep working unchanged. A future major can deprecate `.fill` once consumers migrate.

---

## 4. Light/chalk intensity variant

**Problem:** The system is hard-coded dark-only. Teams building docs sites, marketing pages, or light-themed admin panels need an alternative, but adopting Nightwire today means committing to black backgrounds.

**Suggestion:** Add a `[data-intensity="chalk"]` variant that:
- Inverts surfaces: `--void: #f8f8f5`, `--void-warm: #f0f0ec`, `--void-panel: #e8e8e3`
- Dims all neon colors by 30% toward dark versions for visibility on light backgrounds
- Preserves all component structure (no new classes needed)

This would let a single design system span a product's dark console **and** its public-facing docs/marketing site.

---

## 5. `--nw-glow-color` token per component

**Problem:** The global `--nw-glow` intensity knob adjusts ALL glow uniformly. There's no way to say "this panel's LED should glow strongly but the chart lines should glow subtly."

**Suggestion:** Add a companion token:

```css
--nw-glow-primary: calc(var(--nw-glow) * 1);   /* default */
--nw-glow-data:    calc(var(--nw-glow) * 0.7);  /* softer for data */
--nw-glow-signal:  calc(var(--nw-glow) * 1.4);  /* stronger for alerts */
```

Components would use their specific multiplier. Users can override per-component without blowing up the entire intensity system.

---

## 6. Missing component: Timeline / Event log

**Problem:** The event stream pattern (timestamp + dot + text) appears in virtually every Nightwire ops-center use case, but there's no official component for it.

**Suggestion:** Add `.nw-log` / `.nw-log-item` as a v2 component:

```html
<div class="nw-log">
  <div class="nw-log-item" data-level="error">
    <span class="nw-log-time">14:22:07</span>
    <span class="nw-log-dot"></span>
    <span class="nw-log-text"><b>INC-4471</b> — DDoS surge detected</span>
  </div>
</div>
```

`data-level` maps to the existing color semantic (ok/warn/error/info/ai). The dot is a mini LED. This is a fundamental ops-center primitive.

---

## 7. Missing component: Scrolling ticker

**Problem:** The horizontal scrolling news-ticker is another pervasive pattern in ops dashboards. Every project reinvents it.

**Suggestion:** Add `.nw-ticker` / `.nw-ticker-tape` as an official layout primitive:

```html
<div class="nw-ticker">
  <span class="nw-ticker-label">LIVE</span>
  <div class="nw-ticker-tape">
    <!-- items duplicated for seamless loop -->
  </div>
</div>
```

Include the CSS animation in `nightwire.css` and document the "duplicate items for seamless loop" pattern.

---

## 8. ~~`[data-intensity="combat"]` needs a header pattern~~ — WITHDRAWN (already implemented)

**Correction:** This suggestion was based on a faulty reading of the CSS. Combat mode **already** sets a header pattern at `nightwire.css:192`:

```css
:root[data-intensity="combat"] {
  --nw-header-pattern: repeating-linear-gradient(0deg, rgba(102, 153, 255, 0.05) 0 1px, transparent 1px 3px);
}
```

A horizontal scanline tint is layered into `.panel-header` via `background-image`. No change needed. *(Possible refinement: the current pattern is subtle at small panel-header heights — a slightly higher alpha or a diagonal variant could read more clearly, but this is taste, not a gap.)*

---

## 9. `.stat` component needs `.stat-value` size token

**Problem:** `.stat .stat-value` has a fixed `font-size: var(--text-xl)`. In combat mode (dense layout), this is too large. In archive mode (relaxed layout), it could be larger.

**Suggestion:** Make it density-aware:

```css
.stat .stat-value {
  font-size: calc(var(--text-xl) * var(--nw-pad-scale, 1));
}
```

Since `--nw-pad-scale` is 0.7 in combat and 1.35 in archive, the stat value would scale naturally with the intensity.

---

## 10. `.compressed-title` transform should be opt-in, not automatic

**Problem:** `.compressed-title` applies `transform: scaleX(0.82)` unconditionally. When used inside a flex container (panel header, nav bar), the surrounding elements don't account for the visual narrowing, causing subtle alignment issues.

**Suggestion (additive — keeps default):** The scale is beautiful on hero text but awkward in tight flex containers. Rather than making scale opt-*in* (which would change default rendering and force a major bump), add an opt-*out* modifier:

```css
.compressed-title.flat { transform: none; }
```

The default stays scaled (no break for existing hero usage); tight containers add `.flat`. Ships in a minor.

---

## 11. Add SVG/sparkline tokens for data visualization

**Problem:** The `.stat-spark` component exists but provides no guidance on how to build the actual SVG waveform. Teams have to write arbitrary SVG from scratch every time.

**Suggestion:** Document a micro reference for the sparkline pattern used with `.stat-spark path` + `.stat-spark .area`. Include a JS snippet (or a web component) that takes an array of values and renders the SVG path. This is a two-hour task that saves every consumer several hours.

---

## 12. Kanji accessibility

**Problem:** Kanji decorators (`<span class="kanji">日本語</span>`) are visually decorative but screen readers will announce them as Japanese text, which is confusing in English interfaces.

**Suggestion:** Add `aria-hidden="true"` to the `.kanji` utility class via CSS `content` (not possible) or document that all kanji spans should include it:

```html
<!-- Correct usage -->
<span class="kanji" aria-hidden="true">脅威</span>
```

Update DESIGN.md and component examples to always include `aria-hidden="true"` on kanji elements.

---

## Summary table

| # | Suggestion | Effort | Impact | Status |
|---|---|---|---|---|
| 1 | Unify LED glow behavior across v1/v2 | Low | Medium | ✅ Done |
| 2 | Document `.panel-header` left-group pattern | Low | High | Open |
| 3 | Namespace `.fill` → `.nw-progress-fill` (alias) | Low | High | ✅ Done |
| 4 | Add `chalk` intensity variant (light mode) | High | Very High | Open |
| 5 | Per-component glow multiplier tokens | Medium | Medium | Open |
| 6 | Add `.nw-log` event stream component | Medium | Very High | Open |
| 7 | Add `.nw-ticker` scrolling tape component | Low | High | Open |
| 8 | ~~Implement combat header pattern~~ | — | — | Withdrawn (already shipped) |
| 9 | Make `.stat-value` density-aware | Low | Low | Open |
| 10 | Make `.compressed-title` scale opt-in | Low | Medium | Open |
| 11 | Sparkline building reference + helper | Medium | High | Open |
| 12 | Kanji `aria-hidden` documentation | Low | Medium | Open |

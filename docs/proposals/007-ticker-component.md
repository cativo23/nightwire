# 007. Missing component: Scrolling ticker

- **Status:** Open
- **Effort:** Low · **Impact:** High
- **Source:** observations from building the SYNAPSE ops-center demo (`examples/html/synapse-ops.html`)

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

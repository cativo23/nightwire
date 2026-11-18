# 002. Add `.panel-header` flex alignment helper

- **Status:** Open
- **Effort:** Low · **Impact:** High
- **Source:** observations from building the SYNAPSE ops-center demo (`examples/html/synapse-ops.html`)

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

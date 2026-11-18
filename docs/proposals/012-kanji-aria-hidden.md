# 012. Kanji accessibility

- **Status:** Open
- **Effort:** Low · **Impact:** Medium
- **Source:** observations from building the SYNAPSE ops-center demo (`examples/html/synapse-ops.html`)

**Problem:** Kanji decorators (`<span class="kanji">日本語</span>`) are visually decorative but screen readers will announce them as Japanese text, which is confusing in English interfaces.

**Suggestion:** Add `aria-hidden="true"` to the `.kanji` utility class via CSS `content` (not possible) or document that all kanji spans should include it:

```html
<!-- Correct usage -->
<span class="kanji" aria-hidden="true">脅威</span>
```

Update DESIGN.md and component examples to always include `aria-hidden="true"` on kanji elements.

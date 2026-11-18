# 006. Missing component: Timeline / Event log

- **Status:** Open
- **Effort:** Medium · **Impact:** Very High
- **Source:** observations from building the SYNAPSE ops-center demo (`examples/html/synapse-ops.html`)

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

# 003. `.nw-progress` child class should be namespaced, not `.fill`

- **Status:** Done (2.0.1)
- **Effort:** Low · **Impact:** High
- **Source:** observations from building the SYNAPSE ops-center demo (`examples/html/synapse-ops.html`)

**Problem:** The progress bar uses `<div class="nw-progress"><div class="fill">`. The child class `.fill` is too generic and collides with utility classes in frameworks like Bootstrap/Tailwind if used alongside them. It's also unguessable from the parent name.

**Resolved (additively, not a rename):** `.nw-progress-fill` is now a first-class selector alongside the existing `.nw-progress .fill`. New code can use the namespaced class; existing consumers using `.fill` keep working unchanged. A future major can deprecate `.fill` once consumers migrate.

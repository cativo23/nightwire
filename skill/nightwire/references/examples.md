# Nightwire HTML Examples

This file contains complete HTML examples for all Nightwire components and patterns.

---

## Panel with Table

```html
<div class="panel">
  <div class="panel-header">
    <span>SERVER STATUS</span>
    <span class="tag">サーバー状態</span>
  </div>
  <table class="nw-table">
    <thead>
      <tr><th>Host</th><th>CPU</th><th>Memory</th><th>Status</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>node-01</td>
        <td>42%</td>
        <td>68%</td>
        <td><span class="led green"></span> OK</td>
      </tr>
      <tr>
        <td>node-02</td>
        <td>87%</td>
        <td>91%</td>
        <td><span class="led yellow"></span> Degraded</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Sidebar Layout

```html
<div style="display:flex; height:100vh">
  <nav class="sidebar">
    <div class="sidebar-header">NIGHTWIRE</div>
    <div class="sidebar-section">Navigation</div>
    <a class="sidebar-item active" href="#">Dashboard</a>
    <a class="sidebar-item" href="#">Settings</a>
    <a class="sidebar-item" href="#">Analytics</a>
    <div class="sidebar-section">System</div>
    <a class="sidebar-item" href="#">Logs</a>
    <a class="sidebar-item" href="#">Monitoring</a>
  </nav>
  <main style="flex:1; padding:var(--sp-6); background:var(--void); overflow-y:auto">
    <!-- content -->
  </main>
</div>
```

---

## Node Card

```html
<div class="panel">
  <div class="panel-header"><span>NODE ALPHA</span><span class="tag">ノード</span></div>
  <div style="padding:8px 10px">
    <div style="font-family:var(--font-title);font-size:12px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:var(--nw-cyan);transform:scaleX(0.82);transform-origin:left">Cluster-Alpha — H100 x 512</div>
    <div style="font-family:var(--font-mincho);font-size:13px;font-weight:800;color:var(--nw-text);transform:scaleX(0.78);transform-origin:left;margin:2px 0 6px">深層学習訓練クラスタ</div>
    <div style="display:flex;justify-content:space-between;font-size:9px;padding:2px 0;border-bottom:1px solid var(--nw-text-faint)">
      <span style="color:var(--nw-primary-dim);text-transform:uppercase;font-size:8px">STATUS</span>
      <span style="color:var(--nw-green);font-weight:500">Training</span>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:9px;padding:2px 0;border-bottom:1px solid var(--nw-text-faint)">
      <span style="color:var(--nw-primary-dim);text-transform:uppercase;font-size:8px">GPU UTIL</span>
      <span style="color:var(--nw-green);font-weight:500">96.8%</span>
    </div>
    <div style="margin-top:4px;font-family:var(--font-stamp);font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--nw-green)">
      <span class="led green"></span> Operational
    </div>
  </div>
</div>
```

---

## Metrics Grid

```html
<div class="panel">
  <div class="panel-header">
    <span>SYSTEM METRICS</span>
    <span class="tag">指標一覧</span>
  </div>
  <div class="metrics-grid">
    <div class="metric-cell">
      <div class="m-label">SYNC RATIO</div>
      <div class="m-value">48.2%</div>
      <div class="m-sub">Unit-01</div>
    </div>
    <div class="metric-cell highlight">
      <div class="m-label">BUFFER</div>
      <div class="m-value">93.0%</div>
      <div class="m-sub">Nominal</div>
    </div>
    <div class="metric-cell">
      <div class="m-label">RESPONSE</div>
      <div class="m-value">12.4ms</div>
      <div class="m-sub">p99 latency</div>
    </div>
    <div class="metric-cell">
      <div class="m-label">THROUGHPUT</div>
      <div class="m-value" style="color:var(--nw-cyan)">847K</div>
      <div class="m-sub">tokens/sec</div>
    </div>
  </div>
</div>
```

---

## Event Log

```html
<div style="background:var(--void-warm);border:1px solid var(--nw-text-faint);display:flex;flex-direction:column;height:400px;">
  <div style="font-size:8px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--nw-primary);padding:6px 10px 5px;border-bottom:1px solid var(--nw-primary-dim);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
    <span>EVENT LOG</span>
    <span style="font-size:7px;color:var(--nw-green)">42 entries</span>
  </div>
  <div style="flex:1;overflow-y:auto;font-size:9px;line-height:1.5;padding:2px 0;">
    <div style="padding:1px 10px;display:flex;gap:6px;font-variant-numeric:tabular-nums;">
      <span style="color:var(--nw-text-dim);min-width:52px">14:32:07</span>
      <span style="color:var(--nw-green);min-width:62px;font-weight:700">system</span>
      <span style="color:var(--nw-text);flex:1">Component tree reconciled</span>
      <span style="color:var(--nw-green);min-width:75px;text-align:right">12.4ms</span>
    </div>
    <div style="padding:1px 10px;display:flex;gap:6px;font-variant-numeric:tabular-nums;">
      <span style="color:var(--nw-text-dim);min-width:52px">14:32:06</span>
      <span style="color:var(--nw-cyan);min-width:62px;font-weight:700">network</span>
      <span style="color:var(--nw-text);flex:1">WebSocket connection established</span>
      <span style="color:var(--nw-green);min-width:75px;text-align:right">OK</span>
    </div>
    <div style="padding:1px 10px;display:flex;gap:6px;font-variant-numeric:tabular-nums;">
      <span style="color:var(--nw-text-dim);min-width:52px">14:32:05</span>
      <span style="color:var(--nw-red);min-width:62px;font-weight:700">error</span>
      <span style="color:var(--nw-text);flex:1">Failed to fetch resource</span>
      <span style="color:var(--nw-red);min-width:75px;text-align:right">404</span>
    </div>
  </div>
</div>
```

---

## Form Components

### Text Input

```html
<div style="margin-bottom:16px">
  <label style="display:block; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-primary); margin-bottom:6px">
    EMAIL ADDRESS
  </label>
  <input type="email" placeholder="user@example.com"
    style="width:100%; padding:8px 12px; background:var(--void-panel); border:1px solid var(--nw-text-line); color:var(--nw-text); font-family:var(--font-sys); font-size:14px">
</div>
```

### Textarea

```html
<div style="margin-bottom:16px">
  <label style="display:block; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-primary); margin-bottom:6px">
    MESSAGE
  </label>
  <textarea rows="4" placeholder="Your message..."
    style="width:100%; padding:8px 12px; background:var(--void-panel); border:1px solid var(--nw-text-line); color:var(--nw-text); font-family:var(--font-sys); font-size:14px; resize:vertical"></textarea>
</div>
```

### Select

```html
<div style="margin-bottom:16px">
  <label style="display:block; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-primary); margin-bottom:6px">
    CATEGORY
  </label>
  <select style="width:100%; padding:8px 12px; background:var(--void-panel); border:1px solid var(--nw-text-line); color:var(--nw-text); font-family:var(--font-sys); font-size:14px">
    <option>Select option</option>
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </select>
</div>
```

### Checkbox

```html
<label style="display:flex; align-items:center; gap:8px; cursor:pointer; margin-bottom:12px">
  <input type="checkbox" style="width:16px; height:16px; accent-color:var(--nw-primary)">
  <span style="font-size:13px; color:var(--nw-text-dim)">I agree to the terms and conditions</span>
</label>
```

### Radio Buttons

```html
<div style="margin-bottom:16px">
  <label style="display:block; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-primary); margin-bottom:8px">
    DEPLOYMENT TARGET
  </label>
  <label style="display:flex; align-items:center; gap:8px; cursor:pointer; margin-bottom:8px">
    <input type="radio" name="target" value="production" style="accent-color:var(--nw-primary)">
    <span style="font-size:13px; color:var(--nw-text-dim)">Production</span>
  </label>
  <label style="display:flex; align-items:center; gap:8px; cursor:pointer; margin-bottom:8px">
    <input type="radio" name="target" value="staging" style="accent-color:var(--nw-primary)">
    <span style="font-size:13px; color:var(--nw-text-dim)">Staging</span>
  </label>
</div>
```

---

## Form Validation States

### Error State

```html
<div style="margin-bottom:16px">
  <label style="display:block; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-red); margin-bottom:6px">
    EMAIL ADDRESS
  </label>
  <input type="email" value="invalid-email"
    style="width:100%; padding:8px 12px; background:var(--void-panel); border:1px solid var(--nw-red); color:var(--nw-text); font-family:var(--font-sys); font-size:14px">
  <div style="font-size:11px; color:var(--nw-red); margin-top:4px; letter-spacing:0.04em">
    Invalid email address format.
  </div>
</div>
```

### Success State

```html
<div style="margin-bottom:16px">
  <label style="display:block; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-green); margin-bottom:6px">
    USERNAME
  </label>
  <input type="text" value="cativo23"
    style="width:100%; padding:8px 12px; background:var(--void-panel); border:1px solid var(--nw-green); color:var(--nw-text); font-family:var(--font-sys); font-size:14px">
  <div style="font-size:11px; color:var(--nw-green); margin-top:4px; letter-spacing:0.04em">
    Username available.
  </div>
</div>
```

### Disabled State

```html
<input type="text" disabled value="Read only"
  style="width:100%; padding:8px 12px; background:var(--void-panel); border:1px solid var(--nw-text-faint); color:var(--nw-text-dim); font-family:var(--font-sys); font-size:14px; opacity:0.4; cursor:not-allowed">
```

---

## Complete Form Example

```html
<div class="panel" style="max-width:480px">
  <div class="panel-header">
    <span>CONTACT FORM</span>
    <span class="tag">連絡先</span>
  </div>
  <div class="panel-body">
    <form>
      <div style="margin-bottom:16px">
        <label style="display:block; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-primary); margin-bottom:6px">
          NAME
        </label>
        <input type="text" placeholder="Your name"
          style="width:100%; padding:8px 12px; background:var(--void-panel); border:1px solid var(--nw-text-line); color:var(--nw-text); font-family:var(--font-sys); font-size:14px">
      </div>

      <div style="margin-bottom:16px">
        <label style="display:block; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-primary); margin-bottom:6px">
          EMAIL
        </label>
        <input type="email" placeholder="your@email.com"
          style="width:100%; padding:8px 12px; background:var(--void-panel); border:1px solid var(--nw-text-line); color:var(--nw-text); font-family:var(--font-sys); font-size:14px">
      </div>

      <div style="margin-bottom:16px">
        <label style="display:block; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-primary); margin-bottom:6px">
          MESSAGE
        </label>
        <textarea rows="4" placeholder="Your message..."
          style="width:100%; padding:8px 12px; background:var(--void-panel); border:1px solid var(--nw-text-line); color:var(--nw-text); font-family:var(--font-sys); font-size:14px; resize:vertical"></textarea>
      </div>

      <label style="display:flex; align-items:center; gap:8px; cursor:pointer; margin-bottom:16px">
        <input type="checkbox" style="width:16px; height:16px; accent-color:var(--nw-primary)">
        <span style="font-size:13px; color:var(--nw-text-dim)">Send me updates</span>
      </label>

      <button class="btn" type="submit">Send Message</button>
    </form>
  </div>
</div>
```

---

## Data Display Patterns

### Key-Value Rows

```html
<div class="panel">
  <div class="panel-header">
    <span>SYSTEM INFO</span>
    <span class="tag">情報</span>
  </div>
  <div style="padding:8px 10px">
    <div class="kv-row">
      <span class="kv-label">VERSION</span>
      <span class="kv-value">1.2.4</span>
    </div>
    <div class="kv-row">
      <span class="kv-label">UPTIME</span>
      <span class="kv-value">99.9%</span>
    </div>
    <div class="kv-row">
      <span class="kv-label">NODES</span>
      <span class="kv-value">42</span>
    </div>
  </div>
</div>
```

### Progress Bar

```html
<div style="margin-bottom:12px">
  <div style="display:flex; justify-content:space-between; margin-bottom:4px">
    <span style="font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-primary)">UPLOAD PROGRESS</span>
    <span style="font-size:10px; color:var(--nw-green); font-weight:700">68%</span>
  </div>
  <div class="nw-progress">
    <div class="fill" style="width:68%"></div>
  </div>
</div>
```

### Status Badges

```html
<div style="display:flex; gap:8px; flex-wrap:wrap">
  <span class="badge">Default</span>
  <span class="badge-success">Success</span>
  <span class="badge-danger">Error</span>
  <span class="badge-warning">Warning</span>
</div>
```

### Tags

```html
<div style="display:flex; gap:6px; flex-wrap:wrap">
  <span class="tag">Default</span>
  <span class="tag-success">Active</span>
  <span class="tag-danger">Offline</span>
  <span class="tag-warning">Pending</span>
  <span class="tag-info">Beta</span>
</div>
```

---

## Toast Notifications

```html
<!-- Success Toast -->
<div class="toast toast-success">
  <div style="font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-green); margin-bottom:4px">SUCCESS</div>
  <div style="font-size:13px; color:var(--nw-text-dim)">Operation completed successfully.</div>
</div>

<!-- Error Toast -->
<div class="toast toast-danger">
  <div style="font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-red); margin-bottom:4px">ERROR</div>
  <div style="font-size:13px; color:var(--nw-text-dim)">Failed to connect to server.</div>
</div>

<!-- Info Toast -->
<div class="toast toast-info">
  <div style="font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-cyan); margin-bottom:4px">INFO</div>
  <div style="font-size:13px; color:var(--nw-text-dim)">New update available.</div>
</div>
```

---

## Modal Dialog

```html
<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-header">
      <span style="font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:var(--nw-primary)">CONFIRM ACTION</span>
      <button style="background:transparent; border:none; color:var(--nw-text-dim); cursor:pointer; font-size:20px">&times;</button>
    </div>
    <div class="modal-body">
      <p style="font-size:14px; line-height:1.5; color:var(--nw-text-dim)">
        Are you sure you want to delete this item? This action cannot be undone.
      </p>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost">Cancel</button>
      <button class="btn-danger">Delete</button>
    </div>
  </div>
</div>
```

---

## Skeleton Loaders

```html
<div class="panel">
  <div class="panel-header">
    <span>LOADING</span>
    <span class="tag">読み込み中</span>
  </div>
  <div class="panel-body">
    <div class="skeleton skeleton-heading" style="margin-bottom:12px"></div>
    <div class="skeleton skeleton-text" style="margin-bottom:8px"></div>
    <div class="skeleton skeleton-text" style="width:80%; margin-bottom:8px"></div>
    <div class="skeleton skeleton-block" style="margin-top:16px"></div>
  </div>
</div>
```

---

## v2-alpha examples (additive)

### Command palette (Cmd K)

```html
<div class="cmdk-backdrop" id="cmdk" data-open="false">
  <div class="cmdk" role="dialog" aria-label="Command palette">
    <input autofocus placeholder="Type a command or search…">
    <div class="cmdk-section">Navigate</div>
    <div class="cmdk-item active">
      <span>Go to Fleet</span>
      <div style="display:flex; gap:4px"><span class="kbd">g</span><span class="kbd">f</span></div>
    </div>
    <div class="cmdk-section">Actions</div>
    <div class="cmdk-item">
      <span>Deploy current branch</span>
      <div style="display:flex; gap:4px"><span class="kbd">⌘</span><span class="kbd">↵</span></div>
    </div>
  </div>
</div>
```

Toggle with `document.getElementById('cmdk').dataset.open = 'true'` (or `false`).

### Drawer (right slide-in for detail views)

```html
<div class="drawer-backdrop" data-open="false"></div>
<aside class="drawer" data-open="false">
  <div class="drawer-header">
    <div>
      <div class="modal-title">Node detail</div>
      <div style="display:flex; gap:8px; align-items:center; margin-top:4px">
        <span class="led" data-state="ok" data-pulse></span>
        <span style="color:var(--nw-chrome)">cluster-α-12</span>
        <span class="tag tag-success">healthy</span>
      </div>
    </div>
    <button class="btn btn-ghost btn-icon">×</button>
  </div>
  <div class="drawer-body">
    <!-- content -->
  </div>
</aside>
```

### Form with validation states

```html
<div class="field">
  <label class="field-label">Node ID <span class="req">*</span></label>
  <input value="cluster-α-12">
  <span class="field-help">Identifier of the target node</span>
</div>

<div class="field success">
  <label class="field-label">Region</label>
  <input value="ap-northeast-1">
  <span class="field-help">✓ Verified · 12 nodes available</span>
</div>

<div class="field error">
  <label class="field-label">Replica count</label>
  <input value="9999">
  <span class="field-help">Exceeds quota (max 512)</span>
</div>
```

### Switch / Check / Radio

```html
<label class="switch">
  <input type="checkbox" checked>
  <span class="track"></span>
  <span class="lbl">Auto-scale enabled</span>
</label>

<label class="check"><input type="checkbox" checked><span class="box"></span> Notify oncall</label>
<label class="radio"><input type="radio" name="strategy" checked><span class="box"></span> Rolling</label>
```

### Combo (multiselect with chips)

```html
<div class="combo">
  <span class="chip">ap-northeast-1 <span class="x">×</span></span>
  <span class="chip">eu-west-2 <span class="x">×</span></span>
  <input placeholder="Add region…">
</div>
```

### Segmented control

```html
<div class="seg" role="group" aria-label="Intensity">
  <button data-i="archive"  aria-pressed="false">Archive</button>
  <button data-i="operator" aria-pressed="true">Operator</button>
  <button data-i="combat"   aria-pressed="false">Combat</button>
</div>
```

### Stat card with sparkline

```html
<div class="stat">
  <span class="stat-label">Active Nodes</span>
  <span class="stat-value">487<span style="font-size:.5em; color:var(--nw-text-mute)"> / 512</span></span>
  <span class="stat-delta up">▲ 2.1% · 24h</span>
  <svg class="stat-spark" viewBox="0 0 100 24" preserveAspectRatio="none">
    <path class="area" d="M0,18 L24,12 L48,11 L72,5 L100,2 L100,24 L0,24 Z"/>
    <path d="M0,18 L24,12 L48,11 L72,5 L100,2"/>
  </svg>
</div>
```

### Diff view

```html
<div class="diff">
  <div class="ln"><span class="num">12</span><span class="code-content"> autoscaler:</span></div>
  <div class="ln del"><span class="num">13</span><span class="code-content"> -  replicas: 4</span></div>
  <div class="ln add"><span class="num">13</span><span class="code-content"> +  replicas: 8</span></div>
</div>
```

### Code block with syntax tokens

```html
<pre class="code-block">
<span class="tok-c">// reconcile fleet state</span>
<span class="tok-k">async function</span> <span class="tok-fn">reconcile</span>(nodes) {
  <span class="tok-k">const</span> drift = nodes.<span class="tok-fn">filter</span>(n =&gt; n.lag &gt; <span class="tok-n">3</span>);
  <span class="tok-k">return</span> drift.<span class="tok-fn">map</span>(<span class="tok-fn">scaleOut</span>);
}
</pre>
```

### Stepper

```html
<div class="steps">
  <div class="step done"></div>
  <div class="step done"></div>
  <div class="step current"></div>
  <div class="step"></div>
  <div class="step"></div>
</div>
```

### LED with state attribute

```html
<span class="led" data-state="ok" data-pulse></span>     <!-- green pulsing -->
<span class="led" data-state="warn"></span>              <!-- amber static -->
<span class="led" data-state="error" data-pulse></span>  <!-- red pulsing -->
<span class="led" data-state="ai"></span>                <!-- purple static -->
```

### AI block (oracle / suggestion strip)

```html
<div class="ai-block">
  <div class="ai-block-head">
    <span class="led" data-state="ai" data-pulse></span> suggested
  </div>
  <div class="ai-block-body">
    <em>edge-eu-19</em> CPU climbed over 4 windows. Consider <em>scaling out</em>.
  </div>
</div>
```

### Empty state

```html
<div class="empty">
  <div class="glyph">⌬</div>
  <div class="head">No active query</div>
  <div class="sub">Ask the operator's intelligence layer.</div>
  <button class="btn btn-ai">Start session <span class="kbd">⌘ /</span></button>
</div>
```

### Banner (system-wide notice)

```html
<div class="banner">
  <span class="banner-tag">Notice</span>
  Scheduled maintenance <span style="color:var(--nw-data)">2026-05-20 22:00 UTC</span>
</div>
```

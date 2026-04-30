# Nightwire Layout Templates

This file contains complete layout templates and patterns for different types of interfaces.

---

## Standard Scrolling Layout

For portfolios, blogs, documentation sites, and any content-driven interface.

Use standard HTML flow. Apply Nightwire components (`.panel`, `.btn`, `.nw-table`, `.card`) within your own layout structure. No special wrapper needed — just use the components where appropriate.

---

## Operations Console Layout

Full-viewport, dense panel grid with 2px gaps. This is the signature Nightwire layout for dashboards, monitoring UIs, and admin panels.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Saira+Extra+Condensed:wght@400;600;700;800&family=Shippori+Mincho+B1:wght@500;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="nightwire.css">
  <style>
    /* Operations Console Layout */
    .console-wrapper { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
    .nw-nav { display: flex; align-items: center; padding: 10px 16px; background: var(--void); border-bottom: 1px solid var(--nw-primary-dim); flex-shrink: 0; gap: 20px; }
    .org-mark { font-family: var(--font-title); font-size: 24px; font-weight: 900; letter-spacing: 0.25em; color: var(--nw-primary); text-transform: uppercase; transform: scaleX(0.82); transform-origin: left center; line-height: 1.15; }
    .org-mark .sub { font-family: var(--font-sys); font-size: 9px; letter-spacing: 0.12em; color: var(--nw-text-dim); display: block; transform: scaleX(1.22); font-weight: 400; }
    .ticker { overflow: hidden; white-space: nowrap; background: var(--void); border-bottom: 1px solid var(--nw-text-faint); padding: 2px 0; font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--nw-primary); flex-shrink: 0; }
    .ticker .scroll { display: inline-block; animation: ticker-scroll 80s linear infinite; padding-left: 100%; }
    @keyframes ticker-scroll { from { transform: translateX(0); } to { transform: translateX(-100%); } }
    .dashboard { display: flex; gap: 2px; flex: 1; padding: 2px; min-height: 0; }
    .dash-left { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; overflow-y: auto; }
    .dash-right { width: 370px; min-width: 370px; display: flex; flex-direction: column; gap: 2px; }
    .dash-row { display: grid; gap: 2px; flex-shrink: 0; }
    .dash-row.r1 { grid-template-columns: 1.2fr 1fr; min-height: 360px; }
    .dash-row.r2 { grid-template-columns: 1fr 1fr; }
    .status-bar { display: flex; justify-content: space-between; padding: 3px 12px; font-size: 7px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--nw-text-dim); border-top: 1px solid var(--nw-text-faint); flex-shrink: 0; }
  </style>
</head>
<body>
<div class="console-wrapper">

  <!-- Navigation -->
  <nav class="nw-nav">
    <div class="org-mark">
      SYSTEM NAME
      <span class="sub">System subtitle — descriptor</span>
    </div>
    <span style="font-family:var(--font-mincho); font-size:15px; font-weight:800; color:var(--nw-primary-dim)">システム名</span>
    <div style="display:flex; gap:14px; margin-left:auto;">
      <a href="#" style="font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-text-dim)">Dashboard</a>
      <a href="#" style="font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-text-dim)">Settings</a>
    </div>
  </nav>

  <!-- Ticker -->
  <div class="ticker">
    <div class="scroll">
      STATUS: NOMINAL &nbsp;│&nbsp; 稼働中 &nbsp;│&nbsp; NODES: 42 &nbsp;│&nbsp; UPTIME: 99.9% &nbsp;│&nbsp;
    </div>
  </div>

  <!-- Dashboard Grid -->
  <div class="dashboard">
    <div class="dash-left">

      <!-- Row 1: Waveform + Metrics -->
      <div class="dash-row r1">
        <div class="panel">
          <div class="panel-header">
            <span>SIGNAL ANALYSIS</span>
            <span class="tag">信号解析</span>
          </div>
          <!-- canvas waveform or chart goes here -->
        </div>

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
          </div>
        </div>
      </div>

      <!-- Row 2: Data table -->
      <div class="dash-row r2">
        <div class="panel">
          <div class="panel-header">
            <span>NODE REGISTRY</span>
            <span class="tag">ノード登録</span>
          </div>
          <table class="nw-table">
            <thead>
              <tr><th>Node</th><th>Status</th><th>CPU</th><th>Memory</th></tr>
            </thead>
            <tbody>
              <tr><td>node-01</td><td><span class="led green"></span> Online</td><td>42%</td><td>68%</td></tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Right column: Event log -->
    <div class="dash-right">
      <div style="background:var(--void-warm);border:1px solid var(--nw-text-faint);display:flex;flex-direction:column;flex:1;min-height:0;">
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
        </div>
      </div>
    </div>
  </div>

  <!-- Status bar -->
  <div class="status-bar">
    <span><span class="led green"></span> SYSTEM ONLINE</span>
    <span>NODES: 42 │ TOKENS: 847K │ UPTIME: 99.9%</span>
    <span id="clock">14:32:07 JST</span>
  </div>

</div>
</body>
</html>
```

---

## Portfolio Layout

For personal sites, project showcases, and developer profiles.

```html
<!-- Hero Section -->
<section style="min-height:100vh; display:flex; align-items:center; padding:var(--sp-8); background:var(--void)">
  <div style="max-width:800px">
    <div class="compressed-title" style="font-size:48px; color:var(--nw-primary); line-height:1; margin-bottom:8px">
      YOUR NAME
    </div>
    <div style="font-family:var(--font-mincho); font-size:18px; color:var(--nw-primary-dim); margin-bottom:24px">
      役職・専門分野
    </div>
    <p style="font-size:16px; line-height:1.6; color:var(--nw-text-dim); max-width:560px; margin-bottom:32px">
      Short bio or tagline. Keep it punchy. One or two sentences max.
    </p>
    <div style="display:flex; gap:12px">
      <a href="#work" class="btn">View Work</a>
      <a href="#contact" class="btn-ghost">Contact</a>
    </div>
  </div>
</section>

<!-- Project Grid -->
<section style="padding:var(--sp-12) var(--sp-8); max-width:1200px; margin:0 auto">
  <div class="panel-header" style="background:var(--void); margin-bottom:16px">
    <span>SELECTED WORK</span>
    <span class="tag">プロジェクト</span>
  </div>
  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:16px">
    <div class="card">
      <div class="card-header">
        <span>PROJECT NAME</span>
        <span class="tag tag-info">React</span>
      </div>
      <div class="card-body">
        <p style="font-size:13px; line-height:1.5; color:var(--nw-text-dim); margin-bottom:12px">
          Short project description. What it does, what problem it solves.
        </p>
        <div style="display:flex; gap:6px; flex-wrap:wrap">
          <span class="tag tag-info">TypeScript</span>
          <span class="tag tag-info">Node.js</span>
        </div>
      </div>
      <div class="card-footer">
        <a href="#" style="font-size:12px; color:var(--nw-primary)">View Project →</a>
      </div>
    </div>
  </div>
</section>
```

---

## Blog / Article Layout

For articles, documentation pages, and long-form content.

```html
<article style="max-width:720px; margin:0 auto; padding:var(--sp-12) var(--sp-6)">

  <!-- Article Header -->
  <header style="margin-bottom:var(--sp-8)">
    <div style="display:flex; gap:8px; align-items:center; margin-bottom:12px">
      <span class="badge">Tutorial</span>
      <span style="font-size:11px; color:var(--nw-text-dim); letter-spacing:0.06em">12 MIN READ</span>
    </div>
    <h1 class="compressed-title" style="font-size:40px; color:var(--nw-primary); margin-bottom:12px">
      ARTICLE TITLE
    </h1>
    <div style="font-family:var(--font-mincho); font-size:16px; color:var(--nw-primary-dim); margin-bottom:16px">
      記事のサブタイトル
    </div>
    <div style="font-size:11px; color:var(--nw-text-dim); letter-spacing:0.08em; text-transform:uppercase">
      2026-04-30 · Carlos Developer
    </div>
  </header>

  <!-- Article Body -->
  <div style="font-size:15px; line-height:1.7; color:var(--nw-text-dim)">
    <p style="margin-bottom:20px">
      Opening paragraph. Sets context and hooks the reader.
    </p>

    <h2 style="font-family:var(--font-title); font-size:24px; font-weight:800; letter-spacing:0.15em; text-transform:uppercase; color:var(--nw-cyan); transform:scaleX(0.82); transform-origin:left; margin:32px 0 16px">
      SECTION HEADING
    </h2>

    <p style="margin-bottom:20px">Body text continues here.</p>

    <!-- Code block -->
    <div class="panel" style="margin:24px 0">
      <div class="panel-header"><span>CODE EXAMPLE</span><span class="tag">コード</span></div>
      <pre style="margin:0; padding:12px; font-size:13px; line-height:1.5; overflow-x:auto; background:transparent">const config = {
  void: '#000000',
  primary: '#6699ff'
}</pre>
    </div>

    <!-- Blockquote -->
    <blockquote style="border-left:3px solid var(--nw-primary-dim); padding-left:16px; margin:24px 0; color:var(--nw-text-dim); font-style:italic">
      Key insight or quote worth highlighting.
    </blockquote>
  </div>
</article>
```

---

## Landing Page Layout

For product pages, marketing sites, and feature announcements.

```html
<!-- Hero -->
<section style="min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:var(--sp-8); background:var(--void)">
  <span class="badge" style="margin-bottom:16px">v1.0 — Now Available</span>
  <div class="compressed-title" style="font-size:56px; color:var(--nw-primary); margin-bottom:12px">
    PRODUCT NAME
  </div>
  <div style="font-family:var(--font-mincho); font-size:20px; color:var(--nw-primary-dim); margin-bottom:24px">
    製品の説明
  </div>
  <p style="font-size:18px; line-height:1.5; color:var(--nw-text-dim); max-width:600px; margin-bottom:40px">
    One-sentence value proposition. What it does and why it matters.
  </p>
  <div style="display:flex; gap:16px; justify-content:center">
    <a href="#" class="btn">Get Started</a>
    <a href="#" class="btn-ghost">View Docs</a>
  </div>
</section>

<!-- Features Grid -->
<section style="padding:var(--sp-12) var(--sp-8); max-width:1100px; margin:0 auto">
  <div class="panel-header" style="background:var(--void); margin-bottom:24px; text-align:center">
    <span>FEATURES</span>
    <span class="tag">機能</span>
  </div>
  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:2px">
    <div class="panel">
      <div class="panel-header"><span>FEATURE ONE</span><span class="tag">機能一</span></div>
      <div class="panel-body">
        <p style="font-size:13px; line-height:1.5; color:var(--nw-text-dim)">
          Feature description. Keep it short and benefit-focused.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- CTA Footer -->
<section style="padding:var(--sp-12) var(--sp-8); text-align:center; border-top:1px solid var(--nw-text-faint)">
  <div class="compressed-title" style="font-size:32px; color:var(--nw-primary); margin-bottom:16px">
    READY TO START?
  </div>
  <a href="#" class="btn">Get Started Free</a>
</section>
```

---

## Documentation Site Layout

For technical docs, API references, and component libraries.

```html
<div style="display:flex; height:100vh; background:var(--void)">

  <!-- Sidebar Navigation -->
  <nav class="sidebar" style="width:260px; flex-shrink:0; overflow-y:auto; border-right:1px solid var(--nw-text-faint)">
    <div class="sidebar-header">
      <span class="compressed-title" style="font-size:14px; color:var(--nw-primary)">DOCS</span>
      <span style="font-family:var(--font-mincho); font-size:11px; color:var(--nw-primary-dim)">文書</span>
    </div>
    <div class="sidebar-section">Getting Started</div>
    <a class="sidebar-item active" href="#">Installation</a>
    <a class="sidebar-item" href="#">Quick Start</a>
    <div class="sidebar-section">Components</div>
    <a class="sidebar-item" href="#">Buttons</a>
    <a class="sidebar-item" href="#">Panels</a>
  </nav>

  <!-- Main Content -->
  <main style="flex:1; overflow-y:auto; padding:32px 48px 64px">
    <div style="max-width:800px; margin:0 auto">

      <!-- Page Header -->
      <div style="margin-bottom:32px">
        <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px">
          <span class="badge">v1.0</span>
          <span style="font-size:11px; color:var(--nw-text-dim); letter-spacing:0.06em">COMPONENT</span>
        </div>
        <h1 class="compressed-title" style="font-size:36px; color:var(--nw-primary)">BUTTON</h1>
        <p style="font-size:14px; line-height:1.6; color:var(--nw-text-dim); margin-top:8px">
          Three variants for primary actions, ghost interactions, and destructive operations.
        </p>
      </div>

      <!-- Live Preview -->
      <div class="panel" style="margin-bottom:2px">
        <div class="panel-header"><span>PREVIEW</span><span class="tag">プレビュー</span></div>
        <div class="panel-body" style="display:flex; gap:8px">
          <button class="btn">Primary</button>
          <button class="btn-ghost">Ghost</button>
          <button class="btn-danger">Danger</button>
        </div>
      </div>

      <!-- API Reference Table -->
      <div class="panel">
        <div class="panel-header"><span>CSS CLASSES</span><span class="tag">クラス</span></div>
        <table class="nw-table">
          <thead>
            <tr><th>Class</th><th>Description</th><th>Use For</th></tr>
          </thead>
          <tbody>
            <tr><td style="color:var(--nw-cyan)">.btn</td><td style="color:var(--nw-text-dim)">Primary button</td><td>Main actions</td></tr>
            <tr><td style="color:var(--nw-cyan)">.btn-ghost</td><td style="color:var(--nw-text-dim)">Ghost button</td><td>Secondary actions</td></tr>
          </tbody>
        </table>
      </div>

    </div>
  </main>
</div>
```

---

## Navigation & Footer Patterns

### Standard Navbar

For portfolios, landing pages, and documentation sites.

```html
<nav style="display:flex; align-items:center; padding:12px 24px; background:var(--void); border-bottom:1px solid var(--nw-text-faint); position:sticky; top:0; z-index:100">
  <div class="compressed-title" style="font-size:18px; color:var(--nw-primary)">BRAND</div>
  <span style="font-family:var(--font-mincho); font-size:12px; color:var(--nw-primary-dim); margin-left:8px">ブランド</span>
  <div style="display:flex; gap:20px; margin-left:auto">
    <a href="#" style="font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-text-dim)">Work</a>
    <a href="#" style="font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-text-dim)">About</a>
    <a href="#" class="btn btn-sm">Contact</a>
  </div>
</nav>
```

### Footer

```html
<footer style="padding:var(--sp-8); border-top:1px solid var(--nw-text-faint); display:flex; justify-content:space-between; align-items:center">
  <div>
    <div class="compressed-title" style="font-size:14px; color:var(--nw-primary)">BRAND</div>
    <div style="font-size:11px; color:var(--nw-text-dim); margin-top:4px">© 2026 · MIT License</div>
  </div>
  <div style="display:flex; gap:16px">
    <a href="#" style="font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:var(--nw-text-dim)">GitHub</a>
    <a href="#" style="font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:var(--nw-text-dim)">Twitter</a>
  </div>
</footer>
```

---

## Responsive Behavior

**Breakpoints:**
- Mobile: `640px`
- Tablet: `1024px`
- Desktop: `1280px`

**Required responsive adaptations:**

1. **Operations Console** (below tablet/1024px):
   - `.dashboard` changes from `flex-direction: row` to `flex-direction: column`
   - `.dash-right` changes from `width: 370px` to `width: 100%`
   - All `.dash-row` grids collapse to single column

2. **Sidebar Navigation** (below mobile/640px):
   - `.sidebar` becomes hidden hamburger drawer
   - Add mobile menu toggle button
   - Overlay sidebar on mobile instead of fixed width

3. **Grid Layouts** (below mobile/640px):
   - All multi-column grids collapse to `grid-template-columns: 1fr`

**Example responsive CSS:**

```css
@media (max-width: 1024px) {
  .dashboard { flex-direction: column; }
  .dash-right { width: 100%; min-width: 0; }
  .dash-row.r1, .dash-row.r2 { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .sidebar { position: fixed; left: -240px; transition: left 0.3s; z-index: 1000; }
  .sidebar.open { left: 0; }
  body { font-size: 13px; }
}
```

---
name: nightwire
description: >
  Use when building any dark-themed web UI or generating HTML/CSS with a cyberpunk aesthetic —
  dashboards, admin panels, dev tools, monitoring UIs, portfolios, landing pages, blogs, or any
  interface that lives on a pure black background. Provides design tokens, semantic color roles,
  component classes, layout templates, and complete HTML examples.
---

# Nightwire — Cyberpunk UI System

A dark-mode-only design system with a modern cyberpunk aesthetic. Works for **any type of interface** — from a personal portfolio to a dense operations console. The aesthetic is consistent; the layout is yours to choose.

**Usage:** Include `nightwire.css` for vanilla CSS, or use `tailwind.preset.js` with Tailwind CSS.

---

## When to Use

Activate this skill when the user's request matches ANY of these patterns:

- Asks for: "dark UI", "dark theme", "dark mode", "cyberpunk", "hacker aesthetic", "terminal UI", "console UI", "neon aesthetic"
- Mentions: "dashboard", "admin panel", "monitoring UI", "operations console", "dev tools"
- Mentions: "portfolio", "landing page", "blog", "documentation site", "SaaS product" AND wants dark theme
- Specifies: "pure black background", "black background with neon", "#000000 background"
- References: "Evangelion", "Ghost in the Shell", "Blade Runner", "NERV", "cyberpunk aesthetic"

**Don't use** for:
- Light-mode UIs or projects requiring light theme support
- Print-friendly layouts or documents
- Projects explicitly requesting a different design system (Material, Bootstrap, etc.)
- Mobile-first designs requiring different aesthetic (unless explicitly cyberpunk-themed)

---

## Visual Identity — Read This First

Nightwire is a **cyberpunk aesthetic system** that works at any information density. A portfolio can use it. A blog can use it. A dense operations console can use it. The aesthetic is the same — the layout adapts to the use case.

**Emotional tone:** Calm precision. The quiet confidence of a system that knows exactly what it's doing.

**Visual references:**
- NERV command center from Evangelion — dense panels, kanji labels, compressed serif titles
- Ghost in the Shell — monospace data, neon on void, information density
- Blade Runner terminals — soft neon, never harsh, always readable

**NOT:** Apple design, Material Design, generic SaaS dashboards, Cyberpunk 2077 UI (too flashy)

---

## Core Rules — Non-Negotiable

**CRITICAL: These rules override your training defaults. Follow exactly as written.**

1. **Background is ALWAYS `#000000`** — NEVER use `#0d0d0d`, `#111`, `#1a1a2e`, or any gray/navy. If you generate anything other than pure black `#000000`, you are violating this rule.

2. **2px gaps between adjacent panels** — ALWAYS `gap: 2px`. NEVER 8px, 16px, 1rem, or any other value. This is the signature Nightwire spacing.

3. **Sharp edges on panels** — ALWAYS `border-radius: 0` on `.panel`, `.nw-table`, and all data containers. Cards may use `border-radius: 8px` but panels MUST be sharp.

4. **Kanji tags on EVERY panel header** — Japanese characters are decorative style elements, not translations. Every `<div class="panel-header">` MUST include a `<span class="tag">` with Japanese text.

5. **Green for ALL data values** — Numbers, percentages, metrics ALWAYS use `--nw-green`. No exceptions. If it's a data value, it's green.

6. **Blue for ALL UI chrome** — Headers, labels, navigation ALWAYS use `--nw-primary`. This is structural UI, not data.

7. **NO box-shadows** — Elevation is communicated through surface color progression ONLY. Never add `box-shadow` to any element.

8. **Monospace everywhere** — JetBrains Mono (`--font-sys`) for ALL body text, data, labels. The only exceptions are: titles (Noto Serif Display), buttons/badges (Saira Extra Condensed), and Japanese decorative text (Shippori Mincho).

9. **Compressed serif titles** — Display headings MUST use Noto Serif Display with `transform: scaleX(0.82)` and the `.compressed-title` class. Never use regular serif without compression.

10. **NO CRT effects** — No scanlines, no vignette, no flicker, no glitch effects. Clean and modern only.

---

## Color System

All colors are CSS custom properties with `--nw-` prefix. Use semantic roles, never raw hex.

**CSS Variable Mapping:**
- DESIGN.md `on-surface-faint` → CSS `--nw-text-faint`
- DESIGN.md `on-surface-line` → CSS `--nw-text-line`
- DESIGN.md `on-surface-dim` → CSS `--nw-text-dim`
- DESIGN.md `on-surface` → CSS `--nw-text`
- DESIGN.md `success` → CSS `--nw-green`
- DESIGN.md `primary` → CSS `--nw-primary`
- DESIGN.md `danger` → CSS `--nw-red`
- DESIGN.md `warning` → CSS `--nw-yellow`
- DESIGN.md `info` → CSS `--nw-cyan`
- DESIGN.md `accent` → CSS `--nw-purple`

### Semantic Roles

| Role | Variable | Hex | Use ONLY for |
|---|---|---|---|
| Primary | `--nw-primary` | `#6699ff` | Headers, labels, active states, links, UI chrome |
| Success/Data | `--nw-green` | `#7aed7a` | Data values, success states, online indicators |
| Info | `--nw-cyan` | `#66ddff` | Metadata, secondary info, wireframe elements |
| Danger | `--nw-red` | `#ff6688` | Errors, destructive actions, offline states |
| Warning | `--nw-warning` | `#e8993a` | Caution, pending, degraded states |
| Accent | `--nw-accent` | `#b266e0` | AI elements, accent highlights |

Each role has `-dim` (muted), `-hot` (bright), `-fill` (translucent bg) variants.

### Surfaces — Elevation Through Tone

| Level | Token | Hex | Use |
|---|---|---|---|
| 0 | `--void` | `#000000` | Page background — always |
| 1 | `--void-warm` | `#0a0a0a` | Panels, cards |
| 2 | `--void-panel` | `#111111` | Modals, inputs, raised panels |
| 3 | `--void-raised` | `#1a1a1a` | Dropdowns, tooltips |

---

## Typography

### Font Stack

```css
:root {
  --font-title:  'Noto Serif Display', serif;       /* Display headings — compressed */
  --font-sys:    'JetBrains Mono', monospace;        /* Body, code, data — everything */
  --font-stamp:  'Saira Extra Condensed', sans-serif; /* Labels, badges, buttons */
  --font-mincho: 'Shippori Mincho B1', serif;        /* Japanese decorative accents */
}
```

Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Saira+Extra+Condensed:wght@400;600;700;800&family=Shippori+Mincho+B1:wght@500;700;800&display=swap" rel="stylesheet">
```

### Usage Rules

| Context | Font | Rule |
|---|---|---|
| All body text, data | `--font-sys` | Always monospace |
| Page/section titles | `--font-title` + `.compressed-title` | scaleX(0.82), uppercase |
| Buttons, badges, tags | `--font-stamp` | Uppercase, condensed |
| Japanese decorative | `--font-mincho` | Panel tags, subtitles only |

### Compressed Title Pattern

```html
<div class="compressed-title" style="font-size:32px; color:var(--nw-primary)">
  NIGHTWIRE
</div>
<div style="font-family:var(--font-mincho); font-size:14px; color:var(--nw-primary-dim)">
  設計体系
</div>
```

---

## Panel Header Pattern — Use on Every Panel

```html
<div class="panel">
  <div class="panel-header">
    <span>SECTION TITLE</span>
    <span class="tag">日本語タグ</span>
  </div>
  <div class="panel-body">
    <!-- content -->
  </div>
</div>
```

Rules:
- Header text: 8-10px, uppercase, `--nw-primary`, letter-spacing 0.14em
- Japanese tag: right-aligned, `--nw-text-dim`, `--font-mincho`
- Bottom border: `1px solid --nw-primary-dim`

---

## Layout Templates

### Standard Scrolling Layout (portfolios, blogs, docs)

Use standard HTML flow. Apply Nightwire components within your own layout. No special wrapper needed.

### Operations Console (dashboards, monitoring, admin panels)

Full-viewport, dense panel grid with 2px gaps. This is the signature Nightwire layout.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link href="[google-fonts-url]" rel="stylesheet">
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
              <tr><td>node-02</td><td><span class="led yellow"></span> Degraded</td><td>87%</td><td>91%</td></tr>
            </tbody>
          </table>
        </div>

        <div class="panel">
          <div class="panel-header">
            <span>MAGI CONSENSUS</span>
            <span class="tag">設計哲学</span>
          </div>
          <div class="panel-body">
            <div style="display:flex;flex-direction:column;gap:6px;">
              <div style="padding:6px 8px;border:1px solid var(--nw-cyan-dim);background:var(--void);display:flex;align-items:center;gap:8px;">
                <span style="font-family:var(--font-title);font-size:11px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:var(--nw-cyan);transform:scaleX(0.85);transform-origin:left;min-width:80px;">MELCHIOR</span>
                <span style="font-size:11px;font-weight:700;color:var(--nw-green)">Void First</span>
                <span style="font-size:7px;color:var(--nw-text-dim);margin-left:auto">Pure #000000 backgrounds.</span>
                <span style="font-family:var(--font-stamp);font-size:11px;font-weight:700;color:var(--nw-green)">AGREE</span>
              </div>
            </div>
          </div>
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

## Components

### Buttons

```css
.btn         /* Primary — blue bg, dark text */
.btn-ghost   /* Transparent bg, blue border */
.btn-danger  /* Red bg for destructive actions */
.btn-sm      /* Small size modifier */
```

### Panel & Card

```css
.panel         /* void-warm bg, faint border, NO radius */
.panel-header  /* 10px uppercase primary, primary-dim bottom border */
.panel-body    /* sp-3 padding */

.card          /* void-warm bg, faint border, radius-lg */
.card-header   /* Uppercase primary label */
.card-body     /* sp-4 padding */
.card-footer   /* Faint top border */
```

### Data Table

```css
.nw-table      /* Full-width, collapsed borders */
.nw-table th   /* 9px uppercase primary, primary-dim border */
.nw-table td   /* Green data, faint border, tabular-nums */
```

### Metrics Grid

```css
.metrics-grid           /* 2-column grid, 1px faint separators */
.metric-cell            /* void-warm bg */
.m-label                /* 9px uppercase primary */
.m-value                /* 20px bold green with glow */
.m-sub                  /* 9px dim subtitle */
.metric-cell.highlight  /* Blue primary value, 24px */
```

### Status LED

```css
.led.green   /* Online / healthy */
.led.blue    /* Active / processing */
.led.red     /* Error / offline */
.led.yellow  /* Warning / degraded */
.led.blink   /* Animated pulse */
```

### Badges & Tags

```css
.badge           /* Stamp font, 12px uppercase, primary border */
.badge-success   /* Green */
.badge-danger    /* Red */
.badge-warning   /* Yellow */

.tag             /* Pill, stamp font, primary on primary-fill */
.tag-success     /* Green on green-faint */
.tag-danger      /* Red on red-fill */
.tag-warning     /* Yellow */
.tag-info        /* Cyan */
```

### Toast / Notification

```css
.toast           /* void-panel bg, 3px left border */
.toast-success   /* Green left border */
.toast-danger    /* Red left border */
.toast-warning   /* Yellow left border */
.toast-info      /* Cyan left border */
```

### Sidebar Nav

```css
.sidebar              /* 240px, void-warm bg, right border */
.sidebar-header       /* Uppercase primary, bottom border */
.sidebar-section      /* 9px dim section label */
.sidebar-item         /* 12px dim text, left border */
.sidebar-item.active  /* Primary text, primary left border */
```

### Key-Value Row

```css
.kv-row        /* Flex row, space-between, faint bottom border */
.kv-label      /* Primary-dim, uppercase, 10px */
.kv-value      /* Green, medium weight, tabular-nums */
```

### Progress Bar

```css
.nw-progress      /* 4px height, void-panel bg */
.nw-progress .fill /* Green with glow */
```

### Skeleton Loader

```css
.skeleton          /* void-panel bg, neon blue shimmer animation */
.skeleton-text     /* 14px height */
.skeleton-heading  /* 24px height, 60% width */
.skeleton-block    /* 80px height */
```

### Modal

```css
.modal-backdrop  /* Fixed overlay, rgba(0,0,0,0.8) */
.modal           /* void-panel bg, primary-dim border, radius-lg */
.modal-header    /* Uppercase primary, flex space-between */
.modal-body      /* sp-4 padding */
.modal-footer    /* Faint top border, flex end */
```

---

## HTML Examples

### Panel with Table

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
    </tbody>
  </table>
</div>
```

### Sidebar Layout

```html
<div style="display:flex; height:100vh">
  <nav class="sidebar">
    <div class="sidebar-header">NIGHTWIRE</div>
    <div class="sidebar-section">Navigation</div>
    <a class="sidebar-item active" href="#">Dashboard</a>
    <a class="sidebar-item" href="#">Settings</a>
  </nav>
  <main style="flex:1; padding:var(--sp-6); background:var(--void); overflow-y:auto">
    <!-- content -->
  </main>
</div>
```

### Node Card

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
    <div style="margin-top:4px;font-family:var(--font-stamp);font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--nw-green)">
      <span class="led green"></span> Operational
    </div>
  </div>
</div>
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

    <!-- Inline code -->
    <p style="margin-bottom:20px">
      Use <code style="background:var(--void-panel); color:var(--nw-green); padding:2px 6px; font-family:var(--font-sys); font-size:13px">inline code</code> for short snippets.
    </p>

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
    <div class="panel">
      <div class="panel-header"><span>FEATURE TWO</span><span class="tag">機能二</span></div>
      <div class="panel-body">
        <p style="font-size:13px; line-height:1.5; color:var(--nw-text-dim)">
          Another feature description.
        </p>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header"><span>FEATURE THREE</span><span class="tag">機能三</span></div>
      <div class="panel-body">
        <p style="font-size:13px; line-height:1.5; color:var(--nw-text-dim)">
          Third feature description.
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

## Form Components

```html
<!-- Text Input -->
<div style="margin-bottom:16px">
  <label style="display:block; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-primary); margin-bottom:6px">
    EMAIL ADDRESS
  </label>
  <input type="email" placeholder="user@example.com"
    style="width:100%; padding:8px 12px; background:var(--void-panel); border:1px solid var(--nw-text-line); color:var(--nw-text); font-family:var(--font-sys); font-size:14px">
</div>

<!-- Textarea -->
<div style="margin-bottom:16px">
  <label style="display:block; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-primary); margin-bottom:6px">
    MESSAGE
  </label>
  <textarea rows="4" placeholder="Your message..."
    style="width:100%; padding:8px 12px; background:var(--void-panel); border:1px solid var(--nw-text-line); color:var(--nw-text); font-family:var(--font-sys); font-size:14px; resize:vertical"></textarea>
</div>

<!-- Select -->
<div style="margin-bottom:16px">
  <label style="display:block; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-primary); margin-bottom:6px">
    CATEGORY
  </label>
  <select style="width:100%; padding:8px 12px; background:var(--void-panel); border:1px solid var(--nw-text-line); color:var(--nw-text); font-family:var(--font-sys); font-size:14px">
    <option>Select option</option>
    <option>Option 1</option>
    <option>Option 2</option>
  </select>
</div>

<!-- Checkbox -->
<label style="display:flex; align-items:center; gap:8px; cursor:pointer; margin-bottom:12px">
  <input type="checkbox" style="width:16px; height:16px; accent-color:var(--nw-primary)">
  <span style="font-size:13px; color:var(--nw-text-dim)">I agree to the terms</span>
</label>

<!-- Submit Button -->
<button class="btn" type="submit">Submit</button>
```

---

## Navigation & Footer Patterns

### Standard Navbar (portfolios, landing pages, docs)

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

## Form Validation States

```html
<!-- Error state -->
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

<!-- Success state -->
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

<!-- Disabled state -->
<input type="text" disabled value="Read only"
  style="width:100%; padding:8px 12px; background:var(--void-panel); border:1px solid var(--nw-text-faint); color:var(--nw-text-dim); font-family:var(--font-sys); font-size:14px; opacity:0.4; cursor:not-allowed">
```

---

## Anti-Patterns — What NOT to Generate

**These are common AI training defaults that violate Nightwire rules. Actively avoid them.**

| NEVER Generate | ALWAYS Use Instead | Why |
|---|---|---|
| `background: #1a1a2e` or `#0d0d0d` | `background: #000000` | Only pure black is Nightwire |
| `box-shadow: 0 2px 8px rgba(...)` | Surface color progression (`--void-warm`, `--void-panel`) | No shadows in cyberpunk aesthetic |
| `border-radius: 4px` on panels | `border-radius: 0` | Panels must have sharp edges |
| `gap: 16px` between panels | `gap: 2px` | Signature tight spacing |
| `font-family: sans-serif` for titles | `font-family: var(--font-title)` + `transform: scaleX(0.82)` | Compressed serif is required |
| `text-transform: capitalize` on labels | `text-transform: uppercase` + `letter-spacing: 0.1em` | Labels are always uppercase |
| Pastel colors like `#b8e6b8` | Soft neon: `#7aed7a` | Use exact palette colors |
| Harsh neon `#00ff00`, `#0000ff` | `#7aed7a`, `#6699ff` | Soft neon, not harsh |
| `filter: blur()` or scanline overlays | Clean, no effects | No CRT aesthetics |
| `padding: 40px` for breathing room | Dense layouts with minimal padding | Information density is key |
| Generic card grids with large gaps | Panel-based grids with 2px gaps | Operations console aesthetic |
| Decorative color usage | Semantic color only (blue=UI, green=data, red=error) | Every color has meaning |
| Panel headers without kanji | Every panel header MUST have `<span class="tag">日本語</span>` | Non-negotiable style element |

---

## Responsive Behavior

**Breakpoints (from DESIGN.md):**
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
   - `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))` becomes single column
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
  body { font-size: 13px; } /* Slightly smaller on mobile */
}
```

---

## Accessibility

All primary colors pass WCAG AA on black:

| Color | Hex | Contrast |
|---|---|---|
| Primary (Blue) | `#6699ff` | 7.5:1 |
| Success (Green) | `#7aed7a` | 11.2:1 |
| Info (Cyan) | `#66ddff` | 10.8:1 |
| Danger (Red) | `#ff6688` | 6.4:1 |
| Text | `#ffffff` | 21:1 |

```css
:focus-visible { outline: 2px solid var(--nw-primary); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
```

---

*The void is the canvas. Data is the art.*

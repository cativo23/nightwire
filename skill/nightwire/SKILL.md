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

- User asks for a dark UI, cyberpunk-themed interface, or "hacker aesthetic"
- Building dashboards, admin panels, dev tools, monitoring UIs, operations consoles
- Building portfolios, landing pages, blogs, documentation sites, or SaaS products
- Any project where the background should be pure black with neon-colored accents
- **Don't use** for light-mode UIs, print-friendly layouts, or projects requiring a different design system

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

1. **Background is always `#000000`** — never `#0d0d0d`, `#111`, `#1a1a2e`, or any gray/navy
2. **2px gaps between adjacent panels** — not 8px, not 16px, always 2px
3. **Sharp edges on panels** — `border-radius: 0` on `.panel`, `.nw-table`, data containers
4. **Kanji tags on every panel header** — Japanese characters as decorative style, not translation
5. **Green for data values** — all numbers, percentages, metrics use `--nw-green`
6. **Blue for UI chrome** — headers, labels, navigation use `--nw-primary`
7. **No box-shadows** — elevation through surface color progression only
8. **Monospace everywhere** — JetBrains Mono for all body text, data, labels
9. **Compressed serif titles** — Noto Serif Display with `scaleX(0.82)` for display headings
10. **No CRT effects** — no scanlines, no vignette, no flicker. Clean and modern.

---

## Color System

All colors are CSS custom properties with `--nw-` prefix. Use semantic roles, never raw hex.

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

## Anti-Patterns — What NOT to Generate

| Don't | Do instead |
|---|---|
| Gray/navy backgrounds (`#1a1a2e`, `#0d0d0d`) | Pure black `#000000` |
| `box-shadow` for elevation | Surface color progression |
| `border-radius` on panels/tables | `border-radius: 0` |
| Gaps larger than 2px between panels | `gap: 2px` always |
| Sans-serif fonts for titles | Noto Serif Display + scaleX(0.82) |
| Lowercase labels | Uppercase + letter-spacing |
| Pastel or soft colors | Soft neon from the palette |
| Harsh neon (`#00ff00`, `#0000ff`) | `#7aed7a`, `#6699ff` |
| CRT effects (scanlines, vignette) | Clean, no overlays |
| Whitespace for "breathing room" | Dense, information-rich layouts |
| Generic SaaS card layouts | Panel-based operations console |
| Color used decoratively | Semantic color only |

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

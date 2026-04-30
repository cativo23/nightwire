---
version: "1.0"
name: Nightwire
description: >
  A dark-mode-only cyberpunk UI design system. Pure black backgrounds (#000000),
  soft neon palette, monospace typography. Inspired by Evangelion NERV operations
  centers and Ghost in the Shell. Dense, data-rich, zero decorative waste.

colors:
  # Surfaces — elevation through tonal progression, never shadows
  void:             "#000000"
  void-warm:        "#0a0a0a"
  void-panel:       "#111111"
  void-raised:      "#1a1a1a"

  # Primary — blue for all UI chrome, headers, labels, focus
  primary:          "#6699ff"      # CSS: --nw-primary
  primary-dim:      "#4477cc"      # CSS: --nw-primary-dim
  primary-hot:      "#99bbff"      # CSS: --nw-primary-hot
  primary-fill:     "rgba(102,153,255,0.08)"  # CSS: --nw-primary-fill

  # Success / Data — green for all data values and positive states
  success:          "#7aed7a"      # CSS: --nw-green
  success-dim:      "#5cb85c"      # CSS: --nw-green-dim
  success-faint:    "rgba(122,237,122,0.06)"  # CSS: --nw-green-faint
  success-fill:     "rgba(122,237,122,0.1)"   # CSS: --nw-green-fill

  # Info — cyan for metadata, secondary info, wireframes
  info:             "#66ddff"      # CSS: --nw-cyan
  info-dim:         "#44aacc"      # CSS: --nw-cyan-dim
  info-glow:        "rgba(102,221,255,0.12)"  # CSS: --nw-cyan-glow

  # Danger — pink-red for errors, destructive actions, offline
  danger:           "#ff6688"      # CSS: --nw-red
  danger-dim:       "#cc4466"      # CSS: --nw-red-dim
  danger-hot:       "#ff99aa"      # CSS: --nw-red-hot
  danger-fill:      "rgba(255,102,136,0.15)"  # CSS: --nw-red-fill

  # Warning — amber for caution, pending, degraded
  warning:          "#e8993a"      # CSS: --nw-yellow
  warning-dim:      "#b8732a"      # CSS: --nw-yellow-dim
  warning-fill:     "rgba(232,153,58,0.1)"    # CSS: --nw-yellow-fill

  # Accent — purple for AI elements, highlights
  accent:           "#b266e0"      # CSS: --nw-purple
  accent-dim:       "#8844bb"      # CSS: --nw-purple-dim
  accent-fill:      "rgba(178,102,224,0.1)"   # CSS: --nw-purple-fill

  # Text
  on-surface:       "#ffffff"      # CSS: --nw-text
  on-surface-dim:   "#aaaaaa"      # CSS: --nw-text-dim
  on-surface-faint: "rgba(255,255,255,0.06)"  # CSS: --nw-text-faint
  on-surface-line:  "rgba(255,255,255,0.12)"  # CSS: --nw-text-line

typography:
  # System / Data — all body text, data readouts, code
  sys:
    fontFamily: "'JetBrains Mono', 'Cascadia Mono', monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5

  # Display / Title — cinematic headings only, compressed with scaleX(0.82)
  title:
    fontFamily: "'Noto Serif Display', 'Times New Roman', serif"
    fontSize: "32px"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "0.2em"
    transform: "scaleX(0.82)"
    textTransform: "uppercase"

  # Stamp — labels, badges, tags, button text
  stamp:
    fontFamily: "'Saira Extra Condensed', 'Impact', sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
    textTransform: "uppercase"

  # Mincho — Japanese accent characters only (decorative)
  mincho:
    fontFamily: "'Shippori Mincho B1', 'YuMincho', serif"
    fontSize: "14px"
    fontWeight: 800

  scale:
    xs:   "11px"
    sm:   "12px"
    base: "14px"
    lg:   "16px"
    xl:   "20px"
    2xl:  "24px"
    3xl:  "32px"

spacing:
  sp-1:  "4px"
  sp-2:  "8px"
  sp-3:  "12px"
  sp-4:  "16px"
  sp-6:  "24px"
  sp-8:  "32px"
  sp-12: "48px"
  sp-16: "64px"
  panel-gap: "2px"   # signature gap between adjacent panels

rounded:
  none: "0px"        # default — panels, tables, data containers
  sm:   "2px"        # badges, tags
  md:   "4px"        # buttons, inputs
  lg:   "8px"        # cards, modals
  full: "9999px"     # pills, avatars, LEDs

components:
  panel:
    background: "{colors.void-warm}"
    border: "1px solid {colors.on-surface-faint}"
    borderRadius: "{rounded.none}"
    headerFont: "10px uppercase {colors.primary}, letter-spacing 0.14em"
    headerBorder: "1px solid {colors.primary-dim}"

  card:
    background: "{colors.void-warm}"
    border: "1px solid {colors.on-surface-faint}"
    borderRadius: "{rounded.lg}"

  button-primary:
    background: "{colors.primary}"
    color: "{colors.void}"
    font: "{typography.stamp}"
    borderRadius: "{rounded.md}"
    padding: "8px 16px"

  button-ghost:
    background: "transparent"
    color: "{colors.primary}"
    border: "1px solid {colors.primary-dim}"
    borderRadius: "{rounded.md}"

  button-danger:
    background: "{colors.danger}"
    color: "{colors.void}"
    borderRadius: "{rounded.md}"

  metric-cell:
    background: "{colors.void-warm}"
    labelSize: "9px"
    labelColor: "{colors.primary}"
    valueSize: "20px"
    valueColor: "{colors.success}"
    valueGlow: "0 0 6px rgba(122,237,122,0.4)"

  led:
    size: "6px"
    shape: "circle"
    green: "{colors.success} with glow"
    blue:  "{colors.primary} with glow"
    red:   "{colors.danger} with glow"
    yellow: "{colors.warning} with glow"

  nw-table:
    headerSize: "9px"
    headerColor: "{colors.primary}"
    cellColor: "{colors.success}"
    rowHover: "{colors.success-faint}"

  skeleton:
    background: "{colors.void-panel}"
    animation: "neon blue shimmer, 1.2s ease-in-out infinite"

  sidebar:
    width: "240px"
    background: "{colors.void-warm}"
    border: "1px solid {colors.on-surface-faint}"
    itemPadding: "{spacing.sp-2} {spacing.sp-4}"
    activeBorderLeft: "2px solid {colors.primary}"
    activeBg: "{colors.primary-fill}"

  toast:
    background: "{colors.void-panel}"
    borderLeftWidth: "3px"
    padding: "{spacing.sp-3} {spacing.sp-4}"
    borderRadius: "{rounded.none}"

  modal:
    background: "{colors.void-panel}"
    border: "1px solid {colors.primary-dim}"
    backdropColor: "rgba(0,0,0,0.8)"
    maxWidth: "480px"
    borderRadius: "{rounded.lg}"

  progress:
    height: "4px"
    background: "{colors.void-panel}"
    fillColor: "{colors.success}"
    fillGlow: "0 0 4px rgba(122,237,122,0.3)"

  input:
    background: "{colors.void-panel}"
    border: "1px solid {colors.on-surface-line}"
    borderRadius: "{rounded.md}"
    padding: "{spacing.sp-2} {spacing.sp-3}"
    focusBorder: "{colors.primary}"
    focusGlow: "0 0 0 3px {colors.primary-fill}"

  navbar:
    height: "auto"
    background: "{colors.void}"
    borderBottom: "1px solid {colors.on-surface-faint}"
    padding: "12px 24px"
    font: "{typography.stamp}"

  footer:
    background: "{colors.void}"
    borderTop: "1px solid {colors.on-surface-faint}"
    padding: "{spacing.sp-6} {spacing.sp-8}"
    font: "{typography.sys}"
    fontSize: "12px"
    color: "{colors.on-surface-dim}"

  input-error:
    border: "1px solid {colors.danger}"
    helperColor: "{colors.danger}"
    helperSize: "11px"

  input-success:
    border: "1px solid {colors.success}"
    helperColor: "{colors.success}"
    helperSize: "11px"

  states:
    focus-ring: "2px solid {colors.primary}"
    focus-offset: "2px"
    disabled-opacity: "0.4"
    hover-transition: "150ms ease"

breakpoints:
  mobile:  "640px"
  tablet:  "1024px"
  desktop: "1280px"

  responsive-rules:
    - "Operations console collapses to vertical stack below tablet"
    - "Sidebar becomes hamburger drawer below mobile"
    - "dash-right becomes full-width below tablet"
    - "grid-2/3/4 collapse to single column below mobile"

motion:
  duration-fast:  "150ms"
  duration-base:  "250ms"
  duration-slow:  "400ms"
  easing-standard: "cubic-bezier(0.4, 0.0, 0.2, 1)"
  easing-decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)"

animations:
  ticker-scroll:    { duration: "80s",   timing: "linear",     iteration: "infinite" }
  led-blink:        { duration: "1.2s",  timing: "ease-in-out", iteration: "infinite" }
  skeleton-shimmer: { duration: "1.2s",  timing: "ease-in-out", iteration: "infinite" }
  transition-base:  { duration: "150ms", timing: "ease",        iteration: "1" }
---

# Nightwire Design System

## Visual Identity

Nightwire is a **cyberpunk aesthetic system** that works at any information density and for any type of interface — portfolios, blogs, landing pages, SaaS products, documentation sites, dashboards, admin panels, and operations consoles.

The aesthetic is consistent across all use cases. The layout adapts to the project. A personal portfolio uses the same tokens, fonts, and components as a dense monitoring dashboard — the difference is in how you arrange them.

**Emotional tone:** Calm precision. The quiet confidence of a system that knows exactly what it's doing.

**Visual references:**
- NERV command center from Evangelion — dense panels, kanji labels, compressed serif titles
- Ghost in the Shell — monospace data, neon on void, information density
- Blade Runner terminals — soft neon, never harsh, always readable

**NOT:**
- Apple design (too clean, too much whitespace)
- Material Design (too rounded, too colorful)
- Generic SaaS dashboards (too spacious, too generic)
- Cyberpunk 2077 UI (too flashy, too decorative)

---

## Core Principles

1. **Pure black void.** Background is always `#000000`. Never gray, never navy, never `#0d0d0d`.
2. **Color = function.** Blue=UI chrome, Green=data values, Red=danger, Cyan=info. Never decorative.
3. **2px panel gaps.** Adjacent panels are separated by exactly 2px. Not 8px, not 16px. 2px.
4. **Sharp edges.** Panels and data containers have `border-radius: 0`. Cards may use `radius-lg`.
5. **Kanji as style.** Japanese characters appear as decorative tags on panel headers — not for translation, for aesthetic.
6. **Compressed serif titles.** Display headings use Noto Serif Display with `scaleX(0.82)` compression.
7. **No shadows.** Elevation is communicated through surface color progression only.
8. **Monospace everywhere.** All body text, data, labels use JetBrains Mono.

---

## Layout Architecture

### Two modes — choose one:

**1. Standard scrolling layout** (portfolios, blogs, docs sites)
Use standard HTML flow. Apply Nightwire components (`.panel`, `.btn`, `.nw-table`) within your own layout.

**2. Operations Console** (dashboards, admin panels, monitoring UIs)
Full-viewport, no scroll on the outer wrapper. Dense panel grid with 2px gaps.

```html
<!-- Operations Console structure -->
<div class="console-wrapper">
  <nav class="nw-nav">
    <div class="org-mark">
      SYSTEM NAME
      <span class="sub">System subtitle — descriptor</span>
    </div>
    <span style="font-family:var(--font-mincho)">システム名</span>
    <div class="nav-links">...</div>
  </nav>

  <!-- Scrolling ticker bar -->
  <div class="ticker">
    <div class="scroll">STATUS: NOMINAL │ 稼働中 │ TOKEN: 42 │ ...</div>
  </div>

  <!-- Main dashboard grid -->
  <div class="dashboard">
    <div class="dash-left">
      <div class="dash-row r1">
        <div class="panel">
          <div class="panel-header">
            <span>PANEL TITLE</span>
            <span class="tag">日本語</span>
          </div>
          <div class="panel-body">...</div>
        </div>
      </div>
    </div>
    <div class="dash-right">
      <!-- Event log, status panels -->
    </div>
  </div>

  <div class="status-bar">
    <span><span class="led green"></span> SYSTEM ONLINE</span>
    <span>NODES: 42 │ UPTIME: 99.9%</span>
    <span>14:32:07 JST</span>
  </div>
</div>
```

Operations Console CSS (add alongside nightwire.css):
```css
.console-wrapper { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.nw-nav { display: flex; align-items: center; padding: 10px 16px; background: var(--void); border-bottom: 1px solid var(--nw-primary-dim); flex-shrink: 0; }
.dashboard { display: flex; gap: 2px; flex: 1; padding: 2px; min-height: 0; }
.dash-left { flex: 1; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
.dash-right { width: 370px; min-width: 370px; display: flex; flex-direction: column; gap: 2px; }
.dash-row { display: grid; gap: 2px; flex-shrink: 0; }
.dash-row.r1 { grid-template-columns: 1.2fr 1fr; min-height: 360px; }
.dash-row.r2 { grid-template-columns: 1fr 1fr; }
.status-bar { display: flex; justify-content: space-between; padding: 3px 12px; font-size: 7px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--nw-text-dim); border-top: 1px solid var(--nw-text-faint); flex-shrink: 0; }
```

---

## Panel Header Pattern

Every panel header follows this exact pattern:
- 8-10px uppercase monospace label in `--nw-primary`
- Japanese kanji tag on the right in `--nw-text-dim`
- `1px solid --nw-primary-dim` bottom border

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

---

## Data Display Patterns

### Metrics Grid
```html
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
```

### Event Log
```html
<div class="event-log">
  <div class="el-header">
    <span>EVENT LOG</span>
    <span class="el-count">42 entries</span>
  </div>
  <div class="el-body">
    <div class="ev">
      <span class="ev-time">14:32:07.421</span>
      <span class="ev-type system">system</span>
      <span class="ev-detail">Component tree reconciled</span>
      <span class="ev-metric">12.4ms</span>
    </div>
  </div>
</div>
```

### Node Card
```html
<div class="panel">
  <div class="panel-header"><span>NODE ALPHA</span><span class="tag">ノード</span></div>
  <div class="node-card">
    <div class="nc-id">Cluster-Alpha — H100 x 512</div>
    <div class="nc-name">深層学習訓練クラスタ</div>
    <div class="nc-row"><span class="lbl">STATUS</span><span class="val">Training</span></div>
    <div class="nc-row"><span class="lbl">GPU UTIL</span><span class="val">96.8%</span></div>
    <div class="nc-status" style="color:var(--nw-green)"><span class="led green"></span> Operational</div>
  </div>
</div>
```

---

## Typography Usage

| Context | Font | Class/Variable |
|---|---|---|
| All body text, data | JetBrains Mono | `var(--font-sys)` |
| Page/section titles | Noto Serif Display + scaleX(0.82) | `.compressed-title` |
| Buttons, badges, tags | Saira Extra Condensed | `var(--font-stamp)` |
| Japanese decorative text | Shippori Mincho B1 | `var(--font-mincho)` |

Compressed title usage:
```html
<div class="compressed-title" style="font-size:32px; color:var(--nw-primary)">
  NIGHTWIRE
</div>
<div style="font-family:var(--font-mincho); font-size:14px; color:var(--nw-primary-dim)">
  設計体系
</div>
```

## Typography Hierarchy for Content

For long-form content (blogs, articles, documentation):

| Element | Font | Size | Color | Notes |
|---|---|---|---|---|
| H1 | `--font-title` + `.compressed-title` | 36-48px | `--nw-primary` | scaleX(0.82) |
| H2 | `--font-title` | 24px | `--nw-cyan` | scaleX(0.82), uppercase |
| H3 | `--font-sys` | 16px | `--nw-primary` | uppercase, letter-spacing |
| Body | `--font-sys` | 14-15px | `--nw-text-dim` | 1.6 line-height |
| Caption | `--font-sys` | 11px | `--nw-text-dim` | uppercase, letter-spacing |
| Code inline | `--font-sys` | 13px | `--nw-green` | void-panel bg |
| Blockquote | `--font-sys` | 14px | `--nw-text-dim` | primary-dim left border |

```html
<!-- Article heading hierarchy -->
<h1 class="compressed-title" style="font-size:40px; color:var(--nw-primary)">ARTICLE TITLE</h1>
<h2 style="font-family:var(--font-title); font-size:24px; font-weight:800; letter-spacing:0.15em; text-transform:uppercase; color:var(--nw-cyan); transform:scaleX(0.82); transform-origin:left">Section Heading</h2>
<h3 style="font-family:var(--font-sys); font-size:16px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-primary)">Subsection</h3>
<p style="font-size:14px; line-height:1.6; color:var(--nw-text-dim)">Body paragraph text.</p>
<blockquote style="border-left:3px solid var(--nw-primary-dim); padding-left:16px; color:var(--nw-text-dim); font-style:italic">Quoted text</blockquote>
<code style="background:var(--void-panel); color:var(--nw-green); padding:2px 6px; font-family:var(--font-sys)">inline code</code>
```

---

## Color Usage Rules

| Color | Variable | Use ONLY for |
|---|---|---|
| Blue `#6699ff` | `--nw-primary` | Headers, labels, active states, links, UI chrome |
| Green `#7aed7a` | `--nw-green` | Data values, success states, online indicators |
| Cyan `#66ddff` | `--nw-cyan` | Metadata, secondary info, wireframe elements |
| Red `#ff6688` | `--nw-red` | Errors, destructive actions, offline states |
| Yellow `#e8993a` | `--nw-yellow` | Warnings, pending, degraded states |
| Purple `#b266e0` | `--nw-purple` | AI elements, accent highlights |

---

## Do's and Don'ts

**DO:**
- Use `#000000` for all page backgrounds — never `#0d0d0d`, `#111`, or any gray
- Use 2px gaps between adjacent panels — always
- Add Japanese kanji tags to every panel header
- Use green for all data values (numbers, percentages, metrics)
- Use blue for all UI chrome (headers, labels, navigation)
- Use `scaleX(0.82)` on Noto Serif Display titles
- Use `font-variant-numeric: tabular-nums` on all numeric data
- Use uppercase + letter-spacing for all labels and UI chrome

**DON'T:**
- Use `box-shadow` for elevation — use surface color progression
- Use `border-radius` on panels or data containers — sharp edges only
- Use color decoratively — every color must carry semantic meaning
- Use font sizes below 11px — readability is non-negotiable
- Use gradients on backgrounds
- Use CRT effects (scanlines, vignette, flicker)
- Use harsh neon (`#00ff00`, `#0000ff`) — use soft neon (`#7aed7a`, `#6699ff`)
- Mix sharp and rounded corners within the same component
- Use light mode — Nightwire is dark-only by design
- Use whitespace for "breathing room" — embrace density

---

## Elevation System

No shadows. Depth through surface color only:

| Level | Token | Hex | Use |
|---|---|---|---|
| 0 | `--void` | `#000000` | Page background |
| 1 | `--void-warm` | `#0a0a0a` | Panels, cards |
| 2 | `--void-panel` | `#111111` | Modals, inputs, raised panels |
| 3 | `--void-raised` | `#1a1a1a` | Dropdowns, tooltips |

---

## Installation

```html
<!-- 1. Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Saira+Extra+Condensed:wght@400;600;700;800&family=Shippori+Mincho+B1:wght@500;700;800&display=swap" rel="stylesheet">

<!-- 2. CSS -->
<link rel="stylesheet" href="nightwire.css">
```

Tailwind:
```js
import nightwirePreset from 'nightwire/tailwind.preset.js'
export default { presets: [nightwirePreset] }
```

---
version: "1.0"
name: Nightwire
description: >
  A dark-mode-only cyberpunk UI design system. Pure black backgrounds (#000000),
  soft neon palette, monospace typography. Inspired by Evangelion NERV operations
  centers and Ghost in the Shell. Dense, data-rich, zero decorative waste.

# <generated:colors> — from src/tokens/tokens.json via `npm run build:tokens`. Do not edit.
colors:
  # Surfaces — elevation through tonal progression, never shadows
  void:             "#000000"
  void-warm:        "#0a0a0a"
  void-panel:       "#111111"
  void-raised:      "#1a1a1a"

  # Primary — blue for all UI chrome, headers, labels, focus
  primary:          "#6699ff"                    # CSS: --nw-primary
  primary-dim:      "#4477cc"                    # CSS: --nw-primary-dim
  primary-hot:      "#99bbff"                    # CSS: --nw-primary-hot
  primary-fill:     "rgba(102, 153, 255, 0.08)"  # CSS: --nw-primary-fill

  # Success / Data — green for all data values and positive states
  success:          "#7aed7a"                    # CSS: --nw-green
  success-dim:      "#5cb85c"                    # CSS: --nw-green-dim
  success-faint:    "rgba(122, 237, 122, 0.06)"  # CSS: --nw-green-faint
  success-fill:     "rgba(122, 237, 122, 0.1)"   # CSS: --nw-green-fill

  # Info — cyan for metadata, secondary info, wireframes
  info:             "#66ddff"                    # CSS: --nw-cyan
  info-dim:         "#44aacc"                    # CSS: --nw-cyan-dim
  info-glow:        "rgba(102, 221, 255, 0.12)"  # CSS: --nw-cyan-glow

  # Danger — pink-red for errors, destructive actions, offline
  danger:           "#ff6688"                    # CSS: --nw-red
  danger-dim:       "#cc4466"                    # CSS: --nw-red-dim
  danger-hot:       "#ff99aa"                    # CSS: --nw-red-hot
  danger-fill:      "rgba(255, 102, 136, 0.15)"  # CSS: --nw-red-fill

  # Warning — amber for caution, pending, degraded
  warning:          "#e8993a"                    # CSS: --nw-yellow (base) / --nw-warning (semantic alias)
  warning-dim:      "#b8732a"                    # CSS: --nw-yellow-dim
  warning-fill:     "rgba(232, 153, 58, 0.1)"    # CSS: --nw-yellow-fill

  # Accent — purple for AI elements, highlights
  accent:           "#b266e0"                    # CSS: --nw-purple
  accent-dim:       "#8844bb"                    # CSS: --nw-purple-dim
  accent-fill:      "rgba(178, 102, 224, 0.1)"   # CSS: --nw-purple-fill

  # Text
  on-surface:       "#ffffff"                    # CSS: --nw-text
  on-surface-dim:   "#aaaaaa"                    # CSS: --nw-text-dim
  on-surface-faint: "rgba(255, 255, 255, 0.08)"  # CSS: --nw-text-faint
  on-surface-line:  "rgba(255, 255, 255, 0.14)"  # CSS: --nw-text-line
# </generated:colors>

# <generated:typography> — from src/tokens/tokens.json via `npm run build:tokens`. Do not edit.
typography:
  # System / Data — all body text, data readouts, code
  sys:
    fontFamily: "'JetBrains Mono', 'Cascadia Mono', monospace"
    fontSize:   "14px"
    fontWeight: 400
    lineHeight: 1.5

  # Display / Title — cinematic headings only, compressed with scaleX(0.82)
  title:
    fontFamily:    "'Noto Serif Display', 'Times New Roman', serif"
    fontSize:      "32px"
    fontWeight:    900
    lineHeight:    1.1
    letterSpacing: "0.2em"
    transform:     "scaleX(0.82)"
    textTransform: "uppercase"

  # Stamp — labels, badges, tags, button text
  stamp:
    fontFamily:    "'Saira Extra Condensed', 'Impact', sans-serif"
    fontSize:      "12px"
    fontWeight:    700
    lineHeight:    1
    letterSpacing: "0.06em"
    textTransform: "uppercase"

  # Mincho — Japanese accent characters only (decorative)
  mincho:
    fontFamily: "'Shippori Mincho B1', 'YuMincho', serif"
    fontSize:   "14px"
    fontWeight: 800

  scale:
    xs:   "11px"
    sm:   "12px"
    base: "14px"
    lg:   "16px"
    xl:   "20px"
    2xl:  "24px"
    3xl:  "32px"
# </generated:typography>

# <generated:spacing> — from src/tokens/tokens.json via `npm run build:tokens`. Do not edit.
spacing:
  sp-1:      "4px"
  sp-2:      "8px"
  sp-3:      "12px"
  sp-4:      "16px"
  sp-6:      "24px"
  sp-8:      "32px"
  sp-12:     "48px"
  sp-16:     "64px"
  panel-gap: "2px"   # signature gap between adjacent panels
# </generated:spacing>

# <generated:rounded> — from src/tokens/tokens.json via `npm run build:tokens`. Do not edit.
rounded:
  none: "0"       # default — panels, tables, data containers
  sm:   "2px"     # badges, tags
  md:   "4px"     # buttons, inputs
  lg:   "8px"     # cards, modals
  full: "9999px"  # pills, avatars, LEDs
# </generated:rounded>

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
    animation: "neon blue shimmer, var(--nw-loop-shimmer) ease-in-out infinite"

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
    focus-ring: "2px solid var(--nw-focus-ring)"
    focus-offset: "2px"
    disabled-opacity: "0.4"
    hover-transition: "var(--nw-tick)"

  metrics-grid:
    display: "grid"
    gridTemplateColumns: "repeat(2, 1fr)"
    gap: "1px"
    separatorColor: "{colors.on-surface-faint}"

  event-log:
    background: "{colors.void-warm}"
    border: "1px solid {colors.on-surface-faint}"
    headerFont: "8px uppercase {colors.primary}"
    bodyFont: "9px {typography.sys.fontFamily}"
    rowPadding: "1px 10px"

  ticker:
    overflow: "hidden"
    whiteSpace: "nowrap"
    background: "{colors.void}"
    borderBottom: "1px solid {colors.on-surface-faint}"
    padding: "2px 0"
    fontSize: "9px"
    color: "{colors.primary}"

  org-mark:
    fontFamily: "{typography.title.fontFamily}"
    fontSize: "24px"
    fontWeight: 900
    letterSpacing: "0.25em"
    color: "{colors.primary}"
    textTransform: "uppercase"
    transform: "scaleX(0.82)"
    transformOrigin: "left center"

  compressed-title:
    fontFamily: "{typography.title.fontFamily}"
    fontWeight: 900
    letterSpacing: "0.2em"
    textTransform: "uppercase"
    transform: "scaleX(0.82)"
    transformOrigin: "left center"
    color: "{colors.primary}"
    lineHeight: 1.1

breakpoints:
  mobile:  "640px"
  tablet:  "1024px"
  desktop: "1280px"

  responsive-rules:
    - "Operations console collapses to vertical stack below tablet"
    - "Sidebar becomes hamburger drawer below mobile"
    - "dash-right becomes full-width below tablet"
    - "grid-2/3/4 collapse to single column below mobile"

# <generated:motion> — from src/tokens/tokens.json via `npm run build:tokens`. Do not edit.
motion:
  # Bare name = enter, -out = exit. Scaled by --nw-motion-scale; loop cycles scale inversely.
  tick:                "calc(150ms * var(--nw-motion-scale)) cubic-bezier(0.3, 0, 0.7, 1)"    # enter: clicks, toggles, micro-feedback
  sweep:               "calc(350ms * var(--nw-motion-scale)) cubic-bezier(0.2, 0.8, 0.2, 1)"  # enter: panels, modals, drawers
  uplink:              "calc(400ms * var(--nw-motion-scale)) cubic-bezier(0, 0.6, 0.4, 1)"    # enter: data load reveal

  tick-out:            "calc(100ms * var(--nw-motion-scale)) cubic-bezier(0.4, 0, 1, 1)"      # exit: shorter, accelerating (proposed final, pending approval)
  sweep-out:           "calc(250ms * var(--nw-motion-scale)) cubic-bezier(0.4, 0, 1, 1)"      # exit: shorter, accelerating (proposed final, pending approval)
  uplink-out:          "calc(300ms * var(--nw-motion-scale)) cubic-bezier(0.4, 0, 1, 1)"      # exit: shorter, accelerating (proposed final, pending approval)

  tick-duration:       "calc(150ms * var(--nw-motion-scale))"
  sweep-duration:      "calc(350ms * var(--nw-motion-scale))"
  uplink-duration:     "calc(400ms * var(--nw-motion-scale))"
  tick-ease:           "cubic-bezier(0.3, 0, 0.7, 1)"
  sweep-ease:          "cubic-bezier(0.2, 0.8, 0.2, 1)"
  uplink-ease:         "cubic-bezier(0, 0.6, 0.4, 1)"

  tick-out-duration:   "calc(100ms * var(--nw-motion-scale))"
  sweep-out-duration:  "calc(250ms * var(--nw-motion-scale))"
  uplink-out-duration: "calc(300ms * var(--nw-motion-scale))"
  tick-out-ease:       "cubic-bezier(0.4, 0, 1, 1)"
  sweep-out-ease:      "cubic-bezier(0.4, 0, 1, 1)"
  uplink-out-ease:     "cubic-bezier(0.4, 0, 1, 1)"

  stagger:             "calc(50ms * var(--nw-motion-scale))"                                  # delay between staggered items
  loop-spin:           "calc(800ms / var(--nw-motion-scale))"                                 # spinner cycle
  loop-shimmer:        "calc(1200ms / var(--nw-motion-scale))"                                # skeleton shimmer cycle
# </generated:motion>

# Durations come from the motion tokens above, never from a literal: they follow the intensity level
# and reduced motion.
animations:
  skeleton-shimmer: { duration: "var(--nw-loop-shimmer)", timing: "ease-in-out",         iteration: "infinite" }
  transition-base:  { duration: "var(--nw-tick-duration)", timing: "var(--nw-tick-ease)", iteration: "1" }
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
import nightwirePreset from '@cativo23/nightwire/tailwind.preset.js'
export default { presets: [nightwirePreset] }
```

---

## v2-alpha — Additive Architecture

> v2 is in flight on the `feature/v2-alpha` branch. The frontmatter above describes v1 (current default). This section describes the additive surface — nothing in v1 is removed or renamed.

### Token architecture in 3 layers

v1 mixes primitives and semantics in one layer. v2 separates them while keeping v1 as **Layer 1**:

| Layer | Purpose | Naming | Examples |
|---|---|---|---|
| 1 — Primitive | Raw values | `--nw-<hue>[-<step>]` | `--nw-primary`, `--nw-green`, `--void-warm` (v1 names preserved) |
| 2 — Semantic | Role references | `--nw-<role>[-<modifier>]` | `--nw-chrome`, `--nw-data`, `--nw-signal-error`, `--nw-ai` |
| 3 — Component | Per-component | `--nw-<component>-<prop>` | (consumer-defined) |

Layer 2 references Layer 1, so a v1 override propagates to v2 consumers automatically.

### Intensity system

A single attribute on `<html>` reconfigures glow strength, motion speed, density, padding, kanji visibility, and pulse state across all components:

```html
<html data-intensity="archive">    <!-- docs, blogs: glow off, more padding, no kanji -->
<html data-intensity="operator">   <!-- default: same as v1 -->
<html data-intensity="combat">     <!-- ops console: high glow, dense, fast pulse -->
```

Components read knobs, not hardcoded values:

```yaml
knobs:
  --nw-glow:           1          # multiplier for all box/text-shadow glows
  --nw-density:        1          # gap/spacing multiplier
  --nw-motion-scale:   1          # multiplies transition durations; loop cycles divide by it (not an off switch)
  --nw-pad-scale:      1          # padding multiplier (0.7 → 1.35)
  --nw-base-font:      14px       # body base
  --nw-pulse-state:    running    # LED pulse on/off
  --nw-loop-state:     running    # spinner and skeleton shimmer on/off
  --nw-pulse-speed:    1.4s
  --nw-panel-radius:   0          # softens to 2px in archive
  --nw-value-color:    var(--nw-data)  # dims in archive, brightens in combat
  --nw-kanji-display:  inline     # → none in archive
  --nw-header-gradient: subtle    # → none in archive, scanlines in combat
  --nw-label-spacing:  0.2em      # → 0.14em in archive
```

### Motion vocabulary

Three steps, each with an enter and an exit variant. The bare name is the enter variant; `-out`
is the exit variant (shorter, accelerating away). Of the enter curves, `sweep` and `uplink`
decelerate into place, while `tick` is a symmetric ease-in-out.

| Step | Use | Enter | Exit |
|------|-----|-------|------|
| `tick` | clicks, toggles, micro-feedback | `--nw-tick` (150ms) | `--nw-tick-out` |
| `sweep` | panels, modals, drawers | `--nw-sweep` (350ms) | `--nw-sweep-out` |
| `uplink` | data load reveal | `--nw-uplink` (400ms) | `--nw-uplink-out` |

The exit values and the final curves are provisional until the v3 direction board sets them. The
generated `motion` region in the frontmatter lists the current values.

- **Composites** (`--nw-sweep`, `--nw-sweep-out`) fill the `transition` shorthand slot:
  `transition: transform var(--nw-sweep)`.
- **Longhands** (`--nw-sweep-duration`, `--nw-sweep-ease`, `--nw-sweep-out-duration`,
  `--nw-sweep-out-ease`) build a transition piece by piece. A closing overlay needs the duration
  alone, to delay its `visibility` flip until the exit has finished:
  `transition: opacity var(--nw-sweep-out), visibility 0s linear var(--nw-sweep-out-duration)`.
- **Stagger**: `--nw-stagger` is the delay step between items revealed in sequence; multiply it
  by the item's index.
- **Loops**: `--nw-loop-spin` (800ms at scale 1) and `--nw-loop-shimmer` (1200ms) are the cycles of
  the button spinner and the skeleton shimmer, and `--nw-pulse-speed` (1.4s, 0.7s in combat) is the
  LED heartbeat. All three cycles scale inversely with `--nw-motion-scale`: archive (0.6) runs
  slower and calmer, combat (1.2) runs faster. `--nw-pulse-state` and `--nw-loop-state`
  (`running` | `paused`) are state-driven: the LED pulse reads the first, the spinner and the
  shimmer read the second.
- **The off switches.** `--nw-motion-scale` multiplies transition durations, and loops divide by it,
  so `0` zeroes the transitions, but for a loop it divides by zero. The cycle tokens stay
  `calc(800ms / 0)` and the browser clamps the duration to its largest finite time (Chrome and
  Firefox, checked): the loop keeps running, so it looks frozen on its first frame, neither paused
  nor at its end state. Treat the scale as a speed dial, not a switch. The real off switches for
  loops are `--nw-loop-state` and `--nw-pulse-state` set to `paused`.
  Reduced motion sets all three: scale `0`, loop state and pulse state `paused`.
- Keyframes: `nw-pulse` (used by `.led[data-pulse]`), `nw-spin`, `nw-uplink`, `skeleton-shimmer`.

Components read these tokens for every transition and animation: no component file carries a
duration of its own. `--nw-tick` drives clicks, hover and focus feedback, `--nw-uplink` the
`.uplink` reveal, and the overlays use the steps listed under the open-state contract below.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` wins at every intensity level, including `archive` and
`combat`. The build generates the block from the `reducedMotion` flag on the motion knobs
(`--nw-motion-scale: 0`, `--nw-pulse-state: paused`, `--nw-loop-state: paused`) and places it after
the intensity blocks, so no `data-intensity` value can override it. A backstop in
`base/accessibility.css` covers anything the knobs do not reach: it turns off every transition and
animation, on elements and on `::before` and `::after`, removes the `.btn`, `.btn-ghost` and
`.btn-danger` press shift, and shows `.uplink` children at their end state (they start at opacity 0
and only the animation reveals them).

Reduced motion changes how overlays move, not where they end up. Open and closed overlays switch
instantly and reach the same states as with motion on.

### Motion contract

- **Enter and exit are separate.** A component enters on the bare token (`--nw-sweep`) and leaves
  on the `-out` token (`--nw-sweep-out`). Each state carries its own `transition`: the closed rule
  holds the exit, the open rule holds the enter.
- **Overlays animate in and out.** Drawer, modal, command palette, dropdown, toast and tooltip
  fade, and where it applies move, through `opacity`, `transform` and `visibility`, so the exit is
  as smooth as the entrance.
- **Closed means inert, not removed.** A closed overlay is `visibility: hidden` and
  `pointer-events: none`. It is not clickable, not focusable and not in the accessibility tree, but
  it is not `display: none`: an overlay that sits in the flow, the toast, keeps its layout box and
  the space it takes. `visibility` flips at once on
  open and after the exit duration on close (`visibility 0s linear var(--nw-sweep-out-duration)`),
  which keeps the exit visible.
- **Re-opening mid-close reverses.** Every property transitions from its current value, and
  `visibility` becomes visible immediately, so toggling back while an overlay is still closing
  plays the enter from where it stands, with no flash.
- **First paint does not animate.** Overlays move by transition, never by animation on load, so a
  page that loads with an overlay open or closed shows it in that state straight away.

### Open-state contract

Overlays take a `data-open` attribute. The value is a string; React's `data-open={bool}` renders
`"true"` or `"false"`. The attribute sits on the element named below.

| Component | Element | Attribute absent | `"true"` | `"false"` | Motion |
|---|---|---|---|---|---|
| Drawer | `.drawer` and `.drawer-backdrop` | closed | open | closed | `sweep` / `sweep-out` |
| Modal | `.modal-backdrop` | closed | open | closed | `sweep` / `sweep-out` |
| Command palette | `.cmdk-backdrop` | closed | open | closed | `sweep` / `sweep-out` |
| Dropdown | `.dropdown` | open | open | closed | `tick` / `tick-out` |
| Toast | `.toast` | open | open | closed | `sweep` / `sweep-out` |
| Tooltip | `.tooltip` | closed, opens on `:hover` and `:focus-within` | open | closed, even on hover | `tick` / `tick-out` |

- Drawer, modal and command palette are closed unless told otherwise. Set `data-open="true"` to
  open them. The drawer has two parts, backdrop and panel, and each takes the attribute.
- Dropdown and toast keep their 2.x behaviour: with no attribute they are open, so existing markup
  renders as before. Only `data-open="false"` closes them.
- A closed toast keeps its layout box, so the toasts around it do not move up. Remove the element
  once the exit has finished if you want the space back.
- A tooltip opens on hover and when focus is inside it, so keyboard users get it too.
  `data-open="true"` pins it open and `data-open="false"` keeps it closed whatever the pointer or
  focus does.
- **Mount closed, then open.** An element inserted already open has no earlier style to transition
  from, so it appears without the enter animation (the first style never transitions). For a toast
  or dropdown you add at runtime, insert it with `data-open="false"`, then set `"true"` on a later
  frame: two nested `requestAnimationFrame` calls, since one can still run before the browser has
  computed the closed style. Drawer, modal and command palette are already closed on mount, so they
  only need the flip to `"true"`. Remove an overlay after its longest exit (350ms covers the sweep at
  every intensity: combat's `--nw-sweep-out` is 315ms), with a timer rather than `transitionend`,
  which does not fire under reduced motion.
- A closed tooltip is `visibility: hidden`, so its text is out of the accessibility tree. Wire it
  the usual way: the trigger gets `aria-describedby` pointing at the `.tooltip-content` `id`, and the
  content gets `role="tooltip"`. `aria-describedby` still reads hidden content.

### New components

```yaml
components-v2:
  # Forms
  field:           "{label, input, help}"
  switch:          "{checkbox, track, lbl}"
  check:           "{checkbox, box}"
  radio:           "{radio, box}"
  combo:           "{chip, x, input}"
  kbd:             "inline keyboard chip"
  seg:             "segmented control with aria-pressed"

  # Overlays
  drawer:          "{drawer-backdrop, drawer-header, drawer-body} right slide-in"
  cmdk:            "{cmdk-backdrop, cmdk, cmdk-section, cmdk-item}"
  modal-title:     "non-flex header label (companion to modal-header)"

  # Data display
  code-block:      "{tok-k, tok-s, tok-c, tok-n, tok-fn} syntax tokens"
  code-inline:     "inline code chip"
  diff:            "{ln, ln.add, ln.del, num, code-content}"
  steps:           "{step, step.done, step.current}"
  stat:            "{stat-label, stat-value, stat-delta, stat-spark}"

  # State & feedback
  empty:           "{glyph, head, sub}"
  ai-block:        "{ai-block-head, ai-block-body} purple-accented"
  led-state:       "[data-state=ok|warn|error|info|ai], [data-pulse]"
  banner:          "system-wide notice strip"

  # Tag & button variants
  tag-chrome:      "system/UI tag (blue)"
  tag-warn:        "degraded tag (amber)"
  tag-ai:          "AI/oracle tag (purple)"
  btn-success:     "green outline button"
  btn-ai:          "purple outline button"
  btn-icon:        "square icon-only button"
  btn-xs:          "extra small button"
  btn-lg:          "large button"
  btn-loading:     "spinner-prefixed button"

  # Layout primitives
  nw-frame:        "100vh flex column with overflow hidden"
  nw-stack:        "vertical flex with density-aware gap"
  nw-cluster:      "horizontal wrapping flex"
  nw-split:        "sidebar + main grid"
```

### Color-blind safety

v2 adds **state + shape + label** redundancy rather than relying on color alone:

- `.led[data-state="ok|warn|error|info|ai"]` carries the color
- Recommended companion: matching `.tag-*` or icon next to the LED
- Status text in monospace (`tabular-nums`) maintains alignment regardless of locale

### Backward compatibility contract

v2 promises:

1. No v1 token rename. `--nw-primary` stays `--nw-primary`.
2. No v1 class rename. `.btn` stays `.btn`.
3. No v1 component layout change. Existing HTML renders identically.
4. New v2 classes are opt-in by name.
5. Intensity is opt-in by attribute. Default behaves like v1.

A consumer can safely upgrade by replacing `nightwire.css` and continue using v1 markup, then incrementally adopt v2 classes/tokens where useful.

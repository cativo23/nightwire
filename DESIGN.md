---
version: "1.0"
name: Nightwire
description: >
  A dark-mode-only cyberpunk UI design system. Pure black backgrounds (#000000),
  neutral-first colour with soft neon kept for meaning, monospace typography, square
  corners and hairline edges. Inspired by Evangelion NERV operations centers and Ghost
  in the Shell. Dense, data-rich, zero decorative waste.

# <generated:colors> — from src/tokens/tokens.json via `npm run build:tokens`. Do not edit.
colors:
  # Surfaces — elevation through tonal progression; only overlays take the neutral --nw-elevation-overlay shadow
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
  accent-fill:      "rgba(178, 102, 224, 0.06)"  # CSS: --nw-purple-fill

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

  # Stamp — labels, badges, tags (buttons use the system font, bold uppercase)
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
  sm:   "2px"     # the v3 corner: buttons, inputs, tags, badges, cards, modals, code
  md:   "4px"     # no component reads it in v3; kept for consumers
  lg:   "8px"     # no component reads it in v3; kept for consumers
  full: "9999px"  # avatars, switches, skeleton circles
# </generated:rounded>

components:
  # Neutral-first: labels, borders and text sit on the grey ramp. Colour appears where it means
  # something (data, state, focus, the selected item). The bone action fill is --nw-action.
  panel:
    background: "{colors.void-warm}"
    border: "1px solid {colors.on-surface-line}"
    borderRadius: "{rounded.none}"
    headerFont: "10px uppercase {colors.on-surface-dim}, letter-spacing 0.14em"
    headerBorder: "1px solid {colors.on-surface-line}"

  card:
    background: "{colors.void-warm}"
    border: "1px solid {colors.on-surface-line}"
    borderRadius: "{rounded.sm}"

  button-primary:
    background: "#e6e6e6"                   # CSS: --nw-action (bone), hover --nw-action-hot #99bbff
    color: "{colors.void}"                  # CSS: --nw-action-text
    font: "{typography.sys} bold, uppercase"
    borderRadius: "{rounded.sm}"
    padding: "8px 16px"

  button-chrome:
    background: "{colors.primary}"
    color: "{colors.void}"
    borderRadius: "{rounded.sm}"

  button-ghost:
    background: "transparent"
    color: "#e6e6e6"                        # CSS: --nw-text-default
    border: "1px solid rgba(255, 255, 255, 0.36)"  # CSS: --nw-line-strong
    borderRadius: "{rounded.sm}"

  button-danger:
    background: "{colors.danger}"
    color: "{colors.void}"
    borderRadius: "{rounded.sm}"

  metric-cell:
    background: "{colors.void-warm}"
    labelSize: "9px"
    labelColor: "{colors.on-surface-dim}"
    valueSize: "20px"
    valueColor: "{colors.success}"
    valueGlow: "none"

  led:
    size: "6px"
    shape: "circle"
    ok:     "{colors.success} with state glow"
    active: "{colors.primary} with state glow"
    error:  "{colors.danger} with state glow"
    warn:   "{colors.warning} with state glow"
    info:   "{colors.info} with state glow"
    ai:     "{colors.accent} with state glow"
    glow:   "calc(8px * var(--nw-led-glow))"

  nw-table:
    headerSize: "9px"
    headerColor: "{colors.on-surface-dim}"
    cellColor: "#e6e6e6"                    # CSS: --nw-text-default
    rowHover: "{colors.on-surface-faint}"

  skeleton:
    background: "{colors.void-panel}"
    animation: "neutral shimmer, var(--nw-loop-shimmer) ease-in-out infinite"

  sidebar:
    width: "240px"
    background: "{colors.void-warm}"
    border: "1px solid {colors.on-surface-faint}"
    itemPadding: "{spacing.sp-2} {spacing.sp-4}"
    activeBorderLeft: "2px solid {colors.primary}"
    activeBg: "{colors.primary-fill}"

  toast:
    background: "{colors.void-panel}"
    border: "1px solid rgba(255, 255, 255, 0.36)"  # CSS: --nw-line-strong, as the modal
    borderLeftWidth: "2px"                         # CSS: --nw-accent-width; the variant colour sits here
    padding: "{spacing.sp-3} {spacing.sp-4}"
    borderRadius: "{rounded.none}"

  modal:
    background: "{colors.void-panel}"
    border: "1px solid rgba(255, 255, 255, 0.36)"  # CSS: --nw-line-strong
    backdropColor: "rgba(0,0,0,0.8)"
    maxWidth: "480px"
    borderRadius: "{rounded.sm}"
    elevation: "var(--nw-elevation-overlay)"       # 0 24px 64px rgba(0, 0, 0, 0.7)

  progress:
    height: "4px"
    background: "{colors.void-panel}"
    border: "1px solid {colors.on-surface-line}"
    fillColor: "{colors.success}"
    fillGlow: "0 0 calc(4px * var(--nw-progress-glow)) rgba(122,237,122,0.3)"

  input:
    background: "{colors.void-panel}"
    border: "1px solid rgba(255, 255, 255, 0.36)"  # CSS: --nw-line-strong (3:1 control boundary)
    borderRadius: "{rounded.sm}"
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
    headerFont: "8px uppercase {colors.on-surface-dim}"
    bodyFont: "9px {typography.sys.fontFamily}"
    rowPadding: "1px 10px"

  ticker:
    overflow: "hidden"
    whiteSpace: "nowrap"
    background: "{colors.void}"
    borderBottom: "1px solid {colors.on-surface-faint}"
    padding: "2px 0"
    fontSize: "9px"
    color: "{colors.on-surface-dim}"

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

  tick-out:            "calc(100ms * var(--nw-motion-scale)) cubic-bezier(0.4, 0, 1, 1)"      # exit: shorter, accelerating
  sweep-out:           "calc(250ms * var(--nw-motion-scale)) cubic-bezier(0.4, 0, 1, 1)"      # exit: shorter, accelerating
  uplink-out:          "calc(300ms * var(--nw-motion-scale)) cubic-bezier(0.4, 0, 1, 1)"      # exit: shorter, accelerating

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
# and reduced motion. At operator, tick is 150ms and the shimmer cycle 1200ms.
animations:
  skeleton-shimmer: { duration: "var(--nw-loop-shimmer)", timing: "ease-in-out",         iteration: "infinite" }
  transition-base:  { duration: "var(--nw-tick-duration)", timing: "var(--nw-tick-ease)", iteration: "1" }
---

# Nightwire Design System

## Visual Identity

Nightwire is a **cyberpunk aesthetic system** that works at any information density and for any type of interface — portfolios, blogs, landing pages, SaaS products, documentation sites, dashboards, admin panels, and operations consoles.

The aesthetic is consistent across all use cases. The layout adapts to the project. A personal portfolio uses the same tokens, fonts, and components as a dense monitoring dashboard — the difference is in how you arrange them.

**The v3 look in one paragraph.** Neutral first: labels, hairlines and default text sit on the grey ramp, and colour appears only where it carries meaning (data values, state, focus, the selected item). Corners are square (`--radius-sm`, 2px, on every control; panels are 0). Edges are 1px hairlines. There is one solid action per view, in bone (`.btn`, `--nw-action`), and every other button is an outline, except the two deliberate solids: `.btn-danger` (red, destructive) and `.btn-chrome` (blue, UI-chrome actions). Nothing glows for decoration: glow is a state signal (LED, check, switch, segmented, steps, progress), it is off at `archive`, and it never rises at `combat` except on those signals. The four typefaces, the kanji labels, the compressed serif title and the three intensities are unchanged.

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
2. **Neutral first, colour = function.** Text and edges are neutral. Blue marks focus, accents and chrome actions, green marks data, red danger, cyan info, amber warning, purple AI. Never decorative.
3. **2px panel gaps.** Adjacent panels are separated by exactly 2px. Not 8px, not 16px. 2px.
4. **Square corners.** Panels and data containers have `border-radius: 0`. Controls, cards and modals use `--radius-sm` (2px). Round shapes (`--radius-full`) are for avatars, switches and spinners only.
5. **Kanji as style.** Japanese characters appear as decorative tags on panel headers — not for translation, for aesthetic.
6. **Compressed serif titles.** Display headings use Noto Serif Display with `scaleX(0.82)` compression.
7. **Elevation is tone, not shadow.** Surfaces rise through colour progression. The only drop shadow is the neutral `--nw-elevation-overlay` on overlays (modal, drawer, command palette). Glow is a state signal and nothing else.
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
    <span><span class="led" data-state="ok"></span> SYSTEM ONLINE</span>
    <span>NODES: 42 │ UPTIME: 99.9%</span>
    <span>14:32:07 JST</span>
  </div>
</div>
```

Operations Console CSS (add alongside nightwire.css):
```css
.console-wrapper { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.nw-nav { display: flex; align-items: center; padding: 10px 16px; background: var(--void); border-bottom: 1px solid var(--nw-line); flex-shrink: 0; }
.dashboard { display: flex; gap: 2px; flex: 1; padding: 2px; min-height: 0; }
.dash-left { flex: 1; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
.dash-right { width: 370px; min-width: 370px; display: flex; flex-direction: column; gap: 2px; }
.dash-row { display: grid; gap: 2px; flex-shrink: 0; }
.dash-row.r1 { grid-template-columns: 1.2fr 1fr; min-height: 360px; }
.dash-row.r2 { grid-template-columns: 1fr 1fr; }
.status-bar { display: flex; justify-content: space-between; padding: 3px 12px; font-size: 7px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--nw-text-mute); border-top: 1px solid var(--nw-text-faint); flex-shrink: 0; }
```

---

## Panel Header Pattern

Every panel header follows this exact pattern:
- 8-10px uppercase monospace label in `--nw-text-mute` (neutral; blue is not used for labels)
- Japanese kanji tag on the right; a `.kanji` inside the header is `--nw-text-default`, set with `:where()` so a colour utility on it still wins
- `1px solid --nw-line` bottom border (a neutral hairline)

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
    <div class="nc-status" style="color:var(--nw-green)"><span class="led" data-state="ok"></span> Operational</div>
  </div>
</div>
```

---

## Typography Usage

| Context | Font | Class/Variable |
|---|---|---|
| All body text, data | JetBrains Mono | `var(--font-sys)` |
| Page/section titles | Noto Serif Display + scaleX(0.82) | `.compressed-title` |
| Badges, tags, field and stat labels | Saira Extra Condensed | `var(--font-stamp)` |
| Buttons | JetBrains Mono, bold uppercase | `var(--font-sys)` |
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
| Code inline | `--font-sys` | 13px | `--nw-text-default` | void-panel bg |
| Blockquote | `--font-sys` | 14px | `--nw-text-dim` | primary-dim left border |

```html
<!-- Article heading hierarchy -->
<h1 class="compressed-title" style="font-size:40px; color:var(--nw-primary)">ARTICLE TITLE</h1>
<h2 style="font-family:var(--font-title); font-size:24px; font-weight:800; letter-spacing:0.15em; text-transform:uppercase; color:var(--nw-cyan); transform:scaleX(0.82); transform-origin:left">Section Heading</h2>
<h3 style="font-family:var(--font-sys); font-size:16px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--nw-primary)">Subsection</h3>
<p style="font-size:14px; line-height:1.6; color:var(--nw-text-dim)">Body paragraph text.</p>
<blockquote style="border-left:3px solid var(--nw-primary-dim); padding-left:16px; color:var(--nw-text-dim); font-style:italic">Quoted text</blockquote>
<code class="code-inline">inline code</code>
```

---

## Color Usage Rules

| Color | Variable | Use ONLY for |
|---|---|---|
| Bone `#e6e6e6` | `--nw-action` | The single solid action (`.btn`); hover `--nw-action-hot` (`#99bbff`), text `--nw-action-text` (`#000000`) |
| Neutral `#aaaaaa` | `--nw-text-mute` | Labels: panel, card, modal and table headers, field labels, stat and metric labels |
| Neutral `#e6e6e6` | `--nw-text-default` | Body and table text, kanji in headers, `.code-inline`, `.kv-value`, menu items |
| Blue `#6699ff` | `--nw-primary` (`--nw-chrome`) | Focus rings, the selected-tab and current-item accent lines, links, compressed titles, `.btn-chrome`, `.tag-chrome`, `data-state="active"` |
| Green `#7aed7a` | `--nw-green` | Data values (stat and metric values), success states, online indicators |
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
- Use green for data values (stat and metric numbers, percentages); table text is content and stays neutral
- Keep labels and headers neutral (`--nw-text-mute`); keep blue for focus, accents and chrome actions
- Offer one solid action per view (`.btn`, bone) and make the rest outlines (`.btn-ghost`, `.btn-success`, `.btn-ai`)
- Put a glow only on state signals, and read the knob (`--nw-led-glow`, `--nw-control-glow`, `--nw-progress-glow`) instead of a literal blur
- Use `scaleX(0.82)` on Noto Serif Display titles
- Use `font-variant-numeric: tabular-nums` on all numeric data
- Use uppercase + letter-spacing for all labels and UI chrome

**DON'T:**
- Use `box-shadow` for elevation — use surface colour progression. The one exception is `--nw-elevation-overlay` on overlays
- Add a decorative glow or `text-shadow` to a heading, value or button — glow means state
- Use `border-radius` on panels or data containers — sharp edges only; controls take `--radius-sm`, never `--radius-md` or `--radius-lg` (no component reads them in v3)
- Use color decoratively — every color must carry semantic meaning
- Use font sizes below 11px — readability is non-negotiable
- Use gradients on backgrounds
- Use CRT effects (scanlines, vignette, flicker)
- Use harsh neon (`#00ff00`, `#0000ff`) — use soft neon (`#7aed7a`, `#6699ff`)
- Mix sharp and rounded corners within the same component
- Colour a label blue, or fill a default tag blue — blue is `.tag-chrome` and the accent lines
- Use the removed v1 forms (`.led.green`, `.tag-warning`, `.stack`, `.nw-progress .fill`): see "v3 — The contract"
- Use light mode — Nightwire is dark-only by design
- Use whitespace for "breathing room" — embrace density

---

## Elevation System

Depth is tone first. Surfaces rise through colour, and an overlay adds one neutral shadow:

| Level | Token | Hex | Use |
|---|---|---|---|
| 0 | `--void` | `#000000` | Page background |
| 1 | `--void-warm` | `#0a0a0a` | Panels, cards |
| 2 | `--void-panel` | `#111111` | Modals, inputs, raised panels |
| 3 | `--void-raised` | `#1a1a1a` | Dropdowns, tooltips |
| Overlay | `--nw-elevation-overlay` | `0 24px 64px rgba(0, 0, 0, 0.7)` | The modal, drawer and command palette panels |

`--nw-elevation-overlay` is black at 0.7 alpha, not a colour and not a glow, so it does not change
with intensity and it does not count as decoration. No other drop shadow exists. The only other
`box-shadow` and `text-shadow` values in the stylesheet are state glow (the LED, check, radio,
switch, segmented, steps and progress read `--nw-led-glow`, `--nw-control-glow` or
`--nw-progress-glow`), the `.glow-*` utilities (which read `--nw-glow`), the segmented control's inset marks (selected
indicator, plus its state glow on `--nw-control-glow`), and focus rings, which include the
`.field` input and `.combo` focus and status rings (primary, error, success).

Edges are hairlines. `--nw-hairline` (1px) is every structural border, `--nw-rule` (1.5px) the marks
drawn inside controls, `--nw-accent-width` (2px) the accent bars on tabs, sidebar items, diffs and
toasts. Three greys carry them: `--nw-text-faint` for quiet dividers, `--nw-line` for panel and
header edges, and `--nw-line-strong` for control boundaries (inputs, check, switch, segmented,
combo, kbd, modal, toast), which keeps a 3:1 contrast on the black surfaces (WCAG 1.4.11).
`npm run design:contrast` checks every pairing.

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

## v3 — Architecture and Contract

> v3 is a major release. It replaces the look of v2.1.0 everywhere (the visual identity above), adds
> the motion system, and removes the v1 compatibility surfaces that v2 kept. The frontmatter and the
> sections above describe v3. The last section, "The v3 contract", lists what changed for a
> consumer; the migration guide (`docs/migration/v3.md` in the repository, written in a later
> phase of this release) will walk through each change.

### Token architecture in 3 layers

Primitives and semantics live in separate layers. The v1 primitive names are **Layer 1** and stay:

| Layer | Purpose | Naming | Examples |
|---|---|---|---|
| 1 — Primitive | Raw values | `--nw-<hue>[-<step>]` | `--nw-primary`, `--nw-green`, `--void-warm` (v1 names preserved) |
| 2 — Semantic | Role references | `--nw-<role>[-<modifier>]` | `--nw-chrome`, `--nw-data`, `--nw-signal-error`, `--nw-ai`, `--nw-action`, `--nw-action-hot`, `--nw-action-text` |
| 3 — Component | Per-component knobs | `--nw-<component>-<prop>` | `--nw-led-glow`, `--nw-control-glow`, `--nw-progress-glow`; others are consumer-defined |

Layer 2 references Layer 1, so an override of a Layer 1 token propagates to Layer 2 consumers
automatically. `--nw-action` (the bone primary action fill, `var(--nw-text-default)`),
`--nw-action-hot` (its hover, `var(--nw-chrome-hot)`) and `--nw-action-text` (text on the fill,
`var(--void)`) are the role tokens `.btn` reads; each has a Tailwind mapping
(`nw.action.DEFAULT`, `nw.action.hot`, `nw.action.text`).

### Intensity system

A single attribute on `<html>` reconfigures glow strength, motion speed, density, padding, kanji visibility, and pulse state across all components:

```html
<html data-intensity="archive">    <!-- docs, blogs: no glow, more padding, no kanji -->
<html data-intensity="operator">   <!-- default: same as no attribute -->
<html data-intensity="combat">     <!-- ops console: state glow doubles, dense, faster pulse -->
```

Components read knobs, not hardcoded values:

```yaml
knobs:
  --nw-glow:           0.5        # base glow multiplier: 0 at archive, 0.5 at operator and combat (no combat override)
  --nw-led-glow:       var(--nw-glow)  # state glow of .led; combat: calc(var(--nw-glow) * 2), effective 1
  --nw-control-glow:   var(--nw-glow)  # state glow of check, radio, switch, segmented, steps; combat x2
  --nw-progress-glow:  var(--nw-glow)  # state glow of .nw-progress-fill; combat x2
  --nw-density:        1          # gap/spacing multiplier
  --nw-motion-scale:   1          # multiplies transition durations; loop cycles divide by it (not an off switch)
  --nw-pad-scale:      1          # padding multiplier (0.7 → 1.35)
  --nw-base-font:      14px       # body base
  --nw-pulse-state:    running    # LED pulse on/off
  --nw-loop-state:     running    # spinner and skeleton shimmer on/off
  --nw-pulse-speed:    1.6s       # LED heartbeat; no combat override (combat runs faster through --nw-motion-scale)
  --nw-hairline:       1px        # every structural border (no per-level overrides)
  --nw-rule:           1.5px      # marks drawn inside controls: check strokes, spinner ring
  --nw-accent-width:   2px        # accent bars: tabs, sidebar, diff, toast
  --nw-panel-radius:   0          # softens to 2px in archive
  --nw-value-color:    var(--nw-data)  # --nw-green-dim in archive and combat
  --nw-kanji-display:  inline     # → none in archive
  --nw-label-spacing:  0.2em      # → 0.14em in archive
```

Combat adds energy only through state signals (the three glow knobs double, so they read 1 against
operator's 0.5, still below v2.1.0's combat 2.2), the pulse and density. It does not thicken lines
or add decoration, and the header gradient and scanline knobs that v2 had at combat are removed. The
line knobs have no per-level overrides, but they exist so a level can set one later. Full table:
`docs/architecture/intensity.md` in the repository.

### Motion vocabulary

Three steps, each with an enter and an exit variant. The bare name is the enter variant; `-out`
is the exit variant (shorter, accelerating away). Of the enter curves, `sweep` and `uplink`
decelerate into place, while `tick` is a symmetric ease-in-out.

| Step | Use | Enter | Exit |
|------|-----|-------|------|
| `tick` | clicks, toggles, micro-feedback | `--nw-tick` (150ms) | `--nw-tick-out` (100ms) |
| `sweep` | panels, modals, drawers | `--nw-sweep` (350ms) | `--nw-sweep-out` (250ms) |
| `uplink` | data load reveal | `--nw-uplink` (400ms) | `--nw-uplink-out` (300ms) |

The exit values and curves are final: the maintainer approved them on the v3 direction board
(2026-11-18). Every exit is shorter than its enter and uses `cubic-bezier(0.4, 0, 1, 1)`. The
generated `motion` region in the frontmatter lists the values; durations shown here are at scale 1.

- **Composites** (`--nw-sweep`, `--nw-sweep-out`) fill the `transition` shorthand slot:
  `transition: transform var(--nw-sweep)`.
- **Longhands** (`--nw-sweep-duration`, `--nw-sweep-ease`, `--nw-sweep-out-duration`,
  `--nw-sweep-out-ease`) build a transition piece by piece. A closing overlay needs the duration
  alone, to delay its `visibility` flip until the exit has finished:
  `transition: opacity var(--nw-sweep-out), visibility 0s linear var(--nw-sweep-out-duration)`.
- **Stagger**: `--nw-stagger` is the delay step between items revealed in sequence; multiply it
  by the item's index.
- **Loops**: `--nw-loop-spin` (800ms at scale 1) and `--nw-loop-shimmer` (1200ms) are the cycles of
  the button spinner and the skeleton shimmer, and `--nw-pulse-speed` (1.6s at every level, no combat
  override) is the LED heartbeat. All three cycles scale inversely with `--nw-motion-scale`: archive
  (0.6) runs slower and calmer, combat (1.2) runs faster, so the pulse is 1.6s at operator and
  1.333s at combat. `--nw-pulse-state` and `--nw-loop-state`
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
- Dropdown and toast keep their v1 and v2 behaviour: with no attribute they are open, so existing
  markup renders as before. Only `data-open="false"` closes them.
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
  every intensity: combat's `--nw-sweep-out` is 300ms), with a timer rather than `transitionend`,
  which does not fire under reduced motion.
- A closed tooltip is `visibility: hidden`, so its text is out of the accessibility tree. Wire it
  the usual way: the trigger gets `aria-describedby` pointing at the `.tooltip-content` `id`, and the
  content gets `role="tooltip"`. `aria-describedby` still reads hidden content.

### Component families added in v2 (all kept in v3)

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
  led-state:       "[data-state=ok|warn|error|info|active|ai], [data-pulse]"
  banner:          "system-wide notice strip"

  # Tag & button variants
  tag-chrome:      "system/UI tag (blue); the default .tag is neutral"
  tag-warn:        "degraded tag (amber)"
  tag-ai:          "AI/oracle tag (purple)"
  btn-chrome:      "blue solid button; .btn itself is the bone solid"
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

Nightwire gives **state + shape + label** redundancy rather than relying on color alone:

- `.led[data-state="ok|warn|error|info|active|ai"]` carries the color
- Recommended companion: matching `.tag-*` or icon next to the LED
- Status text in monospace (`tabular-nums`) maintains alignment regardless of locale

### The v3 contract

Nightwire follows semver. v3 is a major, so it may change default rendering and remove names; the
promises below hold within v3.x, where a minor release only adds.

**What changed against v2.1.0.**

1. **The look.** Every component, at every intensity, moved to the visual identity above: neutral
   labels and hairlines, square corners, bone `.btn`, outline secondaries (`.btn-danger` and `.btn-chrome` stay solid), no decorative glow, a
   neutral default `.tag`, a `.toast` with a hairline boundary and a 2px accent. The values and
   reasons are in `docs/design/v3/direction.md` in the repository. Existing markup keeps
   working and renders the new look.
2. **Removed v1 surfaces (breaking).** Each has a v3 replacement:

   | Removed | Use instead |
   |---|---|
   | `.led.green`, `.led.yellow`, `.led.red`, `.led.blue` | `.led[data-state="ok"]`, `"warn"`, `"error"`, `"active"` |
   | `.tag-warning` | `.tag-warn` |
   | `.nw-progress .fill` | `.nw-progress-fill` |
   | `.stack` | `.nw-stack` (also honours `--nw-density`) |
   | `--nw-header-gradient`, `--nw-header-pattern` | none: panel headers have no gradient or scanlines at any level |

   `.led[data-state="active"]` is new (`--nw-chrome`); v1 `.led.blue` had no v2 equivalent. The
   migration is not pixel-identical: the v1 LED glow was `4px * --nw-glow`, the state glow is
   `8px * --nw-led-glow`. `docs/design/v3/v1-inventory.md` in the repository records
   each decision.
3. **New tokens.** `--nw-led-glow`, `--nw-control-glow`, `--nw-progress-glow`, `--nw-hairline`,
   `--nw-rule`, `--nw-accent-width`, `--nw-elevation-overlay`, `--nw-action`, `--nw-action-hot`,
   `--nw-action-text`.
4. **Changed token values.** `--nw-glow` 1 to 0.5 (combat 2.2 to 0.5), `--nw-pulse-speed` 1.4s to
   1.6s (combat 0.7s override removed), `--nw-text-faint` 0.06 to 0.08, `--nw-text-line` and
   `--nw-line` 0.12 to 0.14, `--nw-line-strong` 0.18 to 0.36, `--nw-purple-fill` 0.1 to 0.06. The
   exit durations are 100, 250 and 300ms (tick, sweep, uplink), each shorter than its enter.

**What stays.**

1. **Token names.** The v1 primitives (`--nw-primary`, `--nw-green`, `--void-warm`, ...) and the
   Layer 2 roles keep their names, except the two header knobs above.
2. **Class names.** Every class not in the removed table keeps its name. That includes
   `.modal-header`, `.badge-warning`, `.toast-warning`, `.tab.active`, `.tag-info` and the grid
   utilities.
3. **Open-state contract.** `data-open` works as the table above says. Dropdown and toast stay open
   when the attribute is absent, because markup written for v1 and v2 depends on it.
4. **Intensity is opt-in by attribute.** No attribute behaves as `operator`. Operator is no longer
   v1-identical: its glow is 0.5 instead of 1.
5. **Reduced motion wins** at every intensity.
6. **The package surface.** `package.json` still has no `exports`, `type` or `engines`; the Tailwind
   preset still emits literals, not `var()`. Those changes are tracked separately.

**Rules the refresh holds, and the tooling checks.**

- FR-013a: decorative sci-fi treatments (header gradients, scanlines, coloured ambient glow) are
  gone at every intensity.
- FR-013b: no glow at `archive`; at `operator` every remaining glow is weaker than in v2.1.0; at
  `combat` only state signals may exceed operator, and they stay below v2.1.0's combat.
  `scripts/parity/glow-check.mjs` enforces it over a parity run.
- FR-014: WCAG AA on the black surfaces (4.5:1 for text, 3:1 for boundaries and large text), checked
  by `npm run design:contrast`.
- FR-012: the four typefaces, kanji labels, compressed title and three intensities are the identity.
  They do not change in a refresh.

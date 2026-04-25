---
name: nightwire
description: "Use when building any dark-themed web UI or generating HTML/CSS with a cyberpunk aesthetic — dashboards, admin panels, dev tools, media players, monitoring UIs, or landing pages. Provides design tokens, semantic color roles, component classes, and utility CSS for dark-mode interfaces on pure black backgrounds."
---

# Nightwire — Cyberpunk UI System

A dark-mode-only design system with a modern cyberpunk aesthetic. Any interface that lives in the void.

**Usage:** Include `nightwire.css` for vanilla CSS, or use `tailwind.preset.js` with Tailwind CSS.

## When to Use

- User asks for a dark UI, cyberpunk-themed interface, or "hacker aesthetic"
- Building dashboards, admin panels, dev tools, monitoring UIs, landing pages
- Any project where the background should be pure black with neon-colored data
- **Don't use** for light-mode UIs, print-friendly layouts, or projects requiring a different design system

---

## Design Principles

1. **Pure black void.** Background is always `#000000`. No gray, no navy.
2. **Color = function.** Every color has a semantic role. Don't use color decoratively.
3. **Readable first.** 14px base font, 1.5 line-height. Legibility over density.
4. **No CRT effects.** No scanlines, no flicker, no vignette. Clean modern look.
5. **Soft neon.** Cyberpunk-inspired but not eye-burning. Vibrant, not harsh.
6. **Content-driven.** Every visual element serves a purpose. Minimize decoration.

---

## Color System

All colors are defined as CSS custom properties in `nightwire.css` with the `--nw-` prefix. Use semantic roles, not raw colors.

### Semantic Roles

| Role | Variable | Raw Color | Use For |
|---|---|---|---|
| Primary | `--nw-primary` | `#6699ff` blue | Headers, labels, actions, links |
| Success | `--nw-success` | `#7aed7a` green | Confirmations, positive data, online |
| Info | `--nw-info` | `#66ddff` cyan | Metadata, secondary actions, neutral |
| Danger | `--nw-danger` | `#ff6688` pink | Errors, destructive actions, offline |
| Warning | `--nw-warning` | `#e8993a` yellow | Caution, pending, degraded |
| Accent | `--nw-accent` | `#b266e0` purple | Highlights, badges, decorative |

Each role has `-dim` (muted), `-hot` (bright), `-fill` (translucent bg), and `-faint` (subtle bg) variants where applicable.

### Surfaces & Elevation

Stack surfaces to create depth. Higher = more light.

| Surface | Token | Hex | Use |
|---|---|---|---|
| Level 0 | `--void` | `#000000` | Page background |
| Level 1 | `--void-warm` | `#0a0a0a` | Cards, panels |
| Level 2 | `--void-panel` | `#111111` | Raised panels, modals |
| Level 3 | `--void-raised` | `#1a1a1a` | Dropdowns, popovers, tooltips |

CSS classes: `.surface-0`, `.surface-1`, `.surface-2`, `.surface-3`

---

## Typography

### Font Stack

```css
:root {
  --font-title:  'Noto Serif Display', 'Times New Roman', serif;    /* Headings, display */
  --font-sys:    'JetBrains Mono', 'Cascadia Mono', monospace;      /* Body, code, data */
  --font-stamp:  'Saira Extra Condensed', 'Impact', sans-serif;     /* Labels, badges, tags */
  --font-mincho: 'Shippori Mincho B1', 'YuMincho', serif;           /* Thematic (optional) */
}
```

Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Saira+Extra+Condensed:wght@400;600;700;800&family=Shippori+Mincho+B1:wght@500;700;800&display=swap" rel="stylesheet">
```

### Type Scale

| Token | Size | Use |
|---|---|---|
| `--text-xs` | 11px | Fine print, timestamps |
| `--text-sm` | 12px | Labels, captions |
| `--text-base` | 14px | Body text (default) |
| `--text-lg` | 16px | Section headers |
| `--text-xl` | 20px | Card titles |
| `--text-2xl` | 24px | Page headings |
| `--text-3xl` | 32px | Hero/display |

### Weight & Spacing

| Weight | Value | Use |
|---|---|---|
| Regular | 400 | Body text |
| Medium | 500 | Data values |
| Bold | 700 | Headings, emphasis |
| Black | 900 | Display titles |

| Spacing | Value | Use |
|---|---|---|
| `--ls-tight` | -0.01em | Dense data |
| `--ls-normal` | 0 | Body text |
| `--ls-wide` | 0.06em | Labels, small caps |
| `--ls-ultra` | 0.2em | Display titles |

### Compressed Title

```css
.compressed-title {
  font-family: var(--font-title);
  font-weight: 900;
  transform: scaleX(0.82);
  transform-origin: left center;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
```

---

## Spacing & Layout

### Spacing Scale (4px base)

| Token | Value |
|---|---|
| `--sp-1` | 4px |
| `--sp-2` | 8px |
| `--sp-3` | 12px |
| `--sp-4` | 16px |
| `--sp-6` | 24px |
| `--sp-8` | 32px |
| `--sp-12` | 48px |
| `--sp-16` | 64px |

### Border Radius

| Token | Value | Use |
|---|---|---|
| `--radius-none` | 0 | Sharp/hard edges (default) |
| `--radius-sm` | 2px | Subtle rounding |
| `--radius-md` | 4px | Buttons, inputs |
| `--radius-lg` | 8px | Cards, modals |
| `--radius-full` | 9999px | Pills, avatars |

### Grid System

```css
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-2); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--sp-2); }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--sp-2); }
.stack  { display: flex; flex-direction: column; gap: var(--sp-2); }
```

---

## Components

### Buttons

```css
.btn         /* Primary — blue bg, dark text */
.btn-ghost   /* Transparent bg, blue border */
.btn-danger  /* Red bg for destructive actions */
.btn-sm      /* Small size modifier */
.btn:disabled /* Dimmed, no pointer */
```

### Form Inputs

```css
input, select, textarea  /* void-panel bg, text-line border, nw-text color */
input:focus              /* Primary border, primary-fill glow */
```

### Card

```css
.card          /* void-warm bg, faint border, radius-lg, overflow hidden */
.card-header   /* Uppercase primary label, faint bottom border */
.card-body     /* Content area with sp-4 padding */
.card-footer   /* Faint top border, sp-3 padding */
```

### Panel

```css
.panel         /* void-warm bg, faint border — no radius (sharper than card) */
.panel-header  /* 10px uppercase primary, primary-dim bottom border */
.panel-body    /* sp-3 padding */
```

### Data Table

```css
.nw-table      /* Full-width, collapsed borders, 12px font */
.nw-table th   /* 9px uppercase primary headers, primary-dim border */
.nw-table td   /* Green data, faint border, tabular-nums */
.nw-table tr:hover td  /* green-faint background on hover */
```

### Metrics Grid

```css
.metrics-grid  /* 2-column grid with 1px gap (faint separator) */
.metric-cell   /* void-warm bg, sp-3/sp-4 padding */
.m-label       /* 9px uppercase primary label */
.m-value       /* 20px bold green with glow text-shadow */
.m-sub         /* 9px dim subtitle */
.metric-cell.highlight  /* Blue primary value with blue glow, 24px */
```

### Key-Value Row

```css
.kv-row        /* Flex row, space-between, faint bottom border */
.kv-label      /* Primary-dim, uppercase, 10px */
.kv-value      /* Green, medium weight, tabular-nums */
```

### Tabs

```css
.tabs          /* Flex container with faint bottom border */
.tab           /* 12px uppercase, dim text, transparent bg, no border */
.tab:hover     /* White text */
.tab.active    /* Primary text + primary bottom border */
.tab-panel     /* Content area below tabs */
```

### Sidebar Nav

```css
.sidebar       /* 240px wide, void-warm bg, right border, full height */
.sidebar-header  /* Uppercase primary, bottom border */
.sidebar-section /* 9px dim section label */
.sidebar-item    /* 12px dim text, left border, hover highlights */
.sidebar-item.active /* Primary text, primary left border, primary-fill bg */
```

### Modal / Dialog

```css
.modal-backdrop  /* Fixed overlay, rgba(0,0,0,0.8), flex center, z-1000 */
.modal           /* void-panel bg, primary-dim border, radius-lg, max 480px */
.modal-header    /* Uppercase primary, primary-dim border, flex space-between */
.modal-body      /* sp-4 padding, white text */
.modal-footer    /* Faint top border, flex end, sp-2 gap for buttons */
```

### Dropdown

```css
.dropdown       /* Relative container */
.dropdown-menu  /* Absolute, void-raised bg, line border, radius-md, z-100 */
.dropdown-item  /* 12px dim text, hover → white + primary-fill bg */
.dropdown-item.danger /* Red text, red-fill bg on hover */
.dropdown-divider    /* 1px faint horizontal line */
```

### Breadcrumbs

```css
.breadcrumbs   /* Flex row, sp-2 gap, 12px dim text */
.breadcrumbs a /* Dim text, hover → primary */
.separator     /* Faint, 11px (use / or ›) */
.current       /* White text for last item */
```

### Badge

```css
.badge           /* Stamp font, 12px uppercase, primary border */
.badge-success   /* Green + green-dim border */
.badge-danger    /* Red + red-dim border */
.badge-warning   /* Yellow + yellow border */
```

### Tag

```css
.tag             /* Pill shape, stamp font, 11px, primary on primary-fill bg */
.tag-success     /* Green on green-faint bg */
.tag-danger      /* Red on red-fill bg */
.tag-warning     /* Yellow on yellow-fill bg */
.tag-info        /* Cyan on cyan-glow bg */
```

### Status LED

```css
.led         /* 6px circle indicator */
.led.green   /* Online / healthy — green glow */
.led.blue    /* Active / processing — blue glow */
.led.red     /* Error / offline — red glow */
.led.yellow  /* Warning / degraded — yellow glow */
```

### Avatar

```css
.avatar      /* 32px circle, primary-fill bg, primary-dim border, bold initial */
.avatar-sm   /* 24px */
.avatar-lg   /* 48px */
```

### Progress Bar

```css
.nw-progress      /* 4px height, void-panel bg, faint border */
.nw-progress .fill /* Green with green glow shadow */
```

### Toast / Notification

```css
.toast           /* void-panel bg, left border colored by severity */
.toast-success   /* Green left border */
.toast-danger    /* Red left border */
.toast-warning   /* Yellow left border */
.toast-info      /* Cyan left border */
```

### Skeleton Loader

```css
.skeleton         /* void-panel bg, shimmer animation */
.skeleton-text    /* 14px height, bottom margin — for text lines */
.skeleton-heading /* 24px height, 60% width — for headings */
.skeleton-avatar  /* 40px circle — for avatars */
.skeleton-block   /* 80px height — for content blocks */
```

### Divider

```css
.divider          /* 1px faint line, sp-4 vertical margin */
.divider-primary  /* Primary-dim color */
```

### Activity Feed

Timestamped, color-coded scrolling list. Build with `.ev` rows: `.ev-time` (dim), `.ev-type` (color-coded bold), `.ev-detail` (white, truncated), `.ev-amount`, `.ev-block`. Color entries by type using semantic roles.

---

## HTML Examples

HTML structure for components where DOM nesting isn't obvious from class names alone.

### Card

```html
<div class="card">
  <div class="card-header">Section Title</div>
  <div class="card-body">
    <div class="kv-row"><span class="kv-label">Status</span><span class="kv-value"><span class="led green"></span> Online</span></div>
    <div class="kv-row"><span class="kv-label">Uptime</span><span class="kv-value">99.97%</span></div>
  </div>
  <div class="card-footer">
    <button class="btn-sm btn-ghost">Details</button>
  </div>
</div>
```

### Modal

```html
<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-header">
      <span>Confirm Action</span>
      <button class="btn-ghost btn-sm" onclick="this.closest('.modal-backdrop').remove()">✕</button>
    </div>
    <div class="modal-body">Are you sure you want to proceed?</div>
    <div class="modal-footer">
      <button class="btn-ghost">Cancel</button>
      <button class="btn-danger">Delete</button>
    </div>
  </div>
</div>
```

### Tabs

```html
<div class="tabs">
  <button class="tab active">Overview</button>
  <button class="tab">Settings</button>
  <button class="tab">Logs</button>
</div>
<div class="tab-panel">
  <!-- Active tab content here -->
</div>
```

### Sidebar with Main Content

```html
<div style="display:flex; height:100vh">
  <nav class="sidebar">
    <div class="sidebar-header">App Name</div>
    <div class="sidebar-section">Navigation</div>
    <a class="sidebar-item active" href="#">Dashboard</a>
    <a class="sidebar-item" href="#">Settings</a>
    <a class="sidebar-item" href="#">Users</a>
    <div class="sidebar-section">System</div>
    <a class="sidebar-item" href="#">Logs</a>
  </nav>
  <main class="surface-0" style="flex:1; padding:var(--sp-6)">
    <!-- Page content -->
  </main>
</div>
```

### Dropdown

```html
<div class="dropdown">
  <button class="btn-ghost btn-sm">Actions ▾</button>
  <div class="dropdown-menu">
    <button class="dropdown-item">Edit</button>
    <button class="dropdown-item">Duplicate</button>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item danger">Delete</button>
  </div>
</div>
```

### Panel with Table

```html
<div class="panel">
  <div class="panel-header"><span>Server Status</span></div>
  <table class="nw-table">
    <thead><tr><th>Host</th><th>CPU</th><th>Memory</th><th>Status</th></tr></thead>
    <tbody>
      <tr><td>node-01</td><td>42%</td><td>68%</td><td><span class="led green"></span> OK</td></tr>
      <tr><td>node-02</td><td>87%</td><td>91%</td><td><span class="led yellow"></span> High</td></tr>
    </tbody>
  </table>
</div>
```

### Breadcrumbs

```html
<nav class="breadcrumbs">
  <a href="#">Home</a>
  <span class="separator">›</span>
  <a href="#">Settings</a>
  <span class="separator">›</span>
  <span class="current">Security</span>
</nav>
```

---

## Recipes (domain-specific examples)

These are opinionated implementations for specific domains. Use as inspiration.

### Multi-Source Consensus
Three-source agreement indicator with price/status/freshness. Good for oracle systems, cluster health, CI pipeline status.

### 3D Visualization (Three.js)
Cyan wireframe mesh, warm orange flow curves, bar columns. See `demo.html` for implementation.

### Compressed Title with Katakana
Serif title with `scaleX(0.82)` compression + Japanese subtitle. Adds cyberpunk flavor to any header.

---

## Operations Console Layout (Optional Template)

While `nightwire.css` is layout-agnostic, you can build dense, full-viewport dashboard interfaces by adding the following template classes:

```css
.console-wrapper { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.nw-nav { display: flex; align-items: center; padding: 10px 16px; background: var(--void); border-bottom: 1px solid var(--nw-primary-dim); flex-shrink: 0; }
.dashboard { display: flex; gap: 2px; flex: 1; padding: 2px; min-height: 0; }
.dash-left { flex: 1; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
.dash-right { width: 370px; min-width: 370px; display: flex; flex-direction: column; gap: 2px; }
.dash-row { display: grid; gap: 2px; flex-shrink: 0; }
```

HTML Structure:
```html
<div class="console-wrapper">
  <nav class="nw-nav">...</nav>
  <div class="dashboard">
    <div class="dash-left">
      <div class="dash-row" style="grid-template-columns: 1fr 1fr;">
        <div class="panel">...</div>
      </div>
    </div>
    <div class="dash-right">...</div>
  </div>
</div>
```

---

## Utility Classes

### Text Color
`.text-primary`, `.text-success`, `.text-info`, `.text-danger`, `.text-warning`, `.text-accent`, `.text-dim`

### Glow
`.glow-green`, `.glow-blue`, `.glow-cyan`, `.glow-red`

### Surface
`.surface-0`, `.surface-1`, `.surface-2`, `.surface-3`

### Border
`.border`, `.border-primary`, `.border-dim`

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

## Anti-Patterns

| Don't | Do |
|---|---|
| Gray/navy backgrounds | Pure black (`#000`) |
| CRT effects (scanlines, vignette) | Clean, no overlays |
| Harsh neon (`#00ff00`) | Soft neon (`#7aed7a`) |
| 12px base font | 14px for readability |
| Decorative-only elements | Content-driven visuals |
| Light mode | Dark only |
| Color without meaning | Semantic color roles |

---

*The void is the canvas. Data is the art.*

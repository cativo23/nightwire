---
name: nightwire
description: "Nightwire — Dark cyberpunk UI system. Pure black (#000), soft neon palette, 14px mono base. Semantic color roles (primary, success, info, danger, warning, accent), surface elevation, type scale, spacing, utility classes, and component patterns for any dark UI. Inspired by Evangelion/GITS. Built on nerv-ui by TheGreatGildo."
---

# Nightwire — Cyberpunk UI System

A dark-mode-only design system with a modern cyberpunk aesthetic. Works for dashboards, admin panels, dev tools, media players, monitoring UIs, landing pages — any interface that lives in the void.

**Based on:** [nerv-ui](https://github.com/TheGreatGildo/nerv-ui) by TheGreatGildo

**Usage:** Include `nightwire.css` for vanilla CSS, or use `tailwind.preset.js` with Tailwind CSS:
```js
// tailwind.config.js
import nightwirePreset from './tailwind.preset.js';
export default { presets: [nightwirePreset] };
```

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

### Palette (raw colors)

```css
:root {
  /* Surfaces */
  --void:             #000000;
  --void-warm:        #0a0a0a;
  --void-panel:       #111111;
  --void-raised:      #1a1a1a;

  /* Blue */
  --nw-primary:       #6699ff;
  --nw-primary-dim:   #4477cc;
  --nw-primary-hot:   #99bbff;
  --nw-primary-fill:  rgba(102, 153, 255, 0.08);

  /* Green */
  --nw-green:         #7aed7a;
  --nw-green-dim:     #5cb85c;
  --nw-green-faint:   rgba(122, 237, 122, 0.06);
  --nw-green-fill:    rgba(122, 237, 122, 0.1);

  /* Cyan */
  --nw-cyan:          #66ddff;
  --nw-cyan-dim:      #44aacc;
  --nw-cyan-glow:     rgba(102, 221, 255, 0.12);

  /* Red/Pink */
  --nw-red:           #ff6688;
  --nw-red-dim:       #cc4466;
  --nw-red-hot:       #ff99aa;
  --nw-red-fill:      rgba(255, 102, 136, 0.15);

  /* Accent */
  --nw-yellow:        #e8993a;
  --nw-purple:        #b266e0;

  /* Text */
  --nw-text:          #ffffff;
  --nw-text-dim:      #aaaaaa;
  --nw-text-faint:    rgba(255, 255, 255, 0.06);
  --nw-text-line:     rgba(255, 255, 255, 0.12);
}
```

### Semantic Roles

Map raw colors to meaning. Apps can remap these.

```css
:root {
  --nw-success:       var(--nw-green);      /* Confirmations, positive data, online */
  --nw-info:          var(--nw-cyan);       /* Metadata, secondary actions, neutral */
  --nw-danger:        var(--nw-red);        /* Errors, destructive actions, offline */
  --nw-warning:       var(--nw-yellow);     /* Caution, pending, degraded */
  --nw-accent:        var(--nw-purple);     /* Highlights, badges, decorative */
}
```

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

## Recipes (domain-specific examples)

These are opinionated implementations for specific domains. Use as inspiration.

### Multi-Source Consensus
Three-source agreement indicator with price/status/freshness. Good for oracle systems, cluster health, CI pipeline status.

### 3D Visualization (Three.js)
Cyan wireframe mesh, warm orange flow curves, bar columns. See `demo.html` for implementation.

### Compressed Title with Katakana
Serif title with `scaleX(0.82)` compression + Japanese subtitle. Adds cyberpunk flavor to any header.

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

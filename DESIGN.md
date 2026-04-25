---
version: alpha
name: Nightwire
description: A dark-mode-only cyberpunk design system. Pure black backgrounds, soft neon palette, monospace typography. Inspired by Evangelion and Ghost in the Shell.
colors:
  # Surfaces
  void: "#000000"
  void-warm: "#0a0a0a"
  void-panel: "#111111"
  void-raised: "#1a1a1a"
  # Semantic roles
  primary: "#6699ff"
  primary-dim: "#4477cc"
  primary-hot: "#99bbff"
  success: "#7aed7a"
  success-dim: "#5cb85c"
  info: "#66ddff"
  info-dim: "#44aacc"
  danger: "#ff6688"
  danger-dim: "#cc4466"
  danger-hot: "#ff99aa"
  warning: "#e8993a"
  accent: "#b266e0"
  # Text
  on-surface: "#ffffff"
  on-surface-dim: "#aaaaaa"
typography:
  body:
    fontFamily: JetBrains Mono, Cascadia Mono, monospace
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: JetBrains Mono, Cascadia Mono, monospace
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: JetBrains Mono, Cascadia Mono, monospace
    fontSize: 10px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.14em
  label-sm:
    fontFamily: JetBrains Mono, Cascadia Mono, monospace
    fontSize: 9px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.12em
  display:
    fontFamily: Noto Serif Display, Times New Roman, serif
    fontSize: 32px
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: 0.2em
  heading-xl:
    fontFamily: Noto Serif Display, Times New Roman, serif
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
  heading-lg:
    fontFamily: JetBrains Mono, Cascadia Mono, monospace
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.2
  heading-md:
    fontFamily: JetBrains Mono, Cascadia Mono, monospace
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.3
  stamp:
    fontFamily: Saira Extra Condensed, Impact, sans-serif
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.06em
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
rounded:
  none: 0px
  sm: 2px
  md: 4px
  lg: 8px
  full: 9999px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.void}"
    typography: "{typography.stamp}"
    rounded: "{rounded.md}"
    padding: 8px 16px
  button-primary-hover:
    backgroundColor: "{colors.primary-hot}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 8px 16px
  button-ghost-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.void}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.void}"
    rounded: "{rounded.md}"
    padding: 8px 16px
  input:
    backgroundColor: "{colors.void-panel}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  input-focus:
    backgroundColor: "{colors.void-panel}"
    textColor: "{colors.on-surface}"
  badge:
    textColor: "{colors.primary}"
    typography: "{typography.stamp}"
    rounded: "{rounded.sm}"
    padding: 1px 8px
  badge-success:
    textColor: "{colors.success}"
  badge-danger:
    textColor: "{colors.danger}"
  badge-warning:
    textColor: "{colors.warning}"
  card:
    backgroundColor: "{colors.void-warm}"
    rounded: "{rounded.lg}"
  panel:
    backgroundColor: "{colors.void-warm}"
    rounded: "{rounded.none}"
  modal:
    backgroundColor: "{colors.void-panel}"
    rounded: "{rounded.lg}"
---

# Nightwire

## Overview

Nightwire is a dark-mode-only design system with a modern cyberpunk aesthetic. It targets developers, power users, and technical audiences who live in the terminal and demand interfaces that are both beautiful and functional.

The visual language is rooted in **pure black void** — elements emerge from `#000000` rather than sitting on gray or navy backgrounds. Color is used exclusively as a functional signal, never decoratively. The palette draws from soft neon — vibrant enough to read clearly, restrained enough to avoid eye strain during long sessions.

The emotional tone is **calm precision**: the quiet confidence of a system that knows exactly what it's doing. Think NERV operations center, not a rave. Dense, data-rich, and readable at a glance.

Nightwire works for dashboards, admin panels, dev tools, media players, monitoring UIs, and landing pages — any interface that lives in the void.

## Colors

The palette is built on pure black surfaces with a soft neon accent system. Every color has a semantic role — color is never used decoratively.

- **Void (`#000000`):** The page background. Always pure black, never gray or navy.
- **Void Warm (`#0a0a0a`):** Cards and panels — the first level of elevation above the void.
- **Void Panel (`#111111`):** Raised panels, modals, inputs — second elevation level.
- **Void Raised (`#1a1a1a`):** Dropdowns, popovers, tooltips — highest elevation level.
- **Primary (`#6699ff`):** Soft blue for headers, labels, active states, links, and primary actions. The dominant accent color.
- **Success (`#7aed7a`):** Soft green for confirmations, positive data, online status, and data readouts.
- **Info (`#66ddff`):** Soft cyan for metadata, secondary actions, and neutral information.
- **Danger (`#ff6688`):** Soft pink-red for errors, destructive actions, and offline status.
- **Warning (`#e8993a`):** Amber for caution states, pending operations, and degraded status.
- **Accent (`#b266e0`):** Purple for highlights, badges, and decorative elements when needed.
- **On-surface (`#ffffff`):** Primary text on all dark surfaces.
- **On-surface-dim (`#aaaaaa`):** Secondary text, timestamps, metadata.

Each semantic color has `-dim` (muted border/icon use) and `-hot` (hover/emphasis) variants.

## Typography

Nightwire uses a three-family system: monospace for all body and data, serif display for cinematic headings, and condensed sans-serif for labels and stamps.

- **Body (JetBrains Mono):** All body text, data readouts, code, and UI copy. 14px base, 1.5 line-height. Monospace enforces the technical, terminal-native aesthetic and ensures tabular data aligns correctly.
- **Display (Noto Serif Display):** Hero headings and cinematic titles only. 900 weight, compressed horizontally with `scaleX(0.82)`, wide letter-spacing. Evokes the title cards of Evangelion episodes.
- **Stamp (Saira Extra Condensed):** Labels, badges, tags, and button text. Uppercase, tight, high-impact. Used for anything that needs to be read at a glance.

All text is set in uppercase with generous letter-spacing for labels and UI chrome. Body text uses normal case.

## Layout & Architecture

The Nightwire CSS system is divided into two distinct architectural concepts:

1. **Base System (Layout-Agnostic):** The core `nightwire.css` file only contains design tokens (colors, typography) and atomic components (`.btn`, `.card`, `.panel`, `.nw-table`). This makes it completely layout-agnostic, allowing you to build standard scrolling websites, portfolios, or documentation sites.
2. **Operations Console (Dashboard Layout):** For dense, full-viewport dashboard interfaces (like the demos), Nightwire uses a specific 3-column layout pattern with `console-wrapper`, `nw-nav`, `dash-left`, and `dash-right`. This is provided as a layout template rather than baked into the core CSS, ensuring maximum flexibility.

Nightwire follows a **4px base spacing scale**. All spacing values are multiples of 4px, with a 12px step for component internal padding and 16px for section separation.

Panels and cards use sharp or minimal-radius edges to reinforce the industrial aesthetic. Dense information layouts are preferred over spacious ones — every pixel should carry data.

## Elevation & Depth

Depth is achieved through **tonal surface layers** rather than shadows. There are no box-shadows in the Nightwire system — elevation is communicated purely through background color progression.

| Level | Token | Hex | Use |
|---|---|---|---|
| 0 | `void` | `#000000` | Page background |
| 1 | `void-warm` | `#0a0a0a` | Cards, panels |
| 2 | `void-panel` | `#111111` | Modals, inputs, raised panels |
| 3 | `void-raised` | `#1a1a1a` | Dropdowns, tooltips, popovers |

Higher elevation = lighter background. Never use shadows to convey depth.

## Shapes

Nightwire uses **minimal rounding** by default. Sharp edges reinforce the industrial, technical aesthetic. Rounding is applied sparingly and only where it aids usability.

- `none` (0px): Default for panels, tables, and data containers — sharp industrial edges.
- `sm` (2px): Badges and tags — just enough to distinguish from sharp.
- `md` (4px): Buttons and inputs — standard interactive element rounding.
- `lg` (8px): Cards and modals — softer containers for content grouping.
- `full` (9999px): Pills, avatars, LEDs — fully circular or pill-shaped elements.

Never mix sharp and rounded corners within the same component. Panels are always sharp; cards are always `lg`.

## Components

### Buttons

Three variants: primary (filled blue), ghost (outlined), danger (filled red). All use the Stamp font — uppercase, condensed, high-contrast. Disabled state is 40% opacity with no pointer events.

### Inputs

Monospace font, `void-panel` background, `text-line` border. Focus state uses primary border color with a subtle primary-fill glow ring. Placeholder text is dimmed to 60% opacity.

### Badges & Tags

Badges use the Stamp font with a colored border and no background fill. Tags are pill-shaped with a translucent background fill matching the semantic color. Both are uppercase.

### Status LED

A 6px circle with a colored glow shadow. Four states: green (online/healthy), blue (active/processing), red (error/offline), yellow (warning/degraded).

### Panel & Card

Panel: sharp edges, `void-warm` background, faint border. Used for data containers and dashboard sections.
Card: `lg` radius, `void-warm` background, faint border. Used for content grouping and profile-style layouts.

Both use a `panel-header` / `card-header` pattern: 10px uppercase primary label with a `primary-dim` bottom border.

### Data Table

Blue headers (9px uppercase, `primary-dim` bottom border), green data cells, faint row separators, `green-faint` hover highlight. Tabular-nums for all numeric data.

### Metrics Grid

2-column grid with 1px faint separators. Each cell has a 9px uppercase primary label, a 20px bold green value with green glow text-shadow, and a 9px dim subtitle. Highlight variant uses primary blue at 24px.

### Modal

`void-panel` background, `primary-dim` border, `lg` radius. Centered on `rgba(0,0,0,0.8)` backdrop. Header/body/footer structure with primary-dim dividers.

### Toast

`void-panel` background with a 3px left border colored by severity (success/danger/warning/info). No border radius — sharp edges only.

### Skeleton Loader

`void-panel` background with a horizontal shimmer animation using a translucent white gradient. Respects `prefers-reduced-motion`.

## Do's and Don'ts

- Do use pure black (`#000000`) for all page backgrounds — never gray or navy
- Don't use color decoratively — every color must carry semantic meaning
- Do use the primary blue only for the most important interactive element per section
- Don't use CRT effects (scanlines, vignette, flicker) — the aesthetic is clean and modern
- Do use soft neon values (`#7aed7a`, `#6699ff`) — never harsh neon (`#00ff00`, `#0000ff`)
- Don't use font sizes below 11px — readability is non-negotiable
- Do use uppercase + letter-spacing for all labels, badges, and UI chrome
- Don't mix sharp and rounded corners within the same component
- Do convey elevation through surface color progression — never with shadows
- Don't use light mode — Nightwire is dark-only by design

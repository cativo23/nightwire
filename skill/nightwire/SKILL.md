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

## Component Reference

### Buttons
- `.btn` — Primary (blue bg, dark text)
- `.btn-ghost` — Transparent bg, blue border
- `.btn-danger` — Red bg for destructive actions
- `.btn-sm` — Small size modifier

### Panel & Card
- `.panel` — void-warm bg, faint border, NO radius
- `.panel-header` — 10px uppercase primary, primary-dim bottom border
- `.panel-body` — sp-3 padding
- `.card` — void-warm bg, faint border, radius-lg
- `.card-header` — Uppercase primary label
- `.card-body` — sp-4 padding
- `.card-footer` — Faint top border

### Data Table
- `.nw-table` — Full-width, collapsed borders
- `.nw-table th` — 9px uppercase primary, primary-dim border
- `.nw-table td` — Green data, faint border, tabular-nums

### Metrics Grid
- `.metrics-grid` — 2-column grid, 1px faint separators
- `.metric-cell` — void-warm bg
- `.m-label` — 9px uppercase primary
- `.m-value` — 20px bold green with glow
- `.m-sub` — 9px dim subtitle
- `.metric-cell.highlight` — Blue primary value, 24px

### Status LED
- `.led.green` — Online / healthy
- `.led.blue` — Active / processing
- `.led.red` — Error / offline
- `.led.yellow` — Warning / degraded
- `.led.blink` — Animated pulse

### Badges & Tags
- `.badge` — Stamp font, 12px uppercase, primary border
- `.badge-success` / `.badge-danger` / `.badge-warning` — Color variants
- `.tag` — Pill, stamp font, primary on primary-fill
- `.tag-success` / `.tag-danger` / `.tag-warning` / `.tag-info` — Color variants

### Other Components
- `.toast` / `.toast-success` / `.toast-danger` / `.toast-info` — Notifications with 3px left border
- `.sidebar` — 240px, void-warm bg, right border
- `.sidebar-item` / `.sidebar-item.active` — Nav items
- `.kv-row` — Key-value display with faint bottom border
- `.nw-progress` — 4px height progress bar with green fill
- `.skeleton` / `.skeleton-text` / `.skeleton-heading` / `.skeleton-block` — Loading states
- `.modal` / `.modal-backdrop` / `.modal-header` / `.modal-body` / `.modal-footer` — Dialog system

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
| Panel headers without kanji | Every panel header MUST have `<span class="tag">日本語</span>` | Non-negotiable style element |

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

## Additional Resources

For layout templates, see [references/layouts.md](references/layouts.md)

For HTML examples, see [references/examples.md](references/examples.md)

---

*The void is the canvas. Data is the art.*

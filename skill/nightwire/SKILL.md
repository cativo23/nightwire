---
name: nightwire
description: >
  Use when building any dark-themed web UI or generating HTML/CSS with a cyberpunk aesthetic —
  dashboards, admin panels, dev tools, monitoring UIs, portfolios, landing pages, blogs, or any
  interface that lives on a pure black background. Provides design tokens, semantic color roles,
  component classes, layout templates, and complete HTML examples. Version 3: neutral-first,
  square-cornered, bone primary action.
---

# Nightwire — Cyberpunk UI System

A dark-mode-only design system with a modern cyberpunk aesthetic. Works for **any type of interface** — from a personal portfolio to a dense operations console. The aesthetic is consistent; the layout is yours to choose.

**Usage:** Include `nightwire.css` for vanilla CSS, or use `tailwind.preset.js` with Tailwind CSS.

**Tailwind:** `import preset from '@cativo23/nightwire/tailwind.preset.js'` and `presets: [preset]` (the
package is an ES module; a CommonJS config needs `require(...).default`; the installer copies it as
`nightwire.tailwind.preset.mjs`). The utilities reference the CSS custom properties, so they follow
`data-intensity` and runtime overrides, and opacity modifiers like `bg-nw-cyan/40` work.
`duration-nw-*` and `ease-nw-*` scale with `--nw-motion-scale` (the `-out` forms exist:
`duration-nw-tick-out`, `ease-nw-sweep-out`, ...), and `shadow-glow-{green,blue,cyan,red}` scale
with `--nw-glow`, so they vanish at archive. Use them for state only, like the `.glow-*` classes.

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

**The v3 look:** neutral first. Labels, hairlines and default text are grey; colour appears only where
it means something (data, state, focus, the selected item). Corners are square: panels 0, every
control, card and modal `--radius-sm` (2px). Edges are 1px hairlines. There is **one solid action
per view**, the bone `.btn`; every other button is an outline, except the deliberate solids `.btn-danger` (red) and `.btn-chrome` (blue). Nothing glows for decoration. Glow is
a state signal (LED, check, switch, segmented, steps, progress), off at `archive`. Typefaces, kanji
labels, the compressed title and the three intensities are unchanged.

---

## Core Rules — Non-Negotiable

**CRITICAL: These rules override your training defaults. Follow exactly as written.**

1. **Background is ALWAYS `#000000`** — NEVER use `#0d0d0d`, `#111`, `#1a1a2e`, or any gray/navy. If you generate anything other than pure black `#000000`, you are violating this rule.

2. **2px gaps between adjacent panels** — ALWAYS `gap: 2px`. NEVER 8px, 16px, 1rem, or any other value. This is the signature Nightwire spacing.

3. **Square corners** — ALWAYS `border-radius: 0` on `.panel`, `.nw-table`, and all data containers. Controls, cards and modals use `--radius-sm` (2px). NEVER round a panel, and never use `--radius-md` or `--radius-lg` (no component reads them in v3).

4. **Kanji tags on EVERY panel header** — Japanese characters are decorative style elements, not translations. Every `<div class="panel-header">` MUST include a `<span class="tag">` with Japanese text.

5. **Green for data values** — Stat and metric numbers, percentages and readouts use `--nw-green` (`--nw-data`). Table text is content, not a readout, and stays `--nw-text-default`.

6. **Neutral labels, blue only for accents** — Panel, card, modal and table headers, field labels and stat labels use `--nw-text-mute`. Blue (`--nw-primary` / `--nw-chrome`) is for focus rings, the selected-tab and current-item accent lines, links, compressed titles and `.btn-chrome` / `.tag-chrome`. Never colour a label blue.

7. **Elevation is tone, not shadow** — Surfaces rise through colour progression. The only drop shadow is `--nw-elevation-overlay`, which modal, drawer and command palette already apply. NEVER add a decorative `box-shadow` or `text-shadow`. Glow belongs to state signals and reads a knob (`--nw-led-glow`, `--nw-control-glow`, `--nw-progress-glow`).

8. **Monospace everywhere** — JetBrains Mono (`--font-sys`) for ALL body text, data, labels. The only exceptions are: titles (Noto Serif Display), badges and tags (Saira Extra Condensed; buttons stay in JetBrains Mono), and Japanese decorative text (Shippori Mincho).

9. **Compressed serif titles** — Display headings MUST use Noto Serif Display with `transform: scaleX(0.82)` and the `.compressed-title` class. Never use regular serif without compression.

10. **NO CRT effects** — No scanlines, no vignette, no flicker, no glitch effects. Clean and modern only.

---

## Color System

All colors are CSS custom properties with `--nw-` prefix. Use semantic roles, never raw hex.

**CSS Variable Mapping:**
- DESIGN.md `on-surface-faint` → CSS `--nw-text-faint` (quiet dividers)
- DESIGN.md `on-surface-line` → CSS `--nw-text-line` (equal to `--nw-line`: panel and header edges)
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
| Action | `--nw-action` | `#e6e6e6` (bone) | The one solid action (`.btn`); hover `--nw-action-hot` `#99bbff`, text `--nw-action-text` `#000000` |
| Neutral text | `--nw-text-default`, `--nw-text-mute` | `#e6e6e6`, `#aaaaaa` | Body and table text; labels and headers |
| Primary | `--nw-primary` | `#6699ff` | Focus, the selected-tab and current-item accent lines, links, compressed titles, `.btn-chrome`, `.tag-chrome`, `data-state="active"` |
| Success/Data | `--nw-green` | `#7aed7a` | Stat and metric values, success states, online indicators |
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
| Overlay | `--nw-elevation-overlay` | `0 24px 64px rgba(0,0,0,0.7)` | Modal, drawer and command palette panels only |

### Lines

`--nw-hairline` (1px) is every structural border, `--nw-rule` (1.5px) the marks drawn inside controls,
`--nw-accent-width` (2px) every accent bar (tabs, sidebar, diff, toast). Greys: `--nw-text-faint` for
quiet dividers, `--nw-line` for panel and header edges, `--nw-line-strong` for control boundaries
(input, check, switch, segmented, combo, kbd, modal, toast), which keeps 3:1 contrast on black.

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
| Badges, tags, stat labels | `--font-stamp` | Uppercase, condensed |
| Buttons | `--font-sys` | Bold, uppercase |
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
- Header text: 8-10px, uppercase, `--nw-text-mute`, letter-spacing 0.14em
- Japanese tag: right-aligned, `--font-mincho`; a `.kanji` inside a header is `--nw-text-default` (set with `:where()`, so a colour utility on it wins)
- Bottom border: `1px solid --nw-line`

---

## Component Reference

### Buttons
- `.btn` — Primary, the one solid action: bone fill (`--nw-action`), black text, square (`--radius-sm`); hover `--nw-action-hot`
- `.btn-ghost` — Outline: `--nw-text-default` text, `--nw-line-strong` border; hover keeps it transparent and lifts the text to `--nw-text-strong`
- `.btn-danger` — Red bg for destructive actions
- `.btn-chrome` — The only blue solid, for UI-chrome actions (add it next to `.btn`)
- `.btn-sm` — Small size modifier

### Panel & Card
- `.panel` — void-warm bg, `--nw-line` border, NO radius
- `.panel-header` — 10px uppercase `--nw-text-mute`, `--nw-line` bottom border
- `.panel-body` — sp-3 padding
- `.card` — void-warm bg, `--nw-line` border, `--radius-sm`
- `.card-header` — Uppercase `--nw-text-mute` label
- `.card-body` — sp-4 padding
- `.card-footer` — `--nw-line` top border

### Data Table
- `.nw-table` — Full-width, collapsed borders
- `.nw-table th` — 9px uppercase `--nw-text-mute`, `--nw-line` border
- `.nw-table td` — `--nw-text-default` text (content, not a readout), faint border, tabular-nums; row hover `--nw-text-faint`

### Metrics Grid
- `.metrics-grid` — 2-column grid, 1px faint separators
- `.metric-cell` — void-warm bg
- `.m-label` — 9px uppercase `--nw-text-mute`
- `.m-value` — 20px bold green, no glow
- `.m-sub` — 9px dim subtitle
- `.metric-cell.highlight` — Blue primary value, 24px

### Status LED
Set the state with `data-state` on `.led`; the glow is the state glow (`--nw-led-glow`).
- `.led[data-state="ok"]` — Online / healthy (green)
- `.led[data-state="active"]` — Active / processing (blue)
- `.led[data-state="error"]` — Error / offline (red)
- `.led[data-state="warn"]` — Warning / degraded (amber)
- `.led[data-state="info"]`, `.led[data-state="ai"]` — Info (cyan), AI (purple)
- `.led[data-pulse]` — Animated pulse (paused at `archive` and under reduced motion)

### Badges & Tags
- `.badge` — Stamp font, 12px uppercase, `--nw-text-default` on a `--nw-line-strong` border
- `.badge-success` / `.badge-danger` / `.badge-warning` — Color variants
- `.tag` — Neutral: stamp font, `--nw-text-default` on `--nw-text-faint`, square `--radius-sm`. Blue is `.tag-chrome`
- `.tag-success` / `.tag-danger` / `.tag-warn` / `.tag-info` / `.tag-chrome` / `.tag-ai` — Color variants

### Other Components
- `.toast` / `.toast-success` / `.toast-danger` / `.toast-info` — Notifications with a `--nw-line-strong` hairline boundary and a 2px (`--nw-accent-width`) left accent in the variant colour
- `.dropdown` + `.dropdown-menu` / `.dropdown-item` / `.dropdown-divider` — Menu; `data-open="false"` on `.dropdown` closes it
- `.tooltip` + `.tooltip-content` — Opens on hover and keyboard focus; `data-open` overrides (see Overlay open state)
- `.sidebar` — 240px, void-warm bg, right border
- `.sidebar-item` / `.sidebar-item.active` — Nav items; hover reads `--nw-text-strong`, the active item keeps a blue accent line and a neutral label
- `.tab` / `.tab.active` — Tabs; hover reads `--nw-text-strong`, the selected tab keeps a blue underline and a neutral label
- `.kv-row` — Key-value display with faint bottom border
- `.nw-progress` — 4px height progress bar with a `--nw-line` edge; the fill is `.nw-progress-fill` (green, state glow via `--nw-progress-glow`)
- `.skeleton` / `.skeleton-text` / `.skeleton-heading` / `.skeleton-block` — Loading states
- `.modal` / `.modal-backdrop` / `.modal-header` / `.modal-body` / `.modal-footer` — Dialog system; `--nw-line-strong` border, `--radius-sm`, `--nw-elevation-overlay`

---

## Anti-Patterns — What NOT to Generate

**These are common AI training defaults that violate Nightwire rules. Actively avoid them.**

| NEVER Generate | ALWAYS Use Instead | Why |
|---|---|---|
| `background: #1a1a2e` or `#0d0d0d` | `background: #000000` | Only pure black is Nightwire |
| `box-shadow: 0 2px 8px rgba(...)` | Surface color progression (`--void-warm`, `--void-panel`); `--nw-elevation-overlay` on overlays | Tone, not shadow; no decorative glow |
| A glow on a heading, value or button (`text-shadow`, coloured `box-shadow`) | Nothing, or a state signal reading `--nw-led-glow` / `--nw-control-glow` / `--nw-progress-glow` | Glow means state |
| `border-radius: 4px` on panels, or round buttons and tags | `border-radius: 0` on panels; `--radius-sm` on controls | Square corners everywhere |
| Blue labels or a blue default `.tag` | `--nw-text-mute` labels; `.tag-chrome` for blue | Neutral first, blue marks focus and accents |
| `.led.green`, `.led.blue`, `.led.red`, `.led.yellow`, `.tag-warning`, `.nw-progress .fill`, `.stack` | `.led[data-state="ok\|active\|error\|warn"]`, `.tag-warn`, `.nw-progress-fill`, `.nw-stack` | Removed in v3 |
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
:focus-visible { outline: 2px solid var(--nw-focus-ring); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

Reduced motion wins at every intensity, `archive` and `combat` included: `--nw-motion-scale`
becomes `0`, the LED pulse and the loops pause, `.uplink` content shows at its end state, the button
press shift is gone, and overlays open and close instantly. Never add your own reduced-motion
override for a knob, and never rely on motion to reveal content.

---

## Additional Resources

For layout templates, see [references/layouts.md](references/layouts.md)

For HTML examples, see [references/examples.md](references/examples.md)

---

## Intensity, Layer 2 Tokens and the v2 Components

> v3 is a major release: it restyled every component and removed the v1 forms listed in the
> anti-pattern table. The v1 primitive tokens (`--nw-primary`, `--nw-green`, `--void-warm`) keep
> their names.

### Intensity attribute

Set on `<html>` to retune glow, motion, density, kanji visibility:

```html
<html data-intensity="archive">   <!-- docs / blogs: no glow, more padding, no kanji -->
<html data-intensity="operator">  <!-- default: same as no attribute -->
<html data-intensity="combat">    <!-- ops console: state glow doubles, dense, faster pulse -->
```

Glow is `--nw-glow` (0 at archive, 0.5 at operator and combat). The three state-glow knobs
`--nw-led-glow`, `--nw-control-glow` and `--nw-progress-glow` follow it and double at combat, so
only state signals glow brighter there. Never add a glow to a non-state element.

An override of a colour token or of `--nw-glow` on a sub-tree reaches both the classes and the
Tailwind utilities. `--nw-motion-scale` and alias tokens such as `--nw-chrome` resolve on `:root`, so
override those on `:root` or on the `data-intensity` element, or override the derived token itself.

### Layer 2 semantic tokens (use these when forking palette)

```
--nw-chrome           UI chrome (was --nw-primary)
--nw-data             data values (was --nw-green)
--nw-signal-info      info (was --nw-cyan)
--nw-signal-warn      warning (was --nw-yellow)
--nw-signal-error     error (was --nw-red)
--nw-ai               AI / oracle (was --nw-purple)
--nw-action           the solid action fill (bone #e6e6e6); --nw-action-hot hover, --nw-action-text label
--nw-line             panel and header edges; --nw-line-strong control boundaries (3:1)
--nw-text-strong      headings (#ffffff)
--nw-text-default     body (#e6e6e6)
--nw-text-mute        captions (#aaaaaa)
--nw-text-disabled    disabled (#5a5a5a)
--nw-surface-0..4     elevation tiers
```

### Components added in v2 (all in v3)

- **Forms**: `.field` (with `.error`/`.success` modifiers), `.switch`, `.check`, `.radio`, `.combo` (with `.chip`), `.kbd`, `.seg`
- **Overlays**: `.cmdk` + `.cmdk-section`/`.cmdk-item`, `.drawer` + `.drawer-backdrop`, `.modal-title`
- **Data**: `.code-block` (syntax tokens `.tok-k/-s/-c/-n/-fn`), `.code-inline`, `.diff` (with `.ln.add`/`.ln.del`), `.steps`
- **State**: `.led[data-state="ok|warn|error|info|active|ai"]`, `.led[data-pulse]`, `.empty`, `.ai-block`
- **Stat**: `.stat` + `.stat-label`/`.stat-value`/`.stat-delta`/`.stat-spark`
- **Layout**: `.nw-frame`, `.nw-stack`, `.nw-cluster`, `.nw-split`
- **Tag variants**: `.tag-chrome` (blue), `.tag-warn`, `.tag-ai`; the default `.tag` is neutral
- **Button variants**: `.btn-chrome` (blue solid), `.btn-success`, `.btn-ai`, `.btn-icon`, `.btn-xs`, `.btn-lg`, `.btn-loading`
- **Banner**: system-wide notice strip

### Overlay open state

Overlays animate in and out and are driven by a `data-open` attribute. The value is a string
(React's `data-open={bool}` renders `"true"` / `"false"`). Closed overlays are hidden, unclickable
and unfocusable.

| Component | Put `data-open` on | Attribute absent | `"true"` | `"false"` |
|---|---|---|---|---|
| Drawer | `.drawer` and `.drawer-backdrop` | closed | open | closed |
| Modal | `.modal-backdrop` | closed | open | closed |
| Command palette | `.cmdk-backdrop` | closed | open | closed |
| Dropdown | `.dropdown` | open | open | closed |
| Toast | `.toast` | open | open | closed |
| Tooltip | `.tooltip` | closed; opens on `:hover` and `:focus-within` | open | closed, even on hover |

- For drawer, modal and command palette, always set the attribute: `"true"` to show, `"false"` to hide.
- For dropdown and toast, omit the attribute (or set `"true"`) for plain always-visible markup. Set
  `data-open="false"` to dismiss with an exit animation, and remove the element after the exit
  finishes, not at the moment you set `"false"`: a closed toast keeps its layout box until you do.
  Wait at least 350ms (the longest overlay exit, combat's sweep, is 300ms) with a timer, not
  `transitionend`, which does not fire under reduced motion.
- An element mounted already open never animates in: the first style does not transition. To
  animate a toast or dropdown you add at runtime, mount it with `data-open="false"`, then set
  `"true"` after two nested `requestAnimationFrame` calls.
- A tooltip needs no attribute: it opens on hover and when focus is inside it. Use `data-open`
  only to pin it open or keep it closed.
- A closed tooltip is `visibility: hidden`, so its text is out of the accessibility tree. Give the
  trigger `aria-describedby` pointing at the `.tooltip-content` `id`, and the content
  `role="tooltip"`; `aria-describedby` still reads hidden content.

```html
<!-- open -->
<div class="dropdown" data-open="true">
  <button class="btn-ghost btn-sm">Actions ▾</button>
  <div class="dropdown-menu"><button class="dropdown-item">Edit</button></div>
</div>

<!-- closed -->
<div class="dropdown" data-open="false">
  <button class="btn-ghost btn-sm">Actions ▾</button>
  <div class="dropdown-menu"><button class="dropdown-item">Edit</button></div>
</div>
```

### Motion vocabulary

Use named timings instead of ad-hoc ms values. Never write a literal duration in a component.

Three steps, each with an enter and an exit variant. The bare name enters, `-out` exits (shorter,
accelerating, `cubic-bezier(0.4, 0, 1, 1)`):

| Step | Use | Enter | Exit |
|---|---|---|---|
| `tick` | clicks, toggles, hover and focus feedback | `var(--nw-tick)` (150ms) | `var(--nw-tick-out)` (100ms) |
| `sweep` | panels, modal, drawer, command palette, toast | `var(--nw-sweep)` (350ms) | `var(--nw-sweep-out)` (250ms) |
| `uplink` | data load reveal | `var(--nw-uplink)` (400ms) | `var(--nw-uplink-out)` (300ms) |

- **Composites** (`--nw-sweep`, `--nw-sweep-out`) fill the `transition` shorthand:
  `transition: transform var(--nw-sweep)`.
- **Longhands** (`--nw-sweep-duration`, `--nw-sweep-ease`, `--nw-sweep-out-duration`,
  `--nw-sweep-out-ease`, and the same for `tick` and `uplink`) build a transition piece by piece.
  A closing overlay uses the duration to delay its `visibility` flip until the exit is done:
  `transition: opacity var(--nw-sweep-out), visibility 0s linear var(--nw-sweep-out-duration)`.
  Give the open state its own rule with the enter token and `visibility 0s`.
- **Stagger**: `--nw-stagger` (50ms) is the delay step between items revealed in sequence:
  `animation-delay: calc(2 * var(--nw-stagger))` for the third item.
- **Loops**: `--nw-loop-spin` (800ms) and `--nw-loop-shimmer` (1200ms) are the spinner and skeleton
  shimmer cycles; `--nw-pulse-speed` (1.6s, the same at every level) is the LED heartbeat. Pair a loop with
  `animation-play-state: var(--nw-loop-state)` (the LED uses `--nw-pulse-state`), so reduced motion
  can pause it.

Durations scale with `--nw-motion-scale`; loop cycles scale inversely, so archive loops run slower
and combat loops faster. The scale is a speed dial, not a switch: loops divide by it, so at `0` their
duration clamps to the browser's largest finite time: they keep running, frozen on their first
frame, not paused. Pause loops with `--nw-loop-state` and
`--nw-pulse-state` set to `paused`. `prefers-reduced-motion` sets all three: the scale to `0` and
both states to `paused`.

### Choosing an intensity and components

| Use case | Recommendation |
|---|---|
| Blog post, portfolio, docs | `data-intensity="archive"` + `.panel`, `.card`, `.nw-table`, `.code-block` |
| Default look | No attribute or `data-intensity="operator"`; mix components freely |
| Ops console, monitoring dashboard | `data-intensity="combat"` + `.cmdk`, `.drawer`, `.stat`, `.steps`, `.led[data-state]` |
| Forms-heavy admin panel | v2 form suite (`.field`, `.switch`, `.check`, `.combo`) |
| AI-generated suggestions/oracle UIs | `.ai-block` + `.tag-ai` + `.btn-ai` + `.led[data-state="ai"]` |

See `examples/html/workshop.html` for a live demonstration with every component and the intensity toggle.

---

*The void is the canvas. Data is the art.*

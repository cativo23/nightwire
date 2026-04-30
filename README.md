<div align="center">

```
███╗   ██╗██╗ ██████╗ ██╗  ██╗████████╗██╗    ██╗██╗██████╗ ███████╗
████╗  ██║██║██╔════╝ ██║  ██║╚══██╔══╝██║    ██║██║██╔══██╗██╔════╝
██╔██╗ ██║██║██║  ███╗███████║   ██║   ██║ █╗ ██║██║██████╔╝█████╗
██║╚██╗██║██║██║   ██║██╔══██║   ██║   ██║███╗██║██║██╔══██╗██╔══╝
██║ ╚████║██║╚██████╔╝██║  ██║   ██║   ╚███╔███╔╝██║██║  ██║███████╗
╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚══╝╚══╝ ╚═╝╚═╝  ╚═╝╚══════╝
                                        暗黒専用サイバーパンク設計体系
```

**A dark-mode-only cyberpunk UI design system.**
Framework-agnostic. Pure `#000000` void. Semantic neon palette. AI-first.

</div>

Built on top of [nerv-ui](https://github.com/TheGreatGildo/nerv-ui) by [TheGreatGildo](https://github.com/TheGreatGildo).

## Design Principles

1. **Pure black void** — Background is always `#000000`. No gray, no navy.
2. **Color = function** — Every color has a semantic role. Don't use color decoratively.
3. **Readable first** — 14px base font, 1.5 line-height. Legibility over density.
4. **No CRT effects** — No scanlines, no flicker, no vignette. Clean modern look.
5. **Soft neon** — Cyberpunk-inspired but not eye-burning. Vibrant, not harsh.

## Quick Start

### Vanilla CSS
```html
<link rel="stylesheet" href="nightwire.css">
```

### Tailwind CSS
```js
// tailwind.config.js
import nightwirePreset from './tailwind.preset.js';
export default { presets: [nightwirePreset] };
```

### Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Saira+Extra+Condensed:wght@400;600;700;800&family=Shippori+Mincho+B1:wght@500;700;800&display=swap" rel="stylesheet">
```

### AI Agents (Claude Code, etc.)
Drop `SKILL.md` into your project as a skill. The agent can then generate Nightwire-compliant UIs from natural language prompts.

## What's Included

**Design tokens** — Colors, semantic roles, surfaces, type scale, spacing, border radius.

**Utility classes** — Text color, glow effects, surface levels, borders, grid layouts.

**Component styles** — Buttons, cards, panels, modals, tabs, sidebar nav, dropdowns, breadcrumbs, tooltips, data tables, metrics grids, badges, tags, status LEDs, avatars, key-value rows, progress bars, skeleton loaders, toasts, dividers.

**Tailwind preset** — All tokens mapped to Tailwind's config (colors, fonts, spacing, radius, shadows).

**Accessibility** — All colors pass WCAG AA on black. Focus-visible outlines. Reduced-motion support.

## Color Palette

| Role | Color | Hex | Contrast on Black |
|---|---|---|---|
| Primary | Blue | `#6699ff` | 7.5:1 |
| Success | Green | `#7aed7a` | 11.2:1 |
| Info | Cyan | `#66ddff` | 10.8:1 |
| Danger | Red/Pink | `#ff6688` | 6.4:1 |
| Warning | Yellow | `#e8993a` | — |
| Accent | Purple | `#b266e0` | — |

## File Structure

```
nightwire/
├── nightwire.css          <- Design tokens, utilities & component styles
├── tailwind.preset.js     <- Tailwind CSS preset with all tokens
├── demo.html              <- Full working demo (blockchain dashboard)
├── demo2.html             <- Full working demo (neural ops center)
├── SKILL.md               <- Claude Code skill (full design system spec)
├── LICENSE                 <- MIT (with nerv-ui credits)
├── README.md
└── components/
    ├── event-log.html
    ├── vault-card.html
    ├── magi-oracle.html
    ├── metrics-grid.html
    └── data-table.html
```

## Credits

Built on [nerv-ui](https://github.com/TheGreatGildo/nerv-ui) by TheGreatGildo. Licensed under MIT.

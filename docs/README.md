# Nightwire Docs

React + Vite + Tailwind docs site for the Nightwire design system.

Live at: (deployment target TBD)

## Development

```bash
npm install
npm run dev      # http://localhost:5173 (default Vite port)
npm run build    # production build to dist/
npm run preview  # serve dist/
```

## Structure

```
docs/
├── src/
│   ├── pages/           Page components (one per route)
│   │   ├── OverviewPage.tsx
│   │   ├── QuickStartPage.tsx
│   │   ├── InstallPage.tsx
│   │   ├── TokensPage.tsx
│   │   ├── ColorsPage.tsx
│   │   ├── TypographyPage.tsx
│   │   ├── SurfacesPage.tsx
│   │   ├── SpacingPage.tsx
│   │   ├── Layer2TokensPage.tsx  (v2)
│   │   ├── ComponentsPage.tsx
│   │   ├── ButtonsPage.tsx
│   │   ├── DataPage.tsx
│   │   ├── FeedbackPage.tsx
│   │   ├── PanelsPage.tsx
│   │   ├── MoreComponentsPage.tsx
│   │   ├── IntensityPage.tsx     (v2)
│   │   ├── TemplatesPage.tsx
│   │   └── ExamplesPage.tsx
│   ├── components/      Shared UI (Shell, Sidebar, StatusBar, etc.)
│   └── data/            Single source for COLORS, FONTS, COMPONENTS, SIDEBAR_GROUPS
├── tailwind.config.js   Uses the root tailwind.preset.js
└── vite.config.ts
```

## Adding a new page

1. Create `src/pages/NewPage.tsx` exporting a default React component.
2. Add an entry to the appropriate group in `src/data/index.ts` `SIDEBAR_GROUPS`. Set `isNewV2: true` on the item if it belongs to the v2 surface (the Sidebar renders a small "v2" chip next to the label automatically).
3. Register the route in `App.tsx` (pages are imported directly there — no barrel file).

## Sidebar structure

The sidebar is driven by `SIDEBAR_GROUPS` in `src/data/index.ts` — four named sections rendered in order:

| Section | kanji | Contents |
|---|---|---|
| Getting Started | 入門 | Overview, Quick Start, Installation |
| Foundation | 基礎 | Tokens, Colors, Typography, Surfaces, Spacing, Layer 2 Tokens |
| Components | 部品 | Component Registry, Buttons, Data, Feedback, Panels, More Components |
| Patterns | 応用 | Intensity System, Templates, Live Examples |

Items with `isNewV2: true` get a small "v2" chip rendered inline by `Sidebar.tsx`. Currently `Layer2TokensPage` (Foundation) and `IntensityPage` (Patterns) carry that flag.

See `CHANGELOG.md` at the repo root for the full v2 surface.

## Tailwind config

The docs site imports the root `tailwind.preset.js`. To see new v2 semantic tokens (`bg-nw-chrome`, `text-nw-ai`, `border-nw-line-strong`), rebuild after editing the preset.

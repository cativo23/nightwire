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
│   │   ├── ComponentsPage.tsx
│   │   ├── ButtonsPage.tsx
│   │   ├── DataPage.tsx
│   │   ├── FeedbackPage.tsx
│   │   ├── PanelsPage.tsx
│   │   ├── MoreComponentsPage.tsx
│   │   ├── TemplatesPage.tsx
│   │   └── ExamplesPage.tsx
│   ├── components/      Shared UI (Shell, Sidebar, StatusBar, etc.)
│   ├── data/            Single source for COLORS, FONTS, COMPONENTS, SIDEBAR_ITEMS
│   └── pages/index.ts   Page barrel export
├── tailwind.config.js   Uses the root tailwind.preset.js
└── vite.config.ts
```

## Adding a new page

1. Create `src/pages/NewPage.tsx` exporting a default React component.
2. Add an entry to `src/data/index.ts` `SIDEBAR_ITEMS`.
3. Register the route in the router (currently inside `App.tsx`).

## v2-alpha

The docs site is being extended with:
- `IntensityPage.tsx` — documents the `data-intensity` attribute and its knobs
- `COMPONENTS_V2` data block — the new v2 component registry
- Sidebar grouping (v1 / v2-alpha) so consumers can browse the additive surface separately

See `CHANGELOG.md` at the repo root for the full v2 surface.

## Tailwind config

The docs site imports the root `tailwind.preset.js`. To see new v2 semantic tokens (`bg-nw-chrome`, `text-nw-ai`, `border-nw-line-strong`), rebuild after editing the preset.

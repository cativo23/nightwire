# Nightwire Docs

React + Vite + Tailwind docs site for the Nightwire design system.

Live at: https://nightwire.cativo.dev

## Development

```bash
npm install
npm run dev      # http://localhost:5173 (default Vite port); from the repo root: npm run docs:dev
npm run build    # production build to dist/
npm run preview  # serve dist/
```

## Structure

```
apps/docs/
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
│   │   ├── Layer2TokensPage.tsx
│   │   ├── ComponentsPage.tsx
│   │   ├── ButtonsPage.tsx
│   │   ├── DataPage.tsx
│   │   ├── FeedbackPage.tsx
│   │   ├── PanelsPage.tsx
│   │   ├── PiecesPage.tsx
│   │   ├── MoreComponentsPage.tsx
│   │   ├── IntensityPage.tsx
│   │   ├── TemplatesPage.tsx
│   │   └── ExamplesPage.tsx
│   ├── components/      Shared UI (Sidebar, StatusBar, Ticker, etc.)
│   └── data/            COLORS, FONTS, COMPONENTS, SIDEBAR_GROUPS; tokens.mjs reads tokens.json
├── tailwind.config.js   Uses the root ../../tailwind.preset.js
└── vite.config.ts       Aliases @nightwire/css to the root ../../nightwire.css
```

The app keeps no copy of the stylesheet or the preset: both are the generated files at the repo
root. Run `npm run build` at the root after changing `src/`.

## Token values

The Motion vocabulary table (Layer 2 Tokens page) and the Knobs by mode table (Intensity page)
are not written by hand. `src/data/index.ts` imports `../../../../src/tokens/tokens.json` and
`src/data/tokens.mjs` formats the durations, curves and per-level knobs from it, so a token change
shows up on the site with no docs edit. Only the human copy (`use`, `desc`) and the choice of which
knobs each column lists live in `index.ts`. If a listed knob is no longer overridden by a level, the
page throws on load instead of showing a stale row. The Docker images copy `tokens.json` and
`src/components/` next to `nightwire.css` for the same reason. Colours, fonts, the component registry and the Layer 2
`maps` column are still written in `index.ts`.

## Adding a new page

1. Create `src/pages/NewPage.tsx` exporting a default React component.
2. Add an entry to the appropriate group in `src/data/index.ts` `SIDEBAR_GROUPS`.
3. Register the route in `App.tsx` (pages are imported directly there — no barrel file).

## Sidebar structure

The sidebar is driven by `SIDEBAR_GROUPS` in `src/data/index.ts` — four named sections rendered in order:

| Section | kanji | Contents |
|---|---|---|
| Getting Started | 入門 | Overview, Quick Start, Installation |
| Foundation | 基礎 | Tokens, Colors, Typography, Surfaces, Spacing, Layer 2 Tokens |
| Components | 部品 | Component Registry, Buttons, Data, Feedback, Panels, Mockup Pieces, More Components |
| Patterns | 応用 | Intensity System, Templates, Live Examples |

See `CHANGELOG.md` at the repo root for what changed in each release.

## Tailwind config

The docs site imports the root `tailwind.preset.js`, which is generated from `src/tokens/tokens.json`. To see the semantic tokens (`bg-nw-chrome`, `text-nw-ai`, `border-nw-line-strong`), run `npm run build` at the repo root after editing the tokens.

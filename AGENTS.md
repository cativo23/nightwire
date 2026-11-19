# AGENTS.md

Guidance for coding agents working **on** this repository. To help someone **use** Nightwire in
their own project, read [`skill/nightwire/SKILL.md`](skill/nightwire/SKILL.md) and
[`DESIGN.md`](DESIGN.md) instead.

## Layout

- `src/tokens/tokens.json`: every design token (W3C DTCG + `$extensions["dev.cativo.nightwire"]`).
- `src/index.css`: ordered `@import` manifest. Order is the cascade.
- `src/base/`, `src/utilities/`, `src/components/`: stylesheet sources, one file per component.
- `cli/`: TypeScript source of the `nightwire install` CLI (compiled to `dist/`).
- `apps/docs/`: docs site; it imports the root `nightwire.css` and `tailwind.preset.js`.
- `scripts/`: build scripts and `scripts/parity/` (computed-style comparison).
- `tests/`: `node:test` tests and fixtures.
- `docs/`: architecture notes, proposals, roadmap.

The full table, with every top-level path marked hand-edited or generated, is in
[CONTRIBUTING.md](CONTRIBUTING.md).

## Generated files: never edit by hand

- `nightwire.css` (from `src/`)
- `tailwind.preset.js` (from `src/tokens/tokens.json`)
- `DESIGN.md`, between `# <generated:NAME>` and `# </generated:NAME>` only
- `src/tokens/tokens.css`, `dist/` (ignored)

Edit the source, run `npm run build`, and commit source and output together. CI fails on stale
output.

## Commands

```sh
npm ci
npm run build    # build:tokens → build:css → build:cli
npm test         # node --test tests/**/*.test.mjs
npm run parity   # computed-style diff vs main; needs local Chrome (or NW_CHROME_PATH)
```

## Rules

- Do not change rendered output unless the task asks for it. For refactors, `npm run parity` must
  report `differences=0` with full coverage.
- Do not add `exports`, `type` or `engines` to `package.json`, and do not rename or remove
  published classes, tokens or files: those are consumer-facing (see
  [docs/architecture/intensity.md](docs/architecture/intensity.md), K5). The one exception is the
  v1 surfaces that v3 removed under FR-016, listed in
  [docs/design/v3/v1-inventory.md](docs/design/v3/v1-inventory.md) (`.led.<colour>`, `.tag-warning`,
  `.nw-progress .fill`, `.stack`, the header gradient and pattern tokens). They are gone on purpose:
  do not restore them, and do not read that list as a conflict with this rule. Anything else
  published still stays.
- Build scripts stay zero-dependency Node ESM. Write the test first.
- Conventional commits, one concern each, no AI attribution trailers.

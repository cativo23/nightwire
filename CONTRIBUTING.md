# Contributing to Nightwire

Thanks for helping. Nightwire is a small, single-package design system: one stylesheet, one
Tailwind preset, one AI-readable spec, and a CLI that installs them. Most of what ships is
generated, so the first rule is to know which files are sources.

## Where things live

| Path | Kind | What it is |
|------|------|------------|
| `src/tokens/tokens.json` | **hand-edited** | Every design token (W3C DTCG). See [docs/architecture/tokens.md](docs/architecture/tokens.md) |
| `src/index.css` | **hand-edited** | The ordered manifest that becomes `nightwire.css` |
| `src/base/`, `src/utilities/`, `src/components/` | **hand-edited** | Stylesheet sources, one file per component |
| `nightwire.css` | generated | `npm run build` from `src/`. Committed: consumers read it from the repo root |
| `tailwind.preset.js` | generated | `npm run build` from `tokens.json`. Committed |
| `DESIGN.md` | mixed | Token regions between `# <generated:…>` markers are generated; everything else is hand-edited |
| `cli/` | **hand-edited** | TypeScript source of the `nightwire install` CLI |
| `dist/` | generated, ignored | `tsc` output, published to npm |
| `skill/nightwire/` | **hand-edited** | Agent skill and references shipped with the package |
| `apps/docs/` | **hand-edited** | Docs site (React + Vite + Tailwind) built on the root `nightwire.css` and preset |
| `docs/` | **hand-edited** | Contributor docs: architecture, proposals, roadmap |
| `examples/` | **hand-edited** | Standalone HTML demos and component snippets |
| `scripts/` | **hand-edited** | Build scripts and the parity tool |
| `tests/` | **hand-edited** | `node:test` unit tests and fixtures |
| `.github/` | **hand-edited** | CI, docs deploy and release workflows |
| `package.json`, `package-lock.json`, `tsconfig.json` | **hand-edited** | Package and compiler config (`npm install` updates the lockfile) |
| `docker-compose.yml`, `docker-compose.dev.yml`, `.dockerignore` | **hand-edited** | Local docs site in Docker (repo root is the build context) |
| `README.md`, `CHANGELOG.md`, `LICENSE` | **hand-edited** | Consumer-facing docs and license |
| `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `AGENTS.md` | **hand-edited** | Community and agent guides |
| `.gitignore` | **hand-edited** | Ignore rules |

**Never edit a generated file.** Change its source and run `npm run build`. CI rebuilds on every
pull request and fails if a committed generated file is stale.

## Setup

You need Node.js 20 or newer (CI uses 24) and npm.

```sh
npm ci
npm run build   # tokens → stylesheet → CLI
npm test        # unit tests (node:test, no extra dependencies)
```

The docs site: `npm run docs:dev` (or `docker compose -f docker-compose.dev.yml up`).

## Making a change

- **A token:** edit `src/tokens/tokens.json`, then build. See
  [docs/architecture/tokens.md](docs/architecture/tokens.md).
- **A component:** edit its file in `src/components/`. A new component gets a new file and an
  `@import` line in `src/index.css`. See [docs/architecture/cascade.md](docs/architecture/cascade.md).
- **Build tooling:** write the test first in `tests/`, then the code in `scripts/`.

Commit the source and the regenerated files together.

## Checking that nothing changed visually

`npm run parity` loads pages in your local Google Chrome twice, once with each stylesheet, and
compares the computed style of every element and pseudo-element. It covers 8 states (intensity
`none`/`archive`/`operator`/`combat` × reduced motion off/on), forces `:hover`, `:focus`,
`:focus-visible`, `:focus-within` and `:active` on every stateful selector (together when a
selector combines them), compares `@keyframes`, and fails if any class or attribute state in the
stylesheet is not exercised by at least one page.

```sh
npm run parity                                      # main's nightwire.css vs your built one
npm run parity -- --old git:v2.0.1 --new nightwire.css
npm run parity -- --pages "examples/html/workshop.html" --max-lines 50
NW_CHROME_PATH=/usr/bin/chromium npm run parity     # no branded Chrome installed
```

It prints `DIFF` lines, a `COVERAGE` line and `RESULT differences=N`. Exit code 0 means no
differences and full coverage; 1 means differences or missing coverage; 2 means a usage error, a
browser that would not start, or a page that never loaded `nightwire.css`. If coverage drops because you added a class, add markup for it to
`scripts/parity/fixtures/coverage.html`.

Run it before any refactor that should be invisible. For an intended visual change, the
differences it reports should be exactly the ones you meant.

## Commits and branches

- Conventional commits: `type(scope): description` (`feat`, `fix`, `docs`, `refactor`, `test`,
  `chore`, `ci`). The body explains why; the diff shows what.
- One concern per commit.
- Branches: `type/NNN-short-slug`, for example `refactor/001-repo-restructure`.
- No AI attribution trailers (`Co-Authored-By`, session links) in commits or PR descriptions.

## Compatibility

Nightwire follows semver strictly. A minor release only adds; anything that changes default
rendering, renames or removes a class or token, or changes how the package resolves (`exports`,
`type`, `engines`) waits for a major. [docs/roadmap.md](docs/roadmap.md) has the details.

## Releases

Releases are the maintainer's call. `.github/workflows/release.yml` publishes when a pull request
from a `release/vX.Y.Z` branch is merged into `main` (or on a manual dispatch); other merges do
not release. Please don't bump the version or open `release/` branches unless asked.

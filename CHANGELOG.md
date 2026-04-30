# Changelog

All notable changes to this project will be documented in this file.

## [1.0.10]

### Fixed
- Changed relative paths inside the CLI installer script so `npx` points directly to the bundled assets inside the package instead of looking outside to a monorepo root.

## [1.0.9]

### Fixed
- Fixed missing files when running via `npx` by bundling assets into the `packages/cli` distribution.
- Changed the root directory resolution so `install.js` looks internally instead of globally.

## [1.0.8]

### Fixed
- Attempt 8: Use `--provenance` explicit flag without explicit ENV tokens since Lumira has no secrets configured. It turns out Lumira does *not* have an `NPM_TOKEN` secret despite it referencing one in the yaml. Thus we must use true secretless OIDC publishing.

## [1.0.7]

### Fixed
- Attempt 7: Run npm publish from root (with `cd packages/cli`) rather than `working-directory`

## [1.0.6]

### Fixed
- Attempt 6 at npm publish with GitHub Actions

## [1.0.5]

### Fixed
- Reverted registry-url and use NODE_AUTH_TOKEN explicitly from NPM_TOKEN secret for npm publish

## [1.0.4]

### Fixed
- npm publish via GitHub Actions OIDC Trusted Publishing (removed registry-url from setup-node)

## [1.0.3]

### Fixed
- GitHub Actions workflow: run npm publish from repo root to fix OIDC Trusted Publishing

## [1.0.2]

### Fixed
- npm publish via GitHub Actions OIDC Trusted Publishing now works correctly

## [1.0.1]

### Changed
- CLI install command now shows ASCII art banner on startup
- Renamed npm package to `@cativo23/nightwire`, binary to `nightwire`
- Switched npm publish to OIDC Trusted Publishing (no tokens required)

## [1.0.0]

### Added
- `nightwire.css` — 24+ pure CSS components, 42 design tokens, cyberpunk aesthetic
- `tailwind.preset.js` — full token mapping for Tailwind CSS v3+
- `DESIGN.md` — Google design.md standard spec (9.5/10 AI-readability)
- `SKILL.md` — Anthropic skill standard (279 lines) with `references/layouts.md` and `references/examples.md`
- `packages/cli/` — `nightwire-cli` interactive installer with project type detection
- `docs/` — React + Vite documentation site with 16 pages, real routes, responsive layout, Docker support
- `examples/` — `dashboard.html` and `neural-ops.html` demos with Three.js
- GitHub Actions workflow for auto release and npm publish

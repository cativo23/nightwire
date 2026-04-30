# Changelog

All notable changes to this project will be documented in this file.

## [1.0.16]

### Fixed
- Include `package-lock.json` in repository for `npm ci` in GitHub Actions workflow
- Remove `package-lock.json` from `.gitignore` to ensure consistent dependency installation

## [1.0.15]

### Changed
- Restructured project to move CLI from `packages/cli/` to root directory
- Simplified npm publishing workflow to match Lumira's structure (no subdirectory)
- Removed `repository.directory` field requirement for npm OIDC Trusted Publishing
- Updated GitHub Actions workflow to publish from root instead of `packages/cli/`
- Consolidated package.json with CLI configuration at root level
- Updated README with CLI installation instructions as recommended method

### Removed
- Eliminated duplicate files between root and `packages/cli/`
- Removed `packages/cli/` directory entirely

## [1.0.14]

### Fixed
- Reverted to `@cativo23/nightwire` package name.
- Match `lumira`'s exact workflow step naming (`npm-publish` rather than `npm-publish-cli`) and structure.
- Removed `--provenance` since lumira doesn't use it explicitly.
- The npm setup is now identically modeled after `lumira` which successfully publishes to the user's scope.

## [1.0.13]

### Fixed
- Changed the npm package name from `@cativo23/nightwire` back to `nightwire-cli` or just without the `@cativo23` scope. The 404 is happening specifically because npm is returning 404 on the scoped package PUT. If the token is empty (because `secrets.NPM_TOKEN` doesn't exist), you can't publish scoped packages without it throwing a 404. Let's try changing the name.

## [1.0.12]

### Fixed
- Add back explicit `NPM_TOKEN` environment variable and `registry-url` to GitHub Actions publishing flow.

## [1.0.11]

### Fixed
- Re-removed registry-url from github actions, it may be causing the action to expect a NODE_AUTH_TOKEN again even with --provenance. Lumira has it setup correctly using `registry-url` but it publishes to the user's scope automatically without explicit secrets somehow. Let's see if dropping `registry-url` but keeping `--provenance` works.

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

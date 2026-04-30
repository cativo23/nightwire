# @cativo23/nightwire

CLI installer for the [Nightwire](https://github.com/cativo23/nightwire) dark cyberpunk UI design system.

## Usage

```bash
npx @cativo23/nightwire install
```

Installs into your project:
- `nightwire.css` — 24+ pure CSS components, 42 design tokens
- `DESIGN.md` — AI-readable design spec (Google design.md standard)
- `skill/nightwire/SKILL.md` — AI skill for Claude, Cursor, Copilot, v0

## What it does

Interactive prompts detect your project type (Next.js, Vite, Astro, plain HTML) and copy the right files. Optionally includes the Tailwind CSS preset and AI skill files.

## Manual install

```html
<!-- 1. Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Saira+Extra+Condensed:wght@400;600;700;800&family=Shippori+Mincho+B1:wght@500;700;800&display=swap" rel="stylesheet">

<!-- 2. CSS -->
<link rel="stylesheet" href="nightwire.css">
```

## Docs

[nightwire.cativo.dev](https://nightwire.cativo.dev) · [GitHub](https://github.com/cativo23/nightwire)

## License

MIT

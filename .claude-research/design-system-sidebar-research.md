# Nightwire Sidebar Restructure — Research & Proposal

Date: 2026-05-20
Branch: `feature/v2-alpha`
Status: Proposed (pre-apply)

---

## 1. Research: How established design systems group their docs

### Shopify Polaris (`polaris.shopify.com`)
Top-level sidebar (in order): **Getting started · Foundations · Design · Content · Patterns · Components · Tokens · Icons · Contributing · Tools · Version guides · Previous releases**. Polaris treats *Foundations* (principles, accessibility) separately from *Tokens* (the actual variable names), and gives *Patterns* its own bucket between the abstract foundations and the concrete components. The split between "Foundations" and "Tokens" is one of the few systems that does this explicitly — most others collapse them.

### IBM Carbon (`carbondesignsystem.com`)
Top-level: **Get started · Designing · Developing · Guidelines · Components · Patterns · Data visualization · Help · About**. Carbon's sidebar is heavy because it serves both designers and developers. The relevant cue for us: *Guidelines* (accessibility, content, motion — the system-wide concerns) sits beside *Components* and *Patterns* as a peer, not nested inside foundations.

### Radix Primitives (`radix-ui.com/primitives`)
Top-level: **Overview · Guides · Components · Utilities**. Radix is the minimal, dev-focused example: only four buckets. *Overview* is install/intro, *Guides* is concept docs ("Styling", "Animation", "Composition"), then primitives and utilities. The lesson: a small system can get away with 3–4 sections; you don't need to invent a section for everything.

### Vercel Geist (`vercel.com/geist`)
Top-level: **Foundations · Components · Resources · Brands**. *Foundations* contains Introduction, Colors, Typography, Materials — i.e., the visual primitives. *Resources* is for guides, changelog, icons. Geist proves a clean three-bucket model works (Foundations / Components / Resources) when the system has a tight scope.

### Atlassian Design System (`atlassian.design`)
Top-level: **Foundations · Patterns · Components · Brand · Content · Get Started**. Atlassian groups things like *Color, Typography, Tokens, Accessibility, Iconography* under **Foundations**, and reserves **Patterns** for usage recipes ("Rovo AI", forms, etc.). Components stay flat and discoverable.

### Chakra UI (`chakra-ui.com`)
Top-level: **Getting Started · Theming · Styled System · Components · Hooks**. Chakra separates the *theme tokens / customization* engine ("Theming", "Styled System") from the actual *components*. The takeaway for us: when a system has a strong "configuration / theming" story (which Nightwire does via density, intensity, layer-2 tokens), it deserves its own section name — not folded into Foundations.

### Consensus pattern (6 bullets)

1. **3–5 top-level sections is the norm.** Anything more becomes a wall.
2. **"Foundations" or "Getting Started" comes first** — install, intro, principles, plus the visual primitives (color, type, spacing). Everyone has this.
3. **"Components" is its own section** with each component as a leaf. Never split components flat at the top level (which is what Nightwire currently does).
4. **"Patterns / Templates / Examples"** is its own section, separate from components — recipes vs. parts.
5. **System-wide concepts (theming, density, intensity, dark mode, motion)** either get folded into Foundations (Atlassian, Polaris) or get a dedicated *"Theming" / "Styled System"* section (Chakra). The dedicated-section route is better when those concepts are user-facing knobs, not just internals.
6. **Tokens live near foundations**, never inside Components. Polaris and Atlassian split tokens out as a peer of Foundations; Geist folds them in. Either works.

---

## 2. Proposed structure for Nightwire

Four sections, in this order. Each item keeps its existing route (no URL changes). v2 items are marked with a `v2` chip but stay inline.

```
GETTING STARTED   入門
  ├─ Overview              /overview
  ├─ Quick Start           /quickstart
  └─ Installation          /install

FOUNDATION        基礎
  ├─ Design Tokens         /tokens
  ├─ Color Palette         /colors
  ├─ Typography            /typography
  ├─ Surface Hierarchy     /surfaces
  ├─ Spacing Scale         /spacing
  └─ Layer 2 Tokens [v2]   /layer2-tokens

COMPONENTS        部品
  ├─ Component Registry    /components
  ├─ Buttons & Actions     /buttons
  ├─ Data Display          /data
  ├─ Feedback & Status     /feedback
  ├─ Panel Anatomy         /panels
  └─ More Components       /more-components

PATTERNS          応用
  ├─ Intensity System [v2] /intensity
  ├─ Layout Templates      /templates
  └─ Live Examples         /examples
```

### Section justifications

- **Getting Started** — Following Polaris/Carbon/Chakra. Onboarding pages don't belong next to color tokens; they're a different mental mode (read once vs. reference).
- **Foundation** — Visual primitives, in the order a designer would learn them (tokens → color → type → surfaces → spacing). Layer 2 Tokens lives here because it *is* a token tier, just newer — putting it elsewhere would imply it's not foundational, which understates its weight.
- **Components** — Component Registry leads the section (it's the index / overview), then the per-category pages. Mirrors how Radix and Geist do it: the "all components" page sits at the top of the components group.
- **Patterns** — Reserved for "usage recipes" — things that *combine* components or shift the whole system's behavior. Intensity System is a usage pattern (it's a knob you turn at the page level), so it fits better here than in Foundation. Templates and Live Examples are the canonical Patterns content.

### Page → section mapping (every current page accounted for)

| Page                  | Route            | New section      |
| --------------------- | ---------------- | ---------------- |
| OverviewPage          | /overview        | Getting Started  |
| QuickStartPage        | /quickstart      | Getting Started  |
| InstallPage           | /install         | Getting Started  |
| TokensPage            | /tokens          | Foundation       |
| ColorsPage            | /colors          | Foundation       |
| TypographyPage        | /typography      | Foundation       |
| SurfacesPage          | /surfaces        | Foundation       |
| SpacingPage           | /spacing         | Foundation       |
| Layer2TokensPage [v2] | /layer2-tokens   | Foundation       |
| ComponentsPage        | /components      | Components       |
| ButtonsPage           | /buttons         | Components       |
| DataPage              | /data            | Components       |
| FeedbackPage          | /feedback        | Components       |
| PanelsPage            | /panels          | Components       |
| MoreComponentsPage    | /more-components | Components       |
| IntensityPage [v2]    | /intensity       | Patterns         |
| TemplatesPage         | /templates       | Patterns         |
| ExamplesPage          | /examples        | Patterns         |

All 18 current pages mapped. No route changes. v2 chips on `layer2-tokens` and `intensity`.

---

## 3. Implementation notes

- `SIDEBAR_GROUPS` becomes the new source of truth in `docs/src/data/index.ts`.
- `SIDEBAR_ITEMS` is kept as a derived flat alias (`SIDEBAR_GROUPS.flatMap(g => g.items)`) because `Shell.tsx` still imports it for IntersectionObserver wiring even though `Shell` isn't currently mounted by `App.tsx`. Keeping the alias prevents a dead-code TS error and keeps the door open if Shell gets re-introduced.
- `Sidebar.tsx` iterates groups, renders one `.sidebar-section` heading per group, and re-uses the existing v2-chip styling for items where `isNewV2 === true`.

---

## 4. References

- Polaris: https://polaris.shopify.com/
- Carbon: https://carbondesignsystem.com/
- Radix Primitives: https://www.radix-ui.com/primitives
- Vercel Geist: https://vercel.com/geist/introduction
- Atlassian Design System: https://atlassian.design/
- Chakra UI: https://chakra-ui.com/docs/get-started

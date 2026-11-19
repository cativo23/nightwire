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
| `docs/` | **hand-edited** | Contributor docs: architecture, design decisions, proposals, roadmap |
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
npm run parity -- --jobs 1                          # strictly sequential
npm run parity -- --json /tmp/parity.json           # also write the run as JSON (see "Checking the glow rules")
```

The page clock starts paused, so a capture does not depend on how loaded the host is.
Captures run concurrently, one job per page and state. `--jobs N` (or `NW_PARITY_JOBS=N`) sets how
many run at once; the default is `min(6, cores - 2)`, at least 1, and `--jobs 1` is the sequential
run. The output does not depend on `N`. While iterating, pass `--pages <glob>` for the pages you
touch, and run the full set once before committing.

It prints `DIFF` lines, a `COVERAGE` line and `RESULT  differences=N`. Exit code 0 means no
differences and full coverage; 1 means differences or missing coverage; 2 means a usage error, a
browser that would not start, or a page that never loaded `nightwire.css`. If coverage drops
because you added a class, add markup for it to `scripts/parity/fixtures/coverage.html`.

Run it before any refactor that should be invisible. For an intended visual change, the
differences it reports should be exactly the ones you meant.

### Declaring intended changes with `--expect`

`--expect <file>` classifies the differences against a list of change categories instead of
treating every one as a failure. The v3 inventory is
[`docs/design/v3/change-inventory.json`](docs/design/v3/change-inventory.json):

```sh
npm run parity -- --expect docs/design/v3/change-inventory.json
```

Without `--old`, `--expect` compares against the file's `baseline` (`git:v2.1.0` for the v3
inventory), so a later change of `main` cannot silently change what the run compares against. The
`baseline` field is optional; when the file has none, `--old` keeps its usual default `git:main`.
If you pass `--old` and it differs from the baseline, the run still happens, after one
`WARN  --old <x> differs from the category baseline <y>` line printed before the `PARITY` line.

Every difference that a category matches is counted under that category. Only the rest, the
*unexpected* ones, are printed as `DIFF` lines and make the run fail:

```text
DIFF  …                              (unexpected differences only)
CATEGORY  <id>  <count>              (one per category, file order, 0 included)
COVERAGE  …
RESULT  differences=N  unexpected=M
```

Exit code 0 means `unexpected=0` and full coverage; 1 means unexpected differences or missing
coverage; 2 means the file cannot be read, is not valid JSON, or fails validation (the message
names the category and field). Without `--expect` the output and exit codes are unchanged.

A category file is `{ "baseline": "v2.1.0", "categories": [ … ] }`. Each category has:

| Field | Rule |
|---|---|
| `id` | Required, unique, kebab-case. |
| `kind` | Optional. The only value is `"cascade"` (see "Cascade categories and the control run"). |
| `description` | Why the change is intended; link the requirement. |
| `match.prop` | Required regex, tested against the DIFF property (a CSS property, `--custom`, `@keyframes` name or `(element)`). |
| `match.path` | Optional regex against the DOM path. |
| `match.state` | Optional regex against the full state label (see below). |
| `match.old` / `match.new` | Optional regexes against the old and new value (`<missing>` when absent). |
| `match.page` | Optional glob against the page path. `*` and `?` stay inside one directory, `**` crosses directories, `**/` also matches zero directories, everything else is literal. |

A state label joins its parts with `|`: `combat|rm-off`, and `combat|rm-off|:hover@<dom path>` when
a pseudo-state is forced. In a regex an unescaped `|` is alternation, so `"state": "combat|rm-off"`
means "combat or rm-off" and also matches `archive|rm-off`. Escape the pipe and anchor the start to
pin one label, which still matches the forced-pseudo variants that continue after it:

```json
"state": "^combat\\|rm-off"
```

Regexes are unanchored, like `RegExp.test`; add `^` and `$` to pin a value. An empty string in
any `match` field is rejected, because it would match every difference. A difference is
expected when at least one category matches all of the fields that category has. It counts
toward the **first** matching category in file order only, so the counts plus `unexpected`
always add up to `differences`. Every new rendering difference gets a category in the same
commit that causes it.

The categories in `change-inventory.json` that follow an intensity level are pinned to one level
each: the `state` anchors the intensity (`^combat\\|rm-off`, say), and `old` and `new` pin one exact
old-to-new pair. A value seen at `archive` therefore cannot stand for the same category at
`combat`, and a new value at any level fails until someone names it. When `--expect` reports an
unexpected difference at one level, add or retune the category for that level, not a looser one.

### Cascade categories and the control run

An open layout in a container (v3's `.panel`, `.card`, their headers and `.kv-row`) changes the size
of everything inside it, which would need one pinned category per old-to-new value. A category with
`"kind": "cascade"` explains those geometric differences without pinning values, on two conditions
(FR-038):

1. **Validation.** `match.prop` must be exactly `^name$`, `^(name|name)$` or `^(?:name|name)$`, with
   every name one of the geometric properties the browser resolves from layout: `width`, `height`,
   `inline-size`, `block-size`, `transform-origin`, `perspective-origin`, the offsets `top`, `right`,
   `bottom`, `left`, `inset-block-start`, `inset-block-end`, `inset-inline-start`,
   `inset-inline-end`, the resolved horizontal margins `margin-left` and `margin-inline-start`, the
   grid track sizes `grid-template-columns` and `grid-template-rows`, and `aspect-ratio`; anything
   else (colours, fonts, padding, border widths, other margins) is rejected (`width` unanchored, `.*`, `^width|color$`,
   `^(width|--nw-glow)$`). `match.path` and `match.page` are both required, and `match.path` must not
   match `:root` or `@keyframes` (where custom properties and keyframes are recorded), so `.` is
   rejected. Scope `path` to the opened components (`.panel`, `.card`, their headers and `.kv-row`, and what is
   inside them) or, when an ancestor's size follows them, to that ancestor only: the page box (`html`,
   `body`) or the row or grid that holds the panels. Cut `match.prop` to the properties seen on that
   page and path; a category that accepts all of them says nothing.
   `match.old` and `match.new` are optional. Any other `kind` is rejected, and a category without
   `kind` follows the rules above.
2. **The control run.** `--control <css>` appends that sheet to the new stylesheet, so it wins at
   equal specificity, and ignores every cascade category. Write the sheet to restore the pre-change
   layout declarations of those components. If the run then reports `unexpected=0`, the open layout
   is proven to be the cause of every difference the cascade categories absorb.

```sh
npm run parity -- --expect docs/design/v3/change-inventory.json                                # cascade categories count
npm run parity -- --expect docs/design/v3/change-inventory.json --control path/to/control.css  # the proof
```

The control run prints one extra line before `RESULT`, and the exit codes are unchanged:

```text
CONTROL  sheet=<path>  cascade-categories-ignored=N
```

`--control` without `--expect`, or with a file that cannot be read, exits 2. With `--json`, `meta.control`
is the sheet path, or `null` without the flag, and each difference's `category` is computed without
the cascade categories. A cascade category states an expectation: write it by hand, never derive it
from a run's output. Every non-geometric difference keeps a narrow category.

### Checking the glow rules

`--json <file>` also writes the run as JSON: `meta`, every difference with its category (`null`
when none explains it), and `shadows`, every element whose `box-shadow` or `text-shadow` is not
`none` on either side, changed or not. `scripts/parity/glow-check.mjs` reads it and checks
FR-013b / SC-012:

```sh
npm run parity -- --expect docs/design/v3/change-inventory.json --json /tmp/parity.json
node scripts/parity/glow-check.mjs /tmp/parity.json
```

At `none` and `operator` every glow must be a smaller blur than v2.1.0's (or gone), layer by layer;
at `archive` no element may have a coloured blur; at `combat` only state signals (LED, check,
switch, segmented, steps, progress) may blur more than at operator, and they stay below v2.1.0's
combat blur. Neutral black layers (the overlay elevation) and layers without blur (focus rings,
pressed states) are listed as exceptions. Exit code 1 means a violation.

## Checking the colour contrast

```sh
npm run design:contrast                          # every pairing, one PASS or FAIL line each
npm run design:contrast -- --quiet               # the summary and the failures only
npm run design:contrast -- --pairs <file> --css <file>
```

`docs/design/v3/contrast-pairs.json` lists each pairing (text, labels, signal colours, button
labels, tags, placeholders, focus rings and control boundaries, on each surface they sit on). The
script emits the tokens in memory from `src/tokens/tokens.json`, so it needs no build and cannot read
a stale `tokens.css` (`--css <file>` checks a stylesheet instead), and checks WCAG: 4.5:1 for text, 3:1 for large text and UI boundaries. `tests/contrast.test.mjs` runs it
inside `npm test` and also fails when a colour token used by a component has no pair. Pairings
marked `exempt` in the file (disabled controls, hover borders) are listed, not checked. Exit code 1
means a pairing fails; 2 means a usage or data error. A new colour on a component needs a pair in
the same commit.

## Rendering the direction board

```sh
npm run design:board                              # before (git:v2.1.0) and after, 3 intensities, 6 PNGs
npm run design:board -- --out .cache/board --wait 2000
npm run design:board -- --page examples/html/dashboard.html --before git:main
```

`docs/design/v3/board.html` is the page the maintainer reviews a visual change on. The script
renders it as full-page PNGs in your local Chrome (`NW_CHROME_PATH` works here too), once for the
`--before` stylesheet (default `git:v2.1.0`) and once for `--after` (default the working tree
`nightwire.css`), at `archive`, `operator` and `combat`. Elements with `data-force=":hover
:focus-visible"` get those states forced, so they can be photographed. `--css <spec>` renders one
stylesheet, `--page` renders another page, and `--wait MS` pauses after load for a page that builds
its view on a timer or boot sequence. Files are named `board-<label>-<intensity>.png` in `--out`
(default `nightwire-board/` under the system temp directory); nothing is written inside the repo.
Exit code 0 means rendered, 2 means a usage error or a browser that would not start.

## Checking overlays in real browsers

`npm run test:browsers` opens the six overlays (drawer, modal, command palette, dropdown, toast,
tooltip) in real Chrome and real Firefox and runs 65 checks per engine: open and close really
animate and hide on time, a closed overlay cannot be hit or tabbed to, re-opening mid-close does
not flash, first paint with `data-open="true"` does not animate, reduced motion switches
instantly, the LED pulse follows intensity, and the console stays clean. Expected enter and exit
durations are read from the stylesheet at run time, so retuning the motion tokens does not
require editing the harness. It is not part of `npm test`: it needs local browsers.

```sh
npm run test:browsers                                  # Chrome and Firefox
npm run test:browsers -- --engine firefox --out .cache/browsers  # one engine, custom output directory
NW_CHROME_PATH=/usr/bin/chromium NW_FIREFOX_PATH=/opt/firefox/firefox npm run test:browsers
```

Chrome runs through `playwright-core` (the `chrome` channel, or `NW_CHROME_PATH`); Firefox runs
through `puppeteer-core` against `NW_FIREFOX_PATH` or `/usr/bin/firefox`. Neither downloads a
browser. Pages, `results-<engine>.json` and `results.md` go to `--out`, by default
`nightwire-browsers/` under the system temp directory; nothing is written inside the repo. Exit
code 0 means every check passed, 1 means a check failed, 2 means a usage error or a browser that
would not start.

## Commits and branches

- Conventional commits: `type(scope): description` (`feat`, `fix`, `docs`, `refactor`, `test`,
  `chore`, `ci`). The body explains why; the diff shows what.
- One concern per commit.
- Branches: `type/NNN-short-slug`, for example `refactor/001-repo-restructure`.
- No AI attribution trailers (`Co-Authored-By`, session links) in commits or PR descriptions.

## Compatibility

Nightwire follows semver strictly. A minor release only adds; anything that changes default
rendering, renames or removes a class or token, or changes how the package resolves (`exports`,
`type`, `engines`) waits for a major. v3 is that major for `type`: `package.json` is
`"type": "module"` (K5), with `dist/package.json` keeping the CLI CommonJS. `exports` and `engines`
are still not declared, and adding them is a consumer-facing change that needs its own decision
(see AGENTS.md). [docs/roadmap.md](docs/roadmap.md) has the details.

## Releases

Releases are the maintainer's call. `.github/workflows/release.yml` publishes when a pull request
from a `release/vX.Y.Z` branch is merged into `main` (or on a manual dispatch); other merges do
not release. Please don't bump the version or open `release/` branches unless asked.

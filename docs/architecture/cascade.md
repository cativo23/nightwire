# Cascade order

`nightwire.css` is assembled from `src/` in the order `src/index.css` lists. In CSS, when two rules
with the same specificity set the same property on the same element, the later one wins. The
manifest order is therefore part of the design system's behaviour, not just tidiness.

## The order and why

| # | Files | Why here |
|---|-------|----------|
| 1 | `tokens/tokens.css` | Custom properties first; everything below reads them. It ends with the generated reduced-motion block (see below) |
| 2 | `base/reset.css` | Element defaults before any class |
| 3 | `base/accessibility.css` | Global focus ring and the reduced-motion animation kill switch (a backstop for anything the knobs do not reach) |
| 4 | `utilities/surface, text, glow, border, layout` | Single-purpose classes |
| 5 | `base/typography.css` | `.compressed-title`, font-family utilities, `.kanji` |
| 6 | `components/*` (v1 era) | button → form → badge → led → panel → table → metrics → progress → toast → card → section-head → modal → tabs → sidebar → dropdown → breadcrumbs → tooltip → skeleton → kv-row → avatar → divider → tag |
| 7 | `components/*` (v2 era) | kbd → segmented → switch → check → combo → drawer → cmdk → banner → code → steps → empty → ai-block → stat → uplink |
| 8 | `components/*` (v3 era) | display → chip → link-arrow → kanji-index → accordion → reticle → halftone → barcode → wordmark → grain |

`section-head` is a v3 file, but it sits inside row 6, between `card` and `modal`, because it
restyles `.panel-header` and `.card-header` and must come after `panel` and `card`. The files in
row 8 are the v3 additions, appended in the order they were written.

## The reduced-motion block

Reduced motion has to win over every intensity level (known issue K1). The block that does it is
not a source file: `build:tokens` generates it from token data, at the very end of
`tokens/tokens.css`, after the three intensity blocks. Every token with a `reducedMotion` value
(today `--nw-motion-scale`, `--nw-pulse-state`, `--nw-loop-state`) gets one declaration:

```css
@media (prefers-reduced-motion: reduce) {
  :root,
  :root[data-intensity] { … }
}
```

It wins by equal specificity and later order. `:root[data-intensity]` has the same specificity as
`:root[data-intensity="combat"]`, and the block comes after the intensity blocks, so its values
beat every level; `:root` covers a page with no `data-intensity`. Do not move the block, and do
not add a hand-written reduced-motion override for a knob: flag the token in `tokens.json`
instead ([tokens.md](tokens.md#reduced-motion)).

Files appear in the order their first rule appeared in the original single file. Within a
component file, v1 rules come first and v2 rules after them, each in their original relative
order. Six components had v2 rules far from their v1 siblings and were merged into one file:
button, form, led, modal, tag, and the layout utilities.

## Late-file exceptions

None. The plan allowed `components/<name>.late.css` files for any v2 block whose move next to its
v1 sibling changed a computed style. The parity tool found zero differences for every merge (the
two example pages that load `nightwire.css` plus the coverage fixture, 8 intensity × motion
states, forced `:hover`/`:focus`/`:focus-visible`/`:focus-within`/`:active`, 100% class and
attribute-state coverage), so no
exception was needed. A static check also found no element in the docs, examples or skill
references that combines two rules whose relative order changed.

If a future merge does change the cascade, put the block in `components/<name>.late.css`, open it
with a comment explaining which rule it must follow, list it in the manifest at its required
position, and add it to this section.

## Adding a component

1. Create `src/components/<name>.css`. Start it with a `/* ── Name ── */` banner like the others.
   Keep every selector for that component in this file.
2. Add `@import "./components/<name>.css";` to `src/index.css`. New components go at the end of
   the component list unless they deliberately need to override an earlier one.
3. Run `npm run build` and commit `src/` together with `nightwire.css`.
4. For a change to an existing file, run `npm run parity` before committing: only the selectors
   you touched should differ.

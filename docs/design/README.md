# Design

Design decisions for Nightwire's mature evolution (v3) live in [`v3/`](v3/): a calmer, less
sci-fi look with a real motion system, applied to the whole system rather than shipped as a
separate theme. It keeps Nightwire's own fonts.

- [`v3/direction.md`](v3/direction.md): the approved visual direction (both rounds: glow, line
  weights, hairline alphas, exit durations, pulse, neutral labels, square corners, the bone action)
  with the reason for each value, the contrast results and the SC-006 review decisions.
- [`v3/v1-inventory.md`](v3/v1-inventory.md): every v1 compatibility surface v3 removed or kept,
  with its replacement.
- [`v3/change-inventory.json`](v3/change-inventory.json): every intended rendering change against
  v2.1.0, grouped into categories. `npm run parity -- --expect` checks each difference against it.
- [`v3/contrast-pairs.json`](v3/contrast-pairs.json): the colour pairings `npm run design:contrast`
  checks against WCAG.
- `v3/board.html`: the page `npm run design:board` renders before and after for review.

The visual language the direction produced is described in [`DESIGN.md`](../../DESIGN.md) at the
repo root, and the known issues it inherits are listed in
[architecture/intensity.md](../architecture/intensity.md).

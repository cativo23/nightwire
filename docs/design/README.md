# Design

Design decisions for Nightwire's mature evolution (v3) live in [`v3/`](v3/): a calmer, less
sci-fi look with a real motion system, applied to the whole system rather than shipped as a
separate theme. It keeps Nightwire's own fonts.

- [`v3/direction.md`](v3/direction.md): the proposed visual direction (glow, line weights, hairline
  alphas, exit durations, pulse) with the reason for each value. Status `pending` until the
  maintainer approves it on the direction board.
- [`v3/change-inventory.json`](v3/change-inventory.json): every intended rendering change against
  v2.1.0, grouped into categories. `npm run parity -- --expect` checks each difference against it.

Until v3 ships, the current visual language is described in [`DESIGN.md`](../../DESIGN.md) at the
repo root, and the known issues it inherits are listed in
[architecture/intensity.md](../architecture/intensity.md).

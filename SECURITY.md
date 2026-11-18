# Security policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 2.x (latest release) | yes |
| 1.x and 2.0 pre-releases | no |

Fixes ship in a patch release of the latest 2.x.

## Reporting a vulnerability

Please report privately. Do not open a public issue, discussion or pull request for a security
problem.

- If the repository's **Security** tab offers **Report a vulnerability**, use it. It creates a
  private advisory that only the maintainer can see.
- Otherwise, contact the maintainer through GitHub ([@cativo23](https://github.com/cativo23)) and
  ask for a private channel, without including the details in a public place.

Include what is affected (the stylesheet, the Tailwind preset, the `nightwire install` CLI or the
docs site), the version, steps to reproduce, and the impact you expect.

This is a one-maintainer project, so there is no fixed response time. The aim is to acknowledge
a report, keep you updated while it is open, and credit you when the fix is published unless you
ask otherwise.

## Scope

Nightwire is mostly static CSS. The parts most likely to matter are the CLI, which copies files
into your project, and the docs site build and deployment.

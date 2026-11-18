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

1. Open the repository's **Security** tab and choose **Report a vulnerability**. This creates a
   private advisory that only the maintainer can see.
2. If that option is not available, contact the maintainer through GitHub
   ([@cativo23](https://github.com/cativo23)) and ask for a private channel, without including
   the details in a public place.

Include what is affected (the stylesheet, the Tailwind preset, the `nightwire install` CLI or the
docs site), the version, steps to reproduce, and the impact you expect.

The maintainer acknowledges reports and keeps you updated in the advisory. Once a fix is
released, the advisory is published with credit to the reporter unless you ask otherwise.

## Scope

Nightwire is mostly static CSS. The parts most likely to matter are the CLI, which copies files
into your project, and the docs site build and deployment.

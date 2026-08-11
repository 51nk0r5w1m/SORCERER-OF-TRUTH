# Security Policy

This repository publishes a static DEF CON deck and related research notes. It should not contain production credentials, private keys, Terraform state, local build artifacts, or unpublished personal material.

## Reporting

Please report security issues through GitHub's private vulnerability reporting for this repository when available. If that is not available, open a minimal issue that does not include exploit details or sensitive material, and request a private follow-up channel.

## Repository Rules

- Do not commit secrets, tokens, private keys, `.env` files, Terraform state, browser traces, or generated archives.
- Keep GitHub Pages deployment gated by tests.
- Keep GitHub Actions permissions scoped per job.
- Treat hosted speaker notes and research files as public-facing material.
- Store any future GitHub/Terraform automation state outside this repository, with encrypted remote state and least-privilege credentials.

## Expected Public Surface

- `index.html`
- `images/`
- `DEEP-RESEARCH.MD`
- `README.md`
- `tests/`
- `.github/workflows/pages.yml`


# Project Style Guide

## Naming
- Delano project slugs use kebab-case, for example `happy-bugfix-stabilization`.
- Keep package and runtime references aligned with actual workspace names from root `package.json`.

## Documentation Conventions
- Prefer concise facts over templates or aspirations.
- Use ISO8601 UTC timestamps in Delano frontmatter where timestamps are required.
- Do not include secrets, raw prompt text, private machine-specific absolute paths, or copied sensitive logs.

## Review Expectations
- Run `bash .agents/scripts/pm/status.sh` and `bash .agents/scripts/pm/validate.sh` when Delano artifacts change, then report what passed and what did not run.
- For touched product packages, use the relevant package-level typecheck/test/build commands instead of generic claims.
- For UI changes, follow `docs/CONTRIBUTING.md`: show real running-app proof, not only unit tests.

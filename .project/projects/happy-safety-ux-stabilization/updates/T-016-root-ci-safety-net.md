# T-016 Root CI Safety Net

- Added root scripts for package typechecks, fast unit tests, focused parser tests, server route tests, security regressions, builds, and slow integrations.
- Added `.github/workflows/monorepo-safety-net.yml` with split jobs for fast PR checks, focused contracts, package builds, and manual slow integration checks.
- Kept existing CLI smoke workflow as the packaged CLI/self-host boot coverage path.

Verification:
- `pnpm test:parser`
- `pnpm test:server:routes`
- `pnpm test:security`
- `pnpm typecheck`
- `pnpm test:fast`
- `pnpm build`
- Workflow YAML parsed with PyYAML.

Known local integration status:
- `pnpm test:integration` is intentionally manual-only in CI. A local run failed on environment prerequisites and external/protocol dependencies: missing `socat`, unavailable Codex/Claude responses, and OpenClaw gateway protocol mismatch. The daemon authenticated integration subset passed during that run.

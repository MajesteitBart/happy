# T-022 Compatibility Matrix Evidence

- Added root `pnpm test:compatibility` for app/server/CLI boundary checks:
    - app capability gating,
    - server capabilities route,
    - CLI session and daemon socket clients.
- Added `scripts/write-compatibility-evidence.cjs` and `pnpm evidence:compatibility` to produce a JSON artifact with package versions, declared compatibility floors, routine checks, and required capabilities.
- Added a `compatibility-matrix` GitHub Actions job to `monorepo-safety-net.yml`.
- The job runs on Node 20 and 24, uploads `compatibility-matrix-node-*` artifacts, and also runs weekly on schedule.
- Slow integration remains manual-only in its existing job.

Compatibility floor:
- The current declared floor is captured from `versionRoutes.ts`: CLI `1.1.10-beta.7`, app runtime `1.0.0`.
- No older previous server/CLI floor is declared in repo metadata, so the routine matrix covers current source/packages plus the declared floor artifact rather than inventing unsupported historical pairs.

Verification:
- `pnpm test:compatibility`
- `pnpm evidence:compatibility`
- Workflow YAML parsed with PyYAML.

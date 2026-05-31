---
timestamp: 2026-05-31T07:22:00Z
task: T-020
type: completion
---

# T-020 Model Catalog Capabilities

Completed the real model catalog contract.

- Added server-owned model catalog schema/source at `packages/happy-server/sources/app/api/modelCatalog.ts`.
- Exposed the catalog through `GET /v1/capabilities` and `GET /v1/model-catalog`.
- App model options now prefer session metadata, then catalog version 2+, then bundled fallbacks.
- CLI model validation can read catalog models and falls back when capabilities are missing/stale.
- Added tests for missing catalog fallback, stale catalog rejection, unavailable model filtering, and newly added catalog entries.

Validation:

- `pnpm --filter happy-server-self-host exec vitest run sources/app/api/routes/versionRoutes.test.ts`
- `pnpm --filter happy-app exec vitest run sources/components/modelModeOptions.test.ts sources/sync/apiCapabilities.test.ts`
- `pnpm --filter happy exec vitest run --project unit src/utils/modelCatalog.test.ts`

# Decisions

## 2026-05-30: First stabilization push scope

Decision: The first Happy bug-fix push will cover dependency install warnings, Codex permission/auth/reliability, process lifecycle classification, WebSocket/proxy/reconnect behavior, watcher regression protection, and Delano validation evidence.

Rationale: Upstream issue reads and local code inspection show repeated failures in these areas, and they map directly to Bart's dependency issues and the requested Codex/process/proxy/runtime topics.

Evidence: Research intake `research/upstream-repo-bug-triage/`.

## 2026-05-30: Dependency work is its own workstream

Decision: Dependency install warnings and security-sensitive package pins are tracked separately from runtime bug fixes.

Rationale: zod/SDK migration can have workspace-wide blast radius and should not block narrow Codex or lifecycle fixes.

Evidence: Upstream #1265 and #1224; local `packages/happy-cli/package.json` and `pnpm-lock.yaml`.

## 2026-05-30: Codex local subscription auth is the default planned path

Decision: Stabilization should preserve local Codex subscription auth as the normal CLI path and avoid requiring OpenAI token upload for ordinary local use.

Rationale: The user explicitly requested Codex subscription auth, and upstream #1201 documents corporate/self-hosted concerns around server-side OpenAI token storage.

Evidence: Upstream #1201; local `packages/happy-cli/src/api/api.ts` and `packages/happy-cli/src/codex/runCodex.ts`.

## 2026-05-30: Treat watcher path bug as regression/release protection

Decision: Do not plan a fresh implementation for non-ASCII/space path watcher normalization unless tests show local source regressed.

Rationale: Local `getProjectPath()` already uses the broad normalization described as fixed upstream. The remaining risk is release drift and missing regression coverage.

Evidence: Upstream #1163 and #667; local `packages/happy-cli/src/claude/utils/path.ts`.

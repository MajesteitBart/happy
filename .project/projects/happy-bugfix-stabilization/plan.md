---
name: Happy Bugfix Stabilization
status: active
lead: Clark
created: 2026-05-30T08:22:30Z
updated: 2026-05-30T15:13:48Z
linear_project_id:
risk_level: medium
spec_status_at_plan_time: planned
---

# Delivery Plan: Happy Bugfix Stabilization

## What Changed After Research

- Replaced placeholder project artifacts with a concrete stabilization plan.
- Created workstreams for dependency installs, Codex reliability, session/connectivity lifecycle, and Delano quality gates.
- Created eight ready tasks and two blocked follow-up tasks with upstream issue evidence and local file touchpoints.

## Technical Context

The repo is a pnpm 10 workspace containing `happy-cli`, `happy-agent`, `happy-app`, `happy-server`, and `happy-wire`. The first stabilization push crosses CLI, app-server integration, daemon Socket.IO behavior, local package manifests, and Delano runtime artifacts.

Important local evidence:

- `packages/happy-cli/package.json` pins `zod@3.25.76` and `@modelcontextprotocol/sdk@1.25.3`.
- `pnpm-lock.yaml` contains both zod v3 and v4 dependency islands.
- `packages/happy-cli/src/codex/executionPolicy.ts` maps Codex `yolo` to `on-failure`.
- `packages/happy-cli/src/api/api.ts` uses a 5 second vendor token registration timeout.
- `packages/happy-cli/src/api/apiMachine.ts` reconnects only when `shouldReconnect()` allows it.
- `packages/happy-cli/src/utils/lidState.ts` blocks reconnect when a Mac lid is closed without an external display.
- `packages/happy-cli/src/claude/utils/path.ts` already includes the broad path normalization fix described upstream.

## Architecture Decisions

- Keep dependency fixes separate from runtime lifecycle fixes.
- Use local Codex subscription auth as the default planned path for Codex CLI usage.
- Treat Codex app-server failures as reproduction-first work because external Codex behavior may have changed.
- Treat watcher path normalization as regression/release protection because local source already has the fix.
- Classify process lifecycle state before changing user-facing messaging.

## Policy and Contract Checks

- [x] `.project/projects/happy-bugfix-stabilization/` remains the execution source of truth.
- [x] Probe decision is explicit.
- [x] Evidence gates are defined before handoff.
- [x] External sync writes require dry-run or operator approval.
- [x] Artifacts use relative paths and issue references only.

## Generated Artifact Map

- `research/upstream-repo-bug-triage/task_plan.md`: investigation phases, evidence tasks, decisions, blockers.
- `research/upstream-repo-bug-triage/findings.md`: source references, observations, options, fold-forward candidates.
- `research/upstream-repo-bug-triage/progress.md`: chronological research and validation state.
- `workstreams/WS-A-dependency-install.md`: install/dependency stabilization.
- `workstreams/WS-B-codex-reliability.md`: Codex permission, auth, app-server reliability.
- `workstreams/WS-C-session-connectivity.md`: process lifecycle, proxy, WebSocket, reconnect, watcher reliability.
- `workstreams/WS-D-delano-quality.md`: validation, smoke evidence, and closeout quality.
- `tasks/T-001.md` through `tasks/T-010.md`: ready task backlog.

## Complexity Exceptions

- Codex app-server reproduction may need local Codex subscription auth and network access. Owner: Clark.
- Dependency upgrades may require a coordinated zod v4 migration across workspace packages. Owner: Clark.
- WebSocket/proxy behavior may need environment-specific smoke tests. Owner: Clark.

## Probe-Driven Architecture Changes

None. Research was sufficient to plan without a prototype probe.

## Workstream Design

- WS-A Dependency Install: reduce fresh install warnings/failures and security-sensitive dependency drift.
- WS-B Codex Reliability: fix narrow permission mapping first, then validate subscription-auth and app-server behavior.
- WS-C Session Connectivity: classify abort/crash states, improve reconnect/proxy diagnostics, and protect watcher path normalization.
- WS-D Delano Quality: keep Delano setup valid and capture a release-ready evidence trail.

## Milestone Strategy

- M1: Planning artifacts complete, `delano status` and `delano validate` results recorded.
- M2: Low-risk fixes complete: Codex yolo mapping, vendor timeout configuration, watcher regression tests.
- M3: Dependency strategy implemented or explicitly deferred with evidence.
- M4: Lifecycle/connectivity fixes complete with targeted tests.
- M5: Final validation and closeout evidence captured.

## Rollout Strategy

- Land small, independently testable fixes first.
- Keep dependency migrations in a dedicated branch/PR if zod v4 requires broad changes.
- Gate local-auth/enterprise behavior behind explicit configuration if behavior changes server token storage.
- Do not release or publish from this plan without a separate release step.

## Test Strategy

- Unit tests for Codex execution policy and watcher path normalization.
- API/client tests for vendor token registration timeout and configurable behavior.
- Daemon tests or focused unit tests for reconnect condition evaluation.
- Integration/smoke tests for Codex app-server turn flow where local Codex subscription auth is available.
- Delano validation with exact failure capture.

## Rollback Strategy

- Revert individual scoped fixes by task if a test or smoke check exposes regression.
- For dependency migration, preserve the previous lockfile state in Git history and keep migration commits isolated.
- For reconnect changes, prefer additive environment override and diagnostics before changing default behavior.

## Remaining Delivery Risks

- Current Codex CLI/app-server behavior may differ from upstream reports filed against older versions.
- zod v4 migration can affect schema validation across CLI, app, server, and wire packages.
- Delano validation currently fails on runtime/compatibility checks unrelated to the project plan artifacts: one sessions-skill path example, a missing `.claude` compatibility log-safety file, root `scripts/` path assumptions for sync/lease helper scripts, and a hard-coded sample project lookup.
- WebSocket/proxy bugs can be difficult to reproduce without matching network conditions.

---
name: Happy Safety and UX Stabilization
status: active
lead: Clark
created: 2026-05-30T09:49:30Z
updated: 2026-05-30T15:05:21Z
linear_project_id:
risk_level: high
spec_status_at_plan_time: planned
---

# Delivery Plan: Happy Safety and UX Stabilization

## What Changed After Review

The scaffold project has been replaced with a detailed plan based on the attached public source-review report. The scope focuses on high-priority issues that improve safety and user experience: session lifecycle, sync scalability, security/privacy trust, command rendering, and CI/release safety.

## Technical Context

Happy is a pnpm monorepo with app, CLI, agent, server, wire, log, and desktop packages. The riskiest behavior crosses package boundaries:

- app session store, message fetch/prefetch, rendering, and analytics;
- CLI daemon, launcher, local control server, local files, Claude/Codex bridges;
- server auth, v1/v3 message APIs, socket events, capabilities, and sync;
- shared wire contracts and Zod schemas;
- GitHub Actions and package scripts.

## Architecture Decisions

- Treat session handoff as a protocol with explicit lifecycle states rather than scattered event handlers.
- Treat socket events as hints and reconcile durable message state by sequence fetch.
- Security fixes get tests before broad refactors.
- Privacy documentation must match runtime behavior before promoting trust claims.
- Parser fixes should add message taxonomy and compact rendering instead of hiding individual strings one by one.

## Policy and Contract Checks

- [x] `.project` remains the execution source of truth.
- [x] Probe decision is explicit.
- [x] Evidence gates are defined before handoff.
- [x] External sync writes require dry-run or operator approval.
- [x] Public-repo content excludes private paths, secrets, raw prompts, and personal context.

## Generated Artifact Map

- `spec.md`: full safety/UX stabilization contract from attached review.
- `plan.md`: phased delivery plan and test/rollout strategy.
- `workstreams/`: five workstreams covering session lifecycle, sync/API compatibility, security/privacy, command rendering, and CI/release safety.
- `tasks/`: sixteen detailed implementation tasks with acceptance criteria and evidence gates.

## Complexity Exceptions

- Session lifecycle and sync work are multi-package and may require integration fixtures before production code changes. Owner: Clark.
- Auth nonce and daemon authorization are security-sensitive and should ship with regression tests in the same change. Owner: Clark.
- Privacy default changes may require maintainer/product choice. Owner: Bart/maintainers.

## Probe-Driven Architecture Changes

None yet. Tasks T-001, T-005, T-007, and T-011 include reproduction and fixture gates before larger code changes.

## Workstream Design

- WS-A Session Lifecycle and Handoff: explicit state machine, abort/recover semantics, local/remote handoff, tmux/daemon resilience.
- WS-B Sync Performance and API Compatibility: cancellable prefetch, sequence reconciliation, capabilities endpoint, self-host matrix.
- WS-C Security and Privacy Trust: auth nonce, daemon token, strict local permissions, analytics/privacy alignment, sensitive native permissions.
- WS-D Command Rendering and UX Integrity: tolerant command parser, message taxonomy, compact command/skill/compaction rendering, copy/recovery UX.
- WS-E CI and Release Safety: root scripts, package tests, integration/security jobs, compatibility/release smoke.

## Milestone Strategy

- M1: Planning complete, Delano validation clean, public-safety scan clean.
- M2: Low-risk trust fixes land first: privacy README/defaults, daemon auth tests, parser regression fixtures.
- M3: Session lifecycle diagnostics and abort classification land with tests.
- M4: Sync performance/capabilities land with app/server tests.
- M5: CI matrix and release smoke enforce the new contracts.

## Rollout Strategy

- Start with documentation/defaults and tests that expose failures.
- Land security-sensitive runtime changes behind explicit compatibility handling.
- Use capabilities negotiation before changing app/server message expectations.
- Keep user-facing error text specific and recovery-oriented.

## Test Strategy

- Unit tests for parser taxonomy, daemon auth middleware, strict permissions, and auth nonce consumption.
- App tests for command/compaction rendering and long-session prefetch cancellation.
- Server route tests for capabilities, auth nonce, message idempotency, and replay rejection.
- CLI/daemon integration tests for spawn/list/stop authorization and session recovery.
- CI workflows for package-wide typecheck/test/build plus self-host smoke.

## Rollback Strategy

- Parser and privacy-doc changes are low-risk and revert independently.
- Security hardening should preserve migration paths for existing local daemon/session state.
- Capabilities checks should fail closed with clear messages but retain old server behavior until compatibility floor is approved.
- Session lifecycle changes should be staged behind tests and feature-sized commits.

## Remaining Delivery Risks

- Some user reports may be fixed on `main` but not released; tasks must verify current source before changing code.
- Multi-package integration tests may need new fixtures or local harnesses.
- Privacy/analytics defaults may require product sign-off.
- Self-host compatibility work can grow if older app/server pairs need long support windows.

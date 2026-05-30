---
name: Happy Bugfix Stabilization
slug: happy-bugfix-stabilization
owner: Bart
status: planned
created: 2026-05-30T08:22:30Z
updated: 2026-05-30T08:35:32Z
outcome: Fresh installs and remote agent sessions are materially more reliable across dependency install, Codex, lifecycle, WebSocket, proxy, and daemon reconnect paths.
uncertainty: medium
probe_required: false
probe_status: skipped
---

# Spec: Happy Bugfix Stabilization

## Executive Summary

Deliver the first broad Happy bug-fix push for install and remote-control reliability. The push prioritizes Bart's dependency install issues, Codex subscription-auth and permission behavior, process-exit loops, session unresponsiveness, WebSocket/proxy failures, and repo-local Delano validation/runtime risks found during setup.

## Problem and Users

Happy users rely on the CLI, daemon, app, and server to keep coding sessions reachable from desktop and mobile. Open upstream issues show several reliability breaks:

- Fresh installs can emit dependency warnings or fail on specific platforms.
- Codex yolo mode can still prompt because Happy maps it to `on-failure`.
- Codex sessions can hang, fail to return content, or hit responses WebSocket errors.
- Abort and mobile-message flows can surface as `Process exited unexpectedly` loops.
- Daemon reconnect can stall after WebSocket disconnects in headless Mac workflows.
- Proxy environments can break startup.
- Published builds may lag behind fixed main-branch watcher behavior.

Primary users are Bart, maintainers preparing a stabilization release, and Happy users running Claude/Codex sessions from mobile, web, or daemon-managed desktops.

## Outcome and Success Metrics

- `pnpm install` and package manifest checks have a documented dependency strategy for zod, Claude Agent SDK, MCP SDK, native postinstall behavior, and known platform limitations.
- Codex yolo, safe-yolo, and bypass permission modes map to expected approval/sandbox behavior with unit coverage.
- Codex subscription-auth/local-auth use is documented and does not require uploading OpenAI tokens for normal local CLI operation.
- Abort and process-exit states are visibly distinguished in user-facing session events and tests.
- Daemon reconnect behavior does not get stuck silently after recoverable WebSocket disconnects.
- Proxy and WebSocket failures produce actionable diagnostics and covered behavior.
- `delano status` and `delano validate` are run; any validation failure is classified as project work, Delano runtime issue, or environment constraint.

## User Stories

- US-001: As Bart, I want dependency install warnings triaged and planned, so fresh setup is not noisy or fragile.
- US-002: As a Codex user, I want yolo to bypass approvals as advertised, so permission mode labels match runtime behavior.
- US-003: As a Codex subscription user, I want Happy to use local Codex auth, so I do not have to upload OpenAI tokens for normal local use.
- US-004: As a mobile user, I want aborts and crashes to be classified accurately, so I can recover from a session without entering a repeated failure loop.
- US-005: As a daemon user, I want WebSocket reconnect and proxy behavior to be robust, so sessions remain visible across network and headless workflows.
- US-006: As a maintainer, I want Delano artifacts and validation state to be factual, so the stabilization work can be handed off safely.

## Acceptance Scenarios

- AC-001: Given the current dependency manifests, when dependency stabilization is complete, then install warnings and security-sensitive pins have an explicit fix or documented deferral.
- AC-002: Given Codex `yolo`, when Happy resolves the execution policy, then approval policy is `never` and sandbox is `danger-full-access`.
- AC-003: Given Codex `safe-yolo`, when Happy resolves the execution policy, then approval policy remains `on-failure` and sandbox remains `workspace-write`.
- AC-004: Given a user aborts a running session, when the launcher reports completion, then the app sees a canceled/aborted state rather than an unexplained process failure.
- AC-005: Given a daemon WebSocket disconnects while the machine is otherwise reachable, when reconnect conditions are met or explicitly overridden, then the daemon attempts reconnect and logs the evaluated reason.
- AC-006: Given Delano runtime artifacts were changed, when validation runs, then exact failures are captured and classified.

## Scope

### In Scope

- Dependency strategy and fixes for install warnings and security-sensitive package pins.
- Codex execution policy, app-server reliability triage, and local subscription-auth flow.
- Process lifecycle classification for abort, launcher crash, SIGTERM, and unexpected exit.
- Proxy, WebSocket, and daemon reconnect diagnostics and behavior.
- Watcher path regression coverage where local source already carries the upstream fix.
- Delano workstreams, tasks, validation, and progress evidence.

### Out of Scope

- Feature requests unrelated to stabilization, such as new models, image uploads, and new provider support.
- Closing or commenting on GitHub issues without separate maintainer approval.
- Releasing packages to npm or app stores in this plan pass.
- Storing OpenAI, Anthropic, GitHub, server, or app credentials in project artifacts.

## Functional Requirements

- FR-001: Define and execute a dependency stabilization task that covers `zod`, `@anthropic-ai/claude-agent-sdk`, `@modelcontextprotocol/sdk`, postinstall scripts, and known platform install failures.
- FR-002: Correct Codex permission mapping for `yolo`, `safe-yolo`, and `bypassPermissions`, with unit tests.
- FR-003: Preserve local Codex subscription auth as the default planned path; token-upload behavior must be explicitly documented or gated.
- FR-004: Add diagnostics and/or tests for Codex app-server hangs, empty replies, WebSocket TLS failures, and QR/waiting-state hangs.
- FR-005: Classify abort versus process crash in Claude and Codex launcher flows.
- FR-006: Improve daemon reconnect behavior or diagnostics for lid/headless and transient WebSocket disconnect conditions.
- FR-007: Add proxy behavior checks so local MCP endpoints are not sent through external proxies and remote server calls report clear failures.
- FR-008: Protect session watcher path normalization with tests and release verification.
- FR-009: Keep all Delano artifacts relative-path only and free of secrets, raw prompts, and private absolute paths.

## Non-Functional Requirements

- Keep changes scoped and testable by workstream.
- Prefer small unit tests for mapping and path behavior; add integration or smoke tests only where lifecycle/connections require it.
- Preserve existing app/CLI/server public contracts unless a task explicitly calls out a coordinated release.
- Record validation failures exactly and classify root cause.

## Assumptions

- The current repo-local `main` source is more recent than some npm-published reports, so some upstream bugs may be release verification tasks rather than code changes.
- Codex app-server behavior must be reproduced against the current supported Codex CLI before changing protocol code.
- Delano validation may report pre-existing setup/runtime issues beyond the project artifacts changed in this pass.

## Needs Clarification

- Should zod v4 migration happen immediately, or should Happy constrain the Claude Agent SDK version until zod v4 migration is scheduled?
- Should daemon reconnect ignore Mac lid state by default, or only with an explicit opt-in environment variable?
- What Codex CLI version is the minimum support baseline for app-server and local subscription-auth flows?

## Hypotheses and Unknowns

- H-001: The dependency warning can be eliminated with either a coordinated zod v4 migration or a narrower SDK pin; migration blast radius is the main uncertainty.
- H-002: The Codex yolo fix is low-risk because it is isolated to `executionPolicy.ts` and tests.
- H-003: Some Codex app-server failures are external CLI/server behavior and need repro evidence before code changes.
- H-004: Process-exit loops are partly a state-classification problem: user aborts and launcher crashes currently look too similar to the mobile app.

## Touchpoints to Exercise

- `packages/happy-cli/src/codex/executionPolicy.ts`
- `packages/happy-cli/src/codex/runCodex.ts`
- `packages/happy-cli/src/codex/codexAppServerClient.ts`
- `packages/happy-cli/src/api/api.ts`
- `packages/happy-cli/src/api/apiMachine.ts`
- `packages/happy-cli/src/utils/lidState.ts`
- `packages/happy-cli/src/claude/claudeRemoteLauncher.ts`
- `packages/happy-cli/src/claude/claudeLocalLauncher.ts`
- `packages/happy-cli/src/claude/utils/proxyBypass.ts`
- `packages/happy-cli/src/claude/utils/path.ts`
- `.agents/scripts/pm/validate.sh`

## Probe Findings

- Probe skipped. Research was sufficient to create the first plan and tasks.

## Footguns Discovered

- `gh auth status` reports an invalid stored token, but approved `gh issue view` commands succeeded for public issue reads.
- Validation scans project and agent docs for private absolute paths; artifacts must avoid copying upstream examples that include private paths.
- The Delano validation script runs many runtime checks beyond schema/frontmatter validation.

## Remaining Unknowns

- Exact current Codex app-server repro status for #837, #957, and #1261.
- Exact package/version combination Bart wants treated as the dependency baseline.
- Whether reconnect lid gating is intentional product policy or legacy defensive behavior.

## Dependencies

- Access to current local package manager state.
- Local Codex CLI subscription auth for reproduction.
- GitHub public issue access for upstream evidence.
- Delano runtime commands: `delano status`, `delano validate`.

## Approval Notes

- Research has been folded into planned workstreams and ready tasks. Implementation can begin from T-001 or T-003 depending on whether dependency or Codex correctness is the first desired fix.

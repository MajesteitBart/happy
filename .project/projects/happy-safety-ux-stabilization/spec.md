---
name: Happy Safety and UX Stabilization
slug: happy-safety-ux-stabilization
owner: Bart
status: active
created: 2026-05-30T09:49:30Z
updated: 2026-05-30T15:05:21Z
outcome: High-priority session reliability, sync correctness, security/privacy trust, and command-rendering UX risks are converted into detailed implementation workstreams with testable acceptance criteria.
uncertainty: high
probe_required: false
probe_status: skipped
---

# Spec: Happy Safety and UX Stabilization

## Executive Summary

This project turns the external safety and user-experience review into an implementation backlog for the public `slopus/happy` codebase. The priority is not cosmetic UI polish. The priority is to make remote coding sessions trustworthy: local and remote control should hand off predictably, long histories should remain usable, daemon and auth surfaces should have defensible security boundaries, privacy claims should match actual analytics behavior, and internal command/skill content should not leak into normal chat UI.

## Problem and Users

Happy coordinates a mobile/web app, CLI daemon, self-host server, wire contracts, and Claude/Codex runners. Users rely on it when they are away from the desktop and need remote control to keep working. The reviewed risks cluster around:

- session lifecycle divergence when switching between desktop, daemon, mobile, and server;
- slow or unstable long-session sync caused by repeated background pagination and store commits;
- replayable auth challenges, unauthenticated local daemon endpoints, and loose local secret-file permissions;
- README privacy claims that can diverge from analytics behavior;
- command, skill, and compaction messages rendering internal implementation content as normal chat.

The primary users are remote Happy users, self-host operators, maintainers triaging public issues, and contributors working on the app/server/CLI boundary.

## Outcome and Success Metrics

- Session lifecycle has explicit states and transition ownership for local-active, remote-active, aborting, recovering, completed, error, and archived flows.
- Handoff tests cover desktop-to-mobile, mobile-to-desktop, mobile abort, remote creation, and detached daemon/tmux-style session behavior where feasible.
- Long sessions reach first interactive state quickly and background prefetch can be cancelled when the session is no longer visible.
- Auth challenge replay is rejected by tests, daemon control endpoints reject unauthenticated requests, and local credential/session files are written with strict permissions.
- README/privacy docs accurately describe analytics behavior and self-host defaults.
- Command, skill, and compaction messages render as safe system or command events instead of raw internal instruction bodies.
- CI has package-wide checks for the new parser, security, sync, and daemon contracts.

## User Stories

- US-001: As a remote Happy user, I want session control handoff to preserve history and process state, so that mobile and desktop do not diverge.
- US-002: As a mobile user, I want aborts and crashes to show accurate recovery states, so that I can continue without repeated unexplained failures.
- US-003: As a user with long coding sessions, I want history loading to stay responsive, so that opening a large session does not block interaction.
- US-004: As a self-host operator, I want app/server/CLI compatibility to fail clearly, so that mixed versions do not silently break message sending.
- US-005: As a security-conscious user, I want auth, daemon control, and local secret storage to resist obvious replay or localhost attacks.
- US-006: As an open-source user, I want README privacy claims to match the actual app behavior, so that I can make an informed trust decision.
- US-007: As a chat user, I want commands, skills, and compaction events rendered compactly, so that internal implementation text does not pollute the conversation.
- US-008: As a maintainer, I want CI to cover the contracts above, so that releases do not depend on manual memory.

## Acceptance Scenarios

- AC-001: Given a desktop-started session, when mobile opens and sends a message, then message history remains visible and the desktop runner receives a consistent context or a clear recovery state.
- AC-002: Given a long-running turn is aborted from mobile, when the next turn starts, then the app does not enter a repeated `Process exited unexpectedly` loop.
- AC-003: Given a session with at least 1000 messages, when it is opened, then first interaction is available before background pagination completes.
- AC-004: Given an old or incompatible self-host server, when the app tries to send a message, then it receives a structured capability/version error rather than an unexplained 404 or send failure.
- AC-005: Given a captured auth tuple, when it is replayed, then the server rejects it after the nonce is consumed or expired.
- AC-006: Given a local daemon control endpoint request without the daemon token, when it reaches `/list`, `/spawn-session`, `/stop-session`, or `/stop`, then the request is rejected.
- AC-007: Given `/compact` or a skill invocation produces wrapper content, when the app renders the message, then the UI shows a compact event/chip and never raw skill instructions.
- AC-008: Given the repo changes any of these paths, when CI runs, then package-level tests and relevant integration/security tests execute.

## Scope

### In Scope

- Session lifecycle model, handoff state, abort/recover semantics, and diagnostic metadata.
- Message sync cancellation, batching, pagination, first-interactive metrics, and server capability/version contracts.
- Auth nonce replay protection, daemon control authorization, local file permissions, and privacy docs/defaults.
- Command/skill/compaction message parsing, taxonomy, and rendering tests.
- Root scripts and CI jobs needed to enforce these contracts.
- Delano planning artifacts and task breakdown for phased implementation.

### Out of Scope

- New provider/model feature requests unless needed to validate compatibility contracts.
- Publishing npm/app releases.
- Commenting on or closing public GitHub issues without explicit maintainer approval.
- Storing credentials, raw logs, raw prompts, message content, or private local paths in project artifacts.

## Functional Requirements

- FR-001: Define a session lifecycle state machine with allowed transitions and owner/input/process expectations.
- FR-002: Add lifecycle event recording that is safe to persist and useful for recovery diagnostics.
- FR-003: Make abort, crash, disconnect, reconnect, and handoff flows distinguishable in app/CLI/server events.
- FR-004: Add deterministic reconciliation for message gaps using sequence fetch instead of relying only on socket events.
- FR-005: Make background message prefetch cancellable and visible-session-aware.
- FR-006: Add a server capabilities/version endpoint and client gating for required message APIs.
- FR-007: Replace client-generated auth challenge replay risk with server-issued, time-limited, single-use nonces.
- FR-008: Require a daemon control token for local daemon endpoints and store daemon state with strict permissions.
- FR-009: Ensure Happy home credentials, session cache, lock/state files, and key material are created with strict directory/file modes.
- FR-010: Align README/privacy text and app/self-host analytics defaults.
- FR-011: Replace ad hoc command wrapper parsing with a tolerant parser and message taxonomy.
- FR-012: Add package-wide root scripts and CI jobs for unit, integration, security, parser, daemon, and self-host compatibility checks.

## Non-Functional Requirements

- Preserve E2EE content boundaries; diagnostics must not include message content or secrets.
- Prefer explicit structured errors over silent fallback behavior.
- Keep compatibility failures actionable for self-host users.
- Keep implementation slices independently reviewable and testable.
- Use deterministic tests and fixtures before broad refactors.

## Assumptions

- The external review is source-review based; some root causes need reproduction before code changes.
- Existing public issues indicate real user pain, but individual reports may reflect older published versions.
- Some fixes require coordinated app/server/CLI changes and should be staged behind capability checks.

## Needs Clarification

- Which self-host server versions should remain supported after capabilities negotiation lands?
- Should analytics be disabled by default for all OSS builds or only self-host builds?
- Should daemon control move to Unix domain sockets/named pipes after token authorization, or is tokenized localhost sufficient for the first hardening pass?

## Hypotheses and Unknowns

- H-001: Most handoff failures come from implicit state transitions rather than one isolated event handler.
- H-002: Long-session slowness is caused by repeated decrypt/apply/store/render work during fire-and-forget background prefetch.
- H-003: Auth and daemon security can be meaningfully improved without changing the E2EE content model.
- H-004: Parser leaks can be fixed with a small taxonomy/parser layer without redesigning the message store.

## Touchpoints to Exercise

- `packages/happy-app/src/store/*`
- `packages/happy-app/src/hooks/*`
- `packages/happy-app/src/api/*`
- `packages/happy-app/src/components/*Message*`
- `packages/happy-cli/src/api/*`
- `packages/happy-cli/src/daemon/*`
- `packages/happy-cli/src/claude/*`
- `packages/happy-cli/src/codex/*`
- `packages/happy-server/sources/app/api/*`
- `packages/happy-server/sources/app/v3/*`
- `packages/happy-wire/src/*`
- `README.md`
- `.github/workflows/*`

## Probe Findings

Probe skipped for planning. The attached review is based on public source review and open issue signals, and each implementation task includes a reproduction or verification gate before code changes where root cause is uncertain.

## Footguns Discovered

- Session behavior crosses app, CLI, daemon, server, and runner boundaries; single-package fixes can create false confidence.
- Socket events should be treated as hints; durable sync must reconcile by sequence and idempotent local IDs.
- README privacy claims are user trust surfaces, not marketing copy.
- Localhost daemon endpoints are still attack surfaces.
- Raw internal command wrappers can leak prompt or skill implementation detail into normal user-visible chat.

## Remaining Unknowns

- Exact current repro state for reported handoff, tmux, and remote-session sync failures.
- Exact analytics defaults per build target and deployment path.
- Full compatibility matrix expected by current self-host users.

## Dependencies

- Access to package-level test runners and fixture data.
- Public GitHub issue context for reproduction details.
- Local app/server/CLI integration harness or focused substitutes.
- Maintainer decision on analytics defaults and self-host support floor.

## Approval Notes

This plan is safe for a public fork. It intentionally avoids private environment details, credentials, raw logs, and non-public context.

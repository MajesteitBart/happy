---
id: WS-A
name: Session Lifecycle and Handoff
owner: Clark
status: done
created: 2026-05-30T13:39:41Z
updated: 2026-05-31T07:34:22Z
operating_mode: feature
---

# Workstream: Session Lifecycle and Handoff

## Objective

Make local/remote session ownership, aborts, recovery, and handoff explicit and testable across desktop, daemon, mobile, server, Claude, and Codex.

## Owned Files/Areas

- `packages/happy-app/sources/sync`
- `packages/happy-app/sources/-session`
- `packages/happy-cli/src/api`
- `packages/happy-cli/src/daemon`
- `packages/happy-cli/src/claude`
- `packages/happy-cli/src/codex`
- `packages/happy-server/sources/app/api`

## Dependencies

- Reproduction notes from open issues.
- App/server/CLI integration fixtures.
- Non-sensitive lifecycle event schema.

## Risks

- State-machine work can sprawl if implementation starts before current transition points are mapped.
- Handoff fixes can accidentally preserve processes that should be cancelled.

## Handoff Criteria

- Lifecycle state machine documented in code or docs.
- Abort/recover/handoff tests cover the main user reports.
- User-visible errors distinguish abort, crash, disconnect, and recovery.

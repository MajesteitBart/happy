---
id: WS-C
name: Security and Privacy Trust
owner: Clark
status: planned
created: 2026-05-30T13:39:41Z
updated: 2026-05-30T13:39:41Z
operating_mode: scoped-change
---

# Workstream: Security and Privacy Trust

## Objective

Close obvious trust gaps: replayable auth challenges, unauthenticated daemon control, loose local secret file modes, analytics/privacy mismatch, and unused sensitive permissions.

## Owned Files/Areas

- `packages/happy-server/sources/app/api`
- `packages/happy-cli/src/daemon`
- `packages/happy-cli/src`
- `packages/happy-app`
- `README.md`
- docs and app privacy/settings surfaces

## Dependencies

- Maintainer choice on analytics defaults.
- Cross-platform permission behavior for local file modes.

## Risks

- Security changes can break existing daemon state if migration is not handled.
- Privacy claim changes can expose product decisions that need maintainer sign-off.

## Handoff Criteria

- Replay, unauthenticated daemon control, and file-permission behavior have tests.
- README/privacy claims match runtime behavior.
- Sensitive native permissions are removed or justified by concrete features.

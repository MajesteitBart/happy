---
id: WS-B
name: Sync Performance and API Compatibility
owner: Clark
status: active
created: 2026-05-30T13:39:41Z
updated: 2026-05-30T20:18:59Z
operating_mode: feature
---

# Workstream: Sync Performance and API Compatibility

## Objective

Make message sync deterministic, cancellable, scalable for long sessions, and explicit about app/server/CLI compatibility.

## Owned Files/Areas

- `packages/happy-app/src/store`
- `packages/happy-app/src/hooks`
- `packages/happy-app/src/api`
- `packages/happy-server/sources/app/api`
- `packages/happy-server/sources/app/v3`
- `packages/happy-wire/src`

## Dependencies

- Long-session fixture or generated 1000+ message fixture.
- Capability/version contract agreement.

## Risks

- Performance fixes without instrumentation can hide regressions.
- Compatibility checks can block self-host users if migration messaging is weak.

## Handoff Criteria

- Background prefetch cancellation is covered by tests.
- Sequence reconciliation contract is documented and tested.
- Capability endpoint exists with app-side structured failure behavior.

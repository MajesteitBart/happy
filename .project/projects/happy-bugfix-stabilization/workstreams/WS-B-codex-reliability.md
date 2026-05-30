---
id: WS-B
name: Codex Reliability
status: active
owner: Clark
created: 2026-05-30T08:35:32Z
updated: 2026-05-30T18:01:13Z
operating_mode: scoped-change
---

# Workstream: Codex Reliability

## Intent

Make Codex behavior match user expectations for permission modes, local subscription auth, token registration, and app-server turn reliability.

## Scope

- Codex `yolo`, `safe-yolo`, and `bypassPermissions` execution policy.
- Local Codex subscription-auth behavior.
- Vendor token registration timeout behavior.
- Codex app-server hangs, empty replies, and WebSocket failures.

## Evidence

- Upstream #1330, #983, #1201, #837, #957, #1261.
- `packages/happy-cli/src/codex/executionPolicy.ts`.
- `packages/happy-cli/src/codex/runCodex.ts`.
- `packages/happy-cli/src/codex/codexAppServerClient.ts`.
- `packages/happy-cli/src/api/api.ts`.

## Exit Criteria

- Low-risk permission mapping fix lands with tests.
- Codex local-auth path is documented or guarded.
- Current app-server failure modes have repro evidence or an explicit no-repro note.

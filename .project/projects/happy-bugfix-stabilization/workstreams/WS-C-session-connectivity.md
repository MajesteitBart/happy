---
id: WS-C
name: Session Lifecycle and Connectivity
status: active
owner: Clark
created: 2026-05-30T08:35:32Z
updated: 2026-05-30T17:49:23Z
operating_mode: feature
---

# Workstream: Session Lifecycle and Connectivity

## Intent

Reduce repeated session failure loops by distinguishing aborts from crashes, improving daemon reconnect diagnostics, and protecting proxy/WebSocket/watcher behavior.

## Scope

- `Process exited unexpectedly` and SIGTERM classification.
- Mobile-message delivery receipts and launcher state diagnostics.
- Daemon reconnect after WebSocket disconnects.
- Proxy environment handling.
- Watcher path normalization regression coverage.

## Evidence

- Upstream #1343, #982, #1229, #451, #761, #1163, #667.
- `packages/happy-cli/src/claude/claudeRemoteLauncher.ts`.
- `packages/happy-cli/src/claude/claudeLocalLauncher.ts`.
- `packages/happy-cli/src/api/apiMachine.ts`.
- `packages/happy-cli/src/utils/lidState.ts`.
- `packages/happy-cli/src/claude/utils/proxyBypass.ts`.
- `packages/happy-cli/src/claude/utils/path.ts`.

## Exit Criteria

- User aborts do not show as unexplained process crashes.
- Daemon reconnect logs include the reason reconnect is blocked or attempted.
- Proxy and watcher behavior have focused regression coverage.

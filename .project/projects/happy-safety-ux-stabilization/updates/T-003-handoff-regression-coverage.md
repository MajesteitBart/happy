# T-003 Handoff Regression Coverage

## Automated coverage added

- Desktop/mobile message reconciliation: `packages/happy-cli/src/api/apiSession.test.ts` now covers a seq-gap catch-up where a mobile-sent user message is fetched from the server and routed back into the desktop session callback before the cursor advances.
- Handoff diagnostics: the same test asserts `recovering` and `recovered` lifecycle events with `reason: "seq-gap"` so future regressions do not fall back to string parsing.
- Remote-created daemon visibility: `packages/happy-cli/src/daemon/controlServer.test.ts` now covers `/list` returning a registered remote-created session to the local daemon client.
- Local/remote switch state: `packages/happy-cli/src/api/apiSession.test.ts` covers switch events carrying a structured `mode-changed` lifecycle event.

## Documented gaps

- Detached tmux multi-session behavior still needs a process-level integration harness. The unit boundary can verify daemon list visibility, but it cannot prove multiple detached tmux children keep streaming independently.
- Active shell or monitor subprocess behavior is not fully deterministic in the current unit harness. Until a fake long-running provider process exists, the expected contract is the one in `docs/session-lifecycle.md`: preserve subprocesses during handoff when possible; otherwise emit an explicit lifecycle cancellation/error state.

## Manual smoke path for the remaining gaps

1. Start the daemon.
2. Spawn two sessions from separate directories, one normal and one tmux-backed or detached.
3. Send from desktop, open from mobile/web, then send a follow-up remotely.
4. Confirm the desktop runner receives the remote message through seq catch-up.
5. Switch control back to local and confirm the UI receives `mode-changed` lifecycle events.
6. Start a long-running shell command, switch control, and confirm the command either remains attached or is visibly marked cancelled/error via lifecycle state.

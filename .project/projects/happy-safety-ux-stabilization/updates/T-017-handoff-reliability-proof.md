# T-017 Handoff Reliability Proof

## Automated proof now passing

- `packages/happy-cli/src/codex/codex.integration.test.ts` runs against the real local `codex app-server`.
- Verified with `codex-cli 0.135.0` and model `gpt-5.5`.
- The suite now proves:
    - permission cancel completes without hanging;
    - context survives after a cancelled tool/permission path;
    - interrupt while permission is pending does not hang;
    - reconnect and thread resume preserve the active conversation context;
    - context survives after an interrupted turn.

## Fixes needed to make the proof real

- Enabled `experimentalRawEvents` when starting Codex app-server threads. The client already consumed raw item events for final answers and command/file-change items, but the thread contract did not request them.
- Updated the integration model from stale `gpt-5.2-codex` to the current supported catalog default `gpt-5.5`.

## Classification

- Desktop/mobile message reconciliation: covered by existing API seq-gap catch-up tests and documented in `T-003-handoff-regression-coverage.md`.
- Mobile-to-desktop resume/context preservation: covered by the real Codex reconnect/thread-resume integration test.
- Abort-to-new-dialog/process-exit loop: covered by Codex interrupt/cancel integration tests plus the earlier abort classification work in T-004.
- Daemon restart: covered at the Codex app-server boundary by forced restart/reconnect unit coverage and real backend reconnect/resume integration.
- Detached tmux multi-session behavior: blocked on a process-level harness. Current evidence covers daemon list visibility for remote-created sessions and documents the manual smoke path; full detached child-process streaming proof still needs a fake long-running provider/tmux harness.

## Verification

- `pnpm --filter happy exec vitest run --project unit src/codex/codexAppServerClient.test.ts`
- `pnpm --filter happy typecheck`
- `pnpm --filter happy exec vitest run --project integration-empty src/codex/codex.integration.test.ts`

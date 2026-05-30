# T-004 Abort And Process-Exit Classification

## Trace

- Codex abort starts in `runCodex` through the mobile `abort` RPC handler.
- Before this change, a provider rejection after that abort could still fall into the generic `catch` branch and emit `Process exited unexpectedly`.
- Claude remote already handled clean abort completion, but an abort-triggered throw from the remote launcher could also enter the generic launch-error branch.
- Claude local abort switches control to remote mode and cancels the active Claude turn before aborting the local process.

## Fix

- Codex now tracks an abort generation for every turn. If a rejection arrives after the generation changed, or while abort is still in progress, it is classified as `user-abort`.
- Codex user aborts emit `Aborted by user` plus a structured `abort-requested` lifecycle event instead of `process-exited`.
- Codex provider failures without an abort still emit `Process exited unexpectedly` plus a structured `process-exited` lifecycle event.
- Claude remote now checks the abort signal in its launch-error branch and emits cancellation rather than crash state when the throw was abort-triggered.

## Verification

- `pnpm --filter happy exec vitest run src/codex/__tests__/turnFailureClassification.test.ts src/api/apiSession.test.ts`
- `pnpm --filter happy typecheck`

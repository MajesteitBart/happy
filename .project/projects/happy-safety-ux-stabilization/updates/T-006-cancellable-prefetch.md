# T-006 Cancellable Background Prefetch

## Changes

- Added session visibility tracking in app sync.
- Added `sync.onSessionHidden(sessionId)` and wired it to session view cleanup.
- Added `sync.onSessionScrollActivity(sessionId)` and wired it to chat scroll events.
- Replaced the fixed 250 ms background prefetch loop with policy-based delay:
  - 750 ms when visible and idle;
  - 1500 ms after recent scroll interaction;
  - 2000 ms when the app is backgrounded.
- Added per-session `AbortController` cancellation for background older-message prefetch.
- Batched background older-message pages in groups of two where safe, so background prefetch can reduce store commits compared with one page per short tick.

## Safety Notes

- Foreground user-triggered `loadOlderMessages` still loads one page and shows the existing loading state.
- Background prefetch stops when the session is hidden, cancellation fires, encryption is unavailable, pagination ends, or the oldest seq reaches the beginning.
- Socket/live updates still reconcile through the existing sequence-backed message paths.

## Tests

- `pnpm --filter happy-app exec vitest run sources/sync/syncPrefetchPolicy.test.ts sources/sync/syncLoadMetrics.test.ts`
- `pnpm --filter happy-app typecheck`

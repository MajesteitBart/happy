# T-005 Long-Session Load Metrics

## Paths Located

- Initial session load: `packages/happy-app/sources/sync/sync.ts` `fetchMessages` -> `fetchInitialLatestPage`.
- Forward catch-up: `packages/happy-app/sources/sync/sync.ts` `fetchMessages` -> `fetchForwardSince`.
- Background prefetch loop: `packages/happy-app/sources/sync/sync.ts` `prefetchOlderMessagesInBackground`.
- Older page load: `packages/happy-app/sources/sync/sync.ts` `loadOlderMessages`.
- Decrypt and normalization: `packages/happy-app/sources/sync/sync.ts` `applyFetchedMessages`.
- Zustand store apply proxy: `packages/happy-app/sources/sync/sync.ts` `applyMessages`.

## Instrumentation

Added `packages/happy-app/sources/sync/syncLoadMetrics.ts` with in-memory, app-local counters:

- first interactive duration after initial latest page is applied;
- v3 fetch page count and fetched message count;
- decrypt batch count and decrypted/normalized message counts;
- store apply count, input message count, changed message count;
- fetch/decrypt/store-apply duration totals;
- background prefetch page count.

No message text, command body, tool output, prompt content, or encrypted payload is recorded.

## Baseline Fixture

Added `packages/happy-app/sources/sync/syncLoadMetrics.test.ts`, a synthetic 1000-message baseline test. It verifies:

- a 1000-message page produces one fetch page;
- first interactive time is marked;
- one store apply commit is counted;
- normalized and changed message counts are explicit;
- serialized metrics do not retain individual fixture message IDs.

This gives a reproducible local baseline before changing prefetch behavior in T-006.

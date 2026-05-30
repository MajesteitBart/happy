export type SyncLoadOperation = 'initial' | 'forward' | 'older';

export type SyncLoadMetricsSnapshot = {
    sessionId: string;
    startedAt: number;
    firstInteractiveMs: number | null;
    fetchPageCount: number;
    fetchedMessageCount: number;
    decryptBatchCount: number;
    decryptedMessageCount: number;
    normalizedMessageCount: number;
    storeCommitCount: number;
    storeInputMessageCount: number;
    storeChangedMessageCount: number;
    backgroundPrefetchPageCount: number;
    totalFetchMs: number;
    totalDecryptMs: number;
    totalStoreApplyMs: number;
    lastOperation: SyncLoadOperation | null;
};

export const syncLoadNowMs = () => globalThis.performance?.now?.() ?? Date.now();

const createSnapshot = (sessionId: string): SyncLoadMetricsSnapshot => ({
    sessionId,
    startedAt: syncLoadNowMs(),
    firstInteractiveMs: null,
    fetchPageCount: 0,
    fetchedMessageCount: 0,
    decryptBatchCount: 0,
    decryptedMessageCount: 0,
    normalizedMessageCount: 0,
    storeCommitCount: 0,
    storeInputMessageCount: 0,
    storeChangedMessageCount: 0,
    backgroundPrefetchPageCount: 0,
    totalFetchMs: 0,
    totalDecryptMs: 0,
    totalStoreApplyMs: 0,
    lastOperation: null,
});

export class SyncLoadMetrics {
    private snapshots = new Map<string, SyncLoadMetricsSnapshot>();

    start(sessionId: string) {
        this.snapshots.set(sessionId, createSnapshot(sessionId));
    }

    markFirstInteractive(sessionId: string) {
        const snapshot = this.snapshots.get(sessionId);
        if (!snapshot || snapshot.firstInteractiveMs !== null) return;
        snapshot.firstInteractiveMs = syncLoadNowMs() - snapshot.startedAt;
    }

    recordFetchPage(sessionId: string, operation: SyncLoadOperation, durationMs: number, messageCount: number) {
        const snapshot = this.ensure(sessionId);
        snapshot.fetchPageCount += 1;
        snapshot.fetchedMessageCount += messageCount;
        snapshot.totalFetchMs += durationMs;
        snapshot.lastOperation = operation;
    }

    recordDecryptBatch(
        sessionId: string,
        durationMs: number,
        decryptedMessageCount: number,
        normalizedMessageCount: number
    ) {
        const snapshot = this.ensure(sessionId);
        snapshot.decryptBatchCount += 1;
        snapshot.decryptedMessageCount += decryptedMessageCount;
        snapshot.normalizedMessageCount += normalizedMessageCount;
        snapshot.totalDecryptMs += durationMs;
    }

    recordStoreApply(sessionId: string, durationMs: number, inputMessageCount: number, changedMessageCount: number) {
        const snapshot = this.ensure(sessionId);
        snapshot.storeCommitCount += 1;
        snapshot.storeInputMessageCount += inputMessageCount;
        snapshot.storeChangedMessageCount += changedMessageCount;
        snapshot.totalStoreApplyMs += durationMs;
    }

    recordBackgroundPrefetchPage(sessionId: string) {
        const snapshot = this.ensure(sessionId);
        snapshot.backgroundPrefetchPageCount += 1;
    }

    getSnapshot(sessionId: string) {
        const snapshot = this.snapshots.get(sessionId);
        return snapshot ? { ...snapshot } : null;
    }

    reset(sessionId?: string) {
        if (sessionId) {
            this.snapshots.delete(sessionId);
            return;
        }
        this.snapshots.clear();
    }

    private ensure(sessionId: string) {
        let snapshot = this.snapshots.get(sessionId);
        if (!snapshot) {
            snapshot = createSnapshot(sessionId);
            this.snapshots.set(sessionId, snapshot);
        }
        return snapshot;
    }
}

export const syncLoadMetrics = new SyncLoadMetrics();

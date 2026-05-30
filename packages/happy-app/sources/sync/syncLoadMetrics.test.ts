import { describe, expect, it } from 'vitest';
import { SyncLoadMetrics } from './syncLoadMetrics';

describe('SyncLoadMetrics', () => {
    it('records a 1000 message load baseline without retaining message content', () => {
        const metrics = new SyncLoadMetrics();
        const sessionId = 'session-long-load';
        const messageIds = Array.from({ length: 1000 }, (_, index) => `msg-${index + 1}`);

        metrics.start(sessionId);
        metrics.recordFetchPage(sessionId, 'initial', 40, messageIds.length);
        metrics.recordDecryptBatch(sessionId, 25, messageIds.length, 990);
        metrics.recordStoreApply(sessionId, 18, 990, 990);
        metrics.markFirstInteractive(sessionId);
        metrics.recordBackgroundPrefetchPage(sessionId);

        const snapshot = metrics.getSnapshot(sessionId);

        expect(snapshot).toMatchObject({
            sessionId,
            fetchPageCount: 1,
            fetchedMessageCount: 1000,
            decryptBatchCount: 1,
            decryptedMessageCount: 1000,
            normalizedMessageCount: 990,
            storeCommitCount: 1,
            storeInputMessageCount: 990,
            storeChangedMessageCount: 990,
            backgroundPrefetchPageCount: 1,
            totalFetchMs: 40,
            totalDecryptMs: 25,
            totalStoreApplyMs: 18,
            lastOperation: 'initial',
        });
        expect(snapshot?.firstInteractiveMs).not.toBeNull();
        expect(JSON.stringify(snapshot)).not.toContain('msg-1');
    });
});

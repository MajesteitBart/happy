import { describe, expect, it } from 'vitest';
import {
    getOlderMessagesPrefetchDelayMs,
    OLDER_MESSAGES_PREFETCH_BACKGROUND_DELAY_MS,
    OLDER_MESSAGES_PREFETCH_IDLE_DELAY_MS,
    OLDER_MESSAGES_PREFETCH_INTERACTIVE_DELAY_MS,
    shouldContinueOlderMessagesPrefetch,
} from './syncPrefetchPolicy';

describe('syncPrefetchPolicy', () => {
    it('stops prefetch when the session is hidden or cancellation has fired', () => {
        const base = {
            isAborted: false,
            isVisible: true,
            hasSessionMessages: true,
            hasMoreOlder: true,
            hasEncryption: true,
            oldestSeq: 50,
        };

        expect(shouldContinueOlderMessagesPrefetch(base)).toBe(true);
        expect(shouldContinueOlderMessagesPrefetch({ ...base, isVisible: false })).toBe(false);
        expect(shouldContinueOlderMessagesPrefetch({ ...base, isAborted: true })).toBe(false);
        expect(shouldContinueOlderMessagesPrefetch({ ...base, oldestSeq: 1 })).toBe(false);
    });

    it('backs off while the user is interacting or the app is backgrounded', () => {
        expect(getOlderMessagesPrefetchDelayMs({
            appState: 'active',
            nowMs: 1000,
            interactionUntilMs: 0,
        })).toBe(OLDER_MESSAGES_PREFETCH_IDLE_DELAY_MS);

        expect(getOlderMessagesPrefetchDelayMs({
            appState: 'active',
            nowMs: 1000,
            interactionUntilMs: 2000,
        })).toBe(OLDER_MESSAGES_PREFETCH_INTERACTIVE_DELAY_MS);

        expect(getOlderMessagesPrefetchDelayMs({
            appState: 'background',
            nowMs: 1000,
            interactionUntilMs: 0,
        })).toBe(OLDER_MESSAGES_PREFETCH_BACKGROUND_DELAY_MS);
    });
});

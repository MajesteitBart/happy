export const OLDER_MESSAGES_PREFETCH_IDLE_DELAY_MS = 750;
export const OLDER_MESSAGES_PREFETCH_INTERACTIVE_DELAY_MS = 1500;
export const OLDER_MESSAGES_PREFETCH_BACKGROUND_DELAY_MS = 2000;
export const OLDER_MESSAGES_PREFETCH_INTERACTION_BACKOFF_MS = 1500;
export const OLDER_MESSAGES_PREFETCH_BATCH_PAGES = 2;

type PrefetchDelayParams = {
    appState: string;
    nowMs: number;
    interactionUntilMs: number;
};

type PrefetchContinueParams = {
    isAborted: boolean;
    isVisible: boolean;
    hasSessionMessages: boolean;
    hasMoreOlder: boolean;
    hasEncryption: boolean;
    oldestSeq: number | undefined;
};

export function getOlderMessagesPrefetchDelayMs(params: PrefetchDelayParams) {
    if (params.appState !== 'active') {
        return OLDER_MESSAGES_PREFETCH_BACKGROUND_DELAY_MS;
    }
    if (params.interactionUntilMs > params.nowMs) {
        return OLDER_MESSAGES_PREFETCH_INTERACTIVE_DELAY_MS;
    }
    return OLDER_MESSAGES_PREFETCH_IDLE_DELAY_MS;
}

export function shouldContinueOlderMessagesPrefetch(params: PrefetchContinueParams) {
    return !params.isAborted
        && params.isVisible
        && params.hasSessionMessages
        && params.hasMoreOlder
        && params.hasEncryption
        && params.oldestSeq !== undefined
        && params.oldestSeq > 1;
}

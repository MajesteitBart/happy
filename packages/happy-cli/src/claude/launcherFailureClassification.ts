export type ClaudeLauncherFailureClassification =
    | 'user-abort'
    | 'launcher-crash-before-delivery'
    | 'delivered-but-not-consumed'
    | 'unexpected-exit';

export function classifyClaudeLauncherFailure(input: {
    abortSignalAborted: boolean;
    deliveredMessageToProvider: boolean;
    providerStarted: boolean;
}): ClaudeLauncherFailureClassification {
    if (input.abortSignalAborted) {
        return 'user-abort';
    }
    if (input.deliveredMessageToProvider) {
        return 'delivered-but-not-consumed';
    }
    if (input.providerStarted) {
        return 'unexpected-exit';
    }
    return 'launcher-crash-before-delivery';
}

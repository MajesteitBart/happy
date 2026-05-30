import { describe, expect, it } from 'vitest';
import { classifyClaudeLauncherFailure } from './launcherFailureClassification';

describe('classifyClaudeLauncherFailure', () => {
    it('classifies an aborted launcher as user abort', () => {
        expect(classifyClaudeLauncherFailure({
            abortSignalAborted: true,
            deliveredMessageToProvider: true,
            providerStarted: true,
        })).toBe('user-abort');
    });

    it('classifies a failure before prompt delivery as launcher crash before delivery', () => {
        expect(classifyClaudeLauncherFailure({
            abortSignalAborted: false,
            deliveredMessageToProvider: false,
            providerStarted: false,
        })).toBe('launcher-crash-before-delivery');
    });

    it('classifies a failure after prompt delivery as delivered but not consumed', () => {
        expect(classifyClaudeLauncherFailure({
            abortSignalAborted: false,
            deliveredMessageToProvider: true,
            providerStarted: true,
        })).toBe('delivered-but-not-consumed');
    });

    it('classifies a failure after startup but without an active prompt as unexpected exit', () => {
        expect(classifyClaudeLauncherFailure({
            abortSignalAborted: false,
            deliveredMessageToProvider: false,
            providerStarted: true,
        })).toBe('unexpected-exit');
    });
});

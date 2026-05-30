import { describe, expect, it } from 'vitest';
import { summarizeSocketConnectError } from './socketDiagnostics';

describe('summarizeSocketConnectError', () => {
    it('summarizes socket errors without proxy values', () => {
        const error = Object.assign(new Error('websocket failed'), { code: 'ECONNREFUSED' });

        expect(summarizeSocketConnectError(error, {
            HTTPS_PROXY: 'https://proxy.example',
            NO_PROXY: 'localhost',
        } as NodeJS.ProcessEnv)).toEqual({
            message: 'websocket failed',
            code: 'ECONNREFUSED',
            hasHttpProxy: false,
            hasHttpsProxy: true,
            hasAllProxy: false,
            hasNoProxy: true,
        });
    });
});

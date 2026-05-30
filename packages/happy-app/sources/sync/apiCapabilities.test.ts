import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    clearServerCapabilitiesCacheForTests,
    refreshServerCapabilities,
    requireV3MessageCapabilities,
    ServerCompatibilityError,
    type ServerCapabilities,
} from './apiCapabilities';

vi.mock('./apiSocket', () => ({
    getHappyClientId: () => 'web/1.0.0',
}));

vi.mock('./serverConfig', () => ({
    getServerUrl: () => 'https://happy.test/',
}));

const supportedCapabilities: ServerCapabilities = {
    apiVersion: 1,
    messages: {
        v3Post: true,
        backwardPagination: true,
        idempotentLocalId: true,
    },
};

function response(body: unknown, status = 200): Response {
    return {
        ok: status >= 200 && status < 300,
        status,
        json: vi.fn().mockResolvedValue(body),
    } as unknown as Response;
}

describe('apiCapabilities', () => {
    beforeEach(() => {
        clearServerCapabilitiesCacheForTests();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('fetches and caches supported server capabilities', async () => {
        const fetchMock = vi.fn().mockResolvedValue(response(supportedCapabilities));
        vi.stubGlobal('fetch', fetchMock);

        await expect(refreshServerCapabilities()).resolves.toEqual(supportedCapabilities);
        await expect(requireV3MessageCapabilities()).resolves.toEqual(supportedCapabilities);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith('https://happy.test/v1/capabilities', {
            method: 'GET',
            headers: {
                'X-Happy-Client': 'web/1.0.0',
            },
        });
    });

    it('rejects servers missing required v3 message capabilities', async () => {
        const fetchMock = vi.fn().mockResolvedValue(response({
            apiVersion: 1,
            messages: {
                v3Post: true,
                backwardPagination: true,
                idempotentLocalId: false,
            },
        }));
        vi.stubGlobal('fetch', fetchMock);

        await refreshServerCapabilities();

        await expect(requireV3MessageCapabilities()).rejects.toMatchObject({
            name: 'ServerCompatibilityError',
            missingCapabilities: ['messages.idempotentLocalId'],
        });
    });

    it('turns missing capabilities endpoint into upgrade guidance', async () => {
        const fetchMock = vi.fn().mockResolvedValue(response({ error: 'not found' }, 404));
        vi.stubGlobal('fetch', fetchMock);

        await expect(refreshServerCapabilities()).resolves.toBeNull();
        await expect(requireV3MessageCapabilities()).rejects.toThrow(ServerCompatibilityError);
        await expect(requireV3MessageCapabilities()).rejects.toThrow(
            'The Happy server does not support GET /v1/capabilities (HTTP 404).'
        );
    });
});

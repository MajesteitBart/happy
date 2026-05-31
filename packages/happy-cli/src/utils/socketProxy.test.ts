import { describe, expect, it } from 'vitest';
import { getSocketProxyForUrl } from './socketProxy';

describe('getSocketProxyForUrl', () => {
    it('uses http_proxy for ws URLs', () => {
        expect(getSocketProxyForUrl('ws://happy.example/v1/updates', {
            http_proxy: 'http://proxy.example:8080',
        })).toBe('http://proxy.example:8080');
    });

    it('uses https_proxy for wss URLs', () => {
        expect(getSocketProxyForUrl('wss://happy.example/v1/updates', {
            HTTPS_PROXY: 'https://secure-proxy.example:8443',
        })).toBe('https://secure-proxy.example:8443');
    });

    it('falls back to all_proxy when no protocol proxy is set', () => {
        expect(getSocketProxyForUrl('wss://happy.example/v1/updates', {
            ALL_PROXY: 'socks5://proxy.example:1080',
        })).toBe('socks5://proxy.example:1080');
    });

    it('adds a default scheme to bare proxy hosts', () => {
        expect(getSocketProxyForUrl('wss://happy.example/v1/updates', {
            https_proxy: 'proxy.example:8443',
        })).toBe('http://proxy.example:8443');
    });

    it('respects no_proxy for exact and suffix matches', () => {
        expect(getSocketProxyForUrl('wss://happy.example/v1/updates', {
            HTTPS_PROXY: 'https://secure-proxy.example:8443',
            NO_PROXY: 'happy.example',
        })).toBe('');

        expect(getSocketProxyForUrl('wss://api.internal.example/v1/updates', {
            HTTPS_PROXY: 'https://secure-proxy.example:8443',
            NO_PROXY: '.internal.example',
        })).toBe('');
    });
});

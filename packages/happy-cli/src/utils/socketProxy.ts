import { ProxyAgent } from 'proxy-agent';

type Env = Pick<NodeJS.ProcessEnv, string>;

function readEnv(env: Env, key: string) {
    return env[key.toLowerCase()] || env[key.toUpperCase()] || '';
}

function proxyWithDefaultScheme(proxy: string, defaultScheme: 'http' | 'https') {
    return proxy.includes('://') ? proxy : `${defaultScheme}://${proxy}`;
}

function noProxyEntries(env: Env) {
    return (readEnv(env, 'npm_config_no_proxy') || readEnv(env, 'no_proxy'))
        .toLowerCase()
        .split(/[,\s]/)
        .map((entry) => entry.trim())
        .filter(Boolean);
}

function shouldProxy(url: URL, env: Env) {
    const entries = noProxyEntries(env);
    if (entries.length === 0) return true;
    if (entries.includes('*')) return false;

    const hostname = url.hostname.toLowerCase();
    const port = url.port ? Number(url.port) : (url.protocol === 'wss:' || url.protocol === 'https:' ? 443 : 80);

    return entries.every((entry) => {
        const match = entry.match(/^(.+):(\d+)$/);
        const entryHost = (match ? match[1] : entry).replace(/^\*?/, '');
        const entryPort = match ? Number(match[2]) : 0;
        if (entryPort && entryPort !== port) return true;
        if (entryHost.startsWith('.')) return !hostname.endsWith(entryHost);
        return hostname !== entryHost && !hostname.endsWith(`.${entryHost}`);
    });
}

export function getSocketProxyForUrl(rawUrl: string, env: Env = process.env) {
    let url: URL;
    try {
        url = new URL(rawUrl);
    } catch {
        return '';
    }

    if (!shouldProxy(url, env)) return '';

    if (url.protocol === 'ws:') {
        const proxy = readEnv(env, 'npm_config_ws_proxy')
            || readEnv(env, 'ws_proxy')
            || readEnv(env, 'npm_config_http_proxy')
            || readEnv(env, 'http_proxy')
            || readEnv(env, 'npm_config_proxy')
            || readEnv(env, 'all_proxy');
        return proxy ? proxyWithDefaultScheme(proxy, 'http') : '';
    }

    if (url.protocol === 'wss:') {
        const proxy = readEnv(env, 'npm_config_wss_proxy')
            || readEnv(env, 'wss_proxy')
            || readEnv(env, 'npm_config_https_proxy')
            || readEnv(env, 'https_proxy')
            || readEnv(env, 'npm_config_http_proxy')
            || readEnv(env, 'http_proxy')
            || readEnv(env, 'npm_config_proxy')
            || readEnv(env, 'all_proxy');
        return proxy ? proxyWithDefaultScheme(proxy, 'http') : '';
    }

    return '';
}

export function createSocketIoProxyOptions() {
    const agent = new ProxyAgent({
        getProxyForUrl: (url) => getSocketProxyForUrl(url),
    });

    return {
        // engine.io's public type is narrower than the Node transport accepts.
        agent: agent as unknown as string,
    };
}

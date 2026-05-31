import { getHappyClientId } from './apiSocket';
import { getServerUrl } from './serverConfig';

export type ServerCapabilities = {
    apiVersion: number;
    server?: {
        name?: string;
        version?: string | null;
    };
    messages?: {
        v3Post?: boolean;
        backwardPagination?: boolean;
        idempotentLocalId?: boolean;
        maxBatchSize?: number;
        maxPageSize?: number;
    };
    features?: Record<string, boolean>;
    modelCatalog?: {
        version?: number;
        updatedAt?: string;
        defaults?: Record<string, string>;
        providers?: Record<string, ServerModelCatalogEntry[]>;
    };
    minimums?: {
        cli?: string;
        appRuntime?: string;
    };
};

export type ServerModelCatalogEntry = {
    code?: string;
    value?: string;
    description?: string | null;
    available?: boolean;
    default?: boolean;
};

const REQUIRED_V3_MESSAGE_CAPABILITIES = [
    'messages.v3Post',
    'messages.backwardPagination',
    'messages.idempotentLocalId',
] as const;

type RequiredV3MessageCapability = typeof REQUIRED_V3_MESSAGE_CAPABILITIES[number];

type CapabilitiesCacheEntry = {
    serverUrl: string;
    capabilities: ServerCapabilities | null;
    error: Error | null;
};

let cachedCapabilities: CapabilitiesCacheEntry | null = null;

export class ServerCompatibilityError extends Error {
    readonly code = 'SERVER_COMPATIBILITY_UNSUPPORTED';
    readonly missingCapabilities: RequiredV3MessageCapability[];

    constructor(message: string, missingCapabilities: RequiredV3MessageCapability[] = []) {
        super(message);
        this.name = 'ServerCompatibilityError';
        this.missingCapabilities = missingCapabilities;
    }
}

function normalizeServerUrl(serverUrl: string): string {
    return serverUrl.replace(/\/+$/, '');
}

function getMissingV3MessageCapabilities(capabilities: ServerCapabilities): RequiredV3MessageCapability[] {
    const missing: RequiredV3MessageCapability[] = [];
    if (capabilities.messages?.v3Post !== true) missing.push('messages.v3Post');
    if (capabilities.messages?.backwardPagination !== true) missing.push('messages.backwardPagination');
    if (capabilities.messages?.idempotentLocalId !== true) missing.push('messages.idempotentLocalId');
    return missing;
}

function makeUpgradeMessage(reason: string, missingCapabilities: RequiredV3MessageCapability[] = []): string {
    const missing = missingCapabilities.length > 0
        ? ` Missing capability: ${missingCapabilities.join(', ')}.`
        : '';
    return `${reason}${missing} Upgrade the Happy self-host server before sending messages from this app.`;
}

export async function fetchServerCapabilities(serverUrl = getServerUrl()): Promise<ServerCapabilities> {
    const normalizedServerUrl = normalizeServerUrl(serverUrl);
    const response = await fetch(`${normalizedServerUrl}/v1/capabilities`, {
        method: 'GET',
        headers: {
            'X-Happy-Client': getHappyClientId(),
        },
    });

    if (!response.ok) {
        throw new ServerCompatibilityError(
            makeUpgradeMessage(`The Happy server does not support GET /v1/capabilities (HTTP ${response.status}).`)
        );
    }

    const data = await response.json();
    if (!data || typeof data !== 'object') {
        throw new ServerCompatibilityError(
            makeUpgradeMessage('The Happy server returned an invalid capabilities response.')
        );
    }

    return data as ServerCapabilities;
}

export async function refreshServerCapabilities(serverUrl = getServerUrl()): Promise<ServerCapabilities | null> {
    const normalizedServerUrl = normalizeServerUrl(serverUrl);
    try {
        const capabilities = await fetchServerCapabilities(normalizedServerUrl);
        cachedCapabilities = {
            serverUrl: normalizedServerUrl,
            capabilities,
            error: null,
        };
        return capabilities;
    } catch (error) {
        cachedCapabilities = {
            serverUrl: normalizedServerUrl,
            capabilities: null,
            error: error instanceof Error ? error : new Error(String(error)),
        };
        return null;
    }
}

export async function requireV3MessageCapabilities(serverUrl = getServerUrl()): Promise<ServerCapabilities> {
    const normalizedServerUrl = normalizeServerUrl(serverUrl);
    let entry = cachedCapabilities?.serverUrl === normalizedServerUrl ? cachedCapabilities : null;

    if (!entry) {
        await refreshServerCapabilities(normalizedServerUrl);
        entry = cachedCapabilities?.serverUrl === normalizedServerUrl ? cachedCapabilities : null;
    }

    if (!entry || entry.error || !entry.capabilities) {
        throw entry?.error ?? new ServerCompatibilityError(
            makeUpgradeMessage('The Happy server compatibility check did not complete.')
        );
    }

    const capabilities = entry.capabilities;
    const missingCapabilities = getMissingV3MessageCapabilities(capabilities);
    if (missingCapabilities.length > 0) {
        throw new ServerCompatibilityError(
            makeUpgradeMessage('The Happy server is missing required v3 message API support.', missingCapabilities),
            missingCapabilities
        );
    }

    return capabilities;
}

export function clearServerCapabilitiesCacheForTests() {
    cachedCapabilities = null;
}

export function getCachedServerCapabilities(): ServerCapabilities | null {
    return cachedCapabilities?.capabilities ?? null;
}

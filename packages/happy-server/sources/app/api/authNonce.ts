import { createHash, randomBytes, randomUUID } from "node:crypto";

export const AUTH_NONCE_PURPOSE = "account-auth-token";
export const AUTH_NONCE_TTL_MS = 120_000;

export type AuthNoncePurpose = typeof AUTH_NONCE_PURPOSE;

export type AuthNonceMaterial = {
    nonce: string;
    serverOrigin: string;
    purpose: AuthNoncePurpose;
    clientId: string;
};

type StoredAuthNonce = {
    nonceHash: string;
    publicKey: string;
    serverOrigin: string;
    purpose: AuthNoncePurpose;
    clientId: string;
    expiresAt: number;
};

const authNonceStore = new Map<string, StoredAuthNonce>();

function hashNonce(nonce: string) {
    return createHash("sha256").update(nonce).digest("base64url");
}

function pruneExpiredAuthNonces(now = Date.now()) {
    for (const [nonceId, nonce] of authNonceStore) {
        if (nonce.expiresAt <= now) {
            authNonceStore.delete(nonceId);
        }
    }
}

export function createAuthNonceSignedPayload(material: AuthNonceMaterial) {
    return JSON.stringify({
        nonce: material.nonce,
        serverOrigin: material.serverOrigin,
        purpose: material.purpose,
        clientId: material.clientId
    });
}

export function createAuthNonce(input: {
    publicKey: string;
    serverOrigin: string;
    clientId: string;
    purpose?: AuthNoncePurpose;
    now?: number;
}) {
    const now = input.now ?? Date.now();
    pruneExpiredAuthNonces(now);

    const nonceId = randomUUID();
    const nonce = randomBytes(32).toString("base64url");
    const purpose = input.purpose ?? AUTH_NONCE_PURPOSE;
    const expiresAt = now + AUTH_NONCE_TTL_MS;

    authNonceStore.set(nonceId, {
        nonceHash: hashNonce(nonce),
        publicKey: input.publicKey,
        serverOrigin: input.serverOrigin,
        purpose,
        clientId: input.clientId,
        expiresAt
    });

    return {
        nonceId,
        nonce,
        expiresAt: new Date(expiresAt).toISOString(),
        purpose,
        serverOrigin: input.serverOrigin,
        clientId: input.clientId,
        signedPayload: createAuthNonceSignedPayload({
            nonce,
            serverOrigin: input.serverOrigin,
            purpose,
            clientId: input.clientId
        })
    };
}

export type ConsumeAuthNonceFailure =
    | "not-found"
    | "expired"
    | "public-key-mismatch"
    | "purpose-mismatch"
    | "origin-mismatch"
    | "client-mismatch"
    | "nonce-mismatch";

export function consumeAuthNonce(input: {
    nonceId: string;
    nonce: string;
    publicKey: string;
    serverOrigin: string;
    purpose: AuthNoncePurpose;
    clientId: string;
    now?: number;
}): { success: true } | { success: false; reason: ConsumeAuthNonceFailure } {
    const now = input.now ?? Date.now();
    const stored = authNonceStore.get(input.nonceId);
    if (!stored) {
        pruneExpiredAuthNonces(now);
        return { success: false, reason: "not-found" };
    }

    if (stored.expiresAt <= now) {
        authNonceStore.delete(input.nonceId);
        return { success: false, reason: "expired" };
    }

    if (stored.publicKey !== input.publicKey) {
        return { success: false, reason: "public-key-mismatch" };
    }

    if (stored.purpose !== input.purpose) {
        return { success: false, reason: "purpose-mismatch" };
    }

    if (stored.serverOrigin !== input.serverOrigin) {
        return { success: false, reason: "origin-mismatch" };
    }

    if (stored.clientId !== input.clientId) {
        return { success: false, reason: "client-mismatch" };
    }

    if (stored.nonceHash !== hashNonce(input.nonce)) {
        return { success: false, reason: "nonce-mismatch" };
    }

    authNonceStore.delete(input.nonceId);
    return { success: true };
}

export function clearAuthNonceStoreForTests() {
    authNonceStore.clear();
}

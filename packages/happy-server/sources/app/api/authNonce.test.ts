import { describe, expect, it, beforeEach } from "vitest";
import { AUTH_NONCE_PURPOSE, clearAuthNonceStoreForTests, consumeAuthNonce, createAuthNonce } from "./authNonce";

describe("authNonce", () => {
    beforeEach(() => {
        clearAuthNonceStoreForTests();
    });

    it("consumes a nonce exactly once", () => {
        const nonce = createAuthNonce({
            publicKey: "public-key",
            serverOrigin: "https://happy.example",
            clientId: "cli/test",
            now: 1000
        });

        expect(consumeAuthNonce({
            nonceId: nonce.nonceId,
            nonce: nonce.nonce,
            publicKey: "public-key",
            serverOrigin: "https://happy.example",
            purpose: AUTH_NONCE_PURPOSE,
            clientId: "cli/test",
            now: 1100
        })).toEqual({ success: true });

        expect(consumeAuthNonce({
            nonceId: nonce.nonceId,
            nonce: nonce.nonce,
            publicKey: "public-key",
            serverOrigin: "https://happy.example",
            purpose: AUTH_NONCE_PURPOSE,
            clientId: "cli/test",
            now: 1100
        })).toEqual({ success: false, reason: "not-found" });
    });

    it("rejects expired nonces", () => {
        const nonce = createAuthNonce({
            publicKey: "public-key",
            serverOrigin: "https://happy.example",
            clientId: "cli/test",
            now: 1000
        });

        expect(consumeAuthNonce({
            nonceId: nonce.nonceId,
            nonce: nonce.nonce,
            publicKey: "public-key",
            serverOrigin: "https://happy.example",
            purpose: AUTH_NONCE_PURPOSE,
            clientId: "cli/test",
            now: 121_001
        })).toEqual({ success: false, reason: "expired" });
    });

    it("rejects wrong purpose, origin, and nonce material", () => {
        const nonce = createAuthNonce({
            publicKey: "public-key",
            serverOrigin: "https://happy.example",
            clientId: "cli/test",
            now: 1000
        });

        expect(consumeAuthNonce({
            nonceId: nonce.nonceId,
            nonce: nonce.nonce,
            publicKey: "public-key",
            serverOrigin: "https://happy.example",
            purpose: "different-purpose" as typeof AUTH_NONCE_PURPOSE,
            clientId: "cli/test",
            now: 1100
        })).toEqual({ success: false, reason: "purpose-mismatch" });

        expect(consumeAuthNonce({
            nonceId: nonce.nonceId,
            nonce: nonce.nonce,
            publicKey: "public-key",
            serverOrigin: "https://evil.example",
            purpose: AUTH_NONCE_PURPOSE,
            clientId: "cli/test",
            now: 1100
        })).toEqual({ success: false, reason: "origin-mismatch" });

        expect(consumeAuthNonce({
            nonceId: nonce.nonceId,
            nonce: "different",
            publicKey: "public-key",
            serverOrigin: "https://happy.example",
            purpose: AUTH_NONCE_PURPOSE,
            clientId: "cli/test",
            now: 1100
        })).toEqual({ success: false, reason: "nonce-mismatch" });
    });
});

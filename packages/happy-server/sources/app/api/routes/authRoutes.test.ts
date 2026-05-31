import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import tweetnacl from "tweetnacl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type Fastify } from "../types";
import { AUTH_NONCE_PURPOSE, clearAuthNonceStoreForTests } from "../authNonce";

const mocks = vi.hoisted(() => ({
    accountUpsert: vi.fn(),
    createToken: vi.fn()
}));

vi.mock("@/storage/db", () => ({
    db: {
        account: {
            upsert: mocks.accountUpsert
        }
    }
}));

vi.mock("@/app/auth/auth", () => ({
    auth: {
        createToken: mocks.createToken
    }
}));

import { authRoutes } from "./authRoutes";

function encodeBase64(buffer: Uint8Array) {
    return Buffer.from(buffer).toString("base64");
}

function createApp() {
    const app = fastify({ logger: false });
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    const typed = app.withTypeProvider<ZodTypeProvider>() as unknown as Fastify;
    typed.authenticate = async () => {};
    authRoutes(typed);
    return app;
}

describe("authRoutes", () => {
    let app: ReturnType<typeof createApp>;

    beforeEach(() => {
        clearAuthNonceStoreForTests();
        mocks.accountUpsert.mockResolvedValue({ id: "account-1" });
        mocks.createToken.mockResolvedValue("token-1");
        app = createApp();
    });

    afterEach(async () => {
        await app.close();
        vi.clearAllMocks();
        vi.unstubAllEnvs();
    });

    it("authenticates with a server-issued nonce and rejects replay", async () => {
        const keypair = tweetnacl.sign.keyPair.fromSeed(new Uint8Array(32).fill(7));
        const publicKey = encodeBase64(keypair.publicKey);

        const nonceResponse = await app.inject({
            method: "POST",
            url: "/v1/auth/nonce",
            headers: {
                host: "happy.example",
                "x-forwarded-proto": "https",
                "x-happy-client": "cli/test"
            },
            payload: {
                publicKey,
                purpose: AUTH_NONCE_PURPOSE
            }
        });

        expect(nonceResponse.statusCode).toBe(200);
        const nonce = nonceResponse.json();
        const challenge = new TextEncoder().encode(nonce.signedPayload);
        const signature = tweetnacl.sign.detached(challenge, keypair.secretKey);

        const authPayload = {
            publicKey,
            challenge: encodeBase64(challenge),
            signature: encodeBase64(signature),
            nonceId: nonce.nonceId,
            nonce: nonce.nonce,
            purpose: nonce.purpose,
            serverOrigin: nonce.serverOrigin,
            clientId: nonce.clientId
        };

        const authResponse = await app.inject({
            method: "POST",
            url: "/v1/auth",
            headers: {
                "x-happy-client": "cli/test"
            },
            payload: authPayload
        });

        expect(authResponse.statusCode).toBe(200);
        expect(authResponse.json()).toEqual({ success: true, token: "token-1" });

        const replayResponse = await app.inject({
            method: "POST",
            url: "/v1/auth",
            headers: {
                "x-happy-client": "cli/test"
            },
            payload: authPayload
        });

        expect(replayResponse.statusCode).toBe(401);
        expect(replayResponse.json()).toEqual({ error: "Invalid nonce" });
    });

    it("rejects nonce auth when the signed origin is changed", async () => {
        const keypair = tweetnacl.sign.keyPair.fromSeed(new Uint8Array(32).fill(9));
        const publicKey = encodeBase64(keypair.publicKey);

        const nonceResponse = await app.inject({
            method: "POST",
            url: "/v1/auth/nonce",
            headers: {
                host: "happy.example",
                "x-forwarded-proto": "https",
                "x-happy-client": "cli/test"
            },
            payload: {
                publicKey,
                purpose: AUTH_NONCE_PURPOSE
            }
        });

        const nonce = nonceResponse.json();
        const tamperedPayload = JSON.stringify({
            nonce: nonce.nonce,
            serverOrigin: "https://evil.example",
            purpose: nonce.purpose,
            clientId: nonce.clientId
        });
        const challenge = new TextEncoder().encode(tamperedPayload);
        const signature = tweetnacl.sign.detached(challenge, keypair.secretKey);

        const authResponse = await app.inject({
            method: "POST",
            url: "/v1/auth",
            headers: {
                "x-happy-client": "cli/test"
            },
            payload: {
                publicKey,
                challenge: encodeBase64(challenge),
                signature: encodeBase64(signature),
                nonceId: nonce.nonceId,
                nonce: nonce.nonce,
                purpose: nonce.purpose,
                serverOrigin: "https://evil.example",
                clientId: nonce.clientId
            }
        });

        expect(authResponse.statusCode).toBe(401);
        expect(authResponse.json()).toEqual({ error: "Invalid nonce" });
    });

    it("rejects legacy challenge auth by default", async () => {
        const keypair = tweetnacl.sign.keyPair.fromSeed(new Uint8Array(32).fill(11));
        const challenge = new Uint8Array(32).fill(12);
        const signature = tweetnacl.sign.detached(challenge, keypair.secretKey);

        const response = await app.inject({
            method: "POST",
            url: "/v1/auth",
            payload: {
                publicKey: encodeBase64(keypair.publicKey),
                challenge: encodeBase64(challenge),
                signature: encodeBase64(signature)
            }
        });

        expect(response.statusCode).toBe(401);
        expect(response.json()).toEqual({ error: "Server-issued nonce required" });
        expect(mocks.accountUpsert).not.toHaveBeenCalled();
    });

    it("accepts legacy challenge auth only when explicitly enabled", async () => {
        await app.close();
        vi.stubEnv("HAPPY_ENABLE_LEGACY_AUTH_CHALLENGE_FALLBACK", "1");
        app = createApp();

        const keypair = tweetnacl.sign.keyPair.fromSeed(new Uint8Array(32).fill(13));
        const challenge = new Uint8Array(32).fill(14);
        const signature = tweetnacl.sign.detached(challenge, keypair.secretKey);

        const response = await app.inject({
            method: "POST",
            url: "/v1/auth",
            payload: {
                publicKey: encodeBase64(keypair.publicKey),
                challenge: encodeBase64(challenge),
                signature: encodeBase64(signature)
            }
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ success: true, token: "token-1" });
    });
});

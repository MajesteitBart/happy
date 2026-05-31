import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type Fastify } from "../types";
import { getServerCapabilities, versionRoutes } from "./versionRoutes";

function createApp() {
    const app = fastify({ logger: false });
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    const typed = app.withTypeProvider<ZodTypeProvider>() as unknown as Fastify;
    versionRoutes(typed);
    return app;
}

describe("versionRoutes", () => {
    let app: ReturnType<typeof createApp>;

    beforeEach(() => {
        app = createApp();
    });

    afterEach(async () => {
        await app.close();
        vi.unstubAllEnvs();
    });

    it("returns public server capabilities for compatibility checks", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/v1/capabilities"
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual(getServerCapabilities());
    });

    it("advertises the v3 message API contract required by current clients", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/v1/capabilities"
        });
        const body = response.json();

        expect(body.messages).toMatchObject({
            v3Post: true,
            backwardPagination: true,
            idempotentLocalId: true,
            maxBatchSize: 100,
            maxPageSize: 500
        });
    });

    it("advertises legacy auth fallback as disabled by default", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/v1/capabilities"
        });

        expect(response.json().features).toMatchObject({
            serverIssuedAuthNonces: true,
            legacyAuthChallengeFallback: false
        });
    });

    it("advertises legacy auth fallback only when the migration switch is enabled", async () => {
        await app.close();
        vi.stubEnv("HAPPY_ENABLE_LEGACY_AUTH_CHALLENGE_FALLBACK", "true");
        app = createApp();

        const response = await app.inject({
            method: "GET",
            url: "/v1/capabilities"
        });

        expect(response.json().features.legacyAuthChallengeFallback).toBe(true);
    });

    it("advertises a real model catalog in capabilities", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/v1/capabilities"
        });
        const body = response.json();

        expect(body.modelCatalog.version).toBeGreaterThan(1);
        expect(body.modelCatalog.providers.codex).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ code: "gpt-5.5", value: "gpt-5.5", default: true })
            ])
        );
        expect(body.modelCatalog.defaults).toMatchObject({
            claude: "opus",
            codex: "gpt-5.5",
            gemini: "gemini-2.5-pro"
        });
    });

    it("serves the model catalog through a dedicated endpoint", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/v1/model-catalog"
        });
        const body = response.json();

        expect(response.statusCode).toBe(200);
        expect(body.providers.gemini).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ code: "gemini-2.5-pro", default: true })
            ])
        );
    });
});

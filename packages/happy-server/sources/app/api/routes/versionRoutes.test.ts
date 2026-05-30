import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { type Fastify } from "../types";
import { SERVER_CAPABILITIES, versionRoutes } from "./versionRoutes";

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
    });

    it("returns public server capabilities for compatibility checks", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/v1/capabilities"
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual(SERVER_CAPABILITIES);
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
});

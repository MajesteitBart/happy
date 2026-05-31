import { z } from "zod";
import { type Fastify } from "../types";
import * as semver from 'semver';
import { ANDROID_UP_TO_DATE, IOS_UP_TO_DATE } from "@/versions";
import { isLegacyAuthChallengeFallbackEnabled } from "../authConfig";
import { getModelCatalog, ModelCatalogSchema } from "../modelCatalog";

export function getServerCapabilities() {
    return {
        apiVersion: 1,
        server: {
            name: "happy-server-self-host",
            version: process.env.npm_package_version ?? null
        },
        messages: {
            v3Post: true,
            backwardPagination: true,
            idempotentLocalId: true,
            maxBatchSize: 100,
            maxPageSize: 500
        },
        features: {
            attachments: true,
            voice: true,
            kv: true,
            serverIssuedAuthNonces: true,
            legacyAuthChallengeFallback: isLegacyAuthChallengeFallbackEnabled()
        },
        modelCatalog: getModelCatalog(),
        minimums: {
            cli: "1.1.10-beta.7",
            appRuntime: "1.0.0"
        }
    } as const;
}

export function versionRoutes(app: Fastify) {
    app.get('/v1/capabilities', {
        schema: {
            response: {
                200: z.object({
                    apiVersion: z.number(),
                    server: z.object({
                        name: z.string(),
                        version: z.string().nullable()
                    }),
                    messages: z.object({
                        v3Post: z.literal(true),
                        backwardPagination: z.literal(true),
                        idempotentLocalId: z.literal(true),
                        maxBatchSize: z.number(),
                        maxPageSize: z.number()
                    }),
                    features: z.object({
                        attachments: z.boolean(),
                        voice: z.boolean(),
                        kv: z.boolean(),
                        serverIssuedAuthNonces: z.boolean(),
                        legacyAuthChallengeFallback: z.boolean()
                    }),
                    modelCatalog: ModelCatalogSchema,
                    minimums: z.object({
                        cli: z.string(),
                        appRuntime: z.string()
                    })
                })
            }
        }
    }, async (_request, reply) => {
        reply.send(getServerCapabilities());
    });

    app.get('/v1/model-catalog', {
        schema: {
            response: {
                200: ModelCatalogSchema
            }
        }
    }, async (_request, reply) => {
        reply.send(getModelCatalog());
    });

    app.post('/v1/version', {
        schema: {
            body: z.object({
                platform: z.string(),
                version: z.string(),
                app_id: z.string()
            }),
            response: {
                200: z.object({
                    updateUrl: z.string().nullable()
                })
            }
        }
    }, async (request, reply) => {
        const { platform, version, app_id } = request.body;

        // Check ios
        if (platform.toLowerCase() === 'ios') {
            if (semver.satisfies(version, IOS_UP_TO_DATE)) {
                reply.send({ updateUrl: null });
            } else {
                reply.send({ updateUrl: 'https://apps.apple.com/us/app/happy-claude-code-client/id6748571505' });
            }
            return;
        }

        // Check android
        if (platform.toLowerCase() === 'android') {
            if (semver.satisfies(version, ANDROID_UP_TO_DATE)) {
                reply.send({ updateUrl: null });
            } else {
                reply.send({ updateUrl: 'https://play.google.com/store/apps/details?id=com.ex3ndr.happy' });
            }
            return;
        }

        // Fallbacke
        reply.send({ updateUrl: null });
    });
}

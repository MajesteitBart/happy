import { z } from "zod";

export const MODEL_CATALOG_VERSION = 2;

export const ModelCatalogEntrySchema = z.object({
    code: z.string(),
    value: z.string(),
    description: z.string().nullable().optional(),
    available: z.boolean().optional(),
    default: z.boolean().optional()
});

export const ModelCatalogSchema = z.object({
    version: z.number(),
    updatedAt: z.string(),
    providers: z.record(z.string(), z.array(ModelCatalogEntrySchema)),
    defaults: z.record(z.string(), z.string())
});

export type ModelCatalog = z.infer<typeof ModelCatalogSchema>;

export function getModelCatalog(): ModelCatalog {
    return {
        version: MODEL_CATALOG_VERSION,
        updatedAt: "2026-05-31",
        defaults: {
            claude: "opus",
            codex: "gpt-5.5",
            gemini: "gemini-2.5-pro",
            openclaw: "default"
        },
        providers: {
            claude: [
                { code: "default", value: "default model", description: null },
                { code: "opus", value: "opus 4.7", description: null, default: true },
                { code: "sonnet", value: "sonnet 4.6", description: null },
                { code: "haiku", value: "haiku 4.5", description: null }
            ],
            codex: [
                { code: "default", value: "default model", description: null },
                { code: "gpt-5.5", value: "gpt-5.5", description: null, default: true },
                { code: "gpt-5.4", value: "gpt-5.4", description: null },
                { code: "gpt-5.3-codex", value: "gpt-5.3-codex", description: null },
                { code: "gpt-5.2-codex", value: "gpt-5.2-codex", description: null },
                { code: "gpt-5.1-codex-max", value: "gpt-5.1-codex-max", description: null },
                { code: "gpt-5.2", value: "gpt-5.2", description: null },
                { code: "gpt-5.1-codex-mini", value: "gpt-5.1-codex-mini", description: null }
            ],
            gemini: [
                { code: "gemini-3.1-pro-preview", value: "gemini 3.1 pro", description: "latest & most capable" },
                { code: "gemini-3-flash-preview", value: "gemini 3 flash", description: "latest & fast" },
                { code: "gemini-3.1-flash-lite-preview", value: "gemini 3.1 flash lite", description: "latest & fastest" },
                { code: "gemini-2.5-pro", value: "gemini 2.5 pro", description: "most capable", default: true },
                { code: "gemini-2.5-flash", value: "gemini 2.5 flash", description: "fast & efficient" },
                { code: "gemini-2.5-flash-lite", value: "gemini 2.5 flash lite", description: "fastest" }
            ],
            openclaw: [
                { code: "default", value: "default model", description: null, default: true }
            ]
        }
    };
}

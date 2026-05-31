import { describe, expect, it } from 'vitest';
import {
    getAvailableModels,
    getAvailablePermissionModes,
    getCatalogModelModes,
    getCodexModelModes,
    getClaudePermissionModes,
    getDefaultEffortKey,
    getDefaultModelKey,
    getDefaultPermissionModeKey,
    mapMetadataOptions,
    resolveCurrentOption,
} from './modelModeOptions';

const translate = (key: string) => `tr:${key}`;

describe('modelModeOptions', () => {
    it('maps metadata option shape into mode options', () => {
        expect(mapMetadataOptions([
            { code: 'm1', value: 'Model One', description: 'Primary model' },
            { code: 'm2', value: 'Model Two' },
        ])).toEqual([
            { key: 'm1', name: 'Model One', description: 'Primary model' },
            { key: 'm2', name: 'Model Two', description: null },
        ]);
    });

    it('builds claude permission fallbacks with translated names', () => {
        const modes = getClaudePermissionModes(translate);
        expect(modes.map((mode) => mode.key)).toEqual(['default', 'plan', 'dontAsk', 'acceptEdits', 'bypassPermissions']);
        expect(modes[0].name).toBe('tr:agentInput.permissionMode.default');
    });

    it('builds codex model fallbacks', () => {
        const models = getCodexModelModes();
        expect(models.map((model) => model.key)).toEqual([
            'default',
            'gpt-5.5',
            'gpt-5.4',
            'gpt-5.3-codex',
            'gpt-5.2-codex',
            'gpt-5.1-codex-max',
            'gpt-5.2',
            'gpt-5.1-codex-mini',
        ]);
        expect(models[0].name).toBe('default model');
        expect(models[1].name).toBe('gpt-5.5');
    });

    it('uses code defaults for agent defaults', () => {
        expect(getDefaultPermissionModeKey('claude')).toBe('bypassPermissions');
        expect(getDefaultModelKey('claude')).toBe('opus');
        expect(getDefaultEffortKey('claude')).toBe('medium');
        expect(getDefaultPermissionModeKey('codex')).toBe('yolo');
        expect(getDefaultModelKey('codex')).toBe('gpt-5.5');
        expect(getDefaultEffortKey('codex')).toBe('medium');
    });

    it('prefers metadata models over hardcoded fallbacks', () => {
        const models = getAvailableModels('gemini', {
            models: [
                { code: 'custom-gemini', value: 'Gemini Custom', description: 'From metadata' },
            ],
        } as any, translate);

        expect(models).toEqual([
            { key: 'custom-gemini', name: 'Gemini Custom', description: 'From metadata' },
        ]);
    });

    it('adds codex default model option when metadata models are present', () => {
        const models = getAvailableModels('codex', {
            models: [
                { code: 'gpt-5.4', value: 'gpt-5.4', description: 'Latest' },
            ],
        } as any, translate);

        expect(models).toEqual([
            { key: 'default', name: 'default model', description: null },
            { key: 'gpt-5.4', name: 'gpt-5.4', description: 'Latest' },
        ]);
    });

    it('uses model catalog entries when session metadata models are missing', () => {
        const models = getAvailableModels('codex', null, translate, {
            apiVersion: 1,
            modelCatalog: {
                version: 2,
                providers: {
                    codex: [
                        { code: 'default', value: 'default model' },
                        { code: 'gpt-new', value: 'gpt-new', description: 'from server catalog' },
                    ],
                },
            },
        });

        expect(models).toEqual([
            { key: 'default', name: 'default model', description: null },
            { key: 'gpt-new', name: 'gpt-new', description: 'from server catalog' },
        ]);
    });

    it('falls back when the model catalog is missing or stale', () => {
        expect(getAvailableModels('codex', null, translate, {
            apiVersion: 1,
        }).map((model) => model.key)).toEqual(getCodexModelModes().map((model) => model.key));

        expect(getCatalogModelModes('codex', {
            apiVersion: 1,
            modelCatalog: {
                version: 1,
                providers: {
                    codex: [{ code: 'stale-new-model', value: 'stale new model' }],
                },
            },
        })).toEqual([]);
    });

    it('filters unavailable catalog models', () => {
        expect(getCatalogModelModes('gemini', {
            apiVersion: 1,
            modelCatalog: {
                version: 2,
                providers: {
                    gemini: [
                        { code: 'gemini-visible', value: 'Gemini Visible' },
                        { code: 'gemini-disabled', value: 'Gemini Disabled', available: false },
                    ],
                },
            },
        })).toEqual([
            { key: 'gemini-visible', name: 'Gemini Visible', description: null },
        ]);
    });

    it('keeps codex permission modes hardcoded even when metadata modes exist', () => {
        const modes = getAvailablePermissionModes('codex', {
            operatingModes: [{ code: 'metadata-only', value: 'Metadata Mode', description: null }],
        } as any, translate);

        expect(modes.map((mode) => mode.key)).toEqual(['default', 'read-only', 'safe-yolo', 'yolo']);
    });

    it('applies hacks to metadata-provided operating modes', () => {
        const modes = getAvailablePermissionModes('gemini', {
            operatingModes: [
                { code: 'build', value: 'build, build', description: 'Do build steps' },
                { code: 'plan', value: 'plan/plan', description: 'Plan first' },
            ],
        } as any, translate);

        expect(modes).toEqual([
            { key: 'build', name: 'Build', description: 'Do build steps' },
            { key: 'plan', name: 'Plan', description: 'Plan first' },
        ]);
    });

    it('resolves the first matching preferred key', () => {
        const options = [
            { key: 'a', name: 'A' },
            { key: 'b', name: 'B' },
        ];

        expect(resolveCurrentOption(options, ['missing', 'b', 'a'])).toEqual({ key: 'b', name: 'B' });
        expect(resolveCurrentOption(options, ['missing'])).toBeNull();
    });
});

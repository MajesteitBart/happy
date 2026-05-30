import { describe, expect, it } from 'vitest';
import { chmod, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { ensurePrivateDirectory, SandboxConfigSchema, writePrivateFile } from './persistence';

describe('SandboxConfigSchema', () => {
    it('applies defaults when values are omitted', () => {
        const parsed = SandboxConfigSchema.parse({});

        expect(parsed).toEqual({
            enabled: false,
            sessionIsolation: 'workspace',
            customWritePaths: [],
            denyReadPaths: ['~/.ssh', '~/.aws', '~/.gnupg'],
            extraWritePaths: ['/tmp'],
            denyWritePaths: ['.env'],
            networkMode: 'allowed',
            allowedDomains: [],
            deniedDomains: [],
            allowLocalBinding: true,
        });
    });

    it('accepts a fully custom valid sandbox config', () => {
        const parsed = SandboxConfigSchema.parse({
            enabled: true,
            workspaceRoot: '~/projects',
            sessionIsolation: 'custom',
            customWritePaths: ['~/projects/foo', '/var/tmp'],
            denyReadPaths: ['~/.ssh'],
            extraWritePaths: ['/tmp', '/private/tmp'],
            denyWritePaths: ['.env', '.secrets'],
            networkMode: 'custom',
            allowedDomains: ['api.openai.com', '*.github.com'],
            deniedDomains: ['tracking.example.com'],
            allowLocalBinding: false,
        });

        expect(parsed.enabled).toBe(true);
        expect(parsed.workspaceRoot).toBe('~/projects');
        expect(parsed.sessionIsolation).toBe('custom');
        expect(parsed.networkMode).toBe('custom');
        expect(parsed.allowedDomains).toEqual(['api.openai.com', '*.github.com']);
        expect(parsed.allowLocalBinding).toBe(false);
    });

    it('rejects invalid enum values', () => {
        expect(() =>
            SandboxConfigSchema.parse({
                sessionIsolation: 'invalid',
            }),
        ).toThrow();

        expect(() =>
            SandboxConfigSchema.parse({
                networkMode: 'invalid',
            }),
        ).toThrow();
    });

    it('rejects invalid field types', () => {
        expect(() =>
            SandboxConfigSchema.parse({
                allowLocalBinding: 'yes',
            }),
        ).toThrow();

        expect(() =>
            SandboxConfigSchema.parse({
                denyReadPaths: [123],
            }),
        ).toThrow();
    });
});

describe('private persistence permissions', () => {
    it('creates and repairs private directories with owner-only permissions', async () => {
        const root = await mkdtemp(join(tmpdir(), 'happy-perms-'));
        const directory = join(root, 'home');
        try {
            await ensurePrivateDirectory(directory);
            expect((await stat(directory)).mode & 0o777).toBe(0o700);

            await chmod(directory, 0o755);
            await ensurePrivateDirectory(directory);
            expect((await stat(directory)).mode & 0o777).toBe(0o700);
        } finally {
            await rm(root, { recursive: true, force: true });
        }
    });

    it('writes and repairs private files with owner-only permissions', async () => {
        const root = await mkdtemp(join(tmpdir(), 'happy-perms-'));
        const file = join(root, 'access.key');
        try {
            await writePrivateFile(file, 'secret');
            expect(await readFile(file, 'utf8')).toBe('secret');
            expect((await stat(file)).mode & 0o777).toBe(0o600);

            await chmod(file, 0o644);
            await writeFile(file, 'old secret');
            await writePrivateFile(file, 'new secret');
            expect(await readFile(file, 'utf8')).toBe('new secret');
            expect((await stat(file)).mode & 0o777).toBe(0o600);
        } finally {
            await rm(root, { recursive: true, force: true });
        }
    });
});

import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildCodexInputItems, isImageMimeType } from './inputBuilder';

describe('buildCodexInputItems', () => {
    it('builds local image items, document references, final text, and cleanup', async () => {
        const cwd = await mkdtemp(join(tmpdir(), 'happy-codex-input-'));
        try {
            const prepared = await buildCodexInputItems({
                cwd,
                prompt: 'Please review these attachments.',
                attachments: [
                    { data: new Uint8Array([1, 2, 3]), mimeType: 'image/png', name: '../photo.png' },
                    { data: new Uint8Array([4, 5]), mimeType: 'application/pdf', name: 'report final.pdf' },
                ],
            });

            expect(prepared.input).toHaveLength(3);
            expect(prepared.input[0]).toMatchObject({ type: 'localImage' });
            expect(prepared.input[1]).toMatchObject({
                type: 'text',
                text: expect.stringContaining('MIME type: application/pdf'),
            });
            expect(prepared.input[1]).toMatchObject({
                text: expect.stringContaining('Name: report final.pdf'),
            });
            expect(prepared.input[1]).toMatchObject({
                text: expect.stringContaining('Readable path: .'),
            });
            expect(prepared.input[2]).toEqual({ type: 'text', text: 'Please review these attachments.' });

            const imagePath = prepared.input[0].type === 'localImage' ? prepared.input[0].path : '';
            expect(imagePath).toContain('.happy-attachments');
            expect(imagePath).not.toContain('..');
            await expect(readFile(imagePath)).resolves.toEqual(Buffer.from([1, 2, 3]));

            const imageStat = await stat(imagePath);
            expect(imageStat.mode & 0o777).toBe(0o600);

            await prepared.cleanup();
            await expect(readFile(imagePath)).rejects.toThrow();
        } finally {
            await rm(cwd, { recursive: true, force: true });
        }
    });

    it('uses a single text input when there are no attachments', async () => {
        const prepared = await buildCodexInputItems({
            cwd: process.cwd(),
            prompt: 'hello',
        });

        expect(prepared.input).toEqual([{ type: 'text', text: 'hello' }]);
        await expect(prepared.cleanup()).resolves.toBeUndefined();
    });

    it('detects image MIME types case-insensitively', () => {
        expect(isImageMimeType('image/jpeg')).toBe(true);
        expect(isImageMimeType('IMAGE/PNG')).toBe(true);
        expect(isImageMimeType('application/pdf')).toBe(false);
    });
});

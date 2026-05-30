import { describe, expect, it, vi } from 'vitest';
import { fileToAttachmentPreview } from './pasteImages.web';

describe('fileToAttachmentPreview', () => {
    it('converts non-image files without trying to generate image metadata', async () => {
        const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-file');
        const generateThumbhash = vi.fn();
        const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });

        const preview = await fileToAttachmentPreview(file, generateThumbhash);

        expect(preview).toEqual({
            uri: 'blob:test-file',
            width: 0,
            height: 0,
            size: 5,
            name: 'notes.txt',
            mimeType: 'text/plain',
        });
        expect(generateThumbhash).not.toHaveBeenCalled();

        createObjectURL.mockRestore();
    });
});

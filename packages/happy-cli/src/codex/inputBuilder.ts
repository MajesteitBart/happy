import { mkdir, rm, writeFile } from 'node:fs/promises';
import { basename, join, relative, sep } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { PendingAttachment } from '@/utils/MessageQueue2';
import type { InputItem } from './codexAppServerTypes';

const ATTACHMENT_ROOT_DIR = '.happy-attachments';

export type PreparedCodexInput = {
    input: InputItem[];
    cleanup: () => Promise<void>;
};

export async function buildCodexInputItems(opts: {
    prompt: string;
    attachments?: PendingAttachment[];
    cwd: string;
}): Promise<PreparedCodexInput> {
    const attachments = opts.attachments ?? [];
    if (attachments.length === 0) {
        return {
            input: [{ type: 'text', text: opts.prompt }],
            cleanup: async () => { },
        };
    }

    const rootDir = join(opts.cwd, ATTACHMENT_ROOT_DIR);
    const turnDir = join(rootDir, `turn-${Date.now()}-${randomUUID()}`);
    await mkdir(turnDir, { recursive: true, mode: 0o700 });

    const input: InputItem[] = [];

    for (const [index, attachment] of attachments.entries()) {
        const filename = safeAttachmentFilename(attachment.name, index);
        const absolutePath = join(turnDir, filename);
        await writeFile(absolutePath, attachment.data, { mode: 0o600 });

        if (isImageMimeType(attachment.mimeType)) {
            input.push({ type: 'localImage', path: absolutePath });
        } else {
            input.push({
                type: 'text',
                text: formatDocumentAttachmentReference({
                    name: attachment.name,
                    mimeType: attachment.mimeType,
                    path: relativePathForPrompt(opts.cwd, absolutePath),
                }),
            });
        }
    }

    input.push({ type: 'text', text: opts.prompt });

    return {
        input,
        cleanup: async () => {
            await rm(turnDir, { recursive: true, force: true });
        },
    };
}

export function isImageMimeType(mimeType: string): boolean {
    return mimeType.toLowerCase().startsWith('image/');
}

function safeAttachmentFilename(name: string, index: number): string {
    const base = basename(name || `attachment-${index + 1}`)
        .replace(/[^A-Za-z0-9._-]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 120);
    return `${index + 1}-${base || `attachment-${index + 1}`}`;
}

function relativePathForPrompt(cwd: string, absolutePath: string): string {
    const rel = relative(cwd, absolutePath);
    if (!rel || rel.startsWith('..') || rel.split(sep).includes('..')) {
        return absolutePath;
    }
    return `.${sep}${rel}`;
}

function formatDocumentAttachmentReference(opts: {
    name: string;
    mimeType: string;
    path: string;
}): string {
    return [
        'Attached file:',
        `- Name: ${opts.name}`,
        `- MIME type: ${opts.mimeType || 'application/octet-stream'}`,
        `- Readable path: ${opts.path}`,
    ].join('\n');
}

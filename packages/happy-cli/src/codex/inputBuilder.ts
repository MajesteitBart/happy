import { mkdir, rm, writeFile } from 'node:fs/promises';
import { basename, join, relative, sep } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { PendingAttachment } from '@/utils/MessageQueue2';
import type { CodexSkill, InputItem } from './codexAppServerTypes';

const ATTACHMENT_ROOT_DIR = '.happy-attachments';

export type PreparedCodexInput = {
    input: InputItem[];
    cleanup: () => Promise<void>;
};

export async function buildCodexInputItems(opts: {
    prompt: string;
    attachments?: PendingAttachment[];
    skills?: CodexSkill[];
    cwd: string;
}): Promise<PreparedCodexInput> {
    const attachments = opts.attachments ?? [];
    const skillInput = extractSkillInputItems(opts.prompt, opts.skills ?? []);
    if (attachments.length === 0 && skillInput.items.length === 0) {
        return {
            input: [{ type: 'text', text: opts.prompt }],
            cleanup: async () => { },
        };
    }

    const rootDir = join(opts.cwd, ATTACHMENT_ROOT_DIR);
    const turnDir = attachments.length > 0
        ? join(rootDir, `turn-${Date.now()}-${randomUUID()}`)
        : null;
    if (turnDir) {
        await mkdir(turnDir, { recursive: true, mode: 0o700 });
    }

    const input: InputItem[] = [];
    input.push(...skillInput.items);

    for (const [index, attachment] of attachments.entries()) {
        const filename = safeAttachmentFilename(attachment.name, index);
        const absolutePath = join(turnDir!, filename);
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

    input.push({ type: 'text', text: skillInput.prompt });

    return {
        input,
        cleanup: async () => {
            if (turnDir) {
                await rm(turnDir, { recursive: true, force: true });
            }
        },
    };
}

export function isImageMimeType(mimeType: string): boolean {
    return mimeType.toLowerCase().startsWith('image/');
}

export function extractSkillInputItems(
    prompt: string,
    skills: CodexSkill[],
): { prompt: string; items: InputItem[] } {
    if (skills.length === 0) return { prompt, items: [] };

    const skillsByName = new Map(skills.map(skill => [skill.name, skill]));
    const items: InputItem[] = [];
    const lines = prompt.split('\n');
    let inFence = false;

    const nextLines = lines.map((line) => {
        if (line.trimStart().startsWith('```')) {
            inFence = !inFence;
            return line;
        }
        if (inFence) return line;

        const match = line.match(/^(\s*)\$([A-Za-z0-9_-]+)(?=\s|$)(.*)$/);
        if (!match) return line;

        const [, indent, name, rest] = match;
        const skill = skillsByName.get(name);
        if (!skill?.path) return line;

        items.push({ type: 'skill', name: skill.name, path: skill.path });
        return `${indent}${rest.trimStart()}`;
    });

    const nextPrompt = nextLines.join('\n');
    return { prompt: items.length > 0 ? nextPrompt.trim() : prompt, items };
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

/**
 * Parses Claude Agent SDK local-slash-command wrapper messages.
 *
 * The SDK injects synthetic user messages for slash commands. Those wrappers
 * are protocol detail; UI and sync code should treat them as structured command
 * events instead of rendering the raw XML-like body.
 */

export type LocalCommandMessage =
    | { kind: 'caveat' }
    | { kind: 'command-run'; commandName: string; args?: string }
    | { kind: 'text'; text: string };

const CAVEAT_RE = /^\s*<local-command-caveat>[\s\S]*?<\/local-command-caveat>\s*$/;
const COMMAND_NAME_RE = /<command-name>\s*\/?([^<]+?)\s*<\/command-name>/;
const COMMAND_TAG_RE = /<(command-name|command-args)>[\s\S]*?<\/\1>/g;
const COMMAND_MESSAGE_OPEN = '<command-message>';
const COMMAND_MESSAGE_CLOSE = '</command-message>';

type Range = {
    start: number;
    end: number;
};

function findTagRanges(text: string, tagPattern: RegExp): Range[] {
    const ranges: Range[] = [];
    tagPattern.lastIndex = 0;
    for (let match = tagPattern.exec(text); match; match = tagPattern.exec(text)) {
        ranges.push({ start: match.index, end: match.index + match[0].length });
    }
    return ranges;
}

function findCommandMessageRanges(text: string): Range[] {
    const ranges: Range[] = [];
    let searchIndex = 0;
    while (true) {
        const start = text.indexOf(COMMAND_MESSAGE_OPEN, searchIndex);
        if (start === -1) break;

        const nextCommandName = text.indexOf('<command-name>', start + COMMAND_MESSAGE_OPEN.length);
        const searchLimit = nextCommandName === -1 ? text.length : nextCommandName;
        const lastCloseBeforeName = text.lastIndexOf(COMMAND_MESSAGE_CLOSE, searchLimit);
        const firstCloseAfterStart = text.indexOf(COMMAND_MESSAGE_CLOSE, start + COMMAND_MESSAGE_OPEN.length);

        let end: number;
        if (lastCloseBeforeName > start) {
            end = lastCloseBeforeName + COMMAND_MESSAGE_CLOSE.length;
        } else if (firstCloseAfterStart !== -1) {
            end = firstCloseAfterStart + COMMAND_MESSAGE_CLOSE.length;
        } else {
            end = searchLimit;
        }

        ranges.push({ start, end });
        searchIndex = Math.max(end, start + COMMAND_MESSAGE_OPEN.length);
    }
    return ranges;
}

function stripRanges(text: string, ranges: Range[]): string {
    if (ranges.length === 0) {
        return text;
    }
    const sorted = [...ranges].sort((a, b) => a.start - b.start);
    const merged: Range[] = [];
    for (const range of sorted) {
        const previous = merged[merged.length - 1];
        if (previous && range.start <= previous.end) {
            previous.end = Math.max(previous.end, range.end);
        } else {
            merged.push({ ...range });
        }
    }

    let result = '';
    let cursor = 0;
    for (const range of merged) {
        result += text.slice(cursor, range.start);
        cursor = range.end;
    }
    result += text.slice(cursor);
    return result;
}

function getCommandArgs(text: string): string | undefined {
    const argsStartTag = '<command-args>';
    const argsEndTag = '</command-args>';
    const start = text.indexOf(argsStartTag);
    if (start === -1) {
        return undefined;
    }
    const contentStart = start + argsStartTag.length;
    const end = text.indexOf(argsEndTag, contentStart);
    const rawArgs = text.slice(contentStart, end === -1 ? text.length : end).trim();
    return rawArgs.length > 0 ? rawArgs : undefined;
}

export function parseLocalCommandMessage(text: string): LocalCommandMessage {
    if (CAVEAT_RE.test(text)) {
        return { kind: 'caveat' };
    }

    const nameMatch = text.match(COMMAND_NAME_RE);
    if (nameMatch) {
        const args = getCommandArgs(text);
        const stripped = stripRanges(text, [
            ...findCommandMessageRanges(text),
            ...findTagRanges(text, COMMAND_TAG_RE),
        ]).trim();

        if (stripped.length === 0) {
            return {
                kind: 'command-run',
                commandName: nameMatch[1],
                args,
            };
        }

        return { kind: 'text', text: stripped };
    }

    return { kind: 'text', text };
}

const SLASH_COMMAND_RE = /^\/[a-zA-Z][\w:-]*(?:\s[\s\S]*)?$/;

export function isUserSlashCommandEcho(text: string, hasLocalId: boolean): boolean {
    if (!hasLocalId) {
        return false;
    }
    const trimmed = text.trim();
    if (!SLASH_COMMAND_RE.test(trimmed)) {
        return false;
    }
    return parseLocalCommandMessage(trimmed).kind === 'text';
}

/**
 * Parses Claude Agent SDK's local-slash-command wrapper messages.
 *
 * When a `/foo` command runs, the SDK injects synthetic user messages whose
 * content is XML-like tags such as:
 *   <local-command-caveat>...</local-command-caveat>
 *   <command-message>foo</command-message><command-name>/foo</command-name>
 *   <command-message>foo</command-message><command-name>/foo</command-name><command-args>the args</command-args>
 *
 * Rendered through markdown unchanged they look like raw HTML in the chat —
 * and because the old parser only stripped <command-message>/<command-name>,
 * any command WITH arguments left a non-empty <command-args> tag behind, so
 * it fell through to plain text instead of collapsing to a chip (looked like
 * the user's message duplicated, and the "command ran" chip never showed).
 *
 * We strip / collapse them into structured intents the renderer can show
 * (or hide) cleanly, carrying the args out separately so the renderer can
 * display them as the user's actual prompt.
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

        // If the message is just the command wrappers (after stripping all of
        // them only whitespace remains), collapse to a chip. The args, if any,
        // are surfaced separately so the renderer can show them as the user's
        // actual prompt rather than as raw XML.
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
        // Mixed content: keep the surrounding text, drop the tags.
        return { kind: 'text', text: stripped };
    }

    return { kind: 'text', text };
}

// A pure slash-command invocation: starts with `/`, a command token
// (letters, digits, `:`, `-`, `_`), optionally followed by whitespace +
// args. Deliberately strict so paths like `/etc/hosts` or a lone `/`
// do NOT match.
const SLASH_COMMAND_RE = /^\/[a-zA-Z][\w:-]*(?:\s[\s\S]*)?$/;

/**
 * True when this user-text message is the user's OWN echoed slash-command
 * input (e.g. `/superpowers:brainstorming do the thing`) that the Claude
 * Agent SDK will re-emit as a `<command-message>/<command-name>` wrapper.
 *
 * Happy shows the user's sent message optimistically (it carries a
 * `localId`); the SDK then injects the canonical wrapper (no `localId`,
 * rendered as a chip). Showing both looks like a duplicate, so we hide
 * the raw echo and let the wrapper chip stand in — matching how the
 * Claude Code terminal renders slash commands.
 *
 * Gated on `hasLocalId` so we only ever hide a message the user actually
 * sent from Happy, never an agent/SDK-originated one.
 */
export function isUserSlashCommandEcho(text: string, hasLocalId: boolean): boolean {
    if (!hasLocalId) {
        return false;
    }
    const trimmed = text.trim();
    if (!SLASH_COMMAND_RE.test(trimmed)) {
        return false;
    }
    // Guard: a real wrapper message also contains <command-name>; never
    // treat that as a raw echo.
    return parseLocalCommandMessage(trimmed).kind === 'text';
}

import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAllCommands, searchCommands } from './suggestionCommands';

const mockState = vi.hoisted((): { sessions: Record<string, unknown> } => ({ sessions: {} }));

vi.mock('./storage', () => ({
    storage: {
        getState: () => mockState,
    },
}));

function putSession(sessionId: string, slashCommands?: string[]) {
    const session = {
        id: sessionId,
        seq: 0,
        createdAt: 0,
        updatedAt: 0,
        active: true,
        activeAt: 0,
        metadata: {
            path: '/tmp/project',
            host: 'host',
            slashCommands,
            homeDir: '/home/user',
            happyHomeDir: '/home/user/.happy',
        },
        metadataVersion: 1,
        agentState: null,
        agentStateVersion: 0,
        thinking: false,
        thinkingAt: 0,
        presence: 'online',
    };

    mockState.sessions = {
        [sessionId]: session,
    };
}

describe('suggestionCommands', () => {
    afterEach(() => {
        mockState.sessions = {};
    });

    it('returns no commands when session metadata is missing', () => {
        expect(getAllCommands('missing')).toEqual([]);
    });

    it('returns no commands when slashCommands is empty', () => {
        putSession('s1', []);
        expect(getAllCommands('s1')).toEqual([]);
    });

    it('returns only live slash commands from session metadata', async () => {
        putSession('s1', ['compact', 'clear']);

        expect(getAllCommands('s1')).toEqual([
            { command: 'compact', description: 'Compact the conversation history' },
            { command: 'clear', description: 'Clear the conversation' },
        ]);
        await expect(searchCommands('s1', 'cle')).resolves.toEqual([
            { command: 'clear', description: 'Clear the conversation' },
        ]);
    });

    it('filters ignored commands from provider metadata', () => {
        putSession('s1', ['compact', 'login', 'logout', 'clear']);

        expect(getAllCommands('s1')).toEqual([
            { command: 'compact', description: 'Compact the conversation history' },
            { command: 'clear', description: 'Clear the conversation' },
        ]);
    });
});

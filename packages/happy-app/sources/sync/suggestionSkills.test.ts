import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAllCodexSkills, searchCodexSkills } from './suggestionSkills';

const mockState = vi.hoisted((): { sessions: Record<string, unknown> } => ({ sessions: {} }));

vi.mock('./storage', () => ({
    storage: {
        getState: () => mockState,
    },
}));

function putSession(sessionId: string) {
    mockState.sessions = {
        [sessionId]: {
            metadata: {
                codexSkills: [
                    { name: 'review', description: 'Review code', path: '/skills/review/SKILL.md' },
                    { name: 'explain', description: 'Explain code', path: '/skills/explain/SKILL.md' },
                    { name: 'review', description: 'Duplicate should collapse', path: '/duplicate' },
                ],
            },
        },
    };
}

describe('suggestionSkills', () => {
    afterEach(() => {
        mockState.sessions = {};
    });

    it('returns no skills without Codex skill metadata', () => {
        expect(getAllCodexSkills('missing')).toEqual([]);
    });

    it('returns deduplicated Codex skills from metadata', () => {
        putSession('s1');
        expect(getAllCodexSkills('s1')).toEqual([
            { name: 'review', description: 'Duplicate should collapse', path: '/duplicate' },
            { name: 'explain', description: 'Explain code', path: '/skills/explain/SKILL.md' },
        ]);
    });

    it('fuzzy-searches skill name and description', async () => {
        putSession('s1');
        await expect(searchCodexSkills('s1', 'expla')).resolves.toEqual([
            { name: 'explain', description: 'Explain code', path: '/skills/explain/SKILL.md' },
        ]);
    });
});

import Fuse from 'fuse.js';
import { storage } from './storage';

export interface CodexSkillItem {
    name: string;
    description?: string;
    path?: string;
}

interface SearchOptions {
    limit?: number;
    threshold?: number;
}

function getSkillsFromSession(sessionId: string): CodexSkillItem[] {
    const session = storage.getState().sessions[sessionId];
    const skills = session?.metadata?.codexSkills;
    if (!Array.isArray(skills)) return [];

    const byName = new Map<string, CodexSkillItem>();
    for (const skill of skills) {
        if (!skill.name) continue;
        byName.set(skill.name, skill);
    }
    return [...byName.values()];
}

export async function searchCodexSkills(
    sessionId: string,
    query: string,
    options: SearchOptions = {},
): Promise<CodexSkillItem[]> {
    const { limit = 10, threshold = 0.3 } = options;
    const skills = getSkillsFromSession(sessionId);

    if (!query || query.trim().length === 0) {
        return skills.slice(0, limit);
    }

    const fuse = new Fuse(skills, {
        keys: [
            { name: 'name', weight: 0.7 },
            { name: 'description', weight: 0.3 },
        ],
        threshold,
        includeScore: true,
        shouldSort: true,
        minMatchCharLength: 1,
        ignoreLocation: true,
        useExtendedSearch: true,
    });

    return fuse.search(query, { limit }).map(result => result.item);
}

export function getAllCodexSkills(sessionId: string): CodexSkillItem[] {
    return getSkillsFromSession(sessionId);
}

import { describe, expect, it } from 'vitest';
import { MetadataSchema } from './storageTypes';

describe('MetadataSchema', () => {
    it('preserves dedicated Codex skill metadata separately from generic skills', () => {
        const metadata = MetadataSchema.parse({
            path: '/tmp/project',
            host: 'local-machine',
            skills: ['claude-skill'],
            codexSkills: [
                {
                    name: 'review',
                    description: 'Review code',
                    path: '/skills/review/SKILL.md',
                },
            ],
        });

        expect(metadata.skills).toEqual(['claude-skill']);
        expect(metadata.codexSkills).toEqual([
            {
                name: 'review',
                description: 'Review code',
                path: '/skills/review/SKILL.md',
            },
        ]);
    });

    it('preserves archive lifecycle metadata', () => {
        const metadata = MetadataSchema.parse({
            path: '/tmp/project',
            host: 'local-machine',
            startedBy: 'daemon',
            startedFromDaemon: true,
            lifecycleState: 'archived',
            lifecycleStateSince: 123,
            archivedBy: 'cli',
            archiveReason: 'User terminated',
        });

        expect(metadata.startedBy).toBe('daemon');
        expect(metadata.startedFromDaemon).toBe(true);
        expect(metadata.lifecycleState).toBe('archived');
        expect(metadata.lifecycleStateSince).toBe(123);
        expect(metadata.archivedBy).toBe('cli');
        expect(metadata.archiveReason).toBe('User terminated');
    });
});

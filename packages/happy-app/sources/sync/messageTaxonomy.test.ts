import { describe, expect, it } from 'vitest';
import {
    classifyCommand,
    classifySystemEvent,
    getCommandDisplayText,
    getSystemEventDisplayText,
} from './messageTaxonomy';

describe('messageTaxonomy', () => {
    it('classifies normal slash commands', () => {
        const command = classifyCommand('/compact');

        expect(command).toEqual({
            type: 'command',
            name: 'compact',
            args: undefined,
        });
        expect(getCommandDisplayText(command)).toBe('/compact');
    });

    it('classifies skill invocations and keeps safe args', () => {
        const command = classifyCommand('/skill:planning', 'happy safety workstreams');

        expect(command).toEqual({
            type: 'skill-invocation',
            name: 'skill:planning',
            args: 'happy safety workstreams',
        });
        expect(getCommandDisplayText(command)).toBe('/skill:planning happy safety workstreams');
    });

    it('classifies compaction events as collapsed system events', () => {
        const event = classifySystemEvent({
            type: 'message',
            message: 'Compaction completed',
        });

        expect(event).toEqual({
            type: 'compaction',
            label: 'Session compacted',
            collapsed: true,
        });
        expect(event ? getSystemEventDisplayText(event) : null).toBe('Session compacted');
    });
});

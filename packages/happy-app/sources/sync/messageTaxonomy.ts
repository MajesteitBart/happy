import { AgentEvent } from './typesRaw';

export type CommandMessageType = 'command' | 'skill-invocation';

export type CommandMessagePayload = {
    type: CommandMessageType;
    name: string;
    args?: string;
};

export type SystemEventPayload = {
    type: 'compaction' | 'internal-summary' | 'system-event';
    label: string;
    detail?: string;
    collapsed: boolean;
};

export function classifyCommand(name: string, args?: string): CommandMessagePayload {
    const normalizedName = name.replace(/^\/+/, '').trim();
    return {
        type: normalizedName.startsWith('skill:') ? 'skill-invocation' : 'command',
        name: normalizedName,
        args,
    };
}

export function getCommandDisplayText(command: CommandMessagePayload) {
    const prefix = `/${command.name}`;
    return command.args ? `${prefix} ${command.args}` : prefix;
}

export function classifySystemEvent(event: AgentEvent): SystemEventPayload | null {
    if (event.type !== 'message') {
        return null;
    }

    if (event.message === 'Compaction completed') {
        return {
            type: 'compaction',
            label: 'Session compacted',
            collapsed: true,
        };
    }

    if (event.message === 'Context was reset') {
        return {
            type: 'system-event',
            label: 'Context reset',
            collapsed: true,
        };
    }

    return null;
}

export function getSystemEventDisplayText(event: SystemEventPayload) {
    return event.detail ? `${event.label}: ${event.detail}` : event.label;
}

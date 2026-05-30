import * as z from 'zod';

export const lifecycleStateSchema = z.enum([
  'created',
  'local-active',
  'remote-active',
  'aborting',
  'recovering',
  'completed',
  'error',
  'archived',
]);
export type LifecycleState = z.infer<typeof lifecycleStateSchema>;

export const lifecycleEventTypeSchema = z.enum([
  'created',
  'mode-changed',
  'abort-requested',
  'turn-completed',
  'turn-failed',
  'process-exited',
  'socket-disconnected',
  'socket-reconnected',
  'recovering',
  'recovered',
  'archived',
]);
export type LifecycleEventType = z.infer<typeof lifecycleEventTypeSchema>;

export const lifecycleInputOwnerSchema = z.enum(['local', 'remote', 'none', 'unknown']);
export type LifecycleInputOwner = z.infer<typeof lifecycleInputOwnerSchema>;

export const lifecycleProcessOwnerSchema = z.enum(['terminal', 'daemon', 'tmux', 'unknown']);
export type LifecycleProcessOwner = z.infer<typeof lifecycleProcessOwnerSchema>;

export const lifecycleProcessLivenessSchema = z.enum(['connected', 'disconnected', 'exited', 'restarted', 'unknown']);
export type LifecycleProcessLiveness = z.infer<typeof lifecycleProcessLivenessSchema>;

export const lifecycleTurnStateSchema = z.enum(['idle', 'thinking', 'aborting', 'completed', 'cancelled', 'failed', 'unknown']);
export type LifecycleTurnState = z.infer<typeof lifecycleTurnStateSchema>;

export const lifecycleReasonSchema = z.enum([
  'session-created',
  'local-to-remote',
  'remote-to-local',
  'user-abort',
  'permission-abort',
  'socket-disconnect',
  'socket-reconnect',
  'provider-exit',
  'provider-error',
  'daemon-restart',
  'archive-requested',
  'seq-gap',
  'mode-switch',
  'unknown',
]);
export type LifecycleReason = z.infer<typeof lifecycleReasonSchema>;

export const lifecycleProviderSchema = z.enum(['claude', 'codex', 'gemini', 'openclaw', 'opencode', 'unknown']);
export type LifecycleProvider = z.infer<typeof lifecycleProviderSchema>;

export const lifecycleStartedBySchema = z.enum(['terminal', 'daemon', 'unknown']);
export type LifecycleStartedBy = z.infer<typeof lifecycleStartedBySchema>;

export const lifecycleModeSchema = z.enum(['local', 'remote']);
export type LifecycleMode = z.infer<typeof lifecycleModeSchema>;

export const lifecycleEventSchema = z.object({
  version: z.literal(1),
  type: lifecycleEventTypeSchema,
  state: lifecycleStateSchema,
  at: z.number().int().nonnegative(),
  inputOwner: lifecycleInputOwnerSchema.optional(),
  processOwner: lifecycleProcessOwnerSchema.optional(),
  processLiveness: lifecycleProcessLivenessSchema.optional(),
  turnState: lifecycleTurnStateSchema.optional(),
  reason: lifecycleReasonSchema.optional(),
  mode: lifecycleModeSchema.optional(),
  seq: z.number().int().nonnegative().optional(),
  lastAppliedSeq: z.number().int().nonnegative().optional(),
  metadataVersion: z.number().int().nonnegative().optional(),
  agentStateVersion: z.number().int().nonnegative().optional(),
  provider: lifecycleProviderSchema.optional(),
  startedBy: lifecycleStartedBySchema.optional(),
}).strict();
export type LifecycleEvent = z.infer<typeof lifecycleEventSchema>;

export type LifecycleEventInput = Omit<LifecycleEvent, 'version' | 'at'> & {
  at?: number;
};

export function createLifecycleEvent(input: LifecycleEventInput): LifecycleEvent {
  return lifecycleEventSchema.parse({
    version: 1,
    at: Date.now(),
    ...input,
  });
}

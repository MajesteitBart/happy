import { describe, expect, it } from 'vitest';
import { createLifecycleEvent, lifecycleEventSchema } from './lifecycle';

describe('lifecycleEventSchema', () => {
  it('accepts content-free lifecycle events', () => {
    const event = createLifecycleEvent({
      type: 'mode-changed',
      state: 'remote-active',
      inputOwner: 'remote',
      processOwner: 'terminal',
      processLiveness: 'connected',
      turnState: 'idle',
      reason: 'local-to-remote',
      mode: 'remote',
      lastAppliedSeq: 42,
      metadataVersion: 3,
      agentStateVersion: 7,
      provider: 'codex',
      startedBy: 'terminal',
    });

    expect(lifecycleEventSchema.parse(event)).toEqual(event);
  });

  it('rejects content and secret-shaped diagnostic fields', () => {
    const result = lifecycleEventSchema.safeParse({
      version: 1,
      type: 'process-exited',
      state: 'error',
      at: Date.now(),
      reason: 'provider-error',
      message: 'raw prompt or provider output',
      path: '/private/project',
      token: 'secret',
    });

    expect(result.success).toBe(false);
  });

  it('rejects unknown lifecycle reasons', () => {
    const result = lifecycleEventSchema.safeParse({
      version: 1,
      type: 'recovering',
      state: 'recovering',
      at: Date.now(),
      reason: 'free-form-string',
    });

    expect(result.success).toBe(false);
  });
});

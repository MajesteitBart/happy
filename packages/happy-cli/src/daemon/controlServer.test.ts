import { afterEach, describe, expect, it } from 'vitest';
import { startDaemonControlServer } from './controlServer';
import type { Metadata } from '@/api/types';
import type { SpawnSessionOptions, SpawnSessionResult } from '@/modules/common/registerCommonHandlers';
import type { TrackedSession } from './types';

describe('daemon control server authorization', () => {
  let stopServer: (() => Promise<void>) | undefined;

  afterEach(async () => {
    await stopServer?.();
    stopServer = undefined;
  });

  async function startServer(options: {
    getChildren?: () => TrackedSession[];
  } = {}) {
    const server = await startDaemonControlServer({
      controlToken: 'test-control-token',
      getChildren: options.getChildren ?? (() => []),
      stopSession: () => true,
      spawnSession: async (_options: SpawnSessionOptions): Promise<SpawnSessionResult> => ({
        type: 'success',
        sessionId: 'spawned-test-session',
      }),
      requestShutdown: () => undefined,
      onHappySessionWebhook: (_sessionId: string, _metadata: Metadata) => undefined,
    });
    stopServer = server.stop;
    return server;
  }

  it('rejects control requests without the bearer token', async () => {
    const { port } = await startServer();

    const response = await fetch(`http://127.0.0.1:${port}/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });

    expect(response.status).toBe(401);
  });

  it('accepts control requests with the bearer token', async () => {
    const { port } = await startServer();

    const response = await fetch(`http://127.0.0.1:${port}/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-control-token',
        'X-Happy-Daemon-Control': 'true',
      },
      body: '{}',
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ children: [] });
  });

  it('rejects browser-like requests missing the daemon control header', async () => {
    const { port } = await startServer();

    const response = await fetch(`http://127.0.0.1:${port}/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-control-token',
      },
      body: '{}',
    });

    expect(response.status).toBe(403);
  });

  it('lists registered remote-created sessions for local daemon handoff', async () => {
    const { port } = await startServer({
      getChildren: () => [{
        startedBy: 'daemon',
        happySessionId: 'remote-session-1',
        pid: 1234,
      }]
    });

    const response = await fetch(`http://127.0.0.1:${port}/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-control-token',
        'X-Happy-Daemon-Control': 'true',
      },
      body: '{}',
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      children: [{
        startedBy: 'daemon',
        happySessionId: 'remote-session-1',
        pid: 1234,
      }]
    });
  });
});

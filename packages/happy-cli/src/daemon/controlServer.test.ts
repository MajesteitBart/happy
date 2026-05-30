import { afterEach, describe, expect, it } from 'vitest';
import { startDaemonControlServer } from './controlServer';
import type { Metadata } from '@/api/types';
import type { SpawnSessionOptions, SpawnSessionResult } from '@/modules/common/registerCommonHandlers';

describe('daemon control server authorization', () => {
  let stopServer: (() => Promise<void>) | undefined;

  afterEach(async () => {
    await stopServer?.();
    stopServer = undefined;
  });

  async function startServer() {
    const server = await startDaemonControlServer({
      controlToken: 'test-control-token',
      getChildren: () => [],
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
});

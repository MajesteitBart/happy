import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  readCredentials: vi.fn(),
  createApiClient: vi.fn(),
  registerVendorToken: vi.fn(),
  authenticateCodex: vi.fn(),
}));

vi.mock('@/persistence', () => ({
  readCredentials: mocks.readCredentials,
}));

vi.mock('@/api/api', () => ({
  ApiClient: {
    create: mocks.createApiClient,
  },
}));

vi.mock('./connect/authenticateCodex', () => ({
  authenticateCodex: mocks.authenticateCodex,
}));

vi.mock('./connect/authenticateClaude', () => ({
  authenticateClaude: vi.fn(),
}));

vi.mock('./connect/authenticateGemini', () => ({
  authenticateGemini: vi.fn(),
}));

vi.mock('./connect/utils', () => ({
  decodeJwtPayload: vi.fn(() => ({})),
}));

describe('connect command', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let exitSpy: any;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(((code?: string | number | null) => {
      throw new Error(`process.exit:${code ?? 0}`);
    }) as never);

    mocks.createApiClient.mockResolvedValue({
      registerVendorToken: mocks.registerVendorToken,
    });
    mocks.authenticateCodex.mockResolvedValue({
      id_token: 'id-token',
      access_token: 'access-token',
      refresh_token: 'refresh-token',
      account_id: 'account-id',
    });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('keeps happy connect codex on the local subscription-auth guidance path by default', async () => {
    const { handleConnectCommand } = await import('./connect');

    await handleConnectCommand(['codex']);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Default path: local Codex subscription auth'),
    );
    expect(mocks.readCredentials).not.toHaveBeenCalled();
    expect(mocks.authenticateCodex).not.toHaveBeenCalled();
    expect(mocks.registerVendorToken).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('requires an explicit flag before uploading Codex OAuth material', async () => {
    mocks.readCredentials.mockResolvedValue({
      token: 'happy-token',
      encryption: { type: 'legacy', secret: new Uint8Array(32) },
    });

    const { handleConnectCommand } = await import('./connect');

    await expect(handleConnectCommand(['codex', '--upload-token'])).rejects.toThrow('process.exit:0');

    expect(mocks.authenticateCodex).toHaveBeenCalled();
    expect(mocks.registerVendorToken).toHaveBeenCalledWith('openai', {
      oauth: {
        id_token: 'id-token',
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        account_id: 'account-id',
      },
    });
  });
});

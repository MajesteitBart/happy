import { describe, expect, it } from 'vitest';
import { getAvailableModelCodes, getCatalogModelCodes } from './modelCatalog';

describe('modelCatalog', () => {
  it('falls back when the catalog is missing', async () => {
    await expect(getAvailableModelCodes('gemini', {
      fetchCatalog: async () => null,
    })).resolves.toEqual([
      'gemini-3.1-pro-preview',
      'gemini-3-flash-preview',
      'gemini-3.1-flash-lite-preview',
      'gemini-2.5-pro',
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
    ]);
  });

  it('ignores stale catalogs', () => {
    expect(getCatalogModelCodes({
      version: 1,
      providers: {
        codex: [{ code: 'gpt-future', value: 'gpt future' }],
      },
    }, 'codex')).toEqual([]);
  });

  it('uses newly added catalog models and filters unavailable entries', async () => {
    await expect(getAvailableModelCodes('codex', {
      fetchCatalog: async () => ({
        version: 2,
        providers: {
          codex: [
            { code: 'default', value: 'default model' },
            { code: 'gpt-future', value: 'gpt future' },
            { code: 'gpt-disabled', value: 'gpt disabled', available: false },
          ],
        },
      }),
    })).resolves.toEqual(['default', 'gpt-future']);
  });
});

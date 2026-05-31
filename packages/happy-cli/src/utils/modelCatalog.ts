import { configuration } from '@/configuration';

export const MIN_SUPPORTED_MODEL_CATALOG_VERSION = 2;

export type ModelCatalogEntry = {
  code?: string;
  value?: string;
  description?: string | null;
  available?: boolean;
  default?: boolean;
};

export type ModelCatalog = {
  version?: number;
  providers?: Record<string, ModelCatalogEntry[]>;
  defaults?: Record<string, string>;
};

export const FALLBACK_MODEL_CODES: Record<string, string[]> = {
  claude: ['default', 'opus', 'sonnet', 'haiku'],
  codex: ['default', 'gpt-5.5', 'gpt-5.4', 'gpt-5.3-codex', 'gpt-5.2-codex', 'gpt-5.1-codex-max', 'gpt-5.2', 'gpt-5.1-codex-mini'],
  gemini: ['gemini-3.1-pro-preview', 'gemini-3-flash-preview', 'gemini-3.1-flash-lite-preview', 'gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'],
  openclaw: ['default'],
};

export function getCatalogModelCodes(catalog: ModelCatalog | null | undefined, flavor: string): string[] {
  if (!catalog || (catalog.version ?? 0) < MIN_SUPPORTED_MODEL_CATALOG_VERSION) {
    return [];
  }

  return (catalog.providers?.[flavor] ?? [])
    .filter((entry) => entry.available !== false)
    .map((entry) => entry.code)
    .filter((code): code is string => typeof code === 'string' && code.length > 0);
}

export async function fetchServerModelCatalog(
  serverUrl = configuration.serverUrl,
  fetchImpl: typeof fetch = globalThis.fetch,
): Promise<ModelCatalog | null> {
  const normalizedServerUrl = serverUrl.replace(/\/+$/, '');
  const response = await fetchImpl(`${normalizedServerUrl}/v1/capabilities`, {
    method: 'GET',
    headers: {
      'X-Happy-Client': `cli/${configuration.currentCliVersion}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const body = await response.json();
  if (!body || typeof body !== 'object') {
    return null;
  }

  return (body as { modelCatalog?: ModelCatalog }).modelCatalog ?? null;
}

export async function getAvailableModelCodes(
  flavor: string,
  opts: {
    fetchCatalog?: () => Promise<ModelCatalog | null>;
  } = {},
): Promise<string[]> {
  let catalog: ModelCatalog | null = null;
  try {
    catalog = opts.fetchCatalog ? await opts.fetchCatalog() : await fetchServerModelCatalog();
  } catch {
    catalog = null;
  }

  const catalogCodes = getCatalogModelCodes(catalog, flavor);
  if (catalogCodes.length > 0) {
    return catalogCodes;
  }

  return FALLBACK_MODEL_CODES[flavor] ?? [];
}

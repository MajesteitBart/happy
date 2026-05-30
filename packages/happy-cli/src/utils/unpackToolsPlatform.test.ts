import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const {
  getPlatformDir,
  getToolsDir,
  SUPPORTED_PLATFORM_DIRS,
}: {
  getPlatformDir: () => string;
  getToolsDir: () => string;
  SUPPORTED_PLATFORM_DIRS: string[];
} = require('../../scripts/unpack-tools.cjs');

function mockRuntime(platform: NodeJS.Platform, arch: NodeJS.Architecture): void {
  vi.spyOn(os, 'platform').mockReturnValue(platform);
  vi.spyOn(os, 'arch').mockReturnValue(arch);
}

describe('unpack tools platform guards', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ['darwin', 'arm64', 'arm64-darwin'],
    ['darwin', 'x64', 'x64-darwin'],
    ['linux', 'arm64', 'arm64-linux'],
    ['linux', 'x64', 'x64-linux'],
    ['win32', 'arm64', 'arm64-win32'],
    ['win32', 'x64', 'x64-win32'],
  ] as const)('maps %s/%s to %s', (platform, arch, expected) => {
    mockRuntime(platform, arch);

    expect(getPlatformDir()).toBe(expected);
  });

  it('ships archives for Windows ARM64 instead of failing postinstall', () => {
    const toolsDir = getToolsDir();
    const archivesDir = path.join(toolsDir, 'archives');

    expect(fs.existsSync(path.join(archivesDir, 'difftastic-arm64-win32.tar.gz'))).toBe(true);
    expect(fs.existsSync(path.join(archivesDir, 'ripgrep-arm64-win32.tar.gz'))).toBe(true);
  });

  it('reports unsupported platform and architecture pairs clearly', () => {
    mockRuntime('linux', 's390x');

    expect(() => getPlatformDir()).toThrow('Unsupported platform: s390x-linux');
    expect(() => getPlatformDir()).toThrow(`Supported platforms: ${SUPPORTED_PLATFORM_DIRS.join(', ')}`);
  });
});

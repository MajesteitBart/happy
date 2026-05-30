import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('sensitive native permissions', () => {
    const appRoot = process.cwd();

    it('does not include unused location or calendar Expo modules', () => {
        const manifest = JSON.parse(readFileSync(resolve(appRoot, 'package.json'), 'utf-8')) as {
            dependencies?: Record<string, string>;
        };

        expect(manifest.dependencies).not.toHaveProperty('expo-location');
        expect(manifest.dependencies).not.toHaveProperty('expo-calendar');
    });

    it('does not configure unused location or calendar permission prompts', () => {
        const appConfig = readFileSync(resolve(appRoot, 'app.config.js'), 'utf-8');

        expect(appConfig).not.toContain('"expo-location"');
        expect(appConfig).not.toContain('"expo-calendar"');
        expect(appConfig).not.toContain('locationWhenInUsePermission');
        expect(appConfig).not.toContain('calendarPermission');
        expect(appConfig).not.toContain('improve AI quality');
    });
});

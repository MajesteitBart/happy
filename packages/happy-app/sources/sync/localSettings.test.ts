import { describe, expect, it } from 'vitest';
import { applyLocalSettings, localSettingsDefaults, localSettingsParse } from './localSettings';

describe('localSettings', () => {
    it('enables mobile markdown long-press copy by default', () => {
        expect(localSettingsDefaults.markdownCopyV2).toBe(true);
        expect(localSettingsParse({}).markdownCopyV2).toBe(true);
    });

    it('preserves explicit markdown copy opt-outs', () => {
        expect(localSettingsParse({ markdownCopyV2: false }).markdownCopyV2).toBe(false);
        expect(applyLocalSettings(localSettingsDefaults, { markdownCopyV2: false }).markdownCopyV2).toBe(false);
    });
});

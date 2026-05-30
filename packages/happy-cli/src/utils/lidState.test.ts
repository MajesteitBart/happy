import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const {
    mockNetworkInterfaces,
    mockExecSync,
} = vi.hoisted(() => ({
    mockNetworkInterfaces: vi.fn(),
    mockExecSync: vi.fn(),
}))

vi.mock('os', () => ({
    default: {
        networkInterfaces: mockNetworkInterfaces,
    },
}))

vi.mock('child_process', () => ({
    execSync: mockExecSync,
}))

describe('getReconnectDecision', () => {
    let originalPlatform: PropertyDescriptor | undefined

    beforeEach(() => {
        originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform')
        mockNetworkInterfaces.mockReturnValue({
            en0: [{ internal: false, family: 'IPv4' }],
        })
        mockExecSync.mockReset()
    })

    afterEach(() => {
        if (originalPlatform) {
            Object.defineProperty(process, 'platform', originalPlatform)
        }
        vi.resetModules()
    })

    it('blocks reconnect when no external network interface is present', async () => {
        mockNetworkInterfaces.mockReturnValue({})
        const { getReconnectDecision } = await import('./lidState')

        expect(getReconnectDecision({} as NodeJS.ProcessEnv)).toEqual({
            shouldReconnect: false,
            hasNetworkConnectivity: false,
            lidClosed: false,
            externalDisplay: false,
            headlessReconnectOverride: false,
            blockedBy: 'network-unavailable',
        })
    })

    it('blocks headless closed-lid mac reconnect by default', async () => {
        Object.defineProperty(process, 'platform', { value: 'darwin' })
        mockExecSync
            .mockReturnValueOnce('"AppleClamshellState" = Yes')
            .mockReturnValueOnce(JSON.stringify({ SPDisplaysDataType: [] }))
        const { getReconnectDecision } = await import('./lidState')

        expect(getReconnectDecision({} as NodeJS.ProcessEnv)).toMatchObject({
            shouldReconnect: false,
            hasNetworkConnectivity: true,
            lidClosed: true,
            externalDisplay: false,
            headlessReconnectOverride: false,
            blockedBy: 'headless-lid-closed',
        })
    })

    it('allows closed-lid mac reconnect when explicitly overridden', async () => {
        Object.defineProperty(process, 'platform', { value: 'darwin' })
        mockExecSync
            .mockReturnValueOnce('"AppleClamshellState" = Yes')
            .mockReturnValueOnce(JSON.stringify({ SPDisplaysDataType: [] }))
        const { getReconnectDecision } = await import('./lidState')

        expect(getReconnectDecision({ HAPPY_RECONNECT_WHEN_HEADLESS: '1' } as NodeJS.ProcessEnv)).toMatchObject({
            shouldReconnect: true,
            lidClosed: true,
            externalDisplay: false,
            headlessReconnectOverride: true,
            blockedBy: null,
        })
    })
})

import os from 'os'
import { execSync } from 'child_process'

export type ReconnectBlockReason = 'network-unavailable' | 'headless-lid-closed' | null

export type ReconnectDecision = {
    shouldReconnect: boolean
    hasNetworkConnectivity: boolean
    lidClosed: boolean
    externalDisplay: boolean
    headlessReconnectOverride: boolean
    blockedBy: ReconnectBlockReason
}

export function hasNetworkConnectivity(): boolean {
    const interfaces = os.networkInterfaces()
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name] || []) {
            if (!iface.internal && iface.family === 'IPv4') return true
        }
    }
    return false
}

export function isLidClosed(): boolean {
    if (process.platform !== 'darwin') return false
    try {
        const output = execSync('ioreg -r -k AppleClamshellState -d 4', {
            timeout: 5000,
            encoding: 'utf-8',
        })
        return output.includes('"AppleClamshellState" = Yes')
    } catch {
        return false
    }
}

export function hasExternalDisplay(): boolean {
    if (process.platform !== 'darwin') return false
    try {
        const output = execSync('system_profiler SPDisplaysDataType -json 2>/dev/null', {
            timeout: 10000,
            encoding: 'utf-8',
        })
        const data = JSON.parse(output)
        const gpus: any[] = data.SPDisplaysDataType || []
        for (const gpu of gpus) {
            const displays: any[] = gpu.spdisplays_ndrvs || []
            for (const display of displays) {
                const isBuiltIn =
                    display.spdisplays_builtin === 'spdisplays_yes' ||
                    display.spdisplays_connection_type === 'spdisplays_internal'
                if (!isBuiltIn) return true
            }
        }
        return false
    } catch {
        return false
    }
}

export function hasHeadlessReconnectOverride(env: NodeJS.ProcessEnv = process.env): boolean {
    return env.HAPPY_RECONNECT_WHEN_HEADLESS === '1' || env.HAPPY_RECONNECT_WHEN_HEADLESS === 'true'
}

export function getReconnectDecision(env: NodeJS.ProcessEnv = process.env): ReconnectDecision {
    const network = hasNetworkConnectivity()
    const lidClosed = isLidClosed()
    const externalDisplay = hasExternalDisplay()
    const headlessReconnectOverride = hasHeadlessReconnectOverride(env)

    if (!network) {
        return {
            shouldReconnect: false,
            hasNetworkConnectivity: network,
            lidClosed,
            externalDisplay,
            headlessReconnectOverride,
            blockedBy: 'network-unavailable',
        }
    }

    if (lidClosed && !externalDisplay && !headlessReconnectOverride) {
        return {
            shouldReconnect: false,
            hasNetworkConnectivity: network,
            lidClosed,
            externalDisplay,
            headlessReconnectOverride,
            blockedBy: 'headless-lid-closed',
        }
    }

    return {
        shouldReconnect: true,
        hasNetworkConnectivity: network,
        lidClosed,
        externalDisplay,
        headlessReconnectOverride,
        blockedBy: null,
    }
}

export function shouldReconnect(): boolean {
    return getReconnectDecision().shouldReconnect
}

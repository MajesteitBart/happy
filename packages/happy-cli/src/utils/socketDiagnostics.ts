export type SocketConnectErrorSummary = {
    message: string;
    code?: string;
    hasHttpProxy: boolean;
    hasHttpsProxy: boolean;
    hasAllProxy: boolean;
    hasNoProxy: boolean;
};

function readErrorCode(error: unknown): string | undefined {
    if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
        return error.code;
    }
    return undefined;
}

function readErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    if (typeof error === 'string' && error.length > 0) {
        return error;
    }
    return 'Unknown socket connection error';
}

function hasEnv(env: NodeJS.ProcessEnv, ...keys: string[]): boolean {
    return keys.some((key) => typeof env[key] === 'string' && env[key]!.length > 0);
}

export function summarizeSocketConnectError(
    error: unknown,
    env: NodeJS.ProcessEnv = process.env,
): SocketConnectErrorSummary {
    return {
        message: readErrorMessage(error),
        code: readErrorCode(error),
        hasHttpProxy: hasEnv(env, 'HTTP_PROXY', 'http_proxy'),
        hasHttpsProxy: hasEnv(env, 'HTTPS_PROXY', 'https_proxy'),
        hasAllProxy: hasEnv(env, 'ALL_PROXY', 'all_proxy'),
        hasNoProxy: hasEnv(env, 'NO_PROXY', 'no_proxy'),
    };
}

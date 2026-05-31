function isTruthyEnvValue(value: string | undefined) {
    return value === "1" || value?.toLowerCase() === "true" || value?.toLowerCase() === "yes";
}

export function isLegacyAuthChallengeFallbackEnabled() {
    return isTruthyEnvValue(process.env.HAPPY_ENABLE_LEGACY_AUTH_CHALLENGE_FALLBACK);
}

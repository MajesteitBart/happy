# T-018 Legacy Auth Fallback Gate

- Added `HAPPY_ENABLE_LEGACY_AUTH_CHALLENGE_FALLBACK` as an explicit migration switch for the old signed-random-challenge auth path.
- Changed `/v1/auth` to reject legacy auth by default with `Server-issued nonce required`; nonce auth remains the default path.
- Changed `/v1/capabilities` so `features.legacyAuthChallengeFallback` reflects the configured migration posture.
- Updated self-host server docs to call out the replay risk and temporary migration switch.

Verification:
- `pnpm --filter happy-server-self-host exec vitest run sources/app/api/routes/authRoutes.test.ts sources/app/api/routes/versionRoutes.test.ts sources/app/api/authNonce.test.ts`
- `pnpm --filter happy-server-self-host typecheck`

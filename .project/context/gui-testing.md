# GUI Testing Policy

## Enforcement Mode
- Required for UI-facing changes to `happy-app`, bundled web surfaces, or `codium`; advisory for Delano-only context/docs changes.

## Smoke Routes
- Happy app/web launches successfully.
- Session list/session detail views render without blocking errors.
- Cross-device control flows that are touched by the change still behave as expected.

## Console Filtering
- Treat runtime crashes, red screens, unhandled promise rejections, broken network/auth flows, and persistent console errors on touched screens as blocking.

## Evidence Requirements
- Follow `docs/CONTRIBUTING.md`: capture screenshots, video, or real running-app proof for UI fixes.
- If GUI testing is skipped, say why and name the gap explicitly.

## Design Validation Threshold
- Changes should preserve Happy’s core usability for remote monitoring and takeover flows; visual correctness alone is not enough if session control or sync behavior regresses.

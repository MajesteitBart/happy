# T-019 Corporate Proxy WebSocket Support

- Identified the active CLI/daemon Socket.IO clients:
    - `packages/happy-cli/src/api/apiSession.ts` for app-server/session-scoped agent flows.
    - `packages/happy-cli/src/api/apiMachine.ts` for daemon/machine-scoped remote-control flows.
- Added shared socket proxy resolution in `packages/happy-cli/src/utils/socketProxy.ts`.
- Wired both session and daemon Socket.IO clients through a `ProxyAgent`.
- Supported `HTTP_PROXY`, `HTTPS_PROXY`, `ALL_PROXY`, `NO_PROXY`, plus explicit `WS_PROXY` and `WSS_PROXY`.
- Kept proxy URLs out of connection-error summaries; existing diagnostics only report whether proxy env vars are present.
- Documented proxy env support in `packages/happy-cli/README.md`.

Compatibility decision:
- Mobile/web app Socket.IO runs in the platform network stack, not Node, so it does not consume shell proxy env vars.
- The legacy `happy-agent` package still has standalone Socket.IO clients; this task covered current CLI/daemon/app-server flows named in the acceptance scope.

Verification:
- `pnpm --filter happy exec vitest run --project unit src/utils/socketProxy.test.ts src/utils/socketDiagnostics.test.ts src/api/apiSession.test.ts src/api/apiMachine.test.ts`

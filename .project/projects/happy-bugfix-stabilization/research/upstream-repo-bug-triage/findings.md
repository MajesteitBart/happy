---
type: research_findings
project: happy-bugfix-stabilization
slug: upstream-repo-bug-triage
created: 2026-05-30T08:31:29Z
updated: 2026-05-30T08:35:32Z
---

# Findings: Upstream repo bug triage

## Source References

- `delano status`: project `happy-bugfix-stabilization`, spec and plan both `planned`, total tasks `0`.
- `gh issue view 1265 -R slopus/happy`: zod v3/v4 peer dependency install warning.
- `gh issue view 1224 -R slopus/happy`: pinned MCP SDK security/dependency concern.
- `gh issue view 1330 -R slopus/happy`: Codex yolo maps to `on-failure`.
- `gh issue view 983 -R slopus/happy`: `happy connect codex` vendor token registration timeout.
- `gh issue view 1201 -R slopus/happy`: corporate/self-hosted Codex local-auth requirements.
- `gh issue view 837 -R slopus/happy`: Codex mobile message produces request parse errors and empty replies.
- `gh issue view 957 -R slopus/happy`: Codex responses WebSocket TLS failures.
- `gh issue view 1261 -R slopus/happy`: `happy codex` stays at "Waiting for messages" without QR.
- `gh issue view 1343 -R slopus/happy`: latest npm version can loop into `Process exited unexpectedly` after abort.
- `gh issue view 982 -R slopus/happy`: mobile message can crash Claude local session with SIGTERM.
- `gh issue view 1229 -R slopus/happy`: daemon reconnect blocked when a Mac lid is closed.
- `gh issue view 451 -R slopus/happy`: proxy environment variables can make Happy startup fail.
- `gh issue view 761 -R slopus/happy`: `happy-agent` WebSocket send fails with token scope/connectivity issues.
- `gh issue view 1163 -R slopus/happy`: non-ASCII project paths caused watcher ENOENT loops in published versions.
- Local inspection: `package.json`, `packages/happy-cli/package.json`, `pnpm-lock.yaml`.
- Local inspection: `packages/happy-cli/src/codex/executionPolicy.ts`.
- Local inspection: `packages/happy-cli/src/codex/runCodex.ts`.
- Local inspection: `packages/happy-cli/src/codex/codexAppServerClient.ts`.
- Local inspection: `packages/happy-cli/src/api/api.ts`.
- Local inspection: `packages/happy-cli/src/api/apiMachine.ts`.
- Local inspection: `packages/happy-cli/src/utils/lidState.ts`.
- Local inspection: `packages/happy-cli/src/claude/utils/proxyBypass.ts`.
- Local inspection: `packages/happy-cli/src/claude/utils/path.ts`.
- Local inspection: `.agents/scripts/pm/validate.sh`.

## Observations

- Dependency install friction is real and still visible locally. `packages/happy-cli/package.json` pins `zod` at `3.25.76` and declares `@anthropic-ai/claude-agent-sdk` as `^0.2.96`; the lockfile currently resolves another workspace copy to `@anthropic-ai/claude-agent-sdk@0.3.143` with `zod@4.4.3`, while `happy-cli` still resolves SDK `0.2.96` with `zod@3.25.76`. Upstream #1265 documents recurring global install warnings from this split.
- `packages/happy-cli/package.json` still pins `@modelcontextprotocol/sdk` at `1.25.3`. Upstream #1224 tracks the need to audit and upgrade this dependency because Happy has MCP-facing multi-client paths.
- Codex yolo behavior is a narrow confirmed code bug. `resolveCodexExecutionPolicy()` maps both `safe-yolo` and `yolo` to `approvalPolicy: 'on-failure'`; upstream #1330 expects `yolo` and `bypassPermissions` to map to `approvalPolicy: 'never'` with full sandbox bypass.
- Codex vendor token registration has an overly short local timeout. `ApiClient.registerVendorToken()` uses `timeout: 5000`; upstream #983 reports successful local workaround at a longer timeout.
- The stabilization plan should prefer local Codex subscription auth for ordinary CLI use. Upstream #1201 asks for corporate/self-hosted mode that keeps OpenAI/Codex auth local and avoids token storage. This aligns with the user instruction to use Codex subscription auth.
- Codex app-server reliability is separate from the yolo mapping. Local `runCodex.ts` uses app-server via `CodexAppServerClient`; upstream #837 still reports request-body parse errors and empty replies from an older MCP/programmatic path. The plan should require current repro before changing app-server code.
- Codex WebSocket/proxy failures need diagnostic and environment handling, not only retry loops. Upstream #957 shows Codex's own responses WebSocket TLS failures; #451 shows HTTP proxy env vars breaking Happy startup. Local `ensureLocalProxyBypass()` only protects local MCP HTTP servers from proxy routing.
- Abort and "process exited unexpectedly" handling need classification. Upstream #1343 shows abort can be surfaced as a process failure in latest npm versions; #982 shows mobile messages can SIGTERM a Claude local session. The plan should distinguish user abort, launcher crash before delivery, delivered-but-not-consumed, and real agent exit.
- Daemon reconnect is gated by lid/display state. Local `shouldReconnect()` returns false when a Mac lid is closed without an external display; `ApiMachineClient.startSmartReconnect()` then logs "Still not ready to reconnect" indefinitely. This matches upstream #1229.
- The non-ASCII/space path watcher bug appears fixed in local source. `getProjectPath()` now replaces every character outside `[a-zA-Z0-9-]` with `-`, matching the upstream #1163 comment that the fix was on main but not yet released. The task should protect the fix with tests and release verification.
- Delano setup is functional enough for status. `delano status` succeeded, but validation is broad and may report existing runtime/template/context issues unrelated to this planning pass.

## Options Considered

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| Patch one issue immediately | Fastest visible code change | Does not satisfy Delano setup requirement or broad stabilization scope | Rejected for this turn |
| Create a broad but concrete Delano plan first | Captures dependencies, issue evidence, and task order | Defers implementation | Selected |
| Treat all upstream issues as equal | Complete backlog | Too unfocused for first push | Rejected |
| Prioritize install, Codex, lifecycle, and connectivity | Covers highest repeated user pain and Bart's dependency issues | Leaves lower-priority UX/features out | Selected |

## Fold-Forward Candidates

| Finding | Target Artifact | Proposed Change |
| --- | --- | --- |
| Dependency warning and MCP SDK risks | `spec.md`, `plan.md`, WS-A, T-001, T-002 | Make install/dependency stabilization the first workstream. |
| Codex yolo mapping | WS-B, T-003 | Add a narrow ready task with unit-test acceptance. |
| Codex local subscription auth and vendor timeout | WS-B, T-004, T-005 | Separate auth/token-timeout from app-server turn reliability. |
| Abort/process-exit ambiguity | WS-C, T-006 | Require lifecycle classification and regression coverage. |
| WebSocket/proxy/reconnect issues | WS-C, T-007 | Add daemon reconnect override/diagnostics and proxy test coverage. |
| Watcher path fix already present | WS-C, T-008 | Lock in tests and release verification instead of redoing the fix. |
| Delano validation is broad | WS-D, T-009, T-010 | Add Delano validation cleanup and smoke matrix tasks. |

## Open Questions

- Which exact dependency bump strategy should win: zod v4 migration now, or constrain `@anthropic-ai/claude-agent-sdk` until zod v4 migration is complete?
- Which current Codex CLI version is the support baseline for `codex app-server` and subscription-auth behavior?
- Should enterprise/local-auth Codex mode disable remote `happy connect codex` token upload by default or only when configured?
- Should daemon reconnect ignore lid state by default, or expose an explicit environment override for headless Mac workflows?

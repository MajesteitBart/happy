---
type: research_intake
project: happy-bugfix-stabilization
slug: upstream-repo-bug-triage
owner: Clark
status: folded-forward
created: 2026-05-30T08:31:29Z
updated: 2026-05-30T08:35:32Z
---

# Research Plan: Upstream repo bug triage

## Goal

Identify the first bug-fix push for Happy from local code/package inspection and open upstream `slopus/happy` issues. The output should be factual enough to update the project spec, plan, workstreams, and ready tasks without making implementation claims.

## Primary Question

Which Happy repository and upstream `slopus/happy` issues should drive the first broad bug-fix plan, including dependency install warnings and Codex remote-control reliability?

## Scope

### In Scope

- Dependency install and security warnings that affect normal install or local development.
- Codex permission/yolo behavior, subscription/local-auth behavior, hangs, and app-server failures.
- Process lifecycle bugs that surface as `Process exited unexpectedly`, abort loops, or session unresponsiveness.
- Proxy, WebSocket, daemon reconnect, and self-hosted connectivity issues.
- Repo-local Delano validation/runtime issues discovered while preparing the plan.

### Out of Scope

- Implementing fixes during this research pass.
- Posting or closing GitHub issues.
- Storing secrets, raw prompts, tokens, or private absolute paths.
- Treating research files as executable task truth until folded into canonical artifacts.

## Current Phase

Folded forward

## Phases

- [x] Open research intake.
- [x] Inspect local package manifests, lockfile, runtime code, and Delano contract shape.
- [x] Read upstream GitHub issues with `gh issue view`.
- [x] Summarize findings and prioritize the first stabilization plan.
- [x] Fold durable conclusions into `spec.md`, `plan.md`, `decisions.md`, workstreams, and tasks.
- [ ] Execute the planned bug fixes.

## Research Tasks

| Task | Status | Evidence |
| --- | --- | --- |
| Dependency install warnings | Done | `packages/happy-cli/package.json`, `pnpm-lock.yaml`, upstream #1265, #1224, #499 |
| Codex permission and auth behavior | Done | `packages/happy-cli/src/codex/executionPolicy.ts`, `packages/happy-cli/src/api/api.ts`, upstream #1330, #983, #1201 |
| Codex hangs and WebSocket failures | Done | `packages/happy-cli/src/codex/runCodex.ts`, `packages/happy-cli/src/codex/codexAppServerClient.ts`, upstream #837, #957, #1261 |
| Process lifecycle and abort loops | Done | `packages/happy-cli/src/codex/runCodex.ts`, `packages/happy-cli/src/claude/claudeRemoteLauncher.ts`, upstream #1343, #982 |
| Proxy and daemon reconnect behavior | Done | `packages/happy-cli/src/claude/utils/proxyBypass.ts`, `packages/happy-cli/src/api/apiMachine.ts`, `packages/happy-cli/src/utils/lidState.ts`, upstream #451, #761, #1229 |
| Session watcher/runtime path issues | Done | `packages/happy-cli/src/claude/utils/path.ts`, `packages/happy-cli/src/claude/utils/sessionScanner.ts`, upstream #1163, #667 |
| Delano setup validation | In progress | `delano status` succeeded; `delano validate` still needs a post-edit run |

## Decisions Made

| Decision | Rationale |
| --- | --- |
| Make install/dependency warnings the first workstream. | They affect every fresh install and directly cover Bart's reported dependency friction. |
| Treat Codex yolo mapping as a small high-priority correctness fix. | Upstream #1330 maps exactly to local code and has a narrow test target. |
| Keep Codex app-server reliability separate from Claude lifecycle bugs. | They fail through different code paths and need different regression tests. |
| Plan for local Codex subscription auth as the default stabilization path. | It avoids storing OpenAI tokens in Happy for normal CLI use and matches enterprise/self-hosted concerns in upstream #1201. |
| Preserve the watcher path fix as a release/regression task, not a new code fix. | Local `path.ts` already uses the corrected normalization described in upstream #1163. |

## Blockers

| Blocker | Owner | Check-back |
| --- | --- | --- |
| Full `delano validate` may fail on existing Delano runtime/environment checks unrelated to these planning edits. | Clark | Run after artifact edits and record exact output in `progress.md`. |
| Some Codex failures depend on current external Codex CLI/server behavior. | Clark | Reproduce with local subscription-auth Codex before implementation. |

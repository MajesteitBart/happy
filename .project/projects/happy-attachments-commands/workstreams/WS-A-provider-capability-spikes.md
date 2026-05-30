---
id: WS-A
name: WS-A Provider Capability Spikes
owner: Clark
status: done
created: 2026-05-30T19:58:18Z
updated: 2026-05-30T20:05:39Z
---

# Workstream: WS-A Provider Capability Spikes

## Objective
Verify provider and repo contracts before implementation so attachments and Codex skills are built on behavior that exists in the installed runtimes.

## Owned Files/Areas
- `packages/happy-cli/src/claude/claudeRemoteLauncher.ts`
- `packages/happy-cli/src/codex/codexAppServerClient.ts`
- `packages/happy-cli/src/codex/codexAppServerTypes.ts`
- `packages/happy-app/sources/sync/sync.ts`
- Provider docs and generated local schemas

## Dependencies
- None. This workstream gates implementation.

## Risks
- Upstream docs may not match the installed Codex app-server version.
- Claude SDK document support may be narrower than expected.
- The frozen `happy-wire` protocol can give false confidence if mistaken for active code.

## Handoff Criteria
- T-001 and T-002 are closed with evidence.
- Provider input contracts and active Happy attachment path are documented.
- Any plan changes from probe findings are applied before coding.

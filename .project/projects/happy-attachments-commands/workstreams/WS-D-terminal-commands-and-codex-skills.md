---
id: WS-D
name: WS-D Terminal Commands and Codex Skills
owner: Clark
status: done
created: 2026-05-30T19:58:18Z
updated: 2026-05-30T21:04:37Z
---

# Workstream: WS-D Terminal Commands and Codex Skills

## Objective
Make autocomplete reflect the connected terminal: live slash commands for terminals that report them, and native Codex `$` skill autocomplete for Codex sessions.

## Owned Files/Areas
- `packages/happy-app/sources/sync/suggestionCommands.ts`
- `packages/happy-app/sources/components/autocomplete/suggestions.ts`
- `packages/happy-app/sources/components/autocomplete/applySuggestion.ts`
- `packages/happy-app/sources/components/AgentInputSuggestionView.tsx`
- `packages/happy-app/sources/-session/SessionView.tsx`
- `packages/happy-app/sources/sync/storageTypes.ts`
- `packages/happy-cli/src/api/types.ts`
- `packages/happy-cli/src/codex/runCodex.ts`
- `packages/happy-cli/src/codex/codexAppServerClient.ts`

## Dependencies
- WS-A must verify Codex native skill APIs.

## Risks
- Static command fallbacks would make the UI lie about terminal capabilities.
- Broad `$` prompt expansion can corrupt shell variables, paths, and code.
- Codex skills metadata must not be mixed with Claude skill metadata.

## Handoff Criteria
- `/` uses only live `metadata.slashCommands`.
- Empty slash command metadata yields no popover.
- `$` appears only for Codex sessions with native skill metadata.
- Selected Codex skills invoke through the verified native contract or a documented narrow fallback.

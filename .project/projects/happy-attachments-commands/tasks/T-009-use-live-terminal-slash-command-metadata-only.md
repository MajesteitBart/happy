---
id: T-009
name: Use live terminal slash command metadata only
status: done
workstream: WS-D
created: 2026-05-30T19:58:56Z
updated: 2026-05-30T20:55:54Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-001]
conflicts_with: []
parallel: true
priority: high
estimate: M
story_id: 
acceptance_criteria_ids: []
---

# Task: Use live terminal slash command metadata only

## Description

Make slash autocomplete reflect the connected terminal session instead of hardcoded app defaults.

## Acceptance Criteria

- [ ] Claude sessions show commands only from metadata.slashCommands, filtered/enriched locally.
- [ ] Codex sessions show no slash suggestions unless Codex exposes live slash command metadata in the future.
- [ ] Empty command sets do not render an empty autocomplete popover.
- [ ] Tests cover no metadata, empty slashCommands, Claude slashCommands, and ignored command filtering.

## Traceability
- Story: none
- Acceptance criteria: none

## Technical Notes

## Definition of Done
- [ ] Implementation complete
- [ ] Tests pass
- [ ] Review complete
- [ ] Docs updated

## Evidence Log

- 2026-05-30T20:55:54Z: Slash autocomplete now uses only live session metadata.slashCommands, with local description enrichment and ignored-command filtering. Sessions with no metadata or empty slashCommands return no suggestions, so the existing autocomplete guard renders no empty popover. Verified with pnpm --filter happy-app typecheck and pnpm --filter happy-app exec vitest run sources/sync/suggestionCommands.test.ts.

- 2026-05-30T20:54:22Z: Switching slash autocomplete to connected terminal metadata only.
- 2026-05-30T19:58:56Z: Created from .project/templates/task.md by `delano task add`.

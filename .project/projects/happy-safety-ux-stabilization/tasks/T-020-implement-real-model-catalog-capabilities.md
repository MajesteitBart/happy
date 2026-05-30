---
id: T-020
name: Implement real model catalog capabilities
status: ready
workstream: WS-B
created: 2026-05-30T20:18:59Z
updated: 2026-05-30T20:18:59Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-007]
conflicts_with: []
parallel: true
priority: medium
estimate: L
story_id: US-004
acceptance_criteria_ids: [AC-004]
---

# Task: Implement real model catalog capabilities

## Description

Replace the placeholder modelCatalog version signal with a real app/server-visible model catalog or model-list contract so new provider models do not require fragile hardcoded app updates.

## Acceptance Criteria

- [ ] Define model catalog schema, source of truth, and compatibility behavior.
- [ ] Expose model availability through capabilities or a dedicated endpoint.
- [ ] Teach app/CLI consumers to render available models from the catalog where applicable.
- [ ] Add tests for missing, stale, and newly added model entries.

## Traceability
- Story: US-004
- Acceptance criteria: AC-004

## Technical Notes

## Definition of Done
- [ ] Implementation complete
- [ ] Tests pass
- [ ] Review complete
- [ ] Docs updated

## Evidence Log
- 2026-05-30T20:18:59Z: Created from .project/templates/task.md by `delano task add`.

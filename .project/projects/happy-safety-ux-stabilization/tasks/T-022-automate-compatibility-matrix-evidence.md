---
id: T-022
name: Automate compatibility matrix evidence
status: ready
workstream: WS-E
created: 2026-05-30T20:19:00Z
updated: 2026-05-30T20:19:00Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-016]
conflicts_with: []
parallel: true
priority: high
estimate: L
story_id: US-008
acceptance_criteria_ids: [AC-008]
---

# Task: Automate compatibility matrix evidence

## Description

Turn the improved but partly manual CI safety net into automated evidence for app/CLI/server compatibility and release confidence.

## Acceptance Criteria

- [ ] Add automatic or scheduled compatibility matrix coverage for current app/server/CLI combinations.
- [ ] Include previous supported self-host/server/CLI versions where a compatibility floor is declared.
- [ ] Publish clear CI evidence or artifacts for green workflow status.
- [ ] Keep slow integration separated from fast PR checks without losing routine coverage.

## Traceability
- Story: US-008
- Acceptance criteria: AC-008

## Technical Notes

## Definition of Done
- [ ] Implementation complete
- [ ] Tests pass
- [ ] Review complete
- [ ] Docs updated

## Evidence Log
- 2026-05-30T20:19:00Z: Created from .project/templates/task.md by `delano task add`.

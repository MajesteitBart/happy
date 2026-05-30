---
id: T-010
name: Surface native Codex skills for $ autocomplete
status: planned
workstream: WS-D
created: 2026-05-30T19:58:56Z
updated: 2026-05-30T19:58:56Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-001]
conflicts_with: []
parallel: true
priority: high
estimate: L
story_id: 
acceptance_criteria_ids: []
---

# Task: Surface native Codex skills for $ autocomplete

## Description

Query Codex native app-server skill APIs and expose names/descriptions in Happy session metadata for hBcprefixed autocomplete.

## Acceptance Criteria

- [ ] Codex runner populates a dedicated codexSkills metadata field from native skills/list or verified equivalent.
- [ ] Claude sessions do not show $ autocomplete unless explicitly supported later.
- [ ] App autocomplete prefixes add $ only for Codex sessions with skill metadata.
- [ ] Skill suggestion rows render name and description and selection inserts the intended invocation token.

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
- 2026-05-30T19:58:56Z: Created from .project/templates/task.md by `delano task add`.

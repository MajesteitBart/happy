---
id: T-014
name: Run Codex attachment and skill E2E
status: planned
workstream: WS-E
created: 2026-05-30T19:59:14Z
updated: 2026-05-30T19:59:14Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-007, T-008, T-010, T-011, T-012]
conflicts_with: []
parallel: false
priority: high
estimate: L
story_id: 
acceptance_criteria_ids: []
---

# Task: Run Codex attachment and skill E2E

## Description

Verify Codex receives image attachments, can read document temp files, and exposes/selects native $ skills in a connected session.

## Acceptance Criteria

- [ ] Codex image attachments are visible to the model through app-server input.
- [ ] Codex can read attached PDF/text/code files from the chosen temp path under expected sandbox modes.
- [ ] $ autocomplete appears only in Codex sessions with native skills and invocation reaches Codex as intended.
- [ ] Temp files are removed after turn/session completion.

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
- 2026-05-30T19:59:14Z: Created from .project/templates/task.md by `delano task add`.

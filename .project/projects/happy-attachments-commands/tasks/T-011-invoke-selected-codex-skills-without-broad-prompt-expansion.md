---
id: T-011
name: Invoke selected Codex skills without broad prompt expansion
status: planned
workstream: WS-D
created: 2026-05-30T19:59:14Z
updated: 2026-05-30T19:59:14Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-010]
conflicts_with: []
parallel: false
priority: high
estimate: M
story_id: 
acceptance_criteria_ids: []
---

# Task: Invoke selected Codex skills without broad prompt expansion

## Description

Submit selected $ skills through the native Codex skill input contract when available, with a narrow fallback only if native invocation is unavailable in the installed version.

## Acceptance Criteria

- [ ] Known selected skills are sent as native skill input items or verified app-server equivalent.
- [ ] Unknown  and $ inside paths, shell variables, and code remain untouched.
- [ ] Fallback prompt expansion, if needed, is guarded by deterministic standalone-token parsing and documented as temporary.
- [ ] Tests cover selected skill, unknown token, shell variable, path, and markdown/code examples.

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

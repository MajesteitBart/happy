---
id: T-012
name: Add app and CLI type/schema coverage
status: done
workstream: WS-E
created: 2026-05-30T19:59:14Z
updated: 2026-05-30T21:06:11Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-004, T-010]
conflicts_with: []
parallel: true
priority: high
estimate: M
story_id: 
acceptance_criteria_ids: []
---

# Task: Add app and CLI type/schema coverage

## Description

Add focused tests for new attachment and metadata types on the active app/CLI/server path.

## Acceptance Criteria

- [ ] App storage metadata accepts codexSkills without overloading Claude skills.
- [ ] CLI API metadata types include codexSkills names/descriptions only.
- [ ] Attachment MIME metadata and document previews have unit coverage.
- [ ] Tests avoid relying on frozen happy-wire sessionProtocol as production proof.

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

- 2026-05-30T21:06:11Z: Added app MetadataSchema coverage for dedicated codexSkills alongside existing skills, plus focused suggestion and attachment MIME tests on active app/CLI paths. Verified with pnpm --filter happy-app typecheck, app storage/typesRaw/paste/suggestion tests, pnpm --filter happy typecheck, and CLI codex/inputBuilder + codexAppServerClient + MessageQueue2 tests.

- 2026-05-30T21:05:13Z: Adding focused metadata/schema coverage for Codex skills and attachment MIME paths.
- 2026-05-30T19:59:14Z: Created from .project/templates/task.md by `delano task add`.

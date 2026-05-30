---
id: T-008
name: Build Codex app-server input items for attachments
status: planned
workstream: WS-C
created: 2026-05-30T19:58:56Z
updated: 2026-05-30T19:58:56Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-001, T-007]
conflicts_with: []
parallel: false
priority: high
estimate: L
story_id: 
acceptance_criteria_ids: []
---

# Task: Build Codex app-server input items for attachments

## Description

Send image attachments to Codex as native localImage/image items and expose document attachments as readable temp files referenced from the user turn.

## Acceptance Criteria

- [ ] Images are sent before final user text as Codex-supported image/localImage input items.
- [ ] Documents are written to a Happy-managed hidden temp directory with restrictive permissions and cleanup on turn/session exit.
- [ ] Document prompts include filename, MIME type, and readable path without exposing private system paths unnecessarily in persisted messages.
- [ ] Sandbox/readability is verified for workspace-write, read-only, and danger-full-access where applicable.

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

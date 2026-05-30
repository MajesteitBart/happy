---
id: T-007
name: Download and queue attachments for Codex turns
status: planned
workstream: WS-C
created: 2026-05-30T19:58:56Z
updated: 2026-05-30T19:58:56Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-004, T-005]
conflicts_with: []
parallel: false
priority: high
estimate: M
story_id: 
acceptance_criteria_ids: []
---

# Task: Download and queue attachments for Codex turns

## Description

Mirror the Claude attachment drain path in the Codex runner so file events are claimed by the next user message and carried through the Codex message queue.

## Acceptance Criteria

- [ ] runCodex registers file-event downloads and tracks them with existing session attachment helpers.
- [ ] Message queue batches include attachments without races between file events and text messages.
- [ ] Abort/retry behavior does not leak stale attachments into later turns.
- [ ] Tests or fixture coverage prove attachment ownership per user message.

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

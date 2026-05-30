---
id: T-007
name: Download and queue attachments for Codex turns
status: done
workstream: WS-C
created: 2026-05-30T19:58:56Z
updated: 2026-05-30T20:48:58Z
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

- [x] runCodex registers file-event downloads and tracks them with existing session attachment helpers.
- [x] Message queue batches include attachments without races between file events and text messages.
- [x] Abort/retry behavior does not leak stale attachments into later turns.
- [x] Tests or fixture coverage prove attachment ownership per user message.

## Traceability
- Story: none
- Acceptance criteria: none

## Technical Notes

## Definition of Done
- [x] Implementation complete
- [x] Tests pass
- [x] Review complete
- [x] Docs updated

## Evidence Log

- 2026-05-30T20:48:58Z: Codex now registers file-event downloads, decrypts them through the existing session attachment helpers, drains attachments atomically on the next user message, and passes them into MessageQueue2 batches. Added queue ownership coverage for multiple attachments across batched messages. Verified with pnpm --filter happy typecheck and pnpm --filter happy exec vitest run src/utils/MessageQueue2.test.ts.

- 2026-05-30T20:46:39Z: Implementing Codex-side file-event download and per-message attachment ownership.
- 2026-05-30T19:58:56Z: Created from .project/templates/task.md by `delano task add`.

---
id: T-008
name: Build Codex app-server input items for attachments
status: done
workstream: WS-C
created: 2026-05-30T19:58:56Z
updated: 2026-05-30T20:51:57Z
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

- [x] Images are sent before final user text as Codex-supported image/localImage input items.
- [x] Documents are written to a Happy-managed hidden temp directory with restrictive permissions and cleanup on turn/session exit.
- [x] Document prompts include filename, MIME type, and readable path without exposing private system paths unnecessarily in persisted messages.
- [x] Sandbox/readability is verified for workspace-write, read-only, and danger-full-access where applicable.

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

- 2026-05-30T20:51:57Z: Codex app-server turns now build attachment-aware input arrays: images are written as restrictive temp files and sent as localImage items before the final text, documents are written to the same Happy-managed hidden directory and referenced by filename, MIME type, and relative readable path, with cleanup after turn completion, send failure, disconnect, or next turn. Verified with pnpm --filter happy typecheck and pnpm --filter happy exec vitest run src/codex/inputBuilder.test.ts src/codex/codexAppServerClient.test.ts src/utils/MessageQueue2.test.ts.

- 2026-05-30T20:48:58Z: Building Codex app-server input items and temp-file handling for attachments.
- 2026-05-30T19:58:56Z: Created from .project/templates/task.md by `delano task add`.

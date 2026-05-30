---
id: T-002
name: Map active attachment flow and failure states
status: done
workstream: WS-A
created: 2026-05-30T19:58:38Z
updated: 2026-05-30T20:05:39Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-001]
conflicts_with: []
parallel: false
priority: high
estimate: S
story_id: 
acceptance_criteria_ids: []
---

# Task: Map active attachment flow and failure states

## Description

Trace current app upload, encrypted blob storage, server upload/download, CLI file-event handling, and message queue ownership so attachment work lands on the active runtime path.

## Acceptance Criteria

- [x] The plan identifies where mimeType is lost today and where it must be restored.
- [x] Failure states cover unsupported agent flavor, oversized file, upload failure, download failure, unsupported MIME, and provider rejection.
- [x] No public artifact includes private machine paths or secrets.

## Traceability
- Story: none
- Acceptance criteria: none

## Technical Notes

Active attachment flow:

1. App picker creates `AttachmentPreview` with URI, size, name, dimensions, thumbhash, and `mimeType`.
2. `SessionView` passes selected attachments into `sync.sendMessage`.
3. `sync.ts` currently blocks non-Claude flavors, reads bytes with `readFileBytes`, encrypts them with the session blob key, requests an upload URL, uploads the encrypted blob, and creates `UploadedAttachment`.
4. `UploadedAttachment` currently drops `mimeType`, so the following file event cannot carry it.
5. App sends a `t: 'file'` event with ref/name/size/image metadata, then sends the text user message.
6. CLI `apiSession` validates file events, queues them until a runner registers `onFileEvent`, downloads encrypted blobs through `request-download`, decrypts with the blob key, tracks promises, and atomically drains them for the next user text message.
7. Claude runner is wired into this flow. Codex runner is not yet wired into this flow.

Failure states to preserve or add:

- Unsupported agent flavor: app should block before upload with a specific unsupported-agent message.
- Oversized file: picker and upload request must both enforce the 10MB cap.
- Upload request/upload failure: keep the text message send path predictable and show failed attachment count.
- Download/decrypt failure: CLI should skip failed attachment and report/log without attaching stale data to later turns.
- Unsupported MIME/provider rejection: provider runners should skip or surface a clear status instead of crashing the session.
- Codex temp-file cleanup failure: must be logged and retried/best-effort without leaving files in normal worktree paths.

## Definition of Done
- [x] Implementation complete
- [x] Tests pass
- [x] Review complete
- [x] Docs updated

## Evidence Log

- 2026-05-30T20:05:39Z: Mapped active app upload, encrypted server blob, file-event, CLI download/decrypt, and runner drain flow in task technical notes. Identified MIME loss at UploadedAttachment/file-event, existing unsupported-agent and size gates, and failure states for upload, download/decrypt, unsupported MIME/provider rejection, and Codex temp-file cleanup.

- 2026-05-30T20:05:03Z: Active attachment flow was mostly traced during plan verification; finishing the failure-state map before app implementation.
- 2026-05-30T19:58:38Z: Created from .project/templates/task.md by `delano task add`.

---
id: T-004
name: Preserve MIME metadata through upload and file events
status: done
workstream: WS-B
created: 2026-05-30T19:58:38Z
updated: 2026-05-30T20:44:23Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-003]
conflicts_with: []
parallel: true
priority: high
estimate: M
story_id: 
acceptance_criteria_ids: []
---

# Task: Preserve MIME metadata through upload and file events

## Description

Thread attachment mimeType from preview through UploadedAttachment and outgoing file events while keeping encrypted server blobs opaque.

## Acceptance Criteria

- [ ] UploadedAttachment includes mimeType and sync.ts emits file-event mimeType for images and documents.
- [ ] Image dimensions/thumbhash are emitted only for real images; documents send no image metadata.
- [ ] Server upload routes remain content-opaque and do not need decrypted MIME awareness.
- [ ] Tests cover PDF/text/code file-event metadata on the active path.

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

- 2026-05-30T20:44:23Z: Added mimeType to UploadedAttachment, preserved MIME in outgoing app file events, updated the app raw session schema/normalization to retain MIME metadata, and kept image metadata conditional on width/height. Verified with pnpm --filter happy-app typecheck and pnpm --filter happy-app exec vitest run sources/utils/pasteImages.web.test.ts sources/sync/typesRaw.spec.ts.

- 2026-05-30T20:44:13Z: Threading MIME metadata through the app upload and file-event path.
- 2026-05-30T19:58:38Z: Created from .project/templates/task.md by `delano task add`.

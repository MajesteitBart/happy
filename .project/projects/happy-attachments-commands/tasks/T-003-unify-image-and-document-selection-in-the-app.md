---
id: T-003
name: Unify image and document selection in the app
status: done
workstream: WS-B
created: 2026-05-30T19:58:38Z
updated: 2026-05-30T20:44:13Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-001, T-002]
conflicts_with: []
parallel: true
priority: high
estimate: L
story_id: 
acceptance_criteria_ids: []
---

# Task: Unify image and document selection in the app

## Description

Add a document picker path and normalize selected images/documents into one attachment preview model for mobile and web.

## Acceptance Criteria

- [ ] Users can add photos/images and files from the composer affordance without losing current image behavior.
- [ ] Document chips render filename, size/type affordance, remove action, and upload/error state without broken thumbnails.
- [ ] Native and web URI byte reads are covered for image picker and document picker outputs.
- [ ] Existing file count and max-size guards apply consistently.

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

- 2026-05-30T20:44:13Z: Implemented shared app attachment picker for images and documents, document file chips, web file-drop document previews, existing count/size guards for both picker paths, and legacy useImagePicker compatibility. Verified with pnpm --filter happy-app typecheck and pnpm --filter happy-app exec vitest run sources/utils/pasteImages.web.test.ts sources/sync/typesRaw.spec.ts.

- 2026-05-30T20:35:17Z: Starting Codex-first attachment implementation with shared app attachment groundwork.
- 2026-05-30T19:58:38Z: Created from .project/templates/task.md by `delano task add`.

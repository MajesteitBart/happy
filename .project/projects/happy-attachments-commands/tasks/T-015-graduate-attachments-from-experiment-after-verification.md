---
id: T-015
name: Graduate Codex attachments from experiment after verification
status: done
workstream: WS-E
created: 2026-05-30T19:59:15Z
updated: 2026-05-30T21:16:19Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-014]
conflicts_with: []
parallel: false
priority: high
estimate: S
story_id: 
acceptance_criteria_ids: []
---

# Task: Graduate Codex attachments from experiment after verification

## Description

Default the attachment feature on for the Codex-first path after Codex verification proves the user-facing path works and existing Claude image attachment behavior has not regressed.

## Acceptance Criteria

- [x] expImageUpload default flips only after Codex E2E evidence is present.
- [x] Feature/settings copy says images and documents for Codex first, with Claude image support preserved and Claude document support documented as lower priority if still pending.
- [x] Translations are updated or intentionally deferred with visible fallback handling.
- [x] Release notes mention Codex-supported file types, limits, and known provider caveats.

## Traceability
- Story: none
- Acceptance criteria: none

## Technical Notes

Claude document E2E no longer blocks this task. Existing Claude image behavior should still be checked so default-on does not regress the already-working path.

## Definition of Done
- [x] Implementation complete
- [x] Tests pass
- [x] Review complete
- [x] Docs updated

## Evidence Log

- 2026-05-30T21:16:19Z: Codex E2E evidence captured with live Codex 0.135.0 app-server. Attachments default to on, settings copy now describes Codex images/files with Claude image support preserved, translations use English fallback copy for attachment-specific strings, and CHANGELOG documents supported Codex file types, limits, temp-file cleanup, and Claude document caveat. Verified with app/CLI typechecks and focused app/CLI tests.

- 2026-05-30T21:12:31Z: Codex E2E evidence is present; graduating attachments default-on with updated copy and release notes.
- 2026-05-30T19:59:15Z: Created from .project/templates/task.md by `delano task add`.

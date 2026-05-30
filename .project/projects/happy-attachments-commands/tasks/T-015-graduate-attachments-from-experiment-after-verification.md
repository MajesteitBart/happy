---
id: T-015
name: Graduate Codex attachments from experiment after verification
status: planned
workstream: WS-E
created: 2026-05-30T19:59:15Z
updated: 2026-05-30T19:59:15Z
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

- [ ] expImageUpload default flips only after Codex E2E evidence is present.
- [ ] Feature/settings copy says images and documents for Codex first, with Claude image support preserved and Claude document support documented as lower priority if still pending.
- [ ] Translations are updated or intentionally deferred with visible fallback handling.
- [ ] Release notes mention Codex-supported file types, limits, and known provider caveats.

## Traceability
- Story: none
- Acceptance criteria: none

## Technical Notes

Claude document E2E no longer blocks this task. Existing Claude image behavior should still be checked so default-on does not regress the already-working path.

## Definition of Done
- [ ] Implementation complete
- [ ] Tests pass
- [ ] Review complete
- [ ] Docs updated

## Evidence Log
- 2026-05-30T19:59:15Z: Created from .project/templates/task.md by `delano task add`.

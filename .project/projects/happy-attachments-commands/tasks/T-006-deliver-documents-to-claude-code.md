---
id: T-006
name: Deliver documents to Claude Code
status: planned
workstream: WS-C
created: 2026-05-30T19:58:55Z
updated: 2026-05-30T19:58:55Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-001, T-004]
conflicts_with: []
parallel: false
priority: high
estimate: M
story_id: 
acceptance_criteria_ids: []
---

# Task: Deliver documents to Claude Code

## Description

Extend the Claude launcher attachment content-block builder from image-only to verified document-capable content blocks.

## Acceptance Criteria

- [ ] Images keep magic-byte MIME detection and current behavior.
- [ ] PDF and safe text/code files are converted only if Claude SDK support is verified.
- [ ] Unsupported files are skipped with a debug log and user-visible status where appropriate.
- [ ] Unit tests cover image, PDF, text/code, and unsupported binary attachments.

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
- 2026-05-30T19:58:55Z: Created from .project/templates/task.md by `delano task add`.

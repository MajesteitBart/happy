---
id: T-017
name: Prove end-to-end handoff reliability
status: ready
workstream: WS-A
created: 2026-05-30T20:18:59Z
updated: 2026-05-30T20:18:59Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-001, T-002, T-003, T-004]
conflicts_with: []
parallel: false
priority: high
estimate: XL
story_id: US-001
acceptance_criteria_ids: [AC-001, AC-002]
---

# Task: Prove end-to-end handoff reliability

## Description

Add real end-to-end or scripted integration coverage for the remaining handoff claims that source-level lifecycle diagnostics cannot prove: desktop-to-mobile, mobile-to-desktop, abort-to-new-dialog, daemon restart, and detached multi-session behavior.

## Acceptance Criteria

- [ ] Run or add an automated desktop-to-mobile handoff scenario that proves history visibility and message reconciliation.
- [ ] Run or add an automated mobile-to-desktop resume scenario that proves the desktop runner receives the current context.
- [ ] Run or add an abort-to-new-dialog scenario that proves no repeated process-exited loop.
- [ ] Run or document daemon restart and detached multi-session behavior with sanitized evidence.
- [ ] Classify any uncovered case as reproduced, not reproduced, or blocked with the exact next action.

## Traceability
- Story: US-001
- Acceptance criteria: AC-001, AC-002

## Technical Notes

## Definition of Done
- [ ] Implementation complete
- [ ] Tests pass
- [ ] Review complete
- [ ] Docs updated

## Evidence Log
- 2026-05-30T20:18:59Z: Created from .project/templates/task.md by `delano task add`.

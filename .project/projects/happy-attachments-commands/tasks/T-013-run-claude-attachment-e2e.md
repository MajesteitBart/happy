---
id: T-013
name: Run Claude attachment E2E
status: deferred
workstream: WS-E
created: 2026-05-30T19:59:14Z
updated: 2026-05-30T21:16:33Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-003, T-004, T-006]
conflicts_with: []
parallel: false
priority: low
estimate: M
story_id: 
acceptance_criteria_ids: []
---

# Task: Run Claude attachment E2E

## Description

Lower-priority follow-up. Verify a real or local-harness Claude session can receive image, PDF, and text/code attachments from the app path once Codex-first rollout is handled.

## Acceptance Criteria

- [ ] PNG/JPEG still reach Claude as image blocks.
- [ ] PDF and text/code attachments are accepted or rejected with clear verified behavior.
- [ ] User-visible failure messages are specific enough to recover.
- [ ] Evidence records commands, fixture names, and limitations without private content.

## Traceability
- Story: none
- Acceptance criteria: none

## Technical Notes

This is no longer a blocker for Codex-first default-on. Existing Claude image behavior should still be covered before broad rollout, but Claude document support can follow later.

## Definition of Done
- [ ] Implementation complete
- [ ] Tests pass
- [ ] Review complete
- [ ] Docs updated

## Evidence Log

- 2026-05-30T21:16:33Z: Deferred with Claude document work; existing Claude image path remains preserved, but Claude document E2E is not blocking the Codex-first rollout.
- 2026-05-30T19:59:14Z: Created from .project/templates/task.md by `delano task add`.

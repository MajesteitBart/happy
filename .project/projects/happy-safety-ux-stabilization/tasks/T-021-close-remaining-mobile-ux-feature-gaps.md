---
id: T-021
name: Close remaining mobile UX feature gaps
status: ready
workstream: WS-D
created: 2026-05-30T20:19:00Z
updated: 2026-05-30T20:19:00Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-014, T-015]
conflicts_with: []
parallel: true
priority: medium
estimate: XL
story_id: US-007
acceptance_criteria_ids: [AC-007]
---

# Task: Close remaining mobile UX feature gaps

## Description

Track user-facing UX requests that were not fixed by the safety pass: mobile text copy, voice-to-text input, and AskUserQuestion parity with free-form Other/Respond controls.

## Acceptance Criteria

- [ ] Add mobile long-press/copy behavior for message text with tests or platform smoke evidence.
- [ ] Add voice-to-text draft input mode or record a scoped implementation blocker.
- [ ] Match AskUserQuestion UX with Other free text and Respond action where the provider supports it.
- [ ] Keep provider capability checks explicit when a UX feature is provider-limited.

## Traceability
- Story: US-007
- Acceptance criteria: AC-007

## Technical Notes

## Definition of Done
- [ ] Implementation complete
- [ ] Tests pass
- [ ] Review complete
- [ ] Docs updated

## Evidence Log
- 2026-05-30T20:19:00Z: Created from .project/templates/task.md by `delano task add`.

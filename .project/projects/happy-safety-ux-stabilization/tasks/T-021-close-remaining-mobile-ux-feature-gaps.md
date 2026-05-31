---
id: T-021
name: Close remaining mobile UX feature gaps
status: done
workstream: WS-D
created: 2026-05-30T20:19:00Z
updated: 2026-05-31T07:25:00Z
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

- [x] Add mobile long-press/copy behavior for message text with tests or platform smoke evidence.
- [x] Add voice-to-text draft input mode or record a scoped implementation blocker.
- [x] Match AskUserQuestion UX with Other free text and Respond action where the provider supports it.
- [x] Keep provider capability checks explicit when a UX feature is provider-limited.

## Traceability
- Story: US-007
- Acceptance criteria: AC-007

## Technical Notes

## Definition of Done
- [x] Implementation complete
- [x] Tests pass
- [x] Review complete
- [x] Docs updated

## Evidence Log
- 2026-05-30T20:19:00Z: Created from .project/templates/task.md by `delano task add`.
- 2026-05-31T07:25:00Z: Enabled mobile markdown long-press copy by default, added AskUserQuestion free-form Other answers and changed the action copy to Respond, and recorded voice-to-text draft input as blocked on choosing a dictation provider separate from the existing ElevenLabs voice assistant flow.

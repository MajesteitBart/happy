---
id: T-005
name: Lift attachment support to Claude and Codex only
status: planned
workstream: WS-B
created: 2026-05-30T19:58:38Z
updated: 2026-05-30T19:58:38Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-004]
conflicts_with: []
parallel: true
priority: high
estimate: S
story_id: 
acceptance_criteria_ids: []
---

# Task: Lift attachment support to Claude and Codex only

## Description

Replace the Claude-only app gate with normalized flavor support for Claude and Codex while retaining a clear unsupported-agent path for other flavors.

## Acceptance Criteria

- [ ] Claude and Codex sessions can enqueue attachments from the app.
- [ ] Gemini/OpenClaw/unknown unsupported paths still show a specific recovery message.
- [ ] The feature flag remains opt-in until E2E verification is complete.

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
- 2026-05-30T19:58:38Z: Created from .project/templates/task.md by `delano task add`.

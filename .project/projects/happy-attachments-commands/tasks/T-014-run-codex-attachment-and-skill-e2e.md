---
id: T-014
name: Run Codex attachment and skill E2E
status: done
workstream: WS-E
created: 2026-05-30T19:59:14Z
updated: 2026-05-30T21:12:31Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-007, T-008, T-010, T-011, T-012]
conflicts_with: []
parallel: false
priority: high
estimate: L
story_id: 
acceptance_criteria_ids: []
---

# Task: Run Codex attachment and skill E2E

## Description

Verify Codex receives image attachments, can read document temp files, and exposes/selects native $ skills in a connected session.

## Acceptance Criteria

- [x] Codex image attachments are visible to the model through app-server input.
- [x] Codex can read attached PDF/text/code files from the chosen temp path under expected sandbox modes.
- [x] $ autocomplete appears only in Codex sessions with native skills and invocation reaches Codex as intended.
- [x] Temp files are removed after turn/session completion.

## Traceability
- Story: none
- Acceptance criteria: none

## Technical Notes

## Definition of Done
- [x] Implementation complete
- [x] Tests pass
- [x] Review complete
- [x] Docs updated

## Evidence Log

- 2026-05-30T21:12:31Z: Live Codex 0.135.0 app-server smoke ran through CodexAppServerClient. skills/list returned native skills, a turn with a native skill item plus PNG + text attachment completed, the model read the exact text token and inspected the image, temp turn directory was empty after cleanup. Additional live turns read text/typescript attachments under read-only and danger-full-access sandboxes and cleaned temp files. Unit tests already cover workspace-write input building and cleanup.

- 2026-05-30T21:12:30Z: Live Codex app-server smoke verified attachments, native skill item submission, sandbox file reads, and cleanup.
- 2026-05-30T19:59:14Z: Created from .project/templates/task.md by `delano task add`.

---
id: T-001
name: Verify Claude and Codex attachment contracts
status: done
workstream: WS-A
created: 2026-05-30T19:58:38Z
updated: 2026-05-30T20:04:30Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: []
conflicts_with: []
parallel: false
priority: high
estimate: M
story_id: 
acceptance_criteria_ids: []
---

# Task: Verify Claude and Codex attachment contracts

## Description

Confirm current provider/session capabilities before implementation: Claude Code SDK content block support for images/PDF/text documents, Codex app-server turn input support for image/localImage and native skill input, and any version gates exposed by the connected terminal.

## Acceptance Criteria

- [x] Repo notes identify the active app/server/CLI protocol paths and explicitly exclude frozen happy-wire sessionProtocol as a production dependency.
- [x] Claude document support is verified from installed SDK types or official docs before coding document blocks.
- [x] Codex app-server input item and native skill APIs are verified against the installed/generated schema or official upstream docs.
- [x] Findings are recorded in Delano research with links or local file references.

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

- 2026-05-30T20:04:30Z: Verified active Happy runtime paths and provider contracts. Evidence recorded in research/provider-attachment-command-contracts: app sync loses MIME at UploadedAttachment/file-event, Claude SDK 0.2.96 types support image plus PDF/plain text DocumentBlockParam, generated Codex app-server schema from @openai/codex 0.130.0 supports image/localImage/skill UserInput plus skills/list and skills/changed, and happy-wire sessionProtocol is reference-only rather than production proof.

- 2026-05-30T20:02:14Z: Provider attachment and skill contracts must be verified before implementation.
- 2026-05-30T19:58:38Z: Created from .project/templates/task.md by `delano task add`.

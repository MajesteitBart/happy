---
id: T-022
name: Automate compatibility matrix evidence
status: done
workstream: WS-E
created: 2026-05-30T20:19:00Z
updated: 2026-05-31T07:12:47Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-016]
conflicts_with: []
parallel: true
priority: high
estimate: L
story_id: US-008
acceptance_criteria_ids: [AC-008]
---

# Task: Automate compatibility matrix evidence

## Description

Turn the improved but partly manual CI safety net into automated evidence for app/CLI/server compatibility and release confidence.

## Acceptance Criteria

- [x] Add automatic or scheduled compatibility matrix coverage for current app/server/CLI combinations.
- [x] Include previous supported self-host/server/CLI versions where a compatibility floor is declared.
- [x] Publish clear CI evidence or artifacts for green workflow status.
- [x] Keep slow integration separated from fast PR checks without losing routine coverage.

## Traceability
- Story: US-008
- Acceptance criteria: AC-008

## Technical Notes

- `pnpm test:compatibility` covers current app capability gating, server capability response, and CLI session/daemon socket clients.
- `pnpm evidence:compatibility` writes a version/floor/capability artifact consumed by CI.
- No previous historical compatibility floor is declared beyond the current minimums in `versionRoutes.ts`; the artifact records that declared floor.

## Definition of Done
- [x] Implementation complete
- [x] Tests pass
- [x] Review complete
- [x] Docs updated

## Evidence Log
- 2026-05-30T20:19:00Z: Created from .project/templates/task.md by `delano task add`.
- 2026-05-31T07:12:47Z: .project/projects/happy-safety-ux-stabilization/updates/T-022-compatibility-matrix-evidence.md

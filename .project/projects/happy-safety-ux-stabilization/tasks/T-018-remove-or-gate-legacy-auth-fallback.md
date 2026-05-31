---
id: T-018
name: Remove or gate legacy auth fallback
status: done
workstream: WS-C
created: 2026-05-30T20:18:59Z
updated: 2026-05-31T07:05:40Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-009]
conflicts_with: []
parallel: true
priority: high
estimate: L
story_id: US-005
acceptance_criteria_ids: [AC-005]
---

# Task: Remove or gate legacy auth fallback

## Description

Finish auth replay hardening by making the legacy client-generated challenge path disabled by default or explicitly migration-gated, and document/remove the advertised legacy fallback once compatibility allows it.

## Acceptance Criteria

- [x] Add config or migration gating so nonce auth is the default and legacy challenge auth is not silently accepted.
- [x] Add tests proving captured legacy auth tuples are rejected when fallback is disabled.
- [x] Update capabilities and docs so legacyAuthChallengeFallback reflects the configured posture.
- [x] Record the migration decision for old app/CLI/server pairs.

## Traceability
- Story: US-005
- Acceptance criteria: AC-005

## Technical Notes

- Legacy challenge auth is now rejected by default. Operators can temporarily set `HAPPY_ENABLE_LEGACY_AUTH_CHALLENGE_FALLBACK=1` for old published clients during migration.

## Definition of Done
- [x] Implementation complete
- [x] Tests pass
- [x] Review complete
- [x] Docs updated

## Evidence Log
- 2026-05-30T20:18:59Z: Created from .project/templates/task.md by `delano task add`.
- 2026-05-31T07:05:40Z: .project/projects/happy-safety-ux-stabilization/updates/T-018-legacy-auth-fallback-gate.md

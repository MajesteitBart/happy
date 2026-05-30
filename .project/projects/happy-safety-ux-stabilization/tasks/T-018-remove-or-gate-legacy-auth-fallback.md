---
id: T-018
name: Remove or gate legacy auth fallback
status: ready
workstream: WS-C
created: 2026-05-30T20:18:59Z
updated: 2026-05-30T20:18:59Z
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

- [ ] Add config or migration gating so nonce auth is the default and legacy challenge auth is not silently accepted.
- [ ] Add tests proving captured legacy auth tuples are rejected when fallback is disabled.
- [ ] Update capabilities and docs so legacyAuthChallengeFallback reflects the configured posture.
- [ ] Record the migration decision for old app/CLI/server pairs.

## Traceability
- Story: US-005
- Acceptance criteria: AC-005

## Technical Notes

## Definition of Done
- [ ] Implementation complete
- [ ] Tests pass
- [ ] Review complete
- [ ] Docs updated

## Evidence Log
- 2026-05-30T20:18:59Z: Created from .project/templates/task.md by `delano task add`.

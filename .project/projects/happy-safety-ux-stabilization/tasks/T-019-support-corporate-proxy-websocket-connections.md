---
id: T-019
name: Support corporate proxy WebSocket connections
status: ready
workstream: WS-B
created: 2026-05-30T20:18:59Z
updated: 2026-05-30T20:18:59Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-007, T-008]
conflicts_with: []
parallel: true
priority: high
estimate: L
story_id: US-004
acceptance_criteria_ids: [AC-004]
---

# Task: Support corporate proxy WebSocket connections

## Description

Move beyond proxy diagnostics/local bypass and ensure remote Socket.IO/WebSocket control honors http_proxy, https_proxy, all_proxy, and no_proxy consistently.

## Acceptance Criteria

- [ ] Identify all remote socket clients used by CLI/daemon/app-server flows.
- [ ] Implement proxy agent wiring or an explicit compatibility decision for each socket path.
- [ ] Add tests or a local proxy harness for http_proxy/https_proxy/all_proxy/no_proxy behavior.
- [ ] Keep proxy values redacted in logs and errors.

## Traceability
- Story: US-004
- Acceptance criteria: AC-004

## Technical Notes

## Definition of Done
- [ ] Implementation complete
- [ ] Tests pass
- [ ] Review complete
- [ ] Docs updated

## Evidence Log
- 2026-05-30T20:18:59Z: Created from .project/templates/task.md by `delano task add`.

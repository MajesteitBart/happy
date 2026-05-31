---
id: T-019
name: Support corporate proxy WebSocket connections
status: done
workstream: WS-B
created: 2026-05-30T20:18:59Z
updated: 2026-05-31T07:09:56Z
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

- [x] Identify all remote socket clients used by CLI/daemon/app-server flows.
- [x] Implement proxy agent wiring or an explicit compatibility decision for each socket path.
- [x] Add tests or a local proxy harness for http_proxy/https_proxy/all_proxy/no_proxy behavior.
- [x] Keep proxy values redacted in logs and errors.

## Traceability
- Story: US-004
- Acceptance criteria: AC-004

## Technical Notes

- `ApiSessionClient` and `ApiMachineClient` now share `createSocketIoProxyOptions()`.
- Proxy values are not logged; diagnostics expose presence booleans only.
- Mobile/web uses the platform network stack and does not use Node shell proxy env vars.

## Definition of Done
- [x] Implementation complete
- [x] Tests pass
- [x] Review complete
- [x] Docs updated

## Evidence Log
- 2026-05-30T20:18:59Z: Created from .project/templates/task.md by `delano task add`.
- 2026-05-31T07:09:56Z: .project/projects/happy-safety-ux-stabilization/updates/T-019-corporate-proxy-websocket-support.md

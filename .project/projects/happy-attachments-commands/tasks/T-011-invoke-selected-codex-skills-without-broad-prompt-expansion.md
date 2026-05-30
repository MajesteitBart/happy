---
id: T-011
name: Invoke selected Codex skills without broad prompt expansion
status: done
workstream: WS-D
created: 2026-05-30T19:59:14Z
updated: 2026-05-30T21:04:37Z
linear_issue_id: 
github_issue: 
github_pr: 
depends_on: [T-010]
conflicts_with: []
parallel: false
priority: high
estimate: M
story_id: 
acceptance_criteria_ids: []
---

# Task: Invoke selected Codex skills without broad prompt expansion

## Description

Submit selected $ skills through the native Codex skill input contract when available, with a narrow fallback only if native invocation is unavailable in the installed version.

## Acceptance Criteria

- [x] Known selected skills are sent as native skill input items or verified app-server equivalent.
- [x] Unknown  and $ inside paths, shell variables, and code remain untouched.
- [x] Fallback prompt expansion, if needed, is guarded by deterministic standalone-token parsing and documented as temporary.
- [x] Tests cover selected skill, unknown token, shell variable, path, and markdown/code examples.

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

- 2026-05-30T21:04:37Z: Known line-start tokens are converted to native Codex {type:'skill',name,path} input items before final text. Unknown tokens, shell variables, paths, fenced code, and inline code remain untouched. Verified with pnpm --filter happy typecheck and pnpm --filter happy exec vitest run src/codex/inputBuilder.test.ts src/codex/codexAppServerClient.test.ts src/utils/MessageQueue2.test.ts.

- 2026-05-30T21:04:31Z: Converting selected line-start Codex tokens into native app-server skill input items.
- 2026-05-30T19:59:14Z: Created from .project/templates/task.md by `delano task add`.

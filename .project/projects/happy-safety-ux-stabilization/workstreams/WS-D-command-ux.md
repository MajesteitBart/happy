---
id: WS-D
name: Command Rendering and UX Integrity
owner: Clark
status: done
created: 2026-05-30T13:39:41Z
updated: 2026-05-30T17:00:31Z
operating_mode: scoped-change
---

# Workstream: Command Rendering and UX Integrity

## Objective

Prevent internal command, skill, and compaction content from rendering as normal chat while improving recovery and copy affordances.

## Owned Files/Areas

- app message parser utilities
- app message render components
- command/compaction tests
- mobile copy/recovery UI surfaces

## Dependencies

- Fixtures for SDK wrapper messages, malformed wrappers, and long skill markdown.

## Risks

- Over-aggressive hiding can remove user-authored content.
- Parser changes need fixture breadth before replacing existing regex behavior.

## Handoff Criteria

- Internal wrappers render as system events or command chips.
- Raw skill instructions and compaction summaries are not shown as normal assistant/user messages.
- Parser fixtures cover malformed and adversarial wrapper content.

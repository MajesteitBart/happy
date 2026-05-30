---
type: research_intake
project: happy-attachments-commands
slug: provider-attachment-command-contracts
owner: team
status: opened
created: 2026-05-30T20:03:09Z
updated: 2026-05-30T20:03:09Z
---

# Research Plan: Provider attachment and command contracts

## Goal

Answer the research question and fold durable conclusions into canonical Delano project artifacts.

## Primary Question

What do the active Happy runtime path, Claude SDK, and Codex app-server support for images, documents, slash commands, and native skills?

## Scope

### In Scope

- Gather relevant evidence.
- Capture findings and decisions.
- Identify changes needed in `spec.md`, `plan.md`, `decisions.md`, workstreams, tasks, or updates.

### Out of Scope

- Marking delivery tasks done from research alone.
- External sync writes without normal Delano approval semantics.
- Storing secrets, credentials, or private machine paths.

## Current Phase

Folded forward

## Phases

- [x] Open research intake
- [x] Investigate sources and options
- [x] Summarize findings
- [x] Fold forward into canonical project artifacts or explicitly close as no-action

## Decisions Made

| Decision | Rationale |
| --- | --- |
| Use native Codex skills first | Generated Codex app-server schema supports `skills/list`, `skills/changed`, and `skill` user input. |
| Treat Codex documents as temp-file references | Generated schema supports images and skills but no document input item. |
| Keep flag graduation last | Provider behavior still needs E2E proof before default-on rollout. |

## Blockers

| Blocker | Owner | Check-back |
| --- | --- | --- |
| None for planning. Implementation still needs a v2 Codex client update decision. | Clark | During T-010 |

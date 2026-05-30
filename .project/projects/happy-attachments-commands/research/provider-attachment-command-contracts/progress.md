---
type: research_progress
project: happy-attachments-commands
slug: provider-attachment-command-contracts
created: 2026-05-30T20:03:09Z
updated: 2026-05-30T20:03:09Z
---

# Progress: Provider attachment and command contracts

## 2026-05-30T20:03:09Z

- Opened research intake for project `happy-attachments-commands`.
- Primary question: What do the active Happy runtime path, Claude SDK, and Codex app-server support for images, documents, slash commands, and native skills?

## Validation Evidence

- `delano validate` passed after project/task dependency status correction.
- Generated Codex app-server schema from installed `@openai/codex@0.130.0`.
- Confirmed installed Claude Agent SDK version `0.2.96`.
- Confirmed installed Anthropic SDK message types include `DocumentBlockParam` for base64 PDF and plain text.
- Confirmed generated Codex schema includes `skills/list`, `skills/changed`, and `UserInput` variants for `image`, `localImage`, and `skill`.

## Handoff Summary

- Capability probe supports starting implementation, with two caveats: Happy's local Codex app-server types are stale compared with generated schema, and Codex document support remains a temp-file workaround rather than a native document input.

---
id: WS-C
name: WS-C Claude and Codex Attachment Delivery
owner: Clark
status: planned
created: 2026-05-30T19:58:18Z
updated: 2026-05-30T19:58:18Z
---

# Workstream: WS-C Claude and Codex Attachment Delivery

## Objective
Convert encrypted file events into provider-appropriate Claude and Codex inputs, with safe Codex document temp-file handling.

## Owned Files/Areas
- `packages/happy-cli/src/claude/runClaude.ts`
- `packages/happy-cli/src/claude/claudeRemoteLauncher.ts`
- `packages/happy-cli/src/codex/runCodex.ts`
- `packages/happy-cli/src/codex/codexAppServerClient.ts`
- `packages/happy-cli/src/codex/codexAppServerTypes.ts`

## Dependencies
- WS-A capability verification.
- WS-B MIME-preserving file events.

## Risks
- Claude document support may reject assumed content blocks.
- Codex has no generic document input item, so document support depends on file readability.
- Decrypted temp files can leak if cleanup is incomplete.
- Attachments must be claimed by the correct user message.

## Handoff Criteria
- Claude image behavior remains unchanged.
- Claude documents work or fail with verified provider-specific behavior.
- Codex images are native input items.
- Codex documents are readable from a controlled temp location and cleaned up.

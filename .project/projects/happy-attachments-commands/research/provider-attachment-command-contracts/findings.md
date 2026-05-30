---
type: research_findings
project: happy-attachments-commands
slug: provider-attachment-command-contracts
created: 2026-05-30T20:03:09Z
updated: 2026-05-30T20:03:09Z
---

# Findings: Provider attachment and command contracts

## Source References

- `packages/happy-app/sources/sync/sync.ts`
- `packages/happy-app/sources/sync/attachmentTypes.ts`
- `packages/happy-app/sources/sync/suggestionCommands.ts`
- `packages/happy-wire/src/sessionProtocol.ts`
- `packages/happy-cli/src/claude/claudeRemoteLauncher.ts`
- `packages/happy-cli/src/codex/runCodex.ts`
- `packages/happy-cli/src/codex/codexAppServerClient.ts`
- `packages/happy-cli/src/codex/codexAppServerTypes.ts`
- `packages/happy-server/sources/app/api/routes/attachmentRoutes.ts`
- Installed Claude Agent SDK package version: `0.2.96`.
- Installed Codex package version: `0.130.0`.
- Generated Codex schema with `codex app-server generate-ts`.
- Claude Code SDK slash command docs: `https://code.claude.com/docs/en/agent-sdk/slash-commands`.
- Claude Code skills docs: `https://code.claude.com/docs/en/slash-commands`.
- Codex app-server docs: `https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md`.

## Observations

- Active Happy attachment path is app `sync.ts` encrypted upload + file event + CLI runner handling. `happy-wire` session protocol is marked reference-only and must not be used as production proof.
- `AttachmentPreview` already carries `mimeType`; `UploadedAttachment` does not, so MIME is lost before outgoing file events.
- `sync.ts` currently permits attachments only when `flavor` is empty or `claude`; Codex attachments are blocked before upload/send.
- Server attachment routes are opaque encrypted blob storage with 10MB caps and ownership checks. The server does not need plaintext MIME awareness for this feature.
- Claude current runner drains attachments and converts only magic-byte-detected images to Anthropic content blocks.
- Installed Anthropic SDK types include `ContentBlockParam`, `ImageBlockParam`, and `DocumentBlockParam`; document sources include base64 PDF and plain text.
- Claude SDK slash command docs say dispatchable commands are listed by the SDK `system/init` message as `slash_commands`; Happy already maps SDK metadata to `metadata.slashCommands`.
- Codex current Happy integration sends text-only turns. Its local cherry-picked `InputItem` type supports `text`, `image`, and `localImage`, but not skills.
- Generated Codex schema from installed `@openai/codex@0.130.0` includes v2 `UserInput` with `text`, `image`, `localImage`, `skill`, and `mention`.
- Generated Codex schema includes `skills/list`, `skills/changed`, `SkillsListResponse`, and `SkillMetadata`.
- Codex has no generic document input item. Documents need a controlled temp-file reference path unless a future provider API adds document input.
- App slash autocomplete currently prepends static `DEFAULT_COMMANDS`; this conflicts with live terminal-aware command behavior.

## Options Considered

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
- Keep Happy-managed static Codex skill registry | Simple and app-owned | Ignores native Codex skill APIs and risks drift | Reject as first approach |
- Use native Codex `skills/list` + `skill` user input | Matches connected terminal runtime and supports live updates | Requires updating Happy's stale Codex types/client | Preferred |
- Keep default slash commands in app | Preserves current suggestions when metadata is absent | UI can advertise commands unavailable in the connected terminal | Reject |
- Use temp files for Codex documents | Works with current Codex file tools and sandbox model | Requires cleanup and sandbox verification | Accept with strict safety gates |
- Flip attachment flag before provider E2E | Faster rollout | Exposes half-working Codex/document paths | Reject |

## Fold-Forward Candidates

| Finding | Target Artifact | Proposed Change |
| --- | --- | --- |
- Generated Codex schema supports native skills | T-010/T-011 | Query `skills/list`, listen for `skills/changed`, submit selected skills as native `skill` input |
- Claude SDK types support PDF/plain text document blocks | T-006 | Implement document blocks for `application/pdf` and safe text/code after runtime test |
- `UploadedAttachment` lacks MIME | T-004 | Add `mimeType` and emit it in active file events |
- `happy-wire` is reference-only | T-012 | Avoid counting only wire tests as production coverage |

## Open Questions

- Which Codex app-server client path should Happy use for v2 schema adoption while preserving existing remote-control behavior?
- What exact MIME list should ship first for Claude documents beyond PDF and plain text?
- Where should Codex temporary decrypted attachments live so they are readable but do not pollute the user's worktree?

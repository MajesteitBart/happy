---
name: Happy Attachments and Terminal Commands
slug: happy-attachments-commands
owner: Clark
status: complete
created: 2026-05-30T19:58:18Z
updated: 2026-05-30T21:16:33Z
outcome: Mobile/web users can send images and documents to Claude Code and Codex sessions, see only terminal-reported slash commands, and use Codex native $ skill autocomplete.
uncertainty: high
probe_required: true
probe_status: pending
---

# Spec: Happy Attachments and Terminal Commands

## Executive Summary
Happy should let mobile/web users attach useful context to a remote coding session, regardless of whether the connected terminal is Claude Code or Codex. The feature covers image and document attachments, live terminal-specific slash command suggestions, and Codex `$` skill autocomplete.

Delivery is Codex-first. Existing Claude image behavior should be preserved, but new Claude document support is lower priority and does not block the first useful rollout.

The implementation must use the active app/server/CLI runtime path. `packages/happy-wire/src/sessionProtocol.ts` is explicitly marked frozen/reference-only and is not production protocol, so it can inform compatibility checks but must not be treated as proof that the active product works.

The riskiest areas are provider-specific input contracts, Codex sandbox access to decrypted temporary files, and avoiding stale/hardcoded command suggestions that imply a command exists when the connected terminal cannot actually run it.

## Problem and Users
Users often need to send screenshots, PDFs, logs, code files, or other documents from mobile to a running Claude Code or Codex session. Today Happy has working image attachment infrastructure for Claude behind an experimental flag, but:

- the app drops attachments for non-Claude sessions;
- `mimeType` is present in app previews but lost before file events;
- Claude handling is image-only;
- Codex handling does not drain file events or build attachment input items;
- slash autocomplete includes static defaults instead of only what the connected terminal reports;
- Codex skills are not exposed as `$` autocomplete in the app.

The primary users are Happy mobile/web users who are controlling a desktop coding agent remotely and need to keep context handoff reliable from phone to terminal.

## Outcome and Success Metrics
- Claude Code sessions accept attached images and verified document types from mobile/web.
- Codex sessions accept attached images through native image input and can read document attachments through a verified temp-file reference path.
- The app emits `mimeType` for file events and preserves it through upload metadata.
- Slash suggestions reflect only live terminal metadata. If the connected terminal reports no slash commands, `/` shows no suggestions.
- Codex sessions expose native `$` skill suggestions from the connected Codex app-server skill registry.
- Attachment feature graduation happens only after Claude and Codex E2E evidence exists.
- Codex attachment and `$` skill support can graduate before Claude document support, as long as existing Claude image attachment behavior is not regressed.

## User Stories
- US-001: As a Happy mobile user, I want to attach a screenshot to Claude Code or Codex so the agent can reason about visual UI state.
- US-002: As a Happy mobile user, I want to attach a PDF, text file, log, or code file so the agent can inspect context that is not practical to paste into chat.
- US-003: As a Claude Code user, I want `/` autocomplete to show the slash commands that the current Claude SDK session actually reports.
- US-004: As a Codex user, I want `/` autocomplete to stay empty unless Codex exposes live slash commands, so the app does not invent unavailable commands.
- US-005: As a Codex user, I want `$` autocomplete for native Codex skills, with names and descriptions from the connected terminal runtime.

## Acceptance Scenarios
- AC-001: Given a Claude Code session, when the user attaches an image and sends a prompt, then Claude receives the image through the existing image content block path.
- AC-002: Given a Claude Code session and verified SDK document support, when the user attaches PDF/text/code files, then Claude receives supported document content blocks or a clear unsupported-file result.
- AC-003: Given a Codex session, when the user attaches an image, then Happy sends a Codex-supported image/localImage input item before the user text.
- AC-004: Given a Codex session, when the user attaches a PDF/text/code file, then the CLI writes a temporary decrypted file in a controlled location, references it in the turn, verifies sandbox readability, and removes it after use.
- AC-005: Given a Claude session with `metadata.slashCommands`, when the user types `/`, then only those commands are suggested.
- AC-006: Given a Codex session with native skills, when the user types `$`, then matching skills from Codex metadata are suggested and selected skills invoke through the verified Codex skill input contract.

## Scope
### In Scope
- App attachment UX for images and documents.
- MIME metadata preservation from app preview through file event.
- Claude Code attachment support for images plus verified document types.
- Codex attachment support for images plus temp-file referenced documents.
- Live-only slash command autocomplete.
- Native Codex `$` skill discovery, metadata, autocomplete, and invocation.
- Focused app/CLI/server tests and E2E evidence before default-on rollout.
- Codex-first implementation and rollout sequencing.

### Out of Scope
- Server-side plaintext attachment inspection.
- Generic binary document parsing inside Happy.
- Static curated slash command fallback lists.
- Shipping a Happy-only Codex skill registry unless native Codex skills are unavailable and the fallback is explicitly documented.
- Treating frozen `happy-wire` protocol tests as production validation.
- Making Claude document support a blocker for Codex rollout.

## Functional Requirements
- The app must support choosing images and documents from native and web surfaces.
- The selected attachment model must represent images and documents uniformly while preserving file-specific display data.
- Uploaded attachment metadata must include `mimeType`.
- File events must include `mimeType`, `ref`, `name`, `size`, and image metadata only when the attachment is an image.
- Attachment sending must be enabled for normalized Claude and Codex flavors only until other agents have verified support.
- Claude attachment delivery must preserve current image behavior and add verified document behavior.
- Codex attachment delivery must drain file events into the correct user turn and build provider-supported input items.
- Codex document temp files must be scoped, cleaned up, and readable under expected sandbox modes.
- Slash command suggestions must come from live session metadata.
- Codex skill suggestions must use a dedicated metadata field such as `codexSkills`, separate from Claude `skills`.

## Non-Functional Requirements
- Public repo artifacts must not include private paths, secrets, raw user attachments, or private session content.
- Decrypted attachment files must not be left in the repo/worktree after a turn or session completes.
- Unsupported files must fail clearly without losing the user’s message.
- E2E tests must use safe fixtures.
- Feature flag graduation must be evidence-gated.

## Assumptions
- Existing encrypted blob infrastructure remains the transport for attachment bytes.
- The server should remain blind to plaintext attachment content and MIME truth.
- Provider-specific handling belongs in the CLI runners, not the app.
- Current Codex app-server APIs are version-sensitive and need a probe before implementation.

## Needs Clarification
- Exact Claude Code document content-block support in the installed SDK version.
- Whether the installed Codex app-server supports native `skill` input items and `skills/list`; upstream docs say it does, but local generated types may lag.
- Preferred supported document MIME set for first release.

## Hypotheses and Unknowns
- Hypothesis: App document picker URIs can be read by the existing native/web `readFileBytes` abstraction.
- Hypothesis: Codex can read attachment temp files if they are written under an allowed project-scoped path and the sandbox policy is set correctly.
- Unknown: Whether PDF support should be native provider document blocks, text extraction, or file-reference-only per provider.

## Touchpoints to Exercise
- `packages/happy-app/sources/-session/SessionView.tsx`
- `packages/happy-app/sources/components/AgentInput.tsx`
- `packages/happy-app/sources/components/AgentInputAttachmentStrip.tsx`
- `packages/happy-app/sources/sync/sync.ts`
- `packages/happy-app/sources/sync/attachmentTypes.ts`
- `packages/happy-app/sources/sync/suggestionCommands.ts`
- `packages/happy-cli/src/claude/claudeRemoteLauncher.ts`
- `packages/happy-cli/src/claude/runClaude.ts`
- `packages/happy-cli/src/codex/runCodex.ts`
- `packages/happy-cli/src/codex/codexAppServerClient.ts`
- `packages/happy-cli/src/codex/codexAppServerTypes.ts`
- `packages/happy-server/sources/app/api/routes/attachmentRoutes.ts`

## Probe Findings
- App `AttachmentPreview` already includes `mimeType`; `UploadedAttachment` does not.
- `sync.ts` currently gates attachments to Claude only and omits `mimeType` from file events.
- Claude runner already drains attachments and currently converts only magic-byte-detected images into content blocks.
- Codex runner currently sends text-only turns and does not drain attachments.
- App autocomplete supports configurable prefixes, but suggestion logic currently handles only `/` and `@`.
- `AgentInputAutocomplete` already returns null for empty suggestion arrays.
- Claude SDK docs say `system/init` lists available dispatchable slash commands.
- Current Codex app-server docs describe native skill APIs and `$<skill-name>` behavior; local Happy types may need regeneration or targeted extension.

## Footguns Discovered
- Do not use `packages/happy-wire/src/sessionProtocol.ts` as production evidence; it says the active product still uses a legacy protocol path.
- Do not default the feature on before Codex document temp-file readability and cleanup are verified.
- Do not expand arbitrary `$token` text in Codex prompts; that would corrupt shell variables, paths, and code.
- Do not leave decrypted attachments in user repos or commit them accidentally.

## Remaining Unknowns
- Installed provider version drift for Claude SDK and Codex app-server.
- Best exact temp-file root for Codex read access without worktree pollution.
- Whether web document picker blob/data URIs need extra handling beyond current fetch-based byte reads.

## Dependencies
- Claude Code SDK installed version and content block contract.
- Codex app-server installed version and generated schema.
- Expo document picker support across mobile/web.
- Existing attachment upload/download server routes.

## Approval Notes

- 2026-05-30T20:02:14Z: Validated planning contract and starting provider capability probe.
- This is a public repo. Keep tasks and commits generic and sanitized.
- Public docs or issue text must not mention private workspace paths or private session details.

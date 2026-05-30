---
name: Happy Attachments and Terminal Commands
status: active
lead: Clark
created: 2026-05-30T19:58:18Z
updated: 2026-05-30T20:02:14Z
linear_project_id: 
risk_level: high
spec_status_at_plan_time: planned
---

# Delivery Plan: Happy Attachments and Terminal Commands

## What Changed After Probe
The attached flattened plan was repo-checked and corrected before task creation.

- Keep the attachment workstream: the app does lose MIME metadata and gates attachments to Claude only.
- Replace the Codex skill strategy: use native Codex app-server skill discovery/invocation first, not a Happy-only prompt-expansion registry.
- Treat `packages/happy-wire/src/sessionProtocol.ts` as reference-only, not production validation.
- Move `expImageUpload` default-on graduation to the final rollout task after Claude and Codex E2E evidence exists.
- Add explicit safety requirements for decrypted Codex temp files.

## Technical Context
Happy already has encrypted attachment blob transport and server upload/download routes. The active product path is app `sync.ts` file events plus CLI runner handling, not the frozen `happy-wire` session protocol.

Claude Code already receives image attachments via the CLI path. Codex currently sends text-only turns to app-server even though app-server supports image input items. Documents are not first-class Codex input items, so Codex document support needs a verified temp-file reference path.

Slash command metadata already flows from Claude SDK metadata into session metadata. The app currently mixes that live metadata with static default commands, which conflicts with terminal-aware behavior.

## Architecture Decisions
- App remains provider-agnostic for upload/encryption/file-event emission; provider-specific conversion happens in CLI runners.
- Server remains blind to plaintext content and does not store MIME-truth records.
- Codex skills use native app-server skill APIs when available. Prompt expansion is only a documented fallback if native invocation cannot be verified.
- `codexSkills` is a dedicated metadata field. Do not overload Claude `skills`.
- Attachment feature graduation is evidence-gated by Claude and Codex E2E.

## Policy and Contract Checks
- [x] `.project` remains the execution source of truth
- [x] Probe decision is explicit
- [x] Evidence gates are defined before handoff
- [x] External sync writes require dry-run or operator approval
- [x] Public-repo task text excludes private paths, secrets, and raw attachment content

## Generated Artifact Map
- `spec.md`: corrected product and technical contract for attachments, live slash commands, and Codex `$` skills.
- `plan.md`: delivery order, risk gates, and rollout strategy.
- `workstreams/`: five focused streams for capability probes, app metadata/UX, provider delivery, commands/skills, and verification.
- `tasks/`: fifteen implementation tasks with dependencies and acceptance criteria.

## Complexity Exceptions
- Codex documents require writing decrypted bytes to disk so Codex can read them. This is safety-sensitive and must include strict cleanup.
- Codex native skills are version-sensitive. Local generated types may lag upstream docs, so T-001 must verify installed behavior before T-010/T-011.
- Claude document blocks must be verified against the installed SDK before implementation. Do not infer from image support alone.

## Probe-Driven Architecture Changes
Tasks T-001 and T-002 are required before implementation. If either provider contract does not match current assumptions, adjust tasks before coding.

## Workstream Design
- WS-A Provider Capability Spikes: verify provider contracts and active Happy runtime paths.
- WS-B Attachment UX and Wire Metadata: document picker, unified preview model, MIME metadata, and flavor gate.
- WS-C Claude and Codex Attachment Delivery: provider-specific content conversion and Codex temp-file handoff.
- WS-D Terminal Commands and Codex Skills: live slash metadata, native Codex `$` skills, and safe invocation.
- WS-E Verification and Rollout: type/schema tests, E2E evidence, and feature graduation.

## Milestone Strategy
- M1: Project contract complete and validation clean.
- M2: Provider capability probes complete, with updated implementation notes.
- M3: App can select and send MIME-preserving image/document file events to Claude/Codex sessions.
- M4: Claude and Codex runners consume attachments correctly.
- M5: Terminal-aware slash commands and Codex `$` autocomplete work from live metadata.
- M6: E2E evidence captured; feature flag graduation decision made.

## Rollout Strategy
- Keep the existing experimental flag off by default while building.
- Land app metadata/UX separately from provider runtime delivery.
- Verify Claude first because the image path already exists.
- Isolate Codex attachment temp-file work in its own change.
- Enable default-on only after E2E proves both supported agent paths.

## Test Strategy
- Unit tests for attachment preview/upload metadata and file-event MIME emission.
- CLI tests for Claude content-block conversion and Codex input item building.
- CLI tests for Codex skill discovery/invocation parsing, especially `$` in shell variables, paths, and code.
- App tests for live-only slash suggestions, `$` suggestions, and empty autocomplete behavior.
- E2E/manual harness evidence for Claude image/document delivery and Codex image/document/skill behavior.

## Rollback Strategy
- App picker/preview changes can remain behind the experimental flag.
- Provider delivery changes are separable by runner; Claude and Codex can roll back independently.
- Live-only slash suggestions can be reverted without affecting attachments.
- Codex `$` skills can be disabled by omitting the `$` prefix and metadata field.

## Remaining Delivery Risks
- Codex app-server schema drift between upstream docs and installed package.
- Claude SDK document block support may differ from assumptions.
- Mobile document picker behavior may vary between native and web.
- Decrypted temp-file cleanup must be robust across aborts, crashes, and session exits.
- Default-on rollout could expose provider caveats too early if E2E is shallow.

---
id: WS-E
name: WS-E Verification and Rollout
owner: Clark
status: active
created: 2026-05-30T19:58:18Z
updated: 2026-05-30T21:05:13Z
---

# Workstream: WS-E Verification and Rollout

## Objective
Prove the feature works end to end before default-on rollout and keep tests focused on active product paths.

## Owned Files/Areas
- App tests for settings, sync, attachment previews, autocomplete.
- CLI tests for Claude content blocks, Codex input items, and Codex skills.
- E2E/manual fixture notes under this Delano project.
- Settings and translations for feature graduation.

## Dependencies
- WS-B, WS-C, and WS-D implementation tasks.

## Risks
- Typecheck may pass while provider behavior fails without real sessions.
- E2E fixtures can accidentally include private content if not curated.
- Default-on rollout can outpace documented provider caveats.

## Handoff Criteria
- App and CLI tests pass.
- Claude attachment E2E evidence is recorded.
- Codex attachment and `$` skill E2E evidence is recorded.
- Feature flag default changes only after evidence gates pass.

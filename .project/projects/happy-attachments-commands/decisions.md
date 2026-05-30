---
name: Happy Attachments and Terminal Commands
slug: happy-attachments-commands
owner: Clark
created: 2026-05-30T19:58:18Z
updated: 2026-05-30T19:58:18Z
---

# Decisions: Happy Attachments and Terminal Commands

## Active Decisions
- 2026-05-30: Use the active app/server/CLI runtime path for attachment validation. `happy-wire` session protocol files are reference-only because the file itself says they are not production protocol.
- 2026-05-30: Preserve MIME metadata in app-side attachment metadata and encrypted file events; keep the server blind to plaintext attachment content.
- 2026-05-30: Enable attachments only for Claude and Codex until other agent flavors have verified provider handling.
- 2026-05-30: Use live terminal slash command metadata only. Remove static slash defaults from autocomplete behavior.
- 2026-05-30: Prefer native Codex app-server skills for `$` autocomplete and invocation. Happy-only prompt expansion is fallback-only.
- 2026-05-30: Keep attachment feature default-off until Claude and Codex E2E evidence exists.
- 2026-05-30: Codex document attachments may use temporary decrypted files, but only in a controlled hidden location with cleanup and sandbox-read verification.

## Superseded Decisions
- None.

## Open Decision Questions
- Exact Claude document content-block contract for installed SDK version.
- Exact Codex native skill schema for installed app-server version.
- First-release supported document MIME set.
- Final temp-file root for Codex document readability without worktree pollution.

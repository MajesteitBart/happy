---
name: Happy Safety and UX Stabilization
slug: happy-safety-ux-stabilization
owner: Bart
created: 2026-05-30T09:49:30Z
updated: 2026-05-30T13:39:41Z
---

# Decisions: Happy Safety and UX Stabilization

## Active Decisions

- Prioritize safety and user experience over feature breadth for this project.
- Keep the earlier dependency/Codex install project separate from this broader safety/UX stabilization project.
- Treat session lifecycle and sync as protocol problems requiring explicit states, durable reconciliation, and tests.
- Treat daemon localhost control and replayable auth challenges as security issues, not only hardening nice-to-haves.
- Treat privacy documentation and analytics defaults as product trust requirements.
- Use Delano artifacts only for public-safe planning. Do not include secrets, raw logs, private local paths, or personal context.

## Superseded Decisions

- None.

## Open Decision Questions

- Should analytics default off for all OSS builds, or only for self-host builds?
- What minimum self-host server version should the capabilities contract support?
- Should daemon control remain tokenized localhost HTTP for the first pass or move directly to OS-native IPC?

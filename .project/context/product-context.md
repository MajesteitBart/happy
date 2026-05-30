# Product Context

## Users
- Primary users are engineers using Claude Code or Codex who want to monitor, resume, or take over sessions from mobile, web, or desktop.
- Secondary users are contributors maintaining the app, CLI, server, and delivery/runtime tooling.

## Core Flows
- Install and run `happy` instead of raw `claude` or `codex`.
- Authenticate/link a machine and view sessions from the Happy app/web client.
- Resume or take over an active coding-agent session across devices.
- Keep encrypted sync, notifications, and shared session state working across CLI, app, and server boundaries.

## Constraints
- End-to-end encryption and cross-device continuity are core product promises.
- PR quality bar favors bug fixes first and requires real proof for UI-facing changes; unit tests alone are not enough.
- Core protocol, sync, encryption, and server changes are higher risk and should not be treated like casual refactors.

# Project Structure

## Canonical Boundaries
- `AGENTS.md`: root agent workflow rules; currently only adds the non-force `sync to main` workflow.
- `.project/`: Delano delivery truth, including context, projects, registry, and templates.
- `.agents/`: canonical Delano runtime assets used by agents in this repo.
- `.claude/`: compatibility mirror for agents that still expect Claude-style paths.
- `.delano/`: optional Delano viewer/presentation layer; not the delivery source of truth.

## Runtime Areas
- `packages/happy-app`: Expo/React Native app with web and Tauri entry points.
- `packages/happy-cli`: published `happy` CLI wrapper for Claude Code and Codex.
- `packages/happy-agent`: remote agent control CLI.
- `packages/happy-server`: self-host server and bundled web app runtime.
- `packages/happy-wire`: shared wire contracts and Zod schemas.
- `packages/happy-app-logs`: lightweight log service tooling.
- `packages/codium`: Electron-based desktop package.
- `scripts/` and `environments/`: repo-level helper scripts and environment orchestration.

## Documentation Areas
- `README.md`: product mission and install/use entry point.
- `docs/CONTRIBUTING.md`: contribution priorities, review bar, and dev setup.
- `docs/plans/`, `docs/research/`, `docs/experimental/`: design history, research, and active technical notes.

## Working Notes
- Current docs still sometimes describe four primary packages, but the actual workspace list contains seven packages. Prefer `package.json` at the repo root for boundaries.
- Avoid copying machine-local paths or logs into context artifacts.

# Project Overview

## Mission
- Happy is an open-source client/server toolchain for using Claude Code and Codex from phone, web, and desktop while keeping session control and sync encrypted.

## Active Delivery Scopes
- Active Delano project: `happy-bugfix-stabilization`
- Current project reality: planned stabilization scope with populated `spec.md`, `plan.md`, `decisions.md`, four workstreams, and ten tasks.
- Current status: `delano status` reports eight ready tasks, two blocked tasks, and ten total tasks.

## Current Health
- Core product surfaces are real and active: app, CLI, server, shared wire contracts, remote-agent tooling, and supporting desktop/log packages.
- Delano is installed in-repo and the source of truth is local-first under `.project/` and `.agents/`.
- Delano project-local checks pass for dependency graph, status transitions, local sync map, and GitHub issue reference formatting.
- Full `delano validate` still fails on Delano runtime/compatibility checks: a sessions-skill absolute path example, missing `.claude/common/log-safety.js`, root `scripts/` path assumptions, and a hard-coded sample project lookup.

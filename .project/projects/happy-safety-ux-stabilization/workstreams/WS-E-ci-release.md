---
id: WS-E
name: CI and Release Safety Net
owner: Clark
status: planned
created: 2026-05-30T13:39:41Z
updated: 2026-05-30T13:39:41Z
operating_mode: scoped-change
---

# Workstream: CI and Release Safety Net

## Objective

Expand verification from narrow smoke checks into package-wide and integration coverage that protects the safety/UX contracts.

## Owned Files/Areas

- root `package.json`
- `.github/workflows`
- package test configs
- integration fixture scripts

## Dependencies

- Stable package scripts for typecheck/test/build.
- Reasonable CI runtime budget.

## Risks

- Broad CI can become flaky if integration fixtures depend on external services.
- Root scripts may expose existing unrelated failures and need staged adoption.

## Handoff Criteria

- Root scripts exist for typecheck/test/build.
- CI runs package unit tests plus targeted integration/security/parser checks.
- Self-host compatibility smoke exists or has a clear staged follow-up.

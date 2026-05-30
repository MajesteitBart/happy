---
id: WS-A
name: Dependency Install Stabilization
status: active
owner: Clark
created: 2026-05-30T08:35:32Z
updated: 2026-05-30T15:13:48Z
operating_mode: scoped-change
---

# Workstream: Dependency Install Stabilization

## Intent

Resolve or explicitly classify dependency install warnings and package pin risks before runtime fixes are released.

## Scope

- zod v3/v4 and `@anthropic-ai/claude-agent-sdk` compatibility.
- `@modelcontextprotocol/sdk` security-sensitive pin.
- Native/postinstall and platform install failure surfaces.
- Bart's fresh-install dependency friction.

## Evidence

- Upstream #1265, #1224, #499.
- `packages/happy-cli/package.json`.
- `pnpm-lock.yaml`.
- Root `package.json` postinstall and `onlyBuiltDependencies`.

## Exit Criteria

- Dependency strategy is implemented or documented with a clear deferral.
- Install warnings have a reproducible command and expected output.
- Any security-sensitive dependency deferral has explicit rationale and follow-up task.

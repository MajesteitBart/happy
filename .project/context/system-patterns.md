# System Patterns

## Handbook-First Delivery
- Agent work starts from `AGENTS.md`, then the active project contract under `.project/projects/`, then `.agents/README.md` and relevant skills/scripts.

## File-Contract-First State
- `.project/` is the delivery contract layer.
- `.agents/` is the canonical runtime layer.
- `.claude/` may mirror runtime assets for compatibility, but changes should treat `.agents/` as canonical.

## Thin Runtime Wrapping
- Happy’s product architecture wraps upstream agent CLIs rather than replacing them: the `happy` CLI brokers sessions to app/server surfaces while preserving agent workflows.
- Delano should stay similarly conservative: record context, rules, validation, and evidence without creating extra truth sources.

## Compatibility Without Dual Truth
- When docs or adapters mention alternate paths, prefer the repo-local canonical path if it exists.
- Current validation debt shows why: one self-test still calls `scripts/lease-manager.mjs` even though the installed canonical path is `.agents/scripts/lease-manager.mjs`.

## Conservative Installation
- Treat `delano install` output as a starting scaffold only.
- After install, replace placeholders, validate what is actually present, and record unresolved runtime/path bugs explicitly instead of normalizing them away.

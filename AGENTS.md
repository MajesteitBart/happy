# Agent Workflow

## Delano Workflow

This repository uses the Delano runtime installed under `.agents/` and project
contracts under `.project/`. Treat `.agents/README.md`, `HANDBOOK.md`, and
`.project/context/` as shared operating context before starting substantial work.

Use the `delano` CLI for Delano state changes instead of hand-rolling project
contract edits when a command exists. This matters because the CLI preserves the
expected file layout, lifecycle metadata, validation checks, and handoff trail.

- Check the active project contract in `.project/projects/` before planning or
  implementation.
- Use `delano research` for repo-native research intake when scope or evidence
  is uncertain.
- Record meaningful delivery updates through Delano commands or templates.
- Run `delano status` during orientation and `delano validate` before closeout
  when Delano runtime or project contracts are touched.
- If `delano validate` fails, report the exact failure and whether it is caused
  by repo work, Delano runtime issues, or environment constraints.

## Sync To Main

When the user says `sync to main` or `synt to main`, they mean:

1. Fetch `origin/main`.
2. Rebase the current branch on `origin/main`.
3. Push the current HEAD directly to `main` with a normal push, for example:
   `git push origin HEAD:main`

Do not force push for this workflow.

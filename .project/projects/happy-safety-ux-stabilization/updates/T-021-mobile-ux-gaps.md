---
timestamp: 2026-05-31T07:25:00Z
task: T-021
type: completion
---

# T-021 Mobile UX Gaps

Closed the actionable mobile UX gaps and recorded the scoped blocker.

- Mobile message copy: enabled `markdownCopyV2` by default so mobile long-press opens the text-selection/copy flow. Existing explicit opt-outs are preserved.
- AskUserQuestion parity: added free-form Other answers per question and changed the submit action copy to Respond. The UI still submits through the provider tool response path only when a pending `tool.permission.id` exists.
- Voice-to-text draft input: not implemented in this pass. The app already has an ElevenLabs voice assistant that sends messages through its own session tool flow, but draft dictation needs a separate provider/API decision and text-insertion flow to avoid mixing paid voice assistant behavior with local composer dictation.

Validation:

- `pnpm --filter happy-app exec vitest run sources/sync/localSettings.test.ts sources/components/modelModeOptions.test.ts`
- `pnpm --filter happy-app typecheck`

# T-015 Message Taxonomy Rendering

- Added explicit command and system-event message types for reducer output.
- Collapsed Claude command wrappers into command/skill invocation messages before UI rendering.
- Converted compact summaries into collapsed protocol events so summary bodies do not render as assistant text.
- Added taxonomy, reducer, parser, and raw normalizer regression coverage.

Verification:
- pnpm --filter happy-app exec vitest run sources/sync/messageTaxonomy.test.ts sources/components/parseLocalCommandMessage.spec.ts sources/sync/reducer/reducer.spec.ts sources/sync/typesRaw.spec.ts
- pnpm --filter happy-app typecheck

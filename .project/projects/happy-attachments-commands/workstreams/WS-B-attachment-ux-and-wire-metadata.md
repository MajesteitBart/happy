---
id: WS-B
name: WS-B Attachment UX and Wire Metadata
owner: Clark
status: done
created: 2026-05-30T19:58:18Z
updated: 2026-05-30T20:44:23Z
---

# Workstream: WS-B Attachment UX and Wire Metadata

## Objective
Make mobile/web attachment selection and encrypted file-event metadata work for images and documents without provider-specific logic in the app.

## Owned Files/Areas
- `packages/happy-app/sources/-session/SessionView.tsx`
- `packages/happy-app/sources/components/AgentInput.tsx`
- `packages/happy-app/sources/components/AgentInputAttachmentStrip.tsx`
- `packages/happy-app/sources/sync/attachmentTypes.ts`
- `packages/happy-app/sources/sync/sync.ts`
- `packages/happy-app/sources/utils/readFileBytes.*`

## Dependencies
- WS-A provider/path probe must be complete.

## Risks
- Document picker URI behavior may differ between native and web.
- MIME metadata can be lost if the upload model stays image-shaped.
- Flipping the feature flag early would expose half-working provider support.

## Handoff Criteria
- Images and documents share one attachment preview/send path.
- File events include MIME metadata.
- Attachments are enabled only for verified Claude/Codex flavors.
- Unsupported agents and upload/read failures have clear user-facing behavior.

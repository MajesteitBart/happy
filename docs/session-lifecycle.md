# Session Lifecycle Contract

This document is the source of truth for Happy session ownership, handoff, abort, recovery, and archive semantics. It maps the current implementation and defines the contract future code should follow.

Related docs:
- `realtime-sync-and-rpc.md`: socket scopes, rooms, and RPC routing.
- `protocol.md`: encrypted update payloads and sequencing.
- `session-protocol.md`: encrypted chat event stream.
- `cli-architecture.md`: CLI and daemon process ownership.

## Current Entry Points

Session creation and durable fan-out:
- `packages/happy-server/sources/app/api/routes/sessionRoutes.ts`: `POST /v1/sessions` creates or reuses a session by tag and emits `new-session`.
- `packages/happy-server/sources/app/api/routes/v3SessionRoutes.ts`: `POST /v3/sessions/:id/messages` is the canonical HTTP send path for app-created messages.
- `packages/happy-server/sources/app/events/eventRouter.ts`: builds `new-session`, `new-message`, `update-session`, and `delete-session` updates.
- `packages/happy-server/sources/storage/types.ts`: stores the update body union persisted and fanned out by the server.

App sync and handoff:
- `packages/happy-app/sources/sync/sync.ts`: handles `new-message`, `new-session`, `update-session`, reconnect invalidation, outbox flush, message pagination, and control-return refetch.
- `packages/happy-app/sources/sync/ops.ts`: sends app RPCs for `spawn-happy-session`, `abort`, `permission`, and `switch`.
- `packages/happy-app/sources/-session/SessionView.tsx`: calls `onSessionVisible` when the user opens a session.

CLI session owner:
- `packages/happy-cli/src/api/apiSession.ts`: owns one session-scoped socket, registers RPC handlers, sends encrypted messages, sends keepalive activity, handles server updates, and exits on archive metadata.
- `packages/happy-cli/src/claude/loop.ts`: switches Claude between local and remote launchers.
- `packages/happy-cli/src/claude/runClaude.ts`: creates or reconnects a server session and seeds metadata.
- `packages/happy-cli/src/codex/runCodex.ts`: owns Codex app-server thread startup, turn send/wait, abort handling, error reporting, keepalive, and process termination.
- `packages/happy-cli/src/agent/acp/runAcp.ts`, `packages/happy-cli/src/gemini/runGemini.ts`, and `packages/happy-cli/src/openclaw/runOpenClaw.ts`: follow the same broad remote queue, abort, keepalive, and event pattern for other agents.

Daemon and machine control:
- `packages/happy-cli/src/daemon/controlServer.ts`: exposes local daemon control endpoints for session started, list, stop, spawn, and daemon stop.
- `packages/happy-cli/src/daemon/run.ts`: spawns daemon-owned remote sessions, tracks child processes, handles tmux fallback, and reconnects existing sessions with `HAPPY_RECONNECT_*` environment variables.
- `packages/happy-cli/src/daemon/controlClient.ts`: app/CLI helper for calling the local daemon control server.

Existing lifecycle-like fields:
- `Session.metadata.lifecycleState`: currently `running`, `archiveRequested`, or `archived` in CLI metadata.
- `Session.metadata.lifecycleStateSince`: timestamp for metadata lifecycle changes.
- `Session.metadata.startedBy`: `daemon` or `terminal`.
- `Session.metadata.hostPid`: local process id for the session owner.
- `Session.metadata.flavor`: agent family, such as `claude` or `codex`.
- `Session.agentState.controlledByUser`: whether app/mobile currently owns input.
- Socket activity: `session-alive` emits `thinking` and `mode`.
- Encrypted session protocol: `turn-start`, `turn-end`, and `stop` describe turn-level state, not process ownership.

## Lifecycle States

The canonical session lifecycle is:

`created -> local-active -> remote-active -> aborting -> recovering -> completed/error -> archived`

`created`
: The server session exists and has encryption metadata, but no agent process ownership has been proven yet. A new `POST /v1/sessions` response or `new-session` update enters this state until the CLI session socket connects and starts keepalive.

`local-active`
: A terminal-owned interactive process owns input. Desktop stdin/stdout is attached. App sends should queue or request a switch before expecting the agent to consume app input. Existing Claude path enters this through `claudeLocalLauncher`.

`remote-active`
: A daemon/session-scoped CLI process owns input from the Happy server. App messages may be sent through `/v3/sessions/:id/messages`, the CLI drains them from `ApiSessionClient`, and `session-alive` should report mode `remote`.

`aborting`
: A user or permission path requested cancellation of the current turn. The owner must unblock pending tool permissions, interrupt or cancel the current provider turn where possible, emit a content-free abort/turn-end signal, and return to `remote-active` if the process remains usable.

`recovering`
: The app, server, daemon, or session process detected a disconnect, missing sequence, crashed provider process, stale pending permission, daemon restart, or reconnect-in-place. The owner must reconcile from durable server state before accepting more input.

`completed/error`
: The provider turn or process has ended. `completed` means the turn ended normally and the process can accept more input. `error` means the process or transport failed and the UI should show recovery action instead of an unexplained generic status.

`archived`
: The session is inactive. `active=false` on the server or `metadata.lifecycleState=archived` tells session owners to stop accepting input and exit. A session in this state should not be resurrected without an explicit resume/fork action.

## Transition Contract

Creation:
- Server creates the durable session and emits `new-session`.
- CLI creates metadata with `startedBy`, `hostPid`, `flavor`, and `lifecycleState`.
- Daemon-spawned sessions must start in remote mode.
- A terminal-created Claude session may start in local mode.

Local to remote:
- Trigger: app `sessionSwitch(sessionId, 'remote')`, local slash/special command, or daemon spawn.
- Required before transition: desktop owner must stop reading local input for the next turn.
- Required after transition: CLI sends an encrypted `switch remote` event and `session-alive` with mode `remote`.
- App must refetch messages when `agentState.controlledByUser` changes from false to true.

Remote to local:
- Trigger: app `sessionSwitch(sessionId, 'local')` or local user action.
- Required before transition: remote queue must stop accepting new server input for the active turn.
- Required after transition: CLI sends an encrypted `switch local` event and `session-alive` with mode `local`.
- If active shell/monitor subprocesses cannot be preserved, the transition must emit an explicit cancelled/error event rather than silently losing them.

Abort:
- Trigger: app `sessionAbort`, permission denial with `decision: 'abort'`, local Ctrl-C, or provider-specific interrupt.
- Required behavior: enter `aborting`, resolve pending permission prompts with abort/cancel semantics, interrupt provider turn if active, and ignore stale post-abort completion events for the next turn.
- Required output: an encrypted `turn-end` with status `cancelled` or provider-compatible `turn_aborted`, plus a keepalive update with `thinking=false`.
- Postcondition: return to `remote-active` if the process can continue; otherwise enter `recovering` or `completed/error`.

Disconnect and reconnect:
- Trigger: socket `disconnect`, `connect_error`, missing update sequence, daemon restart, process restart, or app reconnect.
- Required behavior: enter `recovering`, re-register RPC handlers, fetch durable messages by sequence, re-fetch session metadata and agent state, then leave recovery only when the session owner and app agree on last known sequence and control owner.
- Socket events are hints. Durable message history and session metadata are authoritative.

Process exit:
- Normal process exit should enter `completed/error` with an explicit status.
- Unexpected process exit should enter `completed/error` with an error reason and should not be rendered only as a free-form chat message.
- If recovery is possible, daemon reconnect should move the session to `recovering` and then `remote-active`.

Archive:
- Trigger: `POST /v1/sessions/:sessionId/archive`, metadata `archiveRequested`, or local kill-session handler.
- Required behavior: set server `active=false` or metadata `lifecycleState=archived`, emit activity/invalidation, stop accepting input, close session-scoped sockets, and terminate local child processes.

## Ownership Rules

- `local-active`: terminal owns input; app input must not be treated as already consumed by the agent.
- `remote-active`: server/app owns input; CLI drains durable messages from the session.
- `aborting`: only cancellation and cleanup commands are accepted.
- `recovering`: no new user input should be consumed until sequence and owner are reconciled.
- `archived`: no input is accepted.

The owner of input and the owner of process liveness are related but separate:
- Input owner is represented today by `agentState.controlledByUser`, switch events, and runner mode.
- Process liveness is represented today by `session-alive`, daemon child tracking, session-scoped socket presence, and archive/death messages.
- Future diagnostics should record both, without message bodies, prompts, local absolute paths, tokens, or tool output.

## Persistence Rules

Persist or transmit only content-free lifecycle metadata:
- session id
- agent flavor
- lifecycle state and timestamp
- input owner: local or remote
- process owner: terminal, daemon, tmux, or unknown
- process liveness: connected, disconnected, exited, restarted
- turn state: idle, thinking, aborting, completed, cancelled, failed
- sequence checkpoints: last durable server seq and last applied client seq
- reason code: user-abort, permission-abort, socket-disconnect, provider-exit, daemon-restart, archive-requested, seq-gap

Do not include:
- message content
- prompts
- tool output
- auth tokens
- encryption keys
- local absolute paths
- environment variable values

## Current Gaps

- Lifecycle state is split across metadata, agent state, socket activity, encrypted chat events, and daemon tracking.
- `metadata.lifecycleState` is too coarse and does not distinguish input ownership, process liveness, recovery, or turn state.
- App UI currently infers thinking from message content and volatile activity, which can diverge after dropped updates.
- Abort semantics differ by provider: Claude launcher, Codex app-server, Gemini, ACP, and OpenClaw all have separate abort paths.
- Remote/local switch does not yet have a durable lifecycle event that states what happened to active subprocesses.
- Daemon tmux tracking relies on webhook timeout and PID mapping; reconnect/recovery semantics need explicit event coverage.
- Unexpected Codex process exit is currently surfaced as a generic message event, not a typed lifecycle/error state.

## Follow-Up Tasks

- `T-002`: add structured content-free lifecycle events and emit them from switch, abort, disconnect, reconnect, process exit, and recovery paths.
- `T-003`: add handoff regression coverage for desktop to mobile, mobile to desktop, remote-created sessions, daemon/tmux sessions, and active subprocess switch behavior.
- `T-006`: use the same visibility/recovery rules when making long-session background prefetch cancellable.

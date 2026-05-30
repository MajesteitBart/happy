# Tech Context

## Stack
- Monorepo managed by `pnpm@10.11.0`.
- Primary languages/runtimes: TypeScript, Node.js 20+, shell scripts, and some Bun/Prisma/Expo tooling.
- Main frameworks: Expo + React Native + React 19 for `happy-app`, Fastify + Socket.IO + Prisma/PGlite for `happy-server`, Node CLI tooling for `happy` and `happy-agent`, Electron/Vite for `codium`.

## Runtime Constraints
- Repo docs require Node.js >= 20 and `pnpm`.
- Native/mobile work depends on Expo/EAS and platform toolchains; server work may use Prisma, PGlite, Docker-backed helpers, and env files for local services.
- Root and package scripts assume local CLI tools like `tsx`, `vitest`, and package-scoped build steps.
- Delano validation currently assumes writable temp space for self-tests and has at least one installed-path mismatch in self-test execution.

## Integration Points
- `.project/` holds Delano delivery artifacts and registry files.
- `.agents/` holds canonical Delano scripts, skills, hooks, schemas, logs, and rules; `.claude/` is a compatibility mirror, not a second source of truth.
- Product integration points include Claude Code, Codex, mobile/web clients, the Happy server, push/auth flows, and shared wire schemas in `@slopus/happy-wire`.

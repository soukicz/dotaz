# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Dotaz is a desktop database client built on **Electrobun** (Bun backend + system webview) with a **Solid.js** frontend. It supports PostgreSQL and SQLite, focused on DML operations (viewing, editing, querying data) — no DDL/schema management.

## Commands

```bash
# Development with HMR (recommended)
bun run dev:hmr

# Development without HMR
bun run dev

# Production build
bun run build:canary

# Type checking (must pass with zero errors)
bunx tsc --noEmit

# Run all tests
bun test

# Run a single test file
bun test src/bun/services/query-executor.test.ts
```

## Architecture

Two-process model communicating via type-safe Electrobun RPC:

- **Backend** (`src/bun/`): Bun process handling database connections, query execution, and local app storage
- **Frontend** (`src/mainview/`): Solid.js UI in system webview with reactive stores
- **Shared** (`src/shared/types/`): Type definitions shared between backend and frontend (RPC schema, domain types)

### Backend layers
`rpc-handlers.ts` → `services/` (business logic) → `db/` (DatabaseDriver interface with postgres/sqlite implementations)

Local app data (connections, history, settings) stored in SQLite at `Utils.paths.userData/dotaz.db` via `storage/app-db.ts`.

### Frontend layers
Components → Stores (Solid.js `createStore`/`createSignal`) → RPC client (`lib/rpc.ts`)

Stores: `connections`, `tabs`, `grid`, `editor`, `ui`.

## Implementation Workflow

Follow `docs/INSTRUCTIONS.md` — issue-driven development, one issue per invocation:

1. Read `docs/STATUS.md` to find the next `not started` issue
2. Read the issue file at `docs/issues/DOTAZ-{NNN}.md`
3. Check dependencies are `done` before starting
4. Implement, type-check, test, commit with format `DOTAZ-{NNN}: {description}`
5. Update `docs/STATUS.md`

## Conventions

- **Bun APIs over Node.js**: Use `bun:sqlite`, `Bun.SQL`, `Bun.serve()`, Bun test runner
- **Electrobun APIs** for desktop features: windows, menus, RPC, native dialogs
- **Solid.js** for all frontend: `createStore`/`createSignal` for state (not React patterns)
- **Dark theme** with CSS variables, no component CSS libraries
- **Parameterized queries** always — no string concatenation for SQL
- Tests required for backend logic (services, drivers, RPC handlers); skip for pure UI components and trivial wiring

## Testing Guidelines

### What to test

- Persistence — saved connections, history, settings survive across restarts
- Isolation — multiple connections/tabs don't leak state into each other
- Concurrency — query cancellation, transaction ordering, race conditions
- Error handling — invalid SQL, connection failures, malformed inputs
- Driver behavior — both PostgreSQL and SQLite produce correct results through the DatabaseDriver interface
- RPC wiring — handlers correctly delegate to services and return expected shapes

### What NOT to test

- Trivial getters/setters, hardcoded constants, default values
- Pure UI components — verify visually
- Type definitions and re-exports
- That SQLite column names match a string — functional tests catch schema issues

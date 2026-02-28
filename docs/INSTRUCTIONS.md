# Dotaz — Agent Implementation Instructions

You are implementing the Dotaz desktop database client, one issue at a time.

## Workflow

Each invocation, follow these steps **in order**:

### 1. Orient

- Read `docs/STATUS.md` — find the first issue with status `not started`.
- If no pending issues remain, respond with exactly: `<done>promise</done>`
- Read the issue file at `docs/issues/DOTAZ-{NNN}.md` for full requirements.
- Read `docs/ARCHITECTURE.md` if you need architectural context.
- Check the issue's **Dependencies** — all listed issues must be `done` in STATUS.md before you start. If not, skip to the next `not started` issue.

### 2. Implement

- Update STATUS.md: set the issue to `in progress`.
- Implement the issue according to its requirements and acceptance criteria.
- Follow the directory structure and patterns defined in `docs/ARCHITECTURE.md`.
- Follow existing code conventions — look at already-implemented files for patterns.
- Keep changes focused on the issue scope. Don't refactor unrelated code.

### 3. Test

- **Type-check**: run `bunx tsc --noEmit` — must pass with no errors.
- **Write tests** if the issue involves backend logic (services, drivers, RPC handlers, stores). Use Bun's built-in test runner (`bun test`).
  - Skip tests for pure UI components (`.tsx` layout/styling) — those are verified visually.
  - Skip tests for trivial wiring (re-exports, type definitions).
- **Run tests**: `bun test` — all tests must pass (existing + new).
- If the build or tests fail, fix the issues before proceeding.

### 4. Commit

- Stage only files relevant to this issue.
- Commit with message format: `DOTAZ-{NNN}: {short description}`
- Do NOT push.

### 5. Update Status

- Update `docs/STATUS.md`:
  - Set the issue to `done` in the Issue Map.
  - Add notes if anything noteworthy happened.
  - Update the phase status if all issues in that phase are done.
  - Log any decisions in the **Decisions Log** section.
  - Log any lessons learned in the **Lessons Learned** section.
  - Update **Current Focus** to `—` (cleared).
  - Update `*Last updated*` at the bottom.

## Test Infrastructure

- **SQLite tests** require no external setup — use in-memory databases (`:memory:`).
- **PostgreSQL tests** require the docker-compose PG container. Before running PG tests, ensure it's running:
  ```bash
  docker compose up -d
  ```
  Connection string: `postgres://dotaz:dotaz@localhost:5488/dotaz_test` (or env `PG_URL`).
- Test helpers are in `tests/helpers.ts` — use `seedPostgres()` and `seedSqlite()` for seeding test data.
- Place test files in `tests/` with pattern `*.test.ts`.
- Smoke tests exist at `tests/sqlite-smoke.test.ts` and `tests/pg-smoke.test.ts` — these validate the test infra itself.

## Rules

- **One issue per invocation.** Implement exactly one issue, then stop.
- **Never skip acceptance criteria.** Every criterion in the issue must be satisfied.
- **Respect dependencies.** Don't start an issue if its dependencies aren't done.
- **Don't break existing code.** All previous tests must keep passing.
- **Prefer Bun APIs** over Node.js equivalents (`bun:sqlite`, `Bun.serve()`, etc.).
- **Use Electrobun APIs** for desktop features (windows, menus, RPC, dialogs).
- **Solid.js** for all frontend components. Use `createStore`/`createSignal` for state.
- If you encounter a blocker you cannot resolve, log it in STATUS.md **Blockers** section, set the issue to `blocked`, and stop.

# DOTAZ-109: Driver session management methods

**Phase**: 15 — Session Management
**Type**: backend
**Dependencies**: none

## Description

Extend the `DatabaseDriver` interface with session management methods. A "session" is a reserved database connection that maintains state (SET variables, temp tables, prepared statements) across multiple executions.

### New methods

```typescript
reserveSession(sessionId: string): Promise<void>;
releaseSession(sessionId: string): Promise<void>;
getSessionIds(): string[];
```

### Extended signatures — optional `sessionId` parameter

All execution, transaction, schema, and streaming methods gain an optional trailing `sessionId` parameter. When provided, the driver uses the session's reserved connection instead of the pool. When omitted, behavior is unchanged (pool for PG, single connection for others).

```typescript
execute(sql: string, params?: unknown[], sessionId?: string): Promise<QueryResult>;
cancel(sessionId?: string): Promise<void>;
beginTransaction(sessionId?: string): Promise<void>;
commit(sessionId?: string): Promise<void>;
rollback(sessionId?: string): Promise<void>;
inTransaction(sessionId?: string): boolean;
loadSchema(sessionId?: string): Promise<SchemaData>;
iterate(sql: string, params?: unknown[], batchSize?: number, signal?: AbortSignal, sessionId?: string): AsyncIterable<Record<string, unknown>[]>;
importBatch(qualifiedTable: string, columns: string[], rows: Record<string, unknown>[], sessionId?: string): Promise<number>;
```

### PostgresDriver — real multi-session support

Replace single `reservedConn` / `txActive` / `activeQuery` fields with a sessions map:

```typescript
interface SessionState {
  conn: ReservedSQL;
  txActive: boolean;
  activeQuery: ReturnType<SQL["unsafe"]> | null;
}

private sessions = new Map<string, SessionState>();
private poolActiveQuery: ReturnType<SQL["unsafe"]> | null = null;
```

- `reserveSession(id)` → `this.db!.reserve()`, store in map
- `releaseSession(id)` → rollback if tx active, release, remove from map
- `execute(sql, params, sessionId)` → resolve `conn = sessionId ? sessions.get(sessionId).conn : this.db!`
- `beginTransaction(sessionId)` → if sessionId, BEGIN on that session's conn. If no sessionId, reserve into a `__default__` internal session (backward compat with current behavior where beginTransaction reserves from pool).
- `commit/rollback(sessionId)` → on session's conn. If `__default__` session, release after commit/rollback.
- `cancel(sessionId)` → cancel correct activeQuery (session's or pool's)
- `loadSchema(sessionId)` → internal getSchemas/getTables use the resolved conn
- `iterate(sql, params, batchSize, signal, sessionId)` → if sessionId, use session's conn for cursor instead of reserving a new one
- `disconnect()` → iterate all sessions, release all, then close pool

### SqliteDriver, MysqlDriver, WasmSqliteDriver — no-op sessions

Single-connection drivers. Sessions are tracked in a `Set<string>` for API consistency but don't change behavior. All methods ignore `sessionId` parameter.

## Files

- `src/backend-shared/db/driver.ts` — extend `DatabaseDriver` interface
- `src/backend-shared/drivers/postgres-driver.ts` — multi-session with `Map<string, SessionState>`
- `src/backend-shared/drivers/sqlite-driver.ts` — no-op sessions
- `src/backend-shared/drivers/mysql-driver.ts` — no-op sessions
- `src/frontend-demo/wasm-sqlite-driver.ts` — no-op sessions
- `tests/postgres-driver-session.test.ts` — new test file

## Acceptance Criteria

- [ ] `reserveSession()`, `releaseSession()`, `getSessionIds()` on DatabaseDriver interface
- [ ] Optional `sessionId` on execute, cancel, transaction, loadSchema, iterate, importBatch
- [ ] PG: multiple concurrent sessions, each with independent state (own ReservedSQL)
- [ ] PG: execute with sessionId uses session's connection, without uses pool
- [ ] PG: transaction with sessionId uses session's connection (no auto-reserve)
- [ ] PG: transaction without sessionId reserves into `__default__` session (backward compat)
- [ ] PG: releaseSession rolls back active tx before releasing
- [ ] PG: disconnect releases all sessions
- [ ] SQLite/MySQL/WASM: no-op sessions pass through without error
- [ ] All existing tests pass (sessionId is optional — fully backward compatible)
- [ ] New tests: multi-session isolation, session transaction, session release cleanup

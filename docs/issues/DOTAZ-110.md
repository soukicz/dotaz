# DOTAZ-110: Per-Run connection affinity in QueryExecutor

**Phase**: 15 — Session Management
**Type**: backend
**Dependencies**: DOTAZ-109

## Description

When a user executes multi-statement SQL in the console (one "Run"), all statements must run on the same database connection. Currently, `QueryExecutor.executeQuery()` calls `driver.execute()` per statement, and each call can hit a different connection from the pool. This breaks patterns like `SET search_path = 'foo'; SELECT * FROM bar;`.

### Solution: ephemeral session reservation

When `sessionId` is not provided AND there are multiple statements, `QueryExecutor` automatically creates a short-lived reserved session for the duration of the execution, then releases it.

```typescript
async executeQuery(connectionId, sql, params?, timeoutMs?, queryId?, database?, sessionId?) {
  const driver = this.connectionManager.getDriver(connectionId, database);
  const statements = splitStatements(sql);

  let ephemeralSessionId: string | undefined;
  if (!sessionId && statements.length > 1) {
    ephemeralSessionId = `__ephemeral_${crypto.randomUUID()}`;
    await driver.reserveSession(ephemeralSessionId);
  }
  const effectiveSessionId = sessionId ?? ephemeralSessionId;

  try {
    for (const stmt of statements) {
      await this.executeSingle(driver, stmt, params, timeout, entry, effectiveSessionId);
    }
  } finally {
    if (ephemeralSessionId) await driver.releaseSession(ephemeralSessionId);
  }
}
```

### Additional changes

- Thread `sessionId` into `executeSingle()` → `driver.execute(sql, params, sessionId)`
- Store `sessionId` in `RunningQuery` so `cancelQuery()` can call `driver.cancel(sessionId)` on the correct active query
- Add `sessionId` to `explainQuery()` as well

## Files

- `src/backend-shared/services/query-executor.ts` — add sessionId param, ephemeral reservation, thread through

## Acceptance Criteria

- [ ] `executeQuery()` accepts optional `sessionId` parameter (after `database`)
- [ ] Multi-statement SQL without sessionId auto-reserves ephemeral session
- [ ] Single-statement SQL without sessionId uses pool directly (no reservation)
- [ ] Ephemeral session is always released in finally block (even on error/cancellation)
- [ ] `cancelQuery()` cancels the correct active query when session is involved
- [ ] `explainQuery()` accepts and threads sessionId
- [ ] Existing tests pass unchanged

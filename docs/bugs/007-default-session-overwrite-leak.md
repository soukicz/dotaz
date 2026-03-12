# DEFAULT_SESSION overwrite leaks connections

**Severity**: Low

## Description

If `beginTransaction()` without a sessionId is called while a `DEFAULT_SESSION` already exists, the old session is silently overwritten — leaking the old reserved connection forever. The `TransactionManager.begin()` checks `inTransaction()` first, which catches this in normal usage. But any code calling the driver directly bypasses that check.

## Code path

`src/backend-shared/drivers/postgres-driver.ts:596-614`

```typescript
async beginTransaction(sessionId?: string): Promise<void> {
    if (sessionId) {
        // ... uses existing session
    } else {
        const conn = await this.db!.reserve()
        await conn.unsafe('BEGIN')
        this.sessions.set(DEFAULT_SESSION, { conn, txActive: true, activeQuery: null })
        // ^ overwrites previous DEFAULT_SESSION without releasing old conn
    }
}
```

Same pattern in `mysql-driver.ts:516-534`.

## Scenario

1. Code calls `driver.beginTransaction()` directly (no TransactionManager)
2. Code calls `driver.beginTransaction()` again before commit/rollback
3. The first reserved connection is overwritten and never released

## Impact

Connection leak. The overwritten reserved connection is never released back to the pool. Mitigated by TransactionManager's `inTransaction()` guard in normal usage.

## Resolution

**Status**: Fixed in `1cadaa8`

Added a guard in the `else` branch of `beginTransaction()` in both `postgres-driver.ts` and `mysql-driver.ts`. Before reserving a new connection, the method now checks `this.sessions.has(DEFAULT_SESSION)` and throws an error if a default session already exists. This prevents the silent overwrite and forces the caller to commit or rollback the existing transaction first.

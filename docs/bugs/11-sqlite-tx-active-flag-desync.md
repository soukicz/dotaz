# SQLite txActive flag can desync from actual database state

**Severity:** Low
**Drivers:** SQLite
**Files:** `src/backend-shared/drivers/sqlite-driver.ts:342-358`

## Description

SQLite auto-rollbacks transactions on certain critical errors (SQLITE_FULL, SQLITE_IOERR, etc.). After such an error, the transaction is already rolled back by SQLite, but `txActive` remains `true` because the flag is only updated after a successful `COMMIT` or `ROLLBACK` call.

```typescript
async rollback(_sessionId?: string): Promise<void> {
    this.ensureConnected()
    await this.db!.unsafe('ROLLBACK')
    this.txActive = false    // only reached if ROLLBACK succeeds
}
```

## Scenario

1. User begins a transaction
2. An INSERT causes SQLITE_FULL -> SQLite auto-rollbacks the transaction
3. `txActive` stays `true`
4. User tries to ROLLBACK -> fails with "cannot rollback - no transaction is active"
5. `txActive` remains `true` permanently
6. All subsequent operations believe a transaction is active when none exists

## Proposed fix

Always reset `txActive` on rollback errors:

```typescript
async rollback(_sessionId?: string): Promise<void> {
    this.ensureConnected()
    try {
        await this.db!.unsafe('ROLLBACK')
    } finally {
        this.txActive = false
    }
}
```

## Triage Result

**Status:** FIXED

Code confirmed: `txActive` is set AFTER successful SQL execution. If `ROLLBACK` fails (e.g., SQLite auto-rolled-back on SQLITE_FULL), `txActive` stays `true` permanently. Subsequent operations wrongly believe a transaction is active. Low severity because SQLite auto-rollback scenarios are rare in practice.

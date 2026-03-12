# iterate() leaks open transactions on early consumer break

**Severity:** High
**Drivers:** PostgreSQL
**Files:** `src/backend-shared/drivers/postgres-driver.ts:669-718`

## Description

When a consumer `break`s out of `for await...of` on the async generator, JavaScript calls `.return()` on the generator. Per JS semantics: inner `finally` runs, then outer `finally` runs, but normal flow (`COMMIT`) and `catch` (`ROLLBACK`) are both skipped. The connection is returned to the pool with an active read-only transaction.

```typescript
try {
    await conn.unsafe('BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY')
    await conn.unsafe(`DECLARE ${cursorId} ...`)
    try {
        while (true) {
            yield rows           // consumer breaks here via for-await break
        }
    } finally {
        await conn.unsafe(`CLOSE ${cursorId}`)  // runs (inner finally)
    }
    await conn.unsafe('COMMIT')  // SKIPPED — generator return skips normal flow
} catch (err) {
    await conn.unsafe('ROLLBACK') // SKIPPED — no error thrown
} finally {
    if (ownConn) (conn as ReservedSQL).release()  // runs — connection returned with open tx
}
```

## Scenario

1. Export is started, iteration begins with BEGIN + DECLARE CURSOR
2. User cancels the export (AbortSignal, or consumer breaks the loop)
3. Generator's `.return()` is called
4. Inner `finally`: CLOSE CURSOR runs
5. `COMMIT` is skipped (not in a `finally` block)
6. `ROLLBACK` in `catch` is skipped (no exception thrown)
7. Outer `finally`: connection released back to pool **with an active transaction**
8. Next user of this pooled connection may inherit the stale transaction

## Proposed fix

Add ROLLBACK to the outer `finally`:

```typescript
} finally {
    if (ownConn) {
        try { await (conn as ReservedSQL).unsafe('ROLLBACK') } catch { }
        (conn as ReservedSQL).release()
    }
}
```

## Triage Result

**Status:** FIXED

Added `ROLLBACK` to the outer `finally` block in `iterate()` before `release()`. When a consumer breaks out of the loop, the transaction is now properly rolled back before the connection returns to the pool. The `ROLLBACK` is harmless in normal (already committed) and error (already rolled back) paths — errors are silently caught.

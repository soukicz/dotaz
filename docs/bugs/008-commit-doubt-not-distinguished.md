# Commit-doubt not distinguished from regular failures

**Severity**: Low (inherent limitation)

## Description

If the server processes COMMIT successfully but the TCP connection drops before the client receives the acknowledgement, the client sees a connection error and treats it as a failed commit. The data is actually persisted on the server.

## Code path

`src/backend-shared/drivers/postgres-driver.ts:616-633`

```typescript
async commit(sessionId?) {
    try {
        await session.conn.unsafe('COMMIT')
    } catch (err) {
        try { await session.conn.unsafe('ROLLBACK') } catch {}
        throw err  // caller believes commit failed
    } finally {
        session.txActive = false
    }
}
```

## Scenario

1. User clicks "Commit"
2. Server processes COMMIT and writes data to disk
3. TCP connection drops before acknowledgement reaches client
4. Client enters catch block, attempts ROLLBACK (fails — connection dead)
5. Throws error — UI shows "Commit failed"
6. User retries the transaction, potentially creating duplicate data

## Impact

User is told the commit failed when it actually succeeded. This is inherent to any non-2PC protocol and cannot be fully eliminated.

## Suggested fix

Detect connection-level errors during COMMIT and raise a distinct "commit status unknown" error type rather than a generic failure. The UI can then warn the user to verify the data state before retrying.

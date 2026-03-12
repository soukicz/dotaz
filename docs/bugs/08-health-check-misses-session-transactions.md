# Health check misses session-level transactions for transactionLost flag

**Severity:** Medium
**Files:** `src/backend-shared/services/connection-manager.ts:452-456`

## Description

When a health check fails and the connection is lost, the code checks whether any driver had an active transaction to set the `transactionLost` flag. However, `d.inTransaction()` without a sessionId only checks the `DEFAULT_SESSION`.

```typescript
let hadTransaction = false
for (const d of driverMap.values()) {
    if (d.inTransaction()) {    // no sessionId -> checks DEFAULT_SESSION only
        hadTransaction = true
        break
    }
}
```

## Impact

If a user has an active transaction on a named session (not DEFAULT_SESSION), `hadTransaction` stays `false`. The UI event `transactionLost` won't be set, and the user won't be warned that their in-progress transaction was lost during a connection drop.

## Proposed fix

Check all sessions:

```typescript
let hadTransaction = false
for (const d of driverMap.values()) {
    if (d.inTransaction()) { hadTransaction = true; break }
    for (const sid of d.getSessionIds()) {
        if (d.inTransaction(sid)) { hadTransaction = true; break }
    }
    if (hadTransaction) break
}
```

## Triage Result

**Status:** FIXED

Code confirmed: Health check only calls `d.inTransaction()` without sessionId → only checks DEFAULT_SESSION. `getSessionIds()` is available on all drivers but not used here. Result: if user has a transaction on a named session and connection drops, `transactionLost` flag is false → UI doesn't warn the user.

Fix: Now iterates over all session IDs via `getSessionIds()` in addition to checking the default session.

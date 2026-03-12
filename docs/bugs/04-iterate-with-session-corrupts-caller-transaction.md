# iterate() with sessionId can commit/rollback caller's transaction

**Severity:** Critical (if reachable)
**Drivers:** PostgreSQL
**Files:** `src/backend-shared/drivers/postgres-driver.ts:686`

## Description

If `iterate()` is called with a `sessionId` whose session already has an active user transaction, the method issues a nested `BEGIN` on the same connection. PostgreSQL issues a WARNING and ignores it — the cursor operates inside the caller's existing transaction. At the end, `COMMIT` commits the caller's entire transaction, or on error, `ROLLBACK` rolls back the caller's entire transaction.

```typescript
const conn = session ? session.conn : await this.db!.reserve()
// ...
await conn.unsafe('BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY')
// PostgreSQL: WARNING: there is already a transaction in progress
// The cursor operates inside the CALLER's transaction
// ...
await conn.unsafe('COMMIT')  // COMMITS THE CALLER'S ENTIRE TRANSACTION
```

## Scenario

1. User has an active transaction with uncommitted INSERTs on session "abc"
2. An export is triggered on the same session "abc"
3. The export's `COMMIT` silently commits all the user's pending changes
4. Or: an export error causes `ROLLBACK`, which rolls back the user's work

## Current mitigation

Callers (export-service, search-service) take a `driver` directly and don't pass `sessionId`. But the interface allows it, and nothing prevents a future caller from passing a sessionId with an active transaction.

## Proposed fix

Check for existing transaction and skip the wrapping BEGIN/COMMIT:

```typescript
const hadTx = session?.txActive ?? false
if (!hadTx) {
    await conn.unsafe('BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY')
}
// ... cursor operations ...
if (!hadTx) {
    await conn.unsafe('COMMIT')
}
```

Or refuse to iterate on a session with an active transaction:

```typescript
if (session?.txActive) {
    throw new Error('Cannot iterate on a session with an active transaction')
}
```

## Triage Result

**Status:** VALID but LOW RISK — Theoretical

Code confirmed: If `sessionId` is passed with `txActive=true`, a nested `BEGIN` is issued. PostgreSQL ignores it with a WARNING. The subsequent `COMMIT` commits the caller's entire transaction. However, **no current caller does this** — export-service and search-service take a driver directly without sessionId. The risk is future misuse. Defensive check would be cheap.

## Resolution

**Status:** FIXED

Added a guard in `postgres-driver.ts` that throws `'Cannot iterate on a session with an active transaction'` before any SQL is issued. This prevents accidental misuse by future callers — iterate() now refuses to run on a session with `txActive=true`.

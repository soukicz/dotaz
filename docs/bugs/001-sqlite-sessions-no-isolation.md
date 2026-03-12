# SQLite sessions provide no connection isolation

**Severity**: Critical
**Status**: Resolved (commit c09d60c)

## Description

SQLite sessions are fake — `reserveSession()` just stores the ID in a Set, and `execute()` ignores the `sessionId` parameter entirely. All queries go through the single `this.db` connection regardless of session.

## Code path

`src/backend-shared/drivers/sqlite-driver.ts:109-119`

```typescript
async reserveSession(sessionId: string): Promise<void> {
    this.sessionIds.add(sessionId)  // just stores the ID — no reserved connection
}
async releaseSession(sessionId: string): Promise<void> {
    this.sessionIds.delete(sessionId)
}
```

`execute()` at line 121 ignores `_sessionId` — all queries go through `this.db`.

## Scenario

1. User creates Session A and Session B on a SQLite connection
2. Session A begins a transaction
3. Session B executes `INSERT INTO ...`
4. That INSERT runs inside Session A's transaction invisibly
5. Session A rolls back
6. Session B's INSERT is silently lost — user believes it was committed (no error was shown)

## Impact

Silent data loss. Writes from one session silently participate in another session's transaction.

## Suggested fix

Either:
- (a) Disallow multiple sessions on SQLite (it's single-writer anyway)
- (b) Document clearly that SQLite sessions share state and prevent session B from executing while session A has a transaction

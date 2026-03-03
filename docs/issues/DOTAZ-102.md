# DOTAZ-102: Web session lifecycle management

**Phase**: 14 — Robustness & Tech Debt II
**Type**: backend
**Dependencies**: none

## Description

Web mode sessions (`src/backend-web/server.ts`) have no timeout or safety net. When a WebSocket disconnects while HTTP streams are active, the session stays alive via `activeStreams` counter. If a stream handler crashes or never decrements, the session leaks permanently. Additionally, running queries tracked in `QueryExecutor.runningQueries` have no TTL — a disconnected client leaves queries running indefinitely.

### Session TTL after WS disconnect

When `maybeDestroySession()` sets `ws = null` but `activeStreams > 0`, start a timeout (e.g. 5 minutes). If the session hasn't been destroyed by then, force-destroy it — close all connections, abort running queries, clean up.

### Periodic zombie session sweep

Add a `setInterval` (e.g. every 60s) that checks all sessions in the `sessions` Map. Any session with `ws === null` and `activeStreams > 0` that has been in that state for longer than the TTL gets force-destroyed.

### Query cleanup on session destruction

When `destroySession()` is called, cancel all running queries associated with that session's ConnectionManager before calling `disconnectAll()`. This prevents orphaned queries from running on the database server after the user has disconnected.

## Files

- `src/backend-web/server.ts` — add `disconnectedAt` timestamp to Session, implement TTL timeout in `maybeDestroySession()`, add periodic zombie sweep, cancel queries in `destroySession()`
- `src/backend-shared/services/query-executor.ts` — add `cancelAllForConnection(connectionId)` method that cancels all running queries for a given connection
- `tests/query-executor.test.ts` — test `cancelAllForConnection()`

## Acceptance Criteria

- [ ] Session type has `disconnectedAt: number | null` field
- [ ] `maybeDestroySession()` starts a 5-minute TTL timer when `activeStreams > 0`
- [ ] Periodic sweep (60s interval) force-destroys zombie sessions past TTL
- [ ] `destroySession()` cancels all running queries before disconnecting
- [ ] `QueryExecutor` has `cancelAllForConnection(connectionId)` method
- [ ] No memory leaks from abandoned sessions in web mode
- [ ] `bunx tsc --noEmit` passes
- [ ] All tests pass

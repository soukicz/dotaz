# DOTAZ-025: QueryExecutor service with cancellation

**Phase**: 4 — SQL Editor
**Type**: backend
**Dependencies**: [DOTAZ-007]

## Description

Implementation of `QueryExecutor` service in `src/bun/services/query-executor.ts` (extension of existing file). Method `executeQuery(connectionId, sql, params?)` — gets driver via `ConnectionManager`, runs query.

Multi-statement support: splits SQL into individual statements (split by `";"`), sequential execution, aggregates results.

Query cancellation: each running query has unique `queryId`, map `runningQueries` (`queryId` → `AbortController`). Method `cancelQuery(queryId)` — calls abort on controller, `driver.cancel()`.

Measures query duration (start → end, in ms).

Result: `QueryResult` with `fields` (columns), `rows` (data), `rowCount` (affected rows for DML), `duration` (ms), `error` (if error). For SELECT: returns data. For INSERT/UPDATE/DELETE: returns affected rows count.

Timeout: configurable query timeout (default 30s).

## Files

- `src/bun/services/query-executor.ts` — QueryExecutor service, multi-statement support, cancellation via AbortController, duration measurement, timeout handling

## Acceptance Criteria

- [ ] SELECT queries return data with field metadata
- [ ] DML queries return affected rows
- [ ] Multi-statement works (returns array of results)
- [ ] Cancellation works (query interrupted via `cancelQuery`)
- [ ] Duration is measured (start → end in ms)
- [ ] Timeout works (default 30s, configurable)
- [ ] Errors are caught and returned legibly

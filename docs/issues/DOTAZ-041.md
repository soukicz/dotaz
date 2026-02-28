# DOTAZ-041: Query history backend + RPC

**Phase**: 6 — Advanced Features
**Type**: backend
**Dependencies**: [DOTAZ-004, DOTAZ-025]

## Description

Implementation of history.* RPC handlers in src/bun/rpc-handlers.ts. Automatic logging of every executed query through QueryExecutor to app DB (query_history table). Logged data: connection_id, sql, status (success/error), duration_ms, row_count, error_message, executed_at. Handler history.list(connectionId?, limit?, offset?, search?) — returns list of history. Filtering by connection, search in SQL text (LIKE), pagination. Ordering by executed_at DESC. Handler history.clear(connectionId?) — delete history (entire or per-connection). Integration with QueryExecutor: after every execute, the result is automatically logged.

## Files

- `src/bun/rpc-handlers.ts` — history.list and history.clear handlers
- `src/bun/services/query-executor.ts` — integration of automatic query logging

## Acceptance Criteria

- [ ] Every executed query is automatically logged to query_history
- [ ] history.list returns history with pagination (limit, offset)
- [ ] Filtering by connection works
- [ ] Search in SQL text works (LIKE)
- [ ] history.clear works (entire history and per-connection)
- [ ] Metadata (duration_ms, row_count, status) are correctly recorded

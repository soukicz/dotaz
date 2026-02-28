# DOTAZ-026: SQL console RPC handlers (execute, cancel, format)

**Phase**: 4 — SQL Editor
**Type**: backend
**Dependencies**: [DOTAZ-025, DOTAZ-008]

## Description

Implementation of `query.*` RPC handlers in `src/bun/rpc-handlers.ts`.

- **Handler `query.execute`** — accepts `connectionId`, `sql`, `queryId`. Calls `QueryExecutor.executeQuery()`. Returns `QueryResult` (or array of `QueryResult` for multi-statement).
- **Handler `query.cancel`** — accepts `queryId`, calls `QueryExecutor.cancelQuery()`.
- **Handler `query.format`** — accepts SQL string, returns formatted SQL.

Implementation of simple SQL formatting (basic indentation of keywords: `SELECT`, `FROM`, `WHERE`, `ORDER BY`, `GROUP BY`, `HAVING`, `JOIN` on new line, keywords in uppercase).

Complete implementation of stubs for `query.*` from DOTAZ-008.

## Files

- `src/bun/rpc-handlers.ts` — `query.*` handlers: `execute`, `cancel`, `format`

## Acceptance Criteria

- [ ] `query.execute` runs SQL and returns result
- [ ] `query.cancel` interrupts running query
- [ ] `query.format` formats SQL (keywords uppercase, indentation)
- [ ] Errors contain position (line/column if available)
- [ ] Multi-statement returns array of results

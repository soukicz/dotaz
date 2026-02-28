# DOTAZ-017: getTableData RPC with pagination, sort, filter

**Phase**: 3 — Data Grid
**Type**: backend
**Dependencies**: [DOTAZ-008, DOTAZ-007]

## Description

Implementation of `data.getTableData` RPC handler in `src/bun/rpc-handlers.ts`. Handler accepts GridDataRequest (connectionId, schema, table, page, pageSize, sort array, filters array). Generates SQL query dynamically:

- SELECT with `quoteIdentifier` for columns
- FROM `schema.table`
- WHERE clause from filters — each filter has column, operator, value. Operators: `=`, `!=`, `>`, `<`, `>=`, `<=`, `LIKE`, `IS NULL`, `IS NOT NULL`, `IN`
- ORDER BY from sort array (column + direction)
- LIMIT/OFFSET for pagination

Handler `data.getRowCount` — `SELECT COUNT(*)` with applied filters (without LIMIT/OFFSET).

Implementation in `query-executor.ts`:

- `buildSelectQuery()` — building complete SELECT query
- `buildWhereClause()` — generating WHERE conditions from filters array
- `buildOrderByClause()` — generating ORDER BY from sort rules array

Parameterized queries for SQL injection prevention. Proper identifier escaping via `driver.quoteIdentifier()`.

## Files

- `src/bun/rpc-handlers.ts` — `data.getTableData` and `data.getRowCount` handlers replacing existing stubs
- `src/bun/services/query-executor.ts` — `buildSelectQuery()`, `buildWhereClause()`, `buildOrderByClause()` functions for dynamic SQL building

## Acceptance Criteria

- [ ] `getTableData` returns paginated data with LIMIT/OFFSET
- [ ] Sorting works for single and multiple columns
- [ ] Filters work for all operators (=, !=, >, <, >=, <=, LIKE, IS NULL, IS NOT NULL, IN)
- [ ] `getRowCount` returns correct count with applied filters
- [ ] SQL injection is not possible (parameterized queries, identifier escaping)
- [ ] Works for both PostgreSQL and SQLite

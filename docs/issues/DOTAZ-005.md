# DOTAZ-005: DatabaseDriver interface + SQLite driver

**Phase**: 1 — Foundation
**Type**: backend
**Dependencies**: [DOTAZ-002]

## Description

Define abstract `DatabaseDriver` interface in `src/bun/db/driver.ts`. Interface covers:
- **Lifecycle**: `connect`, `disconnect`, `isConnected`
- **Query execution**: `execute` with parameters, `cancel`
- **Schema introspection**: `getSchemas`, `getTables`, `getColumns`, `getIndexes`, `getForeignKeys`, `getPrimaryKey`
- **Transactions**: `beginTransaction`, `commit`, `rollback`, `inTransaction`
- **Metadata**: `getDriverType`, `quoteIdentifier`

Implementation of SQLite driver in `src/bun/db/sqlite-driver.ts` using Bun.SQL (`import { SQL } from "bun"`) with unified API. SQLite schema introspection via `sqlite_master` and PRAGMA commands (`table_info`, `index_list`, `index_info`, `foreign_key_list`). SQLite has no schemas — return default `"main"`.

## Files

- `src/bun/db/driver.ts` — abstract DatabaseDriver interface, types for query result, column info, index info, foreign key info
- `src/bun/db/sqlite-driver.ts` — SQLite implementation of DatabaseDriver interface, schema introspection via sqlite_master and PRAGMA

## Acceptance criteria

- [ ] DatabaseDriver interface is complete per ARCHITECTURE.md
- [ ] SQLite driver implements all interface methods
- [ ] `connect` opens SQLite file, `disconnect` closes it
- [ ] `execute` returns typed data (rows, columns, affectedRows)
- [ ] Schema introspection (`getTables`, `getColumns`, `getIndexes`, `getForeignKeys`, `getPrimaryKey`) returns correct data
- [ ] `getSchemas` returns `["main"]` for SQLite
- [ ] `quoteIdentifier` correctly quotes identifiers for SQLite
- [ ] Transactions (`beginTransaction`, `commit`, `rollback`) work correctly

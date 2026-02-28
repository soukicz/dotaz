# DOTAZ-032: Data editing backend (INSERT/UPDATE/DELETE generation)

**Phase**: 5 — Data Editing
**Type**: backend
**Dependencies**: [DOTAZ-008, DOTAZ-007]

## Description

Implementation of backend logic for data editing. Extension of src/bun/rpc-handlers.ts with data.applyChanges handler. Receives connectionId, schema, table, changes (array of pending changes). Each change has a type: "insert" (new row with values), "update" (PK values + changed columns + new values), "delete" (PK values). Handler generates SQL for each change: INSERT INTO table (cols) VALUES (params), UPDATE table SET col=param WHERE pk=val, DELETE FROM table WHERE pk=val. Everything runs in a single transaction (BEGIN -> statements -> COMMIT, ROLLBACK on error). Handler data.generateSql — same logic but returns generated SQL string instead of execution (for preview). Validation: check PK existence, escape identifiers, parameterized values. Support for SET NULL (explicit null value).

## Files

- `src/bun/rpc-handlers.ts` — data.applyChanges and data.generateSql handlers
- `src/bun/services/query-executor.ts` — SQL generation helper functions

## Acceptance Criteria

- [ ] INSERT generates correct SQL with parameters
- [ ] UPDATE changes only modified columns
- [ ] DELETE uses PK in WHERE clause
- [ ] Everything runs in one transaction (BEGIN/COMMIT/ROLLBACK)
- [ ] generateSql returns readable SQL string for preview
- [ ] NULL values work correctly (SET NULL)
- [ ] Error in one statement rolls back all changes

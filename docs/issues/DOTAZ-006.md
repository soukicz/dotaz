# DOTAZ-006: PostgreSQL driver

**Phase**: 1 — Foundation
**Type**: backend
**Dependencies**: [DOTAZ-005]

## Description

Implementation of PostgreSQL driver in `src/bun/db/postgres-driver.ts`. Uses Bun.SQL (`import { SQL } from "bun"`) with connection string URL. Connection pooling (built-in in Bun.SQL).

Query execution with tagged template literals and parameterized queries. Query cancellation via `AbortController`.

Schema introspection via `information_schema` (`columns`, `tables`, `schemata`) and `pg_catalog` (`pg_indexes`, `pg_constraint` for FK). Support for built-in PG types (`jsonb`, `array`, `timestamp`, `uuid`, `numeric`).

`quoteIdentifier` with double quotes (standard SQL quoting for PostgreSQL).

## Files

- `src/bun/db/postgres-driver.ts` — PostgreSQL implementation of DatabaseDriver interface, connection pooling, schema introspection via information_schema and pg_catalog

## Acceptance Criteria

- [ ] Driver implements complete DatabaseDriver interface
- [ ] Connection pooling works (built-in in Bun.SQL)
- [ ] Schema introspection returns correct data for PostgreSQL (schemas, tables, columns, indexes, foreign keys)
- [ ] Queries with parameters work correctly
- [ ] Query cancellation via AbortController works
- [ ] Correctly quotes identifiers with double quotes
- [ ] Support for PG types (jsonb, array, timestamp, uuid, numeric)
- [ ] `connect` creates connection pool, `disconnect` closes it

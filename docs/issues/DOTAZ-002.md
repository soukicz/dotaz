# DOTAZ-002: Create shared types

**Phase**: 0 — Project Setup
**Type**: backend
**Dependencies**: DOTAZ-001

## Description

Create type definitions shared between backend and frontend in src/shared/types/. Types include:

- **Connections** — ConnectionConfig for PostgreSQL and SQLite, ConnectionInfo with state (connected/disconnected/error)
- **Database metadata** — SchemaInfo, TableInfo, ColumnInfo, IndexInfo, ForeignKeyInfo
- **Grid** — GridDataRequest with pagination/sort/filter, GridDataResponse, SortDirection, FilterOperator, ColumnFilter
- **Query** — QueryRequest, QueryResult, QueryHistoryEntry
- **Tab** — TabType enum (data-grid | sql-console | schema-viewer), TabInfo
- **Export** — ExportFormat (csv | json | sql), ExportOptions

Additionally src/shared/types/rpc.ts with RPC schema definition per Electrobun RPC pattern — for now as type definitions (implementation in DOTAZ-008).

## Files

- `src/shared/types/connection.ts` — ConnectionConfig (PostgreSQL, SQLite), ConnectionInfo with connection state
- `src/shared/types/database.ts` — SchemaInfo, TableInfo, ColumnInfo, IndexInfo, ForeignKeyInfo
- `src/shared/types/grid.ts` — GridDataRequest (pagination, sort, filter), GridDataResponse, SortDirection, FilterOperator, ColumnFilter
- `src/shared/types/query.ts` — QueryRequest, QueryResult, QueryHistoryEntry
- `src/shared/types/tab.ts` — TabType enum (data-grid | sql-console | schema-viewer), TabInfo
- `src/shared/types/export.ts` — ExportFormat (csv | json | sql), ExportOptions
- `src/shared/types/rpc.ts` — RPC schema definitions per Electrobun RPC pattern, covering all planned methods from ARCHITECTURE.md

## Acceptance criteria

- [ ] All files compile without TypeScript errors
- [ ] Types cover all functional requirements from PRD
- [ ] RPC schema covers all planned methods from ARCHITECTURE.md
- [ ] No runtime dependencies

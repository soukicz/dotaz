# DOTAZ-002: Vytvoření sdílených typů (shared types)

**Phase**: 0 — Project Setup
**Type**: backend
**Dependencies**: DOTAZ-001

## Popis

Vytvoření typových definic sdílených mezi backendem a frontendem v src/shared/types/. Typy zahrnují:

- **Connections** — ConnectionConfig pro PostgreSQL a SQLite, ConnectionInfo se stavem (connected/disconnected/error)
- **Database metadata** — SchemaInfo, TableInfo, ColumnInfo, IndexInfo, ForeignKeyInfo
- **Grid** — GridDataRequest s paginací/sort/filter, GridDataResponse, SortDirection, FilterOperator, ColumnFilter
- **Query** — QueryRequest, QueryResult, QueryHistoryEntry
- **Tab** — TabType enum (data-grid | sql-console | schema-viewer), TabInfo
- **Export** — ExportFormat (csv | json | sql), ExportOptions

Navíc src/shared/types/rpc.ts s definicí RPC schema dle Electrobun RPC vzoru — zatím jako type definice (implementace v DOTAZ-008).

## Soubory

- `src/shared/types/connection.ts` — ConnectionConfig (PostgreSQL, SQLite), ConnectionInfo se stavem připojení
- `src/shared/types/database.ts` — SchemaInfo, TableInfo, ColumnInfo, IndexInfo, ForeignKeyInfo
- `src/shared/types/grid.ts` — GridDataRequest (paginace, sort, filter), GridDataResponse, SortDirection, FilterOperator, ColumnFilter
- `src/shared/types/query.ts` — QueryRequest, QueryResult, QueryHistoryEntry
- `src/shared/types/tab.ts` — TabType enum (data-grid | sql-console | schema-viewer), TabInfo
- `src/shared/types/export.ts` — ExportFormat (csv | json | sql), ExportOptions
- `src/shared/types/rpc.ts` — RPC schema definice dle Electrobun RPC vzoru, pokrývající všechny plánované metody z ARCHITECTURE.md

## Akceptační kritéria

- [ ] Všechny soubory kompilují bez TS chyb
- [ ] Typy pokrývají všechny funkční požadavky z PRD
- [ ] RPC schema pokrývá všechny plánované metody z ARCHITECTURE.md
- [ ] Žádné runtime závislosti

# DOTAZ-017: getTableData RPC s paginací, sort, filter

**Phase**: 3 — Data Grid
**Type**: backend
**Dependencies**: [DOTAZ-008, DOTAZ-007]

## Popis

Implementace `data.getTableData` RPC handleru v `src/bun/rpc-handlers.ts`. Handler přijímá GridDataRequest (connectionId, schema, table, page, pageSize, sort array, filters array). Generuje SQL dotaz dynamicky:

- SELECT s `quoteIdentifier` pro sloupce
- FROM `schema.table`
- WHERE klauzule z filtrů — každý filtr má column, operator, value. Operátory: `=`, `!=`, `>`, `<`, `>=`, `<=`, `LIKE`, `IS NULL`, `IS NOT NULL`, `IN`
- ORDER BY z sort array (column + direction)
- LIMIT/OFFSET pro paginaci

Handler `data.getRowCount` — `SELECT COUNT(*)` s aplikovanými filtry (bez LIMIT/OFFSET).

Implementace v `query-executor.ts`:

- `buildSelectQuery()` — sestavení kompletního SELECT dotazu
- `buildWhereClause()` — generování WHERE podmínek z pole filtrů
- `buildOrderByClause()` — generování ORDER BY z pole sort pravidel

Parametrizované dotazy pro prevenci SQL injection. Správné escape identifikátorů přes `driver.quoteIdentifier()`.

## Soubory

- `src/bun/rpc-handlers.ts` — `data.getTableData` a `data.getRowCount` handlery nahrazující stávající stubs
- `src/bun/services/query-executor.ts` — `buildSelectQuery()`, `buildWhereClause()`, `buildOrderByClause()` funkce pro dynamické sestavení SQL

## Akceptační kritéria

- [ ] `getTableData` vrací stránkovaná data s LIMIT/OFFSET
- [ ] Řazení funguje pro jeden i více sloupců
- [ ] Filtry fungují pro všechny operátory (=, !=, >, <, >=, <=, LIKE, IS NULL, IS NOT NULL, IN)
- [ ] `getRowCount` vrací správný count s aplikovanými filtry
- [ ] SQL injection není možná (parametrizované dotazy, escape identifikátorů)
- [ ] Funguje pro PostgreSQL i SQLite

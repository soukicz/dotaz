# DOTAZ-005: DatabaseDriver interface + SQLite driver

**Phase**: 1 — Foundation
**Type**: backend
**Dependencies**: [DOTAZ-002]

## Popis

Definice abstraktniho `DatabaseDriver` interface v `src/bun/db/driver.ts`. Interface pokryva:
- **Lifecycle**: `connect`, `disconnect`, `isConnected`
- **Query execution**: `execute` s parametry, `cancel`
- **Schema introspekce**: `getSchemas`, `getTables`, `getColumns`, `getIndexes`, `getForeignKeys`, `getPrimaryKey`
- **Transakce**: `beginTransaction`, `commit`, `rollback`, `inTransaction`
- **Metadata**: `getDriverType`, `quoteIdentifier`

Implementace SQLite driveru v `src/bun/db/sqlite-driver.ts` pomoci Bun.SQL (`import { SQL } from "bun"`) s unified API. SQLite schema introspekce pres `sqlite_master` a PRAGMA prikazy (`table_info`, `index_list`, `index_info`, `foreign_key_list`). SQLite nema schemas — vraci default `"main"`.

## Soubory

- `src/bun/db/driver.ts` — abstraktni DatabaseDriver interface, typy pro query result, column info, index info, foreign key info
- `src/bun/db/sqlite-driver.ts` — SQLite implementace DatabaseDriver interface, schema introspekce pres sqlite_master a PRAGMA

## Akceptační kritéria

- [ ] DatabaseDriver interface je kompletni dle ARCHITECTURE.md
- [ ] SQLite driver implementuje vsechny metody interface
- [ ] `connect` otevre SQLite soubor, `disconnect` ho zavre
- [ ] `execute` vraci typovana data (rows, columns, affectedRows)
- [ ] Schema introspekce (`getTables`, `getColumns`, `getIndexes`, `getForeignKeys`, `getPrimaryKey`) vraci spravna data
- [ ] `getSchemas` vraci `["main"]` pro SQLite
- [ ] `quoteIdentifier` spravne quotuje identifikatory pro SQLite
- [ ] Transakce (`beginTransaction`, `commit`, `rollback`) fungujou spravne

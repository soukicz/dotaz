# DOTAZ-004: Lokalni app SQLite databaze s migracemi

**Phase**: 1 — Foundation
**Type**: backend
**Dependencies**: [DOTAZ-002]

## Popis

Implementace lokalni SQLite databaze pro ukladani app dat (connections, history, settings, saved views).

Soubor `src/bun/storage/app-db.ts` — singleton trida `AppDatabase`. Inicializace SQLite pres `bun:sqlite` v `Utils.paths.userData/dotaz.db`. Automaticke vytvoreni DB souboru pokud neexistuje.

Migrace v `src/bun/storage/migrations.ts` — system verzovanych migraci. Tabulka `schema_version` pro tracking aktualni verze schematu. Migrace 001: vytvoreni tabulek `connections`, `query_history`, `saved_views`, `settings` (schema dle ARCHITECTURE.md).

CRUD operace:
- **connections**: `list`, `getById`, `create`, `update`, `delete`
- **settings**: `get`, `set`
- **saved_views**: `list`, `create`, `update`, `delete`
- **history**: `add`, `list` (s filtrovanim), `clear`

## Soubory

- `src/bun/storage/app-db.ts` — singleton trida AppDatabase, inicializace DB, CRUD operace pro connections, settings, saved views, history
- `src/bun/storage/migrations.ts` — system verzovanych migraci, tabulka schema_version, migrace 001 s vytvorenim vsech tabulek

## Akceptační kritéria

- [ ] DB soubor se vytvori pri prvnim spusteni v `Utils.paths.userData/dotaz.db`
- [ ] Migrace probehnou automaticky pri inicializaci AppDatabase
- [ ] Tabulka `schema_version` spravne trackuje aktualni verzi schematu
- [ ] CRUD operace pro connections fungujou spravne (list, getById, create, update, delete)
- [ ] CRUD operace pro settings fungujou spravne (get, set)
- [ ] CRUD operace pro saved_views fungujou spravne (list, create, update, delete)
- [ ] History operace fungujou spravne (add, list s filtrovanim, clear)
- [ ] AppDatabase je singleton — vice volani vraci stejnou instanci

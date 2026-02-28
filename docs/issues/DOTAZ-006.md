# DOTAZ-006: PostgreSQL driver

**Phase**: 1 — Foundation
**Type**: backend
**Dependencies**: [DOTAZ-005]

## Popis

Implementace PostgreSQL driveru v `src/bun/db/postgres-driver.ts`. Pouziva Bun.SQL (`import { SQL } from "bun"`) s connection string URL. Connection pooling (vestaveny v Bun.SQL).

Query execution s tagged template literals a parametrizovanymi dotazy. Query cancellation pres `AbortController`.

Schema introspekce pres `information_schema` (`columns`, `tables`, `schemata`) a `pg_catalog` (`pg_indexes`, `pg_constraint` pro FK). Podpora pro vestavene PG typy (`jsonb`, `array`, `timestamp`, `uuid`, `numeric`).

`quoteIdentifier` s dvojitymi uvozovkami (standard SQL quoting pro PostgreSQL).

## Soubory

- `src/bun/db/postgres-driver.ts` — PostgreSQL implementace DatabaseDriver interface, connection pooling, schema introspekce pres information_schema a pg_catalog

## Akceptační kritéria

- [ ] Driver implementuje kompletni DatabaseDriver interface
- [ ] Connection pooling funguje (vestaveny v Bun.SQL)
- [ ] Schema introspekce vraci spravna data pro PostgreSQL (schemas, tables, columns, indexes, foreign keys)
- [ ] Dotazy s parametry fungujou spravne
- [ ] Query cancellation pres AbortController funguje
- [ ] Spravne quotuje identifikatory dvojitymi uvozovkami
- [ ] Podpora pro PG typy (jsonb, array, timestamp, uuid, numeric)
- [ ] `connect` vytvori connection pool, `disconnect` ho zavre

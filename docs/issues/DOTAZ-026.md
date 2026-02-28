# DOTAZ-026: SQL console RPC handlery (execute, cancel, format)

**Phase**: 4 — SQL Editor
**Type**: backend
**Dependencies**: [DOTAZ-025, DOTAZ-008]

## Popis

Implementace `query.*` RPC handlerů v `src/bun/rpc-handlers.ts`.

- **Handler `query.execute`** — přijímá `connectionId`, `sql`, `queryId`. Volá `QueryExecutor.executeQuery()`. Vrací `QueryResult` (nebo pole `QueryResult` pro multi-statement).
- **Handler `query.cancel`** — přijímá `queryId`, volá `QueryExecutor.cancelQuery()`.
- **Handler `query.format`** — přijímá SQL string, vrací naformátovaný SQL.

Implementace jednoduchého SQL formátování (základní indentace klíčových slov: `SELECT`, `FROM`, `WHERE`, `ORDER BY`, `GROUP BY`, `HAVING`, `JOIN` na nový řádek, klíčová slova uppercase).

Kompletní implementace stubs pro `query.*` z DOTAZ-008.

## Soubory

- `src/bun/rpc-handlers.ts` — `query.*` handlery: `execute`, `cancel`, `format`

## Akceptační kritéria

- [ ] `query.execute` spustí SQL a vrátí výsledek
- [ ] `query.cancel` přeruší běžící dotaz
- [ ] `query.format` naformátuje SQL (klíčová slova uppercase, indentace)
- [ ] Chyby obsahují pozici (řádek/sloupec pokud dostupné)
- [ ] Multi-statement vrací pole výsledků

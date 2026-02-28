# DOTAZ-025: QueryExecutor service s cancellation

**Phase**: 4 — SQL Editor
**Type**: backend
**Dependencies**: [DOTAZ-007]

## Popis

Implementace `QueryExecutor` service v `src/bun/services/query-executor.ts` (rozšíření stávajícího souboru). Metoda `executeQuery(connectionId, sql, params?)` — získá driver přes `ConnectionManager`, spustí dotaz.

Podpora multi-statement: rozdělení SQL na jednotlivé statementy (split by `";"`), sekvenční spuštění, agregace výsledků.

Query cancellation: každý running query má unikátní `queryId`, mapa `runningQueries` (`queryId` → `AbortController`). Metoda `cancelQuery(queryId)` — volá abort na controller, `driver.cancel()`.

Měření doby trvání dotazu (start → end, v ms).

Výsledek: `QueryResult` s `fields` (sloupce), `rows` (data), `rowCount` (affected rows pro DML), `duration` (ms), `error` (pokud chyba). Pro SELECT: vrací data. Pro INSERT/UPDATE/DELETE: vrací affected rows count.

Timeout: konfigurovatelný query timeout (default 30s).

## Soubory

- `src/bun/services/query-executor.ts` — QueryExecutor service, multi-statement podpora, cancellation přes AbortController, měření duration, timeout handling

## Akceptační kritéria

- [ ] SELECT dotazy vrací data s field metadata
- [ ] DML dotazy vrací affected rows
- [ ] Multi-statement funguje (vrací pole výsledků)
- [ ] Cancellation funguje (dotaz se přeruší přes `cancelQuery`)
- [ ] Duration je měřen (start → end v ms)
- [ ] Timeout funguje (default 30s, konfigurovatelný)
- [ ] Chyby jsou zachyceny a vráceny čitelně

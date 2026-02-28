# DOTAZ-027: Editor store (SQL console stav)

**Phase**: 4 — SQL Editor
**Type**: frontend
**Dependencies**: [DOTAZ-009, DOTAZ-026]

## Popis

Implementace editor store v `src/mainview/stores/editor.ts`. Solid.js `createStore` pro stav SQL konzole.

Stav per-tab (každý SQL console tab má vlastní editor state):
- `content` — SQL text
- `results` — pole `QueryResult` (pro multi-statement)
- `isRunning` — boolean
- `error` — `string | null`
- `duration` — ms
- `queryId` — pro cancellation
- `txMode` — `"auto-commit" | "manual"`
- `inTransaction` — boolean

Akce:
- `executeQuery(tabId)` — generuje `queryId`, volá `rpc.query.execute()`, aktualizuje `results`/`error`/`duration`
- `executeSelected(tabId, selectedText)` — spustí jen vybraný text
- `cancelQuery(tabId)` — volá `rpc.query.cancel(queryId)`
- `formatSql(tabId)` — volá `rpc.query.format()`
- `setTxMode(tabId, mode)`
- `beginTransaction(tabId)`
- `commitTransaction(tabId)`
- `rollbackTransaction(tabId)`

Historie spuštěných dotazů se automaticky loguje (volá history RPC).

## Soubory

- `src/mainview/stores/editor.ts` — editor store s per-tab stavem, execute/cancel/format akcemi, transaction managementem

## Akceptační kritéria

- [ ] Store spravuje SQL obsah a výsledky per-tab
- [ ] `executeQuery` volá RPC a aktualizuje stav
- [ ] `cancelQuery` funguje (přeruší běžící dotaz)
- [ ] `isRunning` se správně nastavuje (true při spuštění, false po dokončení)
- [ ] Error se zobrazí při chybě dotazu
- [ ] Duration se uloží po dokončení dotazu
- [ ] Transaction mode funguje (auto-commit / manual s begin/commit/rollback)

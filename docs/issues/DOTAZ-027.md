# DOTAZ-027: Editor store (SQL console state)

**Phase**: 4 — SQL Editor
**Type**: frontend
**Dependencies**: [DOTAZ-009, DOTAZ-026]

## Description

Implementation of editor store in `src/mainview/stores/editor.ts`. Solid.js `createStore` for SQL console state.

State per-tab (each SQL console tab has its own editor state):
- `content` — SQL text
- `results` — array of `QueryResult` (for multi-statement)
- `isRunning` — boolean
- `error` — `string | null`
- `duration` — ms
- `queryId` — for cancellation
- `txMode` — `"auto-commit" | "manual"`
- `inTransaction` — boolean

Actions:
- `executeQuery(tabId)` — generates `queryId`, calls `rpc.query.execute()`, updates `results`/`error`/`duration`
- `executeSelected(tabId, selectedText)` — runs only selected text
- `cancelQuery(tabId)` — calls `rpc.query.cancel(queryId)`
- `formatSql(tabId)` — calls `rpc.query.format()`
- `setTxMode(tabId, mode)`
- `beginTransaction(tabId)`
- `commitTransaction(tabId)`
- `rollbackTransaction(tabId)`

History of executed queries is automatically logged (calls history RPC).

## Files

- `src/mainview/stores/editor.ts` — editor store with per-tab state, execute/cancel/format actions, transaction management

## Acceptance Criteria

- [ ] Store manages SQL content and results per-tab
- [ ] `executeQuery` calls RPC and updates state
- [ ] `cancelQuery` works (interrupts running query)
- [ ] `isRunning` is set correctly (true when running, false when finished)
- [ ] Error is displayed on query error
- [ ] Duration is saved after query completion
- [ ] Transaction mode works (auto-commit / manual with begin/commit/rollback)

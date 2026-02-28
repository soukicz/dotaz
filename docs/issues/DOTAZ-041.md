# DOTAZ-041: Query history backend + RPC

**Phase**: 6 — Advanced Features
**Type**: backend
**Dependencies**: [DOTAZ-004, DOTAZ-025]

## Popis

Implementace history.* RPC handleru v src/bun/rpc-handlers.ts. Automaticke logovani kazdeho spusteneho dotazu pres QueryExecutor do app DB (tabulka query_history). Logovana data: connection_id, sql, status (success/error), duration_ms, row_count, error_message, executed_at. Handler history.list(connectionId?, limit?, offset?, search?) — vraci seznam historie. Filtrovani dle connection, search v SQL textu (LIKE), pagination. Razeni dle executed_at DESC. Handler history.clear(connectionId?) — smazani historie (cele nebo pro connection). Integrace s QueryExecutor: po kazdem execute se automaticky zaloguje vysledek.

## Soubory

- `src/bun/rpc-handlers.ts` — history.list a history.clear handlery
- `src/bun/services/query-executor.ts` — integrace automatickeho logovani dotazu

## Akceptační kritéria

- [ ] Kazdy spusteny dotaz se zaloguje automaticky do query_history
- [ ] history.list vraci historii s paginaci (limit, offset)
- [ ] Filtrovani dle connection funguje
- [ ] Search v SQL textu funguje (LIKE)
- [ ] history.clear funguje (cela historie i per-connection)
- [ ] Metadata (duration_ms, row_count, status) jsou spravne zaznamenana

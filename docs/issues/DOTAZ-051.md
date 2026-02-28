# DOTAZ-051: Settings storage + preferences

**Phase**: 7 — Polish
**Type**: backend
**Dependencies**: [DOTAZ-004]

## Popis

Implementace settings.* RPC handlerů v src/bun/rpc-handlers.ts. Handler settings.get(key) — načte hodnotu z app DB tabulky settings. Handler settings.set(key, value) — uloží/aktualizuje hodnotu. Handler settings.getAll() — vrací všechna nastavení. Výchozí nastavení: defaultPageSize (100), defaultTxMode ("auto-commit"), theme ("dark"), queryTimeout (30000), maxHistoryEntries (1000), clipboardIncludeHeaders (true), exportDefaultFormat ("csv"). Nastavení se ukládají jako key-value v app DB. Frontend: jednoduchý settings panel (přístup přes menu nebo command palette) — zatím bez UI, jen backend připravenost.

## Soubory

- `src/bun/rpc-handlers.ts` — settings.get, settings.set, settings.getAll handlery
- `src/bun/storage/app-db.ts` — settings CRUD operace, výchozí hodnoty

## Akceptační kritéria

- [ ] settings.get(key) vrací hodnotu pro existující klíč
- [ ] settings.get(key) vrací výchozí hodnotu pokud klíč neexistuje
- [ ] settings.set(key, value) uloží novou hodnotu
- [ ] settings.set(key, value) aktualizuje existující klíč
- [ ] settings.getAll() vrací všechna nastavení
- [ ] Hodnoty se persistují v app DB

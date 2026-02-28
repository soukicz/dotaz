# DOTAZ-036: Saved views backend (CRUD)

**Phase**: 6 — Advanced Features
**Type**: backend
**Dependencies**: [DOTAZ-004]

## Popis

Implementace views.* RPC handleru v src/bun/rpc-handlers.ts. Handler views.list(connectionId, schema, table) — vraci ulozene views pro danou tabulku z app DB. Handler views.save(view) — ulozi novy view (nazev, connectionId, schema, table, config JSON: viditelne sloupce, poradi, sirky, sort, filtry). Handler views.update(viewId, changes) — aktualizace existujiciho view. Handler views.delete(viewId) — smazani view. Config JSON obsahuje: columns (pole {name, visible, width, pinned}), sort (pole {column, direction}), filters (pole ColumnFilter). Validace: unikatni nazev view v ramci tabulky, povinne pole.

## Soubory

- `src/bun/rpc-handlers.ts` — views.list, views.save, views.update, views.delete handlery

## Akceptační kritéria

- [ ] CRUD operace pro views funguji (create, read, update, delete)
- [ ] Views jsou vazany na connection+schema+table
- [ ] Config JSON se spravne serializuje a deserializuje
- [ ] Validace unikatnosti nazvu view v ramci tabulky
- [ ] views.list vraci views pro konkretni tabulku
- [ ] Povinne pole jsou validovana

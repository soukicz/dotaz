# DOTAZ-018: Grid store (data grid stav)

**Phase**: 3 — Data Grid
**Type**: frontend
**Dependencies**: [DOTAZ-009, DOTAZ-017]

## Popis

Implementace grid store v `src/mainview/stores/grid.ts`. Solid.js `createStore` pro stav data gridu. Stav je per-tab — každý data grid tab má vlastní grid state:

- `rows` — data řádků
- `columns` — metadata sloupců (name, type, nullable, isPrimaryKey, isForeignKey)
- `totalCount` — celkový počet řádků
- `currentPage` — aktuální stránka
- `pageSize` — velikost stránky (default 100)
- `sort` — pole `{column, direction}`
- `filters` — pole `ColumnFilter`
- `selectedRows` — Set řádkových indexů
- `columnConfig` — viditelnost, pořadí, šířky, pinned

Akce:

- `loadTableData(connectionId, schema, table)` — volá RPC, naplní store
- `setPage(page)` — změna stránky
- `toggleSort(column)` — klik přidá/změní sort
- `setFilter(filter)` — přidání/aktualizace filtru
- `clearFilters()` — reset všech filtrů
- `selectRow(index)` — výběr jednoho řádku
- `selectRange(from, to)` — výběr rozsahu
- `selectAll()` — výběr všech řádků
- `getSelectedData()` — vrací data vybraných řádků

Automatický reload při změně sort/filter/page.

## Soubory

- `src/mainview/stores/grid.ts` — grid store s createStore, per-tab state, akce pro načítání dat, paginaci, sort, filtry a výběr řádků

## Akceptační kritéria

- [ ] Store správně načítá data přes RPC
- [ ] Paginace funguje (setPage trigger reload)
- [ ] Sort trigger reload dat
- [ ] Filter trigger reload dat
- [ ] Výběr řádků funguje (single, range, all)
- [ ] Per-tab state je izolovaný (každý tab má vlastní grid state)

# DOTAZ-021: Pagination + total count

**Phase**: 3 — Data Grid
**Type**: frontend
**Dependencies**: [DOTAZ-020]

## Popis

Implementace Pagination komponenty v `src/mainview/components/grid/Pagination.tsx`.

Zobrazuje:

- "Showing X-Y of Z rows" (s formátováním tisíců)
- Navigační tlačítka: First, Previous, čísla stránek, Next, Last
- Aktuální stránka zvýrazněna
- Dropdown pro page size (25, 50, 100, 250, 500)

Integrace s grid store:

- Čte `currentPage`, `pageSize`, `totalCount`
- Volá `setPage()`, `setPageSize()` akce
- Při změně `pageSize` se vrátí na stránku 1

Loading indikátor ve status baru při načítání nové stránky. Total count se načítá asynchronně (může být pomalý pro velké tabulky) — zobrazí "counting..." mezitím.

## Soubory

- `src/mainview/components/grid/Pagination.tsx` — paginační komponenta s navigací, page size dropdown, zobrazením rozsahu řádků a asynchronním total count

## Akceptační kritéria

- [ ] Paginace zobrazuje správný rozsah řádků ("Showing X-Y of Z rows")
- [ ] Navigace funguje (first, prev, next, last, čísla stránek)
- [ ] Page size dropdown funguje (25, 50, 100, 250, 500)
- [ ] Total count se zobrazí (nebo "counting..." při načítání)
- [ ] Změna stránky načte nová data přes grid store

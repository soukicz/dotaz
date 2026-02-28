# DOTAZ-020: Virtual scrolling + GridRow + GridCell

**Phase**: 3 — Data Grid
**Type**: frontend
**Dependencies**: [DOTAZ-019]

## Popis

Implementace virtual scrolling pro efektivní rendering velkých datasetů.

`VirtualScroller.tsx` — wrapper kolem `@tanstack/solid-virtual` (`createVirtualizer`):

- `estimateSize` pro řádky (32px default)
- `overscan` (5 řádků)
- Kontejner s `overflow-y: auto`, renderuje pouze viditelné řádky

`GridRow.tsx` — řádek gridu:

- Zobrazuje buňky pro každý viditelný sloupec
- Klik pro výběr řádku (`selectedRows` v grid store)
- Ctrl+klik pro multi-select
- Shift+klik pro range select
- Hover efekt
- Zvýraznění vybraného řádku
- Střídavé pozadí (zebra striping)

`GridCell.tsx` — buňka gridu, renderuje hodnotu dle datového typu:

- NULL → šedý kurzívní text "NULL"
- Dlouhé texty → zkrácení s ellipsis (tooltip s plnou hodnotou)
- JSON/JSONB → formátovaný s odsazením v expandable view
- Boolean → checkbox ikona
- Timestamp → formátovaný datum
- Čísla zarovnána doprava

## Soubory

- `src/mainview/components/grid/VirtualScroller.tsx` — virtual scrolling wrapper s `@tanstack/solid-virtual`, `estimateSize` a `overscan` konfigurací
- `src/mainview/components/grid/GridRow.tsx` — řádek gridu s výběrem (single, multi, range), hover efektem a zebra stripingem
- `src/mainview/components/grid/GridCell.tsx` — buňka gridu s type-aware renderováním (NULL, text, JSON, boolean, timestamp, čísla)

## Akceptační kritéria

- [ ] Virtual scrolling renderuje pouze viditelné řádky
- [ ] Plynulý scroll s 10000+ řádky
- [ ] NULL hodnoty jsou vizuálně odlišeny (šedý kurzívní text)
- [ ] Datové typy se renderují správně (boolean, timestamp, JSON, čísla)
- [ ] Výběr řádků funguje (single klik, Ctrl+klik multi, Shift+klik range)
- [ ] Zebra striping je viditelný

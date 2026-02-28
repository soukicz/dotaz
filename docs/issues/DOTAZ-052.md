# DOTAZ-052: Data refresh (F5) + stale indikace

**Phase**: 7 — Polish
**Type**: frontend
**Dependencies**: [DOTAZ-018]

## Popis

Implementace data refresh funkcionality. F5 v data grid tabu → reload aktuální stránky dat (volá loadTableData znovu). Indikace "stale" dat: pokud data byla načtena před > 5 minutami, zobrazit jemný indikátor ve status baru ("Data loaded 5m ago"). Auto-refresh po apply changes (po úspěšném apply pending changes). Refresh tlačítko v toolbaru gridu (ikona reload). Při refreshi: loading indikátor (spinner overlay na gridu), zachovat current page, sort, filters. Aktualizace total count při refreshi. Integrace s keyboard shortcut systémem (F5 → command "refresh-data").

## Soubory

- `src/mainview/stores/grid.ts` — refresh logic, stale tracking (timestamp posledního načtení), loadTableData re-fetch
- `src/mainview/components/grid/DataGrid.tsx` — refresh tlačítko v toolbaru, loading spinner overlay, stale indikátor

## Akceptační kritéria

- [ ] F5 reloadne data v aktivním data grid tabu
- [ ] Stale indikátor se zobrazí po 5 minutách od načtení
- [ ] Auto-refresh po úspěšném apply changes
- [ ] Loading spinner se zobrazí během refresh
- [ ] Page, sort a filters se zachovají po refreshi
- [ ] Refresh tlačítko v toolbaru funguje

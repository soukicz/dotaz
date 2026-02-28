# DOTAZ-052: Data refresh (F5) + stale indication

**Phase**: 7 — Polish
**Type**: frontend
**Dependencies**: [DOTAZ-018]

## Description

Implementation of data refresh functionality. F5 in data grid tab → reload current data page (calls loadTableData again). Indication of "stale" data: if data was loaded more than 5 minutes ago, display subtle indicator in status bar ("Data loaded 5m ago"). Auto-refresh after apply changes (after successful apply pending changes). Refresh button in grid toolbar (reload icon). During refresh: loading indicator (spinner overlay on grid), preserve current page, sort, filters. Update total count during refresh. Integration with keyboard shortcut system (F5 → command "refresh-data").

## Files

- `src/mainview/stores/grid.ts` — refresh logic, stale tracking (timestamp of last load), loadTableData re-fetch
- `src/mainview/components/grid/DataGrid.tsx` — refresh button in toolbar, loading spinner overlay, stale indicator

## Acceptance Criteria

- [ ] F5 reloads data in active data grid tab
- [ ] Stale indicator displays after 5 minutes from load
- [ ] Auto-refresh after successful apply changes
- [ ] Loading spinner displays during refresh
- [ ] Page, sort and filters are preserved after refresh
- [ ] Refresh button in toolbar works

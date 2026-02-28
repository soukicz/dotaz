# DOTAZ-035: PendingChanges panel + apply/revert workflow

**Phase**: 5 — Data Editing
**Type**: frontend
**Dependencies**: [DOTAZ-033, DOTAZ-034]

## Description

Implementation of PendingChanges panel in src/mainview/components/edit/PendingChanges.tsx. Panel displaying list of all pending changes in current data grid tab. Each change: type (INSERT/UPDATE/DELETE) with icon and color, table, description (for UPDATE: "Column X: old -> new", for INSERT: "New row", for DELETE: "Row PK=..."). Buttons: Apply All (sends all changes to backend via rpc.data.applyChanges), Revert All (discards all pending changes), Preview SQL (displays generated SQL via rpc.data.generateSql). Revert individual changes (x button for each). Apply runs in transaction -> on success clear pendingChanges and reload data. On error displays error and keeps pendingChanges. Counter in grid toolbar: "3 pending changes" badge. Warning when closing tab with pending changes.

## Files

- `src/mainview/components/edit/PendingChanges.tsx` — panel with list of pending changes
- `src/mainview/components/grid/DataGrid.tsx` — integration of pending changes badge into toolbar

## Acceptance Criteria

- [ ] Panel displays all pending changes with type and description
- [ ] Apply All sends changes to backend and reloads data
- [ ] Revert All clears all pending changes
- [ ] Revert individual changes works (x button)
- [ ] Preview SQL displays generated SQL
- [ ] Error on apply displays error and keeps pendingChanges
- [ ] Badge with count of pending changes in grid toolbar
- [ ] Warning when closing tab with unsaved changes

# DOTAZ-018: Grid store (data grid state)

**Phase**: 3 — Data Grid
**Type**: frontend
**Dependencies**: [DOTAZ-009, DOTAZ-017]

## Description

Implementation of grid store in `src/mainview/stores/grid.ts`. Solid.js `createStore` for data grid state. State is per-tab — each data grid tab has its own grid state:

- `rows` — row data
- `columns` — column metadata (name, type, nullable, isPrimaryKey, isForeignKey)
- `totalCount` — total number of rows
- `currentPage` — current page
- `pageSize` — page size (default 100)
- `sort` — array of `{column, direction}`
- `filters` — array of `ColumnFilter`
- `selectedRows` — Set of row indices
- `columnConfig` — visibility, order, widths, pinned

Actions:

- `loadTableData(connectionId, schema, table)` — calls RPC, fills store
- `setPage(page)` — page change
- `toggleSort(column)` — click adds/changes sort
- `setFilter(filter)` — add/update filter
- `clearFilters()` — reset all filters
- `selectRow(index)` — select single row
- `selectRange(from, to)` — select range
- `selectAll()` — select all rows
- `getSelectedData()` — returns data of selected rows

Automatic reload on sort/filter/page change.

## Files

- `src/mainview/stores/grid.ts` — grid store with createStore, per-tab state, actions for loading data, pagination, sort, filters and row selection

## Acceptance Criteria

- [ ] Store correctly loads data via RPC
- [ ] Pagination works (setPage triggers reload)
- [ ] Sort triggers data reload
- [ ] Filter triggers data reload
- [ ] Row selection works (single, range, all)
- [ ] Per-tab state is isolated (each tab has its own grid state)

# DOTAZ-021: Pagination + total count

**Phase**: 3 — Data Grid
**Type**: frontend
**Dependencies**: [DOTAZ-020]

## Description

Implementation of Pagination component in `src/mainview/components/grid/Pagination.tsx`.

Displays:

- "Showing X-Y of Z rows" (with thousand formatting)
- Navigation buttons: First, Previous, page numbers, Next, Last
- Current page highlighted
- Dropdown for page size (25, 50, 100, 250, 500)

Integration with grid store:

- Reads `currentPage`, `pageSize`, `totalCount`
- Calls `setPage()`, `setPageSize()` actions
- When changing `pageSize`, returns to page 1

Loading indicator in status bar when loading new page. Total count is loaded asynchronously (may be slow for large tables) — shows "counting..." in the meantime.

## Files

- `src/mainview/components/grid/Pagination.tsx` — pagination component with navigation, page size dropdown, row range display and asynchronous total count

## Acceptance Criteria

- [ ] Pagination displays correct row range ("Showing X-Y of Z rows")
- [ ] Navigation works (first, prev, next, last, page numbers)
- [ ] Page size dropdown works (25, 50, 100, 250, 500)
- [ ] Total count is displayed (or "counting..." while loading)
- [ ] Changing page loads new data via grid store

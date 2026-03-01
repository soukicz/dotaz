# DOTAZ-055: Quick full-text search in data grid

**Phase**: 8 — Gaps
**Type**: fullstack
**Dependencies**: [DOTAZ-022]

## Description

Add a quick text search bar to the data grid that filters displayed rows across all visible columns (FR-GRID-03). This is separate from the existing column-based FilterBar — it provides a fast way to search across all data without selecting a specific column.

The search bar should appear above the grid (or integrated into the toolbar). Typing into it filters rows where any visible column contains the search text (case-insensitive). The filtering should happen server-side using a WHERE clause that ORs LIKE conditions across all visible text-compatible columns.

## Files

- `src/mainview/components/grid/DataGrid.tsx` — add quick search input to toolbar area
- `src/mainview/stores/grid.ts` — add `quickSearch` state and include it in data fetching
- `src/bun/services/query-executor.ts` — support quick search as additional WHERE clause (OR across columns with LIKE)
- `src/shared/types/rpc.ts` — add `quickSearch?: string` to `TableDataParams`

## Acceptance Criteria

- [ ] Text input in grid toolbar for quick search
- [ ] Typing filters rows where any visible column contains the search text (case-insensitive)
- [ ] Filtering is server-side (WHERE with OR LIKE across columns)
- [ ] Works alongside existing column filters (AND between quick search and column filters)
- [ ] Debounced input (300ms) to avoid excessive queries
- [ ] Clear button to reset quick search
- [ ] Search term is visually indicated when active

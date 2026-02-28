# DOTAZ-020: Virtual scrolling + GridRow + GridCell

**Phase**: 3 — Data Grid
**Type**: frontend
**Dependencies**: [DOTAZ-019]

## Description

Implementation of virtual scrolling for efficient rendering of large datasets.

`VirtualScroller.tsx` — wrapper around `@tanstack/solid-virtual` (`createVirtualizer`):

- `estimateSize` for rows (32px default)
- `overscan` (5 rows)
- Container with `overflow-y: auto`, renders only visible rows

`GridRow.tsx` — grid row:

- Displays cells for each visible column
- Click to select row (`selectedRows` in grid store)
- Ctrl+click for multi-select
- Shift+click for range select
- Hover effect
- Selection highlighting
- Alternating background (zebra striping)

`GridCell.tsx` — grid cell, renders value based on data type:

- NULL → gray italic text "NULL"
- Long texts → truncated with ellipsis (tooltip with full value)
- JSON/JSONB → formatted with indentation in expandable view
- Boolean → checkbox icon
- Timestamp → formatted date
- Numbers aligned right

## Files

- `src/mainview/components/grid/VirtualScroller.tsx` — virtual scrolling wrapper with `@tanstack/solid-virtual`, `estimateSize` and `overscan` configuration
- `src/mainview/components/grid/GridRow.tsx` — grid row with selection (single, multi, range), hover effect and zebra striping
- `src/mainview/components/grid/GridCell.tsx` — grid cell with type-aware rendering (NULL, text, JSON, boolean, timestamp, numbers)

## Acceptance Criteria

- [ ] Virtual scrolling renders only visible rows
- [ ] Smooth scroll with 10000+ rows
- [ ] NULL values are visually distinguished (gray italic text)
- [ ] Data types render correctly (boolean, timestamp, JSON, numbers)
- [ ] Row selection works (single click, Ctrl+click multi, Shift+click range)
- [ ] Zebra striping is visible

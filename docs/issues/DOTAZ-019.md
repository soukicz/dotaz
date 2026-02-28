# DOTAZ-019: DataGrid container + GridHeader

**Phase**: 3 — Data Grid
**Type**: frontend
**Dependencies**: [DOTAZ-018]

## Description

Implementation of DataGrid container in `src/mainview/components/grid/DataGrid.tsx`. Main wrapper for data grid containing:

- Toolbar (filters, actions)
- Header (columns)
- Body (rows with virtual scrolling)
- Footer (pagination)

Accepts `connectionId`, `schema`, `table` as props, on mount calls grid store `loadTableData()`.

`GridHeader.tsx` — column header row:

- Column name
- Data type icon
- Sort indicator (arrow ASC/DESC/none)
- Click on header → `toggleSort`
- Shift+click → multi-column sort
- Resize handle on column border — drag to change width (min 50px)
- Visual distinction: PK columns (key icon), FK columns (link icon), nullable (dot)
- Sticky header (remains visible when scrolling)

## Files

- `src/mainview/components/grid/DataGrid.tsx` — main data grid container with toolbar, header, body and footer sections
- `src/mainview/components/grid/GridHeader.tsx` — column header row with sort indicators, resize handles, PK/FK icons and sticky positioning

## Acceptance Criteria

- [ ] DataGrid renders with data from grid store
- [ ] Header displays columns with data type icons
- [ ] Sort by clicking on header works
- [ ] Multi-sort with Shift+click works
- [ ] Column resize drag handle works (min 50px)
- [ ] Header is sticky (remains visible when scrolling)
- [ ] PK/FK icons are displayed for respective columns

# DOTAZ-023: ColumnManager (visibility, sorting, pin)

**Phase**: 3 — Data Grid
**Type**: frontend
**Dependencies**: [DOTAZ-019]

## Description

Implementation of ColumnManager in `src/mainview/components/grid/ColumnManager.tsx`. Panel/dropdown for managing grid columns:

- List of all columns with checkbox for visibility (toggle show/hide)
- Drag & drop for changing column order (reorder)
- Pin columns left/right (fixed column during horizontal scroll)
- Reset to Default button
- Count of visible / total columns in header ("8/12 columns")

Changes are saved to grid store `columnConfig`. Pinned columns are rendered as sticky columns in GridHeader and GridRow (CSS `position: sticky`).

Accessible via gear icon in grid toolbar.

## Files

- `src/mainview/components/grid/ColumnManager.tsx` — panel for managing columns with visibility, drag & drop reordering, pin left/right and reset functionality
- `src/mainview/components/grid/GridHeader.tsx` — modification to support pinned columns (sticky positioning)
- `src/mainview/components/grid/GridRow.tsx` — modification to support pinned columns (sticky positioning)

## Acceptance Criteria

- [ ] Can hide/show columns using checkbox
- [ ] Column order can be changed with drag & drop
- [ ] Pin left/right works (sticky columns during horizontal scroll)
- [ ] Reset to Default returns to default column state
- [ ] Column count is displayed ("8/12 columns")
- [ ] Changes are reactive (grid immediately redrawn)

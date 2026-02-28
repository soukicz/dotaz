# DOTAZ-046: Context menus (grid, editor, tabs)

**Phase**: 7 — Polish
**Type**: frontend
**Dependencies**: [DOTAZ-016, DOTAZ-020, DOTAZ-028]

## Description

Extension of ContextMenu with context menus for grid, SQL editor and tabs. Grid cell (right-click): Copy Value, Copy Row, Edit Cell, Set NULL, Filter by This Value, Sort Ascending, Sort Descending. Grid row: Row Detail (opens RowDetailDialog), Delete Row, Duplicate Row. Grid column (right-click on header): Sort ASC/DESC, Hide Column, Pin Left/Right, Filter by Column. SQL editor: Cut, Copy, Paste, Select All, Run Selected, Format SQL, separator, Copy as INSERT. TabBar tab: Close, Close Others, Close All, Duplicate Tab, Rename (SQL console only). Actions call respective store methods and commands.

## Files

- `src/mainview/components/grid/DataGrid.tsx` — grid context menu (cell, row, header)
- `src/mainview/components/editor/SqlEditor.tsx` — editor context menu (Cut, Copy, Paste, Run Selected, Format SQL, Copy as INSERT)
- `src/mainview/components/layout/TabBar.tsx` — tab context menu (Close, Close Others, Close All, Duplicate, Rename)

## Acceptance Criteria

- [ ] Right-click on grid cell displays relevant actions
- [ ] Right-click on header displays column actions
- [ ] Right-click in editor displays editor actions
- [ ] Right-click on tab displays tab actions
- [ ] All actions work correctly

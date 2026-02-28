# DOTAZ-038: FK navigation (follow foreign keys)

**Phase**: 6 — Advanced Features
**Type**: frontend
**Dependencies**: [DOTAZ-017, DOTAZ-019]

## Description

Implementation of FK navigation in the data grid. FK columns visually distinguished (link icon, underlined value). Click on FK value -> navigate to the referenced row: opens a new data grid tab for the target table, with a filter on the FK value (WHERE target_pk = clicked_value). Tooltip on FK cell: "-> target_table.target_column". Breadcrumb / back navigation: history of FK navigations within the tab, Back button to return to the previous table/filter. Context menu on FK cell: "Go to referenced row", "Open target table" (without filter). Extending grid store with fkNavigationHistory (stack for back navigation). FK metadata comes from schema.getForeignKeys RPC.

## Files

- `src/mainview/components/grid/GridCell.tsx` — extension for FK visual distinction and click navigation
- `src/mainview/components/grid/DataGrid.tsx` — breadcrumb for FK navigation
- `src/mainview/stores/grid.ts` — fkNavigationHistory stack

## Acceptance Criteria

- [ ] FK columns are visually distinguished (icon, underline)
- [ ] Clicking on FK value navigates to the target row in a new tab with a filter
- [ ] Tooltip on FK cell displays the target table and column
- [ ] Back navigation works (return to previous table/filter)
- [ ] Context menu on FK cell works ("Go to referenced row", "Open target table")
- [ ] FK metadata is loaded from schema.getForeignKeys RPC

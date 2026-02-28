# DOTAZ-037: SavedViewPicker + SaveViewDialog

**Phase**: 6 — Advanced Features
**Type**: frontend
**Dependencies**: [DOTAZ-036, DOTAZ-018]

## Description

Implementation of SavedViewPicker in src/mainview/components/views/SavedViewPicker.tsx. Dropdown in the data grid toolbar for selecting a saved view. Displays "Default" (no filters/sort) + list of saved views. Click on a view -> applies its settings to the grid store (columns, sort, filters). Indication of the active view. SaveViewDialog in src/mainview/components/views/SaveViewDialog.tsx — dialog for saving the current state of the grid as a view. Input field for view name. Checkbox: "Update existing" if editing. Shows what will be saved: X filters, Y sort rules, Z hidden columns. Ctrl+S shortcut for quick save (if view has a name, update; otherwise open dialog).

## Files

- `src/mainview/components/views/SavedViewPicker.tsx` — dropdown for selecting saved views
- `src/mainview/components/views/SaveViewDialog.tsx` — dialog for saving a view

## Acceptance Criteria

- [ ] Picker displays saved views in dropdown menu
- [ ] Selecting a view applies its settings to the grid (columns, sort, filters)
- [ ] Default view returns the default state of the grid
- [ ] Saving a new view works
- [ ] Updating an existing view works
- [ ] Ctrl+S shortcut for quick save works

# DOTAZ-033: InlineEditor (cell editing in grid)

**Phase**: 5 — Data Editing
**Type**: frontend
**Dependencies**: [DOTAZ-020, DOTAZ-018, DOTAZ-032]

## Description

Implementation of InlineEditor in src/mainview/components/edit/InlineEditor.tsx. Double-click on cell -> switch to edit mode: cell changes to input/textarea. Editor type according to column data type: text -> textarea (auto-resize), number -> number input, boolean -> checkbox, date/timestamp -> date input. Escape -> cancel editing (returns original value). Tab -> move to next cell (and save change). Enter -> save and move down. F2 on selected cell -> start editing. "Set NULL" button in editor for explicit null. Changed cells: visual indication (orange border/background). Changes are saved to grid store as pendingChanges (not immediately sent to backend). New row: Ctrl+Insert or button -> adds empty row at the end with editable cells. Delete selected rows: adds to pendingChanges as "delete".

## Files

- `src/mainview/components/edit/InlineEditor.tsx` — main inline editor component
- `src/mainview/components/grid/GridCell.tsx` — extension with edit mode
- `src/mainview/stores/grid.ts` — extension with pendingChanges

## Acceptance Criteria

- [ ] Double-click activates inline editing
- [ ] Editor corresponds to column data type (text, number, boolean, date)
- [ ] Escape cancels editing and returns original value
- [ ] Tab saves change and moves to next cell
- [ ] Enter saves change and moves down
- [ ] Changed cells are visually distinguished (orange border/background)
- [ ] Set NULL works
- [ ] New row (Ctrl+Insert) works
- [ ] Delete row adds change to pendingChanges
- [ ] Changes are in pendingChanges (not on server)

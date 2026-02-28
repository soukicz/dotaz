# DOTAZ-034: RowDetailDialog (form view of row detail)

**Phase**: 5 — Data Editing
**Type**: frontend
**Dependencies**: [DOTAZ-032, DOTAZ-033]

## Description

Implementation of RowDetailDialog in src/mainview/components/edit/RowDetailDialog.tsx. Modal dialog with form view of one row. Opens: Enter on selected row, or context menu -> "Row Detail". Displays vertical form with all columns: label (column name + type), input (by type). Editing values in form — same saving to pendingChanges as inline editor. Navigation: arrow keys up/down or Previous/Next buttons to move to previous/next row. Display of PK values in dialog title. Read-only indication for PK columns (cannot edit PK). Buttons: Save (saves to pendingChanges and closes), Cancel (discards changes and closes), Set NULL for each field. Display FK info — if column is FK, shows target table.

## Files

- `src/mainview/components/edit/RowDetailDialog.tsx` — modal dialog for row detail

## Acceptance Criteria

- [ ] Dialog displays all columns with values
- [ ] Editing values works
- [ ] Navigation between rows (Previous/Next, arrows) works
- [ ] PK columns are read-only
- [ ] Save saves changes to pendingChanges
- [ ] Cancel discards changes and closes dialog
- [ ] Set NULL works for each field
- [ ] FK info is displayed for FK columns

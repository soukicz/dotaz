# DOTAZ-040: ExportDialog

**Phase**: 6 — Advanced Features
**Type**: frontend
**Dependencies**: [DOTAZ-039]

## Description

Implementation of ExportDialog in src/mainview/components/export/ExportDialog.tsx. Modal dialog for exporting data. Steps: 1) Choose format (CSV, JSON, SQL INSERT) with icons. 2) Configure based on format: CSV -> delimiter, include headers; JSON -> pretty print; SQL -> batch size. 3) Scope: entire table / current view (with filters) / selected rows. 4) Preview (first 10 rows in the chosen format — calls export.preview RPC). 5) Export button -> opens native save dialog (system.showSaveDialog) -> starts export. Progress bar during export. Access: button in the grid toolbar, or context menu.

## Files

- `src/mainview/components/export/ExportDialog.tsx` — modal dialog for exporting data

## Acceptance Criteria

- [ ] Dialog allows format selection (CSV, JSON, SQL INSERT)
- [ ] Configuration changes based on the chosen format
- [ ] Preview displays preview of the first 10 rows
- [ ] Export saves the file via native save dialog
- [ ] Progress bar shows the progress of the export
- [ ] Scope selection works (entire table / current view / selected rows)

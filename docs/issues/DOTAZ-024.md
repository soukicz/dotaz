# DOTAZ-024: Clipboard support (Ctrl+C)

**Phase**: 3 — Data Grid
**Type**: frontend
**Dependencies**: [DOTAZ-020]

## Description

Implementation of clipboard support for data grid. Ctrl+C copies selected cells/rows to clipboard.

Format: tab-separated values (TSV) — compatible with paste into Excel and Google Sheets.

Copy rules:

- If one row is selected → copies all visible columns
- If one cell is selected (focus) → copies only cell value
- If multiple rows are selected → copies all visible columns for selected rows
- Column headers as first row (optional — configurable)
- NULL values as empty string in clipboard

Implementation via `navigator.clipboard.writeText()`. Visual feedback: brief flash on copied cells or toast "Copied X rows".

## Files

- `src/mainview/components/grid/DataGrid.tsx` — keyboard handler for Ctrl+C, TSV data assembly from selected rows/cells
- `src/mainview/lib/keyboard.ts` — basic keyboard handling utility for grid shortcuts

## Acceptance Criteria

- [ ] Ctrl+C copies selected data to clipboard
- [ ] Format is TSV (works with paste into Excel and Google Sheets)
- [ ] Single cell copy works (copies only cell value)
- [ ] Multi-row copy works (copies all visible columns)
- [ ] NULL is empty string in clipboard
- [ ] Visual feedback after copying (flash or toast)

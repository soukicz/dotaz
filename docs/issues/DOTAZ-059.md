# DOTAZ-059: CSV export encoding configuration

**Phase**: 8 — Gaps
**Type**: fullstack
**Dependencies**: [DOTAZ-039, DOTAZ-040]

## Description

Add configurable character encoding for CSV export (FR-EXP-01). Currently CSV is always exported as UTF-8. Some users need other encodings (e.g., ISO-8859-1, Windows-1252) for compatibility with legacy tools or Excel in certain locales.

Add an encoding dropdown to ExportDialog when CSV format is selected. Use Node.js/Bun TextEncoder or iconv-lite for encoding conversion on the backend.

## Files

- `src/shared/types/export.ts` — add `encoding?: CsvEncoding` to `ExportOptions` with type `"utf-8" | "iso-8859-1" | "windows-1252"`
- `src/mainview/components/export/ExportDialog.tsx` — add encoding dropdown (visible only for CSV format)
- `src/bun/services/export-service.ts` — apply encoding conversion in CsvFormatter output

## Acceptance Criteria

- [ ] Encoding dropdown in ExportDialog for CSV format (UTF-8, ISO-8859-1, Windows-1252)
- [ ] Default encoding is UTF-8
- [ ] Exported CSV file uses the selected encoding
- [ ] BOM is included for UTF-8 when selected (optional toggle)
- [ ] Non-ASCII characters are correctly encoded in all supported encodings

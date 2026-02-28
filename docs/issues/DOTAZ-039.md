# DOTAZ-039: Export service (CSV, JSON, SQL INSERT)

**Phase**: 6 — Advanced Features
**Type**: backend
**Dependencies**: [DOTAZ-007, DOTAZ-014]

## Description

Implementation of ExportService in src/bun/services/export-service.ts and export.* RPC handlers. Handler export.preview(connectionId, schema, table, format, filters?, limit=10) — returns a preview of exported data (first N rows in the chosen format). Handler export.exportData(connectionId, schema, table, format, filePath, options) — exports data to a file. Formats: CSV (configurable delimiter: comma/semicolon/tab, header row, UTF-8 encoding), JSON (array of objects, pretty print), SQL INSERT (INSERT INTO statements, batch size). Export respects active filters and sort. Streaming export for large datasets (doesn't work with the entire table in memory). Column selection (only visible columns). Progress callback for UI.

## Files

- `src/bun/services/export-service.ts` — ExportService with support for CSV, JSON, SQL INSERT formats
- `src/bun/rpc-handlers.ts` — export.preview and export.exportData handlers

## Acceptance Criteria

- [ ] CSV export generates valid CSV with configurable delimiter
- [ ] JSON export generates valid JSON (array of objects, pretty print)
- [ ] SQL export generates executable INSERT INTO statements
- [ ] Preview returns a preview of the first N rows in the chosen format
- [ ] Active filters and sort are applied to the export
- [ ] Large datasets are exported without OOM (streaming)
- [ ] File is saved via native save dialog

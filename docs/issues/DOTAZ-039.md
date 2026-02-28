# DOTAZ-039: Export service (CSV, JSON, SQL INSERT)

**Phase**: 6 — Advanced Features
**Type**: backend
**Dependencies**: [DOTAZ-007, DOTAZ-014]

## Popis

Implementace ExportService v src/bun/services/export-service.ts a export.* RPC handleru. Handler export.preview(connectionId, schema, table, format, filters?, limit=10) — vraci nahled exportovanych dat (prvnich N radku ve zvolenem formatu). Handler export.exportData(connectionId, schema, table, format, filePath, options) — exportuje data do souboru. Formaty: CSV (konfigurovatelny delimiter: comma/semicolon/tab, header row, kodovani UTF-8), JSON (array of objects, pretty print), SQL INSERT (INSERT INTO statements, batch size). Export respektuje aktivni filtry a sort. Streaming export pro velke datasety (nepracuje s celou tabulkou v pameti). Vyber sloupcu (jen viditelne). Progress callback pro UI.

## Soubory

- `src/bun/services/export-service.ts` — ExportService s podporou CSV, JSON, SQL INSERT formatu
- `src/bun/rpc-handlers.ts` — export.preview a export.exportData handlery

## Akceptační kritéria

- [ ] CSV export generuje validni CSV s konfigurovatelnym delimiterem
- [ ] JSON export generuje validni JSON (array of objects, pretty print)
- [ ] SQL export generuje spustitelne INSERT INTO statements
- [ ] Preview vraci nahled prvnich N radku ve zvolenem formatu
- [ ] Aktivni filtry a sort se aplikuji na export
- [ ] Velke datasety se exportuji bez OOM (streaming)
- [ ] Soubor se ulozi pres native save dialog

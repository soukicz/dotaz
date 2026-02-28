# DOTAZ-014: File dialog + save dialog RPC handlery

**Phase**: 2 — Connection Management
**Type**: backend
**Dependencies**: [DOTAZ-008]

## Popis

Implementace RPC handlerů pro native dialogy v `src/bun/rpc-handlers.ts`.

Handler `system.showOpenDialog` — otevře native file picker dialog přes Electrobun API (`BrowserWindow` dialog metody nebo `Electrobun.dialog`). Parametry:

- `title` — titulek dialogu
- `filters` — přípony souborů, např. `[{name: "SQLite", extensions: ["db", "sqlite", "sqlite3"]}]`
- `defaultPath` — výchozí cesta

Vrací vybranou cestu nebo `null` (cancel).

Handler `system.showSaveDialog` — otevře native save dialog. Parametry:

- `title` — titulek dialogu
- `defaultFileName` — výchozí název souboru
- `filters` — přípony souborů

Vrací vybranou cestu nebo `null` (cancel).

Tyto handlery budou použity pro SQLite connection (open DB file) a export (save export file).

## Soubory

- `src/bun/rpc-handlers.ts` — rozšíření `system.*` handlerů o `showOpenDialog` a `showSaveDialog`

## Akceptační kritéria

- [ ] `showOpenDialog` otevře native file picker a vrátí cestu
- [ ] `showSaveDialog` otevře native save dialog a vrátí cestu
- [ ] Cancel vrací `null`
- [ ] Filtry souborů fungují správně
- [ ] Dialogy jsou nativní (ne HTML)

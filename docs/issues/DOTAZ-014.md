# DOTAZ-014: File dialog + save dialog RPC handlers

**Phase**: 2 — Connection Management
**Type**: backend
**Dependencies**: [DOTAZ-008]

## Description

Implementation of RPC handlers for native dialogs in `src/bun/rpc-handlers.ts`.

Handler `system.showOpenDialog` — opens native file picker dialog via Electrobun API (`BrowserWindow` dialog methods or `Electrobun.dialog`). Parameters:

- `title` — dialog title
- `filters` — file extensions, e.g. `[{name: "SQLite", extensions: ["db", "sqlite", "sqlite3"]}]`
- `defaultPath` — default path

Returns selected path or `null` (cancel).

Handler `system.showSaveDialog` — opens native save dialog. Parameters:

- `title` — dialog title
- `defaultFileName` — default file name
- `filters` — file extensions

Returns selected path or `null` (cancel).

These handlers will be used for SQLite connection (open DB file) and export (save export file).

## Files

- `src/bun/rpc-handlers.ts` — extension of `system.*` handlers with `showOpenDialog` and `showSaveDialog`

## Acceptance Criteria

- [ ] `showOpenDialog` opens native file picker and returns path
- [ ] `showSaveDialog` opens native save dialog and returns path
- [ ] Cancel returns `null`
- [ ] File filters work correctly
- [ ] Dialogs are native (not HTML)

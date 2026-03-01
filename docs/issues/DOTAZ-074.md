# DOTAZ-074: SQL query bookmarks

**Phase**: 11 — Backlog Tier 3
**Type**: fullstack
**Dependencies**: [DOTAZ-004, DOTAZ-028]

## Description

Save favorite SQL queries for quick access. Unlike query history (automatic), bookmarks are explicitly saved by the user with custom naming.

### Features
- Save current SQL query as bookmark with name and optional description
- List of bookmarks in sidebar panel or dialog
- Click bookmark to insert SQL into editor
- Organization into folders/categories
- Per-connection or global bookmarks

### Difference from Saved Views
Saved Views store grid state (filters, sort, columns). Bookmarks store SQL queries.

## Files

- `src/bun/storage/app-db.ts` — bookmarks table, CRUD methods
- `src/shared/types/rpc.ts` — add `bookmarks.*` RPC endpoints
- `src/bun/rpc-handlers.ts` — bookmark handlers
- `src/mainview/components/bookmarks/BookmarksDialog.tsx` — bookmarks list dialog with search
- `src/mainview/stores/editor.ts` — add bookmark save action

## Acceptance Criteria

- [ ] Save SQL query as bookmark (Ctrl+D or context menu)
- [ ] Name and optional description
- [ ] Searchable list of bookmarks
- [ ] Click bookmark opens SQL in editor
- [ ] Edit and delete bookmarks
- [ ] Bookmarks persist in app database

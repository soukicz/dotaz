# DOTAZ-057: SQL error position highlighting

**Phase**: 8 — Gaps
**Type**: fullstack
**Dependencies**: [DOTAZ-028, DOTAZ-030]

## Description

Display error position information in SQL editor when a query fails (FR-SQL-04). Currently errors are shown as plain text strings without indicating where in the SQL the error occurred.

PostgreSQL errors include position info (character offset via `position` field in error object). SQLite errors may include line/offset info. Parse the error details from the database driver response, pass them through QueryResult, and highlight the error position in the CodeMirror editor.

## Files

- `src/shared/types/query.ts` — extend `QueryResult.error` to include optional `position?: { line?: number; column?: number; offset?: number }`
- `src/bun/services/query-executor.ts` — parse error position from PG/SQLite error objects
- `src/bun/db/postgres-driver.ts` — extract position from PostgreSQL error
- `src/bun/db/sqlite-driver.ts` — extract position from SQLite error if available
- `src/mainview/components/editor/SqlResultPanel.tsx` — display error with position info
- `src/mainview/components/editor/SqlEditor.tsx` — highlight error position in editor (CodeMirror decoration)

## Acceptance Criteria

- [ ] PostgreSQL error position is parsed and passed through to frontend
- [ ] Error position is displayed in the result panel (e.g., "Error at line 3, column 12")
- [ ] Error position is highlighted in the CodeMirror editor (underline or marker)
- [ ] Error highlight is cleared when the query is re-executed or content changes
- [ ] Works gracefully when no position info is available (falls back to plain error message)

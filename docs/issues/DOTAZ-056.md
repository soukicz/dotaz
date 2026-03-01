# DOTAZ-056: Run current SQL statement at cursor position

**Phase**: 8 — Gaps
**Type**: fullstack
**Dependencies**: [DOTAZ-028, DOTAZ-029]

## Description

Add the ability to run only the SQL statement where the cursor is currently positioned (FR-SQL-03). Currently the editor supports "Run All" (entire content) and "Run Selected" (selected text), but not "Run Current Statement".

The implementation should detect the statement under the cursor by finding the enclosing semicolons (or start/end of content), respecting quoted strings. This can reuse the existing `splitStatements` logic from query-executor.ts to split the content and determine which statement the cursor falls within.

Add a toolbar button and keyboard shortcut (e.g., Ctrl+Enter when no selection, while Shift+Ctrl+Enter remains for Run All, or add a separate shortcut).

## Files

- `src/mainview/stores/editor.ts` — add `executeCurrentStatement(tabId)` action that extracts the statement at cursor position
- `src/mainview/components/editor/SqlEditor.tsx` — pass cursor position to store; update keyboard handler
- `src/mainview/components/editor/QueryToolbar.tsx` — add "Run Current" button or adjust existing Run button behavior
- `src/bun/services/query-executor.ts` — optionally export `splitStatements` if not already exported

## Acceptance Criteria

- [ ] Cursor in a statement → only that statement is executed
- [ ] Statement detection respects quoted strings (semicolons inside quotes are not delimiters)
- [ ] Works at start/end of content (no surrounding semicolons)
- [ ] Button in toolbar to run current statement
- [ ] Keyboard shortcut for run current statement
- [ ] Visual feedback showing which statement was executed

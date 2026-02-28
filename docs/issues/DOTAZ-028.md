# DOTAZ-028: SqlEditor with CodeMirror 6

**Phase**: 4 — SQL Editor
**Type**: frontend
**Dependencies**: [DOTAZ-027]

## Description

Implementation of `SqlEditor` in `src/mainview/components/editor/SqlEditor.tsx`. Integration of CodeMirror 6 with Solid.js.

Imports: `@codemirror/view` (`EditorView`, `keymap`), `@codemirror/state` (`EditorState`), `@codemirror/lang-sql` (`sql`, `PostgreSQL`, `SQLite` dialect depending on connection type).

Dark theme extension (matches app dark theme).

Basic extensions:
- SQL highlighting
- Line numbers
- Bracket matching
- Auto-close brackets
- Active line highlighting
- Indent on tab

Keyboard shortcuts:
- `Ctrl+Enter` → execute query (calls editor store)
- `Ctrl+Shift+Enter` → execute selected

Sync editor content with editor store (`content`). Editor height: resizable (drag handle between editor and result panel). Placeholder text: `"Write your SQL query here..."` when empty.

## Files

- `src/mainview/components/editor/SqlEditor.tsx` — CodeMirror 6 integration, SQL highlighting, keyboard shortcuts, dark theme, resize

## Acceptance Criteria

- [ ] CodeMirror renders with SQL highlighting
- [ ] Dark theme matches application
- [ ] `Ctrl+Enter` runs query
- [ ] `Ctrl+Shift+Enter` runs selected text
- [ ] Content syncs with store
- [ ] Resize between editor and results works
- [ ] Dialect matches connection type (PostgreSQL / SQLite)

# DOTAZ-028: SqlEditor s CodeMirror 6

**Phase**: 4 — SQL Editor
**Type**: frontend
**Dependencies**: [DOTAZ-027]

## Popis

Implementace `SqlEditor` v `src/mainview/components/editor/SqlEditor.tsx`. Integrace CodeMirror 6 s Solid.js.

Import: `@codemirror/view` (`EditorView`, `keymap`), `@codemirror/state` (`EditorState`), `@codemirror/lang-sql` (`sql`, `PostgreSQL`, `SQLite` dialect dle connection type).

Dark theme rozšíření (odpovídá app dark theme).

Základní extensions:
- SQL highlighting
- Line numbers
- Bracket matching
- Auto-close brackets
- Active line highlighting
- Indent on tab

Klávesové zkratky:
- `Ctrl+Enter` → execute query (volá editor store)
- `Ctrl+Shift+Enter` → execute selected

Sync obsahu editoru s editor store (`content`). Výška editoru: resizable (drag handle mezi editorem a result panelem). Placeholder text: `"Write your SQL query here..."` když prázdný.

## Soubory

- `src/mainview/components/editor/SqlEditor.tsx` — CodeMirror 6 integrace, SQL highlighting, klávesové zkratky, dark theme, resize

## Akceptační kritéria

- [ ] CodeMirror se renderuje s SQL highlighting
- [ ] Dark theme odpovídá aplikaci
- [ ] `Ctrl+Enter` spustí dotaz
- [ ] `Ctrl+Shift+Enter` spustí vybraný text
- [ ] Obsah se synchronizuje se store
- [ ] Resize mezi editorem a výsledky funguje
- [ ] Dialect odpovídá typu connection (PostgreSQL / SQLite)

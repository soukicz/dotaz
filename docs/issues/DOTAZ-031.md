# DOTAZ-031: SQL autocomplete (schema-aware)

**Phase**: 4 — SQL Editor
**Type**: frontend
**Dependencies**: [DOTAZ-028, DOTAZ-012]

## Description

Implementation of schema-aware SQL autocomplete in `SqlEditor`. Extension of CodeMirror 6 autocomplete: `@codemirror/autocomplete` (`autocompletion`).

Sources of completions:
- **SQL keywords** (`SELECT`, `FROM`, `WHERE`, ...) — built-in in `@codemirror/lang-sql`
- **Table names** — from connection store (schemas → tables)
- **Column names** — context-dependent: after `"table."` offers columns of the given table
- After `FROM`/`JOIN` offers tables
- **Functions** according to DB type (PG: `now()`, `pg_sleep()`, ...; SQLite: `datetime()`, ...)
- **Schema prefixes** (for PG: `schema.table`)

Autocomplete activates automatically after a dot or manually via `Ctrl+Space`. Completions are cached and updated when connection changes or schema is refreshed.

## Files

- `src/mainview/components/editor/SqlEditor.tsx` — extension with autocomplete (schema-aware completions, contextual suggestions, cache)

## Acceptance Criteria

- [ ] Autocomplete offers SQL keywords
- [ ] Tables are offered after `FROM`/`JOIN`
- [ ] Columns are offered after `"table."`
- [ ] Completion is context-dependent on connection (PG vs SQLite)
- [ ] `Ctrl+Space` activates autocomplete manually
- [ ] Completions are updated when schema changes

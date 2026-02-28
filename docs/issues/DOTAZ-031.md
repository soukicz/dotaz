# DOTAZ-031: SQL autocomplete (schema-aware)

**Phase**: 4 — SQL Editor
**Type**: frontend
**Dependencies**: [DOTAZ-028, DOTAZ-012]

## Popis

Implementace schema-aware SQL autocomplete v `SqlEditor`. Rozšíření CodeMirror 6 autocomplete: `@codemirror/autocomplete` (`autocompletion`).

Zdroje completions:
- **SQL klíčová slova** (`SELECT`, `FROM`, `WHERE`, ...) — vestavěné v `@codemirror/lang-sql`
- **Názvy tabulek** — z connection store (schemas → tables)
- **Názvy sloupců** — kontextově závislé: po `"table."` nabízí sloupce dané tabulky
- Po `FROM`/`JOIN` nabízí tabulky
- **Funkce** dle DB typu (PG: `now()`, `pg_sleep()`, ...; SQLite: `datetime()`, ...)
- **Schema prefixy** (pro PG: `schema.table`)

Autocomplete se aktivuje automaticky po tečce nebo manuálně `Ctrl+Space`. Completions se cachují a aktualizují při změně connection nebo schema refresh.

## Soubory

- `src/mainview/components/editor/SqlEditor.tsx` — rozšíření o autocomplete (schema-aware completions, kontextové nabídky, cache)

## Akceptační kritéria

- [ ] Autocomplete nabízí SQL klíčová slova
- [ ] Tabulky se nabízí po `FROM`/`JOIN`
- [ ] Sloupce se nabízí po `"table."`
- [ ] Completion je kontextově závislý na connection (PG vs SQLite)
- [ ] `Ctrl+Space` aktivuje autocomplete manuálně
- [ ] Completions se aktualizují při změně schema

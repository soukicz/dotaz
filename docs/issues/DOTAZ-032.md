# DOTAZ-032: Data editing backend (INSERT/UPDATE/DELETE generace)

**Phase**: 5 — Data Editing
**Type**: backend
**Dependencies**: [DOTAZ-008, DOTAZ-007]

## Popis

Implementace backend logiky pro editaci dat. Rozsirenni src/bun/rpc-handlers.ts o data.applyChanges handler. Prijima connectionId, schema, table, changes (pole pending zmen). Kazda zmena ma typ: "insert" (novy radek s hodnotami), "update" (PK hodnoty + changed columns + new values), "delete" (PK hodnoty). Handler generuje SQL pro kazdou zmenu: INSERT INTO table (cols) VALUES (params), UPDATE table SET col=param WHERE pk=val, DELETE FROM table WHERE pk=val. Vse se spousti v jedne transakci (BEGIN -> statements -> COMMIT, ROLLBACK pri chybe). Handler data.generateSql — stejna logika ale vraci generovany SQL string misto spusteni (pro preview). Validace: kontrola PK existence, escapovani identifikatoru, parametrizovane hodnoty. Podpora pro SET NULL (explicitni null hodnota).

## Soubory

- `src/bun/rpc-handlers.ts` — data.applyChanges a data.generateSql handlery
- `src/bun/services/query-executor.ts` — SQL generace helper funkce

## Akceptační kritéria

- [ ] INSERT generuje spravny SQL s parametry
- [ ] UPDATE meni jen changed sloupce
- [ ] DELETE pouziva PK v WHERE klauzuli
- [ ] Vse bezi v jedne transakci (BEGIN/COMMIT/ROLLBACK)
- [ ] generateSql vraci citelny SQL string pro preview
- [ ] NULL hodnoty funguji spravne (SET NULL)
- [ ] Chyba v jednom statementu rollbackne vsechny zmeny

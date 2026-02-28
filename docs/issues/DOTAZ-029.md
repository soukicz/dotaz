# DOTAZ-029: QueryToolbar (run/cancel/tx controls)

**Phase**: 4 — SQL Editor
**Type**: frontend
**Dependencies**: [DOTAZ-027, DOTAZ-028]

## Popis

Implementace `QueryToolbar` v `src/mainview/components/editor/QueryToolbar.tsx`. Toolbar nad SQL editorem s akcemi:

- **Run / Cancel** tlačítko — přepíná se dle `isRunning` stavu. RunAll — spustí celý obsah. Run Selected — aktivní jen pokud je vybraný text.
- **Format SQL** tlačítko.
- Separator.
- **Transaction mode** přepínač: Auto-commit / Manual (toggle nebo dropdown). Pokud Manual mode: Begin Transaction, Commit, Rollback tlačítka. Vizuální indikace otevřené transakce (žluté/oranžové zvýraznění).
- Separator.
- **Connection info**: jméno aktivní connection + schema dropdown.
- Zobrazení doby trvání posledního dotazu (`"123 ms"`).

Tlačítka mají tooltips s klávesovými zkratkami.

## Soubory

- `src/mainview/components/editor/QueryToolbar.tsx` — toolbar s run/cancel, format, transaction controls, connection info, duration display

## Akceptační kritéria

- [ ] Run/Cancel přepíná dle stavu (`isRunning`)
- [ ] Run spustí dotaz
- [ ] Cancel přeruší běžící dotaz
- [ ] Format naformátuje SQL
- [ ] Transaction mode přepínač funguje (auto-commit / manual)
- [ ] Commit/Rollback viditelné jen v manual mode
- [ ] Duration se zobrazí po dokončení dotazu
- [ ] Tooltips obsahují klávesové zkratky

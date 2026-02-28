# DOTAZ-023: ColumnManager (viditelnost, řazení, pin)

**Phase**: 3 — Data Grid
**Type**: frontend
**Dependencies**: [DOTAZ-019]

## Popis

Implementace ColumnManager v `src/mainview/components/grid/ColumnManager.tsx`. Panel/dropdown pro správu sloupců v gridu:

- Seznam všech sloupců s checkboxem pro viditelnost (toggle show/hide)
- Drag & drop pro změnu pořadí sloupců (reorder)
- Pin sloupce vlevo/vpravo (fixní sloupec při horizontálním scrollu)
- Reset to Default tlačítko
- Počet viditelných / celkových sloupců v headeru ("8/12 columns")

Změny se ukládají do grid store `columnConfig`. Pinned sloupce se renderují jako sticky columns v GridHeader a GridRow (CSS `position: sticky`).

Přístup přes ikonu ozubeného kola v toolbaru gridu.

## Soubory

- `src/mainview/components/grid/ColumnManager.tsx` — panel pro správu sloupců s viditelností, drag & drop řazením, pin left/right a reset funkcí
- `src/mainview/components/grid/GridHeader.tsx` — úprava pro podporu pinned sloupců (sticky positioning)
- `src/mainview/components/grid/GridRow.tsx` — úprava pro podporu pinned sloupců (sticky positioning)

## Akceptační kritéria

- [ ] Lze skrýt/zobrazit sloupce pomocí checkboxu
- [ ] Pořadí sloupců lze změnit drag & drop
- [ ] Pin left/right funguje (sticky columns při horizontálním scrollu)
- [ ] Reset to Default vrátí výchozí stav sloupců
- [ ] Počet sloupců je zobrazen ("8/12 columns")
- [ ] Změny jsou reaktivní (grid se okamžitě překreslí)

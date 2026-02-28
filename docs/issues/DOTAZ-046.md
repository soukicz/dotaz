# DOTAZ-046: Kontextová menu (grid, editor, tabs)

**Phase**: 7 — Polish
**Type**: frontend
**Dependencies**: [DOTAZ-016, DOTAZ-020, DOTAZ-028]

## Popis

Rozšíření ContextMenu o kontextová menu pro grid, SQL editor a tabs. Grid buňka (right-click): Copy Value, Copy Row, Edit Cell, Set NULL, Filter by This Value, Sort Ascending, Sort Descending. Grid řádek: Row Detail (otevře RowDetailDialog), Delete Row, Duplicate Row. Grid sloupec (right-click na header): Sort ASC/DESC, Hide Column, Pin Left/Right, Filter by Column. SQL editor: Cut, Copy, Paste, Select All, Run Selected, Format SQL, separator, Copy as INSERT. TabBar tab: Close, Close Others, Close All, Duplicate Tab, Rename (jen SQL console). Akce volají příslušné store metody a příkazy.

## Soubory

- `src/mainview/components/grid/DataGrid.tsx` — grid context menu (buňka, řádek, header)
- `src/mainview/components/editor/SqlEditor.tsx` — editor context menu (Cut, Copy, Paste, Run Selected, Format SQL, Copy as INSERT)
- `src/mainview/components/layout/TabBar.tsx` — tab context menu (Close, Close Others, Close All, Duplicate, Rename)

## Akceptační kritéria

- [ ] Right-click na grid buňku zobrazí relevantní akce
- [ ] Right-click na header zobrazí column akce
- [ ] Right-click v editoru zobrazí editor akce
- [ ] Right-click na tab zobrazí tab akce
- [ ] Všechny akce fungují správně

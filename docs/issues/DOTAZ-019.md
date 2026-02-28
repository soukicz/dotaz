# DOTAZ-019: DataGrid kontejner + GridHeader

**Phase**: 3 — Data Grid
**Type**: frontend
**Dependencies**: [DOTAZ-018]

## Popis

Implementace DataGrid kontejneru v `src/mainview/components/grid/DataGrid.tsx`. Hlavní wrapper pro data grid obsahující:

- Toolbar (filtry, akce)
- Header (sloupce)
- Body (řádky s virtual scrolling)
- Footer (paginace)

Přijímá `connectionId`, `schema`, `table` jako props, při mount volá grid store `loadTableData()`.

`GridHeader.tsx` — řádek hlaviček sloupců:

- Název sloupce
- Ikona datového typu
- Sort indikátor (šipka ASC/DESC/none)
- Klik na hlavičku → `toggleSort`
- Shift+klik → multi-column sort
- Resize handle na hranici sloupců — drag pro změnu šířky (min 50px)
- Vizuální odlišení: PK sloupce (klíč ikona), FK sloupce (link ikona), nullable (tečka)
- Sticky header (zůstává viditelný při scrollu)

## Soubory

- `src/mainview/components/grid/DataGrid.tsx` — hlavní kontejner data gridu s toolbar, header, body a footer sekcemi
- `src/mainview/components/grid/GridHeader.tsx` — řádek hlaviček sloupců se sort indikátory, resize handles, PK/FK ikonami a sticky pozicováním

## Akceptační kritéria

- [ ] DataGrid se renderuje s daty z grid store
- [ ] Header zobrazuje sloupce s ikonami datových typů
- [ ] Sort kliknutím na header funguje
- [ ] Multi-sort s Shift+klik funguje
- [ ] Resize sloupců drag handle funguje (min 50px)
- [ ] Header je sticky (zůstává viditelný při scrollu)
- [ ] PK/FK ikony jsou zobrazeny u příslušných sloupců

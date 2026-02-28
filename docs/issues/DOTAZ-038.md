# DOTAZ-038: FK navigace (follow foreign keys)

**Phase**: 6 — Advanced Features
**Type**: frontend
**Dependencies**: [DOTAZ-017, DOTAZ-019]

## Popis

Implementace FK navigace v data gridu. FK sloupce vizualne odliseny (ikona linku, podtrzeni hodnoty). Klik na FK hodnotu -> navigace na odkazovany radek: otevre novy data grid tab pro cilovou tabulku, s filtrem na FK hodnotu (WHERE target_pk = clicked_value). Tooltip na FK bunce: "-> target_table.target_column". Breadcrumb / back navigace: historie FK navigaci v ramci tabu, tlacitko Back pro navrat na predchozi tabulku/filtr. Kontextove menu na FK bunce: "Go to referenced row", "Open target table" (bez filtru). Rozsireni grid store o fkNavigationHistory (stack pro back navigace). FK metadata pochazi ze schema.getForeignKeys RPC.

## Soubory

- `src/mainview/components/grid/GridCell.tsx` — rozsireni pro FK vizualni odliseni a klik navigaci
- `src/mainview/components/grid/DataGrid.tsx` — breadcrumb pro FK navigaci
- `src/mainview/stores/grid.ts` — fkNavigationHistory stack

## Akceptační kritéria

- [ ] FK sloupce jsou vizualne odliseny (ikona, podtrzeni)
- [ ] Klik na FK hodnotu naviguje na cilovy radek v novem tabu s filtrem
- [ ] Tooltip na FK bunce zobrazuje cilovou tabulku a sloupec
- [ ] Back navigace funguje (navrat na predchozi tabulku/filtr)
- [ ] Kontextove menu na FK bunce funguje ("Go to referenced row", "Open target table")
- [ ] FK metadata se nacitaji ze schema.getForeignKeys RPC

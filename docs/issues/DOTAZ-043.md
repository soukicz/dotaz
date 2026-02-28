# DOTAZ-043: SchemaViewer

**Phase**: 6 — Advanced Features
**Type**: frontend
**Dependencies**: [DOTAZ-008, DOTAZ-011]

## Popis

Implementace SchemaViewer v src/mainview/components/schema/SchemaViewer.tsx. Tab zobrazujici read-only strukturu tabulky. Otevira se z kontextoveho menu na tabulce v sidebar ("View Schema") nebo z data grid toolbaru. ColumnList.tsx — tabulka sloupcu: nazev, datovy typ, nullable (boolean ikona), default hodnota, PK indikator (klic ikona), FK info (-> cilova tabulka.sloupec jako klikatelny link). IndexList.tsx — tabulka indexu: nazev, sloupce, typ (unique, btree, hash), conditions. Navigacni linky: z FK -> otevrit schema cilove tabulky, tlacitko "Open Data" -> otevrit data grid pro tuto tabulku. Cte data pres schema.getColumns, schema.getIndexes, schema.getForeignKeys RPC.

## Soubory

- `src/mainview/components/schema/SchemaViewer.tsx` — hlavni komponenta schema vieweru
- `src/mainview/components/schema/ColumnList.tsx` — tabulka sloupcu s typy a constraints
- `src/mainview/components/schema/IndexList.tsx` — tabulka indexu

## Akceptační kritéria

- [ ] SchemaViewer zobrazuje sloupce s nazvy, typy a constraints
- [ ] Indexy jsou zobrazeny s nazvem, sloupci a typem
- [ ] FK linky naviguji na schema cilove tabulky
- [ ] Tlacitko "Open Data" otevre data grid tab pro tabulku
- [ ] PK a FK ikony jsou viditelne u prislusnych sloupcu
- [ ] Data se nacitaji pres schema.getColumns, schema.getIndexes, schema.getForeignKeys RPC

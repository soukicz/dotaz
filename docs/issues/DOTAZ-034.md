# DOTAZ-034: RowDetailDialog (formularovy detail radku)

**Phase**: 5 — Data Editing
**Type**: frontend
**Dependencies**: [DOTAZ-032, DOTAZ-033]

## Popis

Implementace RowDetailDialog v src/mainview/components/edit/RowDetailDialog.tsx. Modalni dialog s formularovym pohledem na jeden radek. Otevira se: Enter na vybranem radku, nebo kontextove menu -> "Row Detail". Zobrazi vertikalni formular se vsemi sloupci: label (nazev sloupce + typ), input (dle typu). Editace hodnot ve formulari — stejne ukladani do pendingChanges jako inline editor. Navigace: sipky nahoru/dolu nebo tlacitka Previous/Next pro prechod na predchozi/nasledujici radek. Zobrazeni PK hodnot v titulku dialogu. Read-only indikace pro PK sloupce (nelze editovat PK). Tlacitka: Save (ulozi do pendingChanges a zavre), Cancel (zahodi zmeny a zavre), Set NULL u kazdeho pole. Zobrazeni FK info — pokud sloupec je FK, ukaze cilovou tabulku.

## Soubory

- `src/mainview/components/edit/RowDetailDialog.tsx` — modalni dialog pro detail radku

## Akceptační kritéria

- [ ] Dialog zobrazi vsechny sloupce s hodnotami
- [ ] Editace hodnot funguje
- [ ] Navigace mezi radky (Previous/Next, sipky) funguje
- [ ] PK sloupce jsou read-only
- [ ] Save ulozi zmeny do pendingChanges
- [ ] Cancel zahodi zmeny a zavre dialog
- [ ] Set NULL funguje u kazdeho pole
- [ ] FK info je zobrazeno u FK sloupcu

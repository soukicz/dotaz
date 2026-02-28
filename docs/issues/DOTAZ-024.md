# DOTAZ-024: Clipboard podpora (Ctrl+C)

**Phase**: 3 — Data Grid
**Type**: frontend
**Dependencies**: [DOTAZ-020]

## Popis

Implementace clipboard podpory pro data grid. Ctrl+C kopíruje vybrané buňky/řádky do schránky.

Formát: tab-separated values (TSV) — kompatibilní s paste do Excelu a Google Sheets.

Pravidla kopírování:

- Pokud je vybrán jeden řádek → kopíruje všechny viditelné sloupce
- Pokud je vybraná jedna buňka (focus) → kopíruje jen hodnotu buňky
- Pokud je vybráno více řádků → kopíruje všechny viditelné sloupce pro vybrané řádky
- Hlavičky sloupců jako první řádek (volitelné — nastavení)
- NULL hodnoty jako prázdný string v clipboard

Implementace přes `navigator.clipboard.writeText()`. Vizuální feedback: krátký flash na zkopírovaných buňkách nebo toast "Copied X rows".

## Soubory

- `src/mainview/components/grid/DataGrid.tsx` — keyboard handler pro Ctrl+C, sestavení TSV dat z vybraných řádků/buněk
- `src/mainview/lib/keyboard.ts` — základní keyboard handling utilita pro grid shortcuts

## Akceptační kritéria

- [ ] Ctrl+C kopíruje vybraná data do schránky
- [ ] Formát je TSV (funguje paste do Excelu a Google Sheets)
- [ ] Single cell copy funguje (kopíruje jen hodnotu buňky)
- [ ] Multi-row copy funguje (kopíruje všechny viditelné sloupce)
- [ ] NULL je prázdný string v clipboard
- [ ] Vizuální feedback po kopírování (flash nebo toast)

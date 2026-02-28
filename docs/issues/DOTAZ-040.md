# DOTAZ-040: ExportDialog

**Phase**: 6 — Advanced Features
**Type**: frontend
**Dependencies**: [DOTAZ-039]

## Popis

Implementace ExportDialog v src/mainview/components/export/ExportDialog.tsx. Modalni dialog pro export dat. Kroky: 1) Vyber formatu (CSV, JSON, SQL INSERT) s ikonami. 2) Konfigurace dle formatu: CSV -> delimiter, include headers; JSON -> pretty print; SQL -> batch size. 3) Scope: cela tabulka / aktualni view (s filtry) / vybrane radky. 4) Nahled (prvnich 10 radku ve zvolenem formatu — vola export.preview RPC). 5) Export tlacitko -> otevre native save dialog (system.showSaveDialog) -> spusti export. Progress bar behem exportu. Pristup: tlacitko v toolbaru gridu, nebo kontextove menu.

## Soubory

- `src/mainview/components/export/ExportDialog.tsx` — modalni dialog pro export dat

## Akceptační kritéria

- [ ] Dialog umozni vyber formatu (CSV, JSON, SQL INSERT)
- [ ] Konfigurace se meni dle zvoleneho formatu
- [ ] Nahled zobrazi preview prvnich 10 radku
- [ ] Export ulozi soubor pres native save dialog
- [ ] Progress bar zobrazuje prubeh exportu
- [ ] Scope vyber funguje (cela tabulka / aktualni view / vybrane radky)

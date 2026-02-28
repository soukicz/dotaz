# DOTAZ-030: SqlResultPanel (výsledky dotazů)

**Phase**: 4 — SQL Editor
**Type**: frontend
**Dependencies**: [DOTAZ-020, DOTAZ-027]

## Popis

Implementace `SqlResultPanel` v `src/mainview/components/editor/SqlResultPanel.tsx`. Panel pod SQL editorem zobrazující výsledky dotazů.

Využívá existující grid komponenty (`GridHeader`, `VirtualScroller`, `GridRow`, `GridCell`) pro zobrazení SELECT výsledků.

Tab bar pro multiple result sets (pokud multi-statement SELECT). Pro DML: zobrazení `"X rows affected"` zprávy. Pro errors: zobrazení chybové zprávy s červeným pozadím, pozice chyby pokud dostupná.

Metadata řádek: počet řádků, počet sloupců, doba trvání. Prázdný stav: `"Run a query to see results"` placeholder.

Resize handle nahoře pro změnu výšky panelu (sdílí prostor s editorem). Panel lze minimalizovat/maximalizovat.

## Soubory

- `src/mainview/components/editor/SqlResultPanel.tsx` — result panel s grid zobrazením, multi-result tabs, DML/error zobrazení, metadata, resize

## Akceptační kritéria

- [ ] SELECT výsledky se zobrazí v gridu
- [ ] Multiple result sets mají tab bar
- [ ] DML zobrazí affected rows
- [ ] Chyby se zobrazí čitelně (červené pozadí, pozice pokud dostupná)
- [ ] Metadata (rows, sloupce, duration) jsou viditelné
- [ ] Resize funguje (drag handle)
- [ ] Prázdný stav zobrazí placeholder

# DOTAZ-042: QueryHistory komponenta

**Phase**: 6 — Advanced Features
**Type**: frontend
**Dependencies**: [DOTAZ-041]

## Popis

Implementace QueryHistory v src/mainview/components/history/QueryHistory.tsx. Panel nebo tab zobrazujici historii spustenych dotazu. Seznam s: SQL text (zkraceny), connection name, timestamp, duration, status (ikona success/error), row count. Search input pro filtrovani historie. Dropdown pro filtr dle connection. Kliknuti na polozku: rozbali plny SQL text. Akce: "Run Again" (otevre SQL konzoli s timto dotazem), "Copy to Clipboard", "Copy to Console" (vlozi do aktivni konzole). Infinite scroll nebo paginace pro dlouhou historii. Clear History tlacitko s potvrzenim.

## Soubory

- `src/mainview/components/history/QueryHistory.tsx` — panel s historii dotazu

## Akceptační kritéria

- [ ] Historie zobrazuje spustene dotazy s SQL textem, timestamp, duration a status
- [ ] Search filtruje historii dle SQL textu
- [ ] Filtr dle connection funguje
- [ ] Run Again otevre novou SQL konzoli s vybranym dotazem
- [ ] Copy to Clipboard a Copy to Console funguji
- [ ] Clear History smaze historii s potvrzovacim dialogem
- [ ] Infinite scroll nebo paginace pro velkou historii

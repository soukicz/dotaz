# DOTAZ-022: FilterBar (sloupcové filtrování)

**Phase**: 3 — Data Grid
**Type**: frontend
**Dependencies**: [DOTAZ-019, DOTAZ-018]

## Popis

Implementace FilterBar v `src/mainview/components/grid/FilterBar.tsx`. Panel pod header řádkem pro přidání filtrů.

Tlačítko "Add Filter" → dropdown s výběrem sloupce → výběr operátoru (`=`, `!=`, `>`, `<`, `>=`, `<=`, `LIKE`, `IS NULL`, `IS NOT NULL`, `IN`) → input pro hodnotu.

Aktivní filtry zobrazeny jako "chips" (sloupec operátor hodnota) s tlačítkem x pro odstranění. "Clear All" tlačítko pro reset všech filtrů.

Speciální chování operátorů:

- `IS NULL` a `IS NOT NULL` nevyžadují hodnotu
- `IN` zobrazí input pro čárkou oddělené hodnoty

Po přidání/odebrání filtru: automatický reload dat přes grid store.

Inteligentní výběr operátorů dle typu sloupce:

- Text → `LIKE` dostupný
- Čísla → porovnávací operátory
- Boolean → jen `=` / `!=`

## Soubory

- `src/mainview/components/grid/FilterBar.tsx` — filter bar s přidáváním filtrů, chip zobrazením aktivních filtrů, type-aware výběrem operátorů a automatickým reloadem dat

## Akceptační kritéria

- [ ] Lze přidat filtr s výběrem sloupce, operátoru a hodnoty
- [ ] Aktivní filtry jsou zobrazeny jako chips
- [ ] Odstranění filtru kliknutím na x funguje
- [ ] Clear All funguje (reset všech filtrů)
- [ ] Data se automaticky přenačtou po přidání/odebrání filtru
- [ ] Operátory odpovídají typu sloupce (text, čísla, boolean)

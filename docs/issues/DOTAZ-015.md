# DOTAZ-015: ConnectionTree (sidebar strom)

**Phase**: 2 — Connection Management
**Type**: frontend
**Dependencies**: [DOTAZ-012, DOTAZ-013]

## Popis

Implementace ConnectionTree v `src/mainview/components/connection/ConnectionTree.tsx`. Stromová struktura v sidebar:

- Úroveň 1 — connections (ikona dle typu DB, jméno, status indikátor barevnou tečkou)
- Úroveň 2 — schemas (pro PG, SQLite má jen "main")
- Úroveň 3 — tables (s ikonou tabulky)

Kliknutí na connection: toggle expand/collapse, pokud není connected → nabídne connect. Kliknutí na tabulku: otevře DataGrid tab (volá `tabs.openTab("data-grid", {connectionId, schema, table})`).

`ConnectionTreeItem.tsx` — jednotlivá položka stromu s odsazením dle úrovně, expand/collapse šipkou, ikonou a labelem.

Tlačítko "+" v header sidebar pro přidání nové connection (otevře ConnectionDialog). Loading state: spinner při načítání schemas/tables po connect. Empty state: "No connections" s CTA pro přidání.

## Soubory

- `src/mainview/components/connection/ConnectionTree.tsx` — stromová komponenta pro zobrazení connections, schemas a tables
- `src/mainview/components/connection/ConnectionTreeItem.tsx` — jednotlivá položka stromu s odsazením, ikonou a expand/collapse
- `src/mainview/components/layout/Sidebar.tsx` — integrace ConnectionTree do sidebar

## Akceptační kritéria

- [ ] Strom zobrazuje connections → schemas → tables
- [ ] Klik na tabulku otevře data grid tab
- [ ] Stav connections je vizuálně indikován (barevná tečka)
- [ ] Expand/collapse funguje na connections a schemas
- [ ] Tlačítko "+" přidá novou connection (otevře ConnectionDialog)
- [ ] Loading spinner při načítání schemas/tables
- [ ] Empty state "No connections" s CTA pro přidání

# DOTAZ-010: AppShell layout komponenty (sidebar, tabs, status bar)

**Phase**: 1 — Foundation
**Type**: frontend
**Dependencies**: [DOTAZ-003, DOTAZ-009]

## Popis

Rozšíření AppShell o funkční layout komponenty. Sidebar.tsx — levý panel s pevnou šířkou (250px default), resize handle na pravém okraji (Resizer.tsx). Sidebar obsahuje header ("Connections"), scrollable content area pro connection tree (zatím placeholder), a collapse/expand toggle. TabBar.tsx — horizontální tab bar nad hlavním content area. Zobrazuje otevřené taby s ikonou dle typu (tabulka/SQL/schema), názvem, close button (×). Aktivní tab zvýrazněn. Tab overflow scrolling. StatusBar.tsx — spodní lišta s informacemi: aktivní connection name + status (barevná tečka), aktuální schema, počet řádků (pokud grid tab), tx stav (pokud v transakci). Resizer.tsx — vertikální resize handle mezi sidebar a content, drag pro změnu šířky, min 150px max 500px.

## Soubory

- `src/mainview/components/layout/AppShell.tsx` — úprava existujícího layoutu pro integraci nových komponent
- `src/mainview/components/layout/Sidebar.tsx` — levý panel s connection tree placeholder, collapse/expand toggle
- `src/mainview/components/layout/TabBar.tsx` — horizontální tab bar s ikonami, názvy a close tlačítky
- `src/mainview/components/layout/StatusBar.tsx` — spodní informační lišta (connection, schema, řádky, tx stav)
- `src/mainview/components/layout/Resizer.tsx` — vertikální resize handle mezi sidebar a content area

## Akceptační kritéria

- [ ] Layout se skládá z funkčních komponent
- [ ] Sidebar je resizable s min/max constraints (150px–500px)
- [ ] Tab bar zobrazuje taby s close tlačítky
- [ ] Status bar ukazuje placeholder informace
- [ ] Resize handle funguje plynule (bez performance issues)

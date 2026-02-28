# DOTAZ-011: Tab management store + TabBar

**Phase**: 1 — Foundation
**Type**: frontend
**Dependencies**: [DOTAZ-010]

## Popis

Implementace tab management store v src/mainview/stores/tabs.ts. Solid.js createStore pro stav tabů: openTabs (pole TabInfo), activeTabId. Akce: openTab(type, config) — otevře nový tab (typ: data-grid, sql-console, schema-viewer) s unikátním ID (nanoid), setActiveTab(id), closeTab(id) s handlerem pro varování pokud má tab neuložené změny, closeOtherTabs(id), reorderTabs(fromIndex, toIndex). Integrace TabBar.tsx se store — TabBar čte z tabs store a volá akce. Double-click na tab pro přejmenování SQL konzole tabů. Kontextové menu na tab: Close, Close Others, Close All. Prázdný stav: zobrazení welcome screen pokud žádné taby.

## Soubory

- `src/mainview/stores/tabs.ts` — Solid.js store pro správu tabů (openTabs, activeTabId, akce)
- `src/mainview/components/layout/TabBar.tsx` — úprava pro integraci s tabs store, kontextové menu, přejmenování

## Akceptační kritéria

- [ ] Lze otevřít, zavřít a přepínat taby
- [ ] Aktivní tab je vizuálně zvýrazněn
- [ ] Taby se nemixují (každý má unikátní ID)
- [ ] Close tab funguje správně
- [ ] Prázdný stav zobrazí welcome screen
- [ ] Store je reaktivní (UI se aktualizuje automaticky)

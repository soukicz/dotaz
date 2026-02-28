# DOTAZ-011: Tab management store + TabBar

**Phase**: 1 — Foundation
**Type**: frontend
**Dependencies**: [DOTAZ-010]

## Description

Implementation of tab management store in src/mainview/stores/tabs.ts. Solid.js createStore for tab state: openTabs (array of TabInfo), activeTabId. Actions: openTab(type, config) — opens a new tab (type: data-grid, sql-console, schema-viewer) with unique ID (nanoid), setActiveTab(id), closeTab(id) with handler for warning if tab has unsaved changes, closeOtherTabs(id), reorderTabs(fromIndex, toIndex). TabBar.tsx integration with store — TabBar reads from tabs store and calls actions. Double-click on tab to rename SQL console tabs. Context menu on tab: Close, Close Others, Close All. Empty state: display welcome screen if no tabs.

## Files

- `src/mainview/stores/tabs.ts` — Solid.js store for tab management (openTabs, activeTabId, actions)
- `src/mainview/components/layout/TabBar.tsx` — modification for integration with tabs store, context menu, renaming

## Acceptance Criteria

- [ ] Can open, close and switch tabs
- [ ] Active tab is visually highlighted
- [ ] Tabs don't mix (each has unique ID)
- [ ] Close tab works correctly
- [ ] Empty state displays welcome screen
- [ ] Store is reactive (UI updates automatically)

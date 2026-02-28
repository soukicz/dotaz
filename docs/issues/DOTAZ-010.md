# DOTAZ-010: AppShell layout components (sidebar, tabs, status bar)

**Phase**: 1 — Foundation
**Type**: frontend
**Dependencies**: [DOTAZ-003, DOTAZ-009]

## Description

Extension of AppShell with functional layout components. Sidebar.tsx — left panel with fixed width (250px default), resize handle on right edge (Resizer.tsx). Sidebar contains header ("Connections"), scrollable content area for connection tree (placeholder for now), and collapse/expand toggle. TabBar.tsx — horizontal tab bar above main content area. Displays open tabs with icon based on type (table/SQL/schema), name, close button (×). Active tab highlighted. Tab overflow scrolling. StatusBar.tsx — bottom bar with information: active connection name + status (colored dot), current schema, number of rows (if grid tab), tx state (if in transaction). Resizer.tsx — vertical resize handle between sidebar and content, drag to change width, min 150px max 500px.

## Files

- `src/mainview/components/layout/AppShell.tsx` — update existing layout to integrate new components
- `src/mainview/components/layout/Sidebar.tsx` — left panel with connection tree placeholder, collapse/expand toggle
- `src/mainview/components/layout/TabBar.tsx` — horizontal tab bar with icons, names and close buttons
- `src/mainview/components/layout/StatusBar.tsx` — bottom information bar (connection, schema, rows, tx state)
- `src/mainview/components/layout/Resizer.tsx` — vertical resize handle between sidebar and content area

## Acceptance Criteria

- [ ] Layout consists of functional components
- [ ] Sidebar is resizable with min/max constraints (150px–500px)
- [ ] Tab bar displays tabs with close buttons
- [ ] Status bar shows placeholder information
- [ ] Resize handle works smoothly (without performance issues)

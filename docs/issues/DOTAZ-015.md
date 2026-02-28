# DOTAZ-015: ConnectionTree (sidebar tree)

**Phase**: 2 — Connection Management
**Type**: frontend
**Dependencies**: [DOTAZ-012, DOTAZ-013]

## Description

Implementation of ConnectionTree in `src/mainview/components/connection/ConnectionTree.tsx`. Tree structure in sidebar:

- Level 1 — connections (icon based on DB type, name, status indicator with color dot)
- Level 2 — schemas (for PG, SQLite has only "main")
- Level 3 — tables (with table icon)

Click on connection: toggle expand/collapse, if not connected → offer to connect. Click on table: opens DataGrid tab (calls `tabs.openTab("data-grid", {connectionId, schema, table})`).

`ConnectionTreeItem.tsx` — individual tree item with indentation based on level, expand/collapse arrow, icon and label.

"+" button in sidebar header to add new connection (opens ConnectionDialog). Loading state: spinner when loading schemas/tables after connect. Empty state: "No connections" with CTA to add.

## Files

- `src/mainview/components/connection/ConnectionTree.tsx` — tree component for displaying connections, schemas and tables
- `src/mainview/components/connection/ConnectionTreeItem.tsx` — individual tree item with indentation, icon and expand/collapse
- `src/mainview/components/layout/Sidebar.tsx` — integration of ConnectionTree into sidebar

## Acceptance Criteria

- [ ] Tree displays connections → schemas → tables
- [ ] Click on table opens data grid tab
- [ ] Connection state is visually indicated (color dot)
- [ ] Expand/collapse works on connections and schemas
- [ ] "+" button adds new connection (opens ConnectionDialog)
- [ ] Loading spinner when loading schemas/tables
- [ ] Empty state "No connections" with CTA to add

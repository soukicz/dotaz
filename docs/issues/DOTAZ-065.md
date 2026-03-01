# DOTAZ-065: Read-only mode per connection

**Phase**: 9 — Backlog Tier 1
**Type**: fullstack
**Dependencies**: [DOTAZ-013, DOTAZ-033, DOTAZ-029]

## Description

Add the ability to mark a connection as read-only. In read-only mode:

- Inline cell editing is disabled (grid is read-only)
- Add Row, Delete Row, Duplicate Row buttons are hidden/disabled
- SQL editor shows a warning when attempting to execute DML statements (INSERT, UPDATE, DELETE, TRUNCATE)
- Visual indication in UI (lock icon next to connection name, colored bar in status bar)

Setting is saved per connection in app database. Can be toggled at runtime without reconnecting.

## Files

- `src/shared/types/connection.ts` — add `readOnly?: boolean` to connection config
- `src/mainview/components/connection/ConnectionDialog.tsx` — add Read-only checkbox/toggle
- `src/bun/storage/app-db.ts` — persist readOnly setting
- `src/mainview/stores/connections.ts` — expose readOnly state per connection
- `src/mainview/components/grid/DataGrid.tsx` — disable editing controls when readOnly
- `src/mainview/stores/editor.ts` — warn/block DML in readOnly mode
- `src/mainview/components/layout/StatusBar.tsx` — show read-only indicator

## Acceptance Criteria

- [ ] Checkbox/toggle "Read-only" in Connection dialog
- [ ] In read-only mode, grid cell editing is disabled
- [ ] In read-only mode, SQL editor warns before executing DML statements
- [ ] Visual indication (lock icon, status bar)
- [ ] Setting persists across sessions
- [ ] Can be toggled at runtime without reconnecting
- [ ] Connection tree shows read-only state

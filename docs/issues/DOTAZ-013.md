# DOTAZ-013: ConnectionDialog (add/edit form)

**Phase**: 2 — Connection Management
**Type**: frontend
**Dependencies**: [DOTAZ-012]

## Description

Implementation of ConnectionDialog in `src/mainview/components/connection/ConnectionDialog.tsx`. Modal dialog (uses `common/Dialog.tsx` — simple modal wrapper) for creating or editing a connection.

DB type switcher: PostgreSQL / SQLite.

PostgreSQL form:

- `name`
- `host` (default `localhost`)
- `port` (default `5432`)
- `database`
- `username`
- `password` (masked)
- SSL mode (dropdown: `disable`, `require`, `prefer`)

SQLite form:

- `name`
- file path (with Browse button for native file picker via RPC `system.showOpenDialog`)

Test Connection button — calls `rpc.connections.test()`, displays result (success/error with message). Save button — validates required fields, calls `rpc.connections.create()` or `update()`. Form opens empty for new connection, or pre-filled for editing.

## Files

- `src/mainview/components/connection/ConnectionDialog.tsx` — modal form for creating/editing connection
- `src/mainview/components/common/Dialog.tsx` — generic modal wrapper

## Acceptance Criteria

- [ ] Dialog opens for new connection and editing (pre-filled form)
- [ ] Form changes based on DB type (PostgreSQL vs SQLite)
- [ ] Test Connection works and displays result (success/error with message)
- [ ] Validation of required fields before saving
- [ ] Save saves connection and closes dialog
- [ ] Browse for SQLite opens native file picker via RPC

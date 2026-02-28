# DOTAZ-008: Complete RPC schema + wiring

**Phase**: 1 — Foundation
**Type**: backend
**Dependencies**: [DOTAZ-002, DOTAZ-007]

## Description

Implementation of complete RPC wiring between backend and frontend. File `src/bun/rpc-handlers.ts` — registration of all RPC handlers according to schema defined in `src/shared/types/rpc.ts`. Integration with Electrobun RPC system via `BrowserWindow.rpc`.

In this phase implement handlers for:
- **connections.\***: `list`, `create`, `update`, `delete`, `test`, `connect`, `disconnect`
- **schema.\***: `getSchemas`, `getTables`, `getColumns`, `getIndexes`, `getForeignKeys`

Register remaining handlers as stubs with TODO:
- **data.\*** — stub
- **query.\*** — stub
- **tx.\*** — stub
- **export.\*** — stub
- **history.\*** — stub
- **views.\*** — stub
- **settings.\*** — stub

Update `src/bun/index.ts` — import and initialize RPC handlers after BrowserWindow creation.

## Files

- `src/bun/rpc-handlers.ts` — registration of all RPC handlers, implementation of connections.* and schema.*, stub handlers for others
- `src/bun/index.ts` — update: import and initialize RPC handlers after BrowserWindow creation

## Acceptance Criteria

- [ ] RPC handlers are registered and callable from frontend
- [ ] `connections.*` handlers work end-to-end (list, create, update, delete, test, connect, disconnect)
- [ ] `schema.*` handlers work for connected connections (getSchemas, getTables, getColumns, getIndexes, getForeignKeys)
- [ ] Stub handlers return understandable error (e.g. "Not implemented yet")
- [ ] TypeScript types are consistent between FE and BE (shared via src/shared/types/rpc.ts)
- [ ] RPC handlers are initialized after BrowserWindow creation in index.ts

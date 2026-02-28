# DOTAZ-009: Frontend RPC client (Electroview)

**Phase**: 1 — Foundation
**Type**: frontend
**Dependencies**: [DOTAZ-008, DOTAZ-003]

## Description

Creation of frontend RPC wrapper in src/mainview/lib/rpc.ts. Wrapper around Electrobun Electroview RPC API, which provides typed backend calls. Import from "electrobun/webview" (Electroview API). Creation of functions for each group of RPC methods (connections, schema, data, query, tx, export, history, views, settings, system). Each function wraps RPC call with error handling — errors are transformed into user-friendly messages. Export as singleton object `rpc` with namespace access: rpc.connections.list(), rpc.schema.getTables(), etc. Types imported from src/shared/types/.

## Files

- `src/mainview/lib/rpc.ts` — RPC client with typed methods for all groups (connections, schema, data, query, tx, export, history, views, settings, system)

## Acceptance Criteria

- [ ] RPC client is type-safe
- [ ] Corresponds to RPC schema from shared types
- [ ] Errors are caught and transformed into user-friendly messages
- [ ] Backend calls work end-to-end
- [ ] Export as simple import for components and stores

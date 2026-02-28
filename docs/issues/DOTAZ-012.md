# DOTAZ-012: Connection store (frontend state)

**Phase**: 2 — Connection Management
**Type**: frontend
**Dependencies**: [DOTAZ-009, DOTAZ-011]

## Description

Implementation of connection store in `src/mainview/stores/connections.ts`. Solid.js `createStore` for connections state:

- `connections` — array of `ConnectionInfo` with `name`, `type`, `config`, `status`
- `activeConnectionId`

Actions:

- `loadConnections()` — calls `rpc.connections.list()` on startup
- `createConnection(config)` — calls `rpc.connections.create()`
- `updateConnection(id, config)` — calls `rpc.connections.update()`
- `deleteConnection(id)` — calls `rpc.connections.delete()`
- `connectTo(id)` — calls `rpc.connections.connect()` and updates status
- `disconnectFrom(id)` — calls `rpc.connections.disconnect()`

Connection status tracking: `connected`, `connecting`, `disconnected`, `error`. Listener on backend `statusChanged` events via RPC (bidirectional). On successful connection, automatically loads schema tree (schemas → tables).

## Files

- `src/mainview/stores/connections.ts` — connection store with CRUD operations and status management

## Acceptance Criteria

- [ ] Store loads connections on startup using `loadConnections()`
- [ ] CRUD operations work via RPC (create, update, delete)
- [ ] Connection status updates in real-time via backend events
- [ ] `connectTo()` and `disconnectFrom()` work and change status
- [ ] Schema tree (schemas → tables) loads on successful connection

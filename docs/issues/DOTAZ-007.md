# DOTAZ-007: ConnectionManager service

**Phase**: 1 — Foundation
**Type**: backend
**Dependencies**: [DOTAZ-004, DOTAZ-005, DOTAZ-006]

## Description

Implementation of `ConnectionManager` in `src/bun/services/connection-manager.ts`. Manages connection lifecycle:
- **connect** — creates driver instance based on type (PostgresDriver or SqliteDriver), validates configuration, calls `driver.connect()`
- **disconnect** — calls `driver.disconnect()` and removes from map of active connections
- **reconnect** — disconnect + connect

Maintains map of active connections (`connectionId` -> driver instance). Provides `getDriver(connectionId)` for other services — returns active driver or throws error if connection is not active.

Integrates with `AppDatabase` for persistence of connection configuration (loading saved connections, saving new ones).

Emits status changed events (for frontend notification via RPC) — e.g. `connected`, `disconnected`, `error`.

## Files

- `src/bun/services/connection-manager.ts` — ConnectionManager class, connection lifecycle management, map of active connections, integration with AppDatabase and drivers

## Acceptance Criteria

- [ ] Can manage multiple simultaneous connections
- [ ] Correctly creates PostgresDriver or SqliteDriver based on connection type
- [ ] `connect` validates configuration before creating driver
- [ ] `disconnect` performs cleanup (calls driver.disconnect(), removes from map)
- [ ] `reconnect` correctly performs disconnect + connect
- [ ] `getDriver(connectionId)` returns active driver or throws error
- [ ] Connection configuration is persisted via AppDatabase
- [ ] Emits status changed events when connection state changes

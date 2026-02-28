# DOTAZ-012: Connection store (frontend stav)

**Phase**: 2 — Connection Management
**Type**: frontend
**Dependencies**: [DOTAZ-009, DOTAZ-011]

## Popis

Implementace connection store v `src/mainview/stores/connections.ts`. Solid.js `createStore` pro stav connections:

- `connections` — pole `ConnectionInfo` s `name`, `type`, `config`, `status`
- `activeConnectionId`

Akce:

- `loadConnections()` — volá `rpc.connections.list()` při startu
- `createConnection(config)` — volá `rpc.connections.create()`
- `updateConnection(id, config)` — volá `rpc.connections.update()`
- `deleteConnection(id)` — volá `rpc.connections.delete()`
- `connectTo(id)` — volá `rpc.connections.connect()` a aktualizuje status
- `disconnectFrom(id)` — volá `rpc.connections.disconnect()`

Sledování connection status: `connected`, `connecting`, `disconnected`, `error`. Listener na backend `statusChanged` události přes RPC (bidirectional). Při úspěšném connect automaticky načte schema tree (schemas → tables).

## Soubory

- `src/mainview/stores/connections.ts` — connection store s CRUD operacemi a status managementem

## Akceptační kritéria

- [ ] Store načte connections při startu pomocí `loadConnections()`
- [ ] CRUD operace fungují přes RPC (create, update, delete)
- [ ] Connection status se aktualizuje v reálném čase přes backend události
- [ ] `connectTo()` a `disconnectFrom()` fungují a mění status
- [ ] Schema tree (schemas → tables) se načte po úspěšném připojení

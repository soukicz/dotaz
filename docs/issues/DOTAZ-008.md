# DOTAZ-008: Kompletni RPC schema + wiring

**Phase**: 1 — Foundation
**Type**: backend
**Dependencies**: [DOTAZ-002, DOTAZ-007]

## Popis

Implementace kompletniho RPC wiring mezi backendem a frontendem. Soubor `src/bun/rpc-handlers.ts` — registrace vsech RPC handleru dle schema definovane v `src/shared/types/rpc.ts`. Integrace s Electrobun RPC systemem pres `BrowserWindow.rpc`.

V teto fazi implementovat handlery pro:
- **connections.\***: `list`, `create`, `update`, `delete`, `test`, `connect`, `disconnect`
- **schema.\***: `getSchemas`, `getTables`, `getColumns`, `getIndexes`, `getForeignKeys`

Ostatni handlery registrovat jako stubs s TODO:
- **data.\*** — stub
- **query.\*** — stub
- **tx.\*** — stub
- **export.\*** — stub
- **history.\*** — stub
- **views.\*** — stub
- **settings.\*** — stub

Uprava `src/bun/index.ts` — import a inicializace RPC handleru po vytvoreni BrowserWindow.

## Soubory

- `src/bun/rpc-handlers.ts` — registrace vsech RPC handleru, implementace connections.* a schema.*, stub handlery pro ostatni
- `src/bun/index.ts` — uprava: import a inicializace RPC handleru po vytvoreni BrowserWindow

## Akceptační kritéria

- [ ] RPC handlery jsou registrovany a volatelne z frontendu
- [ ] `connections.*` handlery fungujou end-to-end (list, create, update, delete, test, connect, disconnect)
- [ ] `schema.*` handlery fungujou pro pripojene connections (getSchemas, getTables, getColumns, getIndexes, getForeignKeys)
- [ ] Stub handlery vraceji srozumitelnou chybu (napr. "Not implemented yet")
- [ ] TypeScript typy jsou konzistentni mezi FE a BE (sdilene pres src/shared/types/rpc.ts)
- [ ] RPC handlery se inicializuji po vytvoreni BrowserWindow v index.ts

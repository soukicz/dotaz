# DOTAZ-013: ConnectionDialog (add/edit formulář)

**Phase**: 2 — Connection Management
**Type**: frontend
**Dependencies**: [DOTAZ-012]

## Popis

Implementace ConnectionDialog v `src/mainview/components/connection/ConnectionDialog.tsx`. Modální dialog (používá `common/Dialog.tsx` — jednoduchý modal wrapper) pro vytvoření nebo editaci connection.

Přepínač typu DB: PostgreSQL / SQLite.

PostgreSQL formulář:

- `name`
- `host` (default `localhost`)
- `port` (default `5432`)
- `database`
- `username`
- `password` (masked)
- SSL mode (dropdown: `disable`, `require`, `prefer`)

SQLite formulář:

- `name`
- file path (s tlačítkem Browse pro native file picker přes RPC `system.showOpenDialog`)

Test Connection tlačítko — volá `rpc.connections.test()`, zobrazí výsledek (success/error s message). Save tlačítko — validace povinných polí, volání `rpc.connections.create()` nebo `update()`. Formulář se otevře prázdný pro novou connection, nebo předvyplněný pro editaci.

## Soubory

- `src/mainview/components/connection/ConnectionDialog.tsx` — modální formulář pro vytvoření/editaci connection
- `src/mainview/components/common/Dialog.tsx` — generický modal wrapper

## Akceptační kritéria

- [ ] Dialog se otevře pro novou connection i editaci (předvyplněný formulář)
- [ ] Formulář se mění dle typu DB (PostgreSQL vs SQLite)
- [ ] Test Connection funguje a zobrazí výsledek (success/error s message)
- [ ] Validace povinných polí před uložením
- [ ] Save uloží connection a zavře dialog
- [ ] Browse pro SQLite otevře native file picker přes RPC

# DOTAZ-007: ConnectionManager service

**Phase**: 1 — Foundation
**Type**: backend
**Dependencies**: [DOTAZ-004, DOTAZ-005, DOTAZ-006]

## Popis

Implementace `ConnectionManager` v `src/bun/services/connection-manager.ts`. Sprava zivotniho cyklu connections:
- **connect** — vytvori driver instanci dle typu (PostgresDriver nebo SqliteDriver), validuje konfiguraci, vola `driver.connect()`
- **disconnect** — vola `driver.disconnect()` a odstrani z mapy aktivnich connections
- **reconnect** — disconnect + connect

Udrzuje mapu aktivnich connections (`connectionId` -> driver instance). Poskytuje `getDriver(connectionId)` pro ostatni services — vraci aktivni driver nebo hazi chybu pokud connection neni aktivni.

Integruje se s `AppDatabase` pro persistenci connection konfigurace (nacitani ulozenych connections, ukladani novych).

Emituje status changed udalosti (pro notifikaci frontendu pres RPC) — napr. `connected`, `disconnected`, `error`.

## Soubory

- `src/bun/services/connection-manager.ts` — ConnectionManager trida, sprava zivotniho cyklu connections, mapa aktivnich connections, integrace s AppDatabase a drivery

## Akceptační kritéria

- [ ] Dokaze spravovat vice soucasnych connections
- [ ] Spravne vytvari PostgresDriver nebo SqliteDriver dle typu connection
- [ ] `connect` validuje konfiguraci pred vytvorenim driveru
- [ ] `disconnect` provede cleanup (vola driver.disconnect(), odstrani z mapy)
- [ ] `reconnect` spravne provede disconnect + connect
- [ ] `getDriver(connectionId)` vraci aktivni driver nebo hazi chybu
- [ ] Connection konfigurace se persistuje pres AppDatabase
- [ ] Emituje status changed udalosti pri zmene stavu connection

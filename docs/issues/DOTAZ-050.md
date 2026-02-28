# DOTAZ-050: Reconnect logika + connection resilience

**Phase**: 7 — Polish
**Type**: backend
**Dependencies**: [DOTAZ-007]

## Popis

Implementace reconnect logiky v ConnectionManager. Detekce ztráty spojení: periodický health check (SELECT 1 každých 30s pro aktivní connections). Při detekci výpadku: status → "disconnected", notifikace frontendu (connections.statusChanged RPC). Automatický reconnect: exponential backoff (1s, 2s, 4s, 8s, max 30s), max 5 pokusů. Status "reconnecting" během pokusů. Po úspěšném reconnect: status → "connected", notifikace frontendu. Manuální reconnect: RPC handler connections.reconnect(connectionId) — okamžitý pokus o připojení. Graceful disconnect: při odpojení vyčistit running queries, rollback otevřené transakce (s varováním). Connection pool recovery pro PostgreSQL.

## Soubory

- `src/bun/services/connection-manager.ts` — rozšíření o health check, automatický reconnect s exponential backoff, graceful disconnect, connection pool recovery

## Akceptační kritéria

- [ ] Health check detekuje výpadek spojení
- [ ] Automatický reconnect s exponential backoff funguje
- [ ] Status se aktualizuje v reálném čase (disconnected, reconnecting, connected)
- [ ] Manuální reconnect funguje
- [ ] Graceful disconnect vyčistí stav (running queries, otevřené transakce)
- [ ] Max retry limit (5 pokusů) zastaví další pokusy

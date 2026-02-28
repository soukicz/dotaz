# DOTAZ-050: Reconnect logic + connection resilience

**Phase**: 7 — Polish
**Type**: backend
**Dependencies**: [DOTAZ-007]

## Description

Implementation of reconnect logic in ConnectionManager. Detection of connection loss: periodic health check (SELECT 1 every 30s for active connections). Upon outage detection: status → "disconnected", notification to frontend (connections.statusChanged RPC). Automatic reconnect: exponential backoff (1s, 2s, 4s, 8s, max 30s), max 5 attempts. Status "reconnecting" during attempts. After successful reconnect: status → "connected", notification to frontend. Manual reconnect: RPC handler connections.reconnect(connectionId) — immediate connection attempt. Graceful disconnect: on disconnect clean running queries, rollback open transactions (with warning). Connection pool recovery for PostgreSQL.

## Files

- `src/bun/services/connection-manager.ts` — extension with health check, automatic reconnect with exponential backoff, graceful disconnect, connection pool recovery

## Acceptance Criteria

- [ ] Health check detects connection loss
- [ ] Automatic reconnect with exponential backoff works
- [ ] Status updates in real-time (disconnected, reconnecting, connected)
- [ ] Manual reconnect works
- [ ] Graceful disconnect cleans state (running queries, open transactions)
- [ ] Max retry limit (5 attempts) stops further attempts

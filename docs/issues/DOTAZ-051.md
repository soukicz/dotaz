# DOTAZ-051: Settings storage + preferences

**Phase**: 7 — Polish
**Type**: backend
**Dependencies**: [DOTAZ-004]

## Description

Implementation of settings.* RPC handlers in src/bun/rpc-handlers.ts. Handler settings.get(key) — loads value from app DB settings table. Handler settings.set(key, value) — saves/updates value. Handler settings.getAll() — returns all settings. Default settings: defaultPageSize (100), defaultTxMode ("auto-commit"), theme ("dark"), queryTimeout (30000), maxHistoryEntries (1000), clipboardIncludeHeaders (true), exportDefaultFormat ("csv"). Settings are stored as key-value in app DB. Frontend: simple settings panel (access via menu or command palette) — backend ready for now, no UI yet.

## Files

- `src/bun/rpc-handlers.ts` — settings.get, settings.set, settings.getAll handlers
- `src/bun/storage/app-db.ts` — settings CRUD operations, default values

## Acceptance Criteria

- [ ] settings.get(key) returns value for existing key
- [ ] settings.get(key) returns default value if key does not exist
- [ ] settings.set(key, value) saves new value
- [ ] settings.set(key, value) updates existing key
- [ ] settings.getAll() returns all settings
- [ ] Values are persisted in app DB

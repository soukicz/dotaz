# DOTAZ-004: Local app SQLite database with migrations

**Phase**: 1 — Foundation
**Type**: backend
**Dependencies**: [DOTAZ-002]

## Description

Implementation of local SQLite database for storing app data (connections, history, settings, saved views).

File `src/bun/storage/app-db.ts` — singleton class `AppDatabase`. Initialize SQLite via `bun:sqlite` in `Utils.paths.userData/dotaz.db`. Automatically create DB file if it does not exist.

Migrations in `src/bun/storage/migrations.ts` — versioned migrations system. `schema_version` table for tracking current schema version. Migration 001: create tables `connections`, `query_history`, `saved_views`, `settings` (schema per ARCHITECTURE.md).

CRUD operations:
- **connections**: `list`, `getById`, `create`, `update`, `delete`
- **settings**: `get`, `set`
- **saved_views**: `list`, `create`, `update`, `delete`
- **history**: `add`, `list` (with filtering), `clear`

## Files

- `src/bun/storage/app-db.ts` — singleton class AppDatabase, DB initialization, CRUD operations for connections, settings, saved views, history
- `src/bun/storage/migrations.ts` — versioned migrations system, schema_version table, migration 001 with creation of all tables

## Acceptance criteria

- [ ] DB file is created on first run in `Utils.paths.userData/dotaz.db`
- [ ] Migrations run automatically on AppDatabase initialization
- [ ] `schema_version` table correctly tracks current schema version
- [ ] CRUD operations for connections work correctly (list, getById, create, update, delete)
- [ ] CRUD operations for settings work correctly (get, set)
- [ ] CRUD operations for saved_views work correctly (list, create, update, delete)
- [ ] History operations work correctly (add, list with filtering, clear)
- [ ] AppDatabase is singleton — multiple calls return same instance

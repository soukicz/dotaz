# DOTAZ-036: Saved views backend (CRUD)

**Phase**: 6 — Advanced Features
**Type**: backend
**Dependencies**: [DOTAZ-004]

## Description

Implementation of views.* RPC handlers in src/bun/rpc-handlers.ts. Handler views.list(connectionId, schema, table) — returns saved views for a given table from the app DB. Handler views.save(view) — saves a new view (name, connectionId, schema, table, config JSON: visible columns, order, widths, sort, filters). Handler views.update(viewId, changes) — updates an existing view. Handler views.delete(viewId) — deletes a view. Config JSON contains: columns (array {name, visible, width, pinned}), sort (array {column, direction}), filters (array ColumnFilter). Validation: unique view name within the table, required fields.

## Files

- `src/bun/rpc-handlers.ts` — views.list, views.save, views.update, views.delete handlers

## Acceptance Criteria

- [ ] CRUD operations for views work (create, read, update, delete)
- [ ] Views are bound to connection+schema+table
- [ ] Config JSON is properly serialized and deserialized
- [ ] Validation of view name uniqueness within the table
- [ ] views.list returns views for a specific table
- [ ] Required fields are validated

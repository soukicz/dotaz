# DOTAZ-067: EXPLAIN plan visualization

**Phase**: 10 — Backlog Tier 2
**Type**: fullstack
**Dependencies**: [DOTAZ-025, DOTAZ-030]

## Description

Add the ability to view execution plan of a SQL query. User clicks "Explain" (or Ctrl+E) instead of "Run" and the result displays as a structured plan instead of a data grid.

### PostgreSQL
- `EXPLAIN` — estimated plan
- `EXPLAIN ANALYZE` — actual plan with measured timings
- Output in JSON format (easier to parse) or TEXT

### SQLite
- `EXPLAIN QUERY PLAN` — simplified plan
- Output as table with nested structure

### Display
- Tree/table visualization of operations (Seq Scan, Index Scan, Hash Join, Sort, etc.)
- Highlight expensive operations (highest cost / actual time)
- Show estimated vs. actual rows (ANALYZE mode)

## Files

- `src/bun/services/query-executor.ts` — add `explainQuery(connectionId, sql, analyze?)` method
- `src/shared/types/query.ts` — add `ExplainNode` type for plan tree
- `src/shared/types/rpc.ts` — add `query.explain` RPC endpoint
- `src/bun/rpc-handlers.ts` — add explain handler
- `src/mainview/components/editor/QueryToolbar.tsx` — add "Explain" button
- `src/mainview/components/editor/ExplainPanel.tsx` — tree visualization of execution plan
- `src/mainview/stores/editor.ts` — add explain action and state

## Acceptance Criteria

- [ ] "Explain" button in SQL editor toolbar next to "Run"
- [ ] Keyboard shortcut (Ctrl+E or similar)
- [ ] PostgreSQL: support for EXPLAIN and EXPLAIN ANALYZE
- [ ] SQLite: support for EXPLAIN QUERY PLAN
- [ ] Tree display of plan with indented operations
- [ ] Highlight most expensive operations (color-coded)
- [ ] Display key metrics: cost, rows, actual time (where available)
- [ ] Result shown in a special tab/panel (not as data grid)

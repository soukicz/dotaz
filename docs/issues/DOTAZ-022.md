# DOTAZ-022: FilterBar (column filtering)

**Phase**: 3 — Data Grid
**Type**: frontend
**Dependencies**: [DOTAZ-019, DOTAZ-018]

## Description

Implementation of FilterBar in `src/mainview/components/grid/FilterBar.tsx`. Panel below header row for adding filters.

"Add Filter" button → dropdown with column selection → operator selection (`=`, `!=`, `>`, `<`, `>=`, `<=`, `LIKE`, `IS NULL`, `IS NOT NULL`, `IN`) → input for value.

Active filters displayed as "chips" (column operator value) with x button to remove. "Clear All" button to reset all filters.

Special operator behavior:

- `IS NULL` and `IS NOT NULL` do not require a value
- `IN` displays input for comma-separated values

After adding/removing filter: automatic data reload via grid store.

Intelligent operator selection based on column type:

- Text → `LIKE` available
- Numbers → comparison operators
- Boolean → only `=` / `!=`

## Files

- `src/mainview/components/grid/FilterBar.tsx` — filter bar with filter adding, active filter chip display, type-aware operator selection and automatic data reload

## Acceptance Criteria

- [ ] Can add filter with column, operator and value selection
- [ ] Active filters are displayed as chips
- [ ] Filter removal by clicking x works
- [ ] Clear All works (reset all filters)
- [ ] Data automatically reloads after adding/removing filter
- [ ] Operators correspond to column type (text, numbers, boolean)

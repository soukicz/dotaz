# DOTAZ-030: SqlResultPanel (query results)

**Phase**: 4 — SQL Editor
**Type**: frontend
**Dependencies**: [DOTAZ-020, DOTAZ-027]

## Description

Implementation of `SqlResultPanel` in `src/mainview/components/editor/SqlResultPanel.tsx`. Panel below SQL editor displaying query results.

Uses existing grid components (`GridHeader`, `VirtualScroller`, `GridRow`, `GridCell`) to display SELECT results.

Tab bar for multiple result sets (if multi-statement SELECT). For DML: display `"X rows affected"` message. For errors: display error message with red background, error position if available.

Metadata row: number of rows, number of columns, duration. Empty state: `"Run a query to see results"` placeholder.

Resize handle at top for changing panel height (shares space with editor). Panel can be minimized/maximized.

## Files

- `src/mainview/components/editor/SqlResultPanel.tsx` — result panel with grid display, multi-result tabs, DML/error display, metadata, resize

## Acceptance Criteria

- [ ] SELECT results display in grid
- [ ] Multiple result sets have tab bar
- [ ] DML displays affected rows
- [ ] Errors display clearly (red background, position if available)
- [ ] Metadata (rows, columns, duration) are visible
- [ ] Resize works (drag handle)
- [ ] Empty state displays placeholder

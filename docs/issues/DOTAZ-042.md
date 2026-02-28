# DOTAZ-042: QueryHistory component

**Phase**: 6 — Advanced Features
**Type**: frontend
**Dependencies**: [DOTAZ-041]

## Description

Implementation of QueryHistory in src/mainview/components/history/QueryHistory.tsx. Panel or tab displaying history of executed queries. List with: SQL text (truncated), connection name, timestamp, duration, status (success/error icon), row count. Search input for filtering history. Dropdown to filter by connection. Clicking on an item: expands full SQL text. Actions: "Run Again" (opens SQL console with this query), "Copy to Clipboard", "Copy to Console" (inserts into active console). Infinite scroll or pagination for long history. Clear History button with confirmation.

## Files

- `src/mainview/components/history/QueryHistory.tsx` — panel with query history

## Acceptance Criteria

- [ ] History displays executed queries with SQL text, timestamp, duration and status
- [ ] Search filters history by SQL text
- [ ] Filter by connection works
- [ ] Run Again opens new SQL console with selected query
- [ ] Copy to Clipboard and Copy to Console work
- [ ] Clear History deletes history with confirmation dialog
- [ ] Infinite scroll or pagination for large history

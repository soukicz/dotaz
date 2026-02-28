# DOTAZ-029: QueryToolbar (run/cancel/tx controls)

**Phase**: 4 — SQL Editor
**Type**: frontend
**Dependencies**: [DOTAZ-027, DOTAZ-028]

## Description

Implementation of `QueryToolbar` in `src/mainview/components/editor/QueryToolbar.tsx`. Toolbar above SQL editor with actions:

- **Run / Cancel** button — toggles based on `isRunning` state. RunAll — runs entire content. Run Selected — active only if text is selected.
- **Format SQL** button.
- Separator.
- **Transaction mode** toggle: Auto-commit / Manual (toggle or dropdown). If Manual mode: Begin Transaction, Commit, Rollback buttons. Visual indication of open transaction (yellow/orange highlight).
- Separator.
- **Connection info**: active connection name + schema dropdown.
- Display of duration of last query (`"123 ms"`).

Buttons have tooltips with keyboard shortcuts.

## Files

- `src/mainview/components/editor/QueryToolbar.tsx` — toolbar with run/cancel, format, transaction controls, connection info, duration display

## Acceptance Criteria

- [ ] Run/Cancel toggles based on state (`isRunning`)
- [ ] Run executes query
- [ ] Cancel interrupts running query
- [ ] Format formats SQL
- [ ] Transaction mode toggle works (auto-commit / manual)
- [ ] Commit/Rollback visible only in manual mode
- [ ] Duration is displayed after query completion
- [ ] Tooltips contain keyboard shortcuts

# DOTAZ-045: Keyboard shortcut system

**Phase**: 7 — Polish
**Type**: frontend
**Dependencies**: [DOTAZ-044]

## Description

Implementation of central keyboard shortcut system in src/mainview/lib/keyboard.ts. Singleton KeyboardManager — listens for global keydown events. Shortcut registration: mapping (key combo → command ID). Default shortcuts per PRD: Ctrl+Shift+P (command palette), Ctrl+N (new SQL console), Ctrl+Enter (run query), Ctrl+Shift+Enter (commit tx), Ctrl+Shift+R (rollback), Ctrl+S (save view), Ctrl+W (close tab), Ctrl+Tab (switch tab), F2 (inline edit), Delete (delete row), F5 (refresh data). Context-dependent shortcuts — some work only in specific context (Ctrl+Enter only in SQL editor, F2 only in grid). Prevention of defaults (Ctrl+S must not save page). Integration with command registry — shortcut calls command handler.

## Files

- `src/mainview/lib/keyboard.ts` — singleton KeyboardManager, global keydown listener, key combo → command ID mapping, context dispatch

## Acceptance Criteria

- [ ] All shortcuts from PRD work
- [ ] Context-dependent shortcuts respect active context
- [ ] Prevention of browser defaults (Ctrl+S, Ctrl+W etc.)
- [ ] Shortcuts call correct command handlers
- [ ] No conflicts between shortcuts

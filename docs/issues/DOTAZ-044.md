# DOTAZ-044: CommandPalette

**Phase**: 7 — Polish
**Type**: frontend
**Dependencies**: [DOTAZ-011, DOTAZ-012]

## Description

Implementation of CommandPalette in src/mainview/components/common/CommandPalette.tsx. Ctrl+Shift+P opens command palette — overlay dialog with search input. Command registry in src/mainview/lib/commands.ts — singleton registry of commands. Each command has: id, label (displayed text), shortcut (keyboard shortcut), category (Connection, Query, Grid, Navigation, View), handler (function). Registered commands: New SQL Console, Close Tab, Close All Tabs, Connect/Disconnect, Open Settings, Format SQL, Run Query, Cancel Query, Refresh Data, Save View, Export Data, Toggle Sidebar, Command Palette. Fuzzy search in label — typing text filters commands. Recently used commands at top. Enter executes selected command. Arrow keys for navigation in list. Escape closes palette. Display shortcut next to label.

## Files

- `src/mainview/components/common/CommandPalette.tsx` — overlay dialog with search input, command list, fuzzy search, arrow navigation
- `src/mainview/lib/commands.ts` — singleton command registry, registration of all commands, fuzzy search logic

## Acceptance Criteria

- [ ] Ctrl+Shift+P opens palette
- [ ] Fuzzy search filters commands
- [ ] Enter executes selected command
- [ ] Escape closes palette
- [ ] Shortcuts are displayed next to label
- [ ] Recently used commands are displayed at top
- [ ] All main commands are registered

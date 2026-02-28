# DOTAZ-049: Application menu with all actions

**Phase**: 7 — Polish
**Type**: backend
**Dependencies**: [DOTAZ-008, DOTAZ-045]

## Description

Implementation of application menu via Electrobun Menu API in src/bun/index.ts. Menu structure: File (New SQL Console, Close Tab, separator, Settings, separator, Quit), Edit (Undo, Redo, separator, Cut, Copy, Paste, Select All), View (Toggle Sidebar, Command Palette, separator, Refresh Data, separator, Zoom In/Out/Reset), Connection (New Connection, Disconnect, separator, Reconnect), Query (Run Query, Cancel Query, separator, Format SQL), Help (About Dotaz, Documentation). Keyboard shortcuts on menu items (match keyboard shortcuts). Menu actions communicate with frontend via RPC (BE→FE direction) — menu click → RPC notification → frontend command handler.

## Files

- `src/bun/index.ts` — complete menu setup via Electrobun Menu API, RPC notifications for frontend

## Acceptance Criteria

- [ ] Application menu displays with all items
- [ ] Keyboard shortcuts are displayed on menu items
- [ ] Menu actions communicate with frontend via RPC
- [ ] File > Quit closes application
- [ ] All menu actions work correctly

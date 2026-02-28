# DOTAZ-049: Application menu se všemi akcemi

**Phase**: 7 — Polish
**Type**: backend
**Dependencies**: [DOTAZ-008, DOTAZ-045]

## Popis

Implementace application menu přes Electrobun Menu API v src/bun/index.ts. Menu struktura: File (New SQL Console, Close Tab, separator, Settings, separator, Quit), Edit (Undo, Redo, separator, Cut, Copy, Paste, Select All), View (Toggle Sidebar, Command Palette, separator, Refresh Data, separator, Zoom In/Out/Reset), Connection (New Connection, Disconnect, separator, Reconnect), Query (Run Query, Cancel Query, separator, Format SQL), Help (About Dotaz, Documentation). Klávesové zkratky u menu položek (odpovídají keyboard shortcuts). Menu akcí komunikují s frontendem přes RPC (BE→FE direction) — menu klik → RPC notifikace → frontend command handler.

## Soubory

- `src/bun/index.ts` — kompletní menu setup přes Electrobun Menu API, RPC notifikace pro frontend

## Akceptační kritéria

- [ ] Application menu se zobrazí se všemi položkami
- [ ] Klávesové zkratky jsou zobrazeny u menu položek
- [ ] Menu akce komunikují s frontendem přes RPC
- [ ] File > Quit zavře aplikaci
- [ ] Všechny menu akce fungují správně

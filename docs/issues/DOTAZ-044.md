# DOTAZ-044: CommandPalette

**Phase**: 7 — Polish
**Type**: frontend
**Dependencies**: [DOTAZ-011, DOTAZ-012]

## Popis

Implementace CommandPalette v src/mainview/components/common/CommandPalette.tsx. Ctrl+Shift+P otevře command palette — overlay dialog s vyhledávacím inputem. Command registry v src/mainview/lib/commands.ts — singleton registr příkazů. Každý command má: id, label (zobrazený text), shortcut (klávesová zkratka), category (Connection, Query, Grid, Navigation, View), handler (funkce). Registrované příkazy: New SQL Console, Close Tab, Close All Tabs, Connect/Disconnect, Open Settings, Format SQL, Run Query, Cancel Query, Refresh Data, Save View, Export Data, Toggle Sidebar, Command Palette. Fuzzy search v labelu — zadání textu filtruje příkazy. Nedávno použité příkazy nahoře. Enter spustí vybraný příkaz. Šipky pro navigaci v seznamu. Escape zavře palette. Zobrazení shortcutu vedle labelu.

## Soubory

- `src/mainview/components/common/CommandPalette.tsx` — overlay dialog s vyhledávacím inputem, seznam příkazů, fuzzy search, navigace šipkami
- `src/mainview/lib/commands.ts` — singleton command registry, registrace všech příkazů, fuzzy search logika

## Akceptační kritéria

- [ ] Ctrl+Shift+P otevře palette
- [ ] Fuzzy search filtruje příkazy
- [ ] Enter spustí vybraný příkaz
- [ ] Escape zavře palette
- [ ] Shortcuts jsou zobrazeny vedle labelu
- [ ] Nedávné příkazy se zobrazují nahoře
- [ ] Všechny hlavní příkazy jsou registrovány

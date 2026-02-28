# DOTAZ-045: Keyboard shortcut system

**Phase**: 7 — Polish
**Type**: frontend
**Dependencies**: [DOTAZ-044]

## Popis

Implementace centrálního keyboard shortcut systému v src/mainview/lib/keyboard.ts. Singleton KeyboardManager — naslouchá na globální keydown události. Registrace shortcuts: mapování (key combo → command ID). Výchozí shortcuts dle PRD: Ctrl+Shift+P (command palette), Ctrl+N (nová SQL konzole), Ctrl+Enter (spustit dotaz), Ctrl+Shift+Enter (commit tx), Ctrl+Shift+R (rollback), Ctrl+S (uložit view), Ctrl+W (zavřít tab), Ctrl+Tab (přepnout tab), F2 (inline editace), Delete (smazat řádek), F5 (refresh data). Kontextové shortcuts — některé fungují jen v určitém kontextu (Ctrl+Enter jen v SQL editoru, F2 jen v gridu). Prevence defaultu (Ctrl+S nesmí uložit stránku). Integrace s command registry — shortcut volá command handler.

## Soubory

- `src/mainview/lib/keyboard.ts` — singleton KeyboardManager, globální keydown listener, mapování key combo → command ID, kontextový dispatch

## Akceptační kritéria

- [ ] Všechny shortcuts z PRD fungují
- [ ] Kontextové shortcuts respektují aktivní kontext
- [ ] Prevence browser defaultů (Ctrl+S, Ctrl+W apod.)
- [ ] Shortcuts volají správné command handlery
- [ ] Žádné konflikty mezi shortcuts

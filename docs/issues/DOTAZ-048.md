# DOTAZ-048: Error handling + toast notifikace

**Phase**: 7 — Polish
**Type**: frontend
**Dependencies**: [DOTAZ-003]

## Popis

Implementace globálního error handling a toast notifikačního systému. Toast.tsx v src/mainview/components/common/Toast.tsx — toast notifikace v pravém dolním rohu. Typy: success (zelený), error (červený), warning (žlutý), info (modrý). Auto-dismiss po 5s (nebo persistent pro errors). Dismiss tlačítko. Stack — více toastů se zobrazí nad sebou. UI store rozšíření v src/mainview/stores/ui.ts: addToast(type, message, options?), removeToast(id). Globální error handler: zachytávání neošetřených chyb z RPC volání. Místo pádu aplikace → zobrazení error toastu s user-friendly zprávou. DB connection errors: specifické zprávy ("Connection refused", "Authentication failed", "Database not found"). Query errors: zobrazení SQL error message.

## Soubory

- `src/mainview/components/common/Toast.tsx` — toast komponenta, stack layout, auto-dismiss, dismiss tlačítko
- `src/mainview/stores/ui.ts` — addToast(type, message, options?), removeToast(id), toast state management
- `src/mainview/lib/rpc.ts` — error handling wrapper pro RPC volání, mapování DB chyb na user-friendly zprávy

## Akceptační kritéria

- [ ] Toast notifikace se zobrazují ve správných barvách dle typu
- [ ] Auto-dismiss po 5s (errors jsou persistent)
- [ ] Stack více toastů funguje
- [ ] RPC chyby se zobrazí jako error toast
- [ ] DB chyby mají specifické user-friendly zprávy
- [ ] Aplikace nepadá při neošetřených chybách

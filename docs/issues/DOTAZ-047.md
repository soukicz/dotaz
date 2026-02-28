# DOTAZ-047: Transaction management UI

**Phase**: 7 — Polish
**Type**: frontend
**Dependencies**: [DOTAZ-032, DOTAZ-029]

## Popis

Kompletní transaction management UI. Implementace TransactionManager v src/bun/services/transaction-manager.ts — service pro správu transakcí per-connection. Sleduje stav otevřených transakcí. RPC handlery tx.begin, tx.commit, tx.rollback, tx.status — kompletní implementace (nahrazení stubs). Frontend: StatusBar rozšíření — zobrazení tx stavu (žluté "IN TRANSACTION" badge pokud aktivní tx). Varování při zavírání tabu s otevřenou transakcí (dialog: "You have an uncommitted transaction. Commit, Rollback, or Cancel?"). Varování při odpojení s otevřenou transakcí. Varování při zavírání aplikace (přes Electrobun window close handler). Data grid: při manual tx mode, Apply changes necommituje automaticky — uživatel musí explicitně commit/rollback.

## Soubory

- `src/bun/services/transaction-manager.ts` — TransactionManager service, správa transakcí per-connection
- `src/bun/rpc-handlers.ts` — tx.begin, tx.commit, tx.rollback, tx.status kompletní implementace
- `src/mainview/components/layout/StatusBar.tsx` — žluté "IN TRANSACTION" badge
- `src/mainview/stores/editor.ts` — integrace tx stavu s editorem

## Akceptační kritéria

- [ ] Begin/Commit/Rollback fungují end-to-end
- [ ] Stav transakce je viditelný ve status baru
- [ ] Varování při zavírání tabu s otevřenou transakcí
- [ ] Varování při odpojení s aktivní transakcí
- [ ] Manual tx mode v gridu funguje (Apply changes necommituje automaticky)

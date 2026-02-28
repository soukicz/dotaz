# DOTAZ-047: Transaction management UI

**Phase**: 7 — Polish
**Type**: frontend
**Dependencies**: [DOTAZ-032, DOTAZ-029]

## Description

Complete transaction management UI. Implementation of TransactionManager in src/bun/services/transaction-manager.ts — service for managing transactions per-connection. Tracks state of open transactions. RPC handlers tx.begin, tx.commit, tx.rollback, tx.status — complete implementation (replacing stubs). Frontend: StatusBar extension — display tx state (yellow "IN TRANSACTION" badge if active tx). Warning when closing tab with open transaction (dialog: "You have an uncommitted transaction. Commit, Rollback, or Cancel?"). Warning when disconnecting with open transaction. Warning when closing application (via Electrobun window close handler). Data grid: in manual tx mode, Apply changes does not auto-commit — user must explicitly commit/rollback.

## Files

- `src/bun/services/transaction-manager.ts` — TransactionManager service, transaction management per-connection
- `src/bun/rpc-handlers.ts` — tx.begin, tx.commit, tx.rollback, tx.status complete implementation
- `src/mainview/components/layout/StatusBar.tsx` — yellow "IN TRANSACTION" badge
- `src/mainview/stores/editor.ts` — integration of tx state with editor

## Acceptance Criteria

- [ ] Begin/Commit/Rollback work end-to-end
- [ ] Transaction state is visible in status bar
- [ ] Warning when closing tab with open transaction
- [ ] Warning when disconnecting with active transaction
- [ ] Manual tx mode in grid works (Apply changes does not auto-commit)

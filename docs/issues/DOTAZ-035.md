# DOTAZ-035: PendingChanges panel + apply/revert workflow

**Phase**: 5 — Data Editing
**Type**: frontend
**Dependencies**: [DOTAZ-033, DOTAZ-034]

## Popis

Implementace PendingChanges panelu v src/mainview/components/edit/PendingChanges.tsx. Panel zobrazujici seznam vsech pending zmen v aktualnim data grid tabu. Kazda zmena: typ (INSERT/UPDATE/DELETE) s ikonou a barvou, tabulka, popis (pro UPDATE: "Column X: old -> new", pro INSERT: "New row", pro DELETE: "Row PK=..."). Tlacitka: Apply All (odesle vsechny zmeny na backend pres rpc.data.applyChanges), Revert All (zahodi vsechny pending changes), Preview SQL (zobrazi generovany SQL pres rpc.data.generateSql). Revert jednotlive zmeny (x tlacitko u kazde). Apply spusti v transakci -> pri uspechu clear pendingChanges a reload dat. Pri chybe zobrazi error a ponecha pendingChanges. Counter v toolbaru gridu: "3 pending changes" badge. Varovani pri zavirani tabu s pending changes.

## Soubory

- `src/mainview/components/edit/PendingChanges.tsx` — panel se seznamem pending zmen
- `src/mainview/components/grid/DataGrid.tsx` — integrace pending changes badge do toolbaru

## Akceptační kritéria

- [ ] Panel zobrazuje vsechny pending changes s typem a popisem
- [ ] Apply All odesle zmeny na backend a reloadne data
- [ ] Revert All vycisti vsechny pending changes
- [ ] Revert jednotlive zmeny funguje (x tlacitko)
- [ ] Preview SQL zobrazi generovany SQL
- [ ] Chyba pri apply zobrazi error a ponecha pendingChanges
- [ ] Badge s poctem pending changes v toolbaru gridu
- [ ] Varovani pri zavirani tabu s neulozenymi zmenami

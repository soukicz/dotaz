# Varování při DELETE/UPDATE bez WHERE

**Tier**: 1 — Rychlá výhra
**Type**: fullstack
**Inspiration**: DataGrip — DELETE/UPDATE without WHERE warning

## Description

Před spuštěním SQL příkazu DELETE nebo UPDATE, který neobsahuje WHERE klauzuli, zobrazit varovný dialog. Uživatel musí potvrdit, že opravdu chce spustit příkaz bez WHERE — protože to ovlivní všechny řádky v tabulce.

Detekce probíhá jednoduchým parsováním: hledat `DELETE FROM` nebo `UPDATE ... SET` bez následného `WHERE`. Nemusí být 100% přesné (nestačí řešit subqueries), ale pokryje 95% běžných případů.

## Acceptance Criteria

- [ ] Při spuštění DELETE bez WHERE se zobrazí varovný dialog
- [ ] Při spuštění UPDATE bez WHERE se zobrazí varovný dialog
- [ ] Dialog zobrazí SQL příkaz a upozornění na počet potenciálně dotčených řádků
- [ ] Uživatel může potvrdit spuštění nebo zrušit
- [ ] Volitelně: checkbox "Nezobrazovat znovu pro tuto session"
- [ ] Neblokuje příkazy s WHERE klauzulí

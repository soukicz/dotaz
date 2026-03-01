# Aggregate View

**Tier**: 1 — Rychlá výhra
**Type**: fullstack
**Inspiration**: DataGrip — Show Aggregate View

## Description

Když uživatel označí rozsah buněk v data gridu, zobrazit panel s agregovanými hodnotami: SUM, COUNT, AVG, MIN, MAX. Panel se zobrazí ve spodní části gridu nebo jako plovoucí popup. Šetří psaní `SELECT COUNT(*), SUM(x)...` dotazů pro rychlý přehled.

Agregace se počítají client-side nad zobrazenými daty (nepotřebují server-side query). Pro numerické sloupce zobrazit všechny agregáty, pro textové jen COUNT a COUNT DISTINCT.

## Acceptance Criteria

- [ ] Označení více buněk v jednom sloupci zobrazí agregační panel
- [ ] Numerické sloupce: SUM, COUNT, AVG, MIN, MAX
- [ ] Textové sloupce: COUNT, COUNT DISTINCT, MIN (lexikograficky), MAX
- [ ] Panel se skryje při zrušení výběru
- [ ] Funguje s multi-row selection (Shift+Click, Ctrl+Click)
- [ ] Hodnoty se formátují dle typu (čísla s oddělovačem tisíců, datumy)

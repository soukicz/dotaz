# Read-only mode per connection

**Tier**: 1 — Rychlá výhra
**Type**: fullstack
**Inspiration**: DataGrip — Read-only mode (IDE-level a JDBC-level)

## Description

Přidat možnost označit connection jako read-only. V read-only režimu:

- Inline editace buněk je zakázána (grid je pouze pro čtení)
- Tlačítka Add Row, Delete Row, Duplicate Row jsou skrytá/disabled
- SQL editor zobrazí varování při pokusu o spuštění DML příkazů (INSERT, UPDATE, DELETE, TRUNCATE)
- Vizuální indikace v UI (ikona zámku u názvu spojení, barevný pruh ve status baru)

Nastavení se ukládá per connection v app databázi. Lze přepínat za běhu bez nutnosti reconnectu.

## Acceptance Criteria

- [ ] Checkbox/toggle "Read-only" v Connection dialogu
- [ ] V read-only režimu nelze editovat data v gridu
- [ ] V read-only režimu SQL editor varuje před DML příkazy
- [ ] Vizuální indikace (ikona zámku, status bar)
- [ ] Nastavení persistuje mezi sessions
- [ ] Lze přepnout za běhu bez reconnectu
- [ ] Connection tree zobrazuje read-only stav

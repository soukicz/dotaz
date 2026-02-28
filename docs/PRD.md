# Dotaz — Product Requirements Document

## 1. Vize produktu

**Dotaz** je desktop databázový klient zaměřený na práci s daty. Nabízí moderní alternativu k DataGrip s důrazem na čisté UX, rychlost a efektivitu při prohlížení, editaci a dotazování dat.

Aplikace **není** nástroj pro správu schématu (DDL) — zaměřuje se výhradně na DML operace a read-only prohlížení struktury databáze.

## 2. Cílová skupina

Vývojáři (backend/fullstack), kteří potřebují rychlý, spolehlivý a přehledný přístup k datům v databázích při vývoji a debugování.

## 3. Platforma a technologie

- **Desktop app** postavená na **Electrobun** (Bun backend + system webview)
- Frontend: framework dle volby (React/Solid/Vue + Vite)
- Komunikace frontend ↔ backend přes Electrobun RPC

## 4. Podporované databáze (v1)

| Databáze   | Připojení                        |
|------------|----------------------------------|
| PostgreSQL | Connection string / host+port+db |
| SQLite     | Cesta k souboru                  |

Architektura musí počítat s rozšiřitelností o další databáze (MySQL, MariaDB, ClickHouse atd.).

---

## 5. Informační architektura a layout

### 5.1 Celkový layout (DataGrip-like, modernizovaný)

```
┌──────────────────────────────────────────────────────┐
│  Menu bar                                            │
├────────────┬─────────────────────────────────────────┤
│            │  Tabs (tabulky, SQL konzole, views...)   │
│  Sidebar   ├─────────────────────────────────────────┤
│  (strom)   │                                         │
│            │  Hlavní panel                            │
│  Connections│  (data grid / SQL editor / detail)      │
│  > Schemas │                                         │
│  > Tables  │                                         │
│            │                                         │
│            ├─────────────────────────────────────────┤
│            │  Status bar (connection, tx mode, rows)  │
└────────────┴─────────────────────────────────────────┘
```

### 5.2 Sidebar — Connection tree

- Hierarchická struktura: **Connection → Schema → Tabulky**
- Ikony rozlišující typ databáze (PG vs SQLite)
- Kontextové menu na jednotlivých úrovních (otevřít data, nová konzole, schema viewer)
- Stav připojení vizuálně indikován (connected/disconnected)
- Možnost mít více connections otevřených současně

### 5.3 Hlavní panel — systém tabů

Taby pro různé typy obsahu:
- **Data grid** — prohlížení a editace dat konkrétní tabulky
- **SQL konzole** — psaní a spouštění SQL dotazů
- **Schema viewer** — read-only pohled na strukturu tabulky
- **Saved view** — uložený pohled (filtr + řazení + sloupce)

---

## 6. Funkční požadavky

### 6.1 Správa připojení (Connection Management)

**FR-CONN-01**: Vytvoření nového připojení
- Formulář s poli dle typu databáze
- PostgreSQL: host, port, database, username, password, SSL mode
- SQLite: cesta k souboru (s native file picker dialogem)
- Pojmenování connection
- Test connection button

**FR-CONN-02**: Uložení a správa připojení
- Seznam uložených connections v sidebar
- Editace a smazání existujících connections
- Duplikace connection

**FR-CONN-03**: Simultánní connections
- Více connections otevřených současně
- Každý tab je vázaný na konkrétní connection
- Jasná vizuální indikace, ke které connection tab patří

**FR-CONN-04**: Reconnect
- Automatický pokus o reconnect při výpadku
- Manuální reconnect tlačítko
- Jasný stav connection (connected / connecting / error)

---

### 6.2 Prohlížení dat (Data Grid)

**FR-GRID-01**: Zobrazení dat tabulky
- Tabulkový grid s řádky a sloupci
- Lazy loading / stránkování velkých tabulek
- Zobrazení celkového počtu řádků
- Indikace datového typu u sloupců

**FR-GRID-02**: Řazení
- Klik na hlavičku sloupce pro ASC/DESC řazení
- Multi-column sort (Shift+klik)
- Vizuální indikace aktivního řazení

**FR-GRID-03**: Filtrování
- Filtrování po sloupcích
- Podporované operátory: `=`, `!=`, `>`, `<`, `>=`, `<=`, `LIKE`, `IS NULL`, `IS NOT NULL`, `IN`
- Kombinace více filtrů (AND)
- Textový filter bar pro rychlé full-text hledání v zobrazených datech

**FR-GRID-04**: Správa sloupců
- Skrývání/zobrazování sloupců
- Změna šířky sloupců (drag)
- Změna pořadí sloupců (drag & drop)
- Fixování sloupců (pin left/right)

**FR-GRID-05**: Buňky a hodnoty
- Zobrazení NULL hodnot odlišným stylem
- Zkrácení dlouhých textů s možností rozbalit
- Zobrazení JSON/JSONB hodnot s formátováním
- Kopírování hodnoty buňky (Ctrl+C)

**FR-GRID-06**: Výběr řádků
- Klik = výběr řádku
- Ctrl+klik = přidání do výběru
- Shift+klik = range select
- Výběr všech (Ctrl+A)

---

### 6.3 Uložené views (Saved Views)

**FR-VIEW-01**: Vytvoření view
- Uložení aktuálního stavu gridu jako pojmenovaný view
- Uložené parametry: viditelné sloupce, pořadí sloupců, šířky, řazení, filtry

**FR-VIEW-02**: Scope views
- Views jsou vázané na konkrétní tabulku v rámci connection
- Seznam views dostupný v data grid panelu

**FR-VIEW-03**: Správa views
- Přejmenování, editace a smazání view
- Přepínání mezi views v rámci jedné tabulky
- Výchozí view (bez filtrů) vždy dostupný

**FR-VIEW-04**: Quick switch
- Dropdown / seznam views v hlavičce data gridu
- Rychlé přepínání mezi uloženými views

---

### 6.4 Editace dat

**FR-EDIT-01**: Inline editace (v gridu)
- Dvojklik na buňku → editace hodnoty přímo v gridu
- Tab/Enter pro přechod na další buňku
- Escape pro zrušení editace
- Vizuální indikace změněných (dosud necommitnutých) buněk

**FR-EDIT-02**: Formulářový detail
- Otevření řádku v detailním formuláři (klávesová zkratka nebo kontextové menu)
- Zobrazení všech sloupců ve vertikálním formuláři
- Vhodné pro tabulky s mnoha sloupci nebo dlouhými textovými hodnotami
- Editace hodnot ve formuláři

**FR-EDIT-03**: Přidání řádku
- Tlačítko / zkratka pro přidání nového řádku
- Nový řádek se zobrazí v gridu (inline) nebo jako formulář
- Validace NOT NULL a dalších constraints před odesláním

**FR-EDIT-04**: Smazání řádku
- Smazání vybraných řádků (s potvrzovacím dialogem)
- Multi-select delete

**FR-EDIT-05**: Změnový přehled (pending changes)
- Před commit/apply: zobrazení seznamu všech pending změn (INSERT, UPDATE, DELETE)
- Diff pohled: stará vs. nová hodnota
- Možnost revertovat jednotlivé změny před commitem

**FR-EDIT-06**: NULL handling
- Explicitní možnost nastavit hodnotu na NULL (ne prázdný string)
- Rozlišení mezi prázdným stringem a NULL v editaci

---

### 6.5 SQL Editor / Konzole

**FR-SQL-01**: SQL konzole
- Konzole vázaná na konkrétní connection (DataGrip styl)
- Více konzolí otevřených současně (jako taby)
- Pojmenování konzolí

**FR-SQL-02**: Editor
- Syntax highlighting pro SQL
- Autocomplete: tabulky, sloupce, SQL klíčová slova, funkce
- Autocomplete kontextově závislý na aktuální connection a schématu
- Formátování SQL (pretty print)
- Multi-statement podpora (oddělení středníkem)

**FR-SQL-03**: Spouštění dotazů
- Spuštění celého obsahu konzole (Ctrl+Enter nebo tlačítko)
- Spuštění vybraného textu (výběr + Ctrl+Enter)
- Spuštění aktuálního statementu (kurzor je ve statementu)
- Indikace běžícího dotazu s možností zrušení (cancel)

**FR-SQL-04**: Výsledky
- Zobrazení výsledků v data gridu pod editorem
- Multiple result sets (pokud více SELECT statementů)
- Zobrazení počtu affected rows pro DML
- Zobrazení doby trvání dotazu
- Error messages s pozicí chyby

**FR-SQL-05**: Transakční mód konzole
- Přepínač v hlavičce konzole: **Auto-commit** / **Manual**
- Auto-commit: každý statement se automaticky commitne
- Manual: explicitní BEGIN/COMMIT/ROLLBACK
- Vizuální indikace, že konzole je uprostřed otevřené transakce
- Varování při zavírání konzole s otevřenou transakcí

---

### 6.6 Transakce

**FR-TX-01**: Transakční režimy
- Per-konzole nastavení: auto-commit nebo manuální transakce
- Výchozí režim konfigurovatelný v nastavení

**FR-TX-02**: Manuální transakce
- BEGIN automaticky při prvním DML (nebo explicitně)
- COMMIT / ROLLBACK tlačítka v UI
- Klávesové zkratky pro commit/rollback
- Vizuální indikace otevřené transakce (barevný status bar)

**FR-TX-03**: Transakce při editaci dat v gridu
- Při manuálním režimu: editace v gridu se hromadí jako pending changes
- Apply = odeslání SQL statements v rámci transakce
- Commit = potvrzení transakce
- Rollback = zahození všech změn

**FR-TX-04**: Ochrana proti ztrátě dat
- Varování při zavírání tabu s necommitnutou transakcí
- Varování při odpojení s otevřenými transakcemi
- Varování při zavírání aplikace s otevřenými transakcemi

---

### 6.7 Export dat

**FR-EXP-01**: Formáty exportu
- CSV (s konfigurovatelným oddělovačem a kódováním)
- JSON (array of objects)
- SQL INSERT statements

**FR-EXP-02**: Scope exportu
- Export celé tabulky
- Export aktuálního view (s aplikovanými filtry)
- Export výsledku SQL dotazu
- Export vybraných řádků

**FR-EXP-03**: Export workflow
- Tlačítko v toolbaru gridu
- Výběr formátu → náhled (prvních N řádků) → uložení souboru (native save dialog)

---

### 6.8 FK navigace a vztahy

**FR-FK-01**: FK indikace
- Sloupce s FK vizuálně odlišeny v gridu (ikona/barva)
- Tooltip s informací o cílové tabulce a sloupci

**FR-FK-02**: FK navigace
- Klik na FK hodnotu → navigace na odkazovaný řádek v cílové tabulce
- Otevření v novém tabu nebo in-place navigace
- Breadcrumb / back navigace

**FR-FK-03**: Related data
- Z detailu řádku: zobrazení záznamů z tabulek, které na tento řádek odkazují (reverse FK)
- Odkaz pro otevření filtrovaného pohledu na child tabulku

---

### 6.9 Query History

**FR-HIST-01**: Automatické logování
- Každý spuštěný dotaz se uloží do historie
- Metadata: timestamp, connection, doba trvání, počet výsledků/affected rows, úspěch/chyba

**FR-HIST-02**: Prohlížení historie
- Searchable seznam historie dotazů
- Filtrování podle connection
- Filtrování podle časového rozsahu

**FR-HIST-03**: Akce z historie
- Opětovné spuštění dotazu z historie
- Kopírování dotazu do konzole
- Kopírování dotazu do schránky

---

### 6.10 Schema Viewer (read-only)

**FR-SCHEMA-01**: Zobrazení struktury tabulky
- Seznam sloupců: název, datový typ, nullable, default, komentář
- Primary key indikace
- FK constraints s odkazy na cílové tabulky

**FR-SCHEMA-02**: Indexy
- Seznam indexů tabulky: název, sloupce, typ (unique, btree, etc.)

**FR-SCHEMA-03**: Navigace
- Ze schema vieweru: odkaz na data grid tabulky
- Z FK: odkaz na schema cílové tabulky

---

## 7. Ovládání a UX

### 7.1 Klávesové zkratky

| Akce                        | Zkratka          |
|-----------------------------|------------------|
| Command palette             | Ctrl+Shift+P     |
| Nová SQL konzole            | Ctrl+N           |
| Spustit dotaz               | Ctrl+Enter       |
| Commit transakci            | Ctrl+Shift+Enter |
| Rollback                    | Ctrl+Shift+R     |
| Uložit view                 | Ctrl+S           |
| Zavřít tab                  | Ctrl+W           |
| Přepnutí tabů               | Ctrl+Tab         |
| Hledání v sidebar           | Ctrl+Shift+F     |
| Otevřít formulář řádku      | Enter (na řádku) |
| Inline editace              | F2 / dvojklik    |
| Smazat řádek                | Delete            |
| Refresh data                | F5               |

### 7.2 Command Palette

- Ctrl+Shift+P otevře command palette
- Fuzzy search přes všechny dostupné příkazy
- Zobrazení klávesové zkratky u každého příkazu
- Nedávné příkazy nahoře

### 7.3 Kontextová menu

- Pravý klik na buňku: kopírovat, editovat, set NULL, filtrovat dle hodnoty
- Pravý klik na řádek: otevřít detail, smazat, duplikovat
- Pravý klik na sloupec: řadit, filtrovat, skrýt, zobrazit schema
- Pravý klik v sidebar: otevřít data, nová konzole, schema viewer

---

## 8. Nefunkční požadavky

**NFR-01**: Výkon
- Data grid musí plynule scrollovat s 10 000+ řádky
- Autocomplete musí reagovat do 100 ms
- Otevření tabulky s daty do 500 ms (pro tabulky do 100k řádků)

**NFR-02**: Stabilita
- Pád jednoho connection nesmí ovlivnit ostatní
- Graceful handling chyb z databáze (zobrazení chybové hlášky, ne crash)

**NFR-03**: Rozšiřitelnost
- Architektura databázových driverů musí umožnit přidání nového typu DB bez zásahu do core logiky
- Abstraktní vrstva pro databázové operace (query, metadata, schema info)

**NFR-04**: Bezpečnost
- Connection stringy a hesla uloženy bezpečně (ne plaintext)
- Žádná telemetrie ani odesílání dat

---

## 9. Out of scope (v1)

- Schema management (CREATE, ALTER, DROP tabulek)
- Stored procedures / functions editor
- Data import (CSV → tabulka)
- Vizuální query builder (drag & drop)
- ER diagram / schema vizualizace
- Collaboration / sdílení connections
- Cloud sync nastavení
- Podpora dalších DB (MySQL, MongoDB, atd.) — přijde v dalších verzích
- Specifika ukládání konfigurace (řeší Electrobun / implementační detail)

---

## 10. Metriky úspěchu

- Aplikace je použitelná jako každodenní náhrada DataGrip pro práci s PostgreSQL a SQLite
- Čas od spuštění do prvního dotazu < 3 sekundy
- Editační workflow (editace → commit) je plynulý a bezchybný
- Export funguje spolehlivě pro tabulky do 1M řádků

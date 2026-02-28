# Dotaz — Architecture

## Přehled

Dotaz je desktop databázový klient postavený na **Electrobun** (Bun backend + system webview). Frontend používá **Solid.js** s Vite (HMR). Komunikace mezi frontendem a backendem probíhá přes **Electrobun RPC** (type-safe, bidirectional).

Aplikace je zaměřená na DML operace — prohlížení, editaci a dotazování dat. Neposkytuje DDL nástroje (CREATE/ALTER/DROP).

---

## Technologická rozhodnutí

| Oblast | Technologie | Zdůvodnění |
|---|---|---|
| Runtime | Bun | Nativní podpora SQLite, vestavěný SQL driver, rychlý startup |
| Desktop framework | Electrobun | Bun backend + system webview, nízká paměťová náročnost |
| Frontend | Solid.js + Vite | Fine-grained reactivity, rychlý HMR |
| DB driver | `Bun.SQL` (`import { SQL } from "bun"`) | Unified API pro PostgreSQL i SQLite, tagged template literals, connection pooling, transactions, cancellation. Žádná externí závislost. |
| App state storage | `bun:sqlite` | Lokální SQLite pro connections, history, settings, saved views. Uloženo v `Utils.paths.userData/dotaz.db` |
| Data grid | `@tanstack/solid-virtual` | Virtual scrolling pro velké datasety, Solid.js integrace |
| SQL editor | CodeMirror 6 + `@codemirror/lang-sql` | Modulární, rozšiřitelný, schema-aware autocomplete |
| Komunikace | Electrobun RPC | Type-safe, bidirectional, definované v sdílených typech |

---

## Adresářová struktura

```
dotaz/
  electrobun.config.ts          # Electrobun build konfigurace
  vite.config.ts                # Vite konfigurace pro frontend
  tsconfig.json                 # TypeScript konfigurace
  package.json                  # Závislosti a skripty
  PRD.md                        # Product Requirements Document
  docs/
    ARCHITECTURE.md             # Tento dokument
    issues/
      DOTAZ-001.md ... DOTAZ-053.md  # Issue soubory
  src/
    shared/types/               # Sdílené typy (RPC schema, datové typy)
      rpc.ts                    # RPC schema definice (request/response typy)
      connection.ts             # Connection typy (PG, SQLite konfigurace)
      database.ts               # Database metadata typy (schema, tables, columns)
      grid.ts                   # Grid typy (pagination, sort, filter)
      query.ts                  # Query typy (execute, result, history)
      tab.ts                    # Tab typy (data grid, SQL console, schema viewer)
      export.ts                 # Export typy (CSV, JSON, SQL formáty)
    bun/                        # Backend (Bun process)
      index.ts                  # Entry point: window, menu, RPC setup
      rpc-handlers.ts           # RPC handler implementace
      db/
        driver.ts               # DatabaseDriver interface (abstrakce)
        postgres-driver.ts      # PostgreSQL implementace (Bun.SQL)
        sqlite-driver.ts        # SQLite implementace (Bun.SQL)
      services/
        connection-manager.ts   # Správa connections (connect/disconnect/pool)
        query-executor.ts       # Spouštění dotazů s cancellation
        schema-service.ts       # Schema introspekce (tables, columns, FK, indexes)
        export-service.ts       # Export dat (CSV, JSON, SQL INSERT)
        transaction-manager.ts  # Správa transakcí (begin/commit/rollback)
      storage/
        app-db.ts               # Lokální SQLite pro app data
        migrations.ts           # Schema migrace pro app DB
    mainview/                   # Frontend (Solid.js)
      index.html                # HTML entry point
      main.tsx                  # Solid.js render entry
      App.tsx                   # Root komponenta
      styles/global.css         # Globální styly, dark theme, CSS proměnné
      lib/
        rpc.ts                  # Frontend RPC klient (Electroview wrapper)
        keyboard.ts             # Keyboard shortcut system
        commands.ts             # Command registry pro command palette
      stores/
        connections.ts          # Connection store (seznam, stav, aktivní)
        tabs.ts                 # Tab store (otevřené taby, aktivní tab)
        grid.ts                 # Grid store (data, pagination, sort, filter, selection)
        editor.ts               # Editor store (SQL obsah, výsledky, tx stav)
        ui.ts                   # UI store (sidebar width, dialogy, toasty)
      components/
        layout/
          AppShell.tsx          # Hlavní layout (sidebar + content + status bar)
          Sidebar.tsx           # Levý panel se stromem connections
          TabBar.tsx            # Tab bar nad hlavním panelem
          StatusBar.tsx         # Spodní status bar
          Resizer.tsx           # Resize handle pro sidebar/panely
        connection/
          ConnectionDialog.tsx  # Formulář pro add/edit connection
          ConnectionTree.tsx    # Stromová struktura connections
          ConnectionTreeItem.tsx # Jednotlivá položka stromu
        grid/
          DataGrid.tsx          # Kontejner data gridu
          GridHeader.tsx        # Hlavička s řazením a resize sloupců
          GridRow.tsx           # Řádek gridu
          GridCell.tsx          # Buňka gridu (render dle typu)
          VirtualScroller.tsx   # Virtual scrolling wrapper
          FilterBar.tsx         # Panel pro sloupcové filtrování
          ColumnManager.tsx     # Správa viditelnosti a pořadí sloupců
          Pagination.tsx        # Stránkování + total count
        editor/
          SqlEditor.tsx         # CodeMirror 6 SQL editor
          SqlResultPanel.tsx    # Panel s výsledky dotazů
          QueryToolbar.tsx      # Toolbar (run, cancel, tx controls)
        schema/
          SchemaViewer.tsx      # Read-only pohled na strukturu tabulky
          ColumnList.tsx        # Seznam sloupců s typy a constraints
          IndexList.tsx         # Seznam indexů
        edit/
          InlineEditor.tsx      # Editace buněk v gridu
          RowDetailDialog.tsx   # Formulářový detail řádku
          PendingChanges.tsx    # Panel pending změn s apply/revert
        common/
          CommandPalette.tsx    # Ctrl+Shift+P command palette
          ContextMenu.tsx       # Kontextové menu
          Dialog.tsx            # Modální dialog
          Dropdown.tsx          # Dropdown / select
          Toast.tsx             # Toast notifikace
          Icon.tsx              # Ikony (SVG)
        views/
          SavedViewPicker.tsx   # Dropdown pro výběr uloženého view
          SaveViewDialog.tsx    # Dialog pro uložení view
        history/
          QueryHistory.tsx      # Panel historie dotazů
        export/
          ExportDialog.tsx      # Export dialog (formát, preview, uložení)
```

---

## Architektura

### Vrstvení

```
┌─────────────────────────────────────────────┐
│  Frontend (Solid.js ve webview)              │
│  ├─ Components (UI)                         │
│  ├─ Stores (reaktivní stav)                 │
│  └─ Lib (RPC klient, keyboard, commands)    │
├─────────────── Electrobun RPC ──────────────┤
│  Backend (Bun process)                      │
│  ├─ RPC Handlers (vstupní bod)              │
│  ├─ Services (business logika)              │
│  ├─ DB Drivers (databázová abstrakce)       │
│  └─ Storage (lokální app data)              │
└─────────────────────────────────────────────┘
```

### Data flow

1. **User akce** → Solid.js komponenta
2. Komponenta volá **store** akci
3. Store volá **RPC** metodu přes Electrobun
4. RPC handler deleguje na **service**
5. Service používá **driver** pro komunikaci s DB
6. Výsledek se vrací stejnou cestou zpět

### Příklad: Otevření tabulky

```
User klikne na tabulku v sidebar
  → ConnectionTree.tsx emituje událost
  → tabs store vytvoří nový tab (typ: "data-grid")
  → grid store volá RPC `getTableData({ connectionId, table, page: 1 })`
  → rpc-handlers.ts → query-executor.ts → postgres-driver.ts
  → SQL: SELECT * FROM "table" LIMIT 100 OFFSET 0
  → výsledek se vrátí do grid store
  → DataGrid.tsx renderuje data
```

---

## RPC Schema

RPC schema je definovaná v `src/shared/types/rpc.ts` a sdílená mezi backendem a frontendem. Electrobun RPC zajišťuje type-safety.

### Hlavní RPC metody

#### Connection Management
| Metoda | Směr | Popis |
|---|---|---|
| `connections.list` | FE→BE | Seznam uložených connections |
| `connections.create` | FE→BE | Vytvoření nové connection |
| `connections.update` | FE→BE | Editace connection |
| `connections.delete` | FE→BE | Smazání connection |
| `connections.test` | FE→BE | Test connection |
| `connections.connect` | FE→BE | Připojení k DB |
| `connections.disconnect` | FE→BE | Odpojení od DB |
| `connections.statusChanged` | BE→FE | Notifikace o změně stavu |

#### Schema
| Metoda | Směr | Popis |
|---|---|---|
| `schema.getSchemas` | FE→BE | Seznam schémat |
| `schema.getTables` | FE→BE | Seznam tabulek ve schématu |
| `schema.getColumns` | FE→BE | Sloupce tabulky (typy, constraints) |
| `schema.getIndexes` | FE→BE | Indexy tabulky |
| `schema.getForeignKeys` | FE→BE | FK constraints |

#### Data Grid
| Metoda | Směr | Popis |
|---|---|---|
| `data.getTableData` | FE→BE | Data tabulky s paginací, sort, filter |
| `data.getRowCount` | FE→BE | Celkový počet řádků |
| `data.getColumnStats` | FE→BE | Statistiky sloupce (pro filtrování) |

#### Data Editing
| Metoda | Směr | Popis |
|---|---|---|
| `data.applyChanges` | FE→BE | Aplikace pending změn (INSERT/UPDATE/DELETE) |
| `data.generateSql` | FE→BE | Generace SQL pro pending změny (preview) |

#### Query Execution
| Metoda | Směr | Popis |
|---|---|---|
| `query.execute` | FE→BE | Spuštění SQL dotazu |
| `query.cancel` | FE→BE | Zrušení běžícího dotazu |
| `query.format` | FE→BE | Formátování SQL |

#### Transactions
| Metoda | Směr | Popis |
|---|---|---|
| `tx.begin` | FE→BE | Začátek transakce |
| `tx.commit` | FE→BE | Potvrzení transakce |
| `tx.rollback` | FE→BE | Rollback transakce |
| `tx.status` | FE→BE | Stav transakce |

#### Export
| Metoda | Směr | Popis |
|---|---|---|
| `export.exportData` | FE→BE | Export dat do souboru |
| `export.preview` | FE→BE | Náhled exportu (prvních N řádků) |

#### History
| Metoda | Směr | Popis |
|---|---|---|
| `history.list` | FE→BE | Seznam historie dotazů |
| `history.clear` | FE→BE | Vymazání historie |

#### Saved Views
| Metoda | Směr | Popis |
|---|---|---|
| `views.list` | FE→BE | Seznam uložených views pro tabulku |
| `views.save` | FE→BE | Uložení view |
| `views.update` | FE→BE | Editace view |
| `views.delete` | FE→BE | Smazání view |

#### System
| Metoda | Směr | Popis |
|---|---|---|
| `system.showOpenDialog` | FE→BE | Otevření native file picker dialogu |
| `system.showSaveDialog` | FE→BE | Otevření native save dialogu |
| `settings.get` | FE→BE | Načtení nastavení |
| `settings.set` | FE→BE | Uložení nastavení |

---

## DatabaseDriver Interface

Abstrakce pro databázové operace. Každý driver implementuje stejné rozhraní.

```typescript
interface DatabaseDriver {
  // Lifecycle
  connect(config: ConnectionConfig): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  // Query execution
  execute(sql: string, params?: unknown[]): Promise<QueryResult>;
  cancel(): Promise<void>;

  // Schema introspection
  getSchemas(): Promise<SchemaInfo[]>;
  getTables(schema: string): Promise<TableInfo[]>;
  getColumns(schema: string, table: string): Promise<ColumnInfo[]>;
  getIndexes(schema: string, table: string): Promise<IndexInfo[]>;
  getForeignKeys(schema: string, table: string): Promise<ForeignKeyInfo[]>;
  getPrimaryKey(schema: string, table: string): Promise<string[]>;

  // Transactions
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  inTransaction(): boolean;

  // Metadata
  getDriverType(): "postgresql" | "sqlite";
  quoteIdentifier(name: string): string;
}
```

### PostgreSQL Driver (`postgres-driver.ts`)

Používá `Bun.SQL` s tagged template literals:

```typescript
import { SQL } from "bun";

const db = new SQL({ url: connectionString });
const results = await db`SELECT * FROM ${SQL.id(table)} LIMIT ${limit}`;
```

Vlastnosti:
- Connection pooling (vestavěný v Bun.SQL)
- Query cancellation přes `AbortController`
- Schema introspekce přes `information_schema` a `pg_catalog`
- Transaction support

### SQLite Driver (`sqlite-driver.ts`)

Používá `Bun.SQL` s unified API:

```typescript
import { SQL } from "bun";

const db = new SQL({ url: `sqlite:${filePath}` });
const results = await db`SELECT * FROM ${SQL.id(table)} LIMIT ${limit}`;
```

Vlastnosti:
- Přímý přístup k souboru
- Schema introspekce přes `sqlite_master` a `PRAGMA` příkazy
- Jednoduchý transaction model

---

## Lokální App Storage

Aplikační data (connections, history, settings, saved views) jsou uložena v lokální SQLite databázi:

**Cesta**: `Utils.paths.userData/dotaz.db`

### Schema

```sql
-- Uložená připojení
CREATE TABLE connections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('postgresql', 'sqlite')),
  config TEXT NOT NULL,  -- JSON: host, port, database, ...
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Historie dotazů
CREATE TABLE query_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  connection_id TEXT NOT NULL,
  sql TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('success', 'error')),
  duration_ms INTEGER,
  row_count INTEGER,
  error_message TEXT,
  executed_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (connection_id) REFERENCES connections(id) ON DELETE CASCADE
);

-- Uložené views
CREATE TABLE saved_views (
  id TEXT PRIMARY KEY,
  connection_id TEXT NOT NULL,
  schema_name TEXT NOT NULL,
  table_name TEXT NOT NULL,
  name TEXT NOT NULL,
  config TEXT NOT NULL,  -- JSON: columns, sort, filters, widths
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (connection_id) REFERENCES connections(id) ON DELETE CASCADE
);

-- Nastavení
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Schema verze pro migrace
CREATE TABLE schema_version (
  version INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

## Frontend State Management

Stav aplikace je spravován přes Solid.js stores s `createStore` / `createSignal`.

### Stores

| Store | Zodpovědnost |
|---|---|
| `connections` | Seznam connections, stav připojení, aktivní connection |
| `tabs` | Otevřené taby, aktivní tab, tab metadata |
| `grid` | Data gridu: řádky, sloupce, pagination, sort, filter, selection, pending changes |
| `editor` | SQL konzole: obsah editoru, výsledky, tx stav, running state |
| `ui` | UI stav: sidebar width, dialogy, toasty, command palette |

### Reaktivní flow

```
User akce → Store update → Automatický re-render (Solid.js fine-grained reactivity)
                         → Side-effect (RPC volání, pokud potřeba)
```

---

## Bezpečnost

- Connection stringy a hesla: zatím uloženy v lokální SQLite (šifrování v budoucí verzi)
- Žádná telemetrie ani odesílání dat
- SQL parametry vždy přes parametrizované dotazy (prevence SQL injection)
- Frontend nemá přímý přístup k DB — vše přes RPC

---

## Fáze implementace

| Fáze | Název | Issues | Popis |
|---|---|---|---|
| 0 | Project Setup | DOTAZ-001 – 003 | Inicializace projektu, shared types, app shell |
| 1 | Foundation | DOTAZ-004 – 011 | App DB, drivers, connection manager, RPC, layout |
| 2 | Connection Management | DOTAZ-012 – 016 | Connection UI (dialog, tree, context menu) |
| 3 | Data Grid | DOTAZ-017 – 024 | Data grid s virtual scrolling, filtry, paginace |
| 4 | SQL Editor | DOTAZ-025 – 031 | Query executor, CodeMirror editor, autocomplete |
| 5 | Data Editing | DOTAZ-032 – 035 | Inline editace, row detail, pending changes |
| 6 | Advanced Features | DOTAZ-036 – 043 | Saved views, FK navigace, export, history, schema |
| 7 | Polish | DOTAZ-044 – 053 | Command palette, shortcuts, error handling, UI polish |

Závislostní graf je acyklický. Každá fáze staví na předchozích.

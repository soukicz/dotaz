# DOTAZ-043: SchemaViewer

**Phase**: 6 — Advanced Features
**Type**: frontend
**Dependencies**: [DOTAZ-008, DOTAZ-011]

## Description

Implementation of SchemaViewer in src/mainview/components/schema/SchemaViewer.tsx. Tab displaying read-only table structure. Opened from context menu on table in sidebar ("View Schema") or from data grid toolbar. ColumnList.tsx — table of columns: name, data type, nullable (boolean icon), default value, PK indicator (key icon), FK info (-> target table.column as clickable link). IndexList.tsx — table of indexes: name, columns, type (unique, btree, hash), conditions. Navigation links: from FK -> open target table schema, "Open Data" button -> open data grid for this table. Reads data via schema.getColumns, schema.getIndexes, schema.getForeignKeys RPC.

## Files

- `src/mainview/components/schema/SchemaViewer.tsx` — main schema viewer component
- `src/mainview/components/schema/ColumnList.tsx` — table of columns with types and constraints
- `src/mainview/components/schema/IndexList.tsx` — table of indexes

## Acceptance Criteria

- [ ] SchemaViewer displays columns with names, types and constraints
- [ ] Indexes are displayed with name, columns and type
- [ ] FK links navigate to target table schema
- [ ] "Open Data" button opens data grid tab for table
- [ ] PK and FK icons are visible on respective columns
- [ ] Data is loaded via schema.getColumns, schema.getIndexes, schema.getForeignKeys RPC

# DOTAZ-016: Context menu for connections

**Phase**: 2 — Connection Management
**Type**: frontend
**Dependencies**: [DOTAZ-015]

## Description

Implementation of ContextMenu component in `src/mainview/components/common/ContextMenu.tsx`. Generic context menu component:

- Opens at click position (right-click)
- Closes when clicking outside
- Support for separators and disabled items

Integration with ConnectionTree:

- Right-click on connection → Connect/Disconnect, Edit, Duplicate, Delete (with confirmation dialog)
- Right-click on table → Open Data, New SQL Console (for this connection), View Schema
- Right-click on schema → New SQL Console

Actions call respective store methods (connections store, tabs store).

## Files

- `src/mainview/components/common/ContextMenu.tsx` — generic context menu component with positioning, separators and disabled items
- `src/mainview/components/connection/ConnectionTree.tsx` — extension with context menu on right-click for connections, schemas and tables

## Acceptance Criteria

- [ ] Context menu opens on right-click at correct position
- [ ] Closes when clicking outside menu
- [ ] Actions for connections work (connect, disconnect, edit, delete)
- [ ] Actions for tables work (open data, new console, view schema)
- [ ] Menu is positioned correctly even at window edges (doesn't fall outside viewport)

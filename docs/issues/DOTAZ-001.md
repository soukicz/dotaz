# DOTAZ-001: Electrobun project initialization for Dotaz

**Phase**: 0 — Project Setup
**Type**: backend
**Dependencies**: none

## Description

Adapt existing Electrobun solid template for Dotaz. Rename app to "Dotaz" in electrobun.config.ts, package.json, index.html. Create directory structure:

- `src/shared/types/`
- `src/bun/db/`
- `src/bun/services/`
- `src/bun/storage/`
- `src/mainview/lib/`
- `src/mainview/stores/`
- `src/mainview/components/` with all subdirectories per architecture:
  - `src/mainview/components/layout/`
  - `src/mainview/components/connection/`
  - `src/mainview/components/grid/`
  - `src/mainview/components/editor/`
  - `src/mainview/components/schema/`
  - `src/mainview/components/edit/`
  - `src/mainview/components/common/`
  - `src/mainview/components/views/`
  - `src/mainview/components/history/`
  - `src/mainview/components/export/`
- `src/mainview/styles/`

Add dependencies to package.json: @tanstack/solid-virtual, codemirror, @codemirror/lang-sql, @codemirror/view, @codemirror/state.

Update window title in src/bun/index.ts to "Dotaz". Set window dimensions (1280x800).

## Files

- `electrobun.config.ts` — rename app to "Dotaz"
- `package.json` — rename, add dependencies (@tanstack/solid-virtual, codemirror, @codemirror/lang-sql, @codemirror/view, @codemirror/state)
- `src/bun/index.ts` — update window title to "Dotaz", set dimensions 1280x800
- `src/mainview/index.html` — update `<title>` to "Dotaz"
- new directories — create complete directory structure per ARCHITECTURE.md

## Acceptance criteria

- [ ] Application runs under the name "Dotaz"
- [ ] Directory structure matches ARCHITECTURE.md
- [ ] All dependencies are in package.json
- [ ] `bun install` runs without errors

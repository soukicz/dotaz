# DOTAZ-003: App shell with dark theme and basic layout

**Phase**: 0 — Project Setup
**Type**: frontend
**Dependencies**: DOTAZ-001

## Description

Create basic application layout with dark theme. CSS variables for colors, fonts, spacing in src/mainview/styles/global.css (dark theme as default, inspired by DataGrip/VS Code).

Rewrite App.tsx — empty shell with three-zone layout:
- **Sidebar** — left panel, width 250px, resizable
- **Main content** — right panel
- **Status bar** — bottom bar

Basic AppShell.tsx component in src/mainview/components/layout/ with CSS grid/flexbox layout.

Font: system monospace for data, sans-serif for UI.

Colors:
- Dark background: `#1e1e1e`
- Panels: `#252526`
- Borders: `#3c3c3c`
- Text: `#cccccc`
- Accent: `#007acc`

## Files

- `src/mainview/styles/global.css` — CSS variables for colors, fonts, spacing; dark theme as default
- `src/mainview/App.tsx` — rewrite to empty shell importing AppShell
- `src/mainview/components/layout/AppShell.tsx` — three-zone layout (sidebar, main content, status bar) with CSS grid/flexbox

## Acceptance criteria

- [ ] Application displays dark theme layout with sidebar, main content and status bar
- [ ] CSS variables are defined for the entire application
- [ ] Layout is responsive (sidebar resizable)
- [ ] No scrollbars on entire app shell

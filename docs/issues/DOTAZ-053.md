# DOTAZ-053: Visual polish + responsive layout

**Phase**: 7 — Polish
**Type**: frontend
**Dependencies**: [DOTAZ-010, DOTAZ-020, DOTAZ-028, DOTAZ-043]

## Description

Final visual polish of entire application. Consistent spacing and sizing across application (CSS variables). Hover and focus states for all interactive elements. Transition animations: sidebar collapse/expand, tab switch, dialog open/close, toast slide-in. Loading states: skeleton loaders for grid (instead of empty space), spinner for actions. Empty states: all panels have appropriate empty state (no data, no connections, no history). Scroll handling: custom scrollbar styling (thin, dark). Responsive layout: sidebar collapsible under 600px window width. Focus management: proper focus trapping in dialogs, focus return after dialog close. Typography: consistent font sizes by hierarchy (14px base, 12px small/meta, 16px headings). Icons: consistent SVG icon set for all actions via Icon.tsx.

## Files

- `src/mainview/styles/global.css` — extension of CSS variables, custom scrollbars, transition animations, responsive breakpoints
- `src/mainview/components/common/Icon.tsx` — consistent SVG icon set for all actions
- `src/mainview/components/` — minor adjustments to all components (hover/focus states, empty states, loading states, focus management)

## Acceptance Criteria

- [ ] Consistent visual language across entire application
- [ ] Hover and focus states on all interactive elements
- [ ] Animations are smooth (sidebar, tabs, dialogs, toasts)
- [ ] Loading states in all places where data is loaded
- [ ] Empty states on all panels
- [ ] Custom scrollbar styling
- [ ] Sidebar is collapsible under 600px width
- [ ] Focus management in dialogs works (trapping, return)
- [ ] Icons are consistent across entire application

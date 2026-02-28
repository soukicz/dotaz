# DOTAZ-003: App shell s dark theme a základním layoutem

**Phase**: 0 — Project Setup
**Type**: frontend
**Dependencies**: DOTAZ-001

## Popis

Vytvoření základního layoutu aplikace s dark theme. CSS proměnné pro barvy, fonty, spacing v src/mainview/styles/global.css (dark theme jako výchozí, inspirace DataGrip/VS Code).

Přepsání App.tsx — prázdný shell s třízónním layoutem:
- **Sidebar** — levý panel, šířka 250px, resizable
- **Main content** — pravý panel
- **Status bar** — spodní lišta

Základní AppShell.tsx komponenta v src/mainview/components/layout/ s CSS grid/flexbox layoutem.

Font: system monospace pro data, sans-serif pro UI.

Barvy:
- Tmavé pozadí: `#1e1e1e`
- Panely: `#252526`
- Bordery: `#3c3c3c`
- Text: `#cccccc`
- Accent: `#007acc`

## Soubory

- `src/mainview/styles/global.css` — CSS proměnné pro barvy, fonty, spacing; dark theme jako výchozí
- `src/mainview/App.tsx` — přepsání na prázdný shell importující AppShell
- `src/mainview/components/layout/AppShell.tsx` — třízónní layout (sidebar, main content, status bar) s CSS grid/flexbox

## Akceptační kritéria

- [ ] Aplikace zobrazí dark theme layout se sidebar, main content a status bar
- [ ] CSS proměnné jsou definovány pro celou aplikaci
- [ ] Layout je responsivní (sidebar resizable)
- [ ] Žádné scrollbary na celém app shell

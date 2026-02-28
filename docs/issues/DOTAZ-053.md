# DOTAZ-053: Visual polish + responsive layout

**Phase**: 7 — Polish
**Type**: frontend
**Dependencies**: [DOTAZ-010, DOTAZ-020, DOTAZ-028, DOTAZ-043]

## Popis

Finální vizuální polish celé aplikace. Konzistentní spacing a sizing přes celou aplikaci (CSS proměnné). Hover a focus stavy pro všechny interaktivní elementy. Transition animace: sidebar collapse/expand, tab switch, dialog open/close, toast slide-in. Loading states: skeleton loaders pro grid (místo prázdného prostoru), spinner pro akce. Empty states: všechny panely mají vhodný empty state (žádná data, žádné connections, žádná historie). Scroll handling: custom scrollbar styling (tenký, tmavý). Responsive layout: sidebar collapsible pod 600px šířky okna. Focus management: správné focus trapping v dialozích, focus return po zavření dialogu. Typography: konzistentní velikosti fontů dle hierarchie (14px base, 12px small/meta, 16px headings). Ikony: konzistentní ikona sada (SVG) pro všechny akce přes Icon.tsx.

## Soubory

- `src/mainview/styles/global.css` — rozšíření CSS proměnných, custom scrollbars, transition animace, responsive breakpointy
- `src/mainview/components/common/Icon.tsx` — konzistentní SVG ikona sada pro všechny akce
- `src/mainview/components/` — drobné úpravy všech komponent (hover/focus stavy, empty states, loading states, focus management)

## Akceptační kritéria

- [ ] Konzistentní vizuální jazyk přes celou aplikaci
- [ ] Hover a focus stavy na všech interaktivních elementech
- [ ] Animace jsou plynulé (sidebar, tabs, dialogy, toasty)
- [ ] Loading states na všech místech kde se načítají data
- [ ] Empty states na všech panelech
- [ ] Custom scrollbar styling
- [ ] Sidebar je collapsible pod 600px šířky
- [ ] Focus management v dialozích funguje (trapping, return)
- [ ] Ikony jsou konzistentní přes celou aplikaci

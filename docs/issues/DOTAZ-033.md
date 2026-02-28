# DOTAZ-033: InlineEditor (editace bunek v gridu)

**Phase**: 5 — Data Editing
**Type**: frontend
**Dependencies**: [DOTAZ-020, DOTAZ-018, DOTAZ-032]

## Popis

Implementace InlineEditor v src/mainview/components/edit/InlineEditor.tsx. Dvojklik na bunku -> prepnuti do edit mode: bunka se zmeni na input/textarea. Typ editoru dle datoveho typu sloupce: text -> textarea (auto-resize), number -> number input, boolean -> checkbox, date/timestamp -> date input. Escape -> zruseni editace (vrati puvodni hodnotu). Tab -> presun na dalsi bunku (a ulozeni zmeny). Enter -> ulozeni a presun dolu. F2 na vybrane bunce -> start editace. Tlacitko "Set NULL" v editoru pro explicitni null. Zmenene bunky: vizualni indikace (oranzovy border/pozadi). Zmeny se ukladaji do grid store jako pendingChanges (neposilaji se okamzite na backend). Novy radek: Ctrl+Insert nebo tlacitko -> prida prazdny radek na konec s editovatelnymi bunkami. Delete vybranych radku: prida do pendingChanges jako "delete".

## Soubory

- `src/mainview/components/edit/InlineEditor.tsx` — hlavni komponenta inline editoru
- `src/mainview/components/grid/GridCell.tsx` — rozsireni o edit mode
- `src/mainview/stores/grid.ts` — rozsireni o pendingChanges

## Akceptační kritéria

- [ ] Dvojklik aktivuje inline editaci
- [ ] Editor odpovida datovemu typu sloupce (text, number, boolean, date)
- [ ] Escape zrusi editaci a vrati puvodni hodnotu
- [ ] Tab ulozi zmenu a presune na dalsi bunku
- [ ] Enter ulozi zmenu a presune dolu
- [ ] Zmenene bunky jsou vizualne odliseny (oranzovy border/pozadi)
- [ ] Set NULL funguje
- [ ] Novy radek (Ctrl+Insert) funguje
- [ ] Delete radku prida zmenu do pendingChanges
- [ ] Zmeny jsou v pendingChanges (ne na serveru)

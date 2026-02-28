# DOTAZ-037: SavedViewPicker + SaveViewDialog

**Phase**: 6 — Advanced Features
**Type**: frontend
**Dependencies**: [DOTAZ-036, DOTAZ-018]

## Popis

Implementace SavedViewPicker v src/mainview/components/views/SavedViewPicker.tsx. Dropdown v toolbaru data gridu pro vyber ulozeneho view. Zobrazuje "Default" (zadne filtry/sort) + seznam ulozenych views. Klik na view -> aplikuje jeho nastaveni na grid store (sloupce, sort, filtry). Indikace aktivniho view. SaveViewDialog v src/mainview/components/views/SaveViewDialog.tsx — dialog pro ulozeni aktualniho stavu gridu jako view. Input pro nazev view. Checkbox: "Update existing" pokud editace. Zobrazi co se ulozi: X filtru, Y sort pravidel, Z skrytych sloupcu. Ctrl+S shortcut pro quick save (pokud view ma jmeno, update; jinak otevre dialog).

## Soubory

- `src/mainview/components/views/SavedViewPicker.tsx` — dropdown pro vyber ulozenych views
- `src/mainview/components/views/SaveViewDialog.tsx` — dialog pro ulozeni view

## Akceptační kritéria

- [ ] Picker zobrazuje ulozene views v dropdown menu
- [ ] Vyber view aplikuje jeho nastaveni na grid (sloupce, sort, filtry)
- [ ] Default view vrati vychozi stav gridu
- [ ] Ulozeni noveho view funguje
- [ ] Update existujiciho view funguje
- [ ] Ctrl+S shortcut pro quick save funguje

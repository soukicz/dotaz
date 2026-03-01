# Quick Value Shortcuts při editaci

**Tier**: 1 — Rychlá výhra
**Type**: frontend
**Inspiration**: DataGrip — Quick value shortcuts

## Description

Při editaci buňky v gridu umožnit jednopísmenné zkratky pro časté hodnoty:

- `n` → NULL (u nullable sloupců)
- `t` → true (u boolean sloupců)
- `f` → false (u boolean sloupců)
- `d` → DEFAULT (vložení výchozí hodnoty sloupce)

Zkratky fungují pouze když je buňka prázdná nebo když uživatel stiskne speciální klávesu (např. Ctrl+písmeno), aby nedocházelo ke kolizi s normálním psaním.

## Acceptance Criteria

- [ ] V editačním režimu buňky fungují klávesové zkratky pro NULL, true, false, DEFAULT
- [ ] Zkratky nesmí kolidovat s normálním textovým vstupem
- [ ] Vizuální indikace nastavené speciální hodnoty (NULL, DEFAULT odlišeny od běžného textu)
- [ ] Funguje v inline editaci i v Row Detail dialogu

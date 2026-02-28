# DOTAZ-001: Inicializace Electrobun projektu pro Dotaz

**Phase**: 0 — Project Setup
**Type**: backend
**Dependencies**: none

## Popis

Přizpůsobení existujícího Electrobun solid template pro Dotaz. Přejmenování app na "Dotaz" v electrobun.config.ts, package.json, index.html. Vytvoření adresářové struktury:

- `src/shared/types/`
- `src/bun/db/`
- `src/bun/services/`
- `src/bun/storage/`
- `src/mainview/lib/`
- `src/mainview/stores/`
- `src/mainview/components/` se všemi podadresáři dle architektury:
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

Přidání závislostí do package.json: @tanstack/solid-virtual, codemirror, @codemirror/lang-sql, @codemirror/view, @codemirror/state.

Úprava window title v src/bun/index.ts na "Dotaz". Nastavení window rozměrů (1280x800).

## Soubory

- `electrobun.config.ts` — přejmenování app na "Dotaz"
- `package.json` — přejmenování, přidání závislostí (@tanstack/solid-virtual, codemirror, @codemirror/lang-sql, @codemirror/view, @codemirror/state)
- `src/bun/index.ts` — úprava window title na "Dotaz", nastavení rozměrů 1280x800
- `src/mainview/index.html` — úprava `<title>` na "Dotaz"
- nové adresáře — vytvoření kompletní adresářové struktury dle ARCHITECTURE.md

## Akceptační kritéria

- [ ] Aplikace se spustí pod názvem "Dotaz"
- [ ] Adresářová struktura odpovídá ARCHITECTURE.md
- [ ] Všechny závislosti jsou v package.json
- [ ] `bun install` proběhne bez chyb

# DOTAZ-016: Context menu pro connections

**Phase**: 2 — Connection Management
**Type**: frontend
**Dependencies**: [DOTAZ-015]

## Popis

Implementace ContextMenu komponenty v `src/mainview/components/common/ContextMenu.tsx`. Generická kontextová menu komponenta:

- Otevře se na pozici kliknutí (right-click)
- Zavře se při kliknutí mimo
- Support pro separátory a disabled položky

Integrace s ConnectionTree:

- Pravý klik na connection → Connect/Disconnect, Edit, Duplicate, Delete (s potvrzovacím dialogem)
- Pravý klik na tabulku → Open Data, New SQL Console (pro tuto connection), View Schema
- Pravý klik na schema → New SQL Console

Akce volají příslušné store metody (connections store, tabs store).

## Soubory

- `src/mainview/components/common/ContextMenu.tsx` — generická kontextová menu komponenta s pozicováním, separátory a disabled položkami
- `src/mainview/components/connection/ConnectionTree.tsx` — rozšíření o context menu na right-click pro connections, schemas a tables

## Akceptační kritéria

- [ ] Kontextové menu se otevře na right-click na správné pozici
- [ ] Zavře se při kliknutí mimo menu
- [ ] Akce pro connections fungují (connect, disconnect, edit, delete)
- [ ] Akce pro tables fungují (open data, new console, view schema)
- [ ] Menu je správně pozicované i u okrajů okna (nepadá mimo viewport)

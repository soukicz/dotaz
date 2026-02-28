# DOTAZ-009: Frontend RPC klient (Electroview)

**Phase**: 1 — Foundation
**Type**: frontend
**Dependencies**: [DOTAZ-008, DOTAZ-003]

## Popis

Vytvoření frontend RPC wrapper v src/mainview/lib/rpc.ts. Wrapper kolem Electrobun Electroview RPC API, který poskytuje typované volání backendu. Import z "electrobun/webview" (Electroview API). Vytvoření funkcí pro každou skupinu RPC metod (connections, schema, data, query, tx, export, history, views, settings, system). Každá funkce wrappuje RPC volání s error handling — chyby se transformují na user-friendly zprávy. Export jako singleton objekt `rpc` s namespace přístupem: rpc.connections.list(), rpc.schema.getTables(), atd. Typy importované z src/shared/types/.

## Soubory

- `src/mainview/lib/rpc.ts` — RPC klient s typovanými metodami pro všechny skupiny (connections, schema, data, query, tx, export, history, views, settings, system)

## Akceptační kritéria

- [ ] RPC klient je typově bezpečný
- [ ] Odpovídá RPC schema z shared types
- [ ] Chyby jsou zachyceny a transformovány na user-friendly zprávy
- [ ] Volání backendu funguje end-to-end
- [ ] Export jako jednoduchý import pro komponenty a stores

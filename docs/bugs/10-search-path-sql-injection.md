# searchPath is interpolated directly into SQL

**Severity:** Medium
**Files:** `src/backend-shared/services/query-executor.ts:151`

## Description

The `searchPath` value from RPC request payload is interpolated directly into the SQL string without sanitization or quoting.

```typescript
await driver.execute(`SET search_path TO ${searchPath}`, undefined, effectiveSessionId)
```

`searchPath` comes from the RPC request payload (`src/backend-shared/rpc/handlers.ts:104`). In web mode, this value comes from WebSocket messages.

## Scenario

A malicious client sends a crafted `searchPath` value:

```
public; DROP TABLE users; --
```

This would result in:

```sql
SET search_path TO public; DROP TABLE users; --
```

## Current mitigation

In desktop mode, the RPC payload comes from the local webview (lower risk). In web mode with network-exposed WebSocket, this is a real injection vector.

## Proposed fix

Quote each schema name:

```typescript
const quoted = searchPath
    .split(',')
    .map(s => driver.quoteIdentifier(s.trim()))
    .join(', ')
await driver.execute(`SET search_path TO ${quoted}`, undefined, effectiveSessionId)
```

## Triage Result

**Status:** FIXED

Code confirmed: `searchPath` is interpolated directly: `` `SET search_path TO ${searchPath}` ``. It flows from RPC handler (handlers.ts:104) without validation. `quoteIdentifier()` exists on all drivers but is not used for searchPath. In desktop mode, risk is lower (local webview). In web mode with network WebSocket, this is a real injection vector.

**Fix:** Each schema name in the comma-separated `searchPath` is now quoted via `driver.quoteIdentifier()` before interpolation, in both `executeQuery()` and `explainQuery()` methods.

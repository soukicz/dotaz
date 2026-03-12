# poolActiveQuery race condition loses cancel capability

**Severity:** Medium
**Drivers:** PostgreSQL, MySQL
**Files:** `src/backend-shared/drivers/postgres-driver.ts:226-231`, `src/backend-shared/drivers/mysql-driver.ts:208-213`

## Description

`poolActiveQuery` is a single reference. Two concurrent pool-level queries overwrite each other's reference, making the first query uncancellable.

```typescript
const query = conn.unsafe(sql, params ?? [])
if (session) {
    session.activeQuery = query
} else {
    this.poolActiveQuery = query  // single slot, last-write-wins
}
```

## Scenario

1. Query A starts on pool -> `poolActiveQuery = queryA`
2. Query B starts on pool -> `poolActiveQuery = queryB` (queryA's ref lost)
3. `cancel()` called -> cancels queryB, queryA is uncancellable

Pool-level queries are used by health checks (`SELECT 1`), schema loads, and `executeQuery` without a session. In practice, most user-facing queries go through sessions, limiting impact.

## Proposed fix

Use a Map keyed by query ID or track multiple active queries:

```typescript
private poolActiveQueries = new Map<symbol, ReturnType<SQL['unsafe']>>()

async execute(sql: string, params?: unknown[], sessionId?: string): Promise<QueryResult> {
    const queryKey = Symbol()
    // ...
    this.poolActiveQueries.set(queryKey, query)
    try {
        // ...
    } finally {
        this.poolActiveQueries.delete(queryKey)
    }
}

async cancel(sessionId?: string): Promise<void> {
    if (!sessionId) {
        for (const q of this.poolActiveQueries.values()) {
            q.cancel()
        }
        this.poolActiveQueries.clear()
    }
}
```

## Triage Result

**Status:** FIXED

Replaced single `poolActiveQuery` slot with `poolActiveQueries = new Map<symbol, ...>()` in both PostgreSQL and MySQL drivers. Each pool-level query gets a unique Symbol key, so concurrent queries no longer overwrite each other. `cancel()` without sessionId now iterates all tracked pool queries.

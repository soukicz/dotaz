# SessionManager sessions become stale after auto-reconnect

**Severity:** High
**Files:** `src/backend-shared/services/connection-manager.ts:544-546`, `src/backend-shared/services/session-manager.ts:111-113`

## Description

After auto-reconnect, a fresh driver is created with no reserved sessions. `SessionManager` still has entries referencing the old (now dead) sessions. `SessionManager.handleConnectionLost()` exists to clean this up, but it is never wired to `ConnectionManager`'s status change events.

```typescript
// connection-manager.ts — attemptReconnect():
const driver = createDriver(config)
await driver.connect(config)
const driverMap = new Map<string, DatabaseDriver>()
driverMap.set(defaultDb, driver)
this.drivers.set(connectionId, driverMap)  // brand-new driver, zero sessions
```

```typescript
// session-manager.ts — exists but never called:
handleConnectionLost(connectionId: string): void {
    this.sessions.delete(connectionId)
}
```

## Scenario

1. User has a pinned session with an active transaction
2. Connection drops — auto-reconnect kicks in
3. New driver is created with no sessions
4. SessionManager still lists the old session as active in the UI
5. User tries to query on their session -> `"Session not found"` error

## Proposed fix

Wire the listener in `rpc-handlers.ts` (or wherever SessionManager is created):

```typescript
cm.onStatusChanged((event) => {
    if (event.state === 'disconnected' || event.state === 'reconnecting') {
        sessionManager.handleConnectionLost(event.connectionId)
    }
})
```

## Triage Result

**Status:** PARTIALLY VALID — Medium

The bug report says `handleConnectionLost()` is "never wired" — this is **incorrect**. It IS wired in both `backend-desktop/index.ts:205-222` and `backend-web/session.ts:83-109`, triggered on `state === 'disconnected' || state === 'error'`. The health check failure does transition through `'disconnected'` first (line 463), which triggers cleanup.

**The real issue** is more subtle: sessions are deleted on disconnect but never reconstructed after successful reconnect. The frontend still holds stale sessionIds that are now invalid. The user sees "Session not found" errors and must manually recreate sessions.

## Resolution

**Status:** FIXED (commit 33504e8)

`handleConnectionLost()` now saves session metadata (database, label) into `pendingRestore` before clearing sessions. New `handleConnectionRestored()` method recreates sessions from saved specs on the new driver after reconnect succeeds.

Both `backend-desktop/index.ts` and `backend-web/session.ts` status listeners now call `handleConnectionRestored()` on `state === 'connected'` and emit `session.changed` to the frontend with the restored sessions. The frontend's existing `handleSessionChanged()` handler picks them up automatically.

Tab-session bindings are not preserved (transactions are lost on reconnect anyway), but sessions themselves reappear in the UI without manual recreation.

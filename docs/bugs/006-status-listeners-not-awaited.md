# Status change listeners invoked synchronously, not awaited

**Severity**: Medium

## Description

`setConnectionState` calls listeners in a sync loop, discarding any returned promises. Listeners that need to do async work (like session restoration) run concurrently with subsequent operations without coordination.

## Code path

`src/backend-shared/services/connection-manager.ts:694-697`

```typescript
private setConnectionState(connectionId, state, ...): void {
    this.states.set(connectionId, { state, error })
    for (const listener of this.listeners) {
        listener({ connectionId, state, ... })  // return value (Promise) is discarded
    }
}
```

`StatusChangeListener` is typed as `(event: StatusChangeEvent) => void` — returned promises are silently dropped.

## Scenario

1. Connection drops
2. `disconnectAllDrivers()` runs
3. `setConnectionState('disconnected')` fires — listener starts async session cleanup
4. `startAutoReconnect()` starts immediately
5. Reconnect succeeds and creates new drivers while the old listener's async cleanup is still running
6. Cleanup operates on stale driver references

## Impact

Race between cleanup and reconnect. Could lead to stale references or incorrect session state after reconnection.

## Suggested fix

Make `setConnectionState` async, collect listener promises, and await them before proceeding with subsequent operations.

## Resolution

**Status**: Fixed

- `StatusChangeListener` type changed to `(event: StatusChangeEvent) => void | Promise<void>`
- `setConnectionState` made async — collects listener results via `Promise.allSettled` before returning
- All 8 call sites updated to `await this.setConnectionState(...)`
- Test listener callbacks fixed to not leak `Array.push()` return value into the new type

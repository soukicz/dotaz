# DOTAZ-107: Web streaming and session tests

**Phase**: 14 — Robustness & Tech Debt II
**Type**: backend
**Dependencies**: DOTAZ-102

## Description

The web server (`src/backend-web/server.ts`) has ~430 lines of untested code covering token registry, HTTP stream endpoints, session lifecycle, and WebSocket RPC dispatch. This is a critical code path for web mode that should have test coverage.

### Test scope

1. **Token registry** — `createStreamToken()` creates valid tokens, `consumeStreamToken()` returns entry and deletes token (one-time use), expired tokens are rejected, wrong-type tokens are rejected
2. **Session lifecycle** — `createSession()` initializes all fields, `destroySession()` cleans up connections, `maybeDestroySession()` with active streams defers cleanup (includes TTL from DOTAZ-102), `releaseStream()` triggers destroy when last stream completes and WS is gone
3. **RPC dispatch** — valid method calls return results, unknown methods return error, handler exceptions serialized with error code

### Approach

Extract testable functions from `server.ts` into a separate module (e.g. `src/backend-web/session.ts`) to test without starting a real HTTP server. The server file imports and wires them. Token registry functions are already pure and easily testable.

## Files

- `src/backend-web/session.ts` — extract session management and token registry functions
- `src/backend-web/server.ts` — import from session.ts, keep only Bun.serve wiring
- `tests/web-session.test.ts` — tests for token registry, session lifecycle, stream reference counting

## Acceptance Criteria

- [ ] Token create/consume/expire logic has unit tests
- [ ] One-time token consumption verified
- [ ] Wrong-type token rejection verified
- [ ] Session creation and destruction tested
- [ ] Deferred session cleanup (active streams) tested
- [ ] Session TTL enforcement tested (from DOTAZ-102)
- [ ] `releaseStream()` triggers destroy when appropriate
- [ ] `bunx tsc --noEmit` passes
- [ ] All tests pass

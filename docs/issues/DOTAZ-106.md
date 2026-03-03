# DOTAZ-106: CSV parser memory protection

**Phase**: 14 — Robustness & Tech Debt II
**Type**: backend
**Dependencies**: none

## Description

The streaming CSV parser (`csv-stream-parser.ts`) accumulates data in a string `buffer` that grows with each chunk from the ReadableStream. The buffer is compacted after rows are extracted, but if the input contains an extremely long field (e.g. a multi-megabyte quoted value without a closing quote, or a malformed file), the buffer grows without bound and can exhaust memory.

### Implementation

Add a `MAX_BUFFER_SIZE` constant (e.g. 64 MB). After each `reader.read()`, if `buffer.length` exceeds the limit, throw an error with a descriptive message ("CSV parsing failed: buffer size exceeded 64MB — possible malformed input or extremely large field").

This protects all three modes (desktop, web, demo) from memory exhaustion on malformed CSV input.

## Files

- `src/backend-shared/services/csv-stream-parser.ts` — add `MAX_BUFFER_SIZE` check after buffer append
- `tests/csv-stream-parser.test.ts` — test that oversized input throws an error

## Acceptance Criteria

- [ ] `MAX_BUFFER_SIZE` constant defined (64 MB default)
- [ ] Parser throws descriptive error when buffer exceeds limit
- [ ] Normal CSV parsing unaffected (buffer compacts below limit)
- [ ] Test verifies oversized input is rejected
- [ ] `bunx tsc --noEmit` passes
- [ ] All tests pass

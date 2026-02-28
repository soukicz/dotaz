# DOTAZ-048: Error handling + toast notifications

**Phase**: 7 — Polish
**Type**: frontend
**Dependencies**: [DOTAZ-003]

## Description

Implementation of global error handling and toast notification system. Toast.tsx in src/mainview/components/common/Toast.tsx — toast notifications in bottom right corner. Types: success (green), error (red), warning (yellow), info (blue). Auto-dismiss after 5s (or persistent for errors). Dismiss button. Stack — multiple toasts are displayed one on top of another. UI store extension in src/mainview/stores/ui.ts: addToast(type, message, options?), removeToast(id). Global error handler: catching unhandled errors from RPC calls. Instead of crash → display error toast with user-friendly message. DB connection errors: specific messages ("Connection refused", "Authentication failed", "Database not found"). Query errors: display SQL error message.

## Files

- `src/mainview/components/common/Toast.tsx` — toast component, stack layout, auto-dismiss, dismiss button
- `src/mainview/stores/ui.ts` — addToast(type, message, options?), removeToast(id), toast state management
- `src/mainview/lib/rpc.ts` — error handling wrapper for RPC calls, mapping DB errors to user-friendly messages

## Acceptance Criteria

- [ ] Toast notifications display in correct colors by type
- [ ] Auto-dismiss after 5s (errors are persistent)
- [ ] Stack of multiple toasts works
- [ ] RPC errors display as error toast
- [ ] DB errors have specific user-friendly messages
- [ ] Application does not crash on unhandled errors

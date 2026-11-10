# RBF-SEC-RECON-14 — Temporary IndexedDB with Server-Enforced Recovery Expiry
Date: 2026-11-10
Owner: MOHAMED.K_ROBY
Founder decision: A — APPROVED
Status: Design decision only; NOT_IMPLEMENTED / NOT_TESTED / NOT_RELEASED

## Decision
The client may temporarily persist its non-extractable Web Crypto recovery CryptoKey in IndexedDB so that the same login-attempt recovery proof can survive a page reload or brief interruption where browser support and storage persistence permit. The server independently enforces the recovery validity window, binding and current Doctor-session authority; local cleanup is supplementary defense, never the source of authorization.

## Security requirements and limits
- The key remains non-extractable. No raw private-key export, log, URL, audit event, or server-side private-key storage.
- Server expiration, supersession, revocation and bounded retry decisions remain authoritative even if IndexedDB retains the key.
- Local cleanup is required after confirmed recovery, expiry, cancellation or supersession where observable; cleanup failure cannot extend server authority.
- Browser IndexedDB availability, eviction, private browsing, cross-tab concurrency and crash recovery are environment-dependent and require testing. No guaranteed recovery after device data loss.
- Use secure context and same-origin controls. Non-extractable keys do not eliminate same-origin script compromise risk.
- A finite server TTL is mandatory; exact duration, challenge protocol, key record identifier, local retention policy, secure recovery credential delivery, race handling, retry limits and audit details remain OPEN.
- Preserve RECON-01–13, historical auth tests and G04 deferral unchanged. No Nurse policy change inferred.

## Next founder decision
RECON-15: Select server-side recovery window duration and the point from which expiry is measured.

## Handoff
Documentation-only GitHub checkpoint; no auth runtime edits, migration, PostgreSQL startup, Termux handoff, merge, deployment or clinical release.

MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

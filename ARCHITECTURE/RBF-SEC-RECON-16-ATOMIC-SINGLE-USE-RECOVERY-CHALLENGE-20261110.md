# RBF-SEC-RECON-16 — Atomic Single-Use Recovery Challenge
Date: 2026-11-10
Owner: MOHAMED.K_ROBY
Founder decision: A — APPROVED
Status: DESIGN ONLY; NOT_IMPLEMENTED / NOT_TESTED / NOT_RELEASED

## Decision
Every Doctor same-session recovery challenge must be fresh, unpredictable, purpose-bound and short-lived. A valid challenge is consumed at most once by an atomic server-side operation. The server must validate the asymmetric signature, original login-operation binding, committed session identity, current Doctor authority, challenge validity, and five-minute overall recovery deadline before authorizing recovery. Concurrent submissions of the same challenge cannot both succeed.

## Transactional and replay boundaries
- Challenge consumption and successful recovery authorization must share an effective atomic/serialized boundary; do not mark success if validation fails or the transaction rolls back.
- A challenge is not a bearer authorization credential by itself. A valid signature is required and is bound to the precise challenge context.
- A used, expired, invalid, cross-operation or cross-session challenge cannot be replayed.
- Consuming one challenge does not itself terminate the original five-minute recovery window. New challenges for the SAME login attempt may be issued only while the original session is currently authorized and the recovery deadline remains open, subject to limits decided later.
- A recovery operation must not create a second Doctor session, new handover, or restoration of superseded authority.
- Challenge duration, challenge issuance and persistence protocol, retries, limits, failed-attempt semantics, concurrency handling across processes, and credential recovery/delivery remain NOT_YET_ESTABLISHED.
- Preserve RECON-01–15, historical auth tests, and G04 deferral. Nurse policy unchanged by inference.

## Next founder decision
RECON-17: Choose maximum lifetime for an individual recovery challenge, independently of the five-minute overall recovery window.

## Handoff boundary
GitHub documentation only. No runtime auth changes, PostgreSQL startup/migration, Termux handoff, merge, deployment or clinical release.

MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

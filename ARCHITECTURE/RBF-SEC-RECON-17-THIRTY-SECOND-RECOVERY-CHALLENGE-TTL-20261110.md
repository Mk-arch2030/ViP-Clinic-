# RBF-SEC-RECON-17 — Thirty-Second Recovery Challenge TTL
Date: 2026-11-10
Owner: MOHAMED.K_ROBY
Founder decision: A — APPROVED
Status: DESIGN ONLY; NOT_IMPLEMENTED / NOT_TESTED / NOT_RELEASED

## Decision
Each individual Doctor same-session recovery challenge expires at the earlier of (a) 30 seconds after its server-side issuance and (b) the original five-minute recovery deadline measured from the committed login handover under RECON-15. The server clock is authoritative. Re-sending, re-reading, or attempting the same challenge does not refresh its expiry.

## Mandatory boundaries
- Each challenge is unpredictable, operation/session/purpose-bound, and single-use under RECON-16.
- At or after challenge expiry, deny that challenge; a late signature does not extend it.
- The original five-minute recovery window never resets or extends through challenge issuance.
- If original Doctor session is revoked, superseded, invalid or expired, recovery is denied immediately regardless of unexpired challenge.
- New challenge issuance during an otherwise valid recovery window remains subject to later-defined bounded retry/rate-limit rules.
- Server must atomically enforce one-time consumption and session authority. Exact challenge schema, issuance protocol, atomic transaction sequencing, clock/time representation, request concurrency and error codes remain NOT_YET_ESTABLISHED.
- Preserve RECON-01–16, historical auth proofs/tests, and G04 deferral. No Nurse session policy change.

## Next founder decision
RECON-18: Choose limits for recovery challenge issuance and failed proof attempts within the original five-minute recovery window.

## Handoff boundary
GitHub documentation only. No runtime auth edits, Termux handoff, PostgreSQL startup/migration, merge, deployment or clinical release.

MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

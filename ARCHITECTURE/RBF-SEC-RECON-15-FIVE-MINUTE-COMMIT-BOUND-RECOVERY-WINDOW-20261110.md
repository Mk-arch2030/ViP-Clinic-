# RBF-SEC-RECON-15 — Five-Minute Commit-Bound Recovery Window
Date: 2026-11-10
Owner: MOHAMED.K_ROBY
Founder decision: A — APPROVED
Status: DESIGN ONLY; NOT_IMPLEMENTED / NOT_TESTED / NOT_RELEASED

## Decision
The Doctor's SAME-session lost-login-response recovery capability is valid for at most FIVE MINUTES (300 seconds), measured from the successful server-side COMMIT of the original authenticated login handover. The recovery window is not measured from page opening, client clock, first recovery request, or challenge issuance. A recovery attempt cannot extend or reset this deadline.

## Mandatory authorization gates
- Server clock and committed transaction state are authoritative. Server must establish and persist a reliable commit-bound start time; the precise database technique and handling of commit-timestamp uncertainty are NOT_YET_ESTABLISHED.
- A recovery request must satisfy all RECON-01–14 constraints, including device possession proof, challenge replay resistance, operation/session binding, and Doctor authority.
- Expired, revoked, superseded or otherwise invalid original session => immediate DENY even within five minutes.
- At or beyond the five-minute expiry boundary, DENY; never issue a fresh Doctor authority as a side effect of recovery.
- Local IndexedDB cleanup is best effort and cannot prolong server authorization.
- Clock skew, transaction duration, recovery concurrency, exact challenge TTL, rate limits, secure credential delivery and server-side audit event details remain OPEN.

## Next founder decision
RECON-16: Decide challenge validity and one-time consumption semantics for signed recovery challenges, independent of the five-minute overall window.

## Handoff
GitHub documentation only. No runtime auth changes, Termux update, PostgreSQL start/migration, merge, deployment or clinical release authorized by this record.

MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

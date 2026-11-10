# RBF-SEC-RECON-18 — Three Challenges / Three Failed Proofs
Date: 2026-11-10
Owner: MOHAMED.K_ROBY
Founder decision: A — APPROVED
Status: DESIGN ONLY; NOT_IMPLEMENTED / NOT_TESTED / NOT_RELEASED

## Decision
For each original successfully committed Doctor login attempt, the same-session lost-response recovery mechanism permits at most THREE recovery challenges issued and at most THREE failed proof-verification attempts during its original five-minute recovery window. These are separate server-authoritative limits. Reaching either limit closes recovery for that original login attempt, but does NOT itself revoke or invalidate the Doctor's otherwise-valid original committed session.

## Mandatory controls
- Enforce both counters atomically and across processes; client-side counters are never authoritative.
- No resetting limits through page reload, new challenge requests, network retries, multiple tabs, or clock manipulation.
- Challenge issuance must still satisfy current-session authority and the RECON-15 five-minute deadline.
- Each challenge has the RECON-17 thirty-second maximum TTL and RECON-16 single-use atomic consumption semantics.
- Failed proof verification must not produce a successful recovery, second session, new handover, or duplicate handover audit event.
- Reaching either limit blocks further recovery for that attempt without changing the existing Doctor session's authority. A new fully authenticated login is a distinct operation subject to existing protections and the single-session policy.
- Precise definition of what constitutes a failed proof (including malformed requests, stale challenges, concurrent races, transient server failures), whether failed proofs consume challenges, anti-enumeration, source/global rate limits, error codes, atomic audit handling, and recovery credential delivery remain NOT_YET_ESTABLISHED.
- Preserve RECON-01–17, historical three-session tests, and G04 deferral. Nurse session policy unchanged by inference.

## Next founder decision
RECON-19: Define how invalid, expired, and replayed challenge submissions affect challenge consumption and the three-failure counter, including safe handling of server errors.

## Handoff boundary
GitHub documentation only. No auth runtime edits, Termux handoff, PostgreSQL startup/migration, merge, deployment or clinical release.

MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

# RBF-SEC-RECON-01–10 — Preliminary Security Reconciliation Checkpoint
Date: 2026-11-08
Owner: MOHAMED.K_ROBY
Repository: Mk-arch2030/ViP-Clinic-
Status: FOUNDER DISCUSSION DECISIONS — NOT FINAL IMPLEMENTATION CONTRACT OR RUNTIME PROOF
Scope: Doctor-owner session authority, atomic handover, audit and lost-response recovery.
Boundary: Documentation preservation only. No auth implementation, PostgreSQL/migration, Termux operation, merge, clinical release, or deployment authorized by this checkpoint.

## Authority and historical baseline
- RBF-DOCTOR-SESSION-01: ONE Doctor-owner/Main Admin; at most ONE server-authorized Doctor session at any moment, across devices. New successful login atomically supersedes old authority; old frontend exits on revocation detection. UI-only controls are insufficient.
- RECON-07: Controlled supersession of the historical three-session cap for Doctor; preserve historical three-session tests and Stage-5G evidence unchanged. Nurse session policy is separate and NOT changed by inference.
- Source of history: CJ02-G03-M5-PRELIMINARY-CHECKPOINT-002-20261106.md, including #34/#35 reconciliation flags and #36 OPEN.
- Historical G04 Audit Behavior Decision remains DEFERRED in its original scope; do not rewrite it or infer a comprehensive clinical Audit Domain.

## Founder selections
- RECON-01 = A: A protected write from an old Doctor session may commit only if its authorized commit serializes BEFORE new login authority transfer; otherwise DENY and roll back partial clinical writes.
- RECON-02 = A: Neutral atomic serialization; neither login nor in-flight write has unconditional priority. Auth checks and protected writes must share an effective serialization boundary.
- RECON-03: Login failure before transfer commit leaves old valid authority unchanged; successful commit with lost response leaves only new session authorized. No automatic restoration.
- RECON-04 = A: Authenticated idempotent recovery of SAME committed login attempt; no new login/session/authority. Possession proof required; operation ID alone insufficient.
- RECON-05 = A: Bounded recovery retries for same login operation, subject to current authority, expiry and supersession. Retry count/TTL/proof handling NOT_YET_ESTABLISHED.
- RECON-06: Read-only contract/source review; discovered historical three-session implementation and absence of established login recovery mechanism.
- RECON-07 = A (controlled supersession): one authorized Doctor session is the target; historical three-session implementation/tests/proofs remain historically valid, not current single-session proof.
- RECON-08 = A (Fail Closed): mandatory security-audit persistence failure aborts Doctor session handover atomically; old session remains as previously authorized if still valid.
- RECON-09 = A (Atomic Core Audit): successful Doctor handover and mandatory security event must commit in ONE transaction. External notification delivery is distinct and must not reverse an already committed handover. No automatic comprehensive Audit Domain.
- RECON-10 = A (Secure Pre-Commit Recovery Binding): the new device must possess an independently secure, attempt-bound recovery proof established before login commit, so that loss of success response can recover access to the SAME committed session without minting another authority. This is a security design selection, NOT a proven token issuance, persistence or delivery mechanism.

## Required security invariants
1. AuthorizedDoctorSessions <= 1 in the server's committed/serialized authority order.
2. No protected operation may commit under a superseded Doctor session.
3. Handover and mandatory audit event have the same atomic COMMIT/ROLLBACK boundary.
4. Audit original events are immutable; corrections are append-only linked records, subject to later detailed contract.
5. Do not place raw passwords, session tokens, CSRF secrets, or recovery proofs in audit events or logs.
6. Recovery must authenticate proof possession, match the original login operation and current session, be bounded and replay-resistant, and fail after newer login supersedes that session.
7. Recovery != new login != authority transfer. A recovery retry cannot create a second successful handover event.
8. Failed/rolled-back transactions cannot be assumed to persist an audit event within their own rolled-back transaction; failure-attempt audit requires separate design.
9. Uncertain commit outcome must be resolved from server-side state, never guessed from a lost response.

## Evidence matrix — FUTURE PROOF REQUIRED (NOT EXECUTED)
AFR-01: audit insert failure -> handover rollback; prior valid authority remains.
AFR-02: committed handover + lost response -> only new session authorized.
AFR-03: repeated authenticated recovery -> same logical session; no duplicate handover.
AFR-04: later C handover -> B recovery denied.
AFR-05: old in-flight write versus handover -> only valid serialized outcomes.
AFR-06: audit contains no raw authentication secrets.
AFR-07: external delivery failure does not falsify committed handover; delivery reliability contract remains open.
AFR-08: uncertain network response -> authenticated server-state resolution, no blind replay.

## Source reconciliation / gaps
- backend/auth/auth-service.js: historical while(live.length >= 3) conflicts with target Doctor one-session rule.
- backend/auth/test-service-contract.cjs and backend/auth/postgres-proof.cjs: historical three-session proofs/tests must be preserved, not silently rewritten.
- backend/persistence/auth-repository.js: transaction and advisory-lock foundation; does not establish new policy or atomic audit proof.
- backend/persistence/auth-schema.sql: no established Doctor session generation, login-operation recovery or handover-audit storage in inspected schema.
- ARCHITECTURE/BUILD-AUTHORIZATION-G04-AUDIT-BEHAVIOR-DECISION.md: preserve unchanged, reconcile new limited security requirement prospectively.
- Exact recovery-proof issuance before commit, secure client binding/storage, loss-of-response credential retrieval, TTL, retries, concurrent recovery, event schema, failure-event auditing, and external delivery remain NOT_YET_ESTABLISHED.
- Existing M5 #34/#35 scenario reconciliation and #36 remain OPEN.
- The owner-provided Termux regression result: 359 passed, 0 failed, 0 skipped, RUN_ALL=PASS, REGRESSION_EXIT=0; historical exclusion src/services/clinic-authority-p37a.test.ts. This predates RECON-10 implementation and is NOT evidence of these new invariants.

## Handoff gate
Founder cadence: preserve decisions on GitHub; prepare Termux handoff at each completed ten-decision checkpoint, with a reviewed commit and explicit scope. This document is a PRELIMINARY checkpoint only; no automatic pull/merge/clinical release. Verify branch ancestry and device baseline before any eventual Termux update.

MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

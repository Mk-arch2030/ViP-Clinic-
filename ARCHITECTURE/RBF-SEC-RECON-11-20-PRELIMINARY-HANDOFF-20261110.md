# RBF-SEC-RECON-11–20 — Preliminary GitHub-to-Termux Documentation Handoff
Date: 2026-11-10
Owner: MOHAMED.K_ROBY
Status: TEN FOUNDER DECISIONS APPROVED; DOCUMENTATION HANDOFF PREPARATION ONLY
Repository: Mk-arch2030/ViP-Clinic-
Source branch: docs/cj02-g03-m3-preliminary-20261105
Previous Termux documentation baseline (owner-reported): ead97d0fbe79ccad80385be749f0665e2e4121e8

## Founder-approved decisions
- RECON-11 = A: Client-generated cryptographically strong recovery secret / key material before login submission.
- RECON-12 = A: Asymmetric signed challenge-response proof of private-key possession; public key bound to original authenticated attempt.
- RECON-13 = A: Prefer non-extractable Web Crypto private key and session-scoped recovery purpose, not a permanent password alternative.
- RECON-14 = A: Temporary IndexedDB CryptoKey persistence, with server-enforced expiry and best-effort local cleanup.
- RECON-15 = A: Overall recovery window <= 5 minutes from successful original login COMMIT, never extended by recovery activity.
- RECON-16 = A: Fresh, single-use challenge with atomic server-side consumption and concurrency protection.
- RECON-17 = A: Individual challenge expires after 30 seconds or at original recovery deadline, whichever comes first.
- RECON-18 = A: At most 3 issued challenges and 3 failed proofs per original attempt; hitting either cap blocks recovery but does not itself revoke original session.
- RECON-19 = A: Attribute and count verifiable security proof failures; infrastructure/uncertain transaction errors are not automatically bad proofs; unidentified requests require independent abuse controls.
- RECON-20 = A: Device-bound encrypted envelope recovers original session credentials after valid possession proof; no new session/handover; signing and encryption key purposes must remain separate.

## Immutable authority / no overclaim
This is a preliminary design checkpoint, not a final executable auth contract. Existing runtime may still permit three Doctor sessions. Historical tests are not proof of the new one-session or recovery behavior. No auth code changes, new tests, DB migrations, PostgreSQL startup, clinical release, deployment, or GitHub main merge are authorized by this checkpoint.
Preserve RECON-01–10, the historical three-session evidence, historical G04 audit deferral, and separate Nurse policy.

## Critical design gaps before implementation
Commit-time measurement accuracy; initial public-key authentication and proof-of-possession; key agreement/encryption pair selection; envelope generation and transaction binding; storage and cleanup; authenticated envelope delivery and CSRF; session credential recovery after response loss; challenge schema/locking/TTL; failure counter semantics; idempotency under lost recovery response; per-source/global abuse controls; mandatory atomic handover audit; concurrent protected writes and login handover; database proof and browser compatibility. These remain OPEN and require further contracts, threat modeling and tests.

## Controlled Termux handoff sequence
1. Inspect local branch/status and HEAD read-only; do not assume the owner-reported baseline is unchanged.
2. Verify remote branch HEAD and ancestry, compare changed files and ensure documentation-only scope.
3. Fetch the documentation branch only after preflight approval; verify fetched ref equals the GitHub checkpoint commit.
4. Fast-forward only with founder approval and only if local state/ancestry/scope gates pass; no force/reset.
5. Run local regression and record exact tests, exclusions, and exit code; regression is not implementation proof.
6. Do not push origin/main, merge GitHub PR, run PostgreSQL/migration, deploy or claim clinical readiness.

## Constitution
MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

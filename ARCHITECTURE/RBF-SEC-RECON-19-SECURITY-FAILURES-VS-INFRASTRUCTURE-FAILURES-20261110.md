# RBF-SEC-RECON-19 — Security Failure Accounting vs Infrastructure Failure
Date: 2026-11-10
Owner: MOHAMED.K_ROBY
Founder decision: A — APPROVED
Status: DESIGN ONLY; NOT_IMPLEMENTED / NOT_TESTED / NOT_RELEASED

## Decision
For the RECON-18 maximum of three failed Doctor same-session recovery proofs, count verifiable security failures against the identified original login attempt: invalid signature, expired challenge, replayed challenge, or challenge-to-attempt/session binding mismatch, when the server can reliably associate and classify the submission. Do not automatically count infrastructure failures (database errors, unavailable server or uncommitted/uncertain transaction outcome) as proof failures.

## Mandatory controls
- Server-side authoritative accounting must be atomic, concurrent-safe and non-resettable by page reload, new challenge, retry, or multi-tab activity.
- For malformed or unidentified requests that cannot be reliably attributed to a particular login attempt, apply independent source/global abuse controls; do not infer an attempt ID or fabricate a per-attempt count.
- An expired/replayed challenge is never accepted, regardless of whether a counter update succeeds.
- For ambiguous commit outcomes, inspect persisted server state before retry or reporting failure/success; do not guess.
- A database failure must fail closed for authorization, but must not automatically be counted as a bad cryptographic proof. No bypass of challenge issuance limit, expiry, or single-use semantics.
- At either recovery limit, recovery closes for that original attempt without automatically revoking the original Doctor session.
- Exact ordering of failed-proof accounting and challenge consumption, handling of unsigned/malformed input, abuse throttles, audit failure behavior, HTTP responses, and credential recovery/delivery remain NOT_YET_ESTABLISHED.
- Preserve RECON-01–18, historical three-session tests and G04 deferral. No Nurse policy change inferred.

## Next founder decision
RECON-20: Select how a successful, authenticated same-session recovery returns usable session credentials without minting a new Doctor authority or exposing secrets.

## Handoff boundary
Documentation-only GitHub preservation. No runtime changes, PostgreSQL startup/migration, Termux update, merge, deployment or clinical release.

MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

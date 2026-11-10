# RBF-SEC-RECON-20 — Encrypted Original Session Credential Recovery
Date: 2026-11-10
Owner: MOHAMED.K_ROBY
Founder decision: A — APPROVED
Status: DESIGN SELECTION ONLY; NOT_IMPLEMENTED / NOT_TESTED / NOT_RELEASED

## Decision
On a successfully authenticated Doctor login, prepare a protected, device-bound encrypted recovery envelope for the ORIGINAL session credentials, linked to that login attempt and original committed Doctor session. Its availability and binding must be transactionally consistent with the successful login handover. If the success response is lost, a client proving possession of the RECON-11–14 recovery private key through the RECON-16–19 challenge-response protocol may recover the ORIGINAL session credentials, provided the original session remains the single currently authorized Doctor session and all recovery limits remain valid. Recovery is not a login and must not mint a new session, authority transfer, or duplicate handover audit event.

## Cryptographic separation and security boundaries
- Do not assume an asymmetric SIGNING key can also encrypt/decrypt. A separate purpose-bound encryption/key-agreement mechanism, appropriate key material and authenticated encryption or hybrid envelope scheme are required. Exact algorithm and envelope format remain OPEN.
- Do not persist plaintext original bearer credentials in server escrow, audit logs, application logs, URLs, or database columns.
- Encrypted payload confidentiality and integrity must be bound to the intended device/key, login operation, session identity and purpose; prevent key substitution and cross-attempt replay.
- The recovery flow must validate original committed state, current Doctor authority, the five-minute recovery deadline, challenge single-use, 30-second challenge TTL, and three-challenge/three-failed-proof caps.
- Successful recovery returns only the original credentials; no new session row, handover or security handover audit event.
- Do not treat encryption as a replacement for authenticated recovery authorization, revocation checks, or secure transport.
- How the device gets an appropriate encryption/decryption key, whether this adds a second non-extractable key pair, envelope lifecycle, deletion, replay protection, idempotent repeated recovery, server atomicity and audit records, response-loss during recovery, browser compatibility, CSRF/session token handling and error semantics remain NOT_YET_ESTABLISHED.
- Preserve historical auth behavior/proofs and G04 deferral; Nurse policy unchanged by inference.

## Handoff gate
RECON-11–20 is now founder-approved for documentation, not implementation. Prepare a separate preliminary ten-decision checkpoint with verified GitHub ancestry and an explicit Termux read-only preflight before any controlled local fast-forward. No implicit push/merge, PostgreSQL startup/migration, runtime changes, deployment or clinical release.

MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

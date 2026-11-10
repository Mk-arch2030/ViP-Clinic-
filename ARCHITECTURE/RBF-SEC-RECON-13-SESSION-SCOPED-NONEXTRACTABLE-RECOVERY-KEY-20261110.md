# RBF-SEC-RECON-13 — Non-extractable, Session-scoped Recovery Key
Date: 2026-11-10
Owner: MOHAMED.K_ROBY
Founder decision: A — APPROVED
Status: Design decision only; NOT_IMPLEMENTED / NOT_TESTED / NOT_RELEASED

## Decision
For Doctor login lost-response recovery, prefer a Web Crypto non-extractable private key, generated on the client before the login attempt, with an appropriately bounded client-side storage lifecycle and a session-scoped recovery purpose. The private key must not be exported, copied, or transferred to another device. The corresponding public key is bound to the specific authenticated login attempt and committed session, as selected by RECON-11 and RECON-12.

This recovery key is NOT a persistent alternative to Doctor password authentication. If the key is lost or unavailable, recovery fails closed and the Doctor may initiate a NEW authenticated login, subject to the single-authorized-Doctor-session policy.

## Technical qualifications and open details
- Web Crypto extractable:false prevents API-based private-key export but does NOT by itself prevent same-origin malicious JavaScript, compromised browser/device, or other runtime abuse from using the key.
- Non-extractable CryptoKey persistence and browser lifecycle behavior vary. Do not assume sessionStorage can directly store a CryptoKey; select and validate a suitable browser storage mechanism and cleanup policy in subsequent design and proof.
- A session-scoped recovery window is a purpose/lifetime restriction, NOT a guarantee that the key survives a lost response, tab closure, process termination, or device crash. Recovery after such events is not promised.
- Do not persist raw private keys in server storage, logs, audit events, URLs, or plaintext export artifacts.
- Exact browser APIs, secure context requirement, IndexedDB or other storage decision, TTL, garbage collection, revocation/supersession, multi-tab behavior, cross-device limitations, and recovery of usable session credentials remain NOT_YET_ESTABLISHED.
- Server must independently verify the current committed Doctor authority before any recovery succeeds. No recovery creates a new session or handover.
- Preserve historical three-session tests and G04 deferral. No Nurse session policy change by inference.

## Next founder decision
RECON-14: Define recovery key survival and storage boundary for a lost login response, balancing temporary persistence against cleanup and multi-tab security.

## Preservation
GitHub documentation-only checkpoint. No auth implementation, migration, PostgreSQL startup, Termux handoff, merge, deployment or clinical release.

MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

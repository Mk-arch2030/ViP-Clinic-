# RBF-SEC-RECON-12 — Asymmetric Recovery Possession Proof
Date: 2026-11-10
Owner: MOHAMED.K_ROBY
Decision: A — APPROVED BY FOUNDER
Status: Design selection only; NOT_IMPLEMENTED / NOT_TESTED / NOT_CLINICALLY_RELEASED

## Decision
Doctor login recovery uses asymmetric challenge-response. Before login submission, the client creates a cryptographic key pair and retains control of its private key; the server receives and binds the corresponding public key to the specific login attempt and, only upon successful authenticated login, to the committed session. A recovery request must prove private-key possession by signing a fresh server challenge. The server verifies the signature, challenge validity, operation binding, actor/session association, and continued current Doctor authority. Possession of an operation identifier or public key alone does not authorize recovery.

## Security boundaries
- Private keys must not be transmitted to the server or logged; the public key is not an authentication credential by itself.
- Challenge must be unpredictable, short-lived, single-use or otherwise strictly replay-resistant, and bound to the intended operation, session and recovery purpose. The exact protocol remains OPEN.
- No recovery may create another session, replay a successful handover, revive superseded Doctor authority or bypass audit requirements.
- Recovery requires server-side verification of committed login state and the currently authorized Doctor session; fail closed if superseded, expired, revoked or uncertain.
- Public-key registration must be authenticated by the login operation; do not accept unauthenticated key substitution.
- Key generation algorithm, supported device APIs, private-key storage, proof of key possession at initial binding, cross-tab/device threat model, server challenge state, TTL, retry limits, session-credential recovery/delivery and transactional audit remain NOT_YET_ESTABLISHED.
- Preserve RECON-01–11, historical three-session tests and G04 deferral unchanged. Nurse session policy remains separate.

## Next founder decision
RECON-13: Choose device-side private-key protection and lifecycle policy, accounting for browser/mobile limitations and loss of device state.

## Handoff boundary
Founder cadence: GitHub first; controlled Termux handoff after ten completed founder decisions. This commit is documentation only, not authorization for runtime changes, merge, PostgreSQL startup, migration, deployment or clinical release.

MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

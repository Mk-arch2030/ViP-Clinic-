# RBF-SEC-RECON-11 — Client-Generated Recovery Secret
Date: 2026-11-10
Owner: MOHAMED.K_ROBY
Decision: A — APPROVED BY FOUNDER
Status: Design selection only; NOT_IMPLEMENTED / NOT_TESTED / NOT_CLINICALLY_RELEASED

## Decision
For the Doctor login lost-response recovery flow, the client device generates a cryptographically strong recovery secret BEFORE submitting the login attempt. The server binds an appropriate proof of possession to that particular attempt, with successful login and the server-side recovery binding committed atomically. The recovery capability is valid only for the SAME committed session and only while that session remains the currently authorized Doctor session. The operation identifier alone never grants recovery.

## Guardrails
- Never expose or persist the raw recovery secret in audit events, logs, URLs, or plaintext server-side database columns.
- Bind the proof to the specific login attempt, Doctor actor, and committed session; no cross-attempt use or transfer of authority.
- No recovery operation may create another Doctor session, generate a new handover, or revive a superseded session.
- Server must verify possession securely, enforce bounded expiry/retries and replay protection, and fail closed on invalid or expired evidence.
- Avoid assuming that merely sending a SHA-256 hash of the secret establishes proof-of-possession: a static bearer-equivalent hash may be replayable. Protocol details remain OPEN.
- Exact proof protocol, secret storage lifecycle, loss-of-response delivery of usable session credentials, anti-replay challenge, concurrency, TTL, retry limits and error handling are NOT_YET_ESTABLISHED.
- Preserve historical G04 deferral, existing auth code/tests and RECON-01–10 checkpoint unchanged. Nurse session policy remains separate.

## Next founder decision
RECON-12: Choose how to establish secure possession proof without making the stored verifier a reusable bearer credential.

## Handoff
Founder cadence: GitHub first, batch ten completed decisions before controlled Termux handoff. No GitHub main merge/push, PostgreSQL startup, migrations, clinical release or deployment authorized by this documentation action.

MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

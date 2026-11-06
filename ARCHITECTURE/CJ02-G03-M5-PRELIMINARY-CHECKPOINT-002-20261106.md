# CJ02-G03-M5 — Preliminary Founder Discussion Checkpoint 002 (Exceptional Early)
Date: 2026-11-06
Owner: MOHAMED.K_ROBY
Repository: Mk-arch2030/ViP-Clinic-
Scope: Founder selections #27–#35, newly approved Single Active Doctor Session policy, and reconciliation flags for #34–#35. #36 remains OPEN.
Status: PRELIMINARY DISCUSSION PRESERVATION — NOT FINAL CONTRACT / NOT IMPLEMENTATION AUTHORIZATION
Boundary: Documentation-only checkpoint. No clinical code, PostgreSQL start, migration, tests, merge, deployment, release, or Termux action authorized by this checkpoint.
Predecessor: ARCHITECTURE/CJ02-G03-M5-PRELIMINARY-CHECKPOINT-001-20261106.md (selections #01–#26). Preserve original historical text unchanged.

## Founder selections #27–#35

27 — A: Nurse self-assignment to a CLOSED Clinic Day is DENIED, even if a general self-assignment delegation remains active. No duty assignment or implicit Clinic Day reopening. Reopening is not authorized by this selection.

28 — B: Repeated denied nurse assignment attempts are rejected and security-audited individually (account identity, attempt time, operation type, denial reason), without creating duty assignments or automatically suspending the nurse account. Audit-write reliability/failure semantics require a later contract.

29 — C: Doctor-owner alone has ordinary access to the clinic's full security audit log. Nurse receives an operational denial message with safe reason, but cannot browse the security audit log, including their own audit entries. This does not settle exceptional God Admin boundaries from M4.

30 — B: Original security audit events are immutable. Doctor may append a separately linked explanatory note with actor identity, timestamp, and referenced event. Explanation does not change original denial reason or operation outcome.

31 — B: To correct an earlier Doctor explanation, append a new linked corrective note with actor, time, and reason; preserve earlier explanation and all corrections, as well as the original audit event.

32 — C: Doctor UI presents the latest approved/current interpretation while allowing review of the original event and complete chronological explanation/correction history. Current interpretation never overwrites original security event. Approval mechanics are clarified by #33.

33 — A: Successful explicit save by authorized Doctor makes the new explanation the current interpretation immediately; no separate second approval step. Failed save makes no change and no false approval. Original event/history retained.

34 — B (HISTORICAL SELECTION; REQUIRES RECONCILIATION): The original hypothetical described the same Doctor-owner saving interpretation X from device/session A and then attempting stale interpretation Y from device/session B. Founder selected conflict detection and explicit Doctor review rather than automatic last-write-wins; preserve rejected Y temporarily on screen and do not create an approved explanation. The later Single Active Doctor Session rule INVALIDATES the premise of two simultaneously authorized Doctor sessions. Do not present that scenario as permitted. General stale-version/concurrency protection may still be needed (e.g. in-flight requests or stale UI state), but precise revised contract remains OPEN.

35 — A (HISTORICAL SELECTION; SCENARIO REQUIRES RECONCILIATION): Following a conflict-rejected save, unsaved text Y may remain visible in memory on the current screen for copying/review, but is not persisted in browser localStorage/sessionStorage or server drafts; it disappears on exit/session end and cannot be guaranteed after crash. Under the new session policy, an invalidated old Doctor session must NOT retain protected access or remain in an authorized read-only session merely to show Y. Exact UX on forced logout, including whether any transient text can safely be displayed before redirect, requires later contract.

## New founder-approved architectural policy — RBF-DOCTOR-SESSION-01

Title: Single Active Doctor Session
Authority: Founder selected A after identifying that the two-active-Doctor-session premise is unacceptable for this single-Doctor-owner clinic.
- ONE Doctor-owner/Main Admin identity for the clinic, and at most ONE active authorized Doctor session at a time, including across devices.
- Upon a successful new Doctor login, the previous Doctor session's server-side authority is revoked. The new session is the sole active authorized session.
- Old session must not execute protected clinical or administrative operations. Frontend must redirect/exit to login upon detecting revocation; leaving the old session as an authorized read-only session is NOT the selected policy.
- Server-side validation is mandatory; UI-only button disabling is insufficient.
- Session transition/revocation is security-audited; exact event fields, delivery and failure semantics need detailed contract.
- Concurrent login attempts, in-flight writes, atomic transfer of session authority, race ordering and request commit checks require precise transactional design and proof.
- This policy is a preliminary founder architectural decision, NOT evidence that authentication/session code already enforces it.

## Reconciliation / non-erasure register
- #34: REQUIRES RECONCILIATION; historical B selection preserved, original two-active-session scenario superseded by RBF-DOCTOR-SESSION-01. Do not silently rewrite #34 as an implemented concurrency contract.
- #35: REQUIRES SCENARIO RECONCILIATION; historical A selection preserved. Session-only unsaved-text rule cannot override mandatory old-session revocation and logout.
- #36: NOT SELECTED; prior question about retrying Y after reviewing X is paused pending reconciliation.
- The session rule does not eliminate all stale-state or race conditions; final contracts must cover these without permitting simultaneous authorized Doctor sessions.
- Doctor-owner single active session is distinct from nurse account/duty constraints in #17–#26; no implied alteration of those earlier choices.

## Checkpoint discipline and explicit scope
- Founder approved this exceptional early checkpoint due to material architectural conflict, rather than waiting for #36.
- Founder working rule remains maximum TEN selections between checkpoints, earlier for conflict.
- This file preserves discussion decisions; contract finalization, code changes, DB migration, live database validation, clinical production release, and merge remain separately gated.
- Original checkpoint 001 must remain unchanged.

MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

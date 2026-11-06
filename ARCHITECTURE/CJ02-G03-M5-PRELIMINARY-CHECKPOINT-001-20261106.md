# CJ02-G03-M5 — Preliminary Founder Discussion Checkpoint 001
Date: 2026-11-06
Owner: MOHAMED.K_ROBY
Scope: Founder selections #01–#26 only; question #27 is OPEN and NOT included.
Status: PRELIMINARY DISCUSSION PRESERVATION — NOT FINAL CONTRACT / NOT IMPLEMENTATION AUTHORIZATION
Boundary: Documentation only. No clinical code, database migration, tests, merge, deployment, release, or Termux action authorized by this checkpoint.

## Authority and first registration
01 — A: Only the Doctor-owner issues FirstRegistrationIntent; only the Doctor creates Nurse Actor accounts and delegates permissions. Intent does not itself create a patient, Case, Visit or Clinic Day.
02 — A: Only the Doctor-owner performs the actual first patient registration after physical arrival, even if nursing staff have other delegated permissions. Doctor retains ultimate responsibility for the patient record.
03 — A: Before the first official registration, the nurse cannot create patient records, arrival records, or preparatory patient data inside ViP Clinic. Assistance outside the system remains possible.
04 — A: After first registration, the nurse may enter explicitly authorized nursing data. Every action is attributed to its actual actor; no doctor-only decisions or patient-ownership edits.

## Nursing correction and approval
05 — A: Before Doctor approval, the authorized nurse may correct nursing data they personally entered, preserving original/new values, reason, actor, and audit history.
06 — C: Once the Doctor approves data, only the Doctor may correct it; nurse may report suspected error but not change approved data.
07 — C: Preserve the historical Doctor approval; Doctor-only correction is an append-only linked addendum, not erasure or rollback of the prior approval. Distinguish corrected effective data from historical original.
08 — C: Nurse may file a documented correction report about approved measurements. Report remains open until Doctor records acceptance or rejection and closes it; accepted correction is a separate Doctor addendum.
09 — A: Revoking nurse authority blocks future protected operations, but pre-existing open correction reports persist for Doctor review; no automatic closure.
10 — A: Retain historical nurse name and immutable identifier on earlier actions, visible only to authorized users, while separately indicating current account status.
11 — A: Doctor may reactivate a prior nurse account with the same identity, but no automatic restoration of old permissions or sessions.
12 — A: Reactivated nurse must authenticate anew; backend checks current permissions. No special additional verification step beyond the approved normal authentication is imposed solely due to reactivation.

## Revocation and rejected writes
13 — A: Revoking a specific nurse permission takes effect for new protected operations without necessarily ending the session for unrelated permissions. Check current authority at the write-commit boundary.
14 — A: A save attempted after revocation is rejected without creating a measurement, pending approval request, or server draft.
15 — B: Rejected, unsaved nursing data may remain temporarily visible read-only for communication to the Doctor; remove on screen exit or session end. No persistent browser storage or server-side clinical/draft write.
16 — C: Doctor may either enter a rejected measurement personally or explicitly re-authorize the nurse to enter it. Actual actor is recorded. Rejected requests are not replayed or promoted automatically.

## Single-clinic day staffing and assignment
17 — A (founder clarification): One Doctor-owner per clinic; at most ONE nurse on duty at any instant of a clinic day. Multiple distinct nurse accounts may be retained across time for history. The earlier hypothetical about two concurrent nurses correcting one another was withdrawn.
18 — B: Doctor may assign the nurse; a nurse with explicit current Doctor-granted general self-assignment authority may begin their own duty when the day is open and the duty slot is vacant. Self-assignment does not grant self-delegation or replacement authority.
19 — A: Doctor alone authorizes an in-day handover from one nurse to another, preserving non-overlapping duty intervals and their actor identities. Replacement does not inherit previous nurse's permissions.
20 — B: Currently assigned nurse may end their own duty with audit time and actor; cannot end another person's duty or assign a replacement. Ending duty does not disable account or revoke general permissions.
21 — A: Doctor may immediately terminate current nurse duty without nurse approval, with documented reason, actor and time. New duty-dependent operations are denied; in-flight writes must revalidate at commit.
22 — B: When duty ends while nursing data is unsaved, allow temporary read-only display for communication, then discard on screen exit/session end. No server draft or clinical write; backend rejects post-termination save.
23 — A: Doctor-only Clinic Day closure ends any active nurse duty as one atomic operation, with audit history and no partial closure. Closing Clinic Day does not close a patient's Case.
24 — A (conditional): IF a separate contract later authorizes Clinic Day reopening, reopening does not automatically restore a prior ended nurse duty. A new assignment is needed or the day may remain without a nurse. This selection does NOT authorize the reopening feature itself.
25 — A: Only the Doctor opens a Clinic Day. Opening does not implicitly create a patient, Case or Visit; nurse duty may begin only after day opening.
26 — A: Nurse cannot start duty before Doctor opens the Clinic Day, even if nurse holds general self-assignment authority. Unauthorized attempt creates no assignment.

## Reconciliation and invariant notes
- Decisions #17 and #19 mean ONE concurrent nurse, not necessarily one nurse identity for the entire calendar day. A Doctor-authorized sequential handover is allowed without overlap.
- Decisions #18 and #19 distinguish nurse self-assignment into a VACANT duty slot from Doctor-only replacement of an already assigned nurse.
- Decisions #20–#23 distinguish duty termination from account disabling, session termination, general permission revocation, and Case closure.
- Decisions #05–#08 distinguish pre-approval nurse self-correction, post-approval Doctor-only addenda, and nurse-initiated review reports.
- Decisions #13–#16 and #21–#22 require server-side current-authorization checks at commit; exact transactional locking, concurrency ordering and tests remain to be specified in contracts.
- #24 is conditional only. Whether Clinic Day reopening exists, its permitted circumstances, and its exact authorization contract remain OPEN.
- #27 (nurse attempting self-assignment on a closed Clinic Day) has been asked but NOT selected and is excluded from this checkpoint. Existing decisions imply constraints, but no founder selection #27 is claimed.

## Checkpoint discipline — founder-approved working rule
- At most TEN founder selections between documentation checkpoints; earlier if material ambiguity/conflict appears.
- Verify numbering, exact selections, conditions, exceptions and cross-decision consistency.
- Preserve via documentation-only Git commit and verify the committed content and changed-file scope.
- This 26-selection batch is an explicitly acknowledged exceptional catch-up checkpoint.
- Documentation preservation is not a finalized contract, implementation permission, clinical validation, or release authorization.

## Open implementation questions
Atomic transaction boundaries, authorization/assignment locking, audit schema, clinical approval/addendum semantics, session behavior, screen-state handling, timezone and Clinic Day lifecycle details need separate detailed contracts and proof.

MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

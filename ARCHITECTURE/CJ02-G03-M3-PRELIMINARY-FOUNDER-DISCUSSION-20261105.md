# CJ02-G03-M3 — Preliminary Founder Discussion Checkpoint
Date: 2026-11-05
Status: DISCUSSION CHECKPOINT / NOT FINAL APPROVAL
Owner: MOHAMED.K_ROBY
Scope: DOCUMENTATION ONLY. No clinical implementation, migration, merge, or release.

## Authority and boundary
This manuscript records the founder's **preliminary selections**, not an approved M3 contract. It does not supersede existing approved manuscripts. M1 and M2 were approved in conversation; M3 remains OPEN. M4 (cross-Doctor authority), M5 (nurse permissions), and M6 (idempotency, receipts, concurrency) remain open. Preserve the original records and Git history.

## M3 preliminary selections (NOT FINAL)
1. Use distinct reason codes `PATIENT_CHANGED` and `PROBLEM_CHANGED`; changes to authorized patient identity or problem meaning require revocation and a new Intent, not mutation of the old Intent.
2. Permit both distinct reasons together in one atomic revocation event.
3. Permit append-only reason correction events; never mutate the original revocation, never reverse REVOKED by reason correction.
4. Each correction specifies the **complete** effective reason set, not just a delta; all prior versions remain visible.
5. Corrections require the expected latest reason revision; reject stale conflicting writes. Receipt recovery on identical retry remains M6.
6. Permit unlimited correction events subject to authorization, version checks, and audit; this does not grant unrestricted actor authority.
7. Reject a *new* correction that leaves the effective reason set unchanged, without creating an event. Set ordering is semantically irrelevant; same-operation replay is a separate M6 question.
8. Reject raw reason sets containing duplicate codes, including revocation and correction requests; no silent deduplication or partial writes.
9. Use `INTENT_NO_LONGER_REQUIRED` for a deliberate decision that the Intent is no longer needed, not as evidence of arrival, recovery, a Visit, or an automatic age-based expiry.
10. `INTENT_NO_LONGER_REQUIRED` is exclusive: it must be the only code in its effective reason set. `PATIENT_CHANGED` and `PROBLEM_CHANGED` may coexist.
11. Retain `DUPLICATE_INTENT` as a distinct reason for revoking an **existing excess Intent**; do not confuse this with idempotent replay of one issuance operation.
12. A reference to the other Intent is **optional** when using `DUPLICATE_INTENT`. If supplied, validate existence, relationship, and access; absent reference is not proof of a verified counterpart. No automatic replacement or authority inheritance.
13. Allow later addition of the reference by an independent append-only audit linkage event, without changing the revocation reasons.
14. Allow correction of an erroneous reference by a separate append-only audit event, retaining the former reference and checking authority, relationship, and expected revision.
15. When `DUPLICATE_INTENT` is removed from the effective reasons, retain all reference events historically but make the duplicate reference **inactive** as a current explanation.
16. If `DUPLICATE_INTENT` returns later, never reactivate an old reference automatically; require a new verified audit action. Because references are optional, the reason itself can be effective without an active reference.
17. Permit explicit reconfirmation of the **same latest historical corrected reference** via a new audit event after validation; identifier equality is not a no-op when the effective state changes from inactive to active.
18. Reconfirmation is limited to the **latest historically corrected reference**. Returning to an older superseded reference requires an independent reference-change event, not reconfirmation.
19. **Latest founder selection (2026-11-05):** At most **one active DUPLICATE_INTENT reference** per revoked Intent at a time; any number of historical reference events remain preserved. Zero active references is valid.

## Edge-case constraints under discussion
- A self-reference, nonexistent reference, wrong patient identity, unauthorized cross-Doctor reference, or stale revision must not create a successful link/correction.
- A reference may be historically relevant even if the referenced Intent was later consumed or revoked; do not infer current eligibility from the link.
- A corrected reason set that excludes `DUPLICATE_INTENT` cannot present a duplicate reference as currently effective.
- Never silently overwrite an earlier reference event or alter the original revocation event.
- Two concurrent reference changes must not both succeed on the same expected reference revision; precise transactional design deferred to M6.
- Identical successful operation retries recover prior receipts per M6; do not misclassify them as new no-change operations.
- Authorization across Doctors and secure denial behavior deferred to M4; audit event names, schema, time policy, registry completeness, exact revision and transaction mechanics remain UNDECIDED.
- The label `REFERENCE_LINKED`, `REFERENCE_CORRECTED`, `REFERENCE_RECONFIRMED` are illustrative, not approved schema constants.

## Explicit non-claims
- NOT M3 FINAL APPROVAL.
- NOT clinical implementation or PostgreSQL proof.
- NOT approval to merge, push clinical code, deploy, or launch.
- Git preservation documents discussion; it does not validate runtime behavior.

MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.

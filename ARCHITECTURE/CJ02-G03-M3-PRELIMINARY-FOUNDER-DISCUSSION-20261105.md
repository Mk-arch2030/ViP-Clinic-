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


20. **Latest founder preliminary selection (2026-11-05):** When a `DUPLICATE_INTENT` reference is currently active, allow its replacement (e.g., A -> C) in **one atomic audited reference-correction event**. On success, C is the sole active reference and A remains in immutable audit history; on any failure, A remains active and no partial transition or audit success occurs. This is a contractual atomicity requirement, NOT verified implementation.

### Atomic replacement edge cases (preliminary)
- Invalid, inaccessible, self-referential, or otherwise unrelated candidate C: reject the entire change, leaving A active.
- Replacing A with A is a new no-op and should be rejected without a new event; successful identical-operation retry remains governed by M6 receipt recovery.
- Competing reference replacements must not both succeed against one expected reference revision; exact transaction/locking implementation remains M6.
- If `DUPLICATE_INTENT` has been removed concurrently, the replacement must not commit against stale reason state; check current reason eligibility and relevant revisions.
- Cross-Doctor authority remains M4; event schemas and exact database proof remain open.


## M3 additional preliminary founder selections — batch checkpoint (21–33)
21. A reference target may be REVOKED or CONSUMED when linked/replaced if the historical relationship and authority are valid. Linking does not revive, transfer authority, or establish present eligibility.
22. Reject direct and indirect cycles in the **active** reference graph, including self-links; retain all historical audit events even where historical links would form a cycle.
23. Allow many-to-one inbound active references from multiple revoked source Intents to the same target, each independently verified; each source retains at most one active outbound reference.
24. Later ordinary target-status or data changes do not silently deactivate a historically valid active reference. If a factual relationship error is discovered, require explicit audited correction; never assume changed data remains valid without investigation.
25. Permit an append-only event to disable an incorrect active reference without replacement. The effective DUPLICATE_INTENT reason may remain with zero active references; source remains REVOKED.
26. Permit explicit reconfirmation of the latest disabled reference after fresh checks, with an append-only event and full LINKED -> DISABLED -> RECONFIRMED history.
27. If older A was disabled, newer C linked, and A later found correct, return to A through a **new reference-correction event**, not direct reconfirmation of superseded A. If C is active, replacement must be atomic per #20.
28. If A was disabled and no reference is active, permit directly linking newly verified C without temporarily reactivating A; append-only event and validation required.
29. Reject a new request to disable an already inactive reference as NO_OP with no new event. Identical-operation retry receipt recovery remains M6.
30. Explanation text for disabling a reference is **optional**; actor identity and timestamp are mandatory audit metadata.
31. Explanation text for reconfirming a reference is **optional**; actor identity, timestamp, relationship/authority/revision checks and audit event remain mandatory.
32. Explanation text for replacing/correcting A -> C is **optional**; old/new references, actor identity, timestamp, validations and immutable history remain mandatory.
33. Only the owning clinic Doctor acting as Main Admin & Owner may link, correct, disable, or reconfirm DUPLICATE_INTENT references in that clinic; no nursing/secretarial delegation for these operations. Cross-Doctor authority rules remain M4.

## Founder-directed checkpoint closure
The founder explicitly authorized closing the **M3 discussion round as a PRELIMINARY CHECKPOINT** and proceeding to M4. This is a documentation checkpoint only: **M3 is not finally approved**, and no implementation, clinical data write, merge, deployment, or release is authorized by it. M4 cross-Doctor authority, M5 nursing access, and M6 idempotency/concurrency/receipts remain OPEN. Doctor's operational ownership of a clinic does not erase patient privacy rights or other mandatory legal safeguards.

## Explicit non-claims
- NOT M3 FINAL APPROVAL.
- NOT clinical implementation or PostgreSQL proof.
- NOT approval to merge, push clinical code, deploy, or launch.
- Git preservation documents discussion; it does not validate runtime behavior.

MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.

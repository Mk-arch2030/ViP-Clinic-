# WORKFLOW STATE MACHINE TECHNICAL CONTRACT V1

STATUS = CONTROLLED DEFINITION
GAP = G02 — WORKFLOW STATE MACHINE
IMPLEMENTATION_AUTHORIZED = NO
CONTRACT_MUTATION = NOT PERFORMED

## 1. PURPOSE

This contract defines the technical Case workflow state machine
without implementing runtime, API, UI, or database behavior.

## 2. AUTHORITATIVE CASE STATES

The Case has exactly five workflow states:

1. Arrived — Awaiting Registration
2. Awaiting Doctor
3. With Doctor
4. Exited — Follow-up Pending
5. Completed

## 3. STATE OWNERSHIP

The workflow state belongs to the Case.

Visit state and Clinic Day closure are distinct concerns.

## 4. ESTABLISHED TRANSITION MODEL

Arrived — Awaiting Registration
→ Awaiting Doctor

Awaiting Doctor
→ With Doctor

With Doctor
→ Exited — Follow-up Pending

With Doctor
→ Completed

Exited — Follow-up Pending
→ Arrived — Awaiting Registration

## 5. COMPLETION RULE

Only the Doctor may establish Case Completion.

Nurse delegation MUST NOT establish Case Completion.

Visit Exit MUST NOT automatically establish Case Completion.

Clinic Day Closure MUST NOT automatically establish Case Completion.

## 6. TRANSITION AUTHORITY

Registration / operational progression:
- may be performed through authorized operational workflow.

Doctor Encounter:
- requires Doctor authority.

Case Completion:
- Doctor only.

Visit Exit:
- operational Visit action;
- does not complete the Case.

## 7. INVALID TRANSITIONS

A transition not explicitly defined by this contract
MUST be rejected.

Invalid transition MUST NOT mutate the Case state.

## 8. COMPLETED PROTECTION

Completed is a terminal Case state.

No workflow transition may move a Completed Case
back into an active Case state.

## 9. HISTORY PRESERVATION

A state transition MUST NOT overwrite or destroy:

- previous Visits;
- Clinical History;
- Past History;
- Case identity;
- Visit identity.

## 10. VISIT RELATIONSHIP

A Visit belongs to exactly one Case.

Visit Exit closes the operational Visit flow only.

Visit Exit does not change the Case to Completed
unless a separate Doctor Case Completion decision establishes
Completion.

## 11. CLINIC DAY RELATIONSHIP

Clinic Day Closure is independent of Case Completion.

Closing a Clinic Day MUST NOT automatically complete
an open Case.

## 12. REPLAY / DUPLICATE TRANSITIONS

A repeated transition request MUST NOT produce an unintended
additional state mutation.

The technical implementation must provide deterministic
handling of duplicate or replayed transition requests.

## 13. ATOMICITY

A valid Case state transition MUST be persisted atomically.

A failed transition MUST NOT leave a partially mutated Case state.

## 14. IMPLEMENTATION BOUNDARY

This contract does not select:

- framework;
- API route;
- HTTP method;
- database table;
- ORM;
- UI implementation;
- runtime library;
- deployment mechanism.

## 15. ARCHITECTURAL INVARIANTS

AUTHORITY_TRANSFER = NO
NEW_ACTOR = NO
NEW_PRODUCT_CAPABILITY = NO
NURSE_CASE_COMPLETION = NO
AUTOMATIC_COMPLETION_ON_VISIT_EXIT = NO
AUTOMATIC_COMPLETION_ON_CLINIC_DAY_CLOSURE = NO

IMPLEMENTATION_AUTHORIZED = NO
CONTRACT_MUTATION = NOT PERFORMED

NEXT_GATE = WORKFLOW STATE MACHINE CONTRACT RECONCILIATION AND PROOF

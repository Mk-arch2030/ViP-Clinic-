# CLINIC DAY PROTECTION TECHNICAL CONTRACT V1

STATUS = CONTROLLED DEFINITION
GAP = G03 — CLINIC DAY PROTECTION
IMPLEMENTATION_AUTHORIZED = NO

PURPOSE:
Define the technical protection boundary created by explicit Clinic Day closure.

ESTABLISHED:
- Working Date is the Clinic Day technical identity.
- Exactly one Clinic Day exists per Working Date.
- Closure is explicit and Doctor/Main Admin authorized.
- Closure does not complete an open Case.
- Open Cases may continue on later Clinic Days.
- Existing Case/Visit history remains preserved.

PROTECTION RULE:
After Clinic Day closure, the closed Clinic Day's historical
Clinic-Day-owned operational data MUST NOT be mutated through
ordinary workflow operations.

ALLOWED:
- Read preserved closed-day data according to authorization.
- Continue an open Case through a later Clinic Day.
- Create a later Visit on the later Clinic Day.
- Preserve the historical closed Clinic Day unchanged.

PROHIBITED:
- Mutation of protected closed-day historical data.
- Reopening the closed Clinic Day through ordinary workflow.
- Using Clinic Day closure as Case Completion.
- Using closure to alter Case lifecycle authority.

CONTINUITY:
A Case may remain open after Clinic Day closure.
Its later Visit belongs to a later Clinic Day and does not mutate
the protected historical Clinic Day.

FAILURE:
A prohibited post-closure mutation MUST be rejected.
Rejected mutation MUST NOT partially persist.

AUTHORIZATION:
Doctor/Main Admin retains Clinic Day closure authority.
Nurse delegation does not create authority to bypass protection.

INVARIANTS:
AUTHORITY_TRANSFER = NO
NEW_ACTOR = NO
NEW_PRODUCT_CAPABILITY = NO
CASE_COMPLETION_BY_CLOSURE = NO
AUTOMATIC_REOPEN = NO
HISTORICAL_PRESERVATION = YES
IMPLEMENTATION_AUTHORIZED = NO

NEXT_GATE = G03 CONTRACT RECONCILIATION AND PROOF

# BUILD AUTHORIZATION — G03 CLINIC DAY PROTECTION DECISION

STATUS = TECHNICAL DEFINITION DECISION
GAP = G03 — CLINIC DAY PROTECTION

EVIDENCE ESTABLISHED:
- Higher protection after Clinic Day closure is a product requirement.
- Clinic Day closure is explicit and Doctor/Main Admin authorized.
- Clinic Day closure does not complete an open Case.
- Open Cases may continue after Clinic Day closure.
- Working Date is the technical identity of Clinic Day.
- Exactly one Clinic Day exists per Working Date.
- Closure preserves existing Case/Visit data.

MUST DEFINE:
- Technical protection behavior after Clinic Day closure.
- Which mutations are prohibited after closure.
- Which read/access behavior remains permitted after closure.
- How open Cases remain operationally continuous after closure.
- Failure behavior for prohibited post-closure mutation.
- Protection boundary without transferring Doctor authority or changing Case lifecycle.

MUST NOT ASSUME:
- Automatic Case Completion.
- Automatic Visit Completion beyond existing Visit Exit semantics.
- New actor or permission.
- New product capability.
- Automatic reopening of a closed Clinic Day.
- Destructive locking or deletion of preserved data.
- Authentication/session behavior beyond G01.

INVARIANTS:
AUTHORITY_TRANSFER = NO
NEW_ACTOR = NO
NEW_PRODUCT_CAPABILITY = NO
CASE_COMPLETION_BY_CLOSURE = NO
AUTOMATIC_REOPEN = NO
IMPLEMENTATION_AUTHORIZED = NO

DECISION:
G03 REQUIRES A DEDICATED CLINIC DAY PROTECTION TECHNICAL CONTRACT.

NEXT_GATE = G03 CLINIC DAY PROTECTION TECHNICAL CONTRACT

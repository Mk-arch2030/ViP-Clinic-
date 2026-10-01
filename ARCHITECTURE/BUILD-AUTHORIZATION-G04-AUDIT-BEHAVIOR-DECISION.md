# BUILD AUTHORIZATION — G04 AUDIT BEHAVIOR DECISION

STATUS = GAP DECISION
GAP = G04 — AUDIT BEHAVIOR

EVIDENCE:
- No explicit Audit Behavior product requirement is established.
- Existing contracts do not require a dedicated Audit domain.
- No implementation requirement for audit behavior is established.
- Existing authorization, persistence, workflow, and Clinic Day
  protection invariants remain sufficient for current scope.

DECISION:
G04 REMAINS DEFERRED.

MUST NOT ASSUME:
- No new Audit capability.
- No new Audit persistence domain.
- No new actor.
- No authority transfer.
- No implementation work for Audit behavior.
- No contract mutation.

INVARIANTS:
AUTHORITY_TRANSFER = NO
NEW_ACTOR = NO
NEW_PRODUCT_CAPABILITY = NO
IMPLEMENTATION_AUTHORIZED = NO

G04_STATUS = DEFERRED
NEXT_GATE = G05 — DEPLOYMENT

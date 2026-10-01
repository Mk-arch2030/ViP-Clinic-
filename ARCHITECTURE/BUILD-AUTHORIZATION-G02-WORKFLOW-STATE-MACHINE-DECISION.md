# BUILD AUTHORIZATION — G02 WORKFLOW STATE MACHINE DECISION

STATUS = TECHNICAL DEFINITION DECISION
GAP = G02 — WORKFLOW STATE MACHINE

## ESTABLISHED EVIDENCE

The product architecture already establishes exactly five Case workflow states:

1. Arrived — Awaiting Registration
2. Awaiting Doctor
3. With Doctor
4. Exited — Follow-up Pending
5. Completed

Established invariants:

- Visit Exit is not Case Completion.
- Case Completion is not Clinic Day Closure.
- Case Completion is established only by the Doctor.
- Nurse cannot establish Case Completion.
- Clinic Day Closure does not complete the Case.
- Case Completion is represented directly on the Case.

## TECHNICAL DEFINITION REQUIRED

The workflow state machine must explicitly define:

- authoritative state owner;
- allowed states;
- allowed state transitions;
- transition triggers/events;
- actor authority for each transition;
- invalid transition behavior;
- persistence representation;
- protection of Completed state;
- relationship between Visit Exit and Case state;
- relationship between Clinic Day Closure and Case state;
- duplicate/replayed transition behavior;
- preservation of Case and Visit history.

## MUST NOT ASSUME

The technical definition must not introduce:

- additional Case states without evidence;
- automatic Case Completion on Visit Exit;
- automatic Case Completion on Clinic Day Closure;
- Nurse Case Completion authority;
- a new workflow actor;
- a new product capability;
- UI/API implementation;
- database implementation;
- runtime implementation.

## DECISION

The existing five-state Case workflow is accepted as the authoritative candidate state model.

G02 requires a dedicated Workflow State Machine Technical Contract defining transitions, ownership, triggers, protection, persistence behavior, and invalid-transition handling before implementation.

IMPLEMENTATION_AUTHORIZED = NO
CONTRACT_MUTATION = NOT PERFORMED
AUTHORITY_TRANSFER = NO
NEW_ACTOR = NO
NEW_PRODUCT_CAPABILITY = NO

NEXT_GATE = G02 WORKFLOW STATE MACHINE TECHNICAL CONTRACT DEFINITION

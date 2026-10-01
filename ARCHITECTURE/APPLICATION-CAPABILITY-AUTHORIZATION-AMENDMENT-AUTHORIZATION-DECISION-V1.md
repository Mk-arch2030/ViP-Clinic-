# DR. ROBY CLINIC — APPLICATION CAPABILITY AUTHORIZATION AMENDMENT AUTHORIZATION DECISION V1

STATUS = AMENDMENT AUTHORIZATION DECISION

IMPLEMENTATION = NOT AUTHORIZED

CONTRACT_MUTATION = NOT PERFORMED

DECISION = AUTHORIZED FOR CONTROLLED AUTHORIZATION-DECISION AMENDMENT

## PURPOSE

Authorize a controlled amendment of the existing
APPLICATION-CAPABILITY-IMPLEMENTATION-AUTHORIZATION-DECISION-V1.md
solely to reconcile its implementation scope with the already-established
and CLOSED + PROVEN APPLICATION-CAPABILITY-CONTRACT-V1.md.

## AUTHORITY BASIS

- APPLICATION_CAPABILITY_CONTRACT_V1 = CLOSED + PROVEN
- A01-A04 = CONTROLLED AMENDMENT
- A01-A04 IMPLEMENTATION_AUTHORIZED = NO
- APPLICATION_CAPABILITY_IMPLEMENTATION_AUTHORIZATION = CLOSED DECISION
- CURRENT GENERAL IMPLEMENTATION AUTHORIZATION = YES
- CURRENT AUTHORIZATION SCOPE INCLUDES A01-A04
- AUTHORIZATION SCOPE CONTRADICTION = PRESENT

## AUTHORIZED CONTROLLED AMENDMENT SCOPE

The controlled amendment may:

- reconcile the authorization decision with the authoritative
  Application Capability Contract V1;
- correct the implementation scope concerning A01-A04;
- preserve the existing Application Capability inventory;
- preserve A01-A04 exactly as already defined;
- preserve Doctor clinical authority;
- preserve Nurse delegated operational participation;
- preserve all established domain invariants;
- preserve all persistence, API, UI, authentication, authorization,
  and deployment boundaries;
- preserve all deferred decisions.

## NOT AUTHORIZED

- Application Capability implementation
- A01-A04 implementation
- Contract mutation at this stage
- Reopening A01-A04 for semantic redesign
- Adding capabilities
- Removing capabilities
- Redefining A01-A04
- Authority transfer
- New actor
- Product scope expansion
- Persistence implementation
- SQL / migration / ORM / repository implementation
- API implementation
- UI implementation
- Authentication implementation
- Authorization implementation
- Runtime implementation
- Deployment implementation

## SAFETY INVARIANTS

NEW_PRODUCT_CAPABILITY = NO

NEW_ACTOR = NO

AUTHORITY_TRANSFER = NO

UNAUTHORIZED_SCOPE_EXPANSION = NO

DEFERRED_DECISIONS_RESOLVED = NO

IMPLEMENTATION_AUTHORIZED = NO

CONTRACT_MUTATION = NOT PERFORMED

## DECISION

CONTROLLED_AUTHORIZATION_DECISION_AMENDMENT = AUTHORIZED

IMPLEMENTATION_AUTHORIZED = NO

CONTRACT_MUTATION = NOT PERFORMED

NEXT_GATE = CONTROLLED_AUTHORIZATION-DECISION MUTATION AND RECONCILIATION

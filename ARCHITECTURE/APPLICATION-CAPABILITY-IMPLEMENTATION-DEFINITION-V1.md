# DR. ROBY CLINIC — APPLICATION CAPABILITY IMPLEMENTATION DEFINITION V1

STATUS = DEFINITION DRAFT

GATE = APPLICATION CAPABILITY IMPLEMENTATION — EXCLUDING A01-A04

IMPLEMENTATION_AUTHORIZATION_SOURCE = APPLICATION-CAPABILITY-IMPLEMENTATION-AUTHORIZATION-DECISION-V1.md

APPLICATION_CAPABILITY_IMPLEMENTATION_AUTHORIZED = YES

A01-A04_IMPLEMENTATION_AUTHORIZED = NO

## 1. PURPOSE

This artifact defines the bounded implementation boundary for the already
authorized Application Capability layer.

It does not execute implementation.

It does not authorize any technical layer that is independently unauthorized.

## 2. AUTHORIZED SCOPE

Implementation may represent the already established Application Capability
inventory, excluding A01-A04.

The implementation MUST preserve:

- established Product Scope
- established Domain Model
- Patient → Case → Visit → Clinic Day
- established Actor Model
- Doctor clinical authority
- Nurse delegated operational participation
- existing Application Capability inventory
- existing closed contracts
- existing persistence boundary
- existing API boundary
- existing UI boundary
- existing Authentication boundary
- existing Authorization boundary
- all deferred decisions

## 3. EXCLUDED CAPABILITIES

A01-A04 remain implementation-excluded:

- A01 Arrival Patient Condition
- A02 Nurse Current Complaint Intake
- A03 Nurse Initial Past History Collection
- A04 Send to Doctor

No implementation behavior for these amendments may be introduced by this
gate.

## 4. TECHNICAL BOUNDARY

This definition does NOT authorize:

- SQL
- database schema mutation
- migrations
- ORM
- repositories
- API routes or payloads
- UI screens or interactions
- Authentication implementation
- Authorization implementation
- deployment
- runtime infrastructure

Technical mechanisms not already separately defined and authorized MUST NOT
be invented by this artifact.

## 5. IMPLEMENTATION PRINCIPLE

The implementation MUST represent capability semantics without silently
creating technical contracts.

No new product capability may be introduced.

No existing capability may be semantically redefined.

No actor may be added.

No authority may be transferred.

No deferred decision may be silently resolved.

## 6. DOMAIN AND AUTHORITY PRESERVATION

The implementation MUST preserve:

Patient → MANY Cases

Case → EXACTLY ONE Patient

Case → MANY Visits

Visit → EXACTLY ONE Case

Visit → EXACTLY ONE Clinic Day

Case may span multiple Clinic Days.

Previous Visits remain preserved.

Visit Exit does not complete Case.

Clinic Day Closure does not complete Case.

Doctor exclusively establishes Case Completion.

Doctor remains Clinical Authority and System Owner.

Nurse remains a Delegated Operational Participant.

## 7. SAFETY INVARIANTS

CONTRACT_MUTATION = NO

NEW_PRODUCT_CAPABILITY = NO

NEW_ACTOR = NO

AUTHORITY_TRANSFER = NO

UNAUTHORIZED_SCOPE_EXPANSION = NO

DEFERRED_DECISIONS_RESOLVED = NO

A01-A04_IMPLEMENTATION = NOT AUTHORIZED

## 8. IMPLEMENTATION STATUS

APPLICATION_CAPABILITY_IMPLEMENTATION_DEFINITION = BOUNDED

APPLICATION_CAPABILITY_IMPLEMENTATION_EXECUTION = NOT PERFORMED

RUNTIME_EXECUTION = NOT PERFORMED

API_IMPLEMENTATION = NOT PERFORMED

UI_IMPLEMENTATION = NOT PERFORMED

PERSISTENCE_IMPLEMENTATION = NOT PERFORMED

AUTHENTICATION_IMPLEMENTATION = NOT PERFORMED

AUTHORIZATION_IMPLEMENTATION = NOT PERFORMED

DEPLOYMENT = NOT PERFORMED

FAIL = 0

## 9. PROOF REQUIREMENTS

Before this definition can be treated as closed:

- complete authorized capability coverage MUST be proven
- A01-A04 exclusion MUST be proven
- domain invariants MUST be preserved
- actor authority MUST be preserved
- no unauthorized technical layer may be introduced
- no deferred decision may be resolved
- no contract mutation may occur
- no new capability may occur
- FAIL MUST = 0

## 10. NEXT GATE

NEXT GATE = CONTROLLED APPLICATION CAPABILITY IMPLEMENTATION DEFINITION
REVIEW AND PROOF

IMPLEMENTATION EXECUTION = NOT PERFORMED

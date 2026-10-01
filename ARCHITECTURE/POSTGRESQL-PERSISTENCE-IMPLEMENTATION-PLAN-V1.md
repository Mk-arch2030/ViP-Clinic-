# Dr.Roby Clinic — PostgreSQL Persistence Implementation Plan V1

DOCUMENT = POSTGRESQL PERSISTENCE IMPLEMENTATION PLAN
PRODUCT = Dr.Roby Clinic

STATUS = PLAN DRAFT

## 1. AUTHORITY

This plan is governed by:

- DATABASE-TECHNOLOGY-FACTORY-DECISION-V1
- DATABASE-TECHNOLOGY-TECHNICAL-DESIGN-V1
- DATABASE-TECHNOLOGY-TECHNICAL-DESIGN-CLOSURE-PROOF-V1
- Persistence Technical Contract Proof
- Persistence Schema Definition
- Persistence Implementation Authorization Decision
- Final Authority Map
- CPN Generation Implementation Authorization Decision
- CPN Generation Implementation Definition

## 2. IMPLEMENTATION OBJECTIVE

Implement the minimum PostgreSQL persistence foundation required for the
already-authorized Patient registration capability and authoritative CPN
generation.

The implementation must preserve all closed Product, Domain, Persistence,
Application Capability, and CPN decisions.

## 3. TECHNOLOGY

DATABASE TECHNOLOGY = PostgreSQL

Node.js application connectivity shall use the PostgreSQL ecosystem.

The minimum runtime database driver shall be selected and installed only
through the implementation execution gate.

ORM adoption is NOT required.

## 4. MINIMUM IMPLEMENTATION SURFACE

The first bounded implementation shall establish only what is necessary for:

1. PostgreSQL connectivity
2. Durable CPN allocation
3. Patient persistence
4. Patient CPN uniqueness
5. Patient technical persistence identity
6. Required Patient fields already authorized
7. Basic transactional Patient registration

No unrelated domain persistence is required for this first increment.

## 5. CPN IMPLEMENTATION

The authoritative CPN allocator shall be implemented using the PostgreSQL
sequence established by the closed technical design.

Required properties:

- sequence starts at 1
- numeric allocation
- concurrent-safe allocation
- persistence-authoritative
- no process-local counter
- CPN constructed as CPN- + allocated number
- CPN persisted with Patient identity
- unique persisted CPN
- CPN generated only for first Patient registration

## 6. PATIENT PERSISTENCE

The first Patient persistence implementation shall preserve:

- technical persistence identity
- stable CPN
- Name
- Age
- Profession
- Phone
- Gender
- Past History according to the existing authorized persistence boundary

No new Patient business meaning may be introduced.

## 7. TRANSACTION

The registration transaction shall establish the following bounded workflow:

BEGIN
→ allocate authoritative CPN
→ construct/persist Patient identity
→ COMMIT

On failure:

ROLLBACK

The implementation must not expose a partially persisted Patient identity.

Exact code structure remains an implementation concern.

## 8. SCHEMA / MIGRATION

The physical PostgreSQL schema shall be introduced through a controlled
migration mechanism.

The migration must establish only the structures required by this bounded
implementation increment.

The implementation must not silently implement the complete future
persistence model.

## 9. APPLICATION INTEGRATION

The existing:

application/services/register-new-patient.js

currently accepts a controlled CPN value for its proven test implementation.

The PostgreSQL implementation increment shall introduce the authoritative
CPN allocation path without invalidating the existing closed proof.

The transition must preserve the Patient domain as the domain authority.

## 10. TESTING REQUIREMENTS

The implementation proof must establish at minimum:

- PostgreSQL connectivity
- sequence starting at 1
- first Patient receives a CPN
- CPN format is correct
- second Patient receives a different CPN
- CPN uniqueness
- concurrent allocation does not duplicate CPN
- Patient persistence succeeds
- failed registration does not leave an invalid partial Patient
- existing domain construction remains valid
- no contract mutation
- no scope expansion
- FAIL = 0

## 11. EXISTING MOCK RUNTIME

The existing mock/test runtime remains preserved.

The first PostgreSQL implementation must not delete or rewrite the mock
adapter merely to introduce persistence.

Real persistence shall be introduced incrementally behind the appropriate
application boundary.

## 12. EXPLICIT NON-SCOPE

This plan does not authorize:

- full Clinic Day persistence
- full Case persistence
- full Visit persistence
- full clinical history persistence
- Follow-up lifecycle implementation
- attachment storage
- audit/event sourcing
- authentication
- authorization
- API expansion
- UI redesign
- deployment
- multi-branch
- multi-tenant
- Patient merge
- retention/delete mechanics
- ORM adoption unless separately authorized

## 13. EXECUTION STATUS

POSTGRESQL PACKAGE INSTALLATION = NOT PERFORMED

POSTGRESQL SERVER STARTUP = NOT PERFORMED

DATABASE CREATION = NOT PERFORMED

SCHEMA EXECUTION = NOT PERFORMED

MIGRATION EXECUTION = NOT PERFORMED

CPN SEQUENCE CREATION = NOT PERFORMED

PATIENT TABLE CREATION = NOT PERFORMED

REPOSITORY IMPLEMENTATION = NOT PERFORMED

APPLICATION INTEGRATION = NOT PERFORMED

## 14. IMPLEMENTATION GATE

This plan does not itself authorize execution.

Before implementation:

- plan review must PASS
- implementation authorization must be confirmed
- exact migration/driver/runtime boundaries must be established
- proof criteria must remain measurable

## 15. GOVERNANCE

No implementation may exceed the bounded first increment.

No existing closed decision may be reopened.

No database mechanism may be introduced outside PostgreSQL.

No ORM may be introduced merely for convenience.

No mock/test capability may be destroyed as part of this increment.

FAIL = 0

NEXT GATE = POSTGRESQL PERSISTENCE IMPLEMENTATION PLAN REVIEW

END OF POSTGRESQL PERSISTENCE IMPLEMENTATION PLAN V1

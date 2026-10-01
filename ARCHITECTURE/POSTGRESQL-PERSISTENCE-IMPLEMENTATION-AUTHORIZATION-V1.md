# Dr.Roby Clinic — PostgreSQL Persistence Implementation Authorization V1

DOCUMENT = POSTGRESQL PERSISTENCE IMPLEMENTATION AUTHORIZATION
PRODUCT = Dr.Roby Clinic

STATUS = AUTHORIZATION DECISION

## 1. AUTHORITY BASIS

This authorization is based on:

- DATABASE-TECHNOLOGY-FACTORY-DECISION-V1
- DATABASE-TECHNOLOGY-TECHNICAL-DESIGN-V1
- DATABASE-TECHNOLOGY-TECHNICAL-DESIGN-CLOSURE-PROOF-V1
- PERSISTENCE-TECHNICAL-CONTRACT-PROOF
- PERSISTENCE-SCHEMA-DEFINITION-V1
- PERSISTENCE-IMPLEMENTATION-AUTHORIZATION-DECISION-V1
- CPN-GENERATION-IMPLEMENTATION-AUTHORIZATION-DECISION-V1
- CPN-GENERATION-IMPLEMENTATION-DEFINITION-V1
- POSTGRESQL-PERSISTENCE-IMPLEMENTATION-PLAN-V1
- POSTGRESQL-PERSISTENCE-IMPLEMENTATION-PLAN-CLOSURE-PROOF-V1

Prerequisite status:

DATABASE TECHNOLOGY = PostgreSQL
DATABASE TECHNOLOGY TECHNICAL DESIGN = CLOSED + PROVEN
POSTGRESQL PERSISTENCE IMPLEMENTATION PLAN = CLOSED + PROVEN
PLAN REVIEW = PASS
FAIL = 0

## 2. AUTHORIZATION RESULT

POSTGRESQL PERSISTENCE IMPLEMENTATION AUTHORIZED = YES

AUTHORIZATION TYPE = BOUNDED FIRST PERSISTENCE INCREMENT

IMPLEMENTATION MUST FOLLOW THE CLOSED PLAN AND TECHNICAL DESIGN.

## 3. AUTHORIZED IMPLEMENTATION

The following implementation is authorized:

1. Install the minimum PostgreSQL Node.js driver required for runtime
   connectivity.

2. Establish the bounded PostgreSQL connection configuration.

3. Establish the minimum PostgreSQL database/schema required by the
   authorized Patient persistence increment.

4. Create the PostgreSQL sequence used for authoritative CPN allocation.

5. Initialize the sequence at the authorized starting value:

   CPN_STARTING_VALUE = 1

6. Implement authoritative CPN allocation:

   CPN = CPN- + SEQUENTIAL NUMERIC VALUE

7. Implement Patient persistence for the already-authorized Patient
   information boundary.

8. Preserve a technical Patient persistence identity distinct from CPN.

9. Enforce persisted CPN uniqueness.

10. Implement the bounded Patient registration transaction:

    BEGIN
    → allocate CPN
    → construct Patient
    → persist Patient
    → COMMIT

    Failure:
    ROLLBACK

11. Integrate authoritative CPN generation with the existing
    Register New Patient application capability.

12. Add bounded tests proving the authorized behavior.

## 4. CPN AUTHORIZATION

CPN FORMAT = CPN- + SEQUENTIAL NUMERIC VALUE

CPN STARTING VALUE = 1

CPN AUTHORITY = PostgreSQL

CPN ALLOCATION MECHANISM = PostgreSQL Sequence

CPN ALLOCATION = DURABLE

CPN ALLOCATION = CONCURRENT-SAFE

CPN UNIQUENESS = REQUIRED

CPN STABILITY = REQUIRED

CPN GENERATED = FIRST PATIENT REGISTRATION ONLY

CPN IS NOT A VISIT IDENTIFIER

CPN IS NOT A CASE IDENTIFIER

CPN IS NOT A CLINIC DAY IDENTIFIER

SEQUENTIAL DOES NOT MEAN GAPLESS

## 5. PATIENT AUTHORIZATION

Authorized Patient persistence fields are limited to the already-established
Patient information boundary.

The implementation shall not introduce new Patient business meaning.

Patient domain construction remains authoritative for domain representation.

## 6. TRANSACTION AUTHORIZATION

The authorized transaction boundary is:

BEGIN
→ authoritative CPN allocation
→ Patient construction
→ Patient persistence
→ COMMIT

Failure must result in ROLLBACK.

No partially persisted Patient registration may be exposed as successful.

## 7. TEST / PROOF AUTHORIZATION

The implementation shall provide proof for:

- PostgreSQL connectivity
- CPN sequence existence
- sequence starting value = 1
- correct CPN format
- first Patient CPN generation
- subsequent distinct CPN generation
- CPN uniqueness
- concurrent allocation without duplicate CPN
- Patient persistence
- rollback on failed registration
- technical Patient identity separation from CPN
- existing Patient domain construction
- contract mutation = NO
- scope expansion = NO
- FAIL = 0

## 8. EXPLICITLY NOT AUTHORIZED

This authorization does NOT authorize:

- new application capabilities
- new actors
- authority transfer
- API expansion
- UI redesign
- authentication
- authorization
- ORM adoption
- full Case persistence
- full Visit persistence
- full Clinic Day persistence
- full clinical history persistence
- Follow-up lifecycle expansion
- attachment storage
- audit/event sourcing
- Patient merge
- delete/retention mechanics
- multi-branch
- multi-tenant
- deployment architecture
- unrelated database schema
- unrelated repositories
- unrelated services
- unrelated runtime refactoring
- domain redesign
- contract mutation
- scope expansion

## 9. MOCK RUNTIME PROTECTION

The existing mock/test runtime remains preserved.

The authorized implementation must not delete or invalidate the mock adapter
solely because PostgreSQL persistence is being introduced.

Real persistence shall be introduced incrementally.

## 10. IMPLEMENTATION DISCIPLINE

No implementation may exceed this authorization.

No closed decision may be reopened.

No deferred decision may be silently resolved outside the authorized
implementation boundary.

No PostgreSQL mechanism outside the closed technical design may be introduced
without a new bounded decision.

No ORM may be introduced for convenience.

## 11. PRE-EXECUTION STATUS

POSTGRESQL PACKAGE INSTALLATION = NOT PERFORMED

POSTGRESQL SERVER STARTUP = NOT PERFORMED

DATABASE CREATION = NOT PERFORMED

SCHEMA EXECUTION = NOT PERFORMED

MIGRATION EXECUTION = NOT PERFORMED

CPN SEQUENCE CREATION = NOT PERFORMED

PATIENT TABLE CREATION = NOT PERFORMED

REPOSITORY IMPLEMENTATION = NOT PERFORMED

APPLICATION INTEGRATION = NOT PERFORMED

IMPLEMENTATION PROVEN = NO

## 12. GOVERNANCE

This document authorizes bounded implementation only.

Authorization does not constitute proof of implementation.

Every executed implementation increment must produce direct evidence and
a corresponding proof before the next expansion.

FAIL = 0

## 13. AUTHORIZATION CLOSURE

POSTGRESQL PERSISTENCE IMPLEMENTATION AUTHORIZED = YES

AUTHORIZATION SCOPE = BOUNDED

CONTRACT MUTATION = NO

SCOPE EXPANSION = NO

FAIL = 0

NEXT GATE = POSTGRESQL PERSISTENCE IMPLEMENTATION AUTHORIZATION REVIEW

END OF POSTGRESQL PERSISTENCE IMPLEMENTATION AUTHORIZATION V1

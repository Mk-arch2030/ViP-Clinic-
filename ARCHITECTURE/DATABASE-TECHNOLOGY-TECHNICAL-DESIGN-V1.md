# Dr.Roby Clinic — Database Technology Technical Design V1

DOCUMENT = DATABASE TECHNOLOGY TECHNICAL DESIGN
PRODUCT = Dr.Roby Clinic

STATUS = DESIGN DRAFT

## 1. AUTHORITY

This technical design is governed by:

- DATABASE-TECHNOLOGY-FACTORY-DECISION-V1
- Persistence Technical Contract Proof
- Persistence Schema Definition
- Persistence Implementation Authorization Decision
- Final Authority Map
- CPN Format Factory Decision
- CPN Starting Value Factory Decision
- CPN Generation Mechanism Decision
- CPN Generation Implementation Authorization Decision
- CPN Generation Implementation Definition

Database technology authority is:

DATABASE TECHNOLOGY = PostgreSQL

No alternative database technology is introduced by this document.

## 2. TECHNICAL OBJECTIVE

Define the minimum technical PostgreSQL foundation required to implement
the already-authorized persistence boundary.

The design must support:

- durable Patient identity
- stable CPN
- relational integrity
- uniqueness
- transactions
- concurrent-safe authoritative CPN allocation
- future bounded application integration

No unrelated persistence capability is introduced.

## 3. DATABASE ROLE

PostgreSQL is the authoritative durable persistence layer for Dr.Roby Clinic.

Application memory is not authoritative for:

- Patient identity
- CPN uniqueness
- CPN allocation
- persistent clinical truth

The application must consume durable persistence results rather than inventing
persistent identifiers locally.

## 4. PATIENT IDENTITY

The Patient model retains two distinct concepts:

1. Technical persistence identity
2. Clinic Patient Number (CPN)

The CPN is the product-facing stable clinic identity reference.

The technical persistence identifier is an internal persistence concern.

This design does not yet select the technical identifier datatype unless
required by the bounded PostgreSQL implementation.

## 5. CPN TECHNICAL DIRECTION

CPN remains:

CPN- + sequential numeric value

Starting numeric value:

1

Generation authority:

PostgreSQL-backed persistence

The application must not use an in-memory counter.

A new CPN is allocated only during first Patient registration.

Returning Patient retrieval must preserve the existing CPN.

Visit, Case, and Clinic Day creation must never allocate a new CPN.

## 6. CPN ALLOCATION MECHANISM

The PostgreSQL implementation shall use a durable database-backed
authoritative allocation mechanism.

The preferred bounded mechanism is a PostgreSQL sequence.

The sequence is an internal technical allocation mechanism and is not itself
a Product entity.

The sequence shall:

- begin at 1
- allocate numeric values
- support concurrent allocation
- remain independent of application process memory
- provide the numeric component used to construct CPN

The product-facing CPN is constructed as:

CPN- + allocated numeric value

Sequential allocation does not imply gapless allocation.

A failed or rolled-back operation may consume an allocated value depending on
the PostgreSQL allocation semantics. No gapless-number requirement is
established by this design.

## 7. UNIQUENESS

The persisted Patient CPN shall have an authoritative uniqueness guarantee.

The database must reject duplicate persisted CPN values.

Application-level checks alone are insufficient as the final uniqueness
authority.

## 8. TRANSACTION BOUNDARY

First Patient registration must obtain the authoritative CPN and persist the
Patient identity within one bounded transactional workflow.

The technical implementation must ensure that a failed Patient registration
does not leave a partially persisted Patient identity.

The exact transaction and repository implementation remain downstream
implementation concerns.

## 9. PERSISTENCE SCOPE

The PostgreSQL implementation must remain bounded to the already-authorized
persistence concepts:

- Patient
- Case
- Visit
- Clinic Day
- Past History Item
- Actor
- Visit Clinical Content
- Follow-up Task
- Clinical Attachments

No unrelated tables, entities, or infrastructure are authorized by this
technical design.

## 10. APPLICATION INTEGRATION

The future Register New Patient implementation shall consume the
PostgreSQL-authoritative CPN allocation before Patient construction is
persisted.

The existing application capability remains conceptually:

Register New Patient
→ obtain authoritative CPN
→ construct Patient
→ persist Patient

The existing domain Patient authority is preserved.

No API or UI implementation is authorized by this document.

## 11. MIGRATION DIRECTION

The PostgreSQL physical structures shall be introduced through controlled
migration artifacts.

Migration syntax and exact migration tooling are not selected by this
document.

No migration is executed by this design.

## 12. DRIVER / ORM BOUNDARY

The Node.js PostgreSQL driver is expected to provide the minimum database
connectivity required by implementation.

ORM adoption is not required by this design and remains a separate decision.

No package installation is performed by this document.

## 13. CONCURRENCY

Concurrent first Patient registrations must not receive the same CPN.

The PostgreSQL-backed allocation mechanism is the authoritative concurrency
boundary.

No process-local locking is sufficient as the product authority.

## 14. FAILURE / RETRY

The implementation must distinguish:

- allocation failure
- Patient persistence failure
- successful Patient persistence

Retry behavior must not create duplicate Patient identities or silently
replace an existing Patient CPN.

Exact retry/idempotency implementation remains a downstream technical gate.

## 15. EXPLICIT NON-SCOPE

This design does not authorize:

- package installation
- PostgreSQL server startup
- database creation
- SQL execution
- migrations
- ORM installation
- repository implementation
- API implementation
- UI implementation
- authentication
- authorization
- deployment
- Patient domain redesign
- Case redesign
- Visit redesign
- Clinic Day redesign
- new Product capabilities

## 16. IMPLEMENTATION STATUS

DATABASE TECHNOLOGY = PostgreSQL

TECHNICAL DESIGN = DEFINED

POSTGRESQL PACKAGE INSTALLATION = NOT PERFORMED

DATABASE SERVER STARTUP = NOT PERFORMED

DATABASE CREATION = NOT PERFORMED

SCHEMA EXECUTION = NOT PERFORMED

MIGRATION EXECUTION = NOT PERFORMED

CPN GENERATION IMPLEMENTATION = NOT PERFORMED

APPLICATION INTEGRATION = NOT PERFORMED

## 17. REQUIRED PROOF

Before implementation authorization is consumed, proof must establish:

- PostgreSQL technology alignment
- durable allocation mechanism
- starting value = 1
- CPN format
- uniqueness
- concurrency safety
- Patient / CPN identity separation
- transaction boundary
- no unauthorized persistence concepts
- no contract mutation
- no scope expansion

## 18. GOVERNANCE

This design does not reopen or modify any closed CPN decision.

This design does not authorize implementation.

Any implementation must remain within the explicit boundaries established
above and receive its own execution/proof gate.

FAIL = 0

NEXT GATE = DATABASE TECHNOLOGY TECHNICAL DESIGN REVIEW

END OF DATABASE TECHNOLOGY TECHNICAL DESIGN V1

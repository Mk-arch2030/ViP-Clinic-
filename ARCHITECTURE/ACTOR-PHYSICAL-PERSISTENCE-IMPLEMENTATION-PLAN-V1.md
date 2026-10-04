# Actor Physical Persistence Implementation Plan V1

STATUS = OPEN IMPLEMENTATION PLAN
IMPLEMENTATION_AUTHORIZED = YES
SQL_EXECUTION = NOT_PERFORMED

## 1. PURPOSE

This document defines the bounded implementation sequence for the
authorized Actor PostgreSQL persistence foundation.

The plan does not execute SQL.

The plan does not create Actor data.

## 2. AUTHORITY BASIS

The implementation plan is based on:

- ACTOR-PERSISTENCE-IMPLEMENTATION-AUTHORIZATION-DECISION-V1;
- ACTOR-PHYSICAL-PERSISTENCE-STRUCTURAL-DEFINITION-V1;
- POSTGRESQL-ACTOR-PHYSICAL-DATA-TYPES-DECISION-V1;
- ACTOR-TECHNICAL-IDENTITY-MAPPING-RECONCILIATION-V1;
- PERSISTENCE-TECHNICAL-CONTRACT-V1;
- PERSISTENCE-SCHEMA-DEFINITION-V1.

## 3. AUTHORIZED IMPLEMENTATION TARGET

AUTHORIZED_PHYSICAL_OBJECT = public.actors

ACTOR_TECHNICAL_PERSISTENCE_COLUMN = actor_id

ACTOR_TECHNICAL_PERSISTENCE_TYPE = PostgreSQL UUID

ACTOR_TECHNICAL_PERSISTENCE_GENERATION = PostgreSQL 18 native uuidv7()

APPROVED_ROLES = DOCTOR + NURSE

NURSE_LIFECYCLE = ACTIVE / DEACTIVATED

## 4. IMPLEMENTATION PRINCIPLES

The implementation shall be:

- bounded;
- additive;
- reversible where technically possible;
- data-preserving;
- consistent with the closed Actor decisions;
- isolated from Authentication;
- isolated from Authorization runtime;
- isolated from Patient persistence behavior.

No implementation convenience may redefine the established Actor model.

## 5. AUTHORIZED PHYSICAL FOUNDATION

The implementation may establish the minimum PostgreSQL structure required
for the Actor persistence foundation.

The physical foundation shall include:

1. The `public.actors` table.
2. The `actor_id` technical persistence identity.
3. PostgreSQL UUID representation.
4. PostgreSQL 18 native `uuidv7()` generation.
5. The approved Actor Role representation.
6. The required Actor lifecycle representation.
7. Required physical integrity constraints necessary to preserve the
   established Actor model.

No unrelated physical object is authorized.

## 6. IDENTITY SAFETY

The implementation must preserve:

ACTOR_IDENTITY_DISTINCT_FROM_PERSISTENCE_KEY = YES

ACTOR_ROLE_DISTINCT_FROM_PERSISTENCE_KEY = YES

AUTHORITY_CONTEXT_DISTINCT_FROM_PERSISTENCE_KEY = YES

The implementation must not use:

- CPN;
- Visit ID;
- Case ID;
- Clinic Day identifier;
- username;
- password;
- session identifier;

as the Actor persistence technical identity.

## 7. ROLE SAFETY

Only the established roles are permitted:

DOCTOR

NURSE

No additional role is introduced.

Role integrity must be enforced at the physical persistence boundary.

## 8. LIFECYCLE SAFETY

The Actor persistence structure must support:

ACTIVE

DEACTIVATED

Deactivation must preserve Actor identity and historical association.

Destructive deletion is not part of this implementation plan.

Automatic reactivation is not introduced.

## 9. AUTHENTICATION BOUNDARY

This implementation plan does not authorize:

- password columns;
- password hashing;
- credential verification;
- sessions;
- tokens;
- login;
- logout;
- credential recovery.

Authentication remains governed by its separate authority chain.

## 10. AUTHORIZATION BOUNDARY

This implementation plan does not authorize:

- permission tables;
- policy engines;
- runtime authorization;
- permission assignment;
- authority transfer.

Authority semantics remain governed by CONTRACT-03 and the established
authorization boundary.

## 11. MAIN ADMIN BOUNDARY

This plan creates persistence structure only.

It does not create:

- the first Doctor row;
- a Main Admin row;
- Doctor credentials;
- Nurse credentials.

Main Admin creation remains separately gated.

## 12. PATIENT SAFETY

Patient persistence is outside this implementation increment.

No Patient table modification is authorized.

No existing Patient data may be deleted or rewritten.

The existing Patient persistence closure must remain preserved.

## 13. IMPLEMENTATION SEQUENCE

The implementation shall proceed in this order:

1. Reconcile the target database and schema boundary.
2. Verify the authorized physical object does not already exist in a
   conflicting form.
3. Verify the existing PostgreSQL UUID capability required by the closed
   decision.
4. Execute the bounded Actor schema creation.
5. Verify the resulting physical structure.
6. Verify required constraints.
7. Verify UUIDv7 generation behavior.
8. Execute a controlled transactional behavior proof.
9. Roll back all test Actor data.
10. Verify no test Actor data remains.
11. Verify Patient data and Patient schema remain preserved.
12. Record structural and behavioral evidence.
13. Close implementation only after all required proofs pass.

## 14. ROLLBACK REQUIREMENT

Rollback safety must be proven before implementation closure.

Test Actor data must not remain after rollback.

Sequence-like mutation must not be introduced for Actor identity.

The implementation must not compromise existing Patient persistence data.

## 15. PROHIBITED EXPANSION

The implementation must stop if it requires:

- Authentication changes;
- Authorization changes;
- Main Admin creation;
- credential creation;
- API changes;
- UI changes;
- Patient schema changes;
- unrelated domain objects;
- destructive migration.

Such expansion requires a separate authority decision.

## 16. CURRENT STATUS

IMPLEMENTATION_PLAN = OPEN

ACTOR_PERSISTENCE_IMPLEMENTATION_AUTHORIZED = YES

ACTOR_SQL_AUTHORITY = GRANTED

SQL_EXECUTION = NOT_PERFORMED

ACTOR_DATA_WRITTEN = NOT_PERFORMED

AUTHENTICATION_IMPLEMENTATION = NOT_GRANTED

AUTHORIZATION_IMPLEMENTATION = NOT_GRANTED

MAIN_ADMIN_CREATION = NOT_AUTHORIZED

PATIENT_DATA_MODIFICATION = NOT_AUTHORIZED

FAIL = 0

## 17. NEXT GATE

ACTOR PHYSICAL PERSISTENCE IMPLEMENTATION PLAN CLOSURE

END OF ACTOR PHYSICAL PERSISTENCE IMPLEMENTATION PLAN V1


## 18. FINAL IMPLEMENTATION PLAN RECONCILIATION

The Actor physical persistence implementation plan is formally
reconciled with the closed Actor structural definition and the granted
Actor persistence implementation authority.

The implementation remains bounded to the authorized Actor persistence
foundation.

The implementation target is:

public.actors

The technical persistence identity is:

actor_id

The approved physical representation is:

PostgreSQL UUID

The approved generation mechanism is:

PostgreSQL 18 native uuidv7()

The implementation plan does not authorize Authentication,
Authorization runtime behavior, Main Admin creation, credentials,
sessions, API expansion, UI implementation, deployment, or real use.

The existing Patient persistence boundary remains protected.

## 19. FINAL PLAN MARKERS

IMPLEMENTATION_PLAN = CLOSED + PROVEN

AUTHORIZED_PHYSICAL_OBJECT = public.actors

ACTOR_TECHNICAL_PERSISTENCE_COLUMN = actor_id

ACTOR_TECHNICAL_PERSISTENCE_TYPE = PostgreSQL UUID

ACTOR_TECHNICAL_PERSISTENCE_GENERATION = PostgreSQL 18 native uuidv7()

APPROVED_ROLES = DOCTOR + NURSE

NURSE_LIFECYCLE = ACTIVE / DEACTIVATED

ACTOR_PERSISTENCE_IMPLEMENTATION_AUTHORIZED = YES

ACTOR_SQL_AUTHORITY = GRANTED

AUTHENTICATION_IMPLEMENTATION = NOT_GRANTED

AUTHORIZATION_IMPLEMENTATION = NOT_GRANTED

MAIN_ADMIN_CREATION = NOT_AUTHORIZED

PATIENT_DATA_MODIFICATION = NOT_AUTHORIZED

SQL_EXECUTION = NOT_PERFORMED

ACTOR_DATA_WRITTEN = NOT_PERFORMED

ROLLBACK_PROOF = REQUIRED_BEFORE_IMPLEMENTATION_CLOSURE

DATA_PRESERVATION = REQUIRED

SCOPE_EXPANSION = NOT_AUTHORIZED

FAIL = 0

## 20. NEXT GATE

ACTOR PHYSICAL PERSISTENCE SQL IMPLEMENTATION

END OF ACTOR PHYSICAL PERSISTENCE IMPLEMENTATION PLAN V1

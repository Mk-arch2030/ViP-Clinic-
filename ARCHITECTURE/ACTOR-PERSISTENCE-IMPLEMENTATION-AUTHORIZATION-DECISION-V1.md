# Actor Persistence Implementation Authorization Decision V1

STATUS = OPEN AUTHORITY DECISION
ACTOR_PERSISTENCE_IMPLEMENTATION_AUTHORIZED = NO
ACTOR_SQL_AUTHORITY = NOT_GRANTED

## 1. PURPOSE

This document determines whether implementation of the established Actor
persistence boundary may proceed.

The decision is limited to Actor persistence implementation authority.

It does not implement the Actor persistence layer.

## 2. AUTHORITY BASIS

The decision is based on:

- CONTRACT-03 — ACTOR & AUTHORITY;
- ACTOR-DOMAIN-IMPLEMENTATION-CLOSURE;
- PERSISTENCE-TECHNICAL-CONTRACT-V1;
- PERSISTENCE-SCHEMA-DEFINITION-V1;
- POSTGRESQL-ACTOR-PHYSICAL-DATA-TYPES-DECISION-V1;
- ACTOR-TECHNICAL-IDENTITY-MAPPING-RECONCILIATION-V1.

## 3. CURRENT ESTABLISHED ACTOR BOUNDARY

ACTOR_MODEL = ONE_INDEPENDENT_ACTOR_CONCEPT

APPROVED_ROLES = DOCTOR + NURSE

DOCTOR_IS_INITIAL_ACTOR = YES

ACTOR_IDENTITY = STABLE_ACTOR_IDENTITY_REFERENCE

ACTOR_PERSISTENCE_TECHNICAL_IDENTITY = actor_id

ACTOR_PERSISTENCE_KEY_TYPE = PostgreSQL UUID

ACTOR_PERSISTENCE_KEY_GENERATION = PostgreSQL 18 native uuidv7()

ACTOR_IDENTITY_DISTINCT_FROM_PERSISTENCE_KEY = YES

ACTOR_ROLE_DISTINCT_FROM_PERSISTENCE_KEY = YES

AUTHORITY_CONTEXT_DISTINCT_FROM_PERSISTENCE_KEY = YES

ACTOR_IDENTITY_MAPPING = CLOSED + PROVEN

## 4. PROPOSED IMPLEMENTATION SCOPE

If authority is granted, the Actor persistence increment shall be bounded
to the minimum physical persistence foundation required to preserve the
established Actor model.

The authorized implementation boundary shall be determined explicitly
before SQL execution.

The implementation shall preserve:

- Actor Identity;
- Actor Role;
- Authority Context;
- Doctor/Nurse role distinction;
- historical Actor identity;
- separation between Actor identity and persistence key.

## 5. EXPLICITLY OUTSIDE THIS DECISION

This decision does NOT authorize:

- Authentication implementation;
- Authorization runtime implementation;
- password storage;
- credential creation;
- session implementation;
- token implementation;
- Main Admin creation;
- Doctor credential creation;
- Nurse account creation;
- API implementation;
- UI implementation;
- deployment;
- real use;
- production use.

## 6. DATA PRESERVATION REQUIREMENT

Any future Actor persistence implementation must preserve Actor identity
without destructive migration of established domain meaning.

Historical Actor associations must remain recoverable.

Nurse deactivation semantics must remain compatible with the established
Actor lifecycle.

Actor deletion must not be introduced by implementation convenience.

## 7. IMPLEMENTATION SAFETY REQUIREMENTS

Before SQL execution:

- physical schema must be explicitly bounded;
- column types must match closed physical decisions;
- identity mapping must remain unchanged;
- role and authority semantics must remain separate;
- authentication data must not be introduced without authentication
  authority;
- authorization data must not be introduced without authorization
  authority;
- no unrelated domain object may be introduced.

## 8. CURRENT AUTHORITY STATUS

ACTOR_PERSISTENCE_IMPLEMENTATION_AUTHORIZED = PENDING_FINAL_DECISION

ACTOR_SQL_AUTHORITY = PENDING_FINAL_DECISION

AUTHENTICATION_IMPLEMENTATION = NOT_GRANTED

AUTHORIZATION_IMPLEMENTATION = NOT_GRANTED

MAIN_ADMIN_CREATION = NOT_AUTHORIZED

API_IMPLEMENTATION = NOT_GRANTED

UI_IMPLEMENTATION = NOT_GRANTED

DEPLOYMENT = NOT_GRANTED

REAL_USE = NOT_AUTHORIZED

PRODUCTION_USE = NOT_AUTHORIZED

## 9. DECISION

FINAL_AUTHORIZATION = PENDING

NO_SQL_EXECUTION_BY_THIS_DOCUMENT = YES

NO_ACTOR_DATA_WRITTEN_BY_THIS_DOCUMENT = YES

FAIL = 0

## 10. NEXT GATE

FINAL ACTOR PERSISTENCE IMPLEMENTATION AUTHORIZATION DECISION

END OF ACTOR PERSISTENCE IMPLEMENTATION AUTHORIZATION DECISION V1


## 11. FINAL AUTHORITY DECISION

The established Actor persistence boundary is sufficiently defined to
authorize a bounded implementation increment.

Therefore:

ACTOR_PERSISTENCE_IMPLEMENTATION_AUTHORIZED = YES

ACTOR_SQL_AUTHORITY = GRANTED

ACTOR_PERSISTENCE_SCOPE = BOUNDED_ACTOR_PERSISTENCE_FOUNDATION

The authorization is limited to implementation of the established Actor
persistence foundation.

The authorization does not expand the Actor domain model and does not
authorize authentication or authorization runtime implementation.

## 12. AUTHORIZED IMPLEMENTATION BOUNDARY

The authorized Actor persistence increment may establish only the
minimum PostgreSQL persistence representation required for the existing
Actor model.

The implementation must preserve:

- one independent Actor concept;
- Stable Actor Identity Reference;
- Doctor and Nurse roles;
- Actor Role / Authority Context separation;
- Actor technical persistence identity;
- historical Actor identity;
- Nurse deactivation without destructive identity removal.

The physical persistence identity shall be:

ACTOR_TECHNICAL_PERSISTENCE_COLUMN = actor_id

ACTOR_TECHNICAL_PERSISTENCE_TYPE = PostgreSQL UUID

ACTOR_TECHNICAL_PERSISTENCE_GENERATION = PostgreSQL 18 native uuidv7()

No business-facing sequential Actor identifier is authorized.

## 13. IMPLEMENTATION PROHIBITIONS

This authorization does NOT authorize:

- Authentication implementation;
- password hashing or credential storage;
- session implementation;
- session identifiers;
- Authorization runtime implementation;
- permission engine implementation;
- Main Admin credential creation;
- Nurse credential creation;
- API route implementation;
- UI implementation;
- deployment;
- production use;
- real clinical use;
- destructive Actor deletion;
- unrelated domain persistence.

## 14. DATA PRESERVATION AND SAFETY

Actor persistence implementation must be additive and bounded.

No established Patient persistence object may be modified by this
authorization unless a separate explicit reconciliation proves that such
change is required.

No existing Patient data may be deleted or rewritten.

No historical Actor identity may be destroyed.

Nurse deactivation must preserve Actor identity and historical association.

Rollback safety must be established before the implementation is treated
as complete.

## 15. FINAL DECISION MARKERS

ACTOR_PERSISTENCE_IMPLEMENTATION_AUTHORIZED = YES

ACTOR_SQL_AUTHORITY = GRANTED

ACTOR_PERSISTENCE_SCOPE = BOUNDED_ACTOR_PERSISTENCE_FOUNDATION

ACTOR_TECHNICAL_PERSISTENCE_COLUMN = actor_id

ACTOR_TECHNICAL_PERSISTENCE_TYPE = PostgreSQL UUID

ACTOR_TECHNICAL_PERSISTENCE_GENERATION = PostgreSQL 18 native uuidv7()

AUTHENTICATION_IMPLEMENTATION = NOT_GRANTED

AUTHORIZATION_IMPLEMENTATION = NOT_GRANTED

MAIN_ADMIN_CREATION = NOT_AUTHORIZED

API_IMPLEMENTATION = NOT_GRANTED

UI_IMPLEMENTATION = NOT_GRANTED

DEPLOYMENT = NOT_GRANTED

REAL_USE = NOT_AUTHORIZED

PRODUCTION_USE = NOT_AUTHORIZED

PATIENT_DATA_MODIFICATION = NOT_AUTHORIZED

DESTRUCTIVE_ACTOR_DELETION = NOT_AUTHORIZED

SQL_EXECUTION = NOT_PERFORMED

ACTOR_DATA_WRITTEN = NOT_PERFORMED

DECISION_STATUS = CLOSED + PROVEN

FAIL = 0

## 16. NEXT GATE

ACTOR PHYSICAL PERSISTENCE STRUCTURAL DEFINITION

END OF ACTOR PERSISTENCE IMPLEMENTATION AUTHORIZATION DECISION V1

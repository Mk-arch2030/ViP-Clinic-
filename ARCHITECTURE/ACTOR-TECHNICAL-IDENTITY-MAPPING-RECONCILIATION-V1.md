# Actor Technical Identity Mapping Reconciliation V1

STATUS = OPEN RECONCILIATION
IMPLEMENTATION_AUTHORIZED = NO
SQL_IMPLEMENTATION_AUTHORIZED = NO

## 1. PURPOSE

This document reconciles the established Actor Identity model with the
approved PostgreSQL physical persistence identity representation.

The reconciliation exists to preserve the separation between:

- Product Actor Identity;
- Actor Role;
- Authority Context;
- Actor Persistence Technical Identity.

This document does not create or modify any database object.

## 2. AUTHORITY BASIS

The reconciliation is based on:

- CONTRACT-03 — ACTOR & AUTHORITY;
- ACTOR-DOMAIN-IMPLEMENTATION-CLOSURE;
- AUTHENTICATION-ACTOR-IDENTITY-REPRESENTATION-DECISION-V1;
- AUTHENTICATION-TECHNICAL-CONTRACT-V1;
- PERSISTENCE-TECHNICAL-CONTRACT-V1;
- PERSISTENCE-SCHEMA-DEFINITION-V1;
- POSTGRESQL-ACTOR-PHYSICAL-DATA-TYPES-DECISION-V1.

## 3. ESTABLISHED ACTOR IDENTITY MODEL

ACTOR_MODEL = ONE_INDEPENDENT_ACTOR_CONCEPT

APPROVED_ROLES = DOCTOR + NURSE

DOCTOR_IS_INITIAL_ACTOR = YES

IDENTITY_REFERENCE = STABLE_ACTOR_IDENTITY_REFERENCE

ACTOR_IDENTITY_STABLE_ACROSS_AUTHENTICATED_REQUESTS = YES

ACTOR_IDENTITY_DISTINCT_FROM_PERSISTENCE_KEY = YES

ACTOR_ROLE_DISTINCT_FROM_PERSISTENCE_KEY = YES

AUTHORITY_CONTEXT_DISTINCT_FROM_PERSISTENCE_KEY = YES

## 4. APPROVED PHYSICAL PERSISTENCE REPRESENTATION

ACTOR_TECHNICAL_PERSISTENCE_COLUMN = actor_id

ACTOR_TECHNICAL_PERSISTENCE_TYPE = PostgreSQL UUID

ACTOR_TECHNICAL_PERSISTENCE_GENERATION = PostgreSQL 18 native uuidv7()

ACTOR_NUMERIC_PERSISTENCE_KEY = REJECTED

UUID_VS_NUMERIC = CLOSED

## 5. IDENTITY MAPPING

The reconciled mapping is:

Product Actor Identity
        ↓
STABLE_ACTOR_IDENTITY_REFERENCE
        ↓
Actor Persistence Technical Identity
        ↓
actor_id
        ↓
PostgreSQL UUID
        ↓
PostgreSQL 18 native uuidv7()

The persistence technical identity is an implementation-level identity.

It does not replace or redefine the Product Actor Identity Reference.

It does not represent:

- Actor Role;
- Clinical Authority;
- Main Admin authority;
- System Ownership;
- Nurse delegation scope;
- authentication credentials;
- session identifiers.

## 6. ROLE AND AUTHORITY SEPARATION

The following remain separate from actor_id:

ACTOR_ROLE = SEPARATE

AUTHORITY_CONTEXT = SEPARATE

MAIN_ADMIN_AUTHORITY = SEPARATE

CLINICAL_AUTHORITY = SEPARATE

SYSTEM_OWNERSHIP = SEPARATE

NURSE_DELEGATION_SCOPE = SEPARATE

Authentication establishes authenticated identity but does not transfer
Product authority.

Authorization determines permitted operations but does not redefine
the persistence technical identity.

## 7. PATIENT ALIGNMENT

Patient persistence independently uses:

patient_id = PostgreSQL UUID

generation = PostgreSQL 18 native uuidv7()

Actor alignment with the Patient physical identifier family is therefore
a reconciled engineering alignment.

It is not inheritance of Patient identity.

Actor and Patient remain separate domain concepts with separate technical
identities and separate authority meanings.

## 8. SAFETY BOUNDARY

This reconciliation does NOT authorize:

- Actor table creation;
- SQL execution;
- schema migration;
- Actor repository implementation;
- Actor service implementation;
- API implementation;
- Authentication implementation;
- Authorization implementation;
- Main Admin creation;
- Doctor credential creation;
- Nurse account creation;
- UI implementation;
- deployment;
- real use.

PERSISTENCE_IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED

ACTOR_SQL_AUTHORITY = NOT_GRANTED

AUTHENTICATION_IMPLEMENTATION = NOT_GRANTED

AUTHORIZATION_IMPLEMENTATION = NOT_GRANTED

MAIN_ADMIN_CREATION = NOT_AUTHORIZED

REAL_USE = NOT_AUTHORIZED

## 9. RECONCILIATION STATUS

ACTOR_IDENTITY_MAPPING = PENDING_CLOSURE

PHYSICAL_TYPE_ALIGNMENT = PASS

PHYSICAL_GENERATION_ALIGNMENT = PASS

IDENTITY_SEPARATION = PASS

ROLE_SEPARATION = PASS

AUTHORITY_SEPARATION = PASS

PATIENT_ALIGNMENT = PASS

SCOPE_EXPANSION = NO

AUTHORITY_TRANSFER = NO

NEW_CAPABILITY = NO

SQL_EXECUTION = NOT_PERFORMED

ACTOR_DATA_WRITTEN = NOT_PERFORMED

FAIL = 0

## 10. NEXT GATE

ACTOR TECHNICAL IDENTITY MAPPING RECONCILIATION CLOSURE

END OF ACTOR TECHNICAL IDENTITY MAPPING RECONCILIATION V1


## 11. FINAL RECONCILIATION DECISION

The Actor technical identity mapping is formally reconciled.

The Product Actor Identity remains:

STABLE_ACTOR_IDENTITY_REFERENCE

The Actor persistence technical identity is:

actor_id

The approved physical representation is:

PostgreSQL UUID

The approved physical generation mechanism is:

PostgreSQL 18 native uuidv7()

The persistence technical identity remains logically distinct from:

- Product Actor Identity Reference;
- Actor Role;
- Authority Context;
- Main Admin authority;
- Clinical Authority;
- System Ownership;
- Nurse delegation scope;
- authentication credentials;
- session identifiers.

The mapping therefore preserves the established domain, authority,
authentication, and persistence boundaries.

## 12. FINAL DECISION MARKERS

ACTOR_IDENTITY_MAPPING = CLOSED + PROVEN

ACTOR_TECHNICAL_PERSISTENCE_COLUMN = actor_id

ACTOR_TECHNICAL_PERSISTENCE_TYPE = PostgreSQL UUID

ACTOR_TECHNICAL_PERSISTENCE_GENERATION = PostgreSQL 18 native uuidv7()

ACTOR_IDENTITY_DISTINCT_FROM_PERSISTENCE_KEY = YES

ACTOR_ROLE_DISTINCT_FROM_PERSISTENCE_KEY = YES

AUTHORITY_CONTEXT_DISTINCT_FROM_PERSISTENCE_KEY = YES

PATIENT_ALIGNMENT = INDEPENDENTLY_RECONCILED

AUTHORITY_TRANSFER = NO

SCOPE_EXPANSION = NO

NEW_CAPABILITY = NO

SQL_EXECUTION = NOT_PERFORMED

ACTOR_DATA_WRITTEN = NOT_PERFORMED

IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED

AUTHENTICATION_IMPLEMENTATION = NOT_GRANTED

AUTHORIZATION_IMPLEMENTATION = NOT_GRANTED

MAIN_ADMIN_CREATION = NOT_AUTHORIZED

REAL_USE = NOT_AUTHORIZED

FAIL = 0

## 13. NEXT GATE

ACTOR PERSISTENCE IMPLEMENTATION AUTHORIZATION

END OF ACTOR TECHNICAL IDENTITY MAPPING RECONCILIATION V1

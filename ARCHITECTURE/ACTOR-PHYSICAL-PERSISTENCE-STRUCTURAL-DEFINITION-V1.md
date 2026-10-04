# Actor Physical Persistence Structural Definition V1

STATUS = OPEN STRUCTURAL DEFINITION
IMPLEMENTATION_AUTHORIZED = YES
SQL_EXECUTION = NOT_PERFORMED

## 1. PURPOSE

This document defines the bounded physical PostgreSQL structure required
for Actor persistence after explicit implementation authority has been
granted.

It does not execute SQL.

It does not create Actor data.

It does not implement Authentication or Authorization.

## 2. AUTHORITY BASIS

This definition is based on:

- CONTRACT-03 — ACTOR & AUTHORITY;
- ACTOR-DOMAIN-IMPLEMENTATION-CLOSURE;
- PERSISTENCE-TECHNICAL-CONTRACT-V1;
- PERSISTENCE-SCHEMA-DEFINITION-V1;
- POSTGRESQL-ACTOR-PHYSICAL-DATA-TYPES-DECISION-V1;
- ACTOR-TECHNICAL-IDENTITY-MAPPING-RECONCILIATION-V1;
- ACTOR-PERSISTENCE-IMPLEMENTATION-AUTHORIZATION-DECISION-V1.

## 3. ACTOR PHYSICAL MODEL

ACTOR_MODEL = ONE_INDEPENDENT_ACTOR_CONCEPT

The physical persistence representation shall preserve:

- Actor Identity;
- Actor Role;
- Authority Context.

Actor Identity, Actor Role, and Authority Context remain logically
distinct concepts even when persisted within the same Actor record.

## 4. PHYSICAL OBJECT

AUTHORIZED_PHYSICAL_OBJECT = actors

The Actor persistence foundation shall use one PostgreSQL table:

public.actors

No Actor sequence is authorized.

No additional Actor persistence object is authorized by this definition.

## 5. TECHNICAL IDENTITY

PHYSICAL_COLUMN = actor_id

PHYSICAL_TYPE = PostgreSQL UUID

PHYSICAL_GENERATION = PostgreSQL 18 native uuidv7()

IDENTITY_ROLE = PERSISTENCE_TECHNICAL_IDENTITY

actor_id is not:

- Stable Actor Identity Reference;
- Actor Role;
- Authority Context;
- Main Admin authority;
- Clinical Authority;
- System Ownership;
- authentication credential;
- session identifier.

## 6. ACTOR IDENTITY

The persisted Actor record must retain the established Product Actor
Identity Reference as a distinct identity concept.

ACTOR_IDENTITY = STABLE_ACTOR_IDENTITY_REFERENCE

ACTOR_IDENTITY_DISTINCT_FROM_PERSISTENCE_KEY = YES

The exact physical representation of the Stable Actor Identity Reference
shall not be invented by this definition beyond the already-established
identity contract.

No username, password, session token, or credential field is introduced
by this definition.

## 7. ROLE

The Actor model supports the approved roles:

DOCTOR

NURSE

Actor Role is distinct from actor_id.

The role representation must preserve the established Doctor/Nurse
boundary.

No additional role is authorized by this definition.

## 8. AUTHORITY CONTEXT

Authority Context remains distinct from:

- actor_id;
- Actor Role;
- authentication credentials.

This physical definition does not create a permission engine or encode
runtime authorization rules.

Doctor remains:

- Main Admin;
- Clinical Authority;
- System Owner.

Nurse remains:

- Operational Workflow Participant;
- subject to Doctor delegation.

No authority transfer is introduced.

## 9. LIFECYCLE PRESERVATION

Actor persistence must preserve the established Nurse lifecycle:

ACTIVE

DEACTIVATED

Nurse deactivation must preserve:

- Actor identity;
- historical association;
- historical meaning.

Destructive Actor deletion is not authorized by this definition.

Automatic reactivation is not authorized.

## 10. DATA PRESERVATION

The physical structure must support preservation of Actor identity and
historical associations.

Patient persistence is outside this structure.

No Patient table modification is authorized by this definition.

No existing Patient data may be deleted or rewritten.

## 11. EXPLICITLY PROHIBITED OBJECTS

The following are not authorized by this definition:

- Actor sequence;
- credential table;
- password table;
- session table;
- token table;
- permission table;
- authorization-policy table;
- delegation-history table;
- Main Admin bootstrap table;
- unrelated domain tables.

Additional physical objects require separate authority.

## 12. EXPLICITLY PROHIBITED IMPLEMENTATION

This definition does not authorize:

- Authentication implementation;
- Authorization runtime implementation;
- password hashing;
- credential creation;
- session management;
- token generation;
- API implementation;
- UI implementation;
- deployment;
- Main Admin creation;
- Nurse account creation;
- real use;
- production use.

## 13. STRUCTURAL BOUNDARY

The Actor persistence foundation is bounded to:

ONE ACTOR TABLE

ONE ACTOR TECHNICAL PERSISTENCE IDENTITY

APPROVED ACTOR ROLE REPRESENTATION

PRESERVATION OF ACTOR LIFECYCLE STATE

PRESERVATION OF ACTOR IDENTITY SEMANTICS

No unrelated capability may be introduced.

## 14. IMPLEMENTATION STATUS

STRUCTURAL_DEFINITION = OPEN

ACTOR_PERSISTENCE_IMPLEMENTATION_AUTHORIZED = YES

ACTOR_SQL_AUTHORITY = GRANTED

SQL_EXECUTION = NOT_PERFORMED

ACTOR_DATA_WRITTEN = NOT_PERFORMED

AUTHENTICATION_IMPLEMENTATION = NOT_GRANTED

AUTHORIZATION_IMPLEMENTATION = NOT_GRANTED

MAIN_ADMIN_CREATION = NOT_AUTHORIZED

FAIL = 0

## 15. NEXT GATE

ACTOR PHYSICAL PERSISTENCE STRUCTURAL DEFINITION CLOSURE

END OF ACTOR PHYSICAL PERSISTENCE STRUCTURAL DEFINITION V1


## 16. FINAL STRUCTURAL RECONCILIATION

The Actor physical persistence structure is formally reconciled with the
closed Actor domain, identity, physical type, identity mapping, and
implementation authority decisions.

The authorized physical persistence boundary is:

public.actors

The technical persistence identity is:

actor_id

The physical representation is:

PostgreSQL UUID

The physical generation mechanism is:

PostgreSQL 18 native uuidv7()

The Actor model remains one independent Actor concept.

Actor Identity remains distinct from Actor persistence technical identity.

Actor Role remains distinct from Actor persistence technical identity.

Authority Context remains distinct from Actor persistence technical
identity.

The structure therefore preserves the established domain and authority
boundaries without introducing a new Product identity.

## 17. FINAL STRUCTURAL DECISION MARKERS

STRUCTURAL_DEFINITION = CLOSED + PROVEN

AUTHORIZED_PHYSICAL_OBJECT = public.actors

ACTOR_MODEL = ONE_INDEPENDENT_ACTOR_CONCEPT

ACTOR_TECHNICAL_PERSISTENCE_COLUMN = actor_id

ACTOR_TECHNICAL_PERSISTENCE_TYPE = PostgreSQL UUID

ACTOR_TECHNICAL_PERSISTENCE_GENERATION = PostgreSQL 18 native uuidv7()

ACTOR_IDENTITY = STABLE_ACTOR_IDENTITY_REFERENCE

ACTOR_IDENTITY_DISTINCT_FROM_PERSISTENCE_KEY = YES

ACTOR_ROLE_DISTINCT_FROM_PERSISTENCE_KEY = YES

AUTHORITY_CONTEXT_DISTINCT_FROM_PERSISTENCE_KEY = YES

APPROVED_ROLES = DOCTOR + NURSE

NURSE_LIFECYCLE = ACTIVE / DEACTIVATED

DESTRUCTIVE_ACTOR_DELETION = NOT_AUTHORIZED

ACTOR_SEQUENCE = NOT_AUTHORIZED

CREDENTIAL_STORAGE = NOT_AUTHORIZED

SESSION_STORAGE = NOT_AUTHORIZED

AUTHORIZATION_STORAGE = NOT_AUTHORIZED

PATIENT_DATA_MODIFICATION = NOT_AUTHORIZED

SQL_EXECUTION = NOT_PERFORMED

ACTOR_DATA_WRITTEN = NOT_PERFORMED

ACTOR_PERSISTENCE_IMPLEMENTATION_AUTHORIZED = YES

ACTOR_SQL_AUTHORITY = GRANTED

AUTHENTICATION_IMPLEMENTATION = NOT_GRANTED

AUTHORIZATION_IMPLEMENTATION = NOT_GRANTED

MAIN_ADMIN_CREATION = NOT_AUTHORIZED

REAL_USE = NOT_AUTHORIZED

PRODUCTION_USE = NOT_AUTHORIZED

FAIL = 0

## 18. NEXT GATE

ACTOR PHYSICAL PERSISTENCE IMPLEMENTATION PLAN

END OF ACTOR PHYSICAL PERSISTENCE STRUCTURAL DEFINITION V1

# Dr.Roby Clinic — Persistence Implementation Authorization Decision V1

DOCUMENT = PERSISTENCE IMPLEMENTATION AUTHORIZATION DECISION
VERSION = V1
STATUS = AUTHORIZED — BOUNDED SCOPE

## 1. AUTHORITY

This decision is governed by:

- BUILD-AUTHORIZATION-IMPLEMENTATION-DECISION.md
- DOMAIN-BUSINESS-MODEL-IMPLEMENTATION-CLOSURE.md
- DOMAIN-IMPLEMENTATION-RECONCILIATION.md
- PERSISTENCE-TECHNICAL-CONTRACT-V1.md
- PERSISTENCE-TECHNICAL-CONTRACT-PROOF.md
- PERSISTENCE-SCHEMA-DEFINITION-V1.md
- PERSISTENCE-SCHEMA-A01-RECONCILIATION-DECISION.md
- PERSISTENCE-SCHEMA-A01-PROOF.md

## 2. PREREQUISITES

BUILD_READINESS = PASS
GLOBAL_IMPLEMENTATION_AUTHORIZATION = YES
DOMAIN_BUSINESS_MODEL_IMPLEMENTATION = CLOSED + PROVEN
DOMAIN_IMPLEMENTATION_RECONCILIATION = CLOSED
PERSISTENCE_TECHNICAL_CONTRACT = CLOSED + PROVEN
PERSISTENCE_SCHEMA_DEFINITION = CLOSED + PROVEN
SCHEMA_A01_RECONCILIATION = CLOSED + PROVEN
SCHEMA_A01_PROOF = PASS

## 3. DECISION

DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = YES

Authorization is limited to implementing the established schema boundary
without changing or expanding its meaning.

## 4. AUTHORIZED SCOPE

The implementation MUST preserve the established persistence representation
for:

- Patient
- Case
- Visit
- Clinic Day
- Past History Item
- Actor
- Current Complaint
- Investigation
- Diagnosis
- Treatment
- Follow-up
- Clinical Attachments
- Follow-up Task as an operational extension of Follow-up

The implementation MUST preserve:

- Patient -> Case -> Visit -> Clinic Day relationships.
- Stable Patient identity and identity continuity across returning Visits.
- Previous Visits and their originating relationships.
- The distinction between Past History and Clinical History.
- Case Workflow State, Visit Protection State, and Case Completion as distinct concepts.
- A01 as Visit-level Arrival Patient Condition with only the approved values:
  Normal / Moderately Unwell / Severely Unwell.
- All established Doctor/Nurse authority boundaries.
- All explicitly deferred decisions and implementation boundaries.

## 5. IMPLEMENTATION LIMITS

SQL_IMPLEMENTATION_AUTHORIZED = NO
MIGRATION_IMPLEMENTATION_AUTHORIZED = NO
ORM_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO
API_IMPLEMENTATION_AUTHORIZED = NO
UI_IMPLEMENTATION_AUTHORIZED = NO
AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO
DEPLOYMENT_IMPLEMENTATION_AUTHORIZED = NO

This decision does not authorize PostgreSQL startup, database creation,
schema execution, migrations, ORM setup, repository code, API routes,
frontend work, authentication runtime, authorization runtime, or deployment.

## 6. DEFERRED DECISIONS

The following remain deferred and MUST NOT be invented by implementation:

- Physical table and column representation.
- SQL syntax and SQL data types.
- Follow-up Task lifecycle details.
- Delete/Trash/Retention mechanisms beyond already-established decisions.
- Soft Delete, Hard Delete, Purge, and Physical Destruction mechanisms.
- Patient Merge.
- Audit Log, Event Sourcing, and generic State History.
- Database triggers.
- Concurrency and idempotency mechanisms.
- Caching and deployment/runtime behavior.

Any deferred item requiring a technical decision MUST return to its own
definition and authorization gate before implementation.

## 7. SAFETY INVARIANTS

NEW_PRODUCT_CAPABILITY = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
CONTRACT_MUTATION = NO
RANDOM_REFACTORING = NO
UNAUTHORIZED_EXPANSION = NO

Implementation MUST conform to the closed contracts and MUST NOT silently
reinterpret, weaken, or expand them.

## 8. PROOF REQUIREMENTS

Before this authorization can be treated as implemented:

- Verify complete coverage of the authorized schema boundary.
- Verify all established relationships and invariants.
- Verify no deferred decision was silently resolved.
- Verify no unauthorized implementation layer was introduced.
- Record the implementation proof and its reconciliation separately.

FAIL = 0

## 9. NEXT GATE

DATABASE SCHEMA IMPLEMENTATION PLAN AND BOUNDED STRUCTURAL MAPPING

The next gate MUST define the implementation approach while preserving
the deferred SQL, migration, ORM, and repository boundaries.

## CANONICAL AUTHORITY SYNCHRONIZATION — PATIENT REPOSITORY INCREMENT

This record supersedes only the previously bounded NO state for the
specific Patient Repository increment reconciled by
PERSISTENCE-ACCESS-MECHANISM-DECISION-V1.md.

REPOSITORY_IMPLEMENTATION_AUTHORIZED = YES
SQL_IMPLEMENTATION_AUTHORIZED = YES

The SQL authorization is strictly limited to SQL required exclusively
for the authorized Patient Repository behavior.

MIGRATION_IMPLEMENTATION_AUTHORIZED = NO
ORM_IMPLEMENTATION_AUTHORIZED = NO

No generic persistence framework, generic repository framework,
unrelated repository, unrelated domain persistence, API/UI/auth/authz,
deployment, new actor, authority transfer, new product capability,
or unrelated deferred technical decision is authorized.

PATIENT_TECHNICAL_IDENTITY = DISTINCT_FROM_CPN
CPN_AUTHORITY = POSTGRESQL
CPN_ALLOCATION_MECHANISM = POSTGRESQL_SEQUENCE
PATIENT_REGISTRATION_TRANSACTION = PRESERVED
NO_PARTIAL_PATIENT_REGISTRATION = REQUIRED

REPOSITORY_IMPLEMENTATION = NOT_PERFORMED
SQL_IMPLEMENTATION = NOT_PERFORMED
MIGRATION_IMPLEMENTATION = NOT_PERFORMED
ORM_IMPLEMENTATION = NOT_PERFORMED

CANONICAL_AUTHORITY_SYNCHRONIZATION = CLOSED + PROVEN

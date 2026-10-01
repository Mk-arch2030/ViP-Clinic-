# Dr.Roby Clinic — Final Authority Map V1

DOCUMENT = FINAL AUTHORITY MAP
STATUS = RECONCILIATION MAP
AUTHORIZATION_EFFECT = NONE
SOURCE_OF_AUTHORITY = EXISTING CLOSED CONTRACTS AND AUTHORIZATION DECISIONS
PURPOSE = CONSOLIDATE EXISTING IMPLEMENTATION BOUNDARIES WITHOUT CREATING NEW AUTHORITY

---

## 1. GLOBAL IMPLEMENTATION AUTHORITY

GLOBAL_BUILD_READINESS = PASS
GLOBAL_IMPLEMENTATION_AUTHORIZED = YES

AUTHORITY BASIS:
- BUILD-AUTHORIZATION-IMPLEMENTATION-DECISION.md
- Commit: 6d814509ebe076ba99f090485ef1b9660542c066
- Date: 2026-09-22 20:23:09 +0300

GLOBAL SAFETY:
- AUTHORITY_TRANSFER = NO
- NEW_ACTOR = NO
- NEW_PRODUCT_CAPABILITY = NO
- CONTRACT_MUTATION = NO
- RANDOM_REFACTORING = NO
- UNAUTHORIZED_EXPANSION = NO

FIRST_IMPLEMENTATION_GATE =
DOMAIN / BUSINESS MODEL REPRESENTATION

---

## 2. DOMAIN / BUSINESS MODEL

STATUS = IMPLEMENTATION AUTHORIZED / CLOSED + PROVEN BASIS

DOMAIN_BUSINESS_MODEL_IMPLEMENTATION = CLOSED + PROVEN

BOUNDARY:
- Implementation MUST conform to established domain and authority contracts.
- No new actor.
- No new capability.
- No authority transfer.
- Closed invariants MUST remain preserved.

SOURCE RECORD:
- DOMAIN-BUSINESS-MODEL-IMPLEMENTATION-CLOSURE.md
- Registered in HEAD commit 583e02f291f477c94753a90f2c48d95a7ab8fbaf

---

## 3. PERSISTENCE

PERSISTENCE_AUTHORIZATION = BOUNDED

DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = YES

AUTHORIZED:
- Established persistence schema boundary only.
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
- Follow-up Task as established operational extension

AUTHORIZED:
- Bounded Patient Repository implementation.
- SQL required exclusively to materialize the authorized Patient Repository behavior.

REPOSITORY_IMPLEMENTATION_AUTHORIZED = YES
SQL_IMPLEMENTATION_AUTHORIZED = YES

UNAUTHORIZED:
- MIGRATION_IMPLEMENTATION_AUTHORIZED = NO
- ORM_IMPLEMENTATION_AUTHORIZED = NO
- API_IMPLEMENTATION_AUTHORIZED = NO
- UI_IMPLEMENTATION_AUTHORIZED = NO
- AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
- AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO
- DEPLOYMENT_IMPLEMENTATION_AUTHORIZED = NO

DEFERRED:
- Physical table/column representation where not already established
- SQL syntax/data types
- Follow-up Task lifecycle details
- Delete/Trash/Retention mechanisms beyond closed decisions
- Patient Merge
- Audit Log / Event Sourcing / generic State History
- Database triggers
- Concurrency / idempotency
- Caching / deployment-runtime behavior

SOURCE RECORD:
- PERSISTENCE-IMPLEMENTATION-AUTHORIZATION-DECISION-V1.md
- Commit: dcad407542f18ee3f6f7c34480da54978964c014
- Date: 2026-09-20 18:27:35 +0300

---

## 4. API

API_IMPLEMENTATION_AUTHORIZED = YES

AUTHORIZED:
- API_ROUTE_IMPLEMENTATION_AUTHORIZED = YES
- API_CONTROLLER_IMPLEMENTATION_AUTHORIZED = YES
- API_SERVICE_IMPLEMENTATION_AUTHORIZED = YES

BOUNDARY:
- Already-established API surface only.
- No new HTTP operation.
- No new business capability.
- Controllers preserve closed request/response/error/authority/lifecycle boundaries.
- Services perform established application/domain orchestration only.

UNAUTHORIZED:
- API_SCHEMA_IMPLEMENTATION_AUTHORIZED = NO
- DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = NO
- SQL_IMPLEMENTATION_AUTHORIZED = NO
- MIGRATION_IMPLEMENTATION_AUTHORIZED = NO
- ORM_IMPLEMENTATION_AUTHORIZED = NO
- REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO
- AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
- AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO
- UI_IMPLEMENTATION_AUTHORIZED = NO
- DEPLOYMENT_IMPLEMENTATION_AUTHORIZED = NO

EXECUTION_STATE_AT_AUTHORIZATION =
IMPLEMENTATION_EXECUTION = NOT PERFORMED

SOURCE RECORD:
- API-IMPLEMENTATION-AUTHORIZATION-DECISION-V1.md
- Commit: 18e2b6ac60e357a691786e5e2b6e10be34a13d32
- Date: 2026-09-22 21:09:07 +0300

---

## 5. API SERVER RUNTIME

API_SERVER_RUNTIME_IMPLEMENTATION = AUTHORIZED
SCOPE = PREVIOUSLY AUTHORIZED RUNTIME MATERIALIZATION ONLY

BOUNDARY:
- Runtime implementation remains separately governed.
- API Server Runtime authorization does not expand API, persistence, authentication, authorization, UI, or deployment authority.

SOURCE RECORD:
- BUILD-AUTHORIZATION-API-SERVER-RUNTIME-V1.md
- Runtime authorization chain previously closed and proven.

---

## 6. AUTHENTICATION

AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO

IDENTITY MODEL:
- Stable Actor Identity Reference.
- Doctor and Nurse are established roles.
- Authentication state remains distinct from Actor Identity, Role, Authority, Delegated Permission, Case state, Visit state, and Clinic Day state.

NO AUTHORIZATION HERE FOR:
- Password runtime
- Session runtime
- Authentication middleware
- Authentication persistence
- Authentication API
- Authentication UI
- Deployment authentication behavior

---

## 7. AUTHORIZATION

AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO

ESTABLISHED AUTHORITY MODEL:
- Doctor = Main Admin / Clinical Authority / System Owner.
- Nurse = delegated operational participant.
- Nurse delegation does not transfer clinical authority.
- Doctor retains exclusive case completion authority.
- Doctor retains clinic-day closure authority.
- Nurse lifecycle is governed by established ACTIVE / DEACTIVATED semantics.
- Identity/history erasure through deletion is prohibited.

NO RUNTIME AUTHORIZATION IMPLEMENTATION IS GRANTED BY THIS MAP.

---

## 8. UI / FRONTEND

UI_AUTHORIZATION = SCOPED

AUTHORIZED:
- Individually authorized UI increments only where their own authorization decision is CLOSED + PROVEN.
- Clinic UI Increment 04:
  - IMPLEMENTATION_AUTHORIZED = YES
  - STATUS = CLOSED + PROVEN
  - Commit: 80f0c138dd00781b110e500b3864472744ea20fc
  - Date: 2026-09-22 17:35:56 +0300

UNAUTHORIZED:
- No broad UI capability beyond explicitly authorized increments.
- No new product capability.
- No authority expansion.
- No silent contract interpretation.

UI INCREMENT 04 CHRONOLOGY:
DEFINITION
→ AUTHORIZATION REVIEW
→ AUTHORIZATION DECISION
→ IMPLEMENTATION
→ CLOSURE

The earlier:
IMPLEMENTATION_AUTHORIZED = PENDING AUTHORIZATION REVIEW
belongs to the Definition stage.

The:
IMPLEMENTATION_AUTHORIZATION = RECOMMENDED FOR AUTHORIZATION
belongs to the Authorization Review stage.

The final:
IMPLEMENTATION_AUTHORIZED = YES
belongs to the Authorization Decision / Closure stage.

---

## 9. DEPLOYMENT

DEPLOYMENT_IMPLEMENTATION_AUTHORIZED = NO

ESTABLISHED DEPLOYMENT DEFINITION:
- Single internet-hosted web application.
- Same application for Doctor and Nurse.
- PC / laptop / tablet / mobile access.
- No mandatory client installation.
- Runtime / persistence / authentication / authorization / workflow / clinic-day protection boundaries remain preserved.

NO PRODUCTION DATA OR CREDENTIALS ARE AUTHORIZED BY THIS MAP.

---

## 10. CROSS-SCOPE SAFETY INVARIANTS

NEW_PRODUCT_CAPABILITY = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
UNAUTHORIZED_SCOPE_EXPANSION = NO
CONTRACT_MUTATION = NO
RANDOM_REFACTORING = NO

Any implementation MUST return to its own definition/contract/authorization gate when it encounters a deferred or undefined technical decision.

---

## 11. AUTHORITY CHRONOLOGY

1. Contracts and technical definitions closed.
2. Build readiness established:
   BUILD_READINESS = PASS
3. Global implementation authorization:
   Commit 6d814509ebe076ba99f090485ef1b9660542c066
4. Bounded persistence schema authorization:
   Commit dcad407542f18ee3f6f7c34480da54978964c014
5. API implementation authorization:
   Commit 18e2b6ac60e357a691786e5e2b6e10be34a13d32
6. UI Increment 04 authorization and closure:
   Commit 80f0c138dd00781b110e500b3864472744ea20fc
7. Architecture reconciliation records registered:
   Commit 583e02f291f477c94753a90f2c48d95a7ab8fbaf

---

## 12. NON-AUTHORITY STATEMENT

THIS DOCUMENT DOES NOT:
- grant implementation authority;
- revoke implementation authority;
- redefine any contract;
- reopen any closed decision;
- resolve any deferred decision;
- introduce any capability;
- introduce any actor;
- transfer authority.

This document is a consolidated reconciliation map of existing manuscript authority.

---

## 13. CURRENT RECONCILED STATE

GLOBAL_IMPLEMENTATION_AUTHORIZATION = YES

DOMAIN = AUTHORIZED / CLOSED + PROVEN BASIS
PERSISTENCE = BOUNDED SCHEMA AUTHORIZATION
API = ROUTE + CONTROLLER + SERVICE AUTHORIZED
API_SERVER_RUNTIME = SEPARATELY AUTHORIZED
AUTHENTICATION = UNAUTHORIZED
AUTHORIZATION_RUNTIME = UNAUTHORIZED
UI = SCOPED AUTHORIZATION
DEPLOYMENT = UNAUTHORIZED

AUTHORITY_CHRONOLOGY = RECONCILED
AUTHORITY_MAP_EFFECT = NONE
CONTRACT_MUTATION = NO
UNAUTHORIZED_SCOPE_EXPANSION = NO

## CANONICAL AUTHORITY SYNCHRONIZATION — PATIENT REPOSITORY INCREMENT

This record supersedes only the previously bounded NO state for the
specific Patient Repository increment reconciled by
PERSISTENCE-ACCESS-MECHANISM-DECISION-V1.md.

REPOSITORY_IMPLEMENTATION_AUTHORIZED = YES
SQL_IMPLEMENTATION_AUTHORIZED = YES

SQL authorization is limited exclusively to SQL required to materialize
the authorized Patient Repository behavior.

MIGRATION_IMPLEMENTATION_AUTHORIZED = NO
ORM_IMPLEMENTATION_AUTHORIZED = NO

The following remain unauthorized:

- generic persistence framework;
- generic repository framework;
- unrelated repositories;
- unrelated domain persistence;
- Patient Merge;
- deletion or retention;
- audit or event sourcing;
- caching;
- API scope expansion;
- UI scope expansion;
- authentication implementation;
- authorization implementation;
- deployment implementation;
- new actors;
- authority transfer;
- new product capability;
- unrelated deferred technical decisions.

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

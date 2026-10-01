# Dr.Roby Clinic — API Implementation Authorization Decision V1

DOCUMENT = API IMPLEMENTATION AUTHORIZATION DECISION
STATUS = AUTHORIZATION DECISION
GATE = SEPARATE API IMPLEMENTATION AUTHORIZATION

## 1. PURPOSE

This document authorizes the implementation timing of the already-defined
Dr.Roby Clinic API boundary.

It does not redefine the API Technical Contract.

It does not reopen or reinterpret any closed product, domain, authority,
persistence, or API decision.

## 2. AUTHORITATIVE BASIS

This decision is subordinate to:

- API-TECHNICAL-CONTRACT-V1.md
- APPLICATION-CAPABILITY-CONTRACT-V1.md
- AUTHORIZATION-TECHNICAL-CONTRACT-V1.md
- PERSISTENCE-TECHNICAL-CONTRACT-V1.md
- established domain and authority invariants
- BUILD-AUTHORIZATION-API-SERVER-RUNTIME-V1.md

The API Technical Contract remains CLOSED + PROVEN.

## 3. AUTHORIZATION

API_IMPLEMENTATION_AUTHORIZED = YES

API_ROUTE_IMPLEMENTATION_AUTHORIZED = YES
API_CONTROLLER_IMPLEMENTATION_AUTHORIZED = YES
API_SERVICE_IMPLEMENTATION_AUTHORIZED = YES

Authorization is limited to implementation of the already-established
API surface and behavior.

## 4. IMPLEMENTATION BOUNDARY

Implementation MUST use only decisions already established by the
closed API Technical Contract and related closed contracts.

Implementation MUST NOT:

- invent a new product capability;
- introduce a new actor;
- transfer authority;
- expand Nurse permissions;
- weaken Doctor authority;
- alter Case / Visit lifecycle rules;
- alter Clinic Day authority;
- alter A01 semantics;
- alter Past History / Clinical History separation;
- silently resolve a deferred decision;
- invent API behavior not established by the closed contracts.

## 5. EXPLICITLY UNAUTHORIZED LAYERS

API_SCHEMA_IMPLEMENTATION_AUTHORIZED = NO
API_AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
API_AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO

DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = NO
SQL_IMPLEMENTATION_AUTHORIZED = NO
MIGRATION_IMPLEMENTATION_AUTHORIZED = NO
ORM_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO

UI_IMPLEMENTATION_AUTHORIZED = NO
DEPLOYMENT_IMPLEMENTATION_AUTHORIZED = NO

The existing API Server Runtime authorization remains separate and is not
expanded by this decision.

## 6. ROUTE IMPLEMENTATION BOUNDARY

Routes may be implemented only for operations already established by the
closed API surface.

No new HTTP operation, route capability, or business capability may be
introduced.

## 7. CONTROLLER IMPLEMENTATION BOUNDARY

Controllers may implement request handling for the already-established
API surface only.

Controllers MUST preserve the closed request, response, error, authority,
and lifecycle boundaries.

## 8. SERVICE IMPLEMENTATION BOUNDARY

Services may implement application/domain orchestration required by the
already-established API surface.

Services MUST NOT become a mechanism for introducing new capabilities,
authority, persistence behavior, authentication, authorization, or
deferred technical decisions.

## 9. SECURITY AND AUTHORITY PRESERVATION

Doctor remains the clinic owner, Main Admin, and clinical authority.

Nurse remains a delegated operational participant only.

No implementation in this authorization may grant Nurse clinical authority
or expand delegated permissions.

Authentication and authorization mechanisms remain separately unauthorized.

## 10. PERSISTENCE BOUNDARY

API implementation MUST NOT directly introduce or execute database schema,
SQL, migrations, ORM models, repository implementation, or database
runtime behavior.

The persistence boundary remains governed by its separate authorization
decisions.

## 11. PROOF REQUIREMENTS

Before API implementation is treated as CLOSED + PROVEN:

- implementation scope MUST match this authorization;
- no unauthorized layer may be implemented;
- no product capability may be introduced;
- no actor may be introduced;
- no authority may be transferred;
- all closed invariants MUST remain preserved;
- FAIL MUST equal 0;
- implementation proof MUST be recorded separately.

## 12. CURRENT DECISION

API_IMPLEMENTATION_AUTHORIZATION = CLOSED DECISION
API_ROUTE_IMPLEMENTATION_AUTHORIZED = YES
API_CONTROLLER_IMPLEMENTATION_AUTHORIZED = YES
API_SERVICE_IMPLEMENTATION_AUTHORIZED = YES

UNAUTHORIZED_EXPANSION = NO
FAIL = 0

IMPLEMENTATION_EXECUTION = NOT PERFORMED

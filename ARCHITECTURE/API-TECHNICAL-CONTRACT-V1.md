# API Technical Contract V1

## 1. PURPOSE

This document defines the technical API boundary required to expose the already-closed application capabilities of Dr.Roby Clinic through the Web Application boundary.

This document is a technical contract definition only.

It does NOT implement:
- API routes
- Fastify/server behavior
- request handlers
- authentication
- sessions or tokens
- authorization middleware
- database access
- repositories
- services
- UI
- deployment
- runtime infrastructure

No implementation is authorized by this document alone.

## 2. AUTHORITY CHAIN

The API technical contract MUST conform to the established authority chain:

Application Capability Contract V1
→ Authorization Technical Contract V1
→ Persistence Technical Contract V1
→ Persistence Schema Definition V1
→ API Technical Contract V1

The API is an exposure boundary.
It is not a new source of product truth.

## 3. API BOUNDARY PRINCIPLES

The API MUST:

1. Preserve Patient identity and stable CPN.
2. Preserve Patient → Case → Visit → Clinic Day relationships.
3. Preserve Visit history and chronology.
4. Preserve Past History as distinct from Clinical History.
5. Preserve Visit Type `Visit & Consultation`.
6. Preserve Visit Protection State.
7. Preserve Case Current State and Case Completion rules.
8. Preserve the five Visit Clinical Content areas.
9. Preserve Doctor authority boundaries.
10. Preserve Nurse delegation boundaries.
11. Prevent cross-Visit clinical overwrite.
12. Never introduce capabilities outside the closed application contract.

## 4. SOURCE OF TRUTH

The API MUST NOT become an independent source of truth.

Persistent domain truth remains governed by the Persistence Technical Contract and its authorized implementation.

Clinical History remains derived from Visits.

The API MUST expose the established domain meaning rather than redefine it.

## 5. ACTOR AND AUTHORITY BOUNDARY

The technical API boundary MUST recognize:

- Doctor = Main Admin + Clinical Authority + System Owner.
- Nurse = delegated Operational Workflow Participant.

The API MUST preserve the authorization boundary already defined.

The API contract MUST NOT invent additional Nurse capabilities.

Authentication and authorization implementation details remain outside this manuscript until separately defined.

## 6. APPLICATION CAPABILITY COVERAGE

The technical API contract MUST provide a deliberate mapping for the already-established application capabilities, including:

- Patient registration
- Patient retrieval
- Existing history retrieval
- Past History management
- Case creation/continuation
- Visit creation and workflow
- Arrival
- Doctor encounter
- Clinical information
- Clinical amendment
- Visit exit
- Follow-up return
- Case completion
- Clinic Day operation and closure

The exact route names, HTTP methods, payloads, response envelopes, error contracts, and authentication transport are NOT selected by this manuscript.

## 7. DOMAIN BOUNDARY

The API MUST preserve the nucleus:

Patient
→ Case
→ Visit
→ Clinic Day

The API MUST NOT flatten these concepts into an unrelated generic record model.

The API MUST NOT create a second Patient identity.

A returning Patient MUST resolve the existing Patient identity.

A Visit MUST NOT create a new Patient or CPN.

## 8. CLINICAL INFORMATION BOUNDARY

The API contract MUST preserve:

- Current Complaint = one per Visit
- Investigation = zero or many
- Diagnosis = one
- Treatment = many
- Follow-up = one

Investigation MUST remain distinct from Diagnosis.

Clinical content belongs to a Visit and MUST NOT overwrite clinical content belonging to another Visit.

## 9. PROTECTION AND AUTHORITY

The API contract MUST preserve Visit OPEN/PROTECTED semantics.

Protected clinical information requires the already-established Doctor Authorization boundary for amendment.

Case Completion remains Doctor-authorized.

Clinic Day Closure remains Doctor-authorized.

Visit Exit MUST NOT be interpreted as Case Completion.

Clinic Day Closure MUST NOT be interpreted as Case Completion.

## 10. DEFERRED TECHNICAL DECISIONS

The following remain deliberately undefined until the technical API contract is separately reconciled and closed:

- route naming
- HTTP methods
- URL structure
- request schemas
- response schemas
- error schemas
- status-code mapping
- authentication transport
- session/token mechanism
- authorization middleware
- idempotency
- concurrency behavior
- transaction boundary
- pagination
- filtering
- sorting
- versioning
- rate limiting
- caching
- file/attachment transport
- deployment/network behavior

No implementation may invent these decisions silently.

## 11. IMPLEMENTATION BOUNDARY

Until this contract is deliberately defined, reconciled, proven, and closed:

API_ROUTES_AUTHORIZED = NO
API_IMPLEMENTATION_AUTHORIZED = NO
AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO
DATABASE_SCHEMA_AUTHORIZED = NO
UI_IMPLEMENTATION_AUTHORIZED = NO

## 12. REQUIRED RECONCILIATION

Before closure, this document MUST be reconciled against:

- APPLICATION-CAPABILITY-CONTRACT-V1.md
- AUTHORIZATION-TECHNICAL-CONTRACT-V1.md
- PERSISTENCE-TECHNICAL-CONTRACT-V1.md
- PERSISTENCE-SCHEMA-DEFINITION-V1.md
- API-DECISION-REGISTER.md
- BUILD-AUTHORIZATION-IMPLEMENTATION-DEFINITION.md

The reconciliation MUST verify:

1. No capability invention.
2. No authority expansion.
3. No persistence contradiction.
4. No identity contradiction.
5. No clinical-history contradiction.
6. No Case/Visit lifecycle contradiction.
7. No Nurse permission expansion.
8. No implementation authorization leakage.
9. Complete application-to-API traceability.
10. Explicit unresolved technical decisions remain visible.

## 13. STATUS

STATUS = CLOSED + PROVEN

API_TECHNICAL_CONTRACT = CLOSED + PROVEN

API_ROUTES_AUTHORIZED = NO
API_IMPLEMENTATION_AUTHORIZED = NO
AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO
DATABASE_SCHEMA_AUTHORIZED = NO
UI_IMPLEMENTATION_AUTHORIZED = NO

## 14. NEXT GATE

Next gate:

TECHNICAL API CONTRACT FORENSIC RECONCILIATION

Required flow:

MANUSCRIPT
→ RECONCILE
→ PROVE
→ CLOSE
→ COMMIT
→ PUSH
→ SEPARATE IMPLEMENTATION AUTHORIZATION

No API implementation is authorized by this manuscript.

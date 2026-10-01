# Dr.Roby Clinic — P4 Controlled UI → Real API Adapter Wiring
# Authorization Decision V1

STATUS = CLOSED + PROVEN
GATE = P4 CONTROLLED UI → REAL API ADAPTER WIRING

## 1. AUTHORITY BASIS

This decision is bounded by the already-proven canonical authority chain:

- ARCHITECTURE/FINAL-AUTHORITY-MAP-V1.md
- ARCHITECTURE/API-SURFACE-DEFINITION-V1.md
- ARCHITECTURE/API-IMPLEMENTATION-AUTHORIZATION-DECISION-V1.md
- ARCHITECTURE/API-RUNTIME-IMPLEMENTATION-CLOSURE-PROOF-V1.md
- ARCHITECTURE/DESIGN/CLINIC-UI-INCREMENT-04-AUTHORIZATION-DECISION-V1.md
- ARCHITECTURE/DESIGN/CLINIC-UI-INCREMENT-04-CLOSURE-V1.md

CANONICAL_CHECKPOINT = 64247ab487da9b387321d3f55cf6f646d6d468e3

## 2. DECISION

AUTHORIZATION_DECISION = CONTROLLED UI → REAL API ADAPTER IMPLEMENTATION AUTHORIZED

IMPLEMENTATION_AUTHORIZED = YES

AUTHORIZATION_SCOPE = P4_REAL_API_ADAPTER_WIRING_ONLY

BOUNDARY = BOUNDED

## 3. EXISTING PROVEN API AUTHORITY

The following API operations are already implemented and proven:

POST /patients
GET /patients/:patientId

The existing proven runtime chain remains authoritative:

UI
→ Real API Adapter
→ Existing HTTP API
→ Existing Application Service
→ Existing Patient Repository
→ Existing PostgreSQL persistence

No lower-layer reimplementation is authorized by this decision.

## 4. AUTHORIZED UI/API ADAPTER SCOPE

Authorized implementation is limited to:

- introducing or adjusting the frontend API adapter required to call the existing API;
- replacing mock adapter dependency where required for the bounded Patient API flow;
- wiring the UI to the existing POST /patients operation;
- wiring the UI to the existing GET /patients/:patientId operation;
- preserving existing API payload semantics;
- preserving existing Patient identity semantics;
- preserving CPN authority;
- preserving Date of Birth authority;
- preserving derived Age semantics;
- preserving existing error propagation boundaries;
- preserving existing transaction ownership in the backend.

The adapter is a transport/integration boundary only.

## 5. EXPLICITLY NOT AUTHORIZED

This decision does NOT authorize:

- PostgreSQL changes;
- SQL changes;
- migrations;
- ORM introduction;
- repository expansion;
- application-service redesign;
- API route creation beyond the already-proven operations;
- new API operations;
- authentication implementation;
- authorization implementation;
- role changes;
- Nurse capability expansion;
- Doctor authority changes;
- new workflow states;
- Case state-machine changes;
- Visit state-machine changes;
- Clinic Day lifecycle changes;
- Past History implementation;
- Clinical History persistence;
- new domain entities;
- direct frontend-to-database access;
- PWA implementation;
- deployment;
- production hosting;
- unrelated UI redesign.

## 6. MOCK ADAPTER BOUNDARY

The existing mock adapter is historical UI proof infrastructure.

This decision authorizes controlled replacement of its Patient API dependency
only where required to establish the bounded UI → Real API path.

Mock data must not be silently treated as real persisted Patient data.

No unrelated mock surface is authorized for removal or redesign merely because
the real Patient API adapter is introduced.

## 7. PATIENT DATA SEMANTICS

The adapter MUST preserve:

PATIENT_IDENTITY = AUTHORITATIVE
CPN = STABLE
DATE_OF_BIRTH = PERSISTENT PATIENT FACT
AGE = DERIVED TEMPORAL VALUE
AGE_AT_REGISTRATION = DERIVED
AGE_AT_ENCOUNTER = DERIVED
CURRENT_AGE = DERIVED

The adapter MUST NOT introduce an authoritative Age input.

The adapter MUST NOT create a second Patient identity model.

## 8. FRONTEND IMPLEMENTATION BOUNDARY

Authorized frontend implementation is limited to files/components directly
required for the controlled Real API adapter wiring.

Primary expected boundary:

- frontend/src/adapters/
- frontend/src/App.jsx

Existing bounded UI styles and unrelated UI increments remain protected.

No unrelated architecture artifact may be modified.

## 9. E2E BOUNDARY

E2E implementation/proof is NOT authorized by this decision as an independent
gate.

This decision establishes the authority to build the controlled UI → Real API
adapter path.

A separate E2E authorization/proof decision MUST govern:

UI
→ Real API
→ Application
→ Repository
→ PostgreSQL
→ UI-visible result

E2E must not be claimed as proven merely because adapter implementation passes.

## 10. SAFETY INVARIANTS

P2 = CLOSED + PROVEN
P3 = CLOSED + PROVEN
A06 = CLOSED + PROVEN

No closed gate is reopened.

No deferred lower-layer decision is silently resolved.

No authority is transferred.

No new actor is introduced.

No new capability is introduced outside this bounded adapter increment.

UNAUTHORIZED_SCOPE_EXPANSION = NO

CONTRACT_MUTATION = NO

AUTHORITY_TRANSFER = NO

NEW_DOMAIN_CAPABILITY = NO

DIRECT_DATABASE_ACCESS = NO

## 11. PROOF REQUIREMENTS

The implementation must prove:

UI_ADAPTER_EXISTS = PASS
REAL_API_BASE_PATH = PASS
POST_PATIENT_WIRING = PASS
GET_PATIENT_WIRING = PASS
MOCK_PATIENT_API_BYPASS = PASS
NO_DIRECT_DATABASE_ACCESS = PASS
NO_SQL_CHANGE = PASS
NO_REPOSITORY_CHANGE = PASS
NO_APPLICATION_SERVICE_CHANGE = PASS
NO_AUTH_CHANGE = PASS
NO_WORKFLOW_CHANGE = PASS
A06_DOB_AGE_ALIGNMENT = PASS
P3_BOUNDARY_PRESERVED = PASS
FAIL = 0

## 12. GATE DECISION

CANONICAL_CROSS_CHECK = PASS
BOUNDED_SCOPE = PASS
P2_DEPENDENCY = PROVEN
P3_IMPACT = NONE
A06_IMPACT = NONE
IMPLEMENTATION_AUTHORIZED = YES
UNAUTHORIZED_SCOPE_EXPANSION = NO
FAIL = 0

## 13. NEXT GATE

NEXT_GATE = P4 CONTROLLED UI → REAL API ADAPTER IMPLEMENTATION

After implementation:

NEXT_PROOF_GATE = P4 UI → REAL API → DATABASE E2E AUTHORIZATION / PROOF

END OF P4 CONTROLLED UI → REAL API ADAPTER WIRING AUTHORIZATION DECISION V1

# API AUTHORITY REESTABLISHMENT DECISION V1

## 1. DOCUMENT IDENTITY

DOCUMENT = API-AUTHORITY-REESTABLISHMENT-DECISION-V1
PURPOSE = REESTABLISH_CURRENT_API_AUTHORITY_AFTER_PERSISTENCE_CLOSURE
SCOPE = API_AUTHORITY_ONLY
IMPLEMENTATION_EXECUTION = NOT_PERFORMED_BY_THIS_DOCUMENT

## 2. CURRENT BASELINE

PROJECT_HEAD = 6236694

PERSISTENCE_COMPLETE_CLOSURE = CLOSED
PERSISTENCE_LIVE_RECONCILIATION = CLOSED
PATIENT_FOUNDATION = PROTECTED
DATA_PRESERVATION = PROVEN
ROLLBACK_SAFETY = PROVEN
REGRESSION = PROVEN

CURRENT_API_AUTHORITY = NOT_YET_REESTABLISHED

## 3. HISTORICAL AUTHORITY RECONCILIATION

HISTORICAL_API_IMPLEMENTATION_AUTHORIZATION = EXISTS

HISTORICAL_API_ROUTE_AUTHORIZATION = EXISTS
HISTORICAL_API_CONTROLLER_AUTHORIZATION = EXISTS
HISTORICAL_API_SERVICE_AUTHORIZATION = EXISTS

HISTORICAL_SQL_AUTHORIZATION = NOT_GRANTED
HISTORICAL_REPOSITORY_AUTHORIZATION = NOT_GRANTED
HISTORICAL_DATABASE_SCHEMA_AUTHORIZATION = NOT_GRANTED
HISTORICAL_AUTHENTICATION_AUTHORIZATION = NOT_GRANTED
HISTORICAL_AUTHORIZATION_IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED

HISTORICAL_IMPLEMENTATION_EXECUTION =
DOCUMENTED_IN_SEPARATE_HISTORICAL_PROOF

HISTORICAL_AUTHORITY_STATUS =
REQUIRES_CURRENT_RECONCILIATION

## 4. AUTHORITY SAFETY STATE

CURRENT_API_IMPLEMENTATION_AUTHORIZED = NOT_YET_DETERMINED
CURRENT_API_ROUTE_IMPLEMENTATION_AUTHORIZED = NOT_YET_DETERMINED
CURRENT_API_CONTROLLER_IMPLEMENTATION_AUTHORIZED = NOT_YET_DETERMINED
CURRENT_API_SERVICE_IMPLEMENTATION_AUTHORIZED = NOT_YET_DETERMINED

SQL_IMPLEMENTATION_AUTHORIZED = NOT_GRANTED
REPOSITORY_IMPLEMENTATION_AUTHORIZED = NOT_GRANTED
DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = NOT_GRANTED
MIGRATION_IMPLEMENTATION_AUTHORIZED = NOT_GRANTED
AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NOT_GRANTED
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NOT_GRANTED
UI_IMPLEMENTATION_AUTHORIZED = NOT_GRANTED
DEPLOYMENT_IMPLEMENTATION_AUTHORIZED = NOT_GRANTED


## 5. CURRENT AUTHORITY RECONCILIATION

The current API authority MUST be derived from the present
architecture state and MUST NOT be inferred solely from historical
implementation artifacts.

The current state establishes:

PERSISTENCE_AUTHORITY = CLOSED
PERSISTENCE_LIVE_DATABASE = RECONCILED
PERSISTENCE_STRUCTURAL_PROOF = PROVEN
PERSISTENCE_BEHAVIORAL_PROOF = PROVEN
PERSISTENCE_ROLLBACK_PROOF = PROVEN
DATA_PRESERVATION = PROVEN

Therefore:

API_PROGRESSION_REVIEW = PERMITTED
API_IMPLEMENTATION_AUTHORITY = NOT_AUTOMATICALLY_GRANTED
HISTORICAL_API_AUTHORITY = NOT_CURRENT_AUTHORITY

## 6. HISTORICAL IMPLEMENTATION STATUS

Historical API runtime evidence records:

API_RUNTIME_WIRING = PASS
REAL_DATABASE_WIRING = PASS
FUNCTIONAL_PATIENT_REGISTRATION = PASS
REAL_POSTGRESQL_COMMIT = PASS
REAL_POSTGRESQL_ROLLBACK = PASS
API_TO_DATABASE_PERSISTENCE = PASS
P2_IMPLEMENTATION_CLOSURE = CLOSED + PROVEN

These records are treated as historical evidence of previously
performed implementation and verification.

They MUST NOT be interpreted as a new implementation authorization.

## 7. CURRENT BOUNDARY PRESERVATION

No current authority is granted by this reconciliation for:

SQL_IMPLEMENTATION
REPOSITORY_IMPLEMENTATION
DATABASE_SCHEMA_IMPLEMENTATION
MIGRATION_IMPLEMENTATION
ORM_IMPLEMENTATION
AUTHENTICATION_IMPLEMENTATION
AUTHORIZATION_IMPLEMENTATION
UI_IMPLEMENTATION
DEPLOYMENT_IMPLEMENTATION

No current authority is granted to expand:

DOMAIN_CAPABILITIES
ACTOR_AUTHORITY
NURSE_PERMISSIONS
DOCTOR_AUTHORITY
CASE_LIFECYCLE
VISIT_LIFECYCLE
CLINIC_DAY_AUTHORITY
A01_SEMANTICS
PAST_HISTORY_BOUNDARY
CLINICAL_HISTORY_BOUNDARY

## 8. CURRENT DECISION STATE

API_AUTHORITY_REESTABLISHMENT = IN_PROGRESS
CURRENT_API_IMPLEMENTATION_AUTHORIZED = NOT_YET_GRANTED
CURRENT_API_SCOPE = NOT_YET_DEFINED
CURRENT_API_EXECUTION = NOT_PERFORMED
PRODUCTION_AUTHORIZATION = NONE
REAL_USE_AUTHORIZATION = NONE
REAL_PILOT_AUTHORIZATION = NONE
VIBE_CODING_AUTHORITY = NONE


## 9. CURRENT AUTHORITY SOURCES

Current API authority reconstruction MUST reconcile against the
following established sources:

APPLICATION_CAPABILITY_CONTRACT
AUTHORIZATION_TECHNICAL_CONTRACT
PERSISTENCE_TECHNICAL_CONTRACT
PERSISTENCE_COMPLETE_CLOSURE_DECISION
API_TECHNICAL_CONTRACT
API_SURFACE_DEFINITION
API_SURFACE_RECONCILIATION
API_SURFACE_CLOSURE_DECISION
API_SERVER_RUNTIME_CONTRACT
API_SERVER_RUNTIME_CONTRACT_CLOSURE
API_DECISION_REGISTER

Historical implementation proof MAY provide evidence of what was
previously executed and verified.

Historical implementation proof MUST NOT override a later closed
contract or current authority decision.

## 10. CANDIDATE API AUTHORITY SCOPE

The current API authority review SHALL be limited to API behavior
already established by closed contracts.

Candidate scope MAY include only:

API_ROUTE_IMPLEMENTATION
API_CONTROLLER_IMPLEMENTATION
API_SERVICE_IMPLEMENTATION

Candidate scope MUST remain bounded by:

ESTABLISHED_APPLICATION_CAPABILITIES
ESTABLISHED_AUTHORIZATION_RULES
ESTABLISHED_PERSISTENCE_BOUNDARY
ESTABLISHED_API_SURFACE
ESTABLISHED_RUNTIME_BOUNDARY

The candidate scope does NOT include:

NEW_PRODUCT_CAPABILITY
NEW_DOMAIN_BEHAVIOR
NEW_ACTOR
NEW_PERMISSION
NEW_PERSISTENCE_MODEL
NEW_DATABASE_SCHEMA
NEW_SQL_POLICY
NEW_REPOSITORY_BEHAVIOR
NEW_AUTHENTICATION_MODEL
NEW_AUTHORIZATION_MODEL
NEW_UI_BEHAVIOR
NEW_DEPLOYMENT_BEHAVIOR

## 11. API TO PERSISTENCE DEPENDENCY

Any current API implementation decision MUST explicitly preserve the
closed Persistence boundary.

The API layer MUST NOT redefine persistence semantics.

The API layer MUST NOT modify the live database schema as an implicit
consequence of API implementation.

The API layer MUST NOT introduce unapproved repository behavior.

The closed Persistence state is therefore a prerequisite boundary,
not an implementation authorization for the API.

## 12. CURRENT AUTHORITY REVIEW REQUIREMENT

Before any API implementation is executed, the following MUST be
resolved by a current decision:

CURRENT_API_SCOPE
CURRENT_API_ROUTE_AUTHORITY
CURRENT_API_CONTROLLER_AUTHORITY
CURRENT_API_SERVICE_AUTHORITY
CURRENT_API_RUNTIME_AUTHORITY
CURRENT_API_DATABASE_BOUNDARY
CURRENT_API_TEST_BOUNDARY

Until those values are explicitly established:

API_IMPLEMENTATION_EXECUTION = BLOCKED
API_SERVER_BOOT_EXECUTION = BLOCKED
API_RUNTIME_MUTATION = BLOCKED


## 13. CURRENT AUTHORITY DECISION CRITERIA

A current API implementation authority decision MUST satisfy all of
the following criteria:

CRITERION_01 =
CURRENT_API_SCOPE_IS_EXPLICIT

CRITERION_02 =
CURRENT_API_SURFACE_IS_TRACEABLE_TO_CLOSED_CONTRACTS

CRITERION_03 =
CURRENT_API_BEHAVIOR_IS_TRACEABLE_TO_ESTABLISHED_APPLICATION_CAPABILITIES

CRITERION_04 =
CURRENT_API_AUTHORITY_DOES_NOT_EXPAND_ACTOR_PERMISSIONS

CRITERION_05 =
CURRENT_API_AUTHORITY_DOES_NOT_EXPAND_DOMAIN_BEHAVIOR

CRITERION_06 =
CURRENT_API_AUTHORITY_DOES_NOT_EXPAND_PERSISTENCE_SCOPE

CRITERION_07 =
CURRENT_API_AUTHORITY_DOES_NOT_GRANT_SQL_AUTHORITY

CRITERION_08 =
CURRENT_API_AUTHORITY_DOES_NOT_GRANT_REPOSITORY_AUTHORITY

CRITERION_09 =
CURRENT_API_AUTHORITY_DOES_NOT_GRANT_AUTHENTICATION_AUTHORITY

CRITERION_10 =
CURRENT_API_AUTHORITY_DOES_NOT_GRANT_AUTHORIZATION_AUTHORITY

CRITERION_11 =
CURRENT_API_RUNTIME_BOUNDARY_IS_EXPLICIT

CRITERION_12 =
CURRENT_API_TEST_BOUNDARY_IS_EXPLICIT

CRITERION_13 =
HISTORICAL_API_PROOF_IS_DISTINGUISHED_FROM_CURRENT_AUTHORITY

CRITERION_14 =
PERSISTENCE_CLOSURE_IS_PRESERVED

CRITERION_15 =
FAIL_STATE_IS_EXPLICIT

## 14. REQUIRED PROOF BEFORE AUTHORITY

Before current API implementation authority can be granted, proof MUST
establish:

PROOF_01 =
APPLICATION_TO_API_TRACEABILITY

PROOF_02 =
API_SURFACE_TO_ROUTE_TRACEABILITY

PROOF_03 =
API_ROUTE_TO_CONTROLLER_TRACEABILITY

PROOF_04 =
API_CONTROLLER_TO_SERVICE_TRACEABILITY

PROOF_05 =
SERVICE_TO_EXISTING_PERSISTENCE_BOUNDARY_TRACEABILITY

PROOF_06 =
NO_UNAUTHORIZED_SQL

PROOF_07 =
NO_UNAUTHORIZED_REPOSITORY_CHANGE

PROOF_08 =
NO_AUTHENTICATION_SCOPE_EXPANSION

PROOF_09 =
NO_AUTHORIZATION_SCOPE_EXPANSION

PROOF_10 =
NO_DOMAIN_SCOPE_EXPANSION

PROOF_11 =
NO_PERSISTENCE_SCOPE_EXPANSION

PROOF_12 =
REGRESSION_FAIL_ZERO

PROOF_13 =
IMPLEMENTATION_SCOPE_CONFORMANCE

PROOF_14 =
API_RUNTIME_BOUNDARY_CONFORMANCE

## 15. AUTHORITY GRANT RULE

No API implementation authority SHALL be considered active merely
because:

- an API source file already exists;
- an API test already exists;
- a historical decision contains AUTHORIZED = YES;
- a historical implementation proof contains PASS;
- a historical closure contains IMPLEMENTED;
- the Persistence phase is CLOSED.

Current authority becomes active only through an explicit current
decision satisfying the criteria and proof requirements defined in
this document.


## 16. CURRENT AUTHORITY DETERMINATION

The current authority determination is an independent architectural
decision and is not inherited automatically from any historical API
authorization or implementation proof.

CURRENT_API_IMPLEMENTATION_AUTHORIZED = NOT_GRANTED

CURRENT_API_ROUTE_IMPLEMENTATION_AUTHORIZED = NOT_GRANTED

CURRENT_API_CONTROLLER_IMPLEMENTATION_AUTHORIZED = NOT_GRANTED

CURRENT_API_SERVICE_IMPLEMENTATION_AUTHORIZED = NOT_GRANTED

CURRENT_API_RUNTIME_AUTHORITY = NOT_GRANTED

CURRENT_API_DATABASE_BOUNDARY =
EXISTING_CLOSED_PERSISTENCE_ONLY

CURRENT_API_TEST_BOUNDARY = NOT_YET_FINALIZED

## 17. CURRENT AUTHORITY SCOPE RULE

If current API implementation authority is subsequently granted, it
MUST be granted only for an explicitly named API scope.

The grant MUST identify:

AUTHORIZED_API_SURFACE
AUTHORIZED_ROUTES
AUTHORIZED_CONTROLLERS
AUTHORIZED_SERVICES
AUTHORIZED_RUNTIME_BOUNDARY
AUTHORIZED_TESTS
AUTHORIZED_PERSISTENCE_DEPENDENCIES

Any capability not explicitly included remains unauthorized.

## 18. EXCLUDED AUTHORITY

The following remain outside the current API authority review:

DATABASE_SCHEMA_AUTHORITY
SQL_IMPLEMENTATION_AUTHORITY
REPOSITORY_IMPLEMENTATION_AUTHORITY
MIGRATION_AUTHORITY
ORM_AUTHORITY
AUTHENTICATION_IMPLEMENTATION_AUTHORITY
AUTHORIZATION_IMPLEMENTATION_AUTHORITY
UI_IMPLEMENTATION_AUTHORITY
DEPLOYMENT_AUTHORITY
PRODUCTION_AUTHORITY
REAL_USE_AUTHORITY
REAL_PILOT_AUTHORITY
VIBE_CODING_AUTHORITY

Their current state remains:

NOT_GRANTED

## 19. IMPLEMENTATION BLOCK

Until the current API scope and authority are explicitly established
and proven:

API_IMPLEMENTATION_EXECUTION = BLOCKED
API_ROUTE_IMPLEMENTATION_EXECUTION = BLOCKED
API_CONTROLLER_IMPLEMENTATION_EXECUTION = BLOCKED
API_SERVICE_IMPLEMENTATION_EXECUTION = BLOCKED
API_SERVER_BOOT_FOR_IMPLEMENTATION = BLOCKED
API_RUNTIME_MUTATION = BLOCKED

This block does not invalidate historical implementation evidence.

It prevents historical evidence from being treated as current
implementation permission.


## 20. FINAL RECONCILIATION MATRIX

The current API authority SHALL be considered reconciled only when each
authority dependency has an explicit current state.

| AUTHORITY ITEM | CURRENT STATE | REQUIRED FOR API GRANT |
|---|---|---|
| APPLICATION CAPABILITY | ESTABLISHED | YES |
| AUTHORIZATION CONTRACT | ESTABLISHED | YES |
| PERSISTENCE CONTRACT | CLOSED + PROVEN | YES |
| PERSISTENCE LIVE DATABASE | RECONCILED | YES |
| API SURFACE | CLOSED + PROVEN | YES |
| API SURFACE RECONCILIATION | CLOSED + PROVEN | YES |
| API RUNTIME CONTRACT | CLOSED + PROVEN | YES |
| API IMPLEMENTATION SCOPE | NOT_YET_FINALIZED | YES |
| ROUTE SCOPE | NOT_YET_FINALIZED | YES |
| CONTROLLER SCOPE | NOT_YET_FINALIZED | YES |
| SERVICE SCOPE | NOT_YET_FINALIZED | YES |
| RUNTIME IMPLEMENTATION BOUNDARY | NOT_YET_FINALIZED | YES |
| TEST BOUNDARY | NOT_YET_FINALIZED | YES |
| SQL AUTHORITY | NOT_GRANTED | MUST REMAIN |
| REPOSITORY AUTHORITY | NOT_GRANTED | MUST REMAIN |
| SCHEMA AUTHORITY | NOT_GRANTED | MUST REMAIN |
| AUTHENTICATION AUTHORITY | NOT_GRANTED | MUST REMAIN |
| AUTHORIZATION AUTHORITY | NOT_GRANTED | MUST REMAIN |
| UI AUTHORITY | NOT_GRANTED | MUST REMAIN |
| DEPLOYMENT AUTHORITY | NOT_GRANTED | MUST REMAIN |

## 21. CLOSURE CONDITIONS

The API authority reestablishment decision MUST NOT be closed as
AUTHORIZED until:

1. The current API scope is explicitly named.
2. Every authorized route is explicitly identified.
3. Every authorized controller is explicitly identified.
4. Every authorized service is explicitly identified.
5. The runtime boundary is explicitly identified.
6. The test boundary is explicitly identified.
7. Existing Persistence authority is preserved.
8. SQL authority remains excluded.
9. Repository authority remains excluded unless separately authorized.
10. Database schema authority remains excluded.
11. Authentication authority remains excluded unless separately authorized.
12. Authorization authority remains excluded unless separately authorized.
13. No domain or actor authority is expanded.
14. Historical implementation evidence is reconciled with current scope.
15. All unresolved decisions remain explicitly visible.
16. The final proof reports FAIL = 0.

## 22. CURRENT CLOSURE STATE

API_AUTHORITY_REESTABLISHMENT = NOT_YET_CLOSED

CURRENT_API_AUTHORITY = NOT_GRANTED

CURRENT_API_SCOPE = NOT_YET_FINALIZED

CURRENT_API_IMPLEMENTATION_AUTHORIZED = NO

CURRENT_API_ROUTE_IMPLEMENTATION_AUTHORIZED = NO

CURRENT_API_CONTROLLER_IMPLEMENTATION_AUTHORIZED = NO

CURRENT_API_SERVICE_IMPLEMENTATION_AUTHORIZED = NO

CURRENT_API_RUNTIME_AUTHORITY = NO

API_IMPLEMENTATION_EXECUTION = BLOCKED

FAIL = 0

# 23. API SURFACE ↔ IMPLEMENTATION EVIDENCE MATRIX

## 23.1 Purpose

This section reconciles the currently defined API Surface against the implementation evidence actually present in the repository at the current HEAD.

The matrix distinguishes four separate states:

1. API Surface Definition
2. Actual Repository Implementation
3. Historical Implementation Evidence
4. Current API Authority

Existence of source code, historical proof, or historical authorization does not by itself establish current implementation authority.

Current API authority remains governed exclusively by this current API Authority Reestablishment Decision.

## 23.2 Current Repository HEAD

CURRENT_HEAD = 6236694

## 23.3 Surface-to-Implementation Matrix

| # | API Surface Operation | Route | Current Code | Historical Proof | Current Authority |
|---|---|---|---|---|---|
| 1 | Register New Patient | POST /patients | IMPLEMENTED | PROVEN | NOT GRANTED |
| 2 | Retrieve Existing Patient | GET /patients/{patientId} | IMPLEMENTED | PARTIAL / SUPPORTED | NOT GRANTED |
| 3 | Retrieve Existing Patient History | GET /patients/{patientId}/history | NOT FOUND | NOT PROVEN | NOT GRANTED |
| 4 | Add Past History Item | POST /patients/{patientId}/past-history | NOT FOUND | NOT PROVEN | NOT GRANTED |
| 5 | Modify Past History Item | PATCH /patients/{patientId}/past-history/{itemId} | NOT FOUND | NOT PROVEN | NOT GRANTED |
| 6 | Retrieve Clinical History / Visit History | GET /patients/{patientId}/clinical-history | NOT FOUND | NOT PROVEN | NOT GRANTED |
| 7 | Establish / Continue Case | POST /patients/{patientId}/cases | NOT FOUND | NOT PROVEN | NOT GRANTED |
| 8 | Complete Case | POST /cases/{caseId}/completion | NOT FOUND | NOT PROVEN | NOT GRANTED |
| 9 | Create Visit | POST /cases/{caseId}/visits | NOT FOUND | NOT PROVEN | NOT GRANTED |
| 10 | Record Arrival | POST /visits/{visitId}/arrival | NOT FOUND | NOT PROVEN | NOT GRANTED |
| 11 | Record Clinical Information | POST /visits/{visitId}/clinical-record | NOT FOUND | NOT PROVEN | NOT GRANTED |
| 12 | Record Exit | POST /visits/{visitId}/exit | NOT FOUND | NOT PROVEN | NOT GRANTED |
| 13 | Review Clinic Day Daily Data | GET /clinic-days/{clinicDayId}/daily-data | NOT FOUND | NOT PROVEN | NOT GRANTED |
| 14 | Close Clinic Day | POST /clinic-days/{clinicDayId}/closure | NOT FOUND | NOT PROVEN | NOT GRANTED |
| 15 | Read Current Nurse Delegation | GET /clinic/nurse-delegation | NOT FOUND | NOT PROVEN | NOT GRANTED |
| 16 | Change Nurse Delegation Scope | PATCH /clinic/nurse-delegation | NOT FOUND | NOT PROVEN | NOT GRANTED |
| 17 | Record / Execute Doctor Notification | POST /doctor-notifications | NOT FOUND | NOT PROVEN | NOT GRANTED |
## 23.4 Established Implementation Evidence

The repository currently contains two API route registrations:

POST /patients
GET /patients/:patientId

The registration route has the following established historical evidence:

FASTIFY_RUNTIME = PASS
DB_POOL_WIRING = PASS
PATIENT_REPOSITORY_WIRING = PASS
POST_PATIENT_ROUTE = PASS
CONTROLLER_BOUNDARY = PASS
APPLICATION_SERVICE_BOUNDARY = PASS
BOUNDED_SQL = PASS
REAL_POSTGRESQL_PERSISTENCE = PASS
PATIENT_REGISTRATION_TRANSACTION = PASS
TRANSACTION_COMMIT = PASS
TRANSACTION_ROLLBACK = PASS
NO_PARTIAL_PATIENT_REGISTRATION = PASS
CPN_UNIQUENESS = PASS
CPN_CONCURRENT_ALLOCATION = PASS
REAL_DATABASE_WIRING = PASS
FUNCTIONAL_PATIENT_REGISTRATION = PASS
API_TO_DATABASE_PERSISTENCE = PASS
FAIL = 0

The retrieve-patient operation is implemented through:

GET /patients/:patientId
→ retrieveExistingPatientController
→ retrieveExistingPatient
→ repository.findByTechnicalId(...)

Its existence is established by repository source evidence and associated tests.

However, the historical implementation closure evidence supplied in this reconciliation is explicitly centered on patient registration and its persistence proof. Therefore the retrieve operation is not promoted to an independently fully-proven historical runtime closure by this section.

## 23.5 Clinic Day Boundary

The repository contains Clinic Day application services:

openClinicDayService
closeClinicDayService
getCurrentClinicDayService
incrementClinicDayCounterService

The service implementation explicitly preserves Doctor-only authority for Clinic Day opening and closing.

However:

APPLICATION SERVICE EXISTENCE
        ≠
API ROUTE EXISTENCE
        ≠
CURRENT API AUTHORIZATION

No Clinic Day API route was established by the current repository API route evidence.

Therefore the existence of Clinic Day services does not authorize creation of Clinic Day API routes.

## 23.6 Historical Authorization Reconciliation

Historical API implementation authorization established a bounded implementation decision for the previously defined API surface.

That historical decision is retained as historical evidence.

It is not treated as the current authorization source because the present project state explicitly initiated this API Authority Reestablishment Decision after Persistence Closure.

Accordingly:

HISTORICAL_API_AUTHORIZATION = EVIDENCE
CURRENT_API_AUTHORIZATION = GOVERNED_BY_THIS_DECISION

## 23.7 Current Authority Determination

The matrix establishes the following current state:

API_SURFACE_ENTRIES = 17

IMPLEMENTED_API_ROUTES = 2

CURRENTLY_IDENTIFIED_IMPLEMENTED_OPERATIONS =
    Register New Patient
    Retrieve Existing Patient

HISTORICALLY_FULLY_PROVEN_RUNTIME_OPERATION =
    Register New Patient

ADDITIONAL_SURFACE_IMPLEMENTATION =
    NOT ESTABLISHED

CURRENT_API_IMPLEMENTATION_AUTHORIZED = NO
CURRENT_API_ROUTE_IMPLEMENTATION_AUTHORIZED = NO
CURRENT_API_CONTROLLER_IMPLEMENTATION_AUTHORIZED = NO
CURRENT_API_SERVICE_IMPLEMENTATION_AUTHORIZED = NO
CURRENT_API_RUNTIME_AUTHORITY = NO

## 23.8 Implementation Block

No implementation may be added, expanded, started, booted, or exposed on the basis of this matrix alone.

In particular, this section does not authorize:

NEW_API_ROUTES
NEW_CONTROLLERS
NEW_SERVICES
AUTHENTICATION_IMPLEMENTATION
AUTHORIZATION_IMPLEMENTATION
NEW_REPOSITORY_BEHAVIOR
NEW_SQL
NEW_DATABASE_SCHEMA
NEW_DOMAIN_CAPABILITY
NEW_ACTOR_AUTHORITY
UI_IMPLEMENTATION
DEPLOYMENT

Any future implementation authorization must be explicitly established by a subsequent current authority decision or amendment.

## 23.9 Matrix Closure State

API_SURFACE_IMPLEMENTATION_RECONCILIATION = ESTABLISHED
IMPLEMENTED_ROUTE_COUNT = 2
FULLY_PROVEN_RUNTIME_OPERATION_COUNT = 1
UNIMPLEMENTED_SURFACE_COUNT = 15
CURRENT_AUTHORITY_GRANTED = NO
IMPLEMENTATION_AUTHORIZATION = BLOCKED
FAIL = 0

## 23.10 Reconciliation Conclusion

The API Surface is defined as seventeen operations, while the current repository evidence establishes only two API route registrations.

Of those two implemented routes, patient registration has explicit historical runtime and real-database proof. Patient retrieval is present in the repository with controller, service, and test evidence, but is not promoted by this section to independently fully-proven historical runtime closure.

The remaining fifteen surface operations have not been established as currently implemented API routes by the evidence reconciled in this section.

Application service existence, historical authorization, historical proof, or persistence closure does not independently grant current API implementation authority.

Therefore this reconciliation establishes evidence and boundaries only.

It does not grant current API implementation authority.

The next authority determination must explicitly decide the bounded current API scope, including the exact operations, routes, controllers, services, runtime boundary, test boundary, and persistence dependencies that may proceed.

Until that determination is separately closed:

CURRENT_API_IMPLEMENTATION_AUTHORIZED = NO
API_IMPLEMENTATION_EXECUTION = BLOCKED
PRODUCTION_AUTHORIZATION = NONE
REAL_USE_AUTHORIZATION = NONE
REAL_PILOT_AUTHORIZATION = NONE
VIBE_CODING_AUTHORITY = NONE
FAIL = 0

# 24. BOUNDED CURRENT API SCOPE RECONCILIATION

## 24.1 Purpose

This section establishes the bounded candidate scope for current API authority following the completed API Surface to Implementation Evidence reconciliation.

This section does not grant implementation authority.

Its purpose is to identify which existing API behavior can be considered for current authority and which API surface operations remain outside the current implementation boundary.

## 24.2 Scope Principle

Current API authority shall be limited to behavior that is simultaneously:

1. Already represented by an existing API route.
2. Traceable to an existing controller.
3. Traceable to an existing application service.
4. Consistent with the closed application and authorization contracts.
5. Dependent only on already-established persistence authority.
6. Supported by repository evidence sufficient for the specific operation.
7. Free from new actor, domain, authorization, persistence, schema, SQL, or UI expansion.

No API operation shall enter the current authority scope merely because it exists in the API Surface Definition.

## 24.3 Candidate Existing API Scope

The current repository contains the following API routes:

POST /patients
GET /patients/:patientId

These two routes constitute the only currently identified API route implementations.

Accordingly:

CURRENT_IMPLEMENTED_API_ROUTE_COUNT = 2

CANDIDATE_CURRENT_API_SCOPE = EXISTING_IMPLEMENTED_ROUTES_ONLY

## 24.4 Candidate Operation — Register New Patient

Operation:

Register New Patient

Route:

POST /patients

Current implementation chain:

POST /patients
→ registerNewPatientController
→ registerNewPatient
→ existing patient repository
→ existing PostgreSQL persistence

Established evidence includes:

FASTIFY_RUNTIME = PASS
DB_POOL_WIRING = PASS
PATIENT_REPOSITORY_WIRING = PASS
POST_PATIENT_ROUTE = PASS
CONTROLLER_BOUNDARY = PASS
APPLICATION_SERVICE_BOUNDARY = PASS
BOUNDED_SQL = PASS
REAL_POSTGRESQL_PERSISTENCE = PASS
PATIENT_REGISTRATION_TRANSACTION = PASS
TRANSACTION_COMMIT = PASS
TRANSACTION_ROLLBACK = PASS
CPN_UNIQUENESS = PASS
CPN_CONCURRENT_ALLOCATION = PASS
API_TO_DATABASE_PERSISTENCE = PASS
FAIL = 0

This operation is therefore identified as:

REGISTER_NEW_PATIENT_CURRENT_SCOPE_CANDIDATE = YES

This identification is not itself an implementation authorization.

## 24.5 Candidate Operation — Retrieve Existing Patient

Operation:

Retrieve Existing Patient

Route:

GET /patients/:patientId

Current implementation chain:

GET /patients/:patientId
→ retrieveExistingPatientController
→ retrieveExistingPatient
→ existing patient repository

Repository source evidence and associated tests establish the implementation chain.

However, the currently reconciled historical runtime closure evidence does not independently establish a full runtime closure equivalent to the patient registration proof.

Therefore:

RETRIEVE_EXISTING_PATIENT_CURRENT_SCOPE_CANDIDATE = YES
RETRIEVE_EXISTING_PATIENT_FULL_RUNTIME_PROOF = NOT_YET_ESTABLISHED

This operation remains subject to operation-specific proof before any current authority grant.

## 24.6 Excluded API Surface

The following API Surface operations are not currently implemented as API routes by the reconciled repository evidence:

Retrieve Existing Patient History
Add Past History Item
Modify Past History Item
Retrieve Clinical History / Visit History
Establish / Continue Case
Complete Case
Create Visit
Record Arrival
Record Clinical Information
Record Exit
Review Clinic Day Daily Data
Close Clinic Day
Read Current Nurse Delegation
Change Nurse Delegation Scope
Record / Execute Doctor Notification

Accordingly:

UNIMPLEMENTED_API_SURFACE_SCOPE = 15 OPERATIONS

These operations remain outside current API implementation authority.

Their presence in the API Surface Definition does not authorize their implementation.

## 24.7 Application Services Do Not Expand API Scope

Existing application services that do not have corresponding implemented API routes do not expand the current API scope.

In particular, the existence of Clinic Day services does not authorize creation of Clinic Day API routes.

The same principle applies to any existing application capability whose API exposure has not been separately established.

APPLICATION_SERVICE_EXISTENCE = NON_AUTHORIZING_FOR_API_SCOPE

## 24.8 Current Scope Boundary

The current bounded scope is therefore:

CURRENT_API_SCOPE_CANDIDATES =
    POST /patients
    GET /patients/:patientId

CURRENT_API_SCOPE_GRANT = NOT_YET_GRANTED

All other API Surface operations remain outside the current implementation boundary.

## 24.9 Required Proof Before Current Authority Grant

Before any current API authority is granted, the candidate operations must be reconciled against:

1. Route evidence.
2. Controller evidence.
3. Service evidence.
4. Persistence dependency evidence.
5. Authorization contract conformance.
6. Domain invariant preservation.
7. Regression evidence.
8. Runtime boundary evidence.
9. Test boundary evidence.
10. Absence of unauthorized expansion.

No operation shall be granted merely because another operation has already been proven.

## 24.10 Current State

CURRENT_API_SCOPE_RECONCILIATION = ESTABLISHED
CURRENT_API_SCOPE_CANDIDATES = 2
CURRENT_API_SCOPE_GRANT = NOT_YET_GRANTED
CURRENT_API_IMPLEMENTATION_AUTHORIZED = NO
API_IMPLEMENTATION_EXECUTION = BLOCKED
FAIL = 0

## 25. OPERATION-LEVEL AUTHORITY PROOF MATRIX

### 25.1 Purpose

This section performs operation-level reconciliation for each current API scope candidate.

The purpose is to determine whether each candidate operation has sufficient evidence and bounded authority for a future current API grant.

This section does not grant implementation authority.

No candidate operation shall inherit authority from another operation.

Each operation must independently satisfy the required authority, evidence, and boundary conditions.

### 25.2 Operation-Level Authority Rule

For an operation to become eligible for current API implementation authority, all of the following must be established independently:

1. Existing route evidence.
2. Existing controller evidence.
3. Existing application service evidence.
4. Existing persistence dependency evidence.
5. Authorization contract conformance.
6. Domain invariant preservation.
7. Runtime boundary conformance.
8. Test boundary evidence.
9. Regression evidence.
10. Absence of unauthorized expansion.

Therefore:

AUTHORITY = NOT IMPLIED
EVIDENCE = OPERATION_SPECIFIC
BOUNDARY = OPERATION_SPECIFIC

No operation is authorized merely because:

- another API operation is authorized,
- the operation exists in the API Surface Definition,
- an application service exists,
- historical implementation authorization exists,
- historical runtime proof exists,
- persistence is closed.

### 25.3 Candidate Operation A — Register New Patient

Operation:

REGISTER_NEW_PATIENT

Route:

POST /patients

Current implementation evidence:

POST /patients
→ registerNewPatientController
→ registerNewPatient
→ patientRepository
→ PostgreSQL persistence

Established evidence includes:

FASTIFY_RUNTIME = PASS
DB_POOL_WIRING = PASS
PATIENT_REPOSITORY_WIRING = PASS
POST_PATIENT_ROUTE = PASS
CONTROLLER_BOUNDARY = PASS
APPLICATION_SERVICE_BOUNDARY = PASS
BOUNDED_SQL = PASS
REAL_POSTGRESQL_PERSISTENCE = PASS
PATIENT_REGISTRATION_TRANSACTION = PASS
TRANSACTION_COMMIT = PASS
TRANSACTION_ROLLBACK = PASS
CPN_UNIQUENESS = PASS
CPN_CONCURRENT_ALLOCATION = PASS
API_TO_DATABASE_PERSISTENCE = PASS
FAIL = 0

Authority boundary:

The operation is limited to existing Patient registration behavior.

The operation does not authorize:

- new Patient domain capabilities,
- new actors,
- new permissions,
- authentication implementation,
- authorization implementation,
- new persistence structures,
- new database schema,
- new SQL authority,
- new repository capabilities,
- new UI behavior,
- deployment behavior,
- production use.

Current operation status:

REGISTER_NEW_PATIENT_EVIDENCE = ESTABLISHED
REGISTER_NEW_PATIENT_BOUNDARY = ESTABLISHED
REGISTER_NEW_PATIENT_AUTHORITY = NOT_YET_GRANTED

### 25.4 Candidate Operation B — Retrieve Existing Patient

Operation:

RETRIEVE_EXISTING_PATIENT

Route:

GET /patients/:patientId

Current implementation chain:

GET /patients/:patientId
→ retrieveExistingPatientController
→ retrieveExistingPatient
→ patientRepository.findByTechnicalId(...)

Existing source evidence establishes:

RETRIEVE_ROUTE = PRESENT
RETRIEVE_CONTROLLER = PRESENT
RETRIEVE_SERVICE = PRESENT
RETRIEVE_REPOSITORY_DEPENDENCY = PRESENT

The controller also establishes the existing response boundary:

PATIENT_FOUND = HTTP 200
PATIENT_NOT_FOUND = HTTP 404

However, the available evidence does not establish an independent full historical runtime closure equivalent to the proven Register New Patient operation.

Therefore:

RETRIEVE_EXISTING_PATIENT_EVIDENCE = PARTIALLY_ESTABLISHED
RETRIEVE_EXISTING_PATIENT_FULL_RUNTIME_PROOF = NOT_YET_ESTABLISHED
RETRIEVE_EXISTING_PATIENT_BOUNDARY = ESTABLISHED
RETRIEVE_EXISTING_PATIENT_AUTHORITY = NOT_YET_GRANTED

### 25.5 Operation Comparison

The two current scope candidates are therefore treated independently.

REGISTER_NEW_PATIENT:

ROUTE = PRESENT
CONTROLLER = PRESENT
SERVICE = PRESENT
PERSISTENCE = PROVEN
RUNTIME = PROVEN
TRANSACTION = PROVEN
REGRESSION = PROVEN
CURRENT_AUTHORITY = NOT_GRANTED

RETRIEVE_EXISTING_PATIENT:

ROUTE = PRESENT
CONTROLLER = PRESENT
SERVICE = PRESENT
PERSISTENCE_DEPENDENCY = PRESENT
FULL_RUNTIME_PROOF = NOT_YET_ESTABLISHED
CURRENT_AUTHORITY = NOT_GRANTED

No operation inherits the proof state of the other.

### 25.6 Operation-Level Grant Preconditions

Before a current API authority grant can be issued, the following must be resolved for each candidate independently:

REGISTER_NEW_PATIENT:

- current authority decision;
- exact authorized route;
- exact authorized controller;
- exact authorized service;
- runtime boundary;
- test boundary;
- persistence dependency;
- explicit exclusions.

RETRIEVE_EXISTING_PATIENT:

- current authority decision;
- exact authorized route;
- exact authorized controller;
- exact authorized service;
- full runtime proof;
- runtime boundary;
- test boundary;
- persistence dependency;
- explicit exclusions.

### 25.7 Current Operation-Level Determination

The current evidence establishes two candidate operations but does not yet grant implementation authority to either operation.

Therefore:

OPERATION_LEVEL_AUTHORITY_RECONCILIATION = ESTABLISHED

REGISTER_NEW_PATIENT_CURRENT_AUTHORITY = NOT_GRANTED

RETRIEVE_EXISTING_PATIENT_CURRENT_AUTHORITY = NOT_GRANTED

REGISTER_NEW_PATIENT_IMPLEMENTATION_AUTHORIZED = NO

RETRIEVE_EXISTING_PATIENT_IMPLEMENTATION_AUTHORIZED = NO

CURRENT_API_IMPLEMENTATION_AUTHORIZED = NO

API_IMPLEMENTATION_EXECUTION = BLOCKED

FAIL = 0

## 26. CURRENT API AUTHORITY GRANT PRECONDITIONS AND DECISION BOUNDARY

### 26.1 Purpose

This section defines the exact preconditions that must be satisfied before a current API authority grant may be considered.

This section does not issue the grant.

The existence of satisfied preconditions shall not be interpreted as automatic authorization.

The grant remains a separate explicit decision.

### 26.2 Grant Separation Principle

Current API authority consists of two distinct stages:

STAGE A:
AUTHORITY_GRANT_PRECONDITIONS

STAGE B:
EXPLICIT_CURRENT_API_AUTHORITY_DECISION

Completion of Stage A does not automatically execute Stage B.

Therefore:

PRECONDITIONS = NECESSARY
PRECONDITIONS = NOT_SUFFICIENT_BY_THEMSELVES

No implementation may begin merely because all preconditions have been demonstrated.

### 26.3 Mandatory Preconditions

A current API authority grant may be considered only after all of the following have been explicitly reconciled:

1. Current API scope is explicitly bounded.
2. Each authorized operation is explicitly named.
3. Each authorized route is explicitly named.
4. Each authorized controller is explicitly named.
5. Each authorized application service is explicitly named.
6. Runtime authority boundary is explicitly named.
7. Test authority boundary is explicitly named.
8. Persistence dependencies are explicitly named.
9. Authorization contract conformance is proven.
10. Domain invariants are preserved.
11. Existing persistence closure remains unchanged.
12. No new database schema is introduced.
13. No new SQL authority is introduced.
14. No unauthorized repository expansion is introduced.
15. No new actor authority is introduced.
16. No new product capability is introduced.
17. No authentication implementation is introduced unless separately authorized.
18. No authorization implementation is introduced unless separately authorized.
19. Regression evidence is available.
20. FAIL = 0.

### 26.4 Register New Patient — Grant Preconditions

For:

POST /patients

The following evidence is already established:

ROUTE = ESTABLISHED
CONTROLLER = ESTABLISHED
SERVICE = ESTABLISHED
PERSISTENCE = PROVEN
REAL_DATABASE = PROVEN
TRANSACTION = PROVEN
ROLLBACK = PROVEN
CPN_AUTHORITY = PROVEN
REGRESSION = PROVEN
BOUNDARY = ESTABLISHED

The following remains a separate current authority decision:

REGISTER_NEW_PATIENT_CURRENT_AUTHORITY = NOT_GRANTED

Therefore:

REGISTER_NEW_PATIENT_PRECONDITIONS = SUBSTANTIALLY_ESTABLISHED
REGISTER_NEW_PATIENT_GRANT = NOT_ISSUED

### 26.5 Retrieve Existing Patient — Grant Preconditions

For:

GET /patients/:patientId

The following evidence is established:

ROUTE = ESTABLISHED
CONTROLLER = ESTABLISHED
SERVICE = ESTABLISHED
PERSISTENCE_DEPENDENCY = ESTABLISHED
BOUNDARY = ESTABLISHED

The following remains unresolved:

FULL_RUNTIME_PROOF = NOT_YET_ESTABLISHED

Therefore:

RETRIEVE_EXISTING_PATIENT_PRECONDITIONS = NOT_YET_COMPLETE
RETRIEVE_EXISTING_PATIENT_GRANT = NOT_ISSUED

### 26.6 Runtime Boundary

Any future current API authority must identify the exact runtime boundary.

The runtime boundary must remain limited to the already established application/API runtime environment.

It must not authorize:

- deployment expansion;
- production exposure;
- external service integration;
- new infrastructure;
- new authentication infrastructure;
- new authorization infrastructure;
- UI implementation;
- real-user operation.

Therefore:

CURRENT_API_RUNTIME_AUTHORITY = NOT_GRANTED
PRODUCTION_RUNTIME_AUTHORITY = NONE

### 26.7 Persistence Boundary

Any future API authority must depend only on the already closed persistence boundary unless a separate persistence authority decision is issued.

The current API authority process does not reopen:

- database schema;
- table structure;
- sequence authority;
- persistence contracts;
- repository physical authority;
- rollback guarantees;
- data preservation guarantees.

Therefore:

API_PERSISTENCE_BOUNDARY = EXISTING_CLOSED_PERSISTENCE_ONLY

PERSISTENCE_REOPENED_BY_API_RECONCILIATION = NO

DATA_PRESERVATION = PROTECTED

### 26.8 Unauthorized Expansion Barrier

A current API authority grant must not silently authorize any adjacent implementation layer.

The following remain outside the grant unless separately authorized:

AUTHENTICATION = NOT_GRANTED
AUTHORIZATION = NOT_GRANTED
DATABASE_SCHEMA = NOT_GRANTED
SQL_EXPANSION = NOT_GRANTED
REPOSITORY_EXPANSION = NOT_GRANTED
DOMAIN_EXPANSION = NOT_GRANTED
ACTOR_EXPANSION = NOT_GRANTED
UI_IMPLEMENTATION = NOT_GRANTED
DEPLOYMENT = NOT_GRANTED
PRODUCTION_USE = NOT_GRANTED
REAL_USE = NOT_GRANTED
REAL_PILOT = NOT_GRANTED

### 26.9 Explicit Decision Boundary

The authority boundary is reached only when a separate decision explicitly declares:

CURRENT_API_AUTHORITY = GRANTED

and identifies:

- authorized operations;
- authorized routes;
- authorized controllers;
- authorized services;
- runtime boundary;
- test boundary;
- persistence dependencies;
- exclusions.

Without that explicit declaration:

CURRENT_API_AUTHORITY = NOT_GRANTED

No implicit grant shall be inferred from evidence, implementation existence, historical authorization, or completed persistence closure.

### 26.10 Current State

CURRENT_API_AUTHORITY_GRANT_PRECONDITIONS = DEFINED

REGISTER_NEW_PATIENT_PRECONDITIONS = SUBSTANTIALLY_ESTABLISHED
REGISTER_NEW_PATIENT_GRANT = NOT_ISSUED

RETRIEVE_EXISTING_PATIENT_PRECONDITIONS = NOT_YET_COMPLETE
RETRIEVE_EXISTING_PATIENT_GRANT = NOT_ISSUED

CURRENT_API_RUNTIME_AUTHORITY = NOT_GRANTED
API_PERSISTENCE_BOUNDARY = EXISTING_CLOSED_PERSISTENCE_ONLY

CURRENT_API_AUTHORITY = NOT_GRANTED
CURRENT_API_IMPLEMENTATION_AUTHORIZED = NO
API_IMPLEMENTATION_EXECUTION = BLOCKED

FAIL = 0

## 27. CURRENT API AUTHORITY EVIDENCE RECONCILIATION

### 27.1 Purpose

This section reconciles the evidence sources that may support a future current API authority decision.

The purpose is to establish which sources are authoritative, which sources are supporting evidence, and which sources are historical evidence only.

This section does not issue current API authority.

This section does not authorize implementation.

### 27.2 Authority Source Hierarchy

Current API authority must be derived from the current architectural authority chain.

The applicable authority order is:

1. Current explicit authority decision.
2. Current closed technical and application contracts.
3. Current persistence closure and reconciliation decisions.
4. Current API surface and boundary definitions.
5. Current implementation evidence.
6. Historical authorization and implementation evidence.

Lower-level evidence cannot override a higher-level current authority decision.

Historical evidence cannot override a current explicit NO decision.

### 27.3 Current Primary Authority Sources

The following current artifacts are recognized as authority-bearing inputs for reconciliation:

APPLICATION-CAPABILITY-CONTRACT-V1
AUTHORIZATION-TECHNICAL-CONTRACT-V1
PERSISTENCE-TECHNICAL-CONTRACT-V1
PERSISTENCE-COMPLETE-CLOSURE-DECISION-V1
API-TECHNICAL-CONTRACT-V1
API-SURFACE-DEFINITION-V1
API-SURFACE-CLOSURE-DECISION-V1
API-SERVER-RUNTIME-CONTRACT-V1
API-AUTHORITY-REESTABLISHMENT-DECISION-V1

These artifacts define boundaries, capabilities, contracts, persistence authority, API surface, runtime constraints, and the current authority reconstruction process.

### 27.4 Current Contract Reconciliation

The current contract set establishes:

APPLICATION_CAPABILITY_AUTHORITY = EXISTING_CLOSED_CAPABILITIES

AUTHORIZATION_MODEL = CLOSED_AND_PROVEN

PERSISTENCE_AUTHORITY = CLOSED_AND_PROVEN

API_TECHNICAL_BOUNDARY = DEFINED

API_SURFACE = DEFINED

API_RUNTIME_BOUNDARY = DEFINED

However, the contracts do not by themselves issue current API implementation authority.

Therefore:

CURRENT_API_IMPLEMENTATION_AUTHORITY_FROM_CONTRACTS = NOT_GRANTED

### 27.5 Persistence Closure Reconciliation

Persistence closure establishes:

PERSISTENCE_COMPLETE_CLOSURE = CLOSED
PERSISTENCE_LIVE_RECONCILIATION = CLOSED
DATA_PRESERVATION = PROVEN
ROLLBACK_SAFETY = PROVEN
REGRESSION = PROVEN

The persistence closure explicitly does not grant API implementation authority.

Therefore:

PERSISTENCE_TO_API_AUTHORITY_INHERITANCE = NO

PERSISTENCE_CLOSURE_AUTHORIZES_API_IMPLEMENTATION = NO

### 27.6 API Surface Reconciliation

The API Surface Definition establishes the intended API surface of 17 operations.

The API Surface Closure establishes:

API_SURFACE_ENTRIES = 17
DIRECTLY_SUPPORTED_OPERATIONS = 14
API_SURFACE_REVIEW_ITEMS = 3
UNAUTHORIZED_OPERATIONS = 0
UNAUTHORIZED_EXPANSION = NO
AUTHORITY_RECONCILIATION = PASS
DOMAIN_RECONCILIATION = PASS
TECHNICAL_BOUNDARY_RECONCILIATION = PASS
FAIL = 0

The API Surface does not automatically authorize implementation of every defined operation.

Therefore:

API_SURFACE_TO_IMPLEMENTATION_AUTHORITY = NO

### 27.7 Current Implementation Evidence Reconciliation

Current repository evidence establishes two API route registrations:

POST /patients
GET /patients/:patientId

The implementation evidence further establishes:

REGISTER_NEW_PATIENT = IMPLEMENTED
REGISTER_NEW_PATIENT_RUNTIME_PROOF = PROVEN

RETRIEVE_EXISTING_PATIENT = IMPLEMENTED
RETRIEVE_EXISTING_PATIENT_FULL_RUNTIME_PROOF = NOT_YET_ESTABLISHED

The existence of implementation is treated as evidence, not as current authority.

Therefore:

IMPLEMENTATION_EXISTENCE_TO_CURRENT_AUTHORITY = NO

### 27.8 Historical Authorization Reconciliation

Historical API implementation authorization established:

API_IMPLEMENTATION_AUTHORIZATION = CLOSED DECISION
API_ROUTE_IMPLEMENTATION_AUTHORIZED = YES
API_CONTROLLER_IMPLEMENTATION_AUTHORIZED = YES
API_SERVICE_IMPLEMENTATION_AUTHORIZED = YES
FAIL = 0

This historical decision remains valid as historical evidence.

It does not override the current authority reconstruction.

Therefore:

HISTORICAL_API_AUTHORIZATION = EVIDENCE

CURRENT_API_AUTHORIZATION = GOVERNED_BY_CURRENT_DECISION

HISTORICAL_AUTHORIZATION_TO_CURRENT_AUTHORITY_INHERITANCE = NO

### 27.9 Current Decision Reconciliation

The current API Authority Reestablishment Decision currently establishes:

CURRENT_API_SCOPE_GRANT = NOT_YET_GRANTED

CURRENT_API_AUTHORITY = NOT_GRANTED

CURRENT_API_IMPLEMENTATION_AUTHORIZED = NO

API_IMPLEMENTATION_EXECUTION = BLOCKED

Therefore, all reconciled evidence remains subordinate to the current explicit authority state.

### 27.10 Evidence Classification

The current evidence is classified as follows:

CURRENT_CONTRACTS = AUTHORITY_INPUT

PERSISTENCE_CLOSURE = CLOSED_AUTHORITY_INPUT

API_SURFACE = AUTHORITY_INPUT

CURRENT_IMPLEMENTATION = SUPPORTING_EVIDENCE

HISTORICAL_AUTHORIZATION = HISTORICAL_EVIDENCE

HISTORICAL_RUNTIME_PROOF = HISTORICAL_EVIDENCE

NONE_OF_THE_ABOVE_IMPLICITLY_GRANTS_CURRENT_API_AUTHORITY = YES

### 27.11 Reconciliation Result

The evidence sources are internally reconcilable.

No current source identified in this reconciliation grants API implementation authority independently of an explicit current authority decision.

No historical source overrides the current NO state.

No persistence source expands into API authority.

No API Surface definition expands into automatic implementation authority.

No implementation existence expands into authority.

Therefore:

CURRENT_API_AUTHORITY_EVIDENCE_RECONCILIATION = PASS

CURRENT_API_AUTHORITY = NOT_GRANTED

CURRENT_API_IMPLEMENTATION_AUTHORIZED = NO

API_IMPLEMENTATION_EXECUTION = BLOCKED

FAIL = 0
## 28. CURRENT API AUTHORITY DECISION FRAMEWORK

### 28.1 Purpose

This section defines the structure and minimum content of a future current API authority decision.

It does not issue the decision.

It does not authorize implementation.

It defines the decision boundary that must be satisfied before current API authority may be explicitly granted.

### 28.2 Decision Independence

The future current API authority decision shall be an explicit and independent authority decision.

It shall not be inferred from:

- persistence closure;
- API Surface closure;
- historical API authorization;
- implementation existence;
- runtime proof;
- regression PASS;
- application service existence.

Therefore:

CURRENT_API_AUTHORITY_DECISION = EXPLICIT_REQUIRED

IMPLICIT_API_AUTHORITY = PROHIBITED

### 28.3 Required Decision Inputs

A future current API authority decision must reconcile all of the following:

1. Current bounded API scope.
2. Operation-level authority evidence.
3. Route evidence.
4. Controller evidence.
5. Service evidence.
6. Runtime boundary.
7. Test boundary.
8. Persistence dependencies.
9. Authorization contract.
10. Domain invariants.
11. Data preservation requirements.
12. Rollback safety.
13. Regression evidence.
14. Unauthorized expansion exclusions.
15. Historical authorization reconciliation.
16. Current unresolved evidence gaps.

### 28.4 Authorized Scope Declaration

A future decision must explicitly identify every operation that receives authority.

For each authorized operation, the decision must identify:

OPERATION
ROUTE
HTTP_METHOD
CONTROLLER
APPLICATION_SERVICE
RUNTIME_BOUNDARY
TEST_BOUNDARY
PERSISTENCE_DEPENDENCIES

No operation may receive authority through an unbounded statement such as:

"API implementation is authorized."

Authority must be operation-specific and bounded.

### 28.5 Explicit Exclusions

A future current API authority decision must explicitly preserve the following exclusions unless separately authorized:

AUTHENTICATION = NOT_GRANTED
AUTHORIZATION = NOT_GRANTED
DATABASE_SCHEMA = NOT_GRANTED
SQL_EXPANSION = NOT_GRANTED
REPOSITORY_EXPANSION = NOT_GRANTED
DOMAIN_EXPANSION = NOT_GRANTED
ACTOR_EXPANSION = NOT_GRANTED
UI_IMPLEMENTATION = NOT_GRANTED
DEPLOYMENT = NOT_GRANTED
PRODUCTION_USE = NOT_GRANTED
REAL_USE = NOT_GRANTED
REAL_PILOT = NOT_GRANTED

The decision must not silently expand into any excluded layer.

### 28.6 Persistence Protection

Any future API authority decision must preserve the closed persistence boundary.

The decision must not:

- reopen persistence closure;
- redefine physical persistence authority;
- alter database schema authority;
- replace persistence contracts;
- weaken rollback guarantees;
- weaken data preservation guarantees.

Therefore:

PERSISTENCE_BOUNDARY = EXISTING_CLOSED_PERSISTENCE_ONLY

DATA_PRESERVATION = PROTECTED

ROLLBACK_SAFETY = PROTECTED

### 28.7 Evidence Gap Rule

Any unresolved evidence gap affecting an operation must remain visible.

An unresolved evidence gap must not be converted into:

- assumption;
- inferred PASS;
- inherited proof;
- implied authority.

Therefore:

UNRESOLVED_EVIDENCE = VISIBLE

UNRESOLVED_EVIDENCE = NON_AUTHORIZING

For the current candidates:

REGISTER_NEW_PATIENT_EVIDENCE_GAP = CURRENT_GRANT_DECISION

RETRIEVE_EXISTING_PATIENT_FULL_RUNTIME_PROOF = NOT_YET_ESTABLISHED

### 28.8 Grant Conditions

A future current API authority grant may be issued only if the decision establishes:

CURRENT_API_SCOPE = EXPLICIT

AUTHORIZED_OPERATIONS = EXPLICIT

AUTHORIZED_ROUTES = EXPLICIT

AUTHORIZED_CONTROLLERS = EXPLICIT

AUTHORIZED_SERVICES = EXPLICIT

RUNTIME_BOUNDARY = EXPLICIT

TEST_BOUNDARY = EXPLICIT

PERSISTENCE_DEPENDENCIES = EXPLICIT

EXCLUSIONS = EXPLICIT

REGRESSION = PASS

FAIL = 0

If any required element remains unresolved, the corresponding operation must remain NOT_GRANTED.

### 28.9 Decision Outcomes

The future decision may distinguish between:

CURRENT_API_AUTHORITY = GRANTED

CURRENT_API_AUTHORITY = PARTIALLY_GRANTED

CURRENT_API_AUTHORITY = NOT_GRANTED

A partial grant must identify the exact operations receiving authority.

No partial grant may be interpreted as authorization for operations not explicitly listed.

### 28.10 Current Decision State

At the current stage, the decision has not yet been issued.

Therefore:

CURRENT_API_AUTHORITY_DECISION = NOT_YET_ISSUED

CURRENT_API_AUTHORITY = NOT_GRANTED

CURRENT_API_IMPLEMENTATION_AUTHORIZED = NO

API_IMPLEMENTATION_EXECUTION = BLOCKED

### 28.11 Current Candidate State

REGISTER_NEW_PATIENT:

CANDIDATE = YES
EVIDENCE = ESTABLISHED
BOUNDARY = ESTABLISHED
CURRENT_AUTHORITY = NOT_GRANTED

RETRIEVE_EXISTING_PATIENT:

CANDIDATE = YES
EVIDENCE = PARTIALLY_ESTABLISHED
BOUNDARY = ESTABLISHED
FULL_RUNTIME_PROOF = NOT_YET_ESTABLISHED
CURRENT_AUTHORITY = NOT_GRANTED

### 28.12 Decision Safety Rule

No future authority decision may authorize more than the evidence and boundaries explicitly support.

Authority shall be bounded by the smallest proven implementation scope.

Therefore:

AUTHORITY_SCOPE <= PROVEN_EVIDENCE_SCOPE

AUTHORITY_SCOPE <= CLOSED_CONTRACT_SCOPE

AUTHORITY_SCOPE <= PERSISTENCE_BOUNDARY

UNPROVEN_SCOPE = NOT_AUTHORIZED

### 28.13 Final Framework State

CURRENT_API_AUTHORITY_DECISION_FRAMEWORK = ESTABLISHED

CURRENT_API_AUTHORITY_DECISION = NOT_YET_ISSUED

CURRENT_API_AUTHORITY = NOT_GRANTED

CURRENT_API_IMPLEMENTATION_AUTHORIZED = NO

API_IMPLEMENTATION_EXECUTION = BLOCKED

FAIL = 0

## 29. OPERATION-LEVEL API GRANT READINESS RECONCILIATION

### 29.1 Purpose

This section evaluates the current grant readiness of each existing API operation independently.

It does not issue current API authority.

It does not authorize implementation.

It does not expand the API Surface.

Its purpose is to determine whether each current API operation has sufficient evidence and bounded conditions to become eligible for a future explicit authority decision.

### 29.2 Operation Independence

Each API operation must be evaluated independently.

No operation may inherit:

- authority;
- runtime proof;
- controller proof;
- service proof;
- persistence proof;
- regression proof;

from another operation merely because both belong to the same API layer.

Therefore:

OPERATION_AUTHORITY_INHERITANCE = PROHIBITED

OPERATION_PROOF_INHERITANCE = PROHIBITED

OPERATION_GRANT_INHERITANCE = PROHIBITED

### 29.3 Current Operation Set

The current implemented API operation set is:

OPERATION_01 = POST /patients
OPERATION_02 = GET /patients/:patientId

No additional implemented API operation is included in the current grant-readiness evaluation.

Therefore:

CURRENT_IMPLEMENTED_API_OPERATION_COUNT = 2

UNIMPLEMENTED_API_SURFACE_OPERATIONS = OUTSIDE_CURRENT_IMPLEMENTED_SET

### 29.4 Register New Patient Readiness

Operation:

REGISTER_NEW_PATIENT

Route:

POST /patients

Controller:

registerNewPatientController

Application Service:

registerNewPatient

Current evidence establishes:

FASTIFY_RUNTIME = PASS

DB_POOL_WIRING = PASS

PATIENT_REPOSITORY_WIRING = PASS

POST_PATIENT_ROUTE = PASS

CONTROLLER_BOUNDARY = PASS

APPLICATION_SERVICE_BOUNDARY = PASS

BOUNDED_SQL = PASS

REAL_POSTGRESQL_PERSISTENCE = PASS

PATIENT_REGISTRATION_TRANSACTION = PASS

TRANSACTION_COMMIT = PASS

TRANSACTION_ROLLBACK = PASS

CPN_UNIQUENESS = PASS

CPN_CONCURRENT_ALLOCATION = PASS

API_TO_DATABASE_PERSISTENCE = PASS

DATA_PRESERVATION = PROTECTED

ROLLBACK_SAFETY = PROTECTED

Therefore:

REGISTER_NEW_PATIENT_EVIDENCE = ESTABLISHED

REGISTER_NEW_PATIENT_BOUNDARY = ESTABLISHED

REGISTER_NEW_PATIENT_PERSISTENCE_DEPENDENCY = EXISTING_CLOSED_PERSISTENCE

REGISTER_NEW_PATIENT_GRANT_READINESS = HIGH_BUT_NOT_AUTHORIZED

REGISTER_NEW_PATIENT_CURRENT_AUTHORITY = NOT_GRANTED

### 29.5 Register New Patient Authority Boundary

The current evidence supports only the existing registration implementation.

It does not authorize:

- new patient capabilities;
- new patient fields outside established contracts;
- new persistence structures;
- new repository behavior;
- new SQL authority;
- authentication implementation;
- authorization implementation;
- UI implementation;
- deployment;
- production use.

Therefore:

REGISTER_NEW_PATIENT_SCOPE = EXISTING_IMPLEMENTATION_ONLY

REGISTER_NEW_PATIENT_EXPANSION = NOT_AUTHORIZED

REGISTER_NEW_PATIENT_AUTHENTICATION = NOT_GRANTED

REGISTER_NEW_PATIENT_AUTHORIZATION = NOT_GRANTED

REGISTER_NEW_PATIENT_SCHEMA_EXPANSION = NOT_GRANTED

REGISTER_NEW_PATIENT_PRODUCTION_USE = NOT_GRANTED

### 29.6 Retrieve Existing Patient Readiness

Operation:

RETRIEVE_EXISTING_PATIENT

Route:

GET /patients/:patientId

Controller:

retrieveExistingPatientController

Application Service:

retrieveExistingPatient

Current evidence establishes:

ROUTE_IMPLEMENTATION = PRESENT

CONTROLLER_IMPLEMENTATION = PRESENT

SERVICE_IMPLEMENTATION = PRESENT

REPOSITORY_DEPENDENCY = PRESENT

BOUNDARY = ESTABLISHED

However:

RETRIEVE_EXISTING_PATIENT_FULL_RUNTIME_PROOF = NOT_YET_ESTABLISHED

Therefore:

RETRIEVE_EXISTING_PATIENT_EVIDENCE = PARTIALLY_ESTABLISHED

RETRIEVE_EXISTING_PATIENT_BOUNDARY = ESTABLISHED

RETRIEVE_EXISTING_PATIENT_GRANT_READINESS = INCOMPLETE

RETRIEVE_EXISTING_PATIENT_CURRENT_AUTHORITY = NOT_GRANTED

### 29.7 Retrieve Existing Patient Evidence Gap

The missing full runtime proof is an explicit evidence gap.

It must not be converted into an assumed PASS.

It must not inherit the registration operation's runtime proof.

It must not be treated as equivalent to implementation existence.

Therefore:

RETRIEVE_EXISTING_PATIENT_EVIDENCE_GAP = OPEN

RETRIEVE_EXISTING_PATIENT_RUNTIME_PROOF = REQUIRED

RETRIEVE_EXISTING_PATIENT_AUTHORITY = NOT_GRANTED

RETRIEVE_EXISTING_PATIENT_INHERITED_PROOF = PROHIBITED

### 29.8 Comparative Readiness Matrix

The current readiness state is:

REGISTER_NEW_PATIENT:
EVIDENCE = ESTABLISHED
BOUNDARY = ESTABLISHED
PERSISTENCE = ESTABLISHED
RUNTIME_PROOF = PROVEN
GRANT_READINESS = HIGH_BUT_NOT_AUTHORIZED
CURRENT_AUTHORITY = NOT_GRANTED

RETRIEVE_EXISTING_PATIENT:
EVIDENCE = PARTIALLY_ESTABLISHED
BOUNDARY = ESTABLISHED
PERSISTENCE = EXISTING_CLOSED_PERSISTENCE
RUNTIME_PROOF = NOT_YET_ESTABLISHED
GRANT_READINESS = INCOMPLETE
CURRENT_AUTHORITY = NOT_GRANTED

### 29.9 Grant Readiness Rule

Grant readiness is not authority.

An operation may satisfy all currently known readiness conditions and still require an explicit authority decision.

Therefore:

GRANT_READINESS != AUTHORITY

GRANT_READINESS_DOES_NOT_GRANT_AUTHORITY = YES

CURRENT_API_AUTHORITY_REMAINS_EXPLICIT = YES

### 29.10 Minimal Grant Principle

If a future authority decision is issued, it must authorize only operations whose evidence, boundaries, dependencies, and test conditions are explicitly established.

The future decision must not authorize the complete API merely because one operation is ready.

Therefore:

FUTURE_GRANT_SCOPE = MINIMUM_EXPLICIT_PROVEN_SCOPE

UNPROVEN_OPERATION = NOT_AUTHORIZED

UNRESOLVED_OPERATION = NOT_AUTHORIZED

### 29.11 Current Readiness Determination

The operation-level reconciliation establishes:

REGISTER_NEW_PATIENT_GRANT_READINESS = HIGH_BUT_NOT_AUTHORIZED

RETRIEVE_EXISTING_PATIENT_GRANT_READINESS = INCOMPLETE

CURRENT_API_AUTHORITY = NOT_GRANTED

CURRENT_API_IMPLEMENTATION_AUTHORIZED = NO

API_IMPLEMENTATION_EXECUTION = BLOCKED

### 29.12 Final Reconciliation State

OPERATION_LEVEL_API_GRANT_READINESS = ESTABLISHED

IMPLEMENTED_OPERATION_COUNT = 2

REGISTER_NEW_PATIENT = READY_FOR_EXPLICIT_DECISION_ONLY

RETRIEVE_EXISTING_PATIENT = NOT_READY_FOR_GRANT

CURRENT_API_AUTHORITY = NOT_GRANTED

CURRENT_API_IMPLEMENTATION_AUTHORIZED = NO

API_IMPLEMENTATION_EXECUTION = BLOCKED

FAIL = 0

## 30. REGISTER NEW PATIENT AUTHORITY DECISION INPUT PACKAGE

### 30.1 Purpose

This section establishes the complete decision-input package for the REGISTER NEW PATIENT API operation.

It isolates the operation from all other API operations.

It does not issue current API authority.

It does not authorize implementation.

It does not authorize authentication or authorization implementation.

It does not expand the existing API Surface.

### 30.2 Operation Identity

OPERATION = REGISTER_NEW_PATIENT

ROUTE = POST /patients

CONTROLLER = registerNewPatientController

APPLICATION_SERVICE = registerNewPatient

CURRENT_OPERATION_IMPLEMENTATION = PRESENT

CURRENT_OPERATION_AUTHORITY = NOT_GRANTED

### 30.3 Application Capability Traceability

The operation exposes an already-established application capability:

PATIENT_REGISTRATION_CAPABILITY = EXISTING

The operation does not create a new product capability.

The operation does not redefine Patient identity.

The operation does not redefine Clinic Patient Number authority.

The operation does not redefine Patient persistence authority.

Therefore:

CAPABILITY_EXPANSION = NO

DOMAIN_EXPANSION = NO

ACTOR_EXPANSION = NO

### 30.4 Route Boundary

The current route is:

POST /patients

The route boundary is limited to the existing Patient registration operation.

No additional HTTP method is authorized by this package.

No additional Patient route is authorized by this package.

Therefore:

ROUTE_SCOPE = POST /patients ONLY

ADDITIONAL_ROUTE_AUTHORITY = NOT_GRANTED

### 30.5 Controller Boundary

The current controller is:

registerNewPatientController

The controller delegates to the existing application service:

registerNewPatient

The controller does not become a source of:

- domain authority;
- persistence authority;
- authentication authority;
- authorization authority;
- schema authority.

Therefore:

CONTROLLER_SCOPE = EXISTING_CONTROLLER_ONLY

CONTROLLER_DOMAIN_EXPANSION = NO

CONTROLLER_PERSISTENCE_EXPANSION = NO

### 30.6 Application Service Boundary

The existing application service is:

registerNewPatient

Its established responsibility includes:

- beginning the registration transaction;
- requesting Clinic Patient Number allocation;
- constructing the Patient domain object;
- persisting the Patient;
- committing the transaction;
- rolling back on failure.

Therefore:

SERVICE_SCOPE = EXISTING_REGISTER_NEW_PATIENT_BEHAVIOR

SERVICE_EXPANSION = NOT_AUTHORIZED

### 30.7 Persistence Dependency

The operation depends on the existing closed persistence boundary.

Established dependencies include:

PATIENT_REPOSITORY = EXISTING

CLINIC_PATIENT_NUMBER_SEQUENCE = EXISTING

PATIENT_TABLE = EXISTING

POSTGRESQL_TRANSACTION = EXISTING

Therefore:

PERSISTENCE_DEPENDENCY = EXISTING_CLOSED_PERSISTENCE_ONLY

PERSISTENCE_REOPENING = NO

SCHEMA_EXPANSION = NO

NEW_TABLE_AUTHORITY = NO

NEW_SEQUENCE_AUTHORITY = NO

### 30.8 Transaction Boundary

The established registration flow is transactional.

Required behavior:

BEGIN

ALLOCATE_CLINIC_PATIENT_NUMBER

CONSTRUCT_PATIENT

CREATE_PATIENT

COMMIT

On failure:

ROLLBACK

Therefore:

TRANSACTION_COMMIT = PROVEN

TRANSACTION_ROLLBACK = PROVEN

PARTIAL_REGISTRATION = PROHIBITED

DATA_PRESERVATION = PROTECTED

ROLLBACK_SAFETY = PROTECTED

### 30.9 Clinic Patient Number Authority

Clinic Patient Number allocation remains under the established PostgreSQL sequence authority.

Therefore:

CPN_AUTHORITY = POSTGRESQL

CPN_SEQUENCE = clinic_patient_number_seq

CPN_UNIQUENESS = PROVEN

CPN_CONCURRENT_ALLOCATION = PROVEN

CPN_API_REDEFINITION = NOT_AUTHORIZED

The API operation exposes the established result and does not become the authority for CPN generation.

### 30.10 Runtime Evidence

Current evidence establishes:

FASTIFY_RUNTIME = PASS

DB_POOL_WIRING = PASS

PATIENT_REPOSITORY_WIRING = PASS

POST_PATIENT_ROUTE = PASS

CONTROLLER_BOUNDARY = PASS

APPLICATION_SERVICE_BOUNDARY = PASS

REAL_POSTGRESQL_PERSISTENCE = PASS

PATIENT_REGISTRATION_TRANSACTION = PASS

API_TO_DATABASE_PERSISTENCE = PASS

Therefore:

REGISTER_NEW_PATIENT_RUNTIME_EVIDENCE = PROVEN

### 30.11 Data Preservation Evidence

The registration operation preserves the existing Patient persistence boundary.

Established evidence includes:

PATIENT_IDENTITY_PRESERVED = PASS

CPN_DISTINCT_FROM_TECHNICAL_IDENTITY = PASS

PATIENT_DOMAIN_CONSTRUCTION_PRESERVED = PASS

REAL_POSTGRESQL_COMMIT = PASS

REAL_POSTGRESQL_ROLLBACK = PASS

NO_PARTIAL_PATIENT_REGISTRATION = PASS

Therefore:

REGISTER_NEW_PATIENT_DATA_PRESERVATION = PROVEN

### 30.12 Authorization Boundary

The operation remains subject to the closed Authorization Technical Contract.

This package does not authorize:

AUTHENTICATION_IMPLEMENTATION = NO

AUTHORIZATION_IMPLEMENTATION = NO

NEW_ACTOR = NO

ACTOR_EXPANSION = NO

PERMISSION_EXPANSION = NO

The operation must preserve the existing Doctor/Nurse authority model.

### 30.13 Test Boundary

The decision package may rely only on tests and proof that directly establish the operation's behavior and boundaries.

Required test evidence must cover:

ROUTE_BEHAVIOR

CONTROLLER_BOUNDARY

SERVICE_BEHAVIOR

PERSISTENCE_BEHAVIOR

TRANSACTION_COMMIT

TRANSACTION_ROLLBACK

CPN_ALLOCATION

DATA_PRESERVATION

REGRESSION

No unrelated test result shall be treated as automatic authority for this operation.

### 30.14 Unauthorized Expansion Barrier

This package does not authorize:

PAST_HISTORY_API = NO

CLINICAL_HISTORY_API = NO

CASE_API = NO

VISIT_API = NO

CLINIC_DAY_API = NO

NURSE_DELEGATION_API = NO

DOCTOR_NOTIFICATION_API = NO

AUTHENTICATION_API = NO

AUTHORIZATION_API = NO

UI_IMPLEMENTATION = NO

DEPLOYMENT = NO

PRODUCTION_USE = NO

REAL_USE = NO

REAL_PILOT = NO

### 30.15 Decision Readiness

The current evidence establishes the principal implementation, runtime, persistence, transaction, and data-preservation boundaries for REGISTER_NEW_PATIENT.

Therefore:

REGISTER_NEW_PATIENT_DECISION_INPUTS = ESTABLISHED

REGISTER_NEW_PATIENT_EVIDENCE = ESTABLISHED

REGISTER_NEW_PATIENT_BOUNDARY = ESTABLISHED

REGISTER_NEW_PATIENT_PERSISTENCE_DEPENDENCY = ESTABLISHED

REGISTER_NEW_PATIENT_DATA_PRESERVATION = PROVEN

REGISTER_NEW_PATIENT_ROLLBACK_SAFETY = PROVEN

### 30.16 Authority Remains Explicit

Even with the decision inputs established, this package does not issue authority.

Therefore:

REGISTER_NEW_PATIENT_CURRENT_AUTHORITY = NOT_GRANTED

REGISTER_NEW_PATIENT_IMPLEMENTATION_AUTHORIZED = NO

CURRENT_API_AUTHORITY = NOT_GRANTED

API_IMPLEMENTATION_EXECUTION = BLOCKED

### 30.17 Required Future Decision Content

A future explicit decision concerning REGISTER_NEW_PATIENT must identify:

OPERATION = REGISTER_NEW_PATIENT

ROUTE = POST /patients

CONTROLLER = registerNewPatientController

APPLICATION_SERVICE = registerNewPatient

RUNTIME_BOUNDARY = EXISTING_API_RUNTIME_ONLY

TEST_BOUNDARY = EXPLICIT

PERSISTENCE_DEPENDENCIES = EXISTING_CLOSED_PERSISTENCE_ONLY

EXCLUSIONS = EXPLICIT

AUTHORITY_RESULT = EXPLICIT

No broader API authority may be inferred from this operation-specific package.

### 30.18 Final Package State

REGISTER_NEW_PATIENT_AUTHORITY_DECISION_INPUT_PACKAGE = ESTABLISHED

REGISTER_NEW_PATIENT_DECISION_INPUTS = ESTABLISHED

REGISTER_NEW_PATIENT_EVIDENCE = ESTABLISHED

REGISTER_NEW_PATIENT_BOUNDARY = ESTABLISHED

REGISTER_NEW_PATIENT_PERSISTENCE_DEPENDENCY = ESTABLISHED

REGISTER_NEW_PATIENT_DATA_PRESERVATION = PROVEN

REGISTER_NEW_PATIENT_ROLLBACK_SAFETY = PROVEN

REGISTER_NEW_PATIENT_CURRENT_AUTHORITY = NOT_GRANTED

REGISTER_NEW_PATIENT_IMPLEMENTATION_AUTHORIZED = NO

CURRENT_API_AUTHORITY = NOT_GRANTED

API_IMPLEMENTATION_EXECUTION = BLOCKED

FAIL = 0

## 31. REGISTER NEW PATIENT CURRENT AUTHORITY DECISION

### 31.1 Decision Purpose

This section issues the current authority decision for the REGISTER NEW PATIENT API operation only.

The decision is based on the established decision-input package.

The decision does not authorize any other API operation.

The decision does not reopen persistence authority.

The decision does not authorize authentication or authorization implementation.

The decision does not authorize UI, deployment, real use, pilot use, or production use.

### 31.2 Explicit Operation Grant

The current authority decision is explicitly limited to:

OPERATION = REGISTER_NEW_PATIENT

ROUTE = POST /patients

CONTROLLER = registerNewPatientController

APPLICATION_SERVICE = registerNewPatient

Therefore:

REGISTER_NEW_PATIENT_CURRENT_AUTHORITY = GRANTED

REGISTER_NEW_PATIENT_IMPLEMENTATION_AUTHORIZED = YES

### 31.3 Scope of Grant

The grant authorizes only the existing bounded implementation of:

POST /patients

The grant includes only:

- the existing route;
- the existing controller;
- the existing application service;
- the existing repository dependency;
- the existing PostgreSQL transaction boundary;
- the existing Clinic Patient Number allocation dependency;
- the existing proven tests for this operation.

Therefore:

REGISTER_NEW_PATIENT_SCOPE = EXISTING_IMPLEMENTATION_ONLY

REGISTER_NEW_PATIENT_ROUTE_SCOPE = POST /patients ONLY

REGISTER_NEW_PATIENT_CONTROLLER_SCOPE = EXISTING_CONTROLLER_ONLY

REGISTER_NEW_PATIENT_SERVICE_SCOPE = EXISTING_REGISTER_NEW_PATIENT_BEHAVIOR

### 31.4 Persistence Boundary

The grant depends exclusively on the already-closed persistence boundary.

Therefore:

PERSISTENCE_DEPENDENCY = EXISTING_CLOSED_PERSISTENCE_ONLY

PERSISTENCE_REOPENING = NO

DATABASE_SCHEMA_AUTHORITY = NOT_GRANTED

SQL_EXPANSION = NOT_GRANTED

REPOSITORY_EXPANSION = NOT_GRANTED

NEW_TABLE_AUTHORITY = NOT_GRANTED

NEW_SEQUENCE_AUTHORITY = NOT_GRANTED

### 31.5 Transaction and Safety Boundary

The authorized operation must preserve the proven transaction behavior:

TRANSACTION_COMMIT = REQUIRED

TRANSACTION_ROLLBACK = REQUIRED

NO_PARTIAL_PATIENT_REGISTRATION = REQUIRED

DATA_PRESERVATION = REQUIRED

ROLLBACK_SAFETY = REQUIRED

The grant does not permit weakening or bypassing these properties.

### 31.6 Clinic Patient Number Boundary

Clinic Patient Number authority remains with PostgreSQL.

Therefore:

CPN_AUTHORITY = POSTGRESQL

CPN_SEQUENCE = clinic_patient_number_seq

CPN_UNIQUENESS = REQUIRED

CPN_CONCURRENT_ALLOCATION = REQUIRED

CPN_API_REDEFINITION = NOT_AUTHORIZED

The API remains an exposure boundary and does not become the authority for CPN generation.

### 31.7 Authorization Boundary

This decision does not authorize implementation of authentication or authorization.

Therefore:

AUTHENTICATION_IMPLEMENTATION = NOT_GRANTED

AUTHORIZATION_IMPLEMENTATION = NOT_GRANTED

ACTOR_EXPANSION = NOT_GRANTED

PERMISSION_EXPANSION = NOT_GRANTED

The existing Doctor/Nurse authority model remains unchanged.

### 31.8 Domain Boundary

The decision exposes the existing Patient registration capability only.

Therefore:

PATIENT_REGISTRATION_CAPABILITY = EXISTING

DOMAIN_EXPANSION = NOT_GRANTED

NEW_PRODUCT_CAPABILITY = NOT_GRANTED

PATIENT_IDENTITY_REDEFINITION = NOT_GRANTED

PATIENT_DOMAIN_REDEFINITION = NOT_GRANTED

### 31.9 Excluded API Operations

This decision does not grant authority to:

GET /patients/:patientId

GET /patients/:patientId/history

POST /patients/:patientId/past-history

PATCH /patients/:patientId/past-history/:itemId

GET /patients/:patientId/clinical-history

POST /patients/:patientId/cases

POST /cases/:caseId/completion

POST /cases/:caseId/visits

POST /visits/:visitId/arrival

POST /visits/:visitId/clinical-record

POST /visits/:visitId/exit

GET /clinic-days/:clinicDayId/daily-data

POST /clinic-days/:clinicDayId/closure

GET /clinic/nurse-delegation

PATCH /clinic/nurse-delegation

POST /doctor-notifications

Therefore:

OTHER_API_OPERATIONS_AUTHORITY = NOT_GRANTED

### 31.10 Runtime Boundary

The grant applies only to the existing API runtime boundary.

Therefore:

RUNTIME_BOUNDARY = EXISTING_API_RUNTIME_ONLY

FASTIFY_RUNTIME = EXISTING

API_SERVER_EXPANSION = NOT_GRANTED

DEPLOYMENT = NOT_GRANTED

PRODUCTION_RUNTIME_AUTHORITY = NONE

### 31.11 Test Boundary

The granted operation remains bounded by its established evidence.

Required regression state:

REGISTER_NEW_PATIENT_REGRESSION = PASS

FAIL = 0

No unrelated test result creates authority for another operation.

### 31.12 Data Preservation Requirement

The granted operation must preserve existing Patient data integrity.

Therefore:

PATIENT_IDENTITY_PRESERVED = REQUIRED

CPN_DISTINCT_FROM_TECHNICAL_IDENTITY = REQUIRED

REAL_POSTGRESQL_COMMIT = REQUIRED

REAL_POSTGRESQL_ROLLBACK = REQUIRED

NO_PARTIAL_PATIENT_REGISTRATION = REQUIRED

DATA_PRESERVATION = PROTECTED

### 31.13 No Implied Authority

The grant must not be interpreted as:

CURRENT_API_AUTHORITY = FULL_API

It is an operation-specific grant only.

Therefore:

FULL_API_AUTHORITY = NOT_GRANTED

OTHER_OPERATION_AUTHORITY = NOT_GRANTED

IMPLICIT_AUTHORITY = PROHIBITED

AUTHORITY_INHERITANCE = PROHIBITED

### 31.14 Real-Use Boundary

This decision authorizes implementation within the bounded development/API authority only.

It does not authorize:

REAL_USE = NOT_GRANTED

REAL_PILOT = NOT_GRANTED

PRODUCTION_USE = NOT_GRANTED

CLINICAL_USE = NOT_GRANTED

The operation remains within the factory-controlled development boundary.

### 31.15 Current API Authority State

The current API authority state is now partially granted at operation level.

Therefore:

CURRENT_API_AUTHORITY = PARTIALLY_GRANTED

CURRENT_API_AUTHORITY_SCOPE = REGISTER_NEW_PATIENT_ONLY

REGISTER_NEW_PATIENT_CURRENT_AUTHORITY = GRANTED

REGISTER_NEW_PATIENT_IMPLEMENTATION_AUTHORIZED = YES

RETRIEVE_EXISTING_PATIENT_CURRENT_AUTHORITY = NOT_GRANTED

OTHER_API_OPERATION_AUTHORITY = NOT_GRANTED

### 31.16 Decision Integrity

The authority grant is supported by the previously established:

REGISTER_NEW_PATIENT_DECISION_INPUTS = ESTABLISHED

REGISTER_NEW_PATIENT_EVIDENCE = ESTABLISHED

REGISTER_NEW_PATIENT_BOUNDARY = ESTABLISHED

REGISTER_NEW_PATIENT_PERSISTENCE_DEPENDENCY = ESTABLISHED

REGISTER_NEW_PATIENT_DATA_PRESERVATION = PROVEN

REGISTER_NEW_PATIENT_ROLLBACK_SAFETY = PROVEN

Therefore:

AUTHORITY_DECISION_INPUT_CONFORMANCE = PASS

### 31.17 Implementation Boundary After Grant

The grant authorizes the existing REGISTER_NEW_PATIENT implementation only.

It does not authorize new implementation beyond the established operation boundary.

Therefore:

AUTHORIZED_IMPLEMENTATION_SCOPE = REGISTER_NEW_PATIENT_ONLY

UNAUTHORIZED_IMPLEMENTATION_SCOPE = ALL_OTHER_API_OPERATIONS

API_IMPLEMENTATION_EXECUTION = BOUNDED_TO_GRANTED_OPERATION_ONLY

### 31.18 Final Decision

REGISTER_NEW_PATIENT_AUTHORITY_DECISION = GRANTED

REGISTER_NEW_PATIENT_CURRENT_AUTHORITY = GRANTED

REGISTER_NEW_PATIENT_IMPLEMENTATION_AUTHORIZED = YES

CURRENT_API_AUTHORITY = PARTIALLY_GRANTED

CURRENT_API_AUTHORITY_SCOPE = REGISTER_NEW_PATIENT_ONLY

RETRIEVE_EXISTING_PATIENT_CURRENT_AUTHORITY = NOT_GRANTED

OTHER_API_OPERATION_AUTHORITY = NOT_GRANTED

PERSISTENCE_REOPENING = NO

AUTHENTICATION_IMPLEMENTATION = NOT_GRANTED

AUTHORIZATION_IMPLEMENTATION = NOT_GRANTED

UI_IMPLEMENTATION = NOT_GRANTED

DEPLOYMENT = NOT_GRANTED

REAL_USE = NOT_GRANTED

REAL_PILOT = NOT_GRANTED

PRODUCTION_USE = NOT_GRANTED

FAIL = 0

## 32. RETRIEVE EXISTING PATIENT EVIDENCE RECONCILIATION

### 32.1 Purpose

This section reconciles the current implementation evidence for the RETRIEVE EXISTING PATIENT API operation.

This section does not issue authority.

This section does not grant implementation authority.

This section does not inherit authority from REGISTER NEW PATIENT.

### 32.2 Operation Identity

OPERATION = RETRIEVE_EXISTING_PATIENT

ROUTE = GET /patients/:patientId

CONTROLLER = retrieveExistingPatientController

APPLICATION_SERVICE = retrieveExistingPatient

CURRENT_OPERATION_IMPLEMENTATION = PRESENT

CURRENT_OPERATION_AUTHORITY = NOT_GRANTED

### 32.3 Capability Boundary

PATIENT_RETRIEVAL_CAPABILITY = EXISTING

CAPABILITY_EXPANSION = NO

DOMAIN_EXPANSION = NO

ACTOR_EXPANSION = NO

PERMISSION_EXPANSION = NO

PATIENT_IDENTITY_REDEFINITION = NO

### 32.4 Route Boundary

ROUTE_SCOPE = GET /patients/:patientId ONLY

ADDITIONAL_ROUTE_AUTHORITY = NOT_GRANTED

POST_PATIENT_ROUTE_INHERITANCE = PROHIBITED

ROUTE_AUTHORITY_INHERITANCE = PROHIBITED

### 32.5 Controller Boundary

CONTROLLER_SCOPE = EXISTING_CONTROLLER_ONLY

CONTROLLER_DOMAIN_EXPANSION = NO

CONTROLLER_PERSISTENCE_EXPANSION = NO

CONTROLLER_AUTH_EXPANSION = NO

CONTROLLER_AUTHORIZATION_EXPANSION = NO

### 32.6 Service Boundary

SERVICE_SCOPE = EXISTING_RETRIEVE_EXISTING_PATIENT_BEHAVIOR

SERVICE_EXPANSION = NOT_AUTHORIZED

SERVICE_DOMAIN_EXPANSION = NO

SERVICE_PERSISTENCE_EXPANSION = NO

### 32.7 Persistence Boundary

PERSISTENCE_DEPENDENCY = EXISTING_CLOSED_PERSISTENCE_ONLY

PERSISTENCE_REOPENING = NO

DATABASE_SCHEMA_AUTHORITY = NOT_GRANTED

SQL_EXPANSION = NOT_GRANTED

REPOSITORY_EXPANSION = NOT_GRANTED

NEW_TABLE_AUTHORITY = NOT_GRANTED

NEW_SEQUENCE_AUTHORITY = NOT_GRANTED

### 32.8 Retrieval Behavior Boundary

RETRIEVAL_SOURCE = EXISTING_PATIENT_REPOSITORY

RETRIEVAL_KEY = TECHNICAL_PATIENT_ID

PATIENT_NOT_FOUND_BEHAVIOR = HTTP_404

PATIENT_FOUND_BEHAVIOR = HTTP_200

NO_PATIENT_MUTATION = REQUIRED

NO_PATIENT_CREATION = REQUIRED

NO_CPN_ALLOCATION = REQUIRED

NO_PERSISTENCE_MUTATION = REQUIRED

### 32.9 Runtime Boundary

RUNTIME_BOUNDARY = EXISTING_API_RUNTIME_ONLY

FASTIFY_RUNTIME = EXISTING

API_SERVER_EXPANSION = NOT_GRANTED

DEPLOYMENT = NOT_GRANTED

PRODUCTION_RUNTIME_AUTHORITY = NONE

### 32.10 Authentication and Authorization Boundary

AUTHENTICATION_IMPLEMENTATION = NOT_GRANTED

AUTHORIZATION_IMPLEMENTATION = NOT_GRANTED

ACTOR_EXPANSION = NOT_GRANTED

PERMISSION_EXPANSION = NOT_GRANTED

The retrieval operation must not create or redefine the authorization model.

### 32.11 Evidence Requirement

The operation requires operation-specific evidence.

Required evidence includes:

ROUTE_BEHAVIOR = REQUIRED

CONTROLLER_BOUNDARY = REQUIRED

SERVICE_BEHAVIOR = REQUIRED

REPOSITORY_RETRIEVAL_BEHAVIOR = REQUIRED

PATIENT_FOUND_RESPONSE = REQUIRED

PATIENT_NOT_FOUND_RESPONSE = REQUIRED

NO_MUTATION = REQUIRED

PERSISTENCE_BOUNDARY = REQUIRED

REGRESSION = REQUIRED

### 32.12 Current Evidence State

The existing implementation establishes:

ROUTE_IMPLEMENTATION = PRESENT

CONTROLLER_IMPLEMENTATION = PRESENT

SERVICE_IMPLEMENTATION = PRESENT

REPOSITORY_DEPENDENCY = PRESENT

PERSISTENCE_TARGET = EXISTING_CLOSED_PERSISTENCE

However, full operation-specific runtime proof has not yet been established.

Therefore:

RETRIEVE_EXISTING_PATIENT_ROUTE_EVIDENCE = PRESENT

RETRIEVE_EXISTING_PATIENT_CONTROLLER_EVIDENCE = PRESENT

RETRIEVE_EXISTING_PATIENT_SERVICE_EVIDENCE = PRESENT

RETRIEVE_EXISTING_PATIENT_PERSISTENCE_BOUNDARY = ESTABLISHED

RETRIEVE_EXISTING_PATIENT_FULL_RUNTIME_PROOF = NOT_YET_ESTABLISHED

### 32.13 Authority Separation

The existence of implementation does not create current authority.

The previous REGISTER NEW PATIENT grant does not create retrieval authority.

Therefore:

IMPLEMENTATION_EXISTENCE_TO_AUTHORITY = NO

REGISTER_NEW_PATIENT_AUTHORITY_INHERITANCE = PROHIBITED

RETRIEVE_EXISTING_PATIENT_AUTHORITY_INHERITANCE = PROHIBITED

CURRENT_OPERATION_AUTHORITY = NOT_GRANTED

### 32.14 Persistence Protection

The reconciliation must preserve the already closed persistence state.

Therefore:

PERSISTENCE_COMPLETE_CLOSURE = PROTECTED

PERSISTENCE_LIVE_RECONCILIATION = PROTECTED

DATA_PRESERVATION = PROTECTED

ROLLBACK_SAFETY = PROTECTED

PERSISTENCE_REOPENING = NO

### 32.15 Excluded Scope

This reconciliation does not authorize:

PATIENT_HISTORY_API = NOT_GRANTED

PAST_HISTORY_API = NOT_GRANTED

CLINICAL_HISTORY_API = NOT_GRANTED

CASE_API = NOT_GRANTED

VISIT_API = NOT_GRANTED

CLINIC_DAY_API = NOT_GRANTED

NURSE_DELEGATION_API = NOT_GRANTED

DOCTOR_NOTIFICATION_API = NOT_GRANTED

AUTHENTICATION_API = NOT_GRANTED

AUTHORIZATION_API = NOT_GRANTED

UI_IMPLEMENTATION = NOT_GRANTED

DEPLOYMENT = NOT_GRANTED

REAL_USE = NOT_GRANTED

REAL_PILOT = NOT_GRANTED

PRODUCTION_USE = NOT_GRANTED

### 32.16 Decision Readiness

RETRIEVE_EXISTING_PATIENT_DECISION_INPUTS = PARTIAL

RETRIEVE_EXISTING_PATIENT_EVIDENCE = PARTIAL

RETRIEVE_EXISTING_PATIENT_BOUNDARY = ESTABLISHED

RETRIEVE_EXISTING_PATIENT_PERSISTENCE_DEPENDENCY = ESTABLISHED

RETRIEVE_EXISTING_PATIENT_DATA_PRESERVATION = REQUIRED

RETRIEVE_EXISTING_PATIENT_ROLLBACK_REQUIREMENT = NOT_APPLICABLE_TO_READ_OPERATION

RETRIEVE_EXISTING_PATIENT_RUNTIME_PROOF = REQUIRED

### 32.17 Current Decision State

No authority is issued by this reconciliation.

Therefore:

RETRIEVE_EXISTING_PATIENT_AUTHORITY_DECISION = NOT_ISSUED

RETRIEVE_EXISTING_PATIENT_CURRENT_AUTHORITY = NOT_GRANTED

RETRIEVE_EXISTING_PATIENT_IMPLEMENTATION_AUTHORIZED = NO

CURRENT_API_AUTHORITY = PARTIALLY_GRANTED

CURRENT_API_AUTHORITY_SCOPE = REGISTER_NEW_PATIENT_ONLY

API_IMPLEMENTATION_EXECUTION = BLOCKED_FOR_RETRIEVE_OPERATION

### 32.18 Final Reconciliation State

RETRIEVE_EXISTING_PATIENT_EVIDENCE_RECONCILIATION = ESTABLISHED

RETRIEVE_EXISTING_PATIENT_ROUTE_EVIDENCE = PRESENT

RETRIEVE_EXISTING_PATIENT_CONTROLLER_EVIDENCE = PRESENT

RETRIEVE_EXISTING_PATIENT_SERVICE_EVIDENCE = PRESENT

RETRIEVE_EXISTING_PATIENT_PERSISTENCE_BOUNDARY = ESTABLISHED

RETRIEVE_EXISTING_PATIENT_FULL_RUNTIME_PROOF = NOT_YET_ESTABLISHED

RETRIEVE_EXISTING_PATIENT_CURRENT_AUTHORITY = NOT_GRANTED

REGISTER_NEW_PATIENT_AUTHORITY = PRESERVED

PERSISTENCE_CLOSURE = PRESERVED

UNAUTHORIZED_EXPANSION = NO

FAIL = 0


## 33. RETRIEVE EXISTING PATIENT RUNTIME PROOF

### 33.1 Proof Purpose

This section defines the operation-specific runtime proof boundary for RETRIEVE EXISTING PATIENT.

The purpose is to establish whether the existing implementation satisfies its declared runtime behavior.

This section does not issue current API authority.

This section does not inherit authority from REGISTER NEW PATIENT.

### 33.2 Operation Identity

OPERATION = RETRIEVE_EXISTING_PATIENT

ROUTE = GET /patients/:patientId

CONTROLLER = retrieveExistingPatientController

APPLICATION_SERVICE = retrieveExistingPatient

### 33.3 Runtime Proof Scope

The proof is limited to the existing implementation.

Therefore:

RUNTIME_PROOF_SCOPE = EXISTING_RETRIEVE_IMPLEMENTATION_ONLY

ROUTE_SCOPE = GET /patients/:patientId ONLY

CONTROLLER_SCOPE = EXISTING_CONTROLLER_ONLY

SERVICE_SCOPE = EXISTING_RETRIEVE_EXISTING_PATIENT_BEHAVIOR

REPOSITORY_SCOPE = EXISTING_PATIENT_REPOSITORY_ONLY

PERSISTENCE_SCOPE = EXISTING_CLOSED_PERSISTENCE_ONLY

### 33.4 Required Runtime Proof

The following behaviors must be demonstrated:

ROUTE_REACHABILITY = REQUIRED

CONTROLLER_DISPATCH = REQUIRED

SERVICE_DISPATCH = REQUIRED

REPOSITORY_RETRIEVAL = REQUIRED

PATIENT_FOUND = REQUIRED

PATIENT_NOT_FOUND = REQUIRED

HTTP_200_RESPONSE = REQUIRED

HTTP_404_RESPONSE = REQUIRED

NO_PATIENT_MUTATION = REQUIRED

NO_PATIENT_CREATION = REQUIRED

NO_CPN_ALLOCATION = REQUIRED

NO_PERSISTENCE_MUTATION = REQUIRED

### 33.5 Patient Found Proof

A known persisted Patient must be retrievable through:

GET /patients/:patientId

The returned result must correspond to the existing Patient record.

Therefore:

PATIENT_FOUND_RETRIEVAL = REQUIRED

PATIENT_IDENTITY_PRESERVED = REQUIRED

PATIENT_DATA_PRESERVED = REQUIRED

TECHNICAL_PATIENT_ID_PRESERVED = REQUIRED

CPN_PRESERVED = REQUIRED

### 33.6 Patient Not Found Proof

A non-existing technical Patient ID must produce the declared not-found behavior.

Therefore:

PATIENT_NOT_FOUND_RETRIEVAL = REQUIRED

HTTP_404 = REQUIRED

PATIENT_NOT_FOUND_ERROR_RESPONSE = REQUIRED

NO_PATIENT_CREATION_ON_NOT_FOUND = REQUIRED

NO_PERSISTENCE_MUTATION_ON_NOT_FOUND = REQUIRED

### 33.7 Read-Only Safety Proof

The retrieval operation is read-only.

Therefore:

READ_ONLY_OPERATION = REQUIRED

PATIENT_MUTATION = PROHIBITED

PATIENT_CREATION = PROHIBITED

PATIENT_UPDATE = PROHIBITED

PATIENT_DELETE = PROHIBITED

CPN_ALLOCATION = PROHIBITED

PERSISTENCE_MUTATION = PROHIBITED

### 33.8 Runtime Boundary

The proof must remain inside the existing API runtime.

Therefore:

FASTIFY_RUNTIME = REQUIRED

DB_POOL_WIRING = NOT_REQUIRED_FOR_READ_IF_REPOSITORY_IS_POOL_BACKED

PATIENT_REPOSITORY_WIRING = REQUIRED

API_SERVER_EXPANSION = NOT_AUTHORIZED

DEPLOYMENT = NOT_AUTHORIZED

PRODUCTION_RUNTIME = NOT_AUTHORIZED

### 33.9 Persistence Boundary

The runtime proof must not modify the closed persistence structure.

Therefore:

PERSISTENCE_COMPLETE_CLOSURE = PROTECTED

PERSISTENCE_LIVE_RECONCILIATION = PROTECTED

DATABASE_SCHEMA_CHANGE = PROHIBITED

SQL_EXPANSION = PROHIBITED

REPOSITORY_EXPANSION = PROHIBITED

PERSISTENCE_REOPENING = NO

### 33.10 Data Preservation

The proof must demonstrate that retrieval does not alter existing Patient data.

Therefore:

DATA_BEFORE_RETRIEVAL = PRESERVED

DATA_AFTER_RETRIEVAL = PRESERVED

PATIENT_IDENTITY_PRESERVED = REQUIRED

CPN_PRESERVED = REQUIRED

PATIENT_RECORD_UNCHANGED = REQUIRED

### 33.11 Authority Separation

Runtime proof is evidence only.

Therefore:

RUNTIME_PROOF_TO_AUTHORITY_INHERITANCE = PROHIBITED

IMPLEMENTATION_EXISTENCE_TO_AUTHORITY = NO

REGISTER_NEW_PATIENT_AUTHORITY_INHERITANCE = PROHIBITED

CURRENT_OPERATION_AUTHORITY = NOT_GRANTED

### 33.12 Authorization Boundary

The proof does not authorize authentication or authorization implementation.

Therefore:

AUTHENTICATION_IMPLEMENTATION = NOT_GRANTED

AUTHORIZATION_IMPLEMENTATION = NOT_GRANTED

ACTOR_EXPANSION = NOT_GRANTED

PERMISSION_EXPANSION = NOT_GRANTED

### 33.13 Excluded Operations

The proof does not cover:

POST /patients

GET /patients/:patientId/history

POST /patients/:patientId/past-history

PATCH /patients/:patientId/past-history/:itemId

GET /patients/:patientId/clinical-history

POST /patients/:patientId/cases

POST /cases/:caseId/completion

POST /cases/:caseId/visits

POST /visits/:visitId/arrival

POST /visits/:visitId/clinical-record

POST /visits/:visitId/exit

GET /clinic-days/:clinicDayId/daily-data

POST /clinic-days/:clinicDayId/closure

GET /clinic/nurse-delegation

PATCH /clinic/nurse-delegation

POST /doctor-notifications

OTHER_API_OPERATION_PROOF = NOT_COVERED

### 33.14 Regression Boundary

The operation-specific proof must include regression evidence.

Therefore:

RETRIEVE_EXISTING_PATIENT_REGRESSION = REQUIRED

FAIL = 0

No unrelated test may be treated as proof for this operation.

### 33.15 Current Authority State During Proof

The operation remains unauthorized while proof is being established.

Therefore:

RETRIEVE_EXISTING_PATIENT_CURRENT_AUTHORITY = NOT_GRANTED

RETRIEVE_EXISTING_PATIENT_IMPLEMENTATION_AUTHORIZED = NO

CURRENT_API_AUTHORITY = PARTIALLY_GRANTED

CURRENT_API_AUTHORITY_SCOPE = REGISTER_NEW_PATIENT_ONLY

### 33.16 Proof Completion Criteria

The runtime proof may be considered established only when all required operation-specific behaviors pass.

Therefore:

ROUTE_REACHABILITY = PASS_REQUIRED

CONTROLLER_DISPATCH = PASS_REQUIRED

SERVICE_DISPATCH = PASS_REQUIRED

REPOSITORY_RETRIEVAL = PASS_REQUIRED

PATIENT_FOUND = PASS_REQUIRED

PATIENT_NOT_FOUND = PASS_REQUIRED

HTTP_200_RESPONSE = PASS_REQUIRED

HTTP_404_RESPONSE = PASS_REQUIRED

NO_PATIENT_MUTATION = PASS_REQUIRED

NO_PATIENT_CREATION = PASS_REQUIRED

NO_CPN_ALLOCATION = PASS_REQUIRED

NO_PERSISTENCE_MUTATION = PASS_REQUIRED

REGRESSION = PASS_REQUIRED

### 33.17 Current Evidence State

Before execution of the dedicated runtime proof:

RETRIEVE_EXISTING_PATIENT_ROUTE_EVIDENCE = PRESENT

RETRIEVE_EXISTING_PATIENT_CONTROLLER_EVIDENCE = PRESENT

RETRIEVE_EXISTING_PATIENT_SERVICE_EVIDENCE = PRESENT

RETRIEVE_EXISTING_PATIENT_REPOSITORY_DEPENDENCY = PRESENT

RETRIEVE_EXISTING_PATIENT_FULL_RUNTIME_PROOF = NOT_YET_ESTABLISHED

RETRIEVE_EXISTING_PATIENT_CURRENT_AUTHORITY = NOT_GRANTED

### 33.18 Final State Before Runtime Execution

RETRIEVE_EXISTING_PATIENT_RUNTIME_PROOF_STATUS = PENDING_EXECUTION

RETRIEVE_EXISTING_PATIENT_FULL_RUNTIME_PROOF = NOT_YET_ESTABLISHED

RETRIEVE_EXISTING_PATIENT_CURRENT_AUTHORITY = NOT_GRANTED

REGISTER_NEW_PATIENT_AUTHORITY = PRESERVED

CURRENT_API_AUTHORITY = PARTIALLY_GRANTED

CURRENT_API_AUTHORITY_SCOPE = REGISTER_NEW_PATIENT_ONLY

PERSISTENCE_CLOSURE = PRESERVED

UNAUTHORIZED_EXPANSION = NO

FAIL = 0
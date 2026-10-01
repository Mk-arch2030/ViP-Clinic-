# Dr.Roby Clinic — API Implementation Structure Decision V1

DOCUMENT = API IMPLEMENTATION STRUCTURE DECISION
STATUS = CLOSED + PROVEN
GATE = API IMPLEMENTATION STRUCTURE

## 1. PURPOSE

This decision establishes the source-structure boundary for implementing the
already-authorized Dr.Roby Clinic API surface.

It does not introduce a new product capability.
It does not alter the API Technical Contract.
It does not alter application/domain behavior.
It does not authorize persistence, SQL, ORM, repository, authentication,
authorization, UI, or deployment implementation.

## 2. AUTHORITATIVE BASIS

This decision is subordinate to:

- API-TECHNICAL-CONTRACT-V1.md
- APPLICATION-CAPABILITY-CONTRACT-V1.md
- AUTHORIZATION-TECHNICAL-CONTRACT-V1.md
- API-SURFACE-DEFINITION-V1.md
- API-SURFACE-RECONCILIATION-V1.md
- API-SURFACE-CLOSURE-DECISION-V1.md
- API-IMPLEMENTATION-AUTHORIZATION-DECISION-V1.md
- established domain and authority invariants

## 3. SELECTED STRUCTURE

The API implementation is organized into three bounded layers:

api/
  routes/
  controllers/

application/
  services/

### Route Layer

Owns HTTP route declaration and binding only.

### Controller Layer

Owns HTTP request/response boundary handling only.

### Application Service Layer

Owns application-level orchestration for already-established capabilities only.

## 4. LAYER BOUNDARIES

Route implementation MUST NOT contain:

- SQL
- database access
- repository behavior
- domain authority decisions
- authentication implementation
- authorization implementation
- new business capability

Controller implementation MUST NOT contain:

- SQL
- database access
- repository behavior
- authentication implementation
- authorization implementation
- new business capability
- persistence behavior

Application Service implementation MUST NOT contain:

- SQL
- database access
- repository implementation
- ORM implementation
- database schema behavior
- authentication implementation
- authorization implementation
- new product capability
- new actor
- authority transfer
- deferred technical decision resolution by invention

## 5. AUTHORIZED API OPERATIONS

The structure exists only to expose the already-closed 17-operation API surface:

1. POST /patients
2. GET /patients/{patientId}
3. GET /patients/{patientId}/history
4. POST /patients/{patientId}/past-history
5. PATCH /patients/{patientId}/past-history/{itemId}
6. POST /patients/{patientId}/cases
7. POST /cases/{caseId}/completion
8. POST /cases/{caseId}/visits
9. POST /visits/{visitId}/arrival
10. POST /visits/{visitId}/clinical-record
11. POST /visits/{visitId}/exit
12. GET /patients/{patientId}/clinical-history
13. GET /clinic-days/{clinicDayId}/daily-data
14. POST /clinic-days/{clinicDayId}/closure
15. GET /clinic/nurse-delegation
16. PATCH /clinic/nurse-delegation
17. POST /doctor-notifications

No additional HTTP operation is authorized.

## 6. APPLICATION BOUNDARY

The implementation MUST preserve:

Patient Identity != Case != Visit != Clinic Day

Past History != Clinical History

Visit Exit != Case Completion

Case Completion != Clinic Day Closure

Investigation != Diagnosis

Clinical Authority != Operational Delegation

Clinical History remains derived from recorded Visits.

## 7. CLINICAL INFORMATION MODEL

Clinical Information uses the closed API architectural decision:

MODEL = M1_ONE_VISIT_CLINICAL_INFORMATION_OPERATION

The operation represents Clinical Information for one Visit while preserving:

- Current Complaint
- Investigation
- Diagnosis
- Treatment
- Follow-up

as distinct clinical concepts.

## 8. AUTHORITY

Doctor remains:

- Clinic Owner
- Main Admin
- Clinical Authority
- System Owner

Nurse remains:

- delegated operational participant

No structure decision transfers authority or expands Nurse permissions.

## 9. PERSISTENCE BOUNDARY

This structure does not authorize:

- repository implementation
- SQL
- migrations
- ORM
- database schema implementation
- database runtime behavior

The application service layer MUST NOT bypass this boundary.

## 10. AUTHENTICATION / AUTHORIZATION BOUNDARY

This structure does not authorize implementation of:

- authentication
- authorization
- session mechanism
- permission matrix
- token mechanism

Those remain governed separately.

## 11. OLD IMPLEMENTATION

Existing local implementation files such as:

- index.js
- db.js
- auth.js

are implementation attempts outside this selected structure.

They are NOT architectural authority and MUST NOT be treated as the implementation
baseline for the new API.

The new implementation MUST NOT be produced by patching the old monolithic
implementation into conformance.

## 12. IMPLEMENTATION RULE

Implementation proceeds from the selected structure and closed contracts.

No deferred technical decision may be silently invented during implementation.

Where a required implementation detail is still deliberately undefined by the
closed contracts, that detail requires its own explicit decision before it is
implemented.

## 13. PROOF REQUIREMENTS

A future implementation proof MUST demonstrate:

- structure matches this decision
- only authorized API operations exist
- no unauthorized layer is implemented
- no new capability exists
- no new actor exists
- no authority transfer exists
- persistence boundary is preserved
- authentication/authorization boundary is preserved
- closed lifecycle distinctions remain preserved
- FAIL = 0

## 14. CURRENT STATUS

STRUCTURE_SELECTED = YES
API_OPERATION_COUNT = 17
UNAUTHORIZED_OPERATION_COUNT = 0
NEW_CAPABILITY = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
PERSISTENCE_IMPLEMENTATION = NOT AUTHORIZED
AUTHENTICATION_IMPLEMENTATION = NOT AUTHORIZED
AUTHORIZATION_IMPLEMENTATION = NOT AUTHORIZED
UI_IMPLEMENTATION = NOT AUTHORIZED
DEPLOYMENT_IMPLEMENTATION = NOT AUTHORIZED

STRUCTURE_IMPLEMENTATION = NOT PERFORMED
DECISION_PROOF = PASS

END OF API IMPLEMENTATION STRUCTURE DECISION V1

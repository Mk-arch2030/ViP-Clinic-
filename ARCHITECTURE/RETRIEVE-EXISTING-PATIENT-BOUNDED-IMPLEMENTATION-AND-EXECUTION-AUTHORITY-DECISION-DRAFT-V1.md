# ROBY — Retrieve Existing Patient Bounded Implementation and Execution Authority Decision Draft V1

DOCUMENT_STATUS = AUTHORITY_DECISION_DRAFT
OWNER = MOHAMED.K_ROBY

DRAFTING_AUTHORIZATION = GRANTED
IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED
EXECUTION_AUTHORIZATION = NOT_GRANTED
FULL_RUNTIME_PROOF = NOT_ESTABLISHED

## 1. PURPOSE

Prepare an explicit, bounded authority decision for
the non-production runtime proof of:

GET /patients/:patientId

This document is a proposal for owner review.

DRAFT_IS_EXECUTION_AUTHORITY = NO

## 2. GOVERNING ARTIFACTS

ARCHITECTURE/API-AUTHORITY-REESTABLISHMENT-DECISION-V1.md

ARCHITECTURE/RETRIEVE-EXISTING-PATIENT-RUNTIME-PROOF-EXECUTION-READINESS-V1.md

ARCHITECTURE/RETRIEVE-EXISTING-PATIENT-BOUNDED-RUNTIME-PROOF-EXECUTION-AUTHORITY-REVIEW-V1.md

ARCHITECTURE/RETRIEVE-EXISTING-PATIENT-ISOLATED-RUNTIME-PROOF-EXECUTION-PLAN-V1.md

ARCHITECTURE/DESIGN/P4-MOCK-DATASET-PRESERVATION-PROOF-V1.md

## 3. OWNER-APPROVED APPROACH

ISOLATED_POSTGRESQL_APPROACH = APPROVED
INDEPENDENT_SYNTHETIC_FIXTURE_APPROACH = APPROVED

P4_MOCK_REUSE_AS_DATABASE_DATA = NO
A06_SNAPSHOT_REUSE = NO

APPROACH_APPROVAL_IS_EXECUTION_AUTHORITY = NO

## 4. PROTECTED DATABASE BOUNDARY

PROTECTED_CLUSTER =
$PREFIX/var/lib/postgresql

PROPOSED_TEST_ROOT =
$HOME/vip-retrieve-proof-isolated

PROPOSED_TEST_PORT = 55439
TEST_PORT_AVAILABILITY = UNVERIFIED

The test cluster must have an independent data
directory, socket directory and connection target.

No operation may use the protected cluster.

PROTECTED_CLUSTER_STOP = PROHIBITED
PROTECTED_CLUSTER_MUTATION = PROHIBITED
PROTECTED_CLUSTER_CLEANUP = PROHIBITED

## 5. PROPOSED IMPLEMENTATION AUTHORITY

A future separate grant may permit a dedicated
GET-only test harness.

REGISTERED_ROUTE = GET /patients/:patientId
POST_ROUTE_REGISTRATION = PROHIBITED

Existing retrieval controller, application service
and PatientRepository must be reused.

PRODUCTION_RUNTIME_MODIFICATION = PROHIBITED
EXISTING_API_AUTHORITY_EXPANSION = PROHIBITED

CURRENT_TEST_HARNESS_AUTHORIZATION = NOT_GRANTED

## 6. PROPOSED TEST ENVIRONMENT AUTHORITY

A future separate grant may permit creation of a
new non-production PostgreSQL cluster exclusively
under the approved isolated test root.

The exact path, port, socket and connection target
must be verified before startup or connection.

CURRENT_CLUSTER_CREATION_AUTHORIZATION = NOT_GRANTED

## 7. PROPOSED FIXTURE AUTHORITY

A future separate grant may permit one or more
independent synthetic Patient fixtures inside the
verified isolated test database only.

The fixture must not derive authority from the
historical P4 Mock or A06 persistence snapshot.

Any fixture setup mutation must be distinguished
from the subsequent read-only GET proof.

CURRENT_FIXTURE_INSERT_AUTHORIZATION = NOT_GRANTED

## 8. PROPOSED RUNTIME PROOF AUTHORITY

A future separate grant may permit:

HTTP GET found scenario: 200
HTTP GET missing scenario: 404

The proof must traverse the real HTTP/controller/
application-service/repository/PostgreSQL chain.

An unregistered route returning 404 is not
acceptable proof of the missing Patient scenario.

CURRENT_GET_EXECUTION_AUTHORIZATION = NOT_GRANTED

## 9. DATA PRESERVATION PROOF

Capture a baseline after fixture preparation
and before GET execution.

Verify before/after equality of:

- Patient rows and values.
- Relevant schema state.
- CPN sequence state.

The GET operation must perform no INSERT, UPDATE,
DELETE or CPN sequence allocation.

Proof results must be supported by actual
execution evidence, not design assertions.

## 10. REGRESSION AND CLEANUP

Regression commands and expected outcomes must
be identified before execution authorization.

Cleanup must verify the exact isolated cluster
identity and target path.

No automatic deletion is authorized by this draft.

Evidence must be preserved independently of
the temporary test environment.

## 11. REQUIRED OWNER DECISIONS

DECISION_A = TEST_HARNESS_IMPLEMENTATION
DECISION_B = ISOLATED_CLUSTER_CREATION
DECISION_C = SYNTHETIC_FIXTURE_PREPARATION
DECISION_D = BOUNDED_GET_RUNTIME_EXECUTION
DECISION_E = ISOLATED_ENVIRONMENT_CLEANUP

Each decision requires an explicit scope and
authorization before its corresponding action.

## 12. EXCLUSIONS

PRODUCTION_DEPLOYMENT = NOT_AUTHORIZED
REAL_CLINICAL_USE = NOT_AUTHORIZED
PERSISTENCE_REOPENING = NOT_AUTHORIZED
SCHEMA_MIGRATION = NOT_AUTHORIZED
AUTHENTICATION_CHANGE = NOT_AUTHORIZED
AUTHORIZATION_CHANGE = NOT_AUTHORIZED
P4_MOCK_MUTATION = NOT_AUTHORIZED
A06_SNAPSHOT_MUTATION = NOT_AUTHORIZED

## 13. CURRENT DECISION

DOCUMENT_REVIEW = OPEN

IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED
EXECUTION_AUTHORIZATION = NOT_GRANTED
FULL_RUNTIME_PROOF = NOT_ESTABLISHED

NEXT_GATE = OWNER_REVIEW_OF_BOUNDED_AUTHORITY_DRAFT

END

# P4 — Patient Real API Adapter Bounded Contract V1

## STATUS

STATUS = CLOSED + PROVEN

## GATE

P4 — CONTROLLED PATIENT UI → REAL API ADAPTER

## CANONICAL CHECKPOINT

64247ab487da9b387321d3f55cf6f646d6d468e3

## AUTHORITY BASIS

This contract is subordinate to:

- P4 Controlled UI → Real API Adapter Wiring Authorization Decision
- P4 Mock Dataset Preservation Proof
- P2 API Runtime Closure Proof
- A06 Date of Birth / Temporal Age authority

## BOUNDARY

BOUNDARY = BOUNDED

This contract defines only the frontend adapter boundary for the
already-proven Patient HTTP API.

It does not authorize replacement of the existing Clinic Day mock runtime.

## AUTHORIZED ADAPTER SURFACE

Adapter location:

frontend/src/adapters/patientApiService.js

Authorized operations:

1. registerPatient
2. getPatient

## HTTP CONTRACT

### Register Patient

METHOD = POST

PATH = /patients

REQUEST BODY:

{
  name,
  dateOfBirth,
  profession,
  phone,
  gender
}

SUCCESS:

HTTP 201

RESPONSE:

Patient object returned by registerNewPatientController.

### Retrieve Patient

METHOD = GET

PATH = /patients/:patientId

SUCCESS:

HTTP 200

RESPONSE:

Patient object returned by retrieveExistingPatientController.

NOT FOUND:

HTTP 404

RESPONSE:

{
  error: "Patient not found"
}

## A06 ALIGNMENT

dateOfBirth = AUTHORITATIVE PERSISTENT PATIENT FACT

age = DERIVED TEMPORAL VALUE

The adapter must not submit age as an authoritative registration field.

The adapter may receive age from the API response as a derived value.

No client-side recalculation of authoritative persistence is introduced
by this contract.

## BASE URL

No Vite proxy is currently authorized or defined.

The adapter must therefore use an explicit configurable API base boundary.

The exact environment variable name and default behavior must be proven
during implementation without changing backend routing.

## ERROR BOUNDARY

The adapter must preserve HTTP failure semantics.

404 Patient Not Found must remain distinguishable from successful
retrieval.

No silent fallback from Real API to mock data is authorized.

No mock data may be presented as a Real API response.

## MOCK PRESERVATION

frontend/src/adapters/mockClinicService.js

STATUS = PRESERVED

The mock adapter remains historical P4 UI fixture infrastructure.

This contract does not authorize:

- deletion
- replacement
- mutation
- dataset mixing
- conversion of mock records into real Patient records

## NON-AUTHORIZED SCOPE

The following remain outside this contract:

- PostgreSQL
- SQL
- migrations
- ORM
- repository changes
- application service changes
- backend route changes
- new API operations
- authentication
- authorization
- role changes
- Nurse capability changes
- Doctor capability changes
- workflow changes
- Clinic Day API
- Case API
- Visit API
- Clinical History API
- Past History
- new domain entities
- direct browser-to-database access
- PWA
- deployment
- E2E authorization
- E2E proof
- unrelated UI redesign

## APP BOUNDARY

This contract does NOT authorize replacing the current
getClinicDashboard/getVisitDetails mock data source.

The current Clinic Day dashboard requires API surfaces that do not yet
exist in the proven backend contract.

Therefore:

MOCK_CLINIC_RUNTIME = PRESERVED

PATIENT_REAL_API_ADAPTER = SEPARATE BOUNDED SURFACE

## PROOF REQUIREMENTS

Implementation proof must establish:

1. Adapter file exists.
2. Adapter exposes only authorized Patient operations.
3. POST /patients is used for registration.
4. GET /patients/:patientId is used for retrieval.
5. No unauthorized endpoint is introduced.
6. No direct database access exists in frontend.
7. No SQL exists in frontend.
8. Mock adapter remains unchanged.
9. No mock fallback occurs on Real API failure.
10. dateOfBirth remains the registration date field.
11. age is not submitted as an authoritative field.
12. P2 backend remains untouched.
13. P3 boundary remains untouched.
14. E2E is not falsely claimed.
15. FAIL = 0.

## NEXT GATE

P4 — PATIENT REAL API ADAPTER IMPLEMENTATION

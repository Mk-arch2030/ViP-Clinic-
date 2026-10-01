# Dr.Roby Clinic — CPN Generation Implementation Proof V1

## 1. PURPOSE

This artifact proves the current implementation state of the
GENERATE CLINIC PATIENT NUMBER capability (Application Capability 4.2).

It does not modify historical authorization, implementation-definition,
technical-definition, or mechanism-decision artifacts.

It records current implementation evidence against the already established
CPN product and technical boundaries.

## 2. AUTHORITATIVE CAPABILITY

CAPABILITY = 4.2 GENERATE CLINIC PATIENT NUMBER

Established product requirements:

- CPN is established at first Patient registration.
- CPN is a stable clinic reference for the Patient.
- CPN is not a Visit identifier.
- CPN is not a Case identifier.
- CPN is not a Clinic Day identifier.
- Technical Patient persistence identity remains separate from CPN.

## 3. IMPLEMENTATION AUTHORITY

CPN_GENERATION_IMPLEMENTATION_AUTHORIZED = YES

The capability implementation is bounded by the previously closed
CPN generation authorization, definition, technical-definition, and
mechanism-decision artifacts.

No historical artifact is rewritten by this proof.

## 4. CURRENT IMPLEMENTATION UNIT

APPLICATION_IMPLEMENTATION_UNIT =
`application/services/register-new-patient.js`

PERSISTENCE_IMPLEMENTATION_UNIT =
`backend/persistence/patient-repository.js`

PERSISTENCE_SCHEMA_UNIT =
`backend/persistence/schema.sql`

INDEPENDENT_TEST_UNIT =
`application/tests/generate-clinic-patient-number.test.js`

## 5. IMPLEMENTATION BEHAVIOR

The current registration flow:

1. Opens a database transaction.
2. Allocates a Clinic Patient Number through the repository.
3. Constructs the Patient using the allocated CPN.
4. Persists the Patient with that CPN.
5. Commits the transaction.
6. Rolls back on failure.

The persistence layer allocates the CPN using the PostgreSQL
`clinic_patient_number_seq` sequence and the established `CPN-`
prefix.

Therefore:

CPN_FORMAT = `CPN-<sequential numeric value>`

CPN_GENERATION_DIRECTION = PERSISTENCE-AUTHORITATIVE

## 6. INDEPENDENT IMPLEMENTATION TEST

Independent test:

`application/tests/generate-clinic-patient-number.test.js`

Verified:

- First Patient registration receives an allocated CPN.
- The allocated CPN reaches the Patient representation.
- Allocation is invoked inside the registration transaction.
- Distinct allocation results produce distinct CPN references.
- Required `CPN-<numeric>` format is asserted.

INDEPENDENT_TEST_CASES = 2
INDEPENDENT_TEST_PASS = 2
INDEPENDENT_TEST_FAIL = 0

## 7. EXISTING RUNTIME EVIDENCE

Existing API runtime closure evidence establishes:

REAL_POSTGRESQL_PERSISTENCE = PASS
CPN_UNIQUENESS = PASS
CPN_CONCURRENT_ALLOCATION = PASS

API_CPN_PROVEN = `CPN-15`
PERSISTED_DB_CPN_PROVEN = `CPN-15`

API_TO_DATABASE_PERSISTENCE = PASS

P2_IMPLEMENTATION_CLOSURE = CLOSED + PROVEN

This existing runtime evidence is used as supporting evidence for the
current CPN implementation proof and is not rewritten here.

## 8. PATIENT IDENTITY BOUNDARY

Existing Patient technical identity reconciliation establishes:

PRODUCT_PATIENT_REFERENCE = `clinic_patient_number`

TECHNICAL_IDENTITY_DISTINCT_FROM_CPN = PASS

The evidence also establishes:

- CPN remains stable once established.
- A Visit does not create a new CPN.
- CPN is not a Visit identifier.
- CPN remains distinct from technical Patient persistence identity.

Therefore the current implementation preserves the established
Patient / CPN identity boundary.

## 9. CURRENT IMPLEMENTATION EVIDENCE FINGERPRINTS

Evidence freeze baseline:

BASE_COMMIT =
`1dbf257f1648c7e3d91f6d46f7fd5302eccfa745`

INDEPENDENT_TEST_SHA256 =
`d6cad29d80be5c0f85d87fe872ecf4d6782ba412ba87da6b38bbf5dc3e88cada`

REGISTER_SERVICE_SHA256 =
`f0c1a475e3ec5b4b873b1c4e8adca5c22c98343f47beec15fc6a0e50d6bf4c37`

PATIENT_REPOSITORY_SHA256 =
`21b79079fd6dd9350572946decfa780fb8279ae0a2be5ffdffc3e449fc16281c`

SCHEMA_SHA256 =
`3b27e0f3ebf35e0cf9716ef82aeb608173151e7adf2de5842eb17ad862ff4545`

## 10. BOUNDARY SAFETY

AUTHORITY_TRANSFER = NO
NEW_ACTOR = NO
NEW_PRODUCT_CAPABILITY = NO
CONTRACT_MUTATION = NO
UNAUTHORIZED_SCOPE_EXPANSION = NO
CPN_REDESIGN = NO

## 11. IMPLEMENTATION PROOF DECISION

CPN_IMPLEMENTATION_UNIT = ESTABLISHED
CPN_IMPLEMENTATION_EXECUTION = PROVEN
CPN_IMPLEMENTATION_INDEPENDENT_TEST = PASS
CPN_RUNTIME_PERSISTENCE = PROVEN
CPN_IDENTITY_BOUNDARY = PROVEN
CPN_SCOPE_SAFETY = PASS

CPN_GENERATION_IMPLEMENTATION_PROOF = CLOSED + PROVEN

FAIL = 0

## 12. NEXT GATE

NEXT_GATE = CPN MATRIX RECONCILIATION

This proof does not modify the Application Capability Coverage Matrix.
The Matrix must be updated only through a separate controlled
reconciliation step.

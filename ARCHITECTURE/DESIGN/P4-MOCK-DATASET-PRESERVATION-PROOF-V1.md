# Dr.Roby Clinic — P4 Mock Dataset Preservation Proof V1

STATUS = CLOSED + PROVEN

## 1. PURPOSE

This proof preserves the historical P4 UI mock dataset as a distinct
UI demonstration artifact.

The mock dataset is NOT the A06 Date of Birth persistence snapshot.

The mock dataset is NOT authoritative Patient persistence data.

The mock dataset MUST NOT be deleted merely because the UI is being wired
to the proven Real API.

## 2. DATASET DISTINCTION

A06 PERSISTENCE SNAPSHOT:

- CPN-1
- CPN-2
- CPN-3

Purpose:

Patient persistence and Date of Birth / derived Age proof.

P4 MOCK DATASET:

- CPN-1001 — Ahmed Hassan
- CPN-1002 — Mona Ali
- CPN-1003 — Omar Mahmoud

Purpose:

P4 UI / Clinic Day / Case / Visit / workflow demonstration.

These datasets are distinct.

DATASET_MIXING = NO

## 3. MOCK AUTHORITY

The P4 mock dataset is:

UI_FIXTURE = YES
DATABASE_AUTHORITY = NO
PATIENT_PERSISTENCE_AUTHORITY = NO
REAL_PATIENT_RECORD = NO
A06_SNAPSHOT_SOURCE = NO

The mock data represents historical UI demonstration state only.

## 4. PRESERVATION DECISION

MOCK_DATASET_PRESERVED = YES

MOCK_SOURCE_FILE =
frontend/src/adapters/mockClinicService.js

MOCK_DELETION_AUTHORIZED = NO

MOCK_REPLACEMENT_REQUIRED = NO

MOCK_HISTORY_ERASURE = NO

## 5. REAL API BOUNDARY

The authorized P4 Real API Adapter may establish:

UI
→ Real API Adapter
→ existing proven API

without deleting the historical mock adapter.

The mock adapter may remain available as a preserved historical fixture,
provided that it is not silently used as the Real API source.

## 6. A06 BOUNDARY

A06 remains authoritative for:

DATE_OF_BIRTH = PERSISTENT PATIENT FACT
AGE = DERIVED TEMPORAL VALUE

The P4 mock dataset does not override or modify A06 authority.

No A06 implementation is reopened.

## 7. P4 BOUNDARY

P4 Real API Adapter authorization remains:

AUTHORIZATION_SCOPE = P4_REAL_API_ADAPTER_WIRING_ONLY

This preservation proof does not authorize:

- database changes;
- SQL changes;
- migrations;
- repository changes;
- application-service changes;
- authentication;
- authorization;
- workflow changes;
- Past History implementation;
- E2E proof.

## 8. PROVENANCE

The historical P4 mock dataset is preserved as part of the original
Hamo × Shqo × Termux development history.

The original project remains the source artifact from which future
user-specific product copies may be derived.

## 9. SAFETY CHECK

A06_DATASET_DISTINCT = PASS
P4_MOCK_DATASET_IDENTIFIED = PASS
MOCK_PRESERVED = PASS
MOCK_NOT_DATABASE_AUTHORITY = PASS
MOCK_NOT_A06_SOURCE = PASS
DATASET_MIXING = PASS
MOCK_DELETION = NO
AUTHORITY_TRANSFER = NO
FAIL = 0

## 10. DECISION

P4_MOCK_DATASET_PRESERVATION = CLOSED + PROVEN

NEXT_GATE = CONTROLLED REAL API ADAPTER IMPLEMENTATION

END

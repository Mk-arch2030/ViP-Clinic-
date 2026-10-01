# CONTRACT-04 — PATIENT PERSISTENCE A06 RECONCILIATION DECISION

STATUS = RECONCILIATION DECISION
AMENDMENT = A06
SCOPE = PATIENT PERSISTENCE / DOB / TEMPORAL AGE

---

## 1. AUTHORITY

This document reconciles the authorized Patient persistence boundary
with the closed A06 Date-of-Birth / Temporal-Age decision and the
closed Patient Application A06 reconciliation.

This document does not mutate:

- APPLICATION-CAPABILITY-CONTRACT-V1
- CONTRACT-04-PATIENT-INFORMATION-AMENDMENT-A05-RECONCILIATION-DECISION
- CONTRACT-04-PATIENT-DATE-OF-BIRTH-TEMPORAL-AGE-A06-RECONCILIATION-DECISION
- CONTRACT-04-PATIENT-DOMAIN-A06-RECONCILIATION-DECISION
- CONTRACT-04-PATIENT-APPLICATION-A06-RECONCILIATION-DECISION

---

## 2. PERSISTENCE SOURCE-OF-TRUTH RECONCILIATION

DOB = AUTHORITATIVE_PERSISTENT_PATIENT_FACT

AGE = NOT_AN_AUTHORITATIVE_PERSISTENT_PATIENT_FACT

AGE = DERIVED_TEMPORAL_VALUE

AGE_DERIVATION_SOURCE = DOB

The persistence model MUST NOT treat a static stored age value as the
authoritative Patient age.

---

## 3. EXISTING AGE PERSISTENCE

EXISTING_PATIENT_AGE_STORAGE = LEGACY_STATIC_AGE_REPRESENTATION

EXISTING_PATIENT_AGE_AUTHORITY = REVOKED_BY_A06

PATIENT_AGE_STORED_VALUE = NOT_PRODUCT_AUTHORITY

The existence of an existing physical age representation does not
preserve static age as a Product Fact.

No existing persisted age value is reinterpreted as an authoritative
historical Patient fact.

---

## 4. DOB PERSISTENCE

DOB = REQUIRED_PERSISTENT_PATIENT_FACT

DOB_PERSISTENCE_AUTHORITY = YES

DOB becomes part of the authorized Patient persistence representation.

The exact SQL type, constraint design, migration mechanism, and physical
implementation are NOT selected by this reconciliation document.

---

## 5. AGE DERIVATION

AGE_STORAGE_AUTHORITY = NO

AGE_DERIVATION_AUTHORITY = YES

AGE_AT_REGISTRATION = DERIVED

AGE_AT_ENCOUNTER = DERIVED

CURRENT_AGE = DERIVED

AGE_MUST_NOT_BE_RECALCULATED_FROM_OLD_STATIC_AGE = YES

The authoritative temporal calculation source is DOB plus the applicable
temporal reference.

---

## 6. HISTORICAL INTEGRITY

Historical encounter age semantics MUST remain reproducible from:

DOB + applicable encounter temporal reference.

A persisted static age value MUST NOT override the temporal semantics.

Current age MUST NOT overwrite historical encounter meaning.

Clinic Day closure MUST NOT freeze the Patient's age.

---

## 7. PATIENT IDENTITY

PATIENT_TECHNICAL_IDENTITY = DISTINCT_FROM_CPN

CPN = STABLE_PRODUCT_REFERENCE

CPN_AUTHORITY = POSTGRESQL

CPN_ALLOCATION_MECHANISM = POSTGRESQL_SEQUENCE

No A06 persistence reconciliation changes Patient identity or CPN
authority.

---

## 8. REGISTRATION TRANSACTION

PATIENT_REGISTRATION_TRANSACTION = PRESERVED

REGISTER_NEW_PATIENT_TRANSACTION = BEGIN
  ALLOCATE_CPN
  CONSTRUCT_PATIENT
  PERSIST_AUTHORIZED_PATIENT_FACTS
  COMMIT

FAILURE = ROLLBACK

NO_PARTIAL_PATIENT_REGISTRATION = REQUIRED

A06 does not change transaction ownership or rollback semantics.

---

## 9. PHYSICAL STORAGE DECISIONS DEFERRED

The following physical choices are intentionally NOT decided here:

AGE_COLUMN_REMOVAL = NOT_DECIDED_HERE

AGE_COLUMN_RETENTION = NOT_DECIDED_HERE

AGE_COLUMN_REPURPOSING = NOT_DECIDED_HERE

AGE_COLUMN_CACHE_ROLE = NOT_DECIDED_HERE

AGE_COLUMN_MATERIALIZATION = NOT_DECIDED_HERE

DOB_SQL_TYPE = NOT_DECIDED_HERE

DOB_COLUMN_CONSTRAINTS = NOT_DECIDED_HERE

MIGRATION_STRATEGY = NOT_DECIDED_HERE

ORM_MAPPING = NOT_DECIDED_HERE

INDEX_STRATEGY = NOT_DECIDED_HERE

TRIGGER_STRATEGY = NOT_DECIDED_HERE

These require a subsequent implementation authorization gate.

---

## 10. REPOSITORY SEMANTICS

The Repository MUST eventually preserve the distinction between:

1. authoritative persisted Patient facts, and
2. derived temporal application values.

Repository implementation is NOT authorized by this reconciliation
document.

No repository code is changed here.

---

## 11. EXISTING DATA SAFETY

EXISTING_PATIENT_DATA = PRESERVED

NO_EXISTING_PATIENT_ROW_MUTATION = REQUIRED

NO_REAL_SQL_WRITE = REQUIRED

NO_AGE_BACKFILL = AUTHORIZED

NO_HISTORICAL_AGE_REWRITE = AUTHORIZED

No existing Patient row may be altered by this reconciliation.

---

## 12. APPLICATION ALIGNMENT

The Persistence layer MUST align with the closed Application A06
reconciliation:

DOB
  -> AGE DERIVATION
  -> age
  -> APPLICATION / DISPLAY

Therefore:

AGE_APPLICATION_FIELD_NAME = PRESERVED

AGE_PERSISTENCE_AUTHORITY = NO

DOB_PERSISTENCE_AUTHORITY = YES

---

## 13. BOUNDARY PRESERVATION

NO_NEW_CAPABILITY = YES

NO_NEW_ACTOR = YES

NO_NEW_AUTHORITY = YES

NO_AUTHORITY_TRANSFER = YES

PATIENT_IDENTITY = UNCHANGED

CPN = UNCHANGED

RETRIEVAL_METHODS = UNCHANGED

PAST_HISTORY = UNCHANGED

CLINICAL_HISTORY = UNCHANGED

CASE_SCOPE = UNCHANGED

VISIT_SCOPE = UNCHANGED

ENCOUNTER_SCOPE = UNCHANGED

CLINIC_DAY_SCOPE = UNCHANGED

PHARMACOTHERAPY_SCOPE = UNCHANGED

---

## 14. IMPLEMENTATION BOUNDARY

IMPLEMENTATION_AUTHORIZED = NO

SQL_IMPLEMENTATION_AUTHORIZED = NO

DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = NO

REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO

MIGRATION_IMPLEMENTATION_AUTHORIZED = NO

ORM_IMPLEMENTATION_AUTHORIZED = NO

API_IMPLEMENTATION_AUTHORIZED = NO

UI_IMPLEMENTATION_AUTHORIZED = NO

No physical persistence change is authorized by this reconciliation.

---

## 15. DEFERRED DECISIONS PRESERVED

PAST_HISTORY_PERSISTENCE = DEFERRED

CLINICAL_CONTENT_PERSISTENCE = DEFERRED

CASE_PERSISTENCE = DEFERRED

VISIT_PERSISTENCE = DEFERRED

ENCOUNTER_PERSISTENCE = DEFERRED

CLINIC_DAY_PERSISTENCE = DEFERRED

PHARMACOTHERAPY_PERSISTENCE = DEFERRED

AUDIT_EVENT_SOURCING = DEFERRED

MERGE_POLICY = DEFERRED

RETENTION_POLICY = DEFERRED

No deferred Product or persistence decision is resolved here.

---

## 16. RECONCILIATION PROOF REQUIREMENTS

The reconciliation is valid only if:

- DOB is the authoritative persistent Patient temporal fact.
- Static age is not an authoritative persisted Patient fact.
- Application field name "age" remains preserved.
- Age is derived from DOB.
- Historical temporal semantics remain reproducible.
- CPN authority remains PostgreSQL.
- Patient technical identity remains distinct from CPN.
- Registration transaction semantics remain preserved.
- Existing Patient data is not mutated.
- No SQL is executed.
- No migration is executed.
- No repository code is changed.
- No API/UI implementation is changed.
- No new capability is introduced.
- No actor authority changes.
- No deferred decision is silently resolved.

---

## 17. DECISION CLOSURE

PATIENT_PERSISTENCE_A06_RECONCILIATION = CLOSED + PROVEN

FAIL = 0

NEXT GATE = PERSISTENCE_A06_IMPLEMENTATION_AUTHORIZATION

# CONTRACT-04 — PATIENT PERSISTENCE A06 IMPLEMENTATION AUTHORIZATION

STATUS = IMPLEMENTATION AUTHORIZATION
AMENDMENT = A06
SCOPE = PATIENT PERSISTENCE / DOB / TEMPORAL AGE

---

## 1. AUTHORITY

This authorization is subordinate to and dependent upon:

- CONTRACT-04-PATIENT-DATE-OF-BIRTH-TEMPORAL-AGE-A06-RECONCILIATION-DECISION
- CONTRACT-04-PATIENT-DOMAIN-A06-RECONCILIATION-DECISION
- CONTRACT-04-PATIENT-DOMAIN-A06-IMPLEMENTATION-AUTHORIZATION
- CONTRACT-04-PATIENT-APPLICATION-A06-RECONCILIATION-DECISION
- CONTRACT-04-PATIENT-PERSISTENCE-A06-RECONCILIATION-DECISION
- Existing closed Patient Persistence technical authority

No prior contract is mutated.

---

## 2. IMPLEMENTATION AUTHORIZATION

PERSISTENCE_A06_IMPLEMENTATION_AUTHORIZED = YES

AUTHORIZATION_SCOPE = PATIENT_PERSISTENCE_A06_ONLY

DOB_PERSISTENCE_IMPLEMENTATION = AUTHORIZED

AGE_PERSISTENCE_SEMANTIC_TRANSITION = AUTHORIZED

PATIENT_REPOSITORY_A06_ADJUSTMENT = AUTHORIZED

PATIENT_REGISTRATION_PERSISTENCE_ALIGNMENT = AUTHORIZED

PATIENT_RETRIEVAL_PERSISTENCE_ALIGNMENT = AUTHORIZED

---

## 3. SOURCE-OF-TRUTH AUTHORITY

DOB = AUTHORITATIVE_PERSISTENT_PATIENT_FACT

AGE = DERIVED_TEMPORAL_VALUE

AGE_IS_AUTHORITATIVE_STORED_PATIENT_FACT = NO

AGE_DERIVATION_SOURCE = DOB

AGE_AT_REGISTRATION = DERIVED

AGE_AT_ENCOUNTER = DERIVED

CURRENT_AGE = DERIVED

The implementation MUST NOT preserve a static persisted age value as
the authoritative Patient age.

---

## 4. EXISTING AGE REPRESENTATION

The existing application/display field name:

age

MUST remain available at the Application boundary.

Its value MUST transition to DOB-derived semantics.

AGE_APPLICATION_FIELD_NAME = PRESERVED

AGE_VALUE_SOURCE = DOB_DERIVATION

AGE_PERSISTENCE_AUTHORITY = NO

The physical implementation MUST NOT silently redefine age as a new
Product identity or Patient identity.

---

## 5. DOB IMPLEMENTATION

DOB MUST become part of the authorized Patient persistence boundary.

The implementation MUST preserve:

- Patient technical identity
- CPN
- Patient Basic / Personal Data boundary
- existing registration transaction semantics
- existing retrieval behavior
- existing actor authority
- existing Product scope

---

## 6. AUTHORIZED PHYSICAL CHANGE

The implementation MAY make the minimum persistence changes required to:

1. persist DOB as the authoritative Patient fact;
2. stop treating persisted static age as authoritative;
3. align Patient registration with DOB-based semantics;
4. align Patient retrieval with DOB-based semantics;
5. preserve the Application field representation named "age" through
   derived semantics.

No unrelated persistence structure may be changed.

---

## 7. AGE COLUMN DECISION

The physical age column decision is authorized only to the extent
required to remove its authority from the Patient Product model.

The implementation MUST NOT introduce a second authoritative age fact.

Any physical treatment of the existing age representation MUST satisfy:

AGE_COLUMN_PRODUCT_AUTHORITY = NO

AGE_DERIVATION_AUTHORITY = DOB

The implementation MUST preserve existing data safety.

No historical Patient row may be rewritten merely to manufacture
historical ages.

No age backfill is authorized.

---

## 8. CPN AND IDENTITY PRESERVATION

PATIENT_TECHNICAL_IDENTITY = DISTINCT_FROM_CPN

CPN = STABLE

CPN_AUTHORITY = POSTGRESQL

CPN_ALLOCATION_MECHANISM = POSTGRESQL_SEQUENCE

PATIENT_REGISTRATION_TRANSACTION = PRESERVED

NO_PARTIAL_PATIENT_REGISTRATION = REQUIRED

The A06 implementation MUST NOT alter CPN allocation semantics.

---

## 9. TRANSACTION BOUNDARY

Registration MUST continue to preserve:

BEGIN
  allocate CPN
  construct Patient
  persist authorized Patient facts
  COMMIT

Failure MUST produce:

ROLLBACK

No separate transaction may be introduced solely for age derivation.

---

## 10. RETRIEVAL SEMANTICS

Patient retrieval MUST preserve:

- technical Patient identity
- CPN
- Patient Basic / Personal Data
- DOB
- derived age semantics

Current displayed age MUST be derived from DOB and the applicable
current temporal reference.

Historical encounter age semantics MUST remain based on DOB plus the
applicable encounter temporal reference.

---

## 11. AUTHORIZED FILE / CODE BOUNDARY

AUTHORIZED IMPLEMENTATION SURFACE = EXISTING PATIENT PERSISTENCE AND
APPLICATION REGISTRATION / RETRIEVAL PATHS REQUIRED FOR A06 ALIGNMENT

The implementation MAY modify only existing files necessary for the
authorized A06 persistence behavior.

No unrelated file or subsystem may be changed.

---

## 12. EXPLICITLY NOT AUTHORIZED

CASE_IMPLEMENTATION = NO

VISIT_IMPLEMENTATION = NO

ENCOUNTER_IMPLEMENTATION = NO

CLINIC_DAY_IMPLEMENTATION = NO

PHARMACOTHERAPY_IMPLEMENTATION = NO

PAST_HISTORY_IMPLEMENTATION = NO

AUDIT_IMPLEMENTATION = NO

MERGE_IMPLEMENTATION = NO

RETENTION_IMPLEMENTATION = NO

AUTHENTICATION_IMPLEMENTATION = NO

AUTHORIZATION_IMPLEMENTATION = NO

DEPLOYMENT_IMPLEMENTATION = NO

UNRELATED_DATABASE_SCHEMA_CHANGE = NO

UNRELATED_SQL = NO

UNRELATED_REPOSITORY_CHANGE = NO

NEW_CAPABILITY = NO

NEW_ACTOR = NO

AUTHORITY_TRANSFER = NO

PRODUCT_SCOPE_EXPANSION = NO

---

## 13. MIGRATION / ORM BOUNDARY

MIGRATION_IMPLEMENTATION = NO

ORM_IMPLEMENTATION = NO

TRIGGER_IMPLEMENTATION = NO

AUTOMATIC_HISTORICAL_AGE_BACKFILL = NO

AUTOMATIC_AGE_CACHE = NO

No migration framework, ORM, trigger, or background age-materialization
mechanism may be introduced by this authorization.

---

## 14. API / UI BOUNDARY

API_IMPLEMENTATION = NO

UI_IMPLEMENTATION = NO

The existing application representation named "age" may be prepared
through the authorized application/persistence alignment, but no API
contract or UI implementation is authorized by this document.

---

## 15. DATA SAFETY

EXISTING_PATIENT_DATA = MUST_BE_PRESERVED

EXISTING_CPN_VALUES = MUST_BE_PRESERVED

EXISTING_PATIENT_IDENTITIES = MUST_BE_PRESERVED

NO_HISTORICAL_ROW_REWRITE = REQUIRED

NO_UNRELATED_DATA_MUTATION = REQUIRED

The implementation MUST NOT rerun a real Patient registration merely
for proof.

Existing proven Patient rows, including the first real SQL proof row,
MUST remain preserved.

---

## 16. PROOF REQUIREMENTS

After implementation:

- Patient persistence tests MUST pass.
- Patient registration transaction tests MUST pass.
- Patient retrieval tests MUST pass.
- Application registration regression MUST pass.
- Existing Patient repository regression MUST pass.
- DOB persistence MUST be proven.
- Static persisted age MUST NOT be authoritative.
- CPN sequence semantics MUST remain intact.
- Existing proven rows MUST remain intact.
- No unrelated database mutation may occur.
- No unauthorized subsystem may be modified.
- FAIL MUST = 0.

Proof MUST distinguish:

REAL SQL PERSISTENCE

from

MOCK TRANSACTION PROOF.

No additional real SQL Patient registration is required merely to prove
the application contract if existing data can establish the required
persistence facts through read-only verification.

---

## 17. AUTHORIZATION CLOSURE

PERSISTENCE_A06_IMPLEMENTATION_AUTHORIZED = YES

AUTHORIZATION_SCOPE = PATIENT_PERSISTENCE_A06_ONLY

UNAUTHORIZED_SCOPE_EXPANSION = NO

FAIL = 0

NEXT GATE = PATIENT_PERSISTENCE_A06_IMPLEMENTATION

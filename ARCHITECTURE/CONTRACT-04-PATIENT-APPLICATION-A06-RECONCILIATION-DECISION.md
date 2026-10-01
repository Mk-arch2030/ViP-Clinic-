# CONTRACT-04 — PATIENT APPLICATION A06 RECONCILIATION DECISION

STATUS = RECONCILIATION DECISION
AMENDMENT = A06
SCOPE = PATIENT APPLICATION / BASIC PERSONAL DATA / TEMPORAL AGE SEMANTICS

---

## 1. AUTHORITY

This document reconciles the existing Patient Application Capability semantics
with the closed Patient A06 Date-of-Birth / Temporal-Age decision.

This document MUST NOT mutate or replace:

- APPLICATION-CAPABILITY-CONTRACT-V1
- CONTRACT-04-PATIENT-INFORMATION-AMENDMENT-A05-RECONCILIATION-DECISION
- CONTRACT-04-PATIENT-DATE-OF-BIRTH-TEMPORAL-AGE-A06-RECONCILIATION-DECISION
- PATIENT-DOMAIN-A06-RECONCILIATION-DECISION

This is a reconciliation decision only.

---

## 2. CORE RECONCILIATION

DOB = APPLICATION_PATIENT_BASIC_PERSONAL_DATA = YES

DOB = AUTHORITATIVE_PATIENT_FACT

AGE = PRESERVED_APPLICATION_DISPLAY_FIELD_NAME

AGE = APPLICATION_DERIVED_TEMPORAL_VALUE

AGE_IS_AUTHORITATIVE_STORED_PATIENT_FACT = NO

AGE_AT_REGISTRATION = DERIVED

AGE_AT_ENCOUNTER = DERIVED

CURRENT_AGE = DERIVED

AGE_DERIVATION_SOURCE = DOB

---

## 3. REGISTER NEW PATIENT

REGISTER_NEW_PATIENT_CAPABILITY = UNCHANGED

The existing Register New Patient capability remains the same
Product capability.

A06 does NOT create a new registration capability.

Registration continues to establish the Patient and the existing
approved Patient Basic / Personal Data boundary.

The reconciled temporal semantics are:

DOB is captured as the persistent Patient fact.

The application representation named "age" remains available as the
application/display representation, but its value is derived from DOB.

AGE_AT_REGISTRATION = DERIVED_FROM_DOB

No independent authoritative age fact is established.

---

## 4. RETRIEVE EXISTING PATIENT

RETRIEVE_EXISTING_PATIENT_CAPABILITY = UNCHANGED

Existing Patient retrieval remains unchanged in capability scope.

Retrieved/displayed age MUST be understood as a derived temporal value
from DOB rather than as an authoritative stored Patient fact.

CURRENT_AGE = DERIVED_FROM_DOB_AND_RELEVANT_CURRENT_DATE

---

## 5. ENCOUNTER TEMPORAL SEMANTICS

AGE_AT_ENCOUNTER = DERIVED_FROM_DOB_AND_ENCOUNTER_DATE

Historical encounter age semantics MUST remain reproducible from:

DOB + applicable encounter temporal reference.

A current age display MUST NOT overwrite or redefine historical temporal
semantics.

---

## 6. CLINIC DAY INDEPENDENCE

CLINIC_DAY_OPEN = DOES_NOT_DEFINE_AGE

CLINIC_DAY_CLOSE = DOES_NOT_DEFINE_AGE

CLINIC_DAY_CLOSURE = DOES_NOT_FREEZE_AGE

SESSION_STATE = DOES_NOT_DEFINE_AGE

The Patient's age remains a temporal value derived from DOB and the
applicable date.

---

## 7. PRODUCT SURFACE PRESERVATION

The existing application/display representation name:

age

is PRESERVED.

Its semantic authority is reconciled as:

DOB
  -> AGE DERIVATION
  -> age
  -> APPLICATION / DISPLAY

Therefore:

SURFACE_FIELD_NAME = PRESERVED

FIELD_VALUE_AUTHORITY = CHANGED_TO_DOB_DERIVATION

This reconciliation preserves the established application surface
without preserving static age as an authoritative Patient fact.

---

## 8. PATIENT IDENTITY

PATIENT_IDENTITY = UNCHANGED

CPN = STABLE

PATIENT_TECHNICAL_IDENTITY = DISTINCT_FROM_CPN

RETRIEVAL_METHODS = UNCHANGED

No new Patient identity is introduced.

---

## 9. CAPABILITY / ACTOR / AUTHORITY PRESERVATION

NEW_CAPABILITY = NO

NEW_ACTOR = NO

NEW_AUTHORITY = NO

AUTHORITY_TRANSFER = NO

NEW_RETRIEVAL_METHOD = NO

NEW_WORKFLOW = NO

CASE_SCOPE_EXPANSION = NO

VISIT_SCOPE_EXPANSION = NO

ENCOUNTER_SCOPE_EXPANSION = NO

CLINIC_DAY_SCOPE_EXPANSION = NO

PHARMACOTHERAPY_SCOPE_EXPANSION = NO

---

## 10. CONTRACT PRESERVATION

CONTRACT_MUTATION = NO

EXISTING_REGISTER_NEW_PATIENT_CONTRACT = PRESERVED

EXISTING_RETRIEVE_EXISTING_PATIENT_CAPABILITY = PRESERVED

A06 RECONCILIATION = SEMANTIC_ALIGNMENT_ONLY

No original contract is rewritten by this document.

---

## 11. PERSISTENCE BOUNDARY

This reconciliation DOES NOT authorize:

SQL_IMPLEMENTATION = NO

DATABASE_SCHEMA_IMPLEMENTATION = NO

MIGRATION_IMPLEMENTATION = NO

ORM_IMPLEMENTATION = NO

REPOSITORY_IMPLEMENTATION = NO

AGE_COLUMN_REMOVAL = NOT_DECIDED_HERE

AGE_COLUMN_RETENTION = NOT_DECIDED_HERE

AGE_CACHING = NOT_DECIDED_HERE

AGE_MATERIALIZATION = NOT_DECIDED_HERE

DOB_SQL_TYPE = NOT_DECIDED_HERE

PERSISTENCE_TIMESTAMP_SELECTION = NOT_DECIDED_HERE

These decisions require the separate Persistence A06 reconciliation gate.

---

## 12. API / UI BOUNDARY

API_IMPLEMENTATION = NO

UI_IMPLEMENTATION = NO

AUTHENTICATION_IMPLEMENTATION = NO

AUTHORIZATION_IMPLEMENTATION = NO

The intended application/display semantic remains:

CPN + Patient Name + DOB + Current Derived Age
+ Profession + Phone + Gender

This section defines semantic reconciliation only.

It does NOT authorize API or UI implementation.

---

## 13. DOMAIN ALIGNMENT

The Application layer MUST align with the already closed Domain A06
decision:

DOB = APPROVED_PATIENT_FACT

AGE = DERIVED_TEMPORAL_VALUE

AGE_AT_REGISTRATION = DERIVED

AGE_AT_ENCOUNTER = DERIVED

CURRENT_AGE = DERIVED

CPN = STABLE

PATIENT_IDENTITY = UNCHANGED

No domain redefinition is introduced here.

---

## 14. DEFERRED DECISIONS PRESERVED

PAST_HISTORY = DEFERRED

CLINICAL_HISTORY_PERSISTENCE = DEFERRED

CASE_IMPLEMENTATION = DEFERRED

VISIT_IMPLEMENTATION = DEFERRED

ENCOUNTER_IMPLEMENTATION = DEFERRED

CLINIC_DAY_IMPLEMENTATION = DEFERRED

PHARMACOTHERAPY_IMPLEMENTATION = DEFERRED

AUDIT_EVENT_SOURCING = DEFERRED

MERGE_POLICY = DEFERRED

RETENTION_POLICY = DEFERRED

No deferred decision is resolved by this reconciliation.

---

## 15. IMPLEMENTATION AUTHORIZATION

IMPLEMENTATION_AUTHORIZED = NO

This document itself authorizes no code change.

The next implementation authorization MUST explicitly identify the
authorized application changes and their proof boundary.

Persistence changes remain independently gated.

API/UI changes remain independently gated.

---

## 16. RECONCILIATION PROOF REQUIREMENTS

The reconciliation is valid only if all of the following remain true:

- Existing Register New Patient capability is preserved.
- Existing Retrieve Existing Patient capability is preserved.
- DOB is the authoritative Patient temporal fact.
- Age is derived.
- Static age is not an authoritative Patient fact.
- CPN remains stable.
- Patient identity remains unchanged.
- No new actor is introduced.
- No authority is transferred.
- No new capability is introduced.
- No persistence decision is silently made.
- No SQL is executed.
- No database mutation is performed.
- No API/UI implementation is performed.
- No original contract is mutated.
- No deferred decision is resolved.

---

## 17. DECISION CLOSURE

PATIENT_APPLICATION_A06_RECONCILIATION = CLOSED + PROVEN

FAIL = 0

NEXT GATE = PERSISTENCE_A06_RECONCILIATION

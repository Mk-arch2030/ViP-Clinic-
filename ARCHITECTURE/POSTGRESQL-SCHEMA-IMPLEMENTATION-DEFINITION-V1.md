# Dr.Roby Clinic — PostgreSQL Schema Implementation Definition V1

DOCUMENT = POSTGRESQL SCHEMA IMPLEMENTATION DEFINITION
PRODUCT = Dr.Roby Clinic
STATUS = DEFINITION CLOSED

---

## 1. PURPOSE

This document defines the exact physical PostgreSQL scope for the first
bounded persistence implementation increment.

The increment exists only to support:

- authoritative CPN allocation;
- first Patient registration;
- durable Patient identity;
- stable Patient CPN;
- required Patient information persistence;
- bounded transactional integration.

This document does not implement the schema.

It defines the physical implementation boundary that may be executed by the
authorized PostgreSQL persistence increment.

---

## 2. AUTHORITY

This definition is governed by:

- PERSISTENCE-TECHNICAL-CONTRACT-V1
- PERSISTENCE-TECHNICAL-CONTRACT-PROOF
- PERSISTENCE-SCHEMA-DEFINITION-V1
- PERSISTENCE-PHYSICAL-STRUCTURAL-IMPLEMENTATION-V1
- PERSISTENCE-IMPLEMENTATION-AUTHORIZATION-DECISION-V1
- DATABASE-TECHNOLOGY-FACTORY-DECISION-V1
- DATABASE-TECHNOLOGY-TECHNICAL-DESIGN-V1
- DATABASE-TECHNOLOGY-TECHNICAL-DESIGN-CLOSURE-PROOF-V1
- POSTGRESQL-PERSISTENCE-IMPLEMENTATION-PLAN-V1
- POSTGRESQL-PERSISTENCE-IMPLEMENTATION-PLAN-CLOSURE-PROOF-V1
- POSTGRESQL-PERSISTENCE-IMPLEMENTATION-AUTHORIZATION-V1
- CPN-GENERATION-IMPLEMENTATION-AUTHORIZATION-DECISION-V1
- CPN-GENERATION-IMPLEMENTATION-DEFINITION-V1
- APPLICATION-CAPABILITY-CONTRACT-V1
- FINAL-AUTHORITY-MAP-V1

No closed Product or Domain decision is reopened.

---

## 3. IMPLEMENTATION SCOPE

This increment contains exactly two physical PostgreSQL objects:

1. CPN allocation sequence.
2. Patient persistence table.

No additional physical schema object is authorized by this definition.

---

## 4. DATABASE TARGET

DATABASE TECHNOLOGY = PostgreSQL

TARGET DATABASE = dr_roby_clinic

TARGET ROLE = u0_a282

This definition concerns only the Dr.Roby Clinic database.

The following databases are explicitly outside this implementation:

- shipping_db
- supermarket_pos

No object may be created, altered, dropped, or inspected for mutation in
those databases by this increment.

---

## 5. CPN ALLOCATION SEQUENCE

The implementation shall create one PostgreSQL sequence dedicated to
authoritative Clinic Patient Number allocation.

PROPOSED OBJECT:

`clinic_patient_number_seq`

Required behavior:

- PostgreSQL sequence.
- Starts at 1.
- Allocates sequential numeric values.
- PostgreSQL is the authoritative allocation boundary.
- Allocation is independent of application process memory.
- Concurrent allocations receive distinct numeric values.
- The sequence is an internal technical mechanism.
- The sequence is not a Product entity.
- Sequential allocation does not imply gapless allocation.

Product CPN construction remains:

`CPN-` + allocated numeric value

The sequence MUST NOT be used as:

- Case identity;
- Visit identity;
- Clinic Day identity;
- Patient Product identity.

---

## 6. PATIENT TABLE

The implementation shall create one physical Patient persistence table.

PROPOSED OBJECT:

`patients`

Purpose:

Persist the durable Patient identity required by the first Register New Patient
increment.

The table shall contain:

### 6.1 Technical Patient Identifier

PROPOSED COLUMN:

`patient_id`

Representation:

- Physical identifier type = PostgreSQL `UUID`.
- Physical identifier generation mechanism = PostgreSQL 18 native `uuidv7()`.
- Authority = POSTGRESQL-PHYSICAL-DATA-TYPES-DECISION-V1.
- The technical Patient persistence identifier remains distinct from CPN.
- Physical representation is authorized by POSTGRESQL-PHYSICAL-DATA-TYPES-DECISION-V1.

Meaning:

- Internal persistence identity only.
- Not the CPN.
- Not exposed as the Product clinic reference.
- Must remain distinct from `clinic_patient_number`.

### 6.2 Clinic Patient Number

PROPOSED COLUMN:

`clinic_patient_number`

Representation:

- PostgreSQL text representation.
- NOT NULL.
- UNIQUE.

Meaning:

- Stable Product-level Clinic Patient Number.
- Constructed as `CPN-` plus the authoritative sequential number.
- Established during first Patient registration.
- Stable for the Patient.
- Never a Visit, Case, or Clinic Day identifier.

### 6.3 Patient Name

PROPOSED COLUMN:

`name`

Representation:

- PostgreSQL text.
- Required for Patient registration.

Meaning:

- Patient basic/personal information.

### 6.4 Patient Age

PROPOSED COLUMN:

`age`

Representation:

- PostgreSQL integer.

Meaning:

- Patient basic/personal information.
- No unrelated demographic model is introduced.

### 6.5 Patient Profession

PROPOSED COLUMN:

`profession`

Representation:

- PostgreSQL text.

Meaning:

- Patient basic/personal information.
- No occupation/domain taxonomy is introduced.

### 6.6 Patient Phone

PROPOSED COLUMN:

`phone`

Representation:

- Physical storage type = PostgreSQL `TEXT`.
- Authority = POSTGRESQL-PHYSICAL-DATA-TYPES-DECISION-V1.
- Required according to the established Patient information boundary.

No phone normalization algorithm, validation algorithm, physical storage type,
or retrieval authority is invented by this definition.

### 6.7 Patient Gender

PROPOSED COLUMN:

`gender`

Representation:

- Physical storage type = PostgreSQL `TEXT`.
- Authority = POSTGRESQL-PHYSICAL-DATA-TYPES-DECISION-V1.
- Required according to the established Patient information boundary.

Allowed Product values:

- Male
- Female

No additional gender value or physical storage representation is introduced.

---

## 7. FIRST-INCREMENT RELATIONSHIP MAP

The physical relationship for this increment is:

CPN Sequence
    |
    | authoritative numeric allocation
    v
Patient
    |
    +-- technical persistence identity
    |
    +-- stable CPN
    |
    +-- Patient basic/personal information

No Case, Visit, or Clinic Day foreign key is introduced.

---

## 8. FIRST REGISTRATION TRANSACTION BOUNDARY

The physical schema must support this bounded workflow:

BEGIN
→ allocate next value from CPN sequence
→ construct CPN = `CPN-` + allocated value
→ construct Patient domain object
→ persist Patient identity and authorized Patient information
→ COMMIT

Failure:

ROLLBACK

The implementation must not report a successful Patient registration while
leaving a partially persisted Patient identity.

---

## 9. CPN UNIQUENESS

The Patient table shall provide an authoritative uniqueness guarantee for:

`clinic_patient_number`

Application-level uniqueness checks are not sufficient as the final
persistence authority.

The database uniqueness constraint is the authoritative persisted guarantee.

---

## 10. PATIENT IDENTITY SEPARATION

The implementation MUST preserve:

`patient_id != clinic_patient_number`

The technical persistence identity and Product CPN are separate concepts.

No implementation may use the CPN as the database primary key merely for
convenience.

No implementation may derive the technical Patient identity from the CPN.

---

## 11. RETURNING PATIENT SAFETY

This first physical increment must preserve the rule that a returning Patient
resolves to the existing Patient identity and existing CPN.

No Visit, Case, or Clinic Day object is permitted to allocate a new CPN.

No second CPN may be generated for an already persisted Patient identity.

---

## 12. PAST HISTORY BOUNDARY

Past History is an established Patient-level Product concept.

However, its physical representation remains deliberately unresolved by this
first physical increment because the authoritative schema definition does not
select:

- Past History table structure;
- Past History item columns;
- Past History storage representation;
- amendment mechanism.

Therefore this increment MUST NOT invent a Past History physical mechanism.

No JSON/document storage, text serialization, generic history field, or
unapproved Past History table is introduced.

Past History physical persistence remains a separate bounded technical gate.

---

## 13. DEFERRED CLINICAL PERSISTENCE

The following remain outside this first physical increment:

- Case;
- Visit;
- Clinic Day;
- Visit Type physical representation;
- Visit Protection State;
- Case State;
- Case Completion;
- Current Complaint;
- Investigation;
- Diagnosis;
- Treatment;
- Follow-up;
- Follow-up Task;
- Clinical History source;
- Clinical Content amendment mechanism;
- Clinical Attachments;
- Actor persistence.

Their absence from this increment does not remove them from the
authorized future persistence boundary.

---

## 14. EXPLICITLY PROHIBITED OBJECTS

This implementation definition authorizes NO physical implementation of:

- cases
- visits
- clinic_days
- past_history_items
- actors
- current_complaints
- investigations
- diagnoses
- treatments
- follow_ups
- follow_up_tasks
- clinical_attachments
- audit_logs
- event_store
- state_history
- amendment_history
- trash tables
- retention tables
- merge tables
- appointment tables
- billing tables
- payment tables
- accounting tables
- pharmacy tables
- laboratory tables
- insurance tables
- reporting/analytics tables

---

## 15. EXPLICITLY PROHIBITED MECHANISMS

This increment shall NOT introduce:

- ORM;
- repository implementation;
- API routes;
- UI changes;
- authentication;
- authorization runtime;
- database triggers;
- generic audit logging;
- event sourcing;
- generic state history;
- caching;
- deployment changes;
- multi-branch structures;
- multi-tenant structures;
- Patient Merge;
- Delete/Trash/Retention implementation;
- unrelated migrations;
- unrelated services;
- unrelated runtime refactoring.

---

## 16. MOCK RUNTIME PROTECTION

The existing mock/test runtime remains protected.

This schema implementation definition does not authorize deletion,
replacement, or broad rewriting of:

`frontend/src/adapters/mockClinicService.js`

The PostgreSQL persistence increment is introduced incrementally behind the
appropriate application boundary.

---

## 17. DOMAIN PROTECTION

The existing Patient domain remains authoritative for Patient domain
construction.

This schema definition does not redesign:

`domain/patient.js`

and does not redefine the established:

`application/services/register-new-patient.js`

capability.

Any required integration adjustment must remain within the separately
authorized PostgreSQL Patient-registration increment.

---

## 18. CONTRACT AND SCOPE SAFETY

NEW_PRODUCT_CAPABILITY = NO
NEW_ACTOR = NO
AUTHORITY_TRANSFER = NO
CONTRACT_MUTATION = NO
UNAUTHORIZED_SCOPE_EXPANSION = NO
CLOSED_DECISION_REOPENED = NO

---

## 19. DEFERRED PHYSICAL DECISIONS PRESERVED

The physical decisions formerly deferred by this definition are now resolved by
POSTGRESQL-PHYSICAL-DATA-TYPES-DECISION-V1:

- technical Patient identifier type = PostgreSQL `UUID`;
- technical Patient identifier generation mechanism = PostgreSQL 18 native `uuidv7()`;
- physical Phone storage type = PostgreSQL `TEXT`;
- physical Gender storage type = PostgreSQL `TEXT`.

No numeric identifier, BIGINT, identity column, or serial mechanism is selected.

---

## 20. IMPLEMENTATION STATUS

SCHEMA_DEFINITION = DEFINED
SCHEMA_EXECUTION = NOT_PERFORMED
SQL_EXECUTION = NOT_PERFORMED
MIGRATION_EXECUTION = NOT_PERFORMED
CPN_SEQUENCE_CREATED = NO
PATIENT_TABLE_CREATED = NO
PATIENT_DATA_WRITTEN = NO
APPLICATION_INTEGRATION = NOT_PERFORMED
IMPLEMENTATION_PROVEN = NO

---

## 21. PROOF REQUIREMENTS

Before this increment is considered proven, direct evidence must establish:

1. CPN sequence exists.
2. CPN sequence starts at 1.
3. First allocated value produces `CPN-1`.
4. Subsequent allocation produces a distinct sequential value.
5. Patient technical identity is distinct from CPN.
6. Persisted CPN uniqueness is enforced.
7. Required Patient information persists.
8. Patient registration transaction commits atomically.
9. Failed registration does not leave an invalid Patient row.
10. Concurrent CPN allocation does not duplicate values.
11. Existing Patient domain construction remains valid.
12. Mock/test runtime remains preserved.
13. No unauthorized schema object exists.
14. No contract mutation occurred.
15. No scope expansion occurred.
16. FAIL = 0.

---

## 22. GOVERNANCE

This definition does not execute SQL.

This definition does not create the migration.

This definition does not create the CPN sequence.

This definition does not create the Patient table.

Execution requires the already-established PostgreSQL Persistence
Implementation Authorization and must remain exactly within this definition.

No deferred technical decision may be silently resolved during execution.

Any newly encountered technical requirement outside this definition must stop
the bounded implementation and return to its own definition/authorization gate.

---

## 23. NEXT GATE

POSTGRESQL SCHEMA IMPLEMENTATION DEFINITION REVIEW

FAIL = 0

END OF POSTGRESQL SCHEMA IMPLEMENTATION DEFINITION V1

# Dr.Roby Clinic — PostgreSQL Physical Data Types Decision V1

DOCUMENT = POSTGRESQL PHYSICAL DATA TYPES DECISION
STATUS = DECISION CLOSED
PRODUCT = Dr.Roby Clinic

---

## 1. PURPOSE

Resolve only the physical data-type decisions that remain explicitly
DEFERRED for the authorized first PostgreSQL Patient schema increment.

This decision does not expand the schema scope.

---

## 2. AUTHORITY BASIS

This decision is governed by:

- POSTGRESQL-SCHEMA-IMPLEMENTATION-DEFINITION-V1
- POSTGRESQL-PHYSICAL-NAMING-DECISION-V1
- POSTGRESQL-SCHEMA-IMPLEMENTATION-PLAN-V1
- PERSISTENCE-TECHNICAL-CONTRACT-V1
- PERSISTENCE-SCHEMA-DEFINITION-V1
- PERSISTENCE-PHYSICAL-STRUCTURAL-IMPLEMENTATION-V1
- DATABASE-TECHNOLOGY-TECHNICAL-DESIGN-V1
- PostgreSQL 18 native UUID support and UUIDv7 generation capability

No closed Product, Domain, Persistence, CPN, or Authority decision is
redefined by this document.

---

## 3. BOUNDED SCOPE

This decision resolves only:

1. Patient technical persistence identifier physical type.
2. Patient technical persistence identifier generation mechanism.
3. Patient Phone physical storage type.
4. Patient Gender physical storage type.

No other physical object, capability, actor, authority, workflow, or
clinical concept is introduced.

---

## 4. PATIENT TECHNICAL IDENTIFIER

PHYSICAL COLUMN:

`patient_id`

DECISION:

- Physical type = PostgreSQL `UUID`.
- Generation mechanism = PostgreSQL 18 native `uuidv7()`.
- The identifier is generated for persistence identity.
- The identifier remains distinct from CPN.
- The identifier is not the Product clinic reference.
- The identifier is not a Visit, Case, or Clinic Day identifier.

RATIONALE:

PostgreSQL provides native UUID storage and PostgreSQL 18 provides
UUIDv7 generation.

The technical persistence identifier therefore does not require a new
database sequence or identity-column mechanism.

No additional PostgreSQL physical object is introduced by this decision.

---

## 5. CLINIC PATIENT NUMBER

PHYSICAL COLUMN:

`clinic_patient_number`

EXISTING AUTHORITY CONFIRMATION:

- Physical representation = PostgreSQL `TEXT`.
- NOT NULL.
- UNIQUE.
- Value format = `CPN-` + authoritative sequential numeric value.
- Numeric allocation remains owned by `clinic_patient_number_seq`.
- Sequence starts at 1 and increments by 1.
- CPN remains distinct from `patient_id`.

This section confirms existing authority only.
It does not redefine the CPN decision.

---

## 6. PATIENT NAME

PHYSICAL COLUMN:

`name`

EXISTING AUTHORITY CONFIRMATION:

- Physical representation = PostgreSQL `TEXT`.
- Required for Patient registration.

No new decision is introduced.

---

## 7. PATIENT AGE

PHYSICAL COLUMN:

`age`

EXISTING AUTHORITY CONFIRMATION:

- Physical representation = PostgreSQL `INTEGER`.

No unrelated demographic model is introduced.

---

## 8. PATIENT PROFESSION

PHYSICAL COLUMN:

`profession`

EXISTING AUTHORITY CONFIRMATION:

- Physical representation = PostgreSQL `TEXT`.

No occupation taxonomy is introduced.

---

## 9. PATIENT PHONE

PHYSICAL COLUMN:

`phone`

DECISION:

- Physical storage type = PostgreSQL `TEXT`.

The value remains Patient information only.

This decision does NOT introduce:

- phone normalization;
- phone validation algorithm;
- phone uniqueness;
- multiple-phone behavior;
- phone retrieval authority;
- privacy policy;
- new Patient identity behavior.

Those remain governed by their existing boundaries.

---

## 10. PATIENT GENDER

PHYSICAL COLUMN:

`gender`

DECISION:

- Physical storage type = PostgreSQL `TEXT`.

Established Product values remain:

- Male
- Female

This decision does NOT introduce:

- additional gender values;
- gender retrieval authority;
- gender identity behavior;
- demographic taxonomy.

---

## 11. COMPLETE FIRST-INCREMENT TYPE MAP

| Physical Column | PostgreSQL Type | Generation |
|---|---|---|
| `patient_id` | `UUID` | PostgreSQL 18 `uuidv7()` |
| `clinic_patient_number` | `TEXT` | CPN sequence + application construction |
| `name` | `TEXT` | supplied Patient information |
| `age` | `INTEGER` | supplied Patient information |
| `profession` | `TEXT` | supplied Patient information |
| `phone` | `TEXT` | supplied Patient information |
| `gender` | `TEXT` | supplied Patient information |

---

## 12. PHYSICAL OBJECT BOUNDARY

This decision authorizes no additional physical PostgreSQL object.

Authorized first-increment physical objects remain exactly:

1. `clinic_patient_number_seq`
2. `patients`

No identity-column mechanism is introduced.

No additional sequence is introduced.

No extension is required by this decision.

No UUID extension installation is required for PostgreSQL 18 `uuidv7()`.

---

## 13. EXPLICITLY NOT DECIDED

This document does not decide:

- SQL syntax;
- migration syntax;
- indexes beyond already-authorized constraints;
- repository implementation;
- application integration;
- API;
- UI;
- authentication;
- authorization;
- Case persistence;
- Visit persistence;
- Clinic Day persistence;
- Past History physical persistence;
- Clinical Content physical persistence;
- Follow-up persistence;
- Attachments;
- Audit/Event Sourcing;
- Delete/Retention;
- Patient Merge;
- deployment;
- concurrency implementation outside the established CPN sequence;
- transaction implementation details beyond already-closed direction.

---

## 14. SAFETY

CONTRACT_MUTATION = NO

SCOPE_EXPANSION = NO

AUTHORITY_TRANSFER = NO

NEW_CAPABILITY = NO

NEW_ACTOR = NO

UNAUTHORIZED_OBJECT = NO

SHIPPING_DB = NOT TOUCHED

SUPERMARKET_POS = NOT TOUCHED

SQL_EXECUTION = NOT_PERFORMED

SCHEMA_EXECUTION = NOT_PERFORMED

PATIENT_DATA_WRITTEN = NOT_PERFORMED

IMPLEMENTATION_PROVEN = NO

FAIL = 0

---

## 15. NEXT GATE

POSTGRESQL PHYSICAL DATA TYPES DECISION REVIEW

END OF POSTGRESQL PHYSICAL DATA TYPES DECISION V1

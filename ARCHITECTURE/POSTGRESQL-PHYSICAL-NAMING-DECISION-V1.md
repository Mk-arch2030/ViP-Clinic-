# Dr.Roby Clinic — PostgreSQL Physical Naming Decision V1

DOCUMENT = POSTGRESQL PHYSICAL NAMING DECISION
STATUS = DECISION DRAFT

---

## 1. PURPOSE

Resolve only the previously deferred physical naming decisions required
to implement the already-authorized first PostgreSQL schema increment.

This decision resolves naming only.

It does not resolve physical data types, identifier generation
mechanisms, migrations, ORM, repositories, API, UI, authentication,
authorization, deployment, or any unrelated persistence concern.

---

## 2. AUTHORITY BASIS

This decision is derived from:

- PERSISTENCE-SCHEMA-DEFINITION-V1
- PERSISTENCE-PHYSICAL-STRUCTURAL-IMPLEMENTATION-V1
- POSTGRESQL-SCHEMA-IMPLEMENTATION-DEFINITION-V1
- POSTGRESQL-PERSISTENCE-IMPLEMENTATION-AUTHORIZATION-V1
- CPN-GENERATION-IMPLEMENTATION-AUTHORIZATION-DECISION-V1

The earlier structural authority explicitly deferred physical table and
column names.

This decision resolves only those names.

---

## 3. TARGET DATABASE

DATABASE = `dr_roby_clinic`

DATABASE TECHNOLOGY = PostgreSQL

`shipping_db` = NOT TOUCHED

`supermarket_pos` = NOT TOUCHED

---

## 4. AUTHORIZED FIRST-INCREMENT OBJECT NAMES

The following names are authorized for the bounded first increment:

### Sequence

`clinic_patient_number_seq`

Purpose:

Internal PostgreSQL sequence used for authoritative CPN allocation.

### Patient table

`patients`

Purpose:

Physical persistence structure for the already-authorized Patient identity
and Patient information boundary.

---

## 5. AUTHORIZED PATIENT COLUMN NAMES

The following logical Patient concepts receive these physical column names:

- Technical Patient persistence identifier → `patient_id`
- Clinic Patient Number → `clinic_patient_number`
- Name → `name`
- Age → `age`
- Profession → `profession`
- Phone → `phone`
- Gender → `gender`

These are names only.

No physical datatype is selected by this decision.

No generation mechanism for `patient_id` is selected by this decision.

---

## 6. CPN NAME

`clinic_patient_number` is the physical column name representing the
already-established stable Clinic Patient Number concept.

Its physical datatype remains subject to the applicable technical
implementation boundary.

Its uniqueness and nullability requirements remain governed by the
already-authorized persistence rules.

---

## 7. TECHNICAL PATIENT ID

`patient_id` is the physical column name representing the technical
Patient persistence identifier.

This decision does NOT select:

- UUID;
- numeric type;
- BIGINT;
- identity;
- serial;
- sequence;
- application-generated identifier;
- database-generated identifier.

The physical type and generation mechanism remain deferred.

---

## 8. PHONE AND GENDER

The physical column names are:

- `phone`
- `gender`

This decision does NOT select their physical storage types.

Their established Product meaning remains unchanged.

---

## 9. NO ADDITIONAL OBJECTS

This naming decision authorizes no additional PostgreSQL object.

It does not authorize physical creation of:

- cases;
- visits;
- clinic_days;
- actors;
- past_history_items;
- current_complaints;
- investigations;
- diagnoses;
- treatments;
- follow_ups;
- follow_up_tasks;
- clinical_attachments;
- audit_logs;
- event_store;
- state_history;
- retention/delete structures;
- merge structures;
- billing/accounting structures;
- appointment structures;
- reporting structures;
- any unrelated object.

---

## 10. DEFERRED DECISIONS PRESERVED

The following remain DEFERRED:

- patient_id physical datatype;
- patient_id generation mechanism;
- phone physical datatype;
- gender physical datatype;
- Past History physical representation;
- migrations;
- ORM;
- repositories;
- API;
- UI;
- authentication;
- authorization;
- deployment;
- concurrency/idempotency implementation details beyond the already
  selected PostgreSQL sequence direction.

No deferred decision is silently resolved.

---

## 11. CONTRACT PROTECTION

PRODUCT MEANING = UNCHANGED

DOMAIN MEANING = UNCHANGED

PERSISTENCE CONTRACT = UNCHANGED

CPN FORMAT = UNCHANGED

CPN STARTING VALUE = 1

CPN GENERATION DIRECTION = POSTGRESQL-AUTHORITATIVE

SCOPE EXPANSION = NO

CONTRACT MUTATION = NO

AUTHORITY TRANSFER = NO

---

## 12. IMPLEMENTATION STATUS

SQL EXECUTION = NOT PERFORMED

SCHEMA EXECUTION = NOT PERFORMED

CPN_SEQUENCE_CREATED = NO

PATIENT_TABLE_CREATED = NO

PATIENT_DATA_WRITTEN = NO

IMPLEMENTATION_PROVEN = NO

---

## 13. DECISION MARKERS

PHYSICAL_NAMING_DECISION = BOUNDED

AUTHORIZED_SEQUENCE_NAME = clinic_patient_number_seq

AUTHORIZED_PATIENT_TABLE_NAME = patients

AUTHORIZED_PATIENT_COLUMN_NAMES = patient_id, clinic_patient_number, name, age, profession, phone, gender

PHYSICAL_TYPES_SELECTED = NO

IDENTIFIER_GENERATION_SELECTED = NO

FAIL = 0

---

## 14. NEXT GATE

POSTGRESQL PHYSICAL NAMING DECISION REVIEW

END OF POSTGRESQL PHYSICAL NAMING DECISION V1

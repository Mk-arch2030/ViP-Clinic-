# CONTRACT-04 — PATIENT PERSISTENCE
# A06 × PostgreSQL Physical Authority Reconciliation V1

DOCUMENT = A06 × POSTGRESQL PHYSICAL AUTHORITY RECONCILIATION
STATUS = RECONCILIATION DRAFT
AUTHORITY = A06 CLOSED + PROVEN + HISTORICAL POSTGRESQL PHYSICAL AUTHORITY
SCOPE = PATIENT PHYSICAL PERSISTENCE AUTHORITY ONLY

---

## 1. PURPOSE

This reconciliation records the bounded authority reconciliation required
between the later A06 Patient Date-of-Birth decision and the earlier
PostgreSQL physical persistence decisions.

This document preserves historical provenance.

It does not erase, rewrite, or retroactively invalidate the historical
decisions that were valid under their earlier authority state.

This reconciliation exists because A06 subsequently established:

- Date of Birth = authoritative persistent Patient fact
- Age = derived temporal value
- Age is not an authoritative persistent Patient fact
- physical representation of Date of Birth remains deferred

---

## 2. GIT PROVENANCE

The Git history establishes the temporal order of the relevant authority:

1. 1a488f2
   PostgreSQL schema implementation definition

2. 98c06c2
   PostgreSQL schema naming and implementation plan closure

3. b1403e9
   PostgreSQL schema physical authority closure

4. eab057a
   Hamo × Shqo × Termux — A06 First Date of Birth

Therefore:

A06 IS LATER THAN THE PREVIOUS POSTGRESQL PHYSICAL AUTHORITY.

CURRENT_HEAD = eab057af7a38d44d6b783b13e0adc0efc8f88877
A06_COMMIT = eab057af7a38d44d6b783b13e0adc0efc8f88877
GITHUB_MAIN = eab057af7a38d44d6b783b13e0adc0efc8f88877

---

## 3. HISTORICAL PHYSICAL AUTHORITY

The earlier PostgreSQL physical authority established a Patient
physical representation containing:

- patient_id
- clinic_patient_number
- name
- age
- profession
- phone
- gender

The earlier PostgreSQL physical data-type decision further established:

AGE = INTEGER

These decisions are preserved as historical architectural provenance.

They are not deleted from history.

---

## 4. LATER A06 AUTHORITY

A06 subsequently established the following Patient semantics:

DOB = AUTHORITATIVE PERSISTENT PATIENT FACT
AGE = DERIVED TEMPORAL VALUE
AGE_AT_REGISTRATION = DERIVED
AGE_AT_ENCOUNTER = DERIVED
CURRENT_AGE = DERIVED

Age MUST NOT be treated as an authoritative persistent Patient fact.

Date of Birth is the authoritative persistent Patient fact from which
age is derived.

---

## 5. RECONCILIATION RESULT — AGE

The earlier physical authority for an authoritative persistent
Patient age field is RECONCILED.

Where the earlier physical representation treats:

AGE = PERSISTENT PATIENT FACT

it conflicts with the later A06 authority.

Therefore:

AGE_PHYSICAL_AUTHORITY =
RECONCILED_AND_REVOKED_WHERE_CONFLICTING_WITH_A06

AGE_AS_AUTHORITATIVE_PERSISTED_FACT = NO

AGE_AS_DERIVED_VALUE = YES

AGE_PHYSICAL_COLUMN_AUTHORITY =
NOT_AUTHORIZED_BY_THIS_RECONCILIATION

This reconciliation does not select whether a legacy physical age column
is removed, retained, repurposed, cached, or materialized.

Those are separate physical implementation decisions and remain outside
this document.

---

## 6. RECONCILIATION RESULT — DATE OF BIRTH

A06 establishes:

DATE_OF_BIRTH = AUTHORITATIVE_PERSISTENT_PATIENT_FACT

However, A06 explicitly deferred the physical representation decision.

Therefore this reconciliation establishes:

DATE_OF_BIRTH_PERSISTENCE_AUTHORITY = YES

DATE_OF_BIRTH_PHYSICAL_REPRESENTATION = DEFERRED

DATE_OF_BIRTH_SQL_TYPE = NOT_DECIDED_HERE

DATE_OF_BIRTH_PHYSICAL_CONSTRAINTS = NOT_DECIDED_HERE

DATE_OF_BIRTH_INDEXING = NOT_DECIDED_HERE

DATE_OF_BIRTH_GENERATION = NOT_DECIDED_HERE

DATE_OF_BIRTH_MIGRATION = NOT_DECIDED_HERE

No physical Date-of-Birth implementation decision is created by this
reconciliation.

---

## 7. CURRENT IMPLEMENTATION SAFETY

This reconciliation does NOT authorize:

- SQL execution
- schema migration
- migration framework changes
- ORM implementation
- repository implementation
- API implementation
- UI implementation
- Past History implementation
- Case implementation
- Visit implementation
- Clinic Day implementation
- Clinical History implementation
- Follow-up implementation
- Attachment implementation
- authorization changes
- actor changes
- authority transfer
- new product capability
- unrelated persistence changes

IMPLEMENTATION_EXECUTION = NOT_AUTHORIZED_BY_THIS_DOCUMENT

---

## 8. LEGACY PHYSICAL DECISIONS

The following historical decisions remain preserved as provenance:

POSTGRESQL-PHYSICAL-NAMING-DECISION-V1
POSTGRESQL-PHYSICAL-DATA-TYPES-DECISION-V1
POSTGRESQL-SCHEMA-IMPLEMENTATION-DEFINITION-V1
POSTGRESQL-SCHEMA-IMPLEMENTATION-PLAN-V1

This reconciliation does not delete or rewrite those documents.

Their historical statements concerning Age remain historical statements
of the earlier authority state.

Where those statements conflict with A06, this reconciliation is the
later bounded authority record for that conflict.

---

## 9. NO GENERAL SUPERCESSION MECHANISM

No general architectural supersession mechanism was identified that
automatically updates all downstream PostgreSQL physical decisions after
A06.

Therefore this document provides an explicit bounded reconciliation.

It does not establish a general authority-transfer mechanism.

---

## 10. PAST HISTORY PROTECTION

Past History remains:

PAST_HISTORY = PATIENT_LEVEL
PAST_HISTORY_IS_VISIT = NO

Past History physical representation remains governed by its own bounded
decision path.

This reconciliation does not authorize Past History persistence
implementation.

---

## 11. CONTRACT PROTECTION

PRODUCT_MEANING = UNCHANGED
DOMAIN_MEANING = UNCHANGED
PATIENT_IDENTITY = UNCHANGED
CPN_MEANING = UNCHANGED
CPN_AUTHORITY = UNCHANGED
TRANSACTION_SEMANTICS = UNCHANGED
AUTHORITY_TRANSFER = NO
SCOPE_EXPANSION = NO
UNAUTHORIZED_OBJECT = NO
UNRELATED_IMPLEMENTATION = NO

---

## 12. RECONCILIATION BOUNDARY

This document resolves only:

1. historical provenance of the earlier PostgreSQL physical authority
2. conflict between persistent Age authority and later A06 semantics
3. preservation of Date of Birth as an authoritative persistent Patient fact
4. continued deferral of Date-of-Birth physical representation

This document does NOT resolve:

- SQL data type
- SQL constraints
- column implementation
- migration
- legacy age-column handling
- repository implementation
- API implementation
- UI implementation
- Past History physical representation

---

## 13. STATUS

A06_AUTHORITY = CLOSED + PROVEN

GIT_PROVENANCE = PROVEN

AGE_AUTHORITY_RECONCILIATION = BOUNDED

DOB_PERSISTENCE_AUTHORITY = CONFIRMED

DOB_PHYSICAL_REPRESENTATION = DEFERRED

IMPLEMENTATION_EXECUTION = NOT_PERFORMED

SQL_EXECUTION = NOT_PERFORMED

MIGRATION_EXECUTION = NOT_PERFORMED

PAST_HISTORY_IMPLEMENTATION = NOT_AUTHORIZED

FAIL = 0

NEXT_GATE = RECONCILIATION REVIEW + CONTRADICTION X-RAY

---

## 14. FACTORY SIGNATURE

🎂 A06 — First Date of Birth
⚖️ Physical Authority Reconciliation
⚙️ Hamo × Shqo × Termux
🔒 Bounded Scope
🧪 0 FAIL

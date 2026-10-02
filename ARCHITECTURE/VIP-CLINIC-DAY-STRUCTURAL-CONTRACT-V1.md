# VIP Clinic — Clinic Day Structural Contract V1

**DOCUMENT:** VIP-CLINIC-DAY-STRUCTURAL-CONTRACT-V1
**PROJECT:** ViP Clinic
**DOMAIN:** Clinic Day
**INCREMENT:** Clinic Day Structural Contract
**STATUS:** DRAFTING
**DATE:** 2026-10-02

---

## 1. CONTRACT IDENTITY

This document defines the bounded structural contract for the physical PostgreSQL representation of the already-proven ViP Clinic Day persistence artifact.

The contract translates the established domain/runtime/persistence alignment into a precise structural boundary for the target database.

This document is a structural contract only.

It does not execute SQL, modify the live database, authorize migration, authorize repair, authorize production deployment, or expand persistence scope beyond Clinic Day.

---

## 2. GOVERNING ARTIFACTS

The structural contract is derived from the following established evidence:

- `src/domain/types.ts`
- `backend/persistence/schema.sql`
- `backend/persistence/clinic-day-repository.js`
- `application/services/manage-clinic-day.js`
- `application/tests/clinic-day-persistence.test.js`
- `ARCHITECTURE/VIP-CLINIC-DAY-POSTGRES-PERSISTENCE-PROOF-V1.md`
- `ARCHITECTURE/VIP-CLINIC-DAY-REAL-DB-DEFINITION-V1.md`
- `ARCHITECTURE/VIP-LIVE-DATABASE-FORENSIC-RECONCILIATION-CLINIC-DAY-V1.md`
- `ARCHITECTURE/VIP-POSTGRESQL-AUTHORITY-SCOPE-FORENSIC-CLOSURE-V1.md`

The governing target database is:

`vip_clinic`

The bounded physical object is:

`public.clinic_days`

---

## 3. CONTRACT PURPOSE

The purpose of this contract is to establish the exact structural shape, constraints, ownership boundaries, and persistence semantics of `public.clinic_days` before any controlled materialization against the live `vip_clinic` database.

The contract preserves the already-proven Clinic Day semantics.

No new domain behavior is introduced by this document.

No Case, Visit, Patient, Prescription, Follow-up, or other future persistence structure is introduced by this contract.

---

## 4. PHYSICAL STRUCTURAL MAPPING

The Clinic Day domain record maps to the PostgreSQL structure as follows:

| Domain Attribute | PostgreSQL Column | Physical Type | Nullability | Constraint / Rule |
| --- | --- | --- | --- | --- |
| `id` | `clinic_day_id` | `TEXT` | NOT NULL | PRIMARY KEY |
| `workingDate` | `working_date` | `DATE` | NOT NULL | UNIQUE |
| `status` | `status` | `TEXT` | NOT NULL | OPEN or CLOSED |
| `lifecycle` | `lifecycle` | `TEXT` | NOT NULL | WORKING or CONCLUDED |
| `counter` | `counter` | `INT` | NOT NULL | DEFAULT 0 |
| `openedAt` | `opened_at` | `TIMESTAMPTZ` | NOT NULL | DEFAULT CURRENT_TIMESTAMP |
| `closedAt` | `closed_at` | `TIMESTAMPTZ` | NULLABLE | Set on closure |
| `closedBy` | `closed_by` | `TEXT` | NULLABLE | NULL or Doctor |

The mapping is structural only and does not grant implementation authority.

---

## 5. PHYSICAL TABLE CONTRACT

The bounded structural representation is:

CREATE TABLE public.clinic_days (
    clinic_day_id TEXT PRIMARY KEY,
    working_date DATE NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('OPEN', 'CLOSED')),
    lifecycle TEXT NOT NULL CHECK (lifecycle IN ('WORKING', 'CONCLUDED')),
    counter INT NOT NULL DEFAULT 0,
    opened_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMPTZ,
    closed_by TEXT CHECK (closed_by IS NULL OR closed_by = 'Doctor')
);

This SQL expresses the structural contract only.

It is not an execution command.

It must not be interpreted as evidence that the table currently exists in `vip_clinic`.

---

## 6. STRUCTURAL CONSTRAINTS

### 6.1 Primary Identity

`clinic_day_id` is the physical primary identity of the Clinic Day record.

The application service owns generation of the logical identifier.

The database owns primary-key uniqueness.

---

### 6.2 Working Date Uniqueness

`working_date` is a unique business-date attribute.

At most one persisted Clinic Day may represent a given working date within the bounded table.

The uniqueness constraint is database-enforced.

---

### 6.3 Status Domain

`status` is constrained to:

- `OPEN`
- `CLOSED`

No other status value is structurally valid.

---

### 6.4 Lifecycle Domain

`lifecycle` is constrained to:

- `WORKING`
- `CONCLUDED`

No other lifecycle value is structurally valid.

---

### 6.5 Counter Structure

`counter` is:

- integer-valued;
- non-null;
- initialized to `0`;
- owned by the Clinic Day record;
- atomically incremented by the bounded Clinic Day repository operation.

The structural contract introduces no second counter.

---

### 6.6 Closure Attribution

`closed_by` is nullable while the Clinic Day remains open.

When populated, its only structurally valid value is:

`Doctor`

The structural constraint does not itself replace the application service authority guard.

---

## 7. LIFECYCLE STRUCTURAL INVARIANTS

The structural contract preserves the established Clinic Day lifecycle.

### 7.1 Open State

An open Clinic Day is represented as:

- `status = OPEN`
- `lifecycle = WORKING`
- `closed_at IS NULL`
- `closed_by IS NULL`

The open state represents an active working clinic day.

---

### 7.2 Closed State

A closed Clinic Day is represented as:

- `status = CLOSED`
- `lifecycle = CONCLUDED`
- `closed_at` populated with the closure timestamp;
- `closed_by = Doctor`

The closed state represents a concluded working clinic day.

---

### 7.3 Lifecycle Pairing

The following state pairings are structurally valid:

| Status | Lifecycle |
| --- | --- |
| `OPEN` | `WORKING` |
| `CLOSED` | `CONCLUDED` |

The contract does not introduce any additional status/lifecycle combinations.

The application service remains responsible for enforcing valid lifecycle transitions.

---

## 8. TEMPORAL ATTRIBUTES

### 8.1 Open Timestamp

`opened_at` is mandatory and represents the timestamp associated with Clinic Day creation.

The physical default is:

`CURRENT_TIMESTAMP`

The application may provide an explicit opening timestamp through the repository contract.

---

### 8.2 Close Timestamp

`closed_at` remains nullable while the Clinic Day is open.

Closure populates the close timestamp.

The structural contract does not prescribe a historical timestamp reconstruction or alteration procedure.

---

## 9. COUNTER STRUCTURAL OWNERSHIP

The Clinic Day counter is a persisted operational attribute.

Its ownership boundary is:

`ClinicDayRecord.counter`
→ `public.clinic_days.counter`
→ `ClinicDayRepository.incrementCounter()`

The atomic persistence operation is:

UPDATE clinic_days
SET counter = counter + 1
WHERE clinic_day_id = $1
RETURNING ...;

The Visit arrival flow is the future invocation boundary for the increment operation.

This contract does not create Visit persistence and does not authorize implementation of Visit persistence.

No duplicate counter field or parallel counter store is permitted within this bounded structural definition.

---

## 10. AUTHORITY SEPARATION

Structural constraints and application authority are separate responsibilities.

### Database responsibility

The database structure owns:

- primary-key uniqueness;
- working-date uniqueness;
- status domain constraints;
- lifecycle domain constraints;
- counter numeric structure;
- default counter initialization;
- timestamp defaults;
- closure attribution value constraint.

### Application responsibility

The application service owns:

- Doctor authorization for opening;
- Doctor authorization for closure;
- lifecycle transition behavior;
- domain error behavior;
- Clinic Day identifier generation;
- orchestration of repository operations.

The database contract does not replace the service authority boundary.

The service contract does not replace database structural constraints.

Both layers remain bounded and complementary.

---

## 11. LIVE DATABASE STRUCTURAL BOUNDARY

The structural target of this contract is:

`vip_clinic`

The bounded physical object is:

`public.clinic_days`

The established live-database forensic evidence states:

`LIVE_CLINIC_DAY = ABSENT`

Therefore:

- the structural contract defines the intended physical shape;
- the live database does not currently prove possession of that structure;
- no assumption is made that `public.clinic_days` already exists;
- no cause is inferred for its absence;
- no migration history is reconstructed by this document;
- no schema repair is authorized by this document.

The structural contract and the live database observation remain separate evidence layers.

---

## 12. PATIENT FOUNDATION NON-INTERFERENCE

The existing Patient PostgreSQL foundation remains outside the Clinic Day structural mutation boundary.

The following objects are preserved:

- `public.patients`
- `public.clinic_patient_number_seq`

This contract does not:

- alter the Patient table;
- alter the Patient sequence;
- change Patient identifiers;
- change CPN generation;
- introduce a Patient foreign key into Clinic Day;
- reconstruct or reset Patient data.

The Clinic Day structural contract therefore remains additive and bounded with respect to the proven Patient foundation.

---

## 13. RELATIONSHIP BOUNDARY

This contract defines `public.clinic_days` as an independent bounded physical object.

No new foreign-key relationship is introduced by this contract.

The following relationships remain deferred:

- Clinic Day → Case
- Clinic Day → Visit
- Clinic Day → Prescription
- Clinic Day → Follow-up
- Clinic Day → other future clinical persistence structures

Future relationships require their own bounded structural definitions and authority evidence.

---

## 14. IMPLEMENTATION BOUNDARY

This structural contract does not authorize:

- SQL execution against `vip_clinic`;
- table creation;
- schema migration;
- schema repair;
- destructive DDL;
- data deletion;
- data reset;
- reconstruction of historical rows;
- ORM adoption;
- generic persistence framework adoption;
- expansion into Case persistence;
- expansion into Visit persistence;
- API or UI changes;
- authentication or authorization architecture changes;
- deployment changes.

Any future materialization must be separately bounded, explicitly evidenced, and non-destructive.

---

## 15. AUTHORIZATION SEPARATION

The following states remain independent:

`STRUCTURAL_CONTRACT = DEFINED`

`SQL_IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED_BY_THIS_CONTRACT`

`MIGRATION_IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED_BY_THIS_CONTRACT`

`LIVE_RECONCILIATION = NOT_PERFORMED_BY_THIS_CONTRACT`

`PRODUCTION_AUTHORIZATION = NONE`

The existence of this structural contract does not imply implementation authorization.

The existence of implementation authorization, if separately granted in the future, would not by itself establish production authorization.

---

## 16. STRUCTURAL INTEGRITY REQUIREMENT

Any future controlled materialization of `public.clinic_days` must preserve:

1. the exact physical column mapping;
2. the declared PostgreSQL data types;
3. the primary-key constraint;
4. the working-date uniqueness constraint;
5. the status domain constraint;
6. the lifecycle domain constraint;
7. the counter default and ownership;
8. the timestamp semantics;
9. the `closed_by` structural constraint;
10. the Patient non-interference boundary;
11. the absence of unauthorized future-domain relationships.

Any deviation requires a new bounded reconciliation rather than silent mutation of this contract.

---

## 17. FINAL CONTRACT STATE

`STRUCTURAL_CONTRACT = DEFINED`

`STRUCTURAL_MAPPING = PROVEN`

`TARGET_DATABASE = vip_clinic`

`PHYSICAL_OBJECT = public.clinic_days`

`LIVE_CLINIC_DAY = ABSENT`

`PATIENT_FOUNDATION = PRESERVED`

`IMPLEMENTATION = NOT_PERFORMED`

`SQL_IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED`

`MIGRATION_IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED`

`LIVE_RECONCILIATION = NOT_PERFORMED`

`PRODUCTION_AUTHORIZATION = NONE`

`FAIL = 0`

---

**END OF STRUCTURAL CONTRACT**

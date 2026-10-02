# VIP Clinic — Clinic Day Real DB Definition V1

**DOCUMENT:** VIP-CLINIC-DAY-REAL-DB-DEFINITION-V1
**PROJECT:** ViP Clinic
**TARGET DATABASE:** vip_clinic
**PURPOSE:** Define the bounded physical database representation of the already-proven Clinic Day persistence artifact before any live database implementation.

---

## 1. DEFINITION STATUS

`REAL_DB_DEFINITION = CLOSED`

This document defines the physical representation required for the ViP Clinic Day persistence increment.

This document does not execute SQL, modify the live database, perform migration, repair data, or grant production authorization.

---

## 2. SOURCE EVIDENCE

The definition is grounded in the following repository evidence:

- `src/domain/types.ts`
- `backend/persistence/schema.sql`
- `backend/persistence/clinic-day-repository.js`
- `application/services/manage-clinic-day.js`
- `application/tests/clinic-day-persistence.test.js`
- `ARCHITECTURE/VIP-CLINIC-DAY-POSTGRES-PERSISTENCE-PROOF-V1.md`
- `ARCHITECTURE/VIP-LIVE-DATABASE-FORENSIC-RECONCILIATION-CLINIC-DAY-V1.md`
- `ARCHITECTURE/VIP-POSTGRESQL-AUTHORITY-SCOPE-FORENSIC-CLOSURE-V1.md`

---
## 3. TARGET DATABASE

`DATABASE = vip_clinic`

The Clinic Day physical definition applies only to the current ViP PostgreSQL database target.

Historical PostgreSQL records targeting other databases do not constitute evidence for this target.

---

## 4. PHYSICAL OBJECT

Required relation:

`public.clinic_days`

No additional Clinic Day table is defined by this document.

---
## 5. PHYSICAL STRUCTURAL MAPPING

| Domain Property | Physical Column | Physical Type | Constraint / Behavior |
|---|---|---|---|
| `id` | `clinic_day_id` | `TEXT` | PRIMARY KEY |
| `workingDate` | `working_date` | `DATE` | NOT NULL, UNIQUE |
| `status` | `status` | `TEXT` | NOT NULL, `OPEN` or `CLOSED` |
| `lifecycle` | `lifecycle` | `TEXT` | NOT NULL, `WORKING` or `CONCLUDED` |
| `counter` | `counter` | `INT` | NOT NULL, DEFAULT 0 |
| `openedAt` | `opened_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| `closedAt` | `closed_at` | `TIMESTAMPTZ` | NULLABLE |
| `closedBy` | `closed_by` | `TEXT` | NULLABLE, only `Doctor` |

---
## 6. PHYSICAL SQL DEFINITION

The bounded physical SQL definition is:

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

This SQL is a definition only. It has not been executed by this document.

---
## 7. BEHAVIORAL OWNERSHIP

`clinic_day_id` is supplied by the application service using the established `CD-${workingDate}-${suffix}` representation.

`working_date` is the unique Clinic Day business date.

`counter` is owned by the Clinic Day persistence record and is incremented atomically by the Clinic Day repository.

Clinic Day opening and closure are Doctor-authorized at the application-service boundary.

---
## 8. RELATIONSHIP BOUNDARY

This increment defines no new foreign-key relationship.

No Case, Visit, Patient, or other domain relationship is physically added by this definition.

Future Case and Visit persistence remain separate bounded increments.

---
## 9. LIVE DATABASE RECONCILIATION REQUIREMENT

Current forensic evidence establishes:

`LIVE_DATABASE = vip_clinic`

`LIVE_CLINIC_DAY_TABLE = ABSENT`

Therefore the defined physical object is currently missing from the live target database.

No inference is made regarding the cause of the discrepancy.

---
## 10. NON-DESTRUCTIVE EXECUTION BOUNDARY

Any future implementation against `vip_clinic` must be limited to the bounded Clinic Day physical definition established here.

The future execution path must not:

- drop existing objects;
- alter `public.patients`;
- alter `clinic_patient_number_seq`;
- delete data;
- reset the database;
- reconstruct unknown historical data;
- execute migration logic outside this bounded increment;
- implement Case or Visit persistence;
- introduce ORM infrastructure;
- introduce generic repository infrastructure;
- alter API, UI, authentication, authorization, or deployment scope.

---

## 11. IMPLEMENTATION BOUNDARY

This definition does not itself grant implementation authorization.

`SQL_IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED_BY_THIS_DEFINITION`

`MIGRATION_IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED_BY_THIS_DEFINITION`

`PRODUCTION_AUTHORIZATION = NONE`

A separate authority reconciliation must establish whether and how this bounded definition may be materialized in `vip_clinic`.

---

## 12. CASE GATE

Case PostgreSQL persistence remains blocked until Clinic Day has completed its independent live persistence gate.

`CASE_PERSISTENCE = BLOCKED_PENDING_CLINIC_DAY_LIVE_RECONCILIATION`

---

## 13. FINAL STATUS

`REAL_DB_DEFINITION = CLOSED`

`TARGET_DATABASE = vip_clinic`

`PHYSICAL_OBJECT = public.clinic_days`

`PHYSICAL_MAPPING = PROVEN`

`LIVE_CLINIC_DAY = ABSENT`

`IMPLEMENTATION = NOT_PERFORMED`

`IMPLEMENTATION_AUTHORIZATION = NOT_GRANTED_BY_THIS_DEFINITION`

`PRODUCTION_AUTHORIZATION = NONE`

`FAIL = 0`

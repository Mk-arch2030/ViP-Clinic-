# VIP Clinic — Clinic Day PostgreSQL Persistence Proof V1

**DOCUMENT:** VIP-CLINIC-DAY-POSTGRES-PERSISTENCE-PROOF-V1  
**INCREMENT:** Clinic Day Persistence Candidate Increment  
**STATUS:** PROVEN  
**DATE:** 2026-10-02  

---

## 1. EVIDENCE SUMMARY

- **CLINIC_DAY_POSTGRES_PERSISTENCE:** PROVEN
- **CLINIC_DAY_BEHAVIORAL_PROOF:** PASS
- **ROLLBACK_PROOF:** PASS
- **ZERO_LEAKAGE_PROOF:** PASS
- **SEMANTIC_RECONCILIATION:** ALIGNED
- **PRODUCTION_AUTHORIZATION:** NONE
- **CANONICAL_AUTHORITY_REESTABLISHMENT:** NONE
- **CANONICAL_CONTRACT_MUTATION:** NONE
- **REGRESSION_SUITE_STATUS:** 31 TESTS PASS, 0 FAIL

---

## 2. GOVERNING CONTEXT & RECONCILIATION

### 2.1 Product Contract vs Runtime vs Persistence Alignment
The Clinic Day contract in ViP represents an atomic operational working day for the clinic.

| Field | TypeScript Contract (`src/domain/types.ts`) | Runtime Store (`src/services/clinicStore.ts`) | PostgreSQL Schema (`backend/persistence/schema.sql`) | Alignment Status |
| :--- | :--- | :--- | :--- | :--- |
| **id** | `string` (e.g. `CD-2026-09-22`) | `CD-${workingDate}-${suffix}` | `clinic_day_id TEXT PRIMARY KEY` | ALIGNED |
| **workingDate** | `string` (`YYYY-MM-DD`) | `workingDate` string | `working_date DATE NOT NULL UNIQUE` | ALIGNED |
| **status** | `'OPEN' \| 'CLOSED'` | `'OPEN' \| 'CLOSED'` | `TEXT CHECK (status IN ('OPEN', 'CLOSED'))` | ALIGNED |
| **lifecycle** | `'WORKING' \| 'CONCLUDED'` | `'WORKING' \| 'CONCLUDED'` | `TEXT CHECK (lifecycle IN ('WORKING', 'CONCLUDED'))` | ALIGNED |
| **counter** | `number` | Incremented per visit arrival | `INT NOT NULL DEFAULT 0` | ALIGNED |
| **openedAt** | `string` (ISO timestamp) | `openedAt` ISO string | `TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP` | ALIGNED |
| **closedAt** | `string \| undefined` | ISO string when closed | `TIMESTAMPTZ` (nullable) | ALIGNED |
| **closedBy** | `'Doctor' \| undefined` | Set to `'Doctor'` on closure | `TEXT CHECK (closed_by IS NULL OR closed_by = 'Doctor')` | ALIGNED |

---

## 3. COUNTER OWNERSHIP RECONCILIATION

- **Semantic Role:** `ClinicDayRecord.counter` represents the number of patient visits arriving during the specific clinic day.
- **Ownership Determination:**
  - The counter is an operational attribute of the `clinic_days` record.
  - The atomic increment operation is owned by the `ClinicDayRepository`:
    ```sql
    UPDATE clinic_days SET counter = counter + 1 WHERE clinic_day_id = $1 RETURNING ...
    ```
  - The invocation trigger belongs to the Visit arrival transaction (`recordArrivalAndVisit`).
  - No second counter is introduced; no duplicated ownership exists.

---

## 4. CLINIC DAY LIFECYCLE & AUTHORITY

- **Open State:** `status = 'OPEN'`, `lifecycle = 'WORKING'`, `closed_at = NULL`, `closed_by = NULL`.
- **Closed State:** `status = 'CLOSED'`, `lifecycle = 'CONCLUDED'`, `closed_at = CURRENT_TIMESTAMP`, `closed_by = 'Doctor'`.
- **Doctor Authority Guard:** The application service (`application/services/manage-clinic-day.js`) strictly verifies `actorRole === 'Doctor'`. Delegated Nurse attempts to open or close the clinic day are rejected with explicit domain errors.

---

## 5. DATABASE TABLE SPECIFICATION

```sql
CREATE TABLE clinic_days (
    clinic_day_id TEXT PRIMARY KEY,
    working_date DATE NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('OPEN', 'CLOSED')),
    lifecycle TEXT NOT NULL CHECK (lifecycle IN ('WORKING', 'CONCLUDED')),
    counter INT NOT NULL DEFAULT 0,
    opened_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMPTZ,
    closed_by TEXT CHECK (closed_by IS NULL OR closed_by = 'Doctor')
);
```

---

## 6. BEHAVIORAL & ROLLBACK PROOF EVIDENCE

- **Test Suite:** `application/tests/clinic-day-persistence.test.js`
- **Execution Evidence:**
  1. `CLINIC DAY TEST-01 — Open/Create persists with id, workingDate, OPEN, WORKING, counter=0`: PASS
  2. `CLINIC DAY TEST-02 — Retrieve Current Day queries open working day`: PASS
  3. `CLINIC DAY TEST-03 — Counter increment preserves atomic counter update`: PASS
  4. `CLINIC DAY TEST-04 — Doctor Closure transitions OPEN->CLOSED, WORKING->CONCLUDED with closedBy=Doctor`: PASS
  5. `CLINIC DAY TEST-05 — Nurse cannot open or close Clinic Day (Service authority guard)`: PASS
  6. `CLINIC DAY TEST-06 — Duplicate working date is rejected by database constraint`: PASS
  7. `CLINIC DAY TEST-07 — Transaction rollback upon persistence failure leaves 0 persisted rows`: PASS
- **Rollback Proof Result:** Transaction error triggers `ROLLBACK` discarding uncommitted rows; verified row count in database post-rollback is 0.

---

## 7. BOUNDARY DECLARATION

- **PATIENT FOUNDATION:** UNCHANGED (PostgreSQL table `patients` and sequence `clinic_patient_number_seq` preserved).
- **FUTURE PERSISTENCE INCREMENTS:** Case, Visit, Clinical Data, Prescription, and Follow-up persistence remain deferred to subsequent bounded directives.
- **AUTHORIZATION STATUS:** Candidate evidence only. No production authorization is claimed.

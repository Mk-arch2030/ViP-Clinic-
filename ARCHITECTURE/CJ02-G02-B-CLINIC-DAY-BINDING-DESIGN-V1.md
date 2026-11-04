# CJ02-G02-B — Clinic Day Binding Design Review V1

**Factory:** RobY_BoT_FactorY  
**Product:** ViP Clinic  
**Owner / final authority:** MOHAMED.K_ROBY  
**Date:** 2026-11-04  
**Status:** DESIGN REVIEW — FOUNDER DECISION PENDING  
**Scope:** Documentation only. No code, database, migration, tests, merge, deployment or clinical release.

## 1. Governing decisions

- CJ02 D02: Clinic Day is an operational session independent of calendar midnight; crossing midnight does not automatically close, open or reassign a Day.
- CJ02 D05/D06: a new clinical Case and first Visit form one connected Doctor-authorized workflow after actual arrival; Nurse requires current VISIT_START delegation.
- G02-A Founder-approved A1: Doctor approves Patient and Case problem summary; Visit encounter details recorded later.
- G02-A Founder-approved A2: changing Patient or Case problem meaning requires revoking original pending intent and issuing a new one.
- No Founder decision yet determines whether Doctor intent is bound to a particular Clinic Day.

## 2. Source observations (read-only)

- `ARCHITECTURE/VIP-CLINIC-DAY-STRUCTURAL-CONTRACT-V1.md`: `public.clinic_days` uses `clinic_day_id TEXT PRIMARY KEY`, `working_date DATE UNIQUE`, `status OPEN/CLOSED`, `lifecycle WORKING/CONCLUDED`, `opened_at`, `closed_at`, and counter. The document is a structural definition, not proof of current live DB state.
- `ARCHITECTURE/VIP-CLINIC-DAY-REAL-DB-DEFINITION-V1.md`: application-generated ID representation `CD-${workingDate}-${suffix}`; Doctor controls opening/closure; Clinic Day counter owned by Day record.
- `backend/persistence/clinic-day-repository.js`: `getCurrentClinicDay` orders OPEN first then most recently opened; `getClinicDayById` resolves explicit identity; `closeClinicDay` transitions OPEN to CLOSED; `incrementCounter` currently updates by ID without its own OPEN-state predicate.
- `backend/persistence/migrations/002-case-visit-foundation.sql`: Visit has `clinic_day_id` foreign key, `arrival_confirmed` and other recording fields; no `FirstRegistrationIntent` schema.
- These are source/design observations, **not** a fresh live PostgreSQL inspection or acceptance proof.

## 3. Alternatives for Doctor intent Day binding

### Option B1 — Bind a specific Day at intent creation

Doctor intent includes immutable `clinic_day_id`. At consumption, same Day must still be valid and OPEN. If closed, consumption is denied or requires a separately authorized new intent.

**Benefit:** Explicit Day constraint at decision time.

**Costs:** Doctor's clinical Case decision becomes dependent on an operational Day that can change before patient arrives. May force unnecessary revocation/reissuance despite unchanged Patient/problem. Midnight itself must not force a change.

### Option B2 — Bind Day at first Visit commit (RECOMMENDED FOR FOUNDER REVIEW)

Doctor intent binds authenticated Doctor, Patient, approved Case problem, and clinic authority scope, **not** a specific Clinic Day. At first-registration consumption, server resolves and locks the explicitly selected operational Clinic Day, verifies OPEN/WORKING and authorized recording conditions, and stores Day identity in the immutable **registration commit meaning and Visit**, not in the original Doctor-decision fingerprint.

**Benefit:** Doctor Case meaning survives changes in operating session while preserving actual Day ownership of Visit.

**Costs:** Must prove the Nurse/Doctor cannot silently choose an unrelated Day; explicit Day selection and authority checks are required. If no valid OPEN Day, registration is denied/pending; never auto-open Day.

### Option B3 — Day optional on Doctor intent, with later rebinding

Adds conditional semantics and complex fingerprints; not recommended absent a demonstrated clinical need.

## 4. Proposed B2 contract, if Founder approves

1. Doctor creates a PENDING intent for Patient + problem summary, with authenticated Doctor authority. No Day is created, selected or opened as an intent side effect.
2. After physical arrival, authorized Doctor or Nurse requests first registration against an **explicit `clinic_day_id`** from the server's authorized operational Day selection.
3. Server verifies the Day's current OPEN/WORKING state, clinical scope and actor authority; synchronizes with Doctor Day closure using compatible locks. No midnight-based reassignment.
4. Atomic registration creates Case + first Visit with the selected Day, consumes intent, and stores durable receipt and immutable commit fingerprint including Day identity.
5. If Day closes **before** registration's effective commit order, deny/require fresh valid Day selection. If registration commits first, preserve the Visit on its original Day despite later closure.
6. A different Day selection is not an edit of Doctor-approved Patient/problem; it is a new or corrected **Visit commit request** subject to its own operation identity and idempotency/recovery checks. No new operation ID may bypass an uncertain prior commit.
7. Doctor intent remains PENDING if a registration transaction rolls back for Day closure, unless separately revoked. It cannot be consumed twice.
8. Same Case + same operational Day means continuation of existing Visit; counter not incremented again.
9. No automatic Day opening/closure, fabricated arrival or silent counter increment.

## 5. Critical technical conflicts to carry forward

**B-C01 — Day closure race:** Current `closeClinicDay` changes Day state; `incrementCounter` does not itself check OPEN. G03 must design a single transaction, explicit Day lock and recheck; avoid closure/registration interleaving.

**B-C02 — Current Day ambiguity:** `getCurrentClinicDay` selects OPEN first, but is not itself an authorization or proof that a particular Day was selected by the clinical actor. Require explicit server-validated Day ID for commit.

**B-C03 — Business date vs operational session:** Existing unique `working_date` is a structural invariant; do not infer that midnight creates a new Day or that multiple Days with the same working date are supported.

**B-C04 — Lock ordering:** Historical Policy B requires Day-before-Case business lock order. CJ02 draft Nurse-grant-before-intent order must be reconciled into one global protocol; do not claim the combined lock sequence is proven.

**B-C05 — Fingerprint version:** If B2 is approved, Doctor-decision fingerprint explicitly excludes Day, while registration-commit fingerprint includes Day. Canonical formats and receipt schema remain G02-A/G04/G09 gates.

**B-C06 — Day scope and stale client:** Define actor selection authority, closed-Day response and multi-device behavior. Never trust only a browser's stale OPEN indicator.

## 6. Founder decision requested

**B1:** Bind Doctor intent to specific operational Clinic Day at issuance.

**B2 (recommended):** Doctor intent is Day-independent; bind and verify explicit OPEN Clinic Day at first Visit commit, in the registration receipt.

**B3:** Conditional binding, requires separate policy.

This document **does not** record Founder approval for any option.

## 7. Future acceptance matrix (NOT EXECUTED)

- Doctor intent creation makes no Clinic Day/Case/Visit/counter changes.
- Arrival after midnight in still-OPEN original Day remains on original Day.
- Doctor intent issued before a Day closes can be consumed on later valid OPEN Day only under selected policy.
- Closed Day before commit denies; commit before close preserves original Day.
- Two concurrent Day-close/registration operations serialize correctly.
- No OPEN Day: no automatic Day creation or false success.
- Replays preserve original operation/Day meaning; changed Day cannot reuse same operation ID.
- Same Case/Day returns existing Visit without duplicate counter increment.
- Lost response recovers authoritative receipt, not a fresh registration.

## 8. State

```text
G02_B_SOURCE_REVIEW = COMPLETE
G02_B_DESIGN = DOCUMENTED
G02_B_FOUNDER_OPTION = PENDING
G02_B_CLOSED = NO
G02_A_A1_A2 = FOUNDER_APPROVED
POSTGRESQL_EXECUTION = NONE
SOURCE_CODE_CHANGES = NONE
MIGRATIONS_OR_TESTS = NONE
MAIN_MERGE_OR_CLINICAL_RELEASE = NONE
```

MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.

# CJ02-CONTRACT-CONSOLIDATION-V1

**Factory:** RobY_BoT_FactorY  
**Product:** ViP Clinic  
**Owner and final authority:** MOHAMED.K_ROBY  
**Date:** 2026-11-04  
**Status:** CONSOLIDATED DESIGN DRAFT — NOT IMPLEMENTATION AUTHORIZATION  
**Repository source baseline:** `16c49b8ccc1edfff4286a718d1a3d28cc37065d1`  
**Previous preservation checkpoint:** `ARCHITECTURE/CJ02-FIRST-REGISTRATION-DESIGN-CHECKPOINT-V1.md`  
**Scope:** Consolidation of CJ02 first-registration, recovery receipt, and concurrency/revocation design discussions. This is a design reference, not an executable contract or clinical proof.

> **Authority separation:** D01–D09 below record Founder-approved policy decisions. Specific tables, commands, lock modes, receipts, and API shapes are **engineering proposals**, not independently Founder-approved final implementation details. Historical Manuscript and contracts remain preserved. Conflicts are listed explicitly.

## 1. Founder-approved policy register

| ID | Decision | Status |
| --- | --- | --- |
| D01 | Nurse with active explicit `VISIT_START` delegation may start Visit after actual arrival; no per-Visit Doctor approval; Doctor-only `CASE_CREATE` | FOUNDER APPROVED |
| D02 | Clinic Day is operational, independent of calendar day; midnight does not auto-close or reassign it | FOUNDER APPROVED |
| D03 | Same Patient, Case, operational Clinic Day means continuation of same Visit, not another Visit/counter increment; preserve amendment audit | FOUNDER APPROVED |
| D04 | Nurse with valid Visit-recording delegation can read relevant patient history and previous Visits, scoped and auditable; not unrestricted edit | FOUNDER APPROVED |
| D05 | New clinical Case after arrival and its first Visit form a connected registration; cannot COMPLETE Case with zero Visits; administrative Case discussion expressly deferred | FOUNDER APPROVED |
| D06 | Existing eligible Case: delegated Nurse may start Visit directly. New Case: Doctor must issue verifiable Case-creation decision; Nurse can record first Visit without `CASE_CREATE`. Doctor can do both | FOUNDER APPROVED |
| D07 | Doctor revokes Nurse delegation before effective registration commit: Nurse attempt denied; no new Case/Visit; earlier committed facts preserved | FOUNDER APPROVED |
| D08 | After Nurse delegation revocation, Doctor may complete registration using original authority, with fresh prerequisites and no duplication | FOUNDER APPROVED |
| D09 | Doctor revokes `FirstRegistrationIntent` before effective commit: Nurse cannot consume it despite active Nurse grant; a revoked intent cannot authorize Doctor completion either | FOUNDER APPROVED |

**D09** was approved after the previous checkpoint was committed; it is preserved here for the first time in repository documentation.

## 2. Unified design outcome

### 2.1 Two modes, one clinical result

**Mode A — Doctor-operated:** Authenticated Doctor records first Case and first Visit in one server-owned transaction after actual arrival and valid operational Clinic Day.

**Mode B — Doctor-authorized / Nurse-recorded:** Authenticated Doctor creates a durable **pending authorization intent**, not a Case or Visit. An authenticated Nurse with currently active explicit `VISIT_START` delegation consumes that pending intent in a transaction committing Case + first Visit + consumed intent + immutable result evidence. Case authority belongs to Doctor; Visit recording actor is Nurse. The Doctor may complete an unrevoked pending intent personally after Nurse delegation revocation.

A Doctor intent is required for **new Case creation**, not as a per-Visit approval for an existing Case. The Nurse must never impersonate Doctor or receive implicit `CASE_CREATE`.

### 2.2 Invariants

- Physical arrival must be asserted before Visit recording; never fabricate an arrival timestamp.
- A *completed* new clinical registration must have both a Case and its first Visit, atomically committed.
- No Case may be marked `COMPLETED` with zero Visits.
- One Visit at most for `(case_id, clinic_day_id)`; subsequent same-day encounter continuation is not another Visit.
- Midnight does not change the Clinic Day identity.
- Clinical edits and Nurse history read have independent scoped authority/audit contracts.
- No committed clinical history is erased by later grant or intent revocation.
- No client/localStorage state is clinical source of truth.

## 3. Proposed durable FirstRegistrationIntent

**Proposed fields:** `intent_id`, `doctor_id` (authenticated server identity), `patient_id`, authorized `problem_summary`, `clinic_day_id`, server `created_at`, Doctor `operation_id`, canonical `meaning_fingerprint`, lifecycle `PENDING | CONSUMED | REVOKED`, and consumed `case_id` / `visit_id` references.

**Required properties:** meaning immutable; single consumption; revocable while pending; no client-supplied Doctor UUID as proof; no arbitrary expiry invented; Doctor takeover only for an unrevoked pending intent. Intent creation must not implicitly create Case, Visit, Clinic Day, or arrival.

**Open:** exact patient/Day binding, lifecycle storage and immutable audit of revocation, authority scope, and any time validity policy.

## 4. Proposed transaction and receipt contract

### 4.1 Commit atomicity

One server-owned PostgreSQL transaction must bind:

1. Authorized Doctor creation decision (or authenticated Doctor direct authority).
2. Actual Visit recording actor and currently valid delegation where Nurse.
3. Case insert.
4. First Visit insert.
5. Intent consumption when applicable.
6. Durable, immutable committed-result receipt and workflow identity mapping.

All-or-nothing. An earlier *pending intent* is a separate authorized fact and may remain pending if later registration rolls back.

No nested independent transaction commit; current `withAuthorized` transaction ownership must be reconciled.

### 4.2 Proposed receipt identity

- `registration_id`: overall workflow identity.
- `intent_id`: Doctor decision identity for Mode B.
- `operation_id`: stable mutation/retry identity.
- Authenticated `actor_id`, authoritative `doctor_id`, `case_id`, `visit_id`, `clinic_day_id`.
- Canonical `meaning_fingerprint`, server `committed_at`, `schema_version`.

**Proposed new operation kind:** `FIRST_REGISTRATION_COMMIT` (name/schema subject to reconciliation). Do not reuse legacy `CASE_CREATE` receipts while claiming they contain Visit references.

### 4.3 Idempotency

| Condition | Required result |
| --- | --- |
| Same actor + operation ID + identical meaning | Original committed result, no new writes |
| Same actor + operation ID + changed meaning | CONFLICT |
| One intent consumed by multiple operations/actors | At most one registration commits |
| Same Case + Clinic Day concurrent Visit starts | At most one Visit commits |
| Response lost after commit | Recover exact original Case and Visit identities |
| Commit outcome unknown | No invented success/failure; preserve identity and recover |
| Nurse grant revoked before commit | Deny new Nurse mutation, regardless of earlier request start |
| Doctor intent revoked before commit | Deny intent consumption by any actor |

A *receipt absence* alone does not prove rollback. A server may report `PENDING` only with authoritative evidence of in-progress work, not simply because no receipt exists.

### 4.4 Proposed recovery operation

`FIRST_REGISTRATION_RECOVER`: authenticated, authorization-scoped read by stable operation or registration identity.

Suggested outcomes:

- `COMMITTED`: verified durable receipt and Case/Visit references.
- `PENDING`: server has actual pending-operation evidence.
- `REJECTED`: definitive, established denial (not inferred from absence).
- `CONFLICT`: identity/meaning conflict.
- `UNKNOWN`: definitive result not established.

A lost-response client must keep the original operation ID and request meaning. A fresh operation ID is not an acceptable shortcut. Recovery permission must be distinguished from permission for a **new mutation**; previously committed records remain discoverable by appropriately authorized actors even after delegation revocation.

**Open:** how pending-operation evidence is persisted/observed, cross-actor receipt recovery authorization, and whether rejection evidence is durable.

## 5. Proposed concurrency and revocation contract

### 5.1 Linearization rule

Authority validity is evaluated against an authoritative **serialized order of commits**, not browser clock or HTTP arrival order.

- Revocation commits first → later Nurse registration denied.
- Registration commits first → historical registration preserved; later revocation affects future writes.
- Intent revocation commits first → later consumption denied.
- Intent consumption commits first → later revocation cannot erase committed Case/Visit.

**Critical implementation requirement:** Every competing writer and revoker must coordinate through compatible PostgreSQL locks held until commit/rollback. A preliminary unlocked authorization read is insufficient.

### 5.2 Candidate locking protocol

Proposed global lock order, to be reconciled with existing auth-service and revocation code:

1. Authenticate and begin the single transaction.
2. Acquire the authoritative Nurse delegation row lock (for Nurse mode).
3. Re-read delegation state and explicit `VISIT_START` membership under lock.
4. Acquire Doctor intent row lock (for intent mode).
5. Re-read pending/revoked/consumed state and bindings under lock.
6. Validate patient, Clinic Day, arrival and operation meaning; coordinate idempotency key.
7. Insert Case, Visit and receipt; consume intent.
8. Commit once, releasing locks.

Revocation paths must lock the **same authoritative records** using conflicting lock modes. Lock order across sessions, grants, intents, and operation keys must be reviewed as a whole; otherwise deadlocks or stale authority remain possible.

`READ COMMITTED` plus correct row locks, uniqueness and retries is a **candidate**, not a proven choice. `SERIALIZABLE` also requires retry/error handling. Exact isolation and SQL locking modes remain open until source review and disposable PG proof.

### 5.3 Database invariants

Propose unique `(case_id, clinic_day_id)` for Visit, single-consumption unique intent binding, and unique operation/receipt identity. Handle uniqueness races as deterministic existing-result recovery or explicit conflict, never a duplicate insert or silent overwrite.

### 5.4 Doctor takeover

Nurse grant revoked while Doctor intent remains pending → Nurse denied; Doctor may commit first registration using original Doctor authority. Revoked Doctor intent → no actor may consume that intent; Doctor may separately authorize a new operation if appropriate. Already consumed intent → recover existing result; never create a second Case.

## 6. Source compatibility and unresolved conflicts

These observations are from previously read repository files at pinned baseline; no code was changed:

| Source | Existing behavior / constraint | Reconciliation needed |
| --- | --- | --- |
| `backend/auth/authorization.js` | Explicit Nurse `VISIT_START` capability; Doctor-only `CASE_CREATE` | Preserve roles; make lock-protected delegation recheck part of transaction |
| `backend/auth/auth-service.js` | `withAuthorized` owns transaction and checks authority before business work | Review grant locking and revocation code together; no separate commit |
| `application/services/create-case.js` | Creates Case and CASE_CREATE receipt, not Visit | Introduce new bounded combined registration without falsifying historical semantics |
| `backend/persistence/migrations/002-case-visit-foundation.sql` | Separate Case/Visit; no `FirstRegistrationIntent`; no unique Case/Day Visit constraint | Additive, forward-only migration only after authorization |
| `operation_receipts` in migration 002 | `CASE_CREATE` requires `visit_id IS NULL`; kinds limited; immutable | New compatible receipt kind/schema or separate bounded structure |
| `vip_clinical.visits.type_confirmed_by` | Non-null Doctor/actor reference but no durable pre-Visit approval proof | Resolve semantics without per-Visit Doctor approval |
| `domain/VISIT-DOMAIN-BOUNDARY.md` | Visit belongs to one Case/Day; Doctor clinical-content amendment | Design continuation and protected edits without inventing Nurse edit rights |
| `ARCHITECTURE/CASE-LIFECYCLE-POLICY-B-RECONCILIATION-V2.md` | Historical zero-Visit Case and independent lifecycle rules | Reconcile new clinical first-registration coupling without deleting administrative history |
| `ARCHITECTURE/CJ01-AUTHORIZATION-INCREMENT-AND-DECISION-GATES.md` | No Visit endpoint/service/browser command yet; PG proof not executed | Do not claim integrated Visit functionality or acceptance |

## 7. Open gates before implementation

**G01 — Historical contract hierarchy:** Exact bounded amendment path for clinical first-registration vs legacy zero-Visit allowance; administrative scenarios remain outside current CJ-02 discussion.

**G02 — Intent semantics:** Schema, immutable Doctor authorization evidence, revocation, Doctor takeover, binding and lifecycle.

**G03 — Lock proof:** Inspect real grant/revocation queries and establish one global lock order, effective linearization, isolation and deadlock recovery.

**G04 — Receipt compatibility:** Define combined receipt, idempotency namespace, committed-result validation, cross-actor recovery and pending/unknown semantics.

**G05 — Visit semantics:** `type_confirmed_by` meaning; Case/Day uniqueness; continuation and Doctor-only protected clinical amendment boundaries.

**G06 — Clinic Day:** Validate active operational Day independent of midnight; no invented automatic closure.

**G07 — Case completion:** Reject zero-Visit completion; active-Visit completion remains separately gated.

**G08 — Nurse history read:** Patient scope, audit, server enforcement, no implicit write authority.

**G09 — Data/migration safety:** New forward-only migration; inspect existing data for uniqueness collisions; no historical schema rewrite or automatic migration.

**G10 — Acceptance:** Disposable PostgreSQL concurrency/failure-injection proof, authenticated recovery, browser read-back and explicit clinical release gate.

## 8. Future proof matrix — NOT EXECUTED

- Doctor-only Case authority and Nurse denial.
- Nurse active-grant success, revoked-grant denial, and Doctor takeover.
- Intent revoked before commit denial; intent consumed before revocation preserved.
- Concurrent revoke/commit ordering for both grant and intent.
- Case+first Visit+receipt all commit or all roll back.
- Same operation replay, changed-meaning conflict, concurrent intent consumption.
- Same Case/Day Visit uniqueness, including midnight crossing.
- Lost response, unknown commit, server restart, receipt recovery.
- Zero-Visit Case completion denied; clinical history read scoped.
- Immutable legacy receipts/history preserved; no migration on startup.
- Disposable PostgreSQL and browser proof; no inference of clinical release.

## 9. Current authority and preservation status

```text
FOUNDER_POLICY_CJ02_D01_D09 = APPROVED
CONSOLIDATED_TECHNICAL_CONTRACT = DRAFT
IMPLEMENTATION_AUTHORIZATION = NONE
MIGRATION_AUTHORIZATION = NONE
DATABASE_ACCESSED_OR_MODIFIED_FOR_THIS_DOCUMENT = NO
TESTS_EXECUTED_FOR_THIS_DOCUMENT = NO
SOURCE_CODE_CHANGED_FOR_THIS_DOCUMENT = NO
GIT_CHANGE_SCOPE = NEW ARCHITECTURE MARKDOWN ONLY
MAIN_MERGE = NONE
DEPLOYMENT_OR_CLINICAL_RELEASE = NONE
```

**MANUSCRIPT IS AUTHORITY.**  
**CONTRACTS AUTHORIZE.**  
**PROOF VALIDATES.**  
**GIT PRESERVES.**  
**MOHAMED.K_ROBY DECIDES.**

# CJ-02 — First Registration Decision & Design Checkpoint V1

**Factory:** RobY_BoT_FactorY  
**Product:** ViP Clinic  
**Owner / Final authority:** MOHAMED.K_ROBY  
**Recorded:** 2026-11-04  
**Status:** WORKING CHECKPOINT — FOUNDER POLICY APPROVED; ENGINEERING CONTRACT DRAFT  
**Source baseline:** `16c49b8ccc1edfff4286a718d1a3d28cc37065d1`  
**Scope:** Architectural documentation only; not implementation or clinical-release authorization.

> This checkpoint preserves decisions reached during CJ-02 discussion. It does not replace historical Manuscript, contracts, migrations, or evidence. Where historical contracts conflict with new policy, reconciliation remains explicit and pending.

## 1. Founder decisions — approved policy

### CJ02-D01 — Nurse VISIT_START
An active, explicit Doctor-to-Nurse delegation including `VISIT_START` permits the Nurse to record a Visit after physical patient arrival. No separate per-Visit Doctor approval is required. Actual actor identity and audit must be retained. Nurse does not receive `CASE_CREATE`.

### CJ02-D02 — Operational Clinic Day
Clinic Day is an operational session, not a calendar date. Crossing midnight does not automatically close, reopen, or reassign the Clinic Day. Event timestamps remain real and independent of operational Day identity.

### CJ02-D03 — Same Case + same Clinic Day = same Visit
A patient returning for the same Case within the same operational Clinic Day continues the existing Visit; no duplicate Visit or Visit counter increment. Clinical amendments require their own authority and audit.

### CJ02-D04 — Nurse history read
A Nurse with valid active Visit-recording delegation may read relevant patient history and previous Visits within authorized clinical scope. Read does not grant unrestricted editing, diagnosis, prescription, deletion, or Case creation.

### CJ02-D05 — Connected Case and first Visit
For a newly presenting clinical Case after physical arrival, the Case and first Visit form one connected registration workflow. A Case cannot be marked COMPLETED without at least one Visit. Doctor-only Case creation remains. Administrative Case scenarios were expressly set aside from this CJ-02 discussion; do not silently rewrite historical rules.

### CJ02-D06 — Distinct authority for new vs existing Cases
For an existing eligible Case, an actively delegated Nurse can start the authorized Visit directly. For a new Case, the Doctor must first issue a durable, verifiable Case-creation decision; the Nurse may then record the first Visit without being granted Case-create authority. A Doctor can operate the entire workflow.

### CJ02-D07 — Revocation before execution
If the Doctor revokes the Nurse's delegation before execution/commit, the Nurse's attempt must be denied, even when the Doctor's earlier Case-creation decision remains valid. No new Case, Visit, or false success receipt may be committed by the denied attempt. The concurrency ordering between revocation and commit requires a linearizable server/database rule. Already committed historical operations are not retroactively erased.

### CJ02-D08 — Doctor completion after Nurse revocation
Revoking Nurse delegation does not revoke the Doctor's original authority. The Doctor may complete the first registration personally, subject to fresh checks of patient arrival, operational Clinic Day, existing committed results, and no duplication.

## 2. Preferred architecture — selected direction, not implemented

**Proposed contract name:** `CJ02-FIRST-REGISTRATION-CONTRACT-V1`.

Two authorized modes, one consistent clinical result:

- **Mode A / Doctor-operated:** Authenticated Doctor creates new Case and first Visit in a single authorized transaction.
- **Mode B / Doctor-authorized, Nurse-recorded:** Authenticated Doctor issues a durable, bounded `FirstRegistrationIntent` without creating a Case or Visit. Authenticated Nurse with currently active `VISIT_START` delegation consumes that intent in one transaction creating the Case and first Visit, with distinct Doctor Case authority and Nurse Visit actor recorded. The Doctor may instead consume/complete the intent using original Doctor authority.

An intent is *not* a Visit approval for an existing Case. It is the Doctor's Case-creation decision for a **new** Case.

### Proposed intent evidence

`intent_id`, authenticated `doctor_id`, `patient_id`, authorized `problem_summary`, intended `clinic_day_id`, server `created_at`, `operation_id`, canonical `meaning_fingerprint`, pending/consumed/revoked status, and committed Case/Visit references.

The server derives Doctor identity from authentication. Nurse-supplied Doctor identifiers never constitute authority. Intent meaning must be immutable, consumption single-use, and pending intent revocable. No arbitrary expiry duration has been approved.

### Atomicity and recovery

- A completed first registration contains both Case and first Visit; any failed attempt before commit must roll back both.
- Durable receipts must reflect only committed results; lost response or `UNKNOWN` must trigger recovery, not a new operation ID.
- Same actor + operation ID + same meaning returns original result; changed meaning conflicts.
- A single intent cannot be consumed twice by concurrent actors.
- A database-enforced uniqueness invariant on `(case_id, clinic_day_id)` is proposed for Visits.
- An existing Visit is continued through a separately authorized amendment operation, never silently overwritten.
- Revocation and registration commit must have an explicit serialization order, so a revoked grant cannot authorize a later commit.
- Existing `withAuthorized` owns transaction commit/rollback; nested independent commits are forbidden.

## 3. Repository-grounded compatibility observations

Reviewed at pinned baseline:

- `backend/auth/authorization.js`: `VISIT_START` is a Nurse-delegable capability requiring explicit membership; `CASE_CREATE` is Doctor-only.
- `application/services/create-case.js`: existing `CASE_CREATE` writes a Case and its receipt, **not** a Visit.
- `backend/auth/auth-service.js`: `withAuthorized` owns an authenticated transaction encompassing work and session updates.
- `backend/persistence/migrations/002-case-visit-foundation.sql`: separate Case/Visit tables; no unique `(case_id, clinic_day_id)` constraint; `CASE_CREATE` receipts explicitly have null `visit_id`; no `FirstRegistrationIntent`.
- `domain/VISIT-DOMAIN-BOUNDARY.md`: one Case and one Clinic Day per Visit; clinical-content amendment requires Doctor; persistence and amendment representation deferred.
- `ARCHITECTURE/CASE-LIFECYCLE-POLICY-B-RECONCILIATION-V2.md`: historical zero-Visit allowance and independent Case/Visit identities remain recorded; CJ-02 clinical registration needs explicit contract reconciliation, not silent retroactive editing.
- `ARCHITECTURE/CJ01-AUTHORIZATION-INCREMENT-AND-DECISION-GATES.md`: no Visit endpoint/service/browser command was enabled by CJ-01; `type_confirmed_by` semantics and PostgreSQL acceptance remain unresolved.

## 4. Explicit design gates — not yet approved as final technical contract

1. Exact `FirstRegistrationIntent` persistence, authorization and revocation model, including Doctor self-completion.
2. Revocation-vs-commit serialization and required row locks/transaction isolation.
3. Compatible immutable receipts for combined registration, without falsifying historical `CASE_CREATE` receipt semantics.
4. `type_confirmed_by` interpretation without invented per-Visit Doctor approval.
5. Operational Clinic Day state validation, overnight handling, and day selection.
6. Database uniqueness and retry/concurrent operation outcomes.
7. Protected clinical amendments and Nurse read-only history scope.
8. Completion during an active Visit.
9. Disposable PostgreSQL and browser acceptance evidence.

## 5. Proposed future proof matrix (not executed)

Doctor-only Case authority; Nurse grant/revocation denials; physical-arrival assertion; atomic Case+Visit commit/rollback; intent single-use; stable idempotency and receipt recovery; no duplicate Visit within Case/Day; midnight preservation; no Case completion without Visit; Nurse patient-scoped history read; immutable clinical history; Doctor continuation after Nurse revocation; concurrent revoke/commit ordering; disposable PostgreSQL and real-browser integration.

## 6. Preservation and authority boundary

```text
CJ02_FOUNDER_DECISIONS = D01..D08 APPROVED
CJ02_ARCHITECTURE_DIRECTION = SELECTED
CJ02_DETAILED_CONTRACT = DRAFT / NOT FINALIZED
THIS_FILE = DOCUMENTATION CHECKPOINT
SOURCE_CODE_WRITES = NOT AUTHORIZED
SCHEMA_MIGRATION = NOT AUTHORIZED
DATABASE_EXECUTION = NOT AUTHORIZED
TEST_EXECUTION = NOT PERFORMED FOR THIS CHECKPOINT
MERGE / DEPLOY / CLINICAL_RELEASE = NOT AUTHORIZED
```

**MANUSCRIPT IS AUTHORITY.**  
**CONTRACTS AUTHORIZE.**  
**PROOF VALIDATES.**  
**GIT PRESERVES.**  
**MOHAMED.K_ROBY DECIDES.**

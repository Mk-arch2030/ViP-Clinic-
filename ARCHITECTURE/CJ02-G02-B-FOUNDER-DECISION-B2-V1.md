# CJ02-G02-B — Founder Decision B2 — Clinic Day Binding V1

**Factory:** RobY_BoT_FactorY  
**Product:** ViP Clinic  
**Founder / final authority:** MOHAMED.K_ROBY  
**Decision date:** 2026-11-04  
**Status:** FOUNDER APPROVED — OPTION B2  
**Authority scope:** Documentation of the Founder decision only. No code, database, migration, merge, deployment or clinical-release authorization.

## 1. Exact approved decision

> I approve B2. The Doctor's decision is not bound to an operational Clinic Day when issued. The first Visit is bound to the open and valid operational Clinic Day at registration time.

This decision is authoritative for the bounded CJ02 first-registration design.

## 2. Meaning and separation

- The Doctor's pending FirstRegistrationIntent authorizes a specific Patient and Doctor-approved Case problem summary, as previously approved in G02-A A1.
- **No `clinic_day_id` is part of the Doctor's initial approved Case meaning.** A later change of operational Clinic Day does not by itself change that Doctor-authorized Patient/problem meaning.
- At first Visit registration, the authorized recording workflow identifies and validates the operational Clinic Day and records its exact `clinic_day_id` in the Visit and durable combined registration result.
- The registration commit's operation meaning and receipt must bind that chosen Day. Its canonical format and idempotency rules remain separately gated.
- The Doctor intent does not implicitly open or close a Day, record arrival, create a Case or Visit, or increment the Day counter.
- Midnight crossing does not automatically close, replace, or reassign the operational Day (CJ02 D02).

## 3. Execution-time guards required by the approved policy

1. Actual physical arrival must be confirmed before first Visit recording.
2. The operational Day must be authoritatively validated as OPEN/WORKING and eligible for that clinic/actor at the effective registration transaction.
3. Doctor Case authority remains mandatory; a Nurse recorder requires active explicit VISIT_START delegation.
4. Registration and Doctor-authorized Day closure must be coordinated to prevent a stale OPEN read from authorizing a commit after effective closure.
5. If the selected Day is already CLOSED at the serialized decision point, no first Visit may be recorded against it; a valid Day must be selected and checked.
6. A successful prior registration remains on its originally committed Day even if that Day closes later.
7. If the commit result is uncertain, recover the original operation before changing Day or issuing a new registration operation.
8. One Case and operational Day must not acquire a duplicate Visit or duplicate counter increment.

These are implementation obligations for later contract/proof work, **not** evidence that runtime safeguards already exist.

## 4. Existing source and contract boundaries

- `ARCHITECTURE/CJ02-G02-B-CLINIC-DAY-BINDING-DESIGN-V1.md`: preserves comparison of B1/B2/B3 and technical risks; this decision record selects B2 without rewriting the review.
- `ARCHITECTURE/CJ02-G02-A-FOUNDER-DECISIONS-A1-A2-V1.md`: Doctor approves Patient/problem; change requires revocation and new intent. B2 does not alter these decisions.
- `ARCHITECTURE/VIP-CLINIC-DAY-STRUCTURAL-CONTRACT-V1.md`: Day identity, working date, status, lifecycle and counter are distinct; no automatic midnight change is inferred.
- `backend/persistence/clinic-day-repository.js`: existing counter increment by ID does not itself require OPEN; no claim of enforced atomic Day-close/registration serialization.
- `backend/persistence/migrations/002-case-visit-foundation.sql`: Visit has Day reference; new FirstRegistrationIntent and combined receipt remain unimplemented.

## 5. Open engineering gates (not approved by B2)

- **G02-A:** Exact canonical Doctor fingerprint, Unicode/text rules and authoritative clinic scope.
- **G02-C:** Pending-intent amendment/revocation API and immutable audit; A2 already requires revoke-and-reissue when Patient/problem changes.
- **G02-E/G04:** Day-bound commit fingerprint, operation identity, recovery and cross-actor receipt semantics.
- **G03:** Exact PostgreSQL lock order and closure/registration race proof, consistent with historical Day-before-Case lock rule.
- **G05/G06:** Day selection authority, Visit Type confirmation and operational Day eligibility.
- **G09:** Additive schema/migration preflight; no migration permitted by this decision.

## 6. Decision and execution register

```text
CJ02_G02_B_OPTION = B2
CJ02_G02_B_FOUNDER_POLICY = APPROVED
DOCTOR_INTENT_BINDS_CLINIC_DAY_AT_ISSUE = NO
FIRST_VISIT_BINDS_VALID_OPEN_CLINIC_DAY_AT_COMMIT = YES
MIDNIGHT_AUTOMATIC_DAY_SWITCH = NO
G02_B_TECHNICAL_PROOF = NOT_EXECUTED
G02_B_FULL_ENGINEERING_GATE = OPEN
SOURCE_CODE_WRITES = NONE
DATABASE_OR_MIGRATION_EXECUTION = NONE
TESTS_EXECUTED = NONE
MAIN_MERGE = NONE
DEPLOYMENT_OR_CLINICAL_RELEASE = NONE
```

**MANUSCRIPT IS AUTHORITY.**  
**CONTRACTS AUTHORIZE.**  
**PROOF VALIDATES.**  
**GIT PRESERVES.**  
**MOHAMED.K_ROBY DECIDES.**

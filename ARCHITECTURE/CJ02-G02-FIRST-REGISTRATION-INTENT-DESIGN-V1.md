# CJ02-G02 — FirstRegistrationIntent Design V1

**Owner:** MOHAMED.K_ROBY  
**Status:** ENGINEERING DESIGN DRAFT / G02 OPEN  
**Inputs:** CJ02 D01–D09 Founder-approved policy; CJ02 Consolidation V1; G01 source verification.  
**Scope:** Design only; no implementation authorization.

## 1. Purpose and separation of authority

A Doctor's durable decision to create a new Case must be verifiable and revocable without creating a Case, Visit, arrival, Clinic Day, or Visit count. An actively delegated Nurse can later record the first Visit, consuming that Doctor decision in a single atomic Case+Visit+receipt transaction. Nurse never acquires CASE_CREATE authority. Doctor may perform the workflow personally.

The intent is **not** a per-Visit Doctor approval for an existing Case.

## 2. Proposed immutable identity and meaning

- `intent_id`: server-assigned unique identity.
- `doctor_id`: derived from authenticated Doctor session; never trusted from Nurse payload.
- `patient_id`: bound Patient identity.
- `problem_summary`: Doctor-authorized new Case clinical meaning (minimum fields to be reconciled).
- `clinic_day_id`: proposed bound operational Day identity; binding and re-selection policy not yet approved.
- `created_at`: server timestamp.
- `doctor_operation_id`: stable Doctor intent-creation idempotency key.
- `meaning_fingerprint`: canonical immutable meaning including intent kind, Doctor, Patient, clinical Case meaning and applicable Day binding.
- `status`: PENDING, CONSUMED, REVOKED; committed `case_id` and `visit_id` references only when consumed.
- `consumed_by_actor_id`, `consumed_at`, `revoked_by_doctor_id`, `revoked_at`: proposed server audit fields; immutable audit event representation remains open.

No arbitrary expiry or client-supplied authority timestamp is approved. Avoid persisting unnecessary clinical payload in local recovery metadata.

## 3. Proposed state machine

```text
DOCTOR_AUTHENTICATED
      |
      v
  PENDING INTENT
    |        |
    |        +---- Doctor revokes ----> REVOKED (terminal)
    |
    +---- Authorized atomic first registration ----> CONSUMED (terminal)
```

- PENDING means only that the Doctor decision exists; it **does not** assert patient arrival or an in-flight transaction.
- REVOKED means it cannot be consumed by Nurse **or** Doctor. Doctor may issue a separate fresh decision.
- CONSUMED points to exactly one committed Case+first Visit+receipt.
- Repeated same-key/same-meaning Doctor intent creation recovers the original result; changed meaning conflicts.
- No status resurrection; no consumption without server revalidation.

## 4. Consumption prerequisites

For Nurse:
1. Authenticated Nurse identity and current explicit VISIT_START delegation.
2. Intent is PENDING, belongs to authorized Doctor/Patient/clinic scope, and not revoked.
3. Actual patient arrival, operational Clinic Day validity and required registration meaning verified.
4. No existing committed registration for the same intent or duplicate Visit for Case/Day.
5. Locks and authoritative rechecks maintained until one transaction commits.

For Doctor: authenticated original Doctor authority, valid PENDING intent, arrival/Day/duplicate guards. Nurse delegation not required.

The combined transaction inserts Case+Visit, marks intent CONSUMED, and writes immutable receipt **once**. Rollback leaves prior PENDING intent unchanged.

## 5. Revocation and concurrency

Doctor revocation requires authenticated Doctor authority and a conflicting lock on the **same intent record** used by consumption. Revocation committed first -> consumption denied. Consumption committed first -> history remains, later revoke cannot erase it. Terminal-state revocation attempts must return a bounded no-op/conflict with truthful outcome; exact API response open.

Delegation revocation is independent: revoking Nurse grant does **not** revoke Doctor intent; Doctor takeover remains possible. Revoking Doctor intent prevents any actor consuming it.

Do not assume the proposed Nurse-delegation-before-intent lock order is globally correct: effective Policy B also requires Day-before-Case business locks. G03 must review all real transaction paths and settle a global ordering.

## 6. Recovery and cross-actor takeover

Separate identities: Doctor intent-creation operation vs Nurse/Doctor commit operation vs overall registration. A lost response is recovered by the original operation identity and authenticated access. A pending intent is not proof that a particular Nurse commit is still running. A Doctor taking over after Nurse revocation must first check whether an earlier attempt already committed. No new Case/Visit on uncertain outcome.

Committed result receipt should bind `intent_id`, `case_id`, `visit_id`, actual committing actor, Doctor authority and operation identity. Historical `CASE_CREATE` receipts cannot be silently reinterpreted as combined receipts.

## 7. Unresolved design decisions

- **G02-A:** Exact Doctor intent creation minimum clinical meaning and fingerprint canonicalization.
- **G02-B:** Operational Clinic Day binding if Day changes/closes between intent creation and consumption.
- **G02-C:** Whether/how Doctor can edit pending intent; proposed safest default is revoke and issue new intent, not mutate meaning.
- **G02-D:** Exact revocation audit and authorization representation; historical immutable evidence.
- **G02-E:** Doctor takeover operation and receipt identity, including lost Nurse response.
- **G02-F:** Intent lifecycle API shape, recovery visibility and cross-actor authorization.
- **G02-G:** Final schema and compatibility with existing CASE_CREATE receipts and current auth transaction ownership.
- **G02-H:** Exact cross-resource lock order and transaction isolation proof, deferred to G03.

## 8. Future acceptance matrix (not executed)

- Doctor creates intent, no Case/Visit/arrival/Day/count side effect.
- Nurse cannot create intent or Case independently.
- Nurse active VISIT_START + valid intent + arrival + Day -> exactly one atomic Case+Visit.
- Doctor self-completion and takeover after Nurse delegation revoked.
- Revoked Doctor intent denies Nurse and Doctor consumption.
- Concurrent consume/revoke -> one serialized result.
- Two consumers/duplicate operation IDs -> at most one Case+Visit.
- Lost commit response -> authoritative receipt recovery; pending intent alone is not commit status.
- Doctor operation replay same meaning returns same intent; changed meaning conflicts.
- No silent overwrite of old clinical records or receipt semantics.

## 9. Boundary

```text
FOUNDER_POLICY_D01_D09 = APPROVED
G01_PRIMARY_SOURCE_REFERENCES = VERIFIED
G01_CLOSED = NO
G02_DESIGN = DRAFT
G02_CLOSED = NO
SCHEMA_OR_CODE_WRITES = NONE
DATABASE_OR_TEST_EXECUTION = NONE
MERGE_OR_CLINICAL_RELEASE = NONE
```

MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.

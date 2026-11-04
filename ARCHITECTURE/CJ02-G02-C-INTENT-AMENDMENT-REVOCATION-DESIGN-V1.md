# CJ02-G02-C — Intent Amendment and Revocation Contract Draft V1

**Factory:** RobY_BoT_FactorY  
**Product:** ViP Clinic  
**Owner:** MOHAMED.K_ROBY  
**Date:** 2026-11-04  
**Status:** ENGINEERING CONTRACT DRAFT — G02-C OPEN; NO NEW FOUNDER POLICY APPROVAL IMPLIED  
**Scope:** Architecture documentation only; no code, database, migration, test, merge, deployment or clinical release.

## 1. Approved authority baseline

- **G02-A A1 APPROVED:** Doctor authorizes a specific Patient and clinical problem summary. Visit details are recorded later.
- **G02-A A2 APPROVED:** Changing approved Patient or problem requires revocation of the old pending FirstRegistrationIntent and a fresh decision/operation identity; no silent amendment of original meaning.
- **G02-B B2 APPROVED:** Doctor intent is not bound to a Clinic Day at issue; first Visit binds the valid OPEN operational Day at registration.
- **CJ02 D09 APPROVED:** Doctor may revoke intent before registration commits; a revoked intent cannot be consumed by Nurse or Doctor; if commit precedes revocation, committed history persists.
- **CJ02 D07/D08 APPROVED:** Revoking Nurse delegation separately blocks Nurse but not an otherwise valid Doctor self-completion.
- Historical Policy B Case/Visit and legacy CASE_CREATE receipt remain intact.

## 2. Contract invariants

**C-01 Immutable approved meaning.** A PENDING intent's authenticated Doctor, Patient and approved problem meaning never change in place. No endpoint may repurpose the same intent_id or Doctor operation_id for a changed Patient/problem.

**C-02 No mutable amendment.** A proposed edit to Patient/problem is implemented as: revoke old PENDING intent, then create a **distinct new Doctor-authorized intent** with a fresh operation ID and fresh intent ID. The old record and its audit remain available to authorized readers. A new intent must still pass duplicate checks.

**C-03 Revocation authority.** Only an authenticated, authorized Doctor acting within the original intent's clinic/Doctor authority may request intent revocation. Nurse cannot revoke Doctor intent. Exact Doctor ownership/substitution policy remains a separate authorization gate; do not infer unrestricted cross-Doctor rights.

**C-04 Terminal states.** Allowed transitions: PENDING -> REVOKED or PENDING -> CONSUMED. REVOKED and CONSUMED are terminal. No PENDING resurrection, no CONSUMED -> REVOKED transition, and no deletion of committed Case/Visit history.

**C-05 Revocation is not Nurse delegation revocation.** Revoking Nurse VISIT_START delegation does not revoke the Doctor intent. Revoking Doctor intent blocks consumption by every actor. These must be checked separately.

**C-06 Day independence.** An operational Day closing or changing does not revoke the Doctor intent by itself. A failed registration against a CLOSED Day must not silently consume the intent. A valid OPEN Day must be selected at a later authorized attempt.

**C-07 No clinical side effects.** Revocation and replacement-intent creation alone must not create a Case, Visit, arrival, Day or counter increment.

## 3. State machine

```text
                  Doctor revokes
PENDING --------------------------------> REVOKED (terminal)
   |
   | Authorized atomic Case + first Visit commit
   v
CONSUMED (terminal)

A changed Patient/problem requires a separate NEW PENDING intent.
No transition from either terminal state to PENDING.
```

## 4. Concurrent revoke versus consume

The revocation transaction and the registration-consumption transaction must contend on the **same authoritative intent identity**, use a compatible lock/recheck protocol and establish one durable commit order.

- Revocation wins first: registration denies, with no new Case, Visit, Day counter or false success receipt.
- Registration commits first: the intent remains CONSUMED; a later revocation must not erase the committed Case/Visit or misreport the operation as successfully revoked.
- If outcome is unknown (network interruption, timeout), recover authoritative state before retry or replacement. Absence of receipt is not proof of rollback.
- Do not declare a global lock order here. Historical Day-before-Case requirements, Day closure and Nurse grant locks must be reconciled in G03.

## 5. Candidate revocation command — design only

Proposed request:
```text
INTENT_REVOKE {
  operationId: UUID,
  intentId: UUID,
  expectedStatus: "PENDING"
}
```

Server derives authenticated Doctor identity and clinic scope; no client-supplied Doctor authority is trusted. Resolve the stored intent and original meaning, lock it, check status, authorize and commit a durable immutable revocation fact/receipt.

**Candidate outcomes:** REVOKED (durably committed), ALREADY_REVOKED (only if proven and authorized), CONSUMED_CONFLICT (committed registration exists), NOT_AUTHORIZED, UNKNOWN (unresolved; no invented success/failure). Exact HTTP/API codes, receipt shape and whether repeated revocation returns original result or current state remain G02-D/G02-F design questions.

**Idempotency:** Same authorized Doctor + operationId + exact revocation meaning must not create duplicate revocation facts. Reuse of operationId with a different intent/meaning must conflict. New operationId cannot change a terminal intent's historical state.

## 6. Replacement intent — design only

1. Authenticated Doctor requests revocation of the original pending intent.
2. Verify a definitive durable revocation result (or authoritative recovery); do not infer success from a timeout.
3. Doctor issues a new distinct decision for the corrected Patient/problem, using a fresh Doctor operationId.
4. Server creates a new intent only after all authority, clinical duplicate and idempotency checks. New intent is not a mutation of the old intent.
5. Store an optional auditable predecessor relationship **only if** separately authorized and compatible with privacy/retention rules. A replacement link does not transfer authority or committed history.

Do not automatically revoke an intent merely because the operational Clinic Day changed under B2.

## 7. Audit and recovery requirements

- Preserve original intent identity, authenticated Doctor, original meaning fingerprint, server-issued timestamps and final status.
- Preserve actor, operation identity, server event time and cause for revocation; exact free-text reason policy is undecided.
- A replay of original Doctor intent creation returns the same intent with current terminal status; never resurrects PENDING.
- An authorized recovery read must distinguish definitive REVOKED from CONSUMED and UNKNOWN, and avoid disclosing clinical meaning to unauthorized Nurse actors.
- A revoked intent cannot produce a new Case/Visit commit receipt.
- Legacy CASE_CREATE operation receipts are not silently reused as INTENT_REVOKE receipts.

## 8. Specific unresolved decisions

**C1 — Revocation reason:** Is a structured reason code required (e.g. DOCTOR_CHANGED_PATIENT_OR_PROBLEM / DOCTOR_CANCELLED), or is actor/time and immutable event sufficient? Recommendation: structured reason code, no mandatory free-text clinical explanation.

**C2 — Replacement linkage:** Should a new intent optionally reference the revoked predecessor for authorized audit, without modifying the old record? Recommendation: yes, but only for an explicit Doctor replacement action.

**C3 — Revocation visibility:** May the currently delegated Nurse see only the intent's non-sensitive revoked/consumed status, while full reason and Patient/problem stay restricted? Requires exact authorization matrix.

**C4 — Retry semantics:** Define exact idempotent command response and recovery receipt for revocation and how UNKNOWN is resolved.

**C5 — Doctor identity scope:** Confirm whether only the original Doctor may revoke, or another Doctor with separately established clinic authority. Do not assume substitution.

**C6 — Audit storage:** Choose immutable event/receipt and schema-compatible state transition representation without altering historical receipts.

## 9. Future proof matrix — NOT EXECUTED

- Doctor revokes PENDING once; subsequent retries cannot resurrect.
- Nurse cannot revoke Doctor intent.
- Changed Patient/problem requires distinct new intent/operation identity.
- Revocation first vs registration first yields exactly one truthful terminal result.
- No Case/Visit/Day/counter side effects from revocation or replacement-intent issuance.
- Nurse delegation revocation independently denies Nurse but preserves Doctor self-completion.
- Day change/closure does not silently revoke intent.
- Lost response recovers authoritative terminal state.
- Existing CASE_CREATE receipt and fingerprint remain unchanged.

## 10. Gate status

```text
G02_C_DESIGN = DOCUMENTED
G02_C_FOUNDER_POLICY_BASE = A2_D09_B2_APPROVED
G02_C_NEW_CHOICES_C1_TO_C6 = NOT_APPROVED
G02_C_CLOSED = NO
SOURCE_CODE_WRITES = NONE
DATABASE_OR_MIGRATION_EXECUTION = NONE
TESTS_EXECUTED = NONE
MAIN_MERGE = NONE
CLINICAL_RELEASE = NONE
```

MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.

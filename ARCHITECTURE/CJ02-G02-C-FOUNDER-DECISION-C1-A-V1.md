# CJ02-G02-C — Founder Decision C1-A: Structured Intent Revocation Reason V1

**Factory:** RobY_BoT_FactorY  
**Product:** ViP Clinic  
**Founder / final authority:** MOHAMED.K_ROBY  
**Decision date:** 2026-11-04  
**Status:** FOUNDER APPROVED — C1-A ONLY  
**Scope:** Decision documentation on isolated architecture branch only. No source-code change, migration, SQL, database execution, merge, deployment or clinical release.

## 1. Approved decision

The Doctor must select a **revocation reason from a defined list** when revoking a pending `FirstRegistrationIntent`. The Doctor is **not required to write a free-text clinical explanation**.

This is the approved policy choice **CJ02-G02-C/C1-A**. It supersedes the C1 question in the G02-C design draft, without rewriting that historical draft.

## 2. Bounded implications

- The revocation reason is structured, not an arbitrary free-text substitute.
- The authenticated Doctor identity, intent identity, revocation operation identity, server event time and selected reason must be represented in durable, auditable evidence when the future contract is implemented.
- The reason is evidence of *why* a pending intent was revoked; it cannot change the original Patient, Doctor-approved problem summary or immutable meaning fingerprint.
- Revocation remains Doctor-authorized. Nurse delegation does not authorize intent revocation.
- A revocation may affect only a PENDING intent. A CONSUMED intent's committed Case/Visit history is not erased or reclassified.
- The selected reason does not itself revoke anything without a properly authorized and durably committed revocation operation.
- No mandatory free-text clinical explanation may be imposed as a condition of revocation.
- The approved G02-A A2 rule remains: changed Patient or problem requires revoke-and-reissue with a distinct intent and operation identity.
- The approved G02-B B2 rule remains: a Clinic Day change alone does not require revocation.

## 3. Candidate reason vocabulary — NOT FOUNDER APPROVED

The following names are **engineering proposals only**, pending explicit vocabulary review:
- `PATIENT_OR_PROBLEM_CHANGED`: Doctor changed Patient or Case problem meaning.
- `DOCTOR_CANCELLED`: Doctor withdrew the decision to open the new Case.
- `DUPLICATE_INTENT`: Doctor recognized an unintended duplicate pending decision.

The final reason set, code naming, whether any additional reason is necessary, validation rules, retention and role-based visibility remain OPEN. Do not silently treat this illustrative list as an approved clinical taxonomy.

## 4. Engineering obligations and open gates

- **G02-C/C2:** Decide whether a replacement intent may reference a revoked predecessor for audit.
- **G02-C/C3:** Determine which revocation fields an actively delegated Nurse may read.
- **G02-C/C4:** Versioned revocation receipt, idempotency and UNKNOWN recovery.
- **G02-C/C5:** Exact Doctor ownership/substitution authority.
- **G02-C/C6:** Immutable event/storage model, global lock order and concurrency proof.
- **Reason vocabulary:** Obtain explicit approval for actual codes before treating them as contractual values.
- **G02-C full closure:** Not achieved by this C1-A decision alone.

## 5. Traceability

- `ARCHITECTURE/CJ02-G02-C-INTENT-AMENDMENT-REVOCATION-DESIGN-V1.md`: earlier draft, preserved unchanged.
- `ARCHITECTURE/CJ02-G02-A-FOUNDER-DECISIONS-A1-A2-V1.md`: approved Doctor Case meaning and revoke-and-reissue on changed Patient/problem.
- `ARCHITECTURE/CJ02-G02-B-FOUNDER-DECISION-B2-V1.md`: approved Day-independent Doctor intent.
- `ARCHITECTURE/CJ02-G02-FIRST-REGISTRATION-INTENT-DESIGN-V1.md`: overall design remains draft.

## 6. Decision register

```text
CJ02_G02_C_C1 = C1_A_FOUNDER_APPROVED
REVOCATION_REASON = REQUIRED_STRUCTURED_CHOICE
MANDATORY_FREE_TEXT_CLINICAL_EXPLANATION = NO
REASON_VOCABULARY = NOT_APPROVED
G02_C_OTHER_DECISIONS = OPEN
G02_C_FULL_GATE_CLOSED = NO
SOURCE_CODE_WRITES = NONE
DATABASE_OR_MIGRATION_EXECUTION = NONE
TESTS_EXECUTED = NONE
MAIN_MERGE = NONE
CLINICAL_RELEASE = NONE
```

MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.

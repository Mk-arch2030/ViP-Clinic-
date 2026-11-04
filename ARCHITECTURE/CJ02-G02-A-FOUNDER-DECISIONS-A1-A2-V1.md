# CJ02-G02-A — Founder Decision Record A1/A2 V1

**Factory:** RobY_BoT_FactorY  
**Product:** ViP Clinic  
**Decision authority:** MOHAMED.K_ROBY  
**Decision date:** 2026-11-04  
**Status:** FOUNDER APPROVED — A1 AND A2 ONLY  
**Documentation scope:** Architecture decision record only. No implementation, migration, database access, merge, deployment or clinical release.

## Decision A1 — Doctor-approved Case meaning

**APPROVED.** The Doctor authorizes the **specific Patient** and the **clinical problem summary** for creating the new clinical Case. The first Visit's encounter details are recorded later through their separately authorized Visit-recording workflow.

**Boundary:** This decision does not itself confirm physical arrival, create a Case, create a Visit, create a Clinic Day, select a Visit Type, authorize a Nurse, or approve any clinical amendment. Doctor-only Case authority and active Nurse VISIT_START delegation remain independent requirements under CJ02 D01–D09.

## Decision A2 — Change of Doctor-approved meaning

**APPROVED.** If the Doctor changes the approved Patient or the clinical problem summary, the original pending FirstRegistrationIntent must be **revoked**, and a **new intent with a new operation identity** must be issued. The original approved meaning must never be silently edited or overwritten.

**Boundary:** A consumed intent and its committed clinical history cannot be revoked retroactively or rewritten. A revoked intent cannot be reactivated by replay. An uncertain commit outcome requires authoritative recovery before any new registration is attempted. Any new Doctor intent remains subject to clinical duplicate safeguards.

## Fingerprint implications — technical design, not yet approved

- The Doctor-decision meaning must bind the authenticated Doctor authority, the approved Patient and exact approved problem summary, in an explicitly versioned representation.
- Changing Patient or problem meaning must not reuse the prior authorization or operation identity.
- Doctor intent fingerprint and later first-registration commit fingerprint remain distinct.
- SHA-256 or any other digest is only a consistency mechanism, **not** evidence of authenticated Doctor authority.
- The legacy CASE_CREATE fingerprint and receipt contract remain unchanged.
- Exact canonical serialization, text normalization, clinic-scope representation and Clinic Day binding are **not** approved by A1/A2 and remain open design questions.

## Traceability

- `ARCHITECTURE/CJ02-G02-A-DOCTOR-INTENT-MEANING-FINGERPRINT-V1.md` — earlier proposal, preserved unchanged.
- `ARCHITECTURE/CJ02-G02-FIRST-REGISTRATION-INTENT-DESIGN-V1.md` — overall intent lifecycle design, still draft.
- `ARCHITECTURE/CJ02-CONTRACT-CONSOLIDATION-V1.md` — Founder-approved D01–D09 and unresolved engineering gates.
- Existing code: `application/services/create-case.js`, `backend/persistence/clinical-foundation.js` — read-only evidence, not modified.

## Gate register

```text
G02_A_A1 = FOUNDER_APPROVED
G02_A_A2 = FOUNDER_APPROVED
G02_A_FINGERPRINT_CANONICALIZATION = OPEN
G02_A_CLINIC_SCOPE = OPEN
G02_B_CLINIC_DAY_BINDING = OPEN
G02_A_FULL_GATE_CLOSED = NO
SOURCE_CODE_WRITES = NONE
DATABASE_OR_MIGRATION_EXECUTION = NONE
TESTS_EXECUTED = NONE
MAIN_MERGE = NONE
CLINICAL_RELEASE = NONE
```

**MANUSCRIPT IS AUTHORITY.**  
**CONTRACTS AUTHORIZE.**  
**PROOF VALIDATES.**  
**GIT PRESERVES.**  
**MOHAMED.K_ROBY DECIDES.**

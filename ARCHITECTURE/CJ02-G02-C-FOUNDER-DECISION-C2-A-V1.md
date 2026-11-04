# CJ02-G02-C/C2 — Founder Decision C2-A: Optional Replacement Intent Linkage V1

**Factory:** RobY_BoT_FactorY  
**Product:** ViP Clinic  
**Founder and final authority:** MOHAMED.K_ROBY  
**Decision date:** 2026-11-04  
**Status:** FOUNDER APPROVED — C2-A ONLY  
**Scope:** Documentation of approved clinical workflow policy only; no code, SQL, migration, database execution, tests, merge, deployment or clinical release.

## 1. Founder-approved decision

A new `FirstRegistrationIntent` issued as an explicit replacement **may optionally reference the previously revoked intent**. The link is deliberate, auditable historical lineage; it does not alter either original decision's clinical meaning, does not delete the old record, does not transfer authority and must prevent unauthorized links.

This decision selects **C2-A** from `ARCHITECTURE/CJ02-G02-C-C2-REPLACEMENT-INTENT-LINKAGE-DESIGN-V1.md`. That design proposal is preserved unchanged.

## 2. Approved invariants

1. A replacement link is **optional**, not required for every new intent. A first-ever or unrelated new intent can have no predecessor.
2. A replacement link is **explicit**. The system must not silently infer lineage from matching Patient, Doctor, problem text, timestamps or operation IDs.
3. The new intent has a **new intent identity, a new Doctor operation identity and its own Doctor-authorized meaning**. It never inherits permission to create a Case, start a Visit, or act for a Patient from the predecessor.
4. The predecessor must be an **authoritatively verified REVOKED** intent. A PENDING, CONSUMED, missing, inaccessible or uncertain predecessor cannot be treated as a valid revoked source.
5. The original intent, its original Doctor-approved Patient/problem meaning and its revocation evidence remain historically preserved. No overwrite, deletion or resurrection is authorized.
6. The link must be permitted by authenticated Doctor/clinic authorization and access checks. Nurse delegation is not Doctor replacement authority.
7. Where the replacement changes Patient, the previously approved A2 rule still applies, but the link must not disclose or copy prior Patient clinical meaning to an unauthorized actor.
8. A Clinic Day change alone does not require intent replacement or linkage (G02-B B2).
9. The link by itself creates no Case, Visit, physical-arrival assertion, Clinic Day or counter increment.

## 3. Engineering controls proposed for future proof — NOT YET APPROVED AS FINAL IMPLEMENTATION

- Candidate field: `replaces_intent_id` on the **new** intent only, nullable, immutable once issued.
- Reject self-reference, cycles, stale references, unauthorized cross-clinic links and false predecessor state.
- Evaluate at-most-one successor per revoked predecessor to avoid accidental forks; the exact uniqueness policy and concurrent retry behavior remain open.
- Include predecessor reference in new intent-creation idempotency meaning so a same-key replay cannot silently change lineage; exact canonical fingerprint is still open.
- Validate and serialize revocation, replacement and consumption races using a globally reconciled lock order; no PostgreSQL proof has been executed.
- Define role-based visibility and retention before exposing linked Patient identities or clinical details.

These are design obligations and candidates; C2-A does not by itself approve exact schema, API, lock order, one-successor uniqueness, cross-Doctor substitution or recovery response.

## 4. Relationship to previous approved decisions

- **G02-A A1:** Doctor authorizes Patient + clinical problem summary; Visit details recorded later.
- **G02-A A2:** A changed Patient/problem requires revocation of pending intent and a fresh decision; C2-A optionally links the new decision to the revoked predecessor.
- **G02-B B2:** Operational Clinic Day is bound at first Visit recording, not Doctor intent creation.
- **G02-C C1-A:** Revocation requires selecting a reason from a defined list; exact reason vocabulary remains unapproved.
- **CJ02 D09:** Revocation before consumption blocks both Doctor and Nurse; committed Case/Visit remains immutable.

## 5. Remaining open gates

- **C2 technical closure:** Exact uniqueness, replacement chain rules, cross-patient privacy, Doctor scope, fingerprint/receipt representation and concurrency.
- **G02-C/C3:** Revocation and lineage visibility to Nurse and other roles.
- **G02-C/C4:** Idempotency, terminal-state recovery and unknown outcome.
- **G02-C/C5:** Doctor authority scope and substitution.
- **G02-C/C6:** Immutable audit event/storage and global lock protocol.
- **C1 reason vocabulary:** Structured reason codes not yet Founder-approved.

## 6. Decision and preservation register

```text
CJ02_G02_C_C2 = C2_A_FOUNDER_APPROVED
REPLACEMENT_LINK = OPTIONAL_EXPLICIT
PREDECESSOR_STATE = VERIFIED_REVOKED_ONLY
OLD_INTENT_HISTORY = PRESERVED
AUTHORITY_TRANSFER = FORBIDDEN
UNAUTHORIZED_LINKS = FORBIDDEN
REPLACEMENT_SCHEMA_AND_PROOF = NOT_EXECUTED
G02_C_FULL_GATE_CLOSED = NO
SOURCE_CODE_WRITES = NONE
DATABASE_OR_MIGRATION_EXECUTION = NONE
TESTS_EXECUTED = NONE
MAIN_MERGE = NONE
CLINICAL_RELEASE = NONE
```

MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.

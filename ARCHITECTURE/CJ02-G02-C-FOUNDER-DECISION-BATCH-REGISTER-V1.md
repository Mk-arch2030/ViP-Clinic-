# CJ02 G02-C — Founder Decision Batch Register V1

Owner: MOHAMED.K_ROBY
Date: 2026-11-04
Status: DECISION REGISTER / NO IMPLIED APPROVAL

## Already approved
- A1: Doctor authorizes Patient and Case problem summary; Visit details later.
- A2: Changed Patient/problem requires revoke-and-reissue; no mutation of original meaning.
- B2: Doctor intent has no Clinic Day binding; first Visit binds a valid OPEN operational Day at registration.
- C1-A: Revocation requires selected structured reason, no mandatory free-text clinical explanation. Exact vocabulary unapproved.
- C2-A: Optional explicit immutable predecessor reference to verified revoked intent; preserve both decisions and no authority transfer.

## Remaining founder decisions — consolidated for one review
- C3: Nurse visibility. Recommended: allow scoped non-sensitive eligibility/status for a specific workflow, with Doctor-only reason, linked Patient and detailed lineage; define precise response behavior and no existence leak.
- C4: Recovery semantics. Recommended: original operation ID+meaning yields original outcome, UNKNOWN triggers read-only recovery, never auto-retry with a new ID. Exact response and access matrix pending.
- C5: Doctor substitution. Recommended: only originating Doctor may revoke/replace until an explicit separately authorized substitution contract exists.
- C6: Audit model. Recommended: immutable revocation fact and immutable predecessor pointer on new intent; schema/lock order and exact event shape pending.
- C1 vocabulary: candidate PATIENT_OR_PROBLEM_CHANGED, DOCTOR_CANCELLED, DUPLICATE_INTENT; **examples only, not approved**.
- C2 fork rule: recommend at most one committed direct successor per predecessor unless a separate exceptional workflow is approved.
- Fingerprint normalization, Day selection, receipt schema, transaction isolation and migration authorization remain separate technical gates.

Do not treat these recommendations as Founder approvals. Do not infer C3-C6 gate closure from documentation.

G02_C_APPROVED = C1_A,C2_A
G02_C_PENDING = C3,C4,C5,C6,REASON_VOCABULARY,TECHNICAL_PROOF
G02_C_CLOSED = NO
SOURCE_CODE_WRITES = NONE
SQL_OR_MIGRATION = NONE
MERGE_OR_DEPLOY = NONE

MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.

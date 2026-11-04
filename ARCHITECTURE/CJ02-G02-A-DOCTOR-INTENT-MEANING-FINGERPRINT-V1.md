# CJ02 G02-A — Doctor Intent Meaning and Fingerprint V1

Factory: RobY_BoT_FactorY  
Product: ViP Clinic  
Owner: MOHAMED.K_ROBY  
Status: DESIGN DRAFT — FOUNDER REVIEW PENDING  
Scope: Architecture documentation only; no code or database execution.

## Verified source facts

- `application/services/create-case.js` accepts `operationId`, `patientId`, `problemSummary` for Doctor CASE_CREATE, and creates a Case plus legacy receipt without Visit.
- `backend/persistence/clinical-foundation.js` has `fingerprintIntent` for CASE_CREATE and CASE_REOPEN only. It hashes versioned ordered JSON using SHA-256. CASE_CREATE meaning includes patientId and problemSummary, not Doctor or Clinic Day.
- `backend/persistence/migrations/002-case-visit-foundation.sql` requires nonblank Case problem_summary; Visit separately records arrival, current complaint, operational Day and recording actor. CASE_CREATE receipt requires null visit_id. No FirstRegistrationIntent structure exists.
- Founder decisions D05, D06, D09 approve connected clinical registration, Doctor-only Case decision and intent revocation; exact canonical fingerprint fields remain engineering design.

## Proposed Doctor-authorized Case meaning

Doctor decides: one new clinical Case for one existing Patient and one clinical problem, using authenticated Doctor authority.

Required proposed meaning:
- New distinct operation kind FIRST_REGISTRATION_INTENT_CREATE.
- Authenticated Doctor identity, never client-supplied authority.
- Server-validated Patient identity.
- Doctor-approved nonblank problem summary.
- Server-resolved clinic authority scope, with exact representation pending source review.
- Operational Clinic Day binding **not yet decided**: defer to G02-B.

The Doctor intent does **not** assert arrival, create Visit, select Visit type, record diagnosis or authorize Nurse indefinitely.

The eventual Nurse/Doctor Visit-recording payload is a **different** commit operation with its own fingerprint.

## Canonical fingerprint proposal

Use a separate versioned domain tag, e.g. `VIP_CJ02_DOCTOR_INTENT_V1`, and fixed-order typed fields, encoded as deterministic UTF-8 canonical JSON, hashed with SHA-256. Include operation kind, verified clinic scope, authenticated Doctor, Patient, approved problem summary, and the eventual explicit G02-B Day-binding policy version.

The intent ID and Doctor operation ID are identities, not mutable clinical meaning. Server creation timestamp and lifecycle status are evidence, not fingerprint meaning. Do not reuse or alter the legacy CASE_CREATE fingerprint algorithm.

Validate exact request shape; reject invalid IDs, blank-only text, NUL and unsupported encoding. Do not silently trim or rewrite approved clinical text. Precise Unicode normalization, maximum length and canonical JSON rules require versioned decisions and tests.

**SHA-256 is not Doctor authorization or a signature.** Authentication, server authorization and durable immutable records establish authority.

## Replay and immutability

- Same authenticated Doctor + same Doctor operation ID + same canonical meaning: recover the original intent, including its **current** PENDING/CONSUMED/REVOKED status.
- Same key + changed meaning: conflict; never overwrite.
- Replaying a revoked intent cannot reactivate it.
- Replaying a consumed intent cannot create another Case or Visit.
- Different operation ID does not by itself permit a clinically duplicate Case.
- Nurse cannot create Doctor intent or forge Doctor identity by providing a hash.
- Creating an intent alone creates no Case, Visit, arrival, Clinic Day or counter.

## Open Founder decisions

**A1:** Is the Doctor's approved Case problem summary sufficient for the intent, leaving Visit current complaint and arrival information for recording later? **Recommended YES.**

**A2:** If Doctor changes Patient or problem meaning while intent is pending, must original intent be revoked and a fresh intent created, rather than editing original meaning? **Recommended YES.**

**A3:** Does Doctor bind a specific operational Clinic Day when creating intent, or only at consumption? **Deferred to G02-B.**

**A4:** Exact text canonicalization, length and Unicode policy. Recommendation: preserve validated exact text; never silently normalize clinical meaning.

**A5:** Exact clinic-scope representation and global idempotency namespace require source/schema review.

**A6:** Distinct operation IDs cannot bypass clinical duplicate Case safeguards; clinical duplicate policy remains open.

**A7:** Doctor/Nurse cross-actor recovery access needs a separate contract.

## Future proof (not executed)

Same-key replay; changed-meaning conflict; Doctor authentication and Nurse denial; revoked/consumed no resurrection; deterministic Unicode fingerprint; no side-effect intent creation; no alteration of legacy CASE_CREATE; Visit data separately bound to committed receipt.

G02_A = DOCUMENTED / NOT CLOSED  
FOUNDER_DECISIONS_A1_A2 = PENDING  
SOURCE_CODE_WRITES = NONE  
DATABASE_EXECUTION = NONE  
TESTS = NOT EXECUTED  
MERGE_DEPLOY_CLINICAL_RELEASE = NONE

MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.

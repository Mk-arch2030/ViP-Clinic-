# CJ02 G02-C C3–C6 — Consolidated Engineering Design V1

Owner: MOHAMED.K_ROBY
Status: DESIGN ONLY; NO NEW FOUNDER POLICY APPROVAL
Date: 2026-11-04
Scope: GitHub architecture documentation only.

## Binding approved decisions
CJ02 D01–D09; G02-A A1/A2; G02-B B2; G02-C C1-A (structured revocation reason, exact codes pending); G02-C C2-A (optional explicit replacement link to verified REVOKED predecessor). Existing clinical and receipt history must remain immutable.

## C3 — Revocation visibility and access control
Proposed least-privilege matrix:
- Authenticated Doctor owning an intent: may inspect its meaning, status, reason and authorized predecessor lineage, subject to clinic scope and exact ownership policy C5.
- Delegated Nurse with active VISIT_START and legitimate current workflow need: may check whether a specified intent is consumable; deny on REVOKED/CONSUMED without exposing revocation reason, predecessor patient identity or full clinical history by default.
- Nurse with revoked delegation: no access to consume intent; any continued patient-history read requires its own independently approved capability, not VISIT_START.
- Unrelated actor: no intent detail or lineage disclosure.
- Audit actor: no new generic audit role authorized; require separate approval.
- Cross-patient predecessor linkage is especially sensitive; never disclose predecessor patient from a new intent without separate authority.
- Avoid existence-oracle leaks via error/status distinctions; precise API responses and whether Nurse may see an explicit REVOKED label require Founder decision.

**C3 decision pending:** minimal non-sensitive status only (recommended) vs Doctor-only revocation status vs broader Nurse audit visibility. This is not a change to Founder-approved D04 scoped patient history read.

## C4 — Idempotency and recovery
Distinct identities: Doctor intent creation operation, Doctor revocation operation, Nurse/Doctor first-registration commit operation and overall registration identity. Same actor+operation ID+same canonical meaning returns authoritative original outcome; same key with changed intent, reason, predecessor or payload conflicts. A missing receipt is UNKNOWN, not evidence of rollback. Recover by authenticated operation identity and scope. REVOKED and CONSUMED are terminal; recovery never reactivates PENDING or produces second Case/Visit. Race outcome must be checked from server transaction state. Existing legacy CASE_CREATE receipts remain unchanged.

**C4 pending:** operation namespace and schema, response shapes, retry-after-UNKNOWN protocol, privacy-safe recovery rights and exact canonical fingerprints.

## C5 — Doctor authority scope
Current backend/auth/authorization.js grants Doctor CASE_CREATE and Nurse explicitly delegated VISIT_START. The existing code does not implement new intent revoke or replacement operations. Proposed conservative default: original authenticated Doctor can revoke and replace within verified clinic scope; Nurse cannot. Another Doctor may act only under an independently established authority rule; do not infer Doctor substitution. Server derives actor identity, never accepts client-provided Doctor identity as proof.

**C5 pending:** whether a separately authorized substitute Doctor is allowed, and exact same-clinic/cross-patient scope checks. No cross-Doctor substitution is approved here.

## C6 — Immutable audit and concurrency
Proposed durable facts: intent creation (immutable meaning and Doctor identity), structured-reason revocation (actor, reason, operation ID, server timestamp), optional successor lineage on newly created intent, consumption (committing actor, Case/Visit IDs, operational Day, receipt). Never mutate historical meaning or a terminal fact. The current migration 002 has no FirstRegistrationIntent table, no intent-revocation operation kind, and CASE_CREATE receipt explicitly requires visit_id NULL: additive schema and compatibility gate mandatory.

Revocation and consumption must lock/recheck same intent identity, with exactly one terminal outcome. Registration also locks operational Day against closure, verifies Nurse delegation, and must preserve historical Day-before-Case business ordering. Do not assume a global lock sequence without a complete lock graph across auth transaction, Day, intent, Nurse grant, Case, Visit and receipts. Any crash/timeout requires authoritative recovery before replacement.

**C6 pending:** exact immutable event representation vs state row, uniqueness/fork policy, full global lock ordering, transaction isolation, DDL and database proof.

## Source review
- ARCHITECTURE/CJ02-CONTRACT-CONSOLIDATION-V1.md
- ARCHITECTURE/CJ02-G02-C-INTENT-AMENDMENT-REVOCATION-DESIGN-V1.md
- ARCHITECTURE/CJ02-G02-C-FOUNDER-DECISION-C1-A-V1.md
- ARCHITECTURE/CJ02-G02-C-FOUNDER-DECISION-C2-A-V1.md
- backend/auth/authorization.js
- backend/auth/auth-service.js
- backend/persistence/migrations/002-case-visit-foundation.sql

## Acceptance cases to prove later
Denied Nurse revocation; revoked Nurse cannot consume; Doctor intent revocation denies all consumers; no cross-patient predecessor disclosure; changed-operation meaning conflict; duplicate retry returns original result; revoke/consume race serializes; Day closure/registration race serializes; no Case/Visit on intent/revoke-only operations; immutable audit; legacy receipt unaffected. None executed.

C3_C6 = ENGINEERING_DESIGN_DOCUMENTED / FOUNDER_CHOICES_OPEN
CODE_WRITES = NONE
DATABASE_EXECUTION = NONE
TESTS_EXECUTED = NONE
MERGE_OR_RELEASE = NONE

MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.

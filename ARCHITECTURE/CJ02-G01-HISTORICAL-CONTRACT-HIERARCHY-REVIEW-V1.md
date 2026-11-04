# CJ02-G01-HISTORICAL-CONTRACT-HIERARCHY-REVIEW-V1

**Factory:** RobY_BoT_FactorY  
**Product:** ViP Clinic  
**Owner:** MOHAMED.K_ROBY  
**Date:** 2026-11-04  
**Gate:** G01 — Historical contract hierarchy and bounded clinical first-registration amendment  
**Status:** REVIEWED / PROPOSED RECONCILIATION / GATE NOT CLOSED  
**Source branch:** `docs/cj02-first-registration-checkpoint-20261104`  
**No source, SQL, database, migration, merge, or deployment changes authorized.**

## 1. Reviewed evidence

1. `ARCHITECTURE/CJ02-CONTRACT-CONSOLIDATION-V1.md`: D01–D09 approved founder policy; technical design remains draft. G01 explicitly unresolved.
2. `ARCHITECTURE/CASE-LIFECYCLE-POLICY-B-RECONCILIATION-V2.md`: records exact bounded Manuscript amendment, preserved original history, zero-Visit administrative Case and independent Case/Visit/Day identities. It expressly identifies completion before any Visit, active-Day/overnight selection, same-day recording and Nurse capability as later gates.
3. `domain/VISIT-DOMAIN-BOUNDARY.md`: Visit belongs to one Case and one Clinic Day; clinical-content amendment requires Doctor; API/persistence/workflow runtime not implemented in this boundary.

**Evidence gap:** The companion `CONTRACTS/CASE-LIFECYCLE-POLICY-B-CONTROLLED-AMENDMENT-V2.md` referenced by the reconciliation document was not retrievable at that exact path in the checked branch. Its precise clauses have **not** been independently verified in this review. Likewise, original Manuscript §§5/13 and CONTRACT-01/08 exact text were not reread for this gate. Do not represent this as a complete hierarchy audit.

## 2. Authority and scope

- Founder policy D05: newly presenting **clinical** Case after physical arrival and its first Visit must form one connected registration; a Case cannot be marked COMPLETED without a Visit.
- Founder policy D06: Doctor alone authorizes new Case; Nurse with valid VISIT_START may record first Visit against durable Doctor decision; Doctor may do both.
- Historical Policy B: explicitly preserved zero-Visit administrative Case possibility and independent Case/Visit/Day identities.
- Founder explicitly deferred administrative Case discussion for CJ-02. No administrative creation behavior, new Case status, auto-arrival, or retrospective conversion is authorized by this gate.
- Historical records and their receipts remain immutable; this proposal is prospective and bounded.

## 3. Conflict classification

| Ref | Tension | Bounded treatment | State |
| --- | --- | --- | --- |
| G01-C01 | Legacy zero-Visit Case allowance vs new clinical first-registration coupling | Apply D05 to **new CJ02 clinical registration workflow** only; do not retroactively prohibit or alter historical administrative Case | PROPOSED |
| G01-C02 | Independent Case/Visit identities vs atomic new clinical registration | Preserve independent identifiers/entities, but require a single atomic commit for new clinical Case+first Visit | PROPOSED |
| G01-C03 | Existing CASE_CREATE operation/receipt creates Case alone | Keep existing semantics and history intact; new bounded combined workflow and receipt require additive contract/migration | OPEN — G04/G09 |
| G01-C04 | Completion before any Visit historically not fully resolved | Require zero-Visit completion denial for CJ02 clinical scope; inspect original completion contract and historical data before broader rule | OPEN — G07 |
| G01-C05 | Doctor administrative reopening before arrival | Preserve independently; reopen alone must not create Visit, Day or arrival | PRESERVED / OUT OF CJ02 REGISTRATION SCOPE |
| G01-C06 | Day and Visit start authority | Respect actual arrival and operational Clinic Day; no invented midnight state change | OPEN — G05/G06 |
| G01-C07 | Exact Manuscript/controlled-amendment wording | Retrieve authoritative files and establish exact precedence before closing G01 | BLOCKER |

## 4. Proposed precedence rule (NOT a Manuscript amendment)

1. Explicit Founder decisions authorize new bounded policy **within their stated scope**.
2. Previously approved Manuscript amendments and effective bounded controlled contracts retain their historical authority outside that scope.
3. A later design draft cannot silently rewrite an earlier approved Manuscript or implementation contract.
4. A conflict requires a traceable, specifically authorized amendment and its own preservation evidence.
5. Source code, schema, and passing tests do not independently confer clinical-release authority.

This is a review interpretation, not a claim that the original Manuscript hierarchy has been fully revalidated.

## 5. Proposed prospective rule for later Founder review

> For the CJ02 **new clinical first-registration workflow**, after actual patient arrival, a Doctor-authorized new Case and its first Visit are committed together as one transaction. Neither a partial Case nor a partial Visit is a successful result. This does not redefine pre-existing administrative Case workflows, does not alter historical Case/Visit records, and does not imply that an administrative reopen creates a Visit. Doctor-only Case authority and scoped Nurse VISIT_START remain mandatory.

This is candidate contract wording. It is **not** an edit to the Manuscript or controlled amendment.

## 6. Closure criteria

- [x] Identify D05/D06 and historical Policy B tension.
- [x] Preserve independent identities and existing historical authority.
- [x] Propose bounded prospective clinical-only reconciliation.
- [x] Declare administrative cases outside CJ02.
- [ ] Locate/read exact effective controlled amendment and original Manuscript relevant clauses.
- [ ] Check completion and Case/Visit cardinality language against source contracts.
- [ ] Founder review of precise amendment wording, if needed.
- [ ] Record authority decision and update gate state with documentary proof.

**G01 STATUS: OPEN — REVIEW DOCUMENTED, SOURCE/AMENDMENT GATES PENDING.**

## 7. Preservation statement

```text
G01_REVIEW = DOCUMENTED
G01_CLOSED = NO
FOUNDER_D01_D09 = APPROVED
NEW_MANUSCRIPT_AMENDMENT = NO
SOURCE_CODE_WRITES = NO
SQL_OR_DATABASE_EXECUTION = NO
MIGRATION_EXECUTION = NO
TEST_PROOF = NOT PERFORMED
GIT_SCOPE = ONE NEW ARCHITECTURE MARKDOWN ON ISOLATED DOCS BRANCH
MAIN_MERGE = NO
CLINICAL_RELEASE = NO
```

**MANUSCRIPT IS AUTHORITY.**  
**CONTRACTS AUTHORIZE.**  
**PROOF VALIDATES.**  
**GIT PRESERVES.**  
**MOHAMED.K_ROBY DECIDES.**

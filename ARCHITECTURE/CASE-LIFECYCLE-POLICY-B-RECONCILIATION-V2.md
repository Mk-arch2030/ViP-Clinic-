# Policy B reconciliation V2

STATUS = RECONCILED BOUNDED CONTRACT DEFINITION / RUNTIME NOT PROVEN
BASE = b72192aed65f810b794f6d69b8e49c18622a3945
AUTHORITY = MOHAMED.K_ROBY EXPLICIT MANUSCRIPT AMENDMENT & ENGINEERING PRESERVATION DIRECTIVE / 2026-10-13
MANUSCRIPT_AMENDMENT = APPLIED EXACTLY / SECTIONS 5 AND 13 ONLY
NEXT_CLINICAL_POSTGRESQL_IMPLEMENTATION = NOT AUTHORIZED

The newer owner rule permits administrative reopening before arrival, with no Visit, arrival fact, count increment or Clinic Day encounter. It invalidates V1's proposed Exited — Follow-up Pending destination and every other forced operational state. Original records remain untouched.

| Authority reference | Conflict / reconciliation boundary |
|---|---|
| Manuscript §§5/13/18 | Exact approved §5 paragraph and §13 replacement applied. Other sections including §17/§18 stay historical chronology. No sixth state or fabricated operational destination. Current explicit owner amendment governs this bounded model. |
| CONTRACT-01 §§3–7; CONTRACT-08 §§7/9–14 | Preserve Patient/Case/Visit/Day ownership and prior history. Qualify Case one-or-more-Visits cardinality to zero-or-many before deliberate recording; qualify terminal finality by explicit Policy B exception; separate Case lifecycle from encounter progression. Initial Case need not own an opening Day. Later Visit need not meet an invented elapsed interval; working-Day/same-day guards remain separately defined, not automatically relaxed. |
| WORKFLOW-STATE-MACHINE-TECHNICAL-CONTRACT-V1.md §§2–4/7/8; domain/CASE-DOMAIN-BOUNDARY.md | Supersede exclusive Case ownership of encounter labels and unconditional Completed→active denial only for the owner-approved independent lifecycle. Preserve familiar five labels, authority/history/atomicity/replay invariants. Legacy domain source remains untouched and is not the new runtime implementation. |
| CONTRACT-03 §§3–6/8/10 | Doctor alone and reserved decisions preserved; no new Nurse clinical authority. |
| CONTRACT-05 §§3–6/10–15; CONTRACT-02 Start Controlled Amendment | Explicit recording after arrival; reopen not arrival/Visit/Day start. Keep Day uniqueness/explicit start/independent closure. |
| PERSISTENCE-TECHNICAL-CONTRACT-V1.md §§11–12; PERSISTENCE-SCHEMA-DEFINITION-V1.md §5; PERSISTENCE-PHYSICAL-STRUCTURAL-DEFINITION-V1.md §6; BUILD-AUTHORIZATION-G04-AUDIT-BEHAVIOR-DECISION.md | Qualify current-only/direct-completion/no-dedicated-fact rule solely for bounded immutable COMPLETED/REOPENED facts plus current lifecycle. Actual completion instant and Africa/Cairo date replace working-date-only eligibility anchor. No generic audit/event sourcing/all-transition history, SQL/migration execution or invented legacy repair. |
| CONTRACT-04 history; CONTRACT-06 treatment; CONTRACT-07 protection | Old Visits/Rx/Days preserved; reopening never authorizes clinical correction or erases history. |
| Earlier 7A design and parity audit §§6–10 | Reports remain evidence. Null historical completion facts while active, terminal-only model and forced operational reopen are not current implementation instructions. |

## Implementable independent scope

The approved calendar rule can be computed in a pure side-effect-free module without selecting a new Case state or trusting caller evidence. domain/case-policy-b.cjs exposes policyDate and reopeningCalendarWindow; no application/API wiring, authentication replacement, completion/reopen effect or receipt is implemented. This is not complete Policy B runtime functionality.

Existing Stage6 registration uncertainty repair and Contract09 detailed-age date-only bug fix do not depend on the Case ownership amendment. They are development increments under the current owner grant, with separate tests and limitations. No old proof/fixture/report is rewritten to claim them.

## Effective scope, history and unresolved decisions

The companion CONTRACTS/CASE-LIFECYCLE-POLICY-B-CONTROLLED-AMENDMENT-V2.md is the effective bounded definition, subordinate to the amended Manuscript and current owner grant. It defines OPEN/COMPLETED, Doctor clinical authority, latest unmatched completion episode, immutable facts, deliberate Visit recording/ownership/counts, server calendar, transaction/receipt/concurrency requirements. All unmentioned historical clauses remain binding in their original scope. Existing implementation and historical CLOSED/PROVEN evidence are not retroactively declared compliant. Current authority map is not edited and does not independently grant new implementation.

Case/Visit/Day independent identities and zero-Visit administrative Case are explicitly defined; Patient UUID/CPN unchanged. Completion does not invent or require With Doctor encounter, Exit and Follow-up leaves OPEN, old Visit/Rx/Day cannot be changed by reopening. No persisted queue value exists without its actual encounter. CONTRACT-08 Visit Type and separate protected correction/Rx rules remain intact.

The approved model has no remaining higher-authority ownership/finality conflict within this definition. Remaining clinical gates are completion during an active Visit or before any recorded Visit, active-Day/overnight selection, simultaneous/same-day recording policy and optional Nurse capability scope. These remain explicit exclusions for affected future writes; they are not resolved by an invented sixth state, arbitrary cutoff or hidden permission. Definition reconciliation is not complete runtime acceptance or automatic CLOSED + PROVEN.

Original contracts and the prior V2 draft are preserved in Git history. Amendment decision: CASE-VISIT-LIFECYCLE-MANUSCRIPT-AMENDMENT-DECISION-V1.md. Documentary exact-text/preservation checks and executed regression must be recorded in a separate evidence record. No assertion that missing historic authorization SHAs were recovered is made.

## Safety / next boundary

Only the exact approved Manuscript §5/§13 edits, recovered development increment, bounded V2 documents and amendment decision/evidence are in the current preservation scope. The owner authorizes scoped local commits and a verified safe isolated-branch push after gates. No Standalone edits, protected owner-path edits, Golden fixture/evidence rewrites, SQL/migration/clinical-data/credential changes, protected-branch merge, PR, Issue #1 operation or deployment. STOP after Gates A–E; next clinical PostgreSQL implementation still requires separate authorization. Its proposed scope is additive Case/Visit/episode/receipt persistence plus secured transaction-owned service, verified disposable PG, then original UI. No fake Day/Visit or LocalStorage clinical fallback.

# Policy B reconciliation V2

STATUS = PROPOSED / PARTIAL_RECONCILIATION / NOT CLOSED
BASE = b72192aed65f810b794f6d69b8e49c18622a3945
AUTHORITY = current MOHAMED.K_ROBY engineering directive

The newer owner rule permits administrative reopening before arrival, with no Visit, arrival fact, count increment or Clinic Day encounter. It invalidates V1's proposed Exited — Follow-up Pending destination and every other forced operational state. Original records remain untouched.

| Authority reference | Conflict / reconciliation boundary |
|---|---|
| Manuscript §§5/13/18 | Case-owned five states cannot truthfully express administratively open without encounter. Exact §§5/13 amendment proposed separately; NOT applied. Clinical writes stop until approval. |
| CONTRACT-01 §§3–7; CONTRACT-08 §§7/9–14 | Keep ownership/cardinality/history; qualify terminal finality and separate clinical Case lifecycle from encounter queue/progression after Manuscript approval. |
| WORKFLOW-STATE-MACHINE-TECHNICAL-CONTRACT-V1.md §§2–4/7/8; domain/CASE-DOMAIN-BOUNDARY.md | Legacy state ownership/deny-all reverse rule retained historically. No mutation to old source/model; proposed bounded lifecycle dimension requires new effective contract. |
| CONTRACT-03 §§3–6/8/10 | Doctor alone and reserved decisions preserved; no new Nurse clinical authority. |
| CONTRACT-05 §§3–6/10–15; CONTRACT-02 Start Controlled Amendment | Explicit recording after arrival; reopen not arrival/Visit/Day start. Keep Day uniqueness/explicit start/independent closure. |
| PERSISTENCE-TECHNICAL-CONTRACT-V1.md §§11–12; schema §5; physical §6; G04 Audit Behavior Decision | Current-only/direct completion conflicts with immutable episodes. Bounded lifecycle facts proposed; no generic audit platform, schema/migration execution or legacy repair. |
| CONTRACT-04 history; CONTRACT-06 treatment; CONTRACT-07 protection | Old Visits/Rx/Days preserved; reopening never authorizes clinical correction or erases history. |
| Earlier 7A design and parity audit §§6–10 | Reports remain evidence. Null historical completion facts while active, terminal-only model and forced operational reopen are not current implementation instructions. |

## Implementable independent scope

The approved calendar rule can be computed in a pure side-effect-free module without selecting a new Case state or trusting caller evidence. domain/case-policy-b.cjs exposes policyDate and reopeningCalendarWindow; no application/API wiring, authentication replacement, completion/reopen effect or receipt is implemented. This is not complete Policy B runtime functionality.

Existing Stage6 registration uncertainty repair and Contract09 detailed-age date-only bug fix do not depend on the Case ownership amendment. They are development increments under the current owner grant, with separate tests and limitations. No old proof/fixture/report is rewritten to claim them.

## Safety / next boundary

No Manuscript edits, Standalone edits, protected owner paths, Golden fixtures/evidence, SQL/migration/clinical-data/credential changes, commits, pushes, merges, Issue #1 operations or deployment. Local isolated branch only. Future commit/push remain owner decisions. Clinical next slice: after approved Manuscript and effective lifecycle/Visit-initiation contract, additive Case/Visit/episode/receipt schema plus secured transaction-owned service, verified disposable PG, then original UI. No fake Day/Visit or LocalStorage clinical fallback.

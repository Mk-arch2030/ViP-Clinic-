# RobY Factory Stage 7 CASE_CREATE Case Study V1

Status: DRAFT FOR OWNER REVIEW. Retrospective prepared 2026-10-15 (Africa/Cairo).
Scope: bounded ViP Clinic Doctor CASE_CREATE; not full Stage 7, browser acceptance or clinical release.
Purpose: derive a reusable operating process without changing the clinic's governing contracts.

## Baseline and provenance

Repository: Mk-arch2030/ViP-Clinic-.

| Fact | Identity/result | Evidence classification |
| --- | --- | --- |
| Foundation | 25fc7ab800a9073152ea50c9447e3561462e6ce2, parent 4f4d61ed77bf2ab9097a95c50a6248802e403b21 | VERIFIED Git objects and current remote foundation ref |
| Astra implementation | 9512de159e0ea5338fa904bc614cedfdb7d79296, parent foundation above | VERIFIED Git objects; [implementation commit](https://github.com/Mk-arch2030/ViP-Clinic-/commit/9512de159e0ea5338fa904bc614cedfdb7d79296) |
| Feature review | work/astra-stage7-doctor-case-create; [Draft PR #2 at delivery](https://github.com/Mk-arch2030/ViP-Clinic-/pull/2) | VERIFIED during implementation delivery; do not infer its current merge status from this historical label |
| Integration destination | work/stage7-astra-integrated currently points to 9512de159e0ea5338fa904bc614cedfdb7d79296 | VERIFIED remote ref on this documentation intake |
| Original device repository | ~/ViP-Clinic- | OWNER-REPORTED device path, not a Work filesystem inspection |
| Work implementation regression | 328 passed, 0 failed; separate independent selection also 328 passed | VERIFIED Work execution during the preceding increment, not rerun for this documentation change |
| After-integration Termux regression | 328 passed; 0 failed/cancelled/skipped/todo; RUN_ALL=PASS; REGRESSION_EXIT=0 | OWNER-REPORTED execution with command/output supplied in the Operating Standard Directive conversation |
| TypeScript and production build after integration | PASS | OWNER-REPORTED reference evidence; distinct from the earlier Work PASS |
| Real PostgreSQL 18.2 CASE_CREATE | PASS; 10 scenarios passed; API-to-PostgreSQL PASS | OWNER-REPORTED independent acceptance in the Directive; underlying complete SQL log/hash not supplied or inspected in this documentation increment |
| Integration branch GitHub push | PASS reported; exact resulting remote ref independently observed | OWNER-REPORTED push execution plus VERIFIED remote result; precise device Git command not inspected |
| Browser | NOT RUN | Explicit evidence limit; no promotion from Termux, Fastify injection or PostgreSQL |
| Historical test exclusion | src/services/clinic-authority-p37a.test.ts | Explicit in supplied output and the committed test runner; no new exclusion inferred |

The supplied post-integration output names `/data/data/com.termux/files/usr/tmp/roby-run-all-EAeIZv/tests.log`. Its contents beyond the supplied summary and its hash were not independently read here. No unavailable hash, exact integration command or human duration is invented. Identical source/integration SHAs establish the resulting identity, not which Git command the Owner used.

## Bounded product outcome

The increment adds Doctor-only Case creation, strict request validation, Patient verification, server-generated UUID, OPEN lifecycle, durable receipt and authenticated recovery through the existing session/origin/CSRF and outer transaction authority. It adds no Visit, Clinic Day, arrival, queue, Patient, CPN, prescription or completion/reopening operation. Routes are opt-in; source implementation is not automatic production enablement.

These are ViP-specific invariants, not new factory-wide clinical rules. Reference: [bounded implementation record](../../ARCHITECTURE/STAGE7-DOCTOR-CASE-CREATE-V1.md) at 9512de159e0ea5338fa904bc614cedfdb7d79296; [V2 reconciliation](../../ARCHITECTURE/CASE-LIFECYCLE-POLICY-B-RECONCILIATION-V2.md). The implementation record's PostgreSQL PENDING status accurately describes its publication time. Later Owner-reported device acceptance adds evidence; this study does not rewrite that historical record or claim Work performed Termux execution.

## Observed sequence

1. Original foundation objects were recovered from the Owner's bundle, identities/ancestry verified, and the 316-test foundation reproduced in Work. Missing original history was not reconstructed from prose.
2. Work initially stopped CASE_CREATE on the earlier C1-before-C2 sequencing when it could not run real PostgreSQL locally. The Owner subsequently distinguished implementation permission from real-environment acceptance and explicitly authorized source work plus a Termux harness.
3. Astra implemented and tested the bounded API/service/receipt increment. Work totals became 328, with type/build checks passed; these were not SQL durability claims.
4. Native Git HTTPS transport lacked authentication. Once the exact foundation was available on GitHub, the authorized GitHub-native workflow authored a new implementation commit, published its feature ref and independently fetched/matched the tree. Earlier local development commits were preserved separately; they were not falsely described as exact remote transfers.
5. The engineer delivered a guarded PostgreSQL runner, evidence, reproduction instructions and Draft PR. At that handoff, real PostgreSQL and browser acceptance were pending.
6. The Owner reports independent PostgreSQL 18.2 acceptance (10 scenarios and API-to-PG), integration in the primary Termux repository, 328-test regression, type/build PASS and integration-branch sync. This intake verifies the resulting remote integration SHA. Browser proof remains NOT RUN.

No wall-clock completion time or percentage improvement is inferred from this sequence. No unobserved device correction or failed SQL run is asserted.

## What produced meaningful assurance

| Step | Assurance gained | Boundary |
| --- | --- | --- |
| Exact Git recovery and ancestry checks | Correct foundation, preserved provenance | Does not establish runtime behavior |
| Scoped source/contract review | Clinical boundaries and authority retained | Does not substitute for tests |
| Focused tests plus full regression/type/build | Application behavior and compatibility at the named source | Memory receipts/concurrency are not PostgreSQL durability |
| Guarded fresh-database harness | Repeatable acceptance path with explicit target safeguards | Source of a harness is not execution evidence |
| Independent Termux PostgreSQL acceptance | Owner reports target-environment transactional/API proof | Work did not independently inspect full device logs here; not browser proof |
| Integration regression and remote ref check | Owner reports integrated regression; resulting published source identity verified | No deployment or clinical release implied |

## Friction and process lessons

- The initial stop combined an implementation sequencing restriction with an unavailable acceptance environment. It was justified under the earlier wording; the later explicit distinction enabled source progress. Future directives should identify each gate before work begins rather than forcing repeated clarification.
- Native transport failure and missing remote prerequisites required a publication workaround. Establish available publication capabilities once; distinguish a new GitHub-authored increment from exact-object preservation. Do not repeatedly attempt unchanged unavailable authentication or rebuild original history.
- Exact baseline checks matter when recovering history, changing environments or integrating. Repeating unchanged successful inventories merely for reassurance is avoidable process overhead. This is a recommendation, not a measured count of unnecessary checks in the historical record.
- A reproducible guarded harness allows Work to engineer without requiring direct access to the Owner's phone. Keep device-specific proof with the independent operator and attribution explicit.
- Feature-only success was not sufficient: acceptance, integration regression and verified GitHub synchronization complete the intended delivery loop. Use distinct status labels so “ready for acceptance” is not confused with “integrated delivery complete.”

Active human time, waiting time and savings were NOT MEASURED. The proposed 30–55-minute budget in the [standard](ROBY-FACTORY-OPERATING-STANDARD-V1.md) is a planning target for future small increments, not an achieved Stage 7 metric.

## Transferable process and remaining limits

Adopt the four stages: DIRECTIVE → ASTRA IMPLEMENTATION → TARGETED ACCEPTANCE → INTEGRATION AND SYNC. Use risk-based checks, retain failures and corrections, and avoid redundant reruns without a material reason. Keep factory workflow separate from each product's authority and data protections.

This case supports the process with inspected source/remote facts and attributed Owner acceptance. It does not prove universal reliability, browser readiness, production deployment, all clinical workflows or future increments. The Owner remains the final authority for adopting this operating standard and integrating its documentation. No new clinical decision is made here.

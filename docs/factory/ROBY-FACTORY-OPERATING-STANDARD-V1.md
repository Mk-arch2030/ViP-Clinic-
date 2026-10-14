# RobY Factory Operating Standard V1

Status: DRAFT FOR OWNER REVIEW — documentation execution authorized; adoption and integration pending.
Owner: MOHAMED.K_ROBY. Engineering review: SHAQO. Initial implementation engineer: ASTRA.
Scope: reusable factory process, hosted in ViP Clinic as the reference repository. Version date: 2026-10-15 (Africa/Cairo).

## Authority and applicability

MANUSCRIPT IS AUTHORITY.
CONTRACTS AUTHORIZE.
PROOF VALIDATES.
GIT PRESERVES.
MOHAMED.K_ROBY DECIDES.

The Owner's explicit documentation execution authorization activates the Operating Standard V1 Directive only for preparing these five documents, publishing a documentation branch and opening a draft PR. It does not adopt this draft as a governing standard or authorize product changes, integration, merge or release.

Once adopted, this standard describes how to execute a separately authorized increment. It grants no product capability by itself. Each product retains its own Manuscript, contracts, clinical/business decisions, protected assets and release rules. ViP-specific Doctor, Case, Visit, Cairo-calendar and PostgreSQL policies are examples in the case study, not requirements automatically inherited by another factory product.

Read authority in temporal context. Record the exact scope of a later explicit supersession; preserve the older decision as history. A historical CLOSED label, an authority map or a test count cannot expand current permission. Escalate an unresolved higher-authority conflict or product decision; continue unaffected authorized work.

## Roles and autonomy

| Role | Responsibility and limit |
| --- | --- |
| MOHAMED.K_ROBY — Owner | Approves objective, scope, reserved decisions, acceptance, integration destination and permitted publication. Final authority; release remains separate. |
| SHAQO — engineering review | Prepares an unambiguous directive with the Owner, assesses evidence and coordinates proportionate independent acceptance. Cannot silently grant Owner-reserved decisions. |
| ASTRA or assigned engineer | Inspects relevant source/contracts, chooses ordinary contract-consistent implementation details, implements, tests, diagnoses, preserves and reports. Does not repeatedly seek permission for actions already authorized. |
| Independent acceptance operator | Runs the minimum target-environment checks needed and records actual evidence. In the reference case the Owner/SHAQO use Termux; the engineer does not claim to have operated that device. |

One person may perform several roles if disclosed. Independence describes who/where verified a claim; a repeated run by the same engineer is not independent device acceptance. Trust reduces redundant preflight work, not evidence integrity.

## Execution loop

### A. DIRECTIVE

Use the [directive template](ROBY-FACTORY-DIRECTIVE-TEMPLATE-V1.md). Specify objective, exact baseline, functional/nonfunctional boundaries, protected assets, prohibitions, acceptance criteria, risk level, environment, stop conditions and integration destination. Distinguish permission to implement, test, commit, publish, integrate and release. Draft preparation is not execution authorization.

SHAQO prepares the bounded assignment; the Owner explicitly authorizes it. Unknown destinations or necessary reserved clinical/business decisions are decision gates, not blanks the engineer fills silently.

### B. ASTRA IMPLEMENTATION

Verify the relevant baseline and history once, inspect applicable governance, and establish an isolated clean context before writes. Preserve owner changes and original Git objects. Inspect actual code paths as well as documentation; do not assume main is the newest work.

Implement the smallest complete authorized increment, with appropriate tests and reviewable commits. Resolve routine engineering issues autonomously. Record source SHA/tree, changed paths, exact commands, toolchain, outcomes and limitations. Keep secrets and private clinical data out of logs and artifacts.

Separate implementation prerequisites from acceptance prerequisites. If real infrastructure is unavailable but source development is authorized, implement and prepare a guarded reproducible harness; mark real-environment acceptance pending. If a contract explicitly prohibits the affected implementation, cite the exact clause and stop that action. Never weaken a safety guard or substitute mocked success for unavailable infrastructure.

Publish only when authorized, to the verified feature destination, without force or history replacement. If native Git transport is unavailable, a permitted GitHub-native workflow may author a NEW commit from an available verified parent; explicitly identify it and verify its tree. It is not an exact-object transfer of a differently identified local commit. If exact commit identity is required, use exact-object transport/bundles or report the blocker. Never recreate missing historical commits from prose.

Engineering-ready handoff includes named commit/branch, changed files, evidence and a bounded acceptance procedure. It is not yet integrated delivery.

### C. TARGETED ACCEPTANCE

Use the [acceptance checklist](ROBY-FACTORY-ACCEPTANCE-CHECKLIST-V1.md). Review evidence, then execute the smallest independent checks required by the changed layer, risk and target environment. Reuse successful checks tied to the same source/configuration/environment unless a material reason invalidates them. Prioritize meaningful execution over repeated inventories.

Material reasons include source or dependency changes, changed configuration/target, ambiguous or incomplete logs, a concrete defect, or a required post-integration gate. Record why a check was repeated. Do not repeat tests merely to produce a larger count.

On failure:

1. Preserve the exact command, source, exit code, failure and relevant environment.
2. Identify the affected layer: authority, source, dependency/toolchain, transport, test harness, database or product behavior.
3. Apply the smallest justified correction within scope; seek authority only for scope/policy changes.
4. Rerun the affected test and preserve both original and final outcomes.
5. After code changes, rerun required regression and applicable type/build gates.

Do not silently skip, weaken or relabel a failure. Test-infrastructure defects can be corrected with evidence, not hidden. A mandatory unresolved failure blocks acceptance; continue unrelated authorized analysis without claiming completion.

### D. INTEGRATION AND SYNC

After acceptance and integration authorization, verify the destination and current refs. Prefer a fast-forward when ancestry permits, or another explicitly allowed history-preserving integration. A divergence or unexpected change requires review; never force, reset away owner work or silently recreate history.

Run required post-integration checks at the integrated HEAD. For Level 1, these are documentation/repository checks; application regression is not automatic. For Levels 2/3, apply the contracted regression gates and additional focused checks when integration changes their risk.

Publish the authorized integration branch, then independently query/fetch the remote and compare exact HEAD and relevant ancestry/tree. A successful push message alone is insufficient. Record final local/remote identities, working-tree state, protected-ref comparison and unresolved limits. Feature publication, integration, sync and clinical/product release are separate states. No main/Golden/protected merge or deployment without separate authorization.

## Risk-based acceptance

Choose the highest affected level, with explicit applicable checks; small line counts do not make authentication or data changes low risk.

| Level | Required evidence | What is not automatically required |
| --- | --- | --- |
| 1 — Documentation / Low Risk | Scope, completeness, role/authority clarity, internal consistency, references/links, exact changed files and preservation of non-document assets; repeat applicable checks after integration. | Application tests, build or database execution for prose-only changes. If executable procedures or configuration change, reassess their actual risk. |
| 2 — Application Engineering | Focused automated tests, required regression, type/build checks when applicable, source integrity and post-integration regression. | Unrelated environment checks with no changed dependency or acceptance claim. |
| 3 — Database / Security / Clinical Authority | Level 2 as relevant, plus focused authorization, transactional integrity, concurrency/replay where applicable, data preservation and recovery evidence; verified disposable target before test writes. | Production access, destructive cleanup, or broad unrelated proof. Real database/browser/device proof is mandatory whenever the claim depends on it. |

A unit double is not SQL durability; DOM/Fastify injection is not a real browser; compilation is not runtime acceptance. Log all exclusions. At ViP's recorded Stage 7 baseline, P37A is historical and excluded; that is a product-specific fact, not a factory-wide permission to exclude tests.

## Evidence and status vocabulary

For every material claim identify the source SHA, command/procedure, environment/operator, counts and exit code where applicable, log/artifact location and hash when available. Record missing evidence honestly; never invent timestamps, log hashes or durations.

- VERIFIED: directly inspected objects or executed evidence, with the exact scope stated.
- OWNER-REPORTED: supplied device/acceptance result not independently rerun by this engineer; retain attribution and available original output.
- INFERRED: reasoned interpretation, not direct execution evidence.
- NOT RUN / PENDING: an applicable check has not run; cannot count as PASS.
- BLOCKED / FAIL: respectively unavailable prerequisite or executed failed check; describe the precise boundary.
- NOT APPLICABLE: give a risk-based reason; do not use it to hide a required gate.

## Human effort budget

Planning targets for a small bounded increment, not deadlines or demonstrated savings:

| Activity | Active human involvement target |
| --- | --- |
| Directive preparation | 10–15 minutes |
| Engineer delivery review | 5–10 minutes |
| Targeted acceptance | 10–20 minutes, excluding test runtime |
| Integration and GitHub sync | 5–10 minutes |
| Total | 30–55 minutes |

Record actual active human minutes by activity/operator separately from automated runtime and waiting. Use NOT MEASURED when unknown. Do not derive human effort from TAP duration, message timestamps or commit times. If the budget is exceeded, note the cause and improve the process; never omit necessary proof to meet a target.

## Definition of done and exceptions

Use the [delivery record](ROBY-FACTORY-DELIVERY-RECORD-TEMPLATE-V1.md). Integrated delivery requires all applicable conditions:

- Authorized scope completed and source commit identified.
- Required tests and relevant real-environment proof pass, with exclusions and limits disclosed.
- Owner acceptance/integration authorization recorded.
- Changes integrated into the approved destination; required post-integration checks pass.
- Authorized GitHub sync independently verified.
- Concise handoff records source, integration and remote identities, proof and limitations.

Before integration, label the result ENGINEERING READY FOR ACCEPTANCE or ACCEPTED / INTEGRATION PENDING as justified. If a required step is blocked, label the handoff PARTIAL / BLOCKED. Never call a feature-only result INTEGRATED DELIVERY COMPLETE. A not-applicable runtime gate must carry its rationale; an unauthorized integration is pending, not permission to bypass the Owner.

Stop the affected action for uncertain authority, missing required original history, unsafe worktree/target, protected-file changes, unresolved policy, failing mandatory gate or unauthorized irreversible effect. Preserve evidence and usable work; propose the smallest recovery boundary. No automatic production rollback or deletion. A later correction to this standard requires a scoped versioned change, preserving this review history.

Companions: [case study](ROBY-FACTORY-STAGE7-CASE-STUDY-V1.md), [directive](ROBY-FACTORY-DIRECTIVE-TEMPLATE-V1.md), [checklist](ROBY-FACTORY-ACCEPTANCE-CHECKLIST-V1.md), [record](ROBY-FACTORY-DELIVERY-RECORD-TEMPLATE-V1.md).

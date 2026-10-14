# RobY Factory Acceptance Checklist V1

Status: DRAFT FOR OWNER REVIEW. Use with the [standard](ROBY-FACTORY-OPERATING-STANDARD-V1.md) and [delivery record](ROBY-FACTORY-DELIVERY-RECORD-TEMPLATE-V1.md).
Designed for a small mobile/Termux review: one clear command or check at a time, inspect its result, then continue. A prompt such as ~/ViP-Clinic- is not repository identity proof.

## Intake — once for the relevant context

- [ ] Explicit Owner authorization and objective are present; reserved actions are understood.
- [ ] Exact repository, branch, HEAD/ancestry and safe isolated working context verified; owner files preserved.
- [ ] Relevant evidence, changed-file manifest, risk level and acceptance destination reviewed.
- [ ] Required environment-dependent claims identified; historical totals are not current execution.

## Level 1 — Documentation / Low Risk

- [ ] Required artifacts are complete; roles, authority, scope and status are explicit.
- [ ] Internal links, names, evidence attribution and terminology are consistent.
- [ ] Diff contains only authorized documentation; no overwritten contracts, clinical code, configuration or data.
- [ ] Any omitted runtime/build tests are marked NOT APPLICABLE with the prose-only rationale.

## Level 2 — Application Engineering

Apply Level 1's relevant scope/evidence checks, plus:

- [ ] Focused positive/negative tests and required full regression pass at the stated source.
- [ ] Applicable type/build checks pass; counts, exit codes, warnings and exclusions recorded.
- [ ] Changed behavior and preserved behavior are both accounted for.

## Level 3 — Database / Security / Clinical Authority

Apply relevant Level 2 checks, plus:

- [ ] Disposable target provenance and actual identity verified before writes; no owner/production target assumed.
- [ ] Authority/session/permission denial, transaction atomicity and data preservation proven for affected paths.
- [ ] Concurrency, replay/conflict and failure recovery proved where affected.
- [ ] Required real-environment tests actually ran; mock/DOM/API-injection results are not SQL/browser proof.
- [ ] Browser evidence is separately marked PASS, FAIL, NOT RUN or reasoned NOT APPLICABLE.

## Failure and repetition control

- [ ] Capture exact failure and layer before changing anything; retain original evidence.
- [ ] Apply the smallest justified correction; rerun affected checks and required regression after code changes.
- [ ] No hidden skips, weakened assertions, or unexecuted PASS claims.
- [ ] Successful checks are not repeated without changed source/environment, a concrete risk, incomplete evidence or a required post-integration gate.

## Integration and sync — only when authorized

- [ ] Owner acceptance and exact integration destination authorization recorded.
- [ ] Current source/destination refs checked; integrate with an approved history-preserving operation.
- [ ] Unexpected divergence stops the integration; no forced history replacement.
- [ ] Required post-integration checks pass at integrated HEAD (documentation checks suffice for a prose-only Level 1 change).
- [ ] Authorized remote sync independently verified by exact ref/HEAD and relevant ancestry/tree.
- [ ] Working-tree state, protected refs and concise handoff recorded; no implied main/Golden merge or deployment.

## Record the outcome

Source SHA: [value]. Integrated SHA: [value / PENDING]. Remote SHA: [value / PENDING].
Result: [ENGINEERING READY FOR ACCEPTANCE / ACCEPTED, INTEGRATION PENDING / INTEGRATED DELIVERY COMPLETE / PARTIAL, BLOCKED].
Unexecuted checks/exclusions and reasons: [list]. Active human minutes: [actual / NOT MEASURED]; automated/waiting time: [separate actual / NOT MEASURED].

Do not require the Owner to re-enter known identity data at every step. Use bounded commands with an explicit directory and validated target; never use broad cleanup/reset commands to make a check pass. If disconnected, preserve exact logs/objects and report sync pending rather than repeating successful engineering tests.

ViP case-study reminder only: `src/services/clinic-authority-p37a.test.ts` was the declared historical exclusion. It is not a default exclusion for another product. Termux regression and API-to-PostgreSQL execution do not establish browser proof.

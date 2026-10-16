# RobY Factory Directive Template V1

Template status: DRAFT FOR OWNER REVIEW. An instantiated draft is not execution authorization.
Factory process reference: [Operating Standard V1](ROBY-FACTORY-OPERATING-STANDARD-V1.md).
Replace bracketed fields; unresolved required fields must remain explicit decision gates, not invented values.

## Identity and authority

- Increment / product / repository: [name and exact repository]
- Owner / final authority: MOHAMED.K_ROBY
- Engineering reviewer: [SHAQO or assigned reviewer]
- Implementation engineer: [ASTRA or assigned engineer]
- Directive version/date/timezone: [record actual values]
- Status: [DRAFT / OWNER-AUTHORIZED; attach explicit decision reference]
- Governing Manuscript and contracts: [exact paths/sections and relevant SHAs]
- Later bounded supersession, if any: [old rule, new decision, scope; otherwise NONE]

MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.

## Objective and boundaries

- User-visible or engineering outcome: [one bounded objective]
- Included capabilities / documents: [explicit list]
- Excluded capabilities and reserved clinical/business decisions: [explicit list]
- Prohibited operations and protected paths/refs/data: [explicit list]
- Existing behavior/history to preserve: [invariants]
- Functional acceptance criteria: [observable outcomes and negative cases]

## Baseline and destination

- Expected baseline branch and full SHA: [verify before relying on it]
- Required original ancestry/artifacts: [SHAs, hashes and retrieval source]
- Isolated development branch/context: [name and constraints]
- Intended review PR base: [branch; not permission to merge]
- Intended integration destination: [branch or OWNER DECISION REQUIRED]
- Remote repository identity: [exact destination]
- Commit-identity requirement: [exact objects required / new authored increment permitted]

If history is unavailable, preserve the gap; do not reconstruct a substitute and call it original.

## Explicit permission matrix

Set each action to AUTHORIZED, NOT AUTHORIZED or OWNER DECISION REQUIRED, with scope:

| Action | Decision / scope |
| --- | --- |
| Source or documentation writes | [allowlist or bounded capability] |
| Local tests and disposable test resources | [allowed targets and identity guards] |
| Local commits / feature branch | [allowed branch] |
| Feature publication / draft PR | [repository, head and PR base] |
| Integration | [destination and acceptance prerequisite, or deferred] |
| Integration-branch sync | [destination and exact verification requirements] |
| Protected branches / main / Golden | [default NOT AUTHORIZED] |
| Deployment / clinical or product release | [default NOT AUTHORIZED; separate decision] |

## Autonomous engineering and stop conditions

The engineer may select ordinary technical details, add scoped tests, diagnose and fix errors within the approved contracts without repeated permission requests. Do not expand product meaning, clinical authority or protected infrastructure scope.

Implementation prerequisites: [what truly blocks source work, citing clauses].
Acceptance prerequisites: [required real database/browser/device proof; distinguish from implementation gates].
Stop affected actions for: [unsafe target, unresolved authority/policy, missing required objects, protected writes, failing mandatory proof, divergence or unauthorized effects]. Continue unaffected authorized work and disclose the blocker.

## Risk and proof plan

Risk: [Level 1 / 2 / 3; highest affected level and reason].

| Acceptance claim | Check/command | Source and environment | Operator | Required exit/result | Evidence location |
| --- | --- | --- | --- | --- | --- |
| [claim] | [focused validation] | [exact SHA and safe target] | [engineer/independent] | [expected] | [path/hash when available] |

- Required regression/type/build checks: [commands or reasoned NOT APPLICABLE]
- Real-environment proof: [requirements and guarded disposable provenance]
- Known historical exclusions: [exact test paths and reason; NONE if none]
- Browser proof: [required / pending / not applicable with reason]
- Required post-integration checks: [proportionate commands; not waived by feature tests]
- Failure loop: capture failure → identify layer → smallest justified correction → affected rerun → required regression after code change.
- Evidence reuse: repeat successful checks only for a material reason or a required integration gate.

## Delivery and timing

Required: named source commit/branch, full changed-file list, results/exit codes/exclusions, relevant logs and fingerprints, limitations, independent acceptance instructions, integration/sync record when authorized, draft PR when authorized.

Use the [delivery record](ROBY-FACTORY-DELIVERY-RECORD-TEMPLATE-V1.md). Engineering handoff is distinct from integrated delivery. Default human planning target is 30–55 minutes for a small increment; automated execution and waiting are separate. Actual active time: [record or NOT MEASURED].

Final stop: [review boundary; no implied next increment, merge or release].

## Owner execution decision

Decision: [PENDING / AUTHORIZED / DECLINED]
Owner decision reference and scope: [exact supplied approval]
Integration/release decisions still reserved: [list]

Preparation of this template alone authorizes no repository action.

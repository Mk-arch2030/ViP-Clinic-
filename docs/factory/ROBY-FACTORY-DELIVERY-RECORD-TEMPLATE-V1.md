# RobY Factory Delivery Record Template V1

Template status: DRAFT FOR OWNER REVIEW. Fill observed facts; use PENDING, NOT RUN, BLOCKED or NOT MEASURED instead of invented values.
Process: [Operating Standard V1](ROBY-FACTORY-OPERATING-STANDARD-V1.md).

## Increment and authority

Product/repository: [exact identity]
Increment/directive/Owner authorization: [references]
Engineer / reviewer / independent operator: [names and roles]
Risk level and rationale: [1 / 2 / 3]
Current delivery state: [ENGINEERING READY FOR ACCEPTANCE / ACCEPTED, INTEGRATION PENDING / INTEGRATED DELIVERY COMPLETE / PARTIAL, BLOCKED]
Scope delivered and exclusions: [concise statement]

## Source and evidence

Baseline branch/SHA: [full identity]
Source branch/commit/tree/parents: [full identities]
Changed-file manifest: [complete list or exact artifact]
Protected assets preserved: [scope and evidence]

| Check / acceptance claim | Source SHA | Environment/operator | Command/procedure | Counts and exit code/result | Evidence path/hash | Attribution |
| --- | --- | --- | --- | --- | --- | --- |
| [check] | [SHA] | [target/operator] | [exact command] | [observed result] | [available evidence] | [VERIFIED / OWNER-REPORTED / other] |

Historical test exclusions: [exact paths/reasons or NONE]
Warnings and failed intermediate attempts: [failure, correction, rerun; NONE only if established]
Real database proof: [result and scope / NOT RUN / reasoned NOT APPLICABLE]
Real browser/device proof: [separate result and scope / NOT RUN / reasoned NOT APPLICABLE]
Unresolved limits/decisions: [impact, Owner decision and next boundary]

## Acceptance, integration and synchronization

Owner acceptance reference: [decision / PENDING]
Integration authorization and target branch: [decision/destination / PENDING]
Target SHA before integration: [full SHA]
Integration method and resulting SHA: [observed operation/identity / NOT PERFORMED]
Required post-integration checks and evidence: [commands, counts, exit codes, SHA; reasoned NOT APPLICABLE only per risk]
Remote repository/ref and independently verified SHA: [exact identities / PENDING]
Ancestry/tree comparison: [result and method]
Working-tree status and protected-ref comparison: [observed scope/result]
Feature PR URL / integration record: [links / NOT CREATED]
Merge/release/deployment authority and actual effects: [separate decisions; do not imply permission]

## Effort and final handoff

| Activity | Actual active human minutes | Automated runtime | Waiting | Evidence / NOT MEASURED |
| --- | --- | --- | --- | --- |
| Directive | [actual] | [separate] | [separate] | [source] |
| Delivery review | [actual] | [separate] | [separate] | [source] |
| Targeted acceptance | [actual] | [separate] | [separate] | [source] |
| Integration and sync | [actual] | [separate] | [separate] | [source] |

Planning target for small increments: 30–55 active human minutes, not a guarantee. Do not substitute test runtime for human effort.

Next authorized step / stop boundary: [precise action]
Final verdict and Owner decision still needed: [statement]

INTEGRATED DELIVERY COMPLETE is permitted only when all applicable definition-of-done conditions in the standard are met. Feature publication alone cannot fill the integration or acceptance fields. Preserve this record when later evidence or a corrected version is added.

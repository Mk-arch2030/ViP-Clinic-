# Stage 5-A — Bounded Implementation Decision Package V1

OWNER: MOHAMED.K_ROBY  
STATUS: DESIGN_PACKAGE_PREPARED — NEXT_CODE_SLICE_AWAITING_OWNER_DECISION  
SOURCE_BASELINE: a6e76e93b8324ddf28beda4948a5b3cd1abd3ef7  
DESIGN_AND_DOCUMENTATION_PRESERVATION: AUTHORIZED_IN_CHAT  
NEXT_SLICE_IMPLEMENTATION: NOT_GRANTED  
AUTHENTICATION_RUNTIME: NOT_GRANTED  
SQL_OR_DATABASE_EXECUTION: NOT_GRANTED  
PRODUCTION_GET_AND_DEPLOYMENT: NOT_GRANTED  
CLINICAL_USE: NOT_GRANTED  
DECISION_E_CLEANUP: NOT_AUTHORIZED

## 1. Package scope and review basis

The owner explicitly asked for the design package after Stage 4 preservation
and synchronization. This increment creates only:

- ARCHITECTURE/STAGE-5A-ACTOR-AND-AUTHENTICATION-SOURCE-RECONCILIATION-V1.md
- ARCHITECTURE/STAGE-5A-AUTHENTICATION-AND-AUTHORIZATION-IMPLEMENTATION-DESIGN-V1.md
- ARCHITECTURE/STAGE-5A-BOUNDED-IMPLEMENTATION-DECISION-PACKAGE-V1.md

The review links the historical contracts to current source. Source inspection
and primary technical-reference review were performed; no authentication code,
unit tests, database fixtures or runtime were created/executed for Stage 5-A.
Relative links and the documentation-only write scope are reviewed before Git
preservation. GitHub content writes preserve separate scoped commits; actual
resulting HEAD is verified after writing, not guessed in this document.
Termux synchronization is a subsequent action, not automatic.

The existing protected worktree, historical cluster and Stage 4 fixture are
outside this scope. README is not changed by this package.

## 2. Proposed implementation sequence

| Slice | Proposed deliverable | Proof boundary and grant needed |
| --- | --- | --- |
| 5-B | Actor-wide lifecycle source alignment | Domain representation tests only; no authentication, persistence or Actor administration |
| 5-C | Versioned credential-verifier module | Synthetic password tests and bounded crypto-resource tests; separate runtime-cost benchmark decision |
| 5-D | Actor adapter and session/auth service with test repositories | Synthetic identity/lifecycle/version, issue/expire/revoke/rotate/concurrency behavior; fake stores clearly identified |
| 5-E | Authentication/delegation persistence | Separate SQL design and execution decisions; new independent synthetic database, identity guards and rollback proof |
| 5-F | Secured Fastify test composition and approved endpoint mapping | Separate route/payload/permission decision, CSRF and failure proofs, no listener by default |
| 5-G | Isolated PostgreSQL auth/authorization integration | Real test-database proof including denial and preservation; no historical/Stage 4 fixture mutation |
| Later Web gate | Browser login/session/API integration | Separate UI wiring and transport proof; preserve demo data and frontend workflow boundaries |

These are planning labels, not existing factory decisions or a blanket grant.
Do not implement all slices under a permission for 5-B. Authentication recovery/
real provisioning, multi-process rate-limit persistence and deployment transport
proof remain prerequisites for real use, not hidden completions in a unit slice.

## 3. Concrete next decision: 5-B only

**Decision requested:** permit bounded Actor lifecycle representation alignment
and its domain tests, followed by scoped diff/test review and Git preservation.

Proposed write allowlist:

- domain/actor.js
- domain/actor.test.js (new)

Before implementation, confirm main/HEAD, reread current actor source, inspect
all current Actor constructor call sites/imports and existing tests, and snapshot
protected file bytes/status plus staged changes. If a caller change is required
outside the two-file scope, stop and amend the allowlist through a new owner
decision; do not silently widen scope.

Proposed behavior:

1. Preserve actorIdentityReference, Doctor/Nurse roles and authorityContext.
2. Introduce a frozen shared Actor lifecycle vocabulary if needed.
3. Preserve existing NURSE_LIFECYCLE export compatibility.
4. Nurse lifecycle validation remains required and unchanged in meaning.
5. When lifecycle is explicitly supplied for Doctor, validate ACTIVE/DEACTIVATED
   and preserve the supplied value.
6. Preserve older Doctor construction with omitted lifecycle as unspecified,
   not implicitly ACTIVE; no authentication is granted by either representation.
7. No mutation of existing Actor identity/history, no lifecycle transition method,
   no create/delete/reactivate/deactivate workflow, no ownership transfer.

Legacy Doctor lifecycle omission is allowed only for representation compatibility.
The later server adapter requires an explicit persisted lifecycle before active
participation. Representation acceptance is not successful authentication.

## 4. 5-B acceptance matrix

| Case | Required observation |
| --- | --- |
| Explicit ACTIVE Doctor | Stable identity/role/context preserved; ACTIVE lifecycle represented |
| Explicit DEACTIVATED Doctor | Same identity remains; lifecycle represented; no role/authority transfer |
| ACTIVE and DEACTIVATED Nurse | Existing meaning and required validation preserved |
| Invalid lifecycle for either role | Rejected |
| Omitted Nurse lifecycle | Rejected as before |
| Omitted Doctor lifecycle | Legacy representation preserved without inventing ACTIVE/session state |
| Missing identity or invalid role | Existing rejection preserved |
| Caller object | Constructor does not silently rewrite the caller's supplied data |
| Vocabulary exports | Frozen values; compatibility export available; no new Actor role |
| Side effects | Import/construction opens no pool/server and writes no storage |
| Regression | Scoped domain tests plus applicable active selection pass; results distinguished |
| Preservation | Two-file diff only; protected paths unchanged; no unrelated staging |

Initial verification command once code is authorized:

~~~bash
node --test domain/actor.test.js
~~~

The active regression command is already defined as npm run test:active.
Review its targets and retained isolation before execution. Neither this package
nor the old regression totals establish a new runtime/database proof.

Test counts are not predeclared. A PASS is recorded only after execution.
Any semantic/caller regression blocks preservation until scoped resolution.

## 5. Later design gates that remain explicit

- Confirm the target Node runtime and benchmark proposed password cost; no silent
  weakening or algorithm substitution.
- Approve verifier record grammar/resource limits and password/provisioning policy.
- Define repository transactions, SQL constraints, version checks and concurrent
  session issuance/revocation semantics before database implementation.
- Resolve exact Nurse registration/retrieval capability mapping and payload scope.
- Choose trusted Web/API origins and deployment transport/proxy configuration.
- Define controlled real provisioning/recovery before real enrollment.
- Authorize new synthetic auth database creation/fixtures independently; never
  reuse a historical Doctor or mutate roby_retrieve_proof_c for convenience.
- Review each later slice's exact file allowlist and proof, then preserve it.

## 6. Preserved authority boundaries

Patient/Case/Visit/Clinic Day meanings remain unchanged.
Doctor retains clinical authority, ownership, Case completion and day closure.
Nurse retains only approved delegated operational participation.
Authentication establishes identity; authorization decides permitted operations.
ACTIVE lifecycle does not itself mean logged in, delegated or authorized.

This package does not reopen the protected persistence closure. It does not
grant SQL, login/session runtime, new endpoints, UI role changes, production
GET, network listeners, deployment, clinical use or cleanup E.

## 7. Closure of this design increment

DESIGN_PACKAGE: PREPARED  
SOURCE_RECONCILIATION: RECORDED  
IMPLEMENTATION_DESIGN: PROPOSED_WITH_EXPLICIT_GATES  
NEXT_BOUNDED_DECISION: 5-B_ACTOR_REPRESENTATION_ONLY  
CODE_OR_DATABASE_OPERATIONS: NONE  
RUNTIME_SECURITY_PROOF: NOT_ESTABLISHED

A reviewed/preserved design is not the completion of Stage 5. Stage 5 requires
its authorized implementation slices, isolated integration evidence, and
operation-specific server authorization proof.

## References

- [Source reconciliation](./STAGE-5A-ACTOR-AND-AUTHENTICATION-SOURCE-RECONCILIATION-V1.md)
- [Implementation design](./STAGE-5A-AUTHENTICATION-AND-AUTHORIZATION-IMPLEMENTATION-DESIGN-V1.md)
- [Actor-wide lifecycle decision](./ACTOR-LIFECYCLE-SEMANTICS-AUTHORITY-DECISION-V1.md)
- [Authentication closure proof](./AUTHENTICATION-TECHNICAL-CONTRACT-CLOSURE-PROOF-V1.md)
- [Authorization contract](./AUTHORIZATION-TECHNICAL-CONTRACT-V1.md)
- [Stage 4 milestone](./RETRIEVE-EXISTING-PATIENT-COMPOSITION-POSTGRESQL-PROOF-MILESTONE-V1.md)

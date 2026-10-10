# Stage 5-C–G — Authentication Implementation and Termux Proof Package V1

OWNER: MOHAMED.K_ROBY  
SOURCE_BASELINE: 9d65d452f7022321cf52860f506f0bc26af6f6fc  
OWNER_AUTHORIZATION: CHAT_GRANT_TO_CONTINUE_5C_THROUGH_5G_AND_PREPARE_TERMUX_HANDOFF  
IMPLEMENTATION: PREPARED_AND_UNIT_TESTED  
REAL_POSTGRESQL_AUTH_PROOF: NOT_EXECUTED  
PRODUCTION_DEPLOYMENT_AND_CLINICAL_USE: NOT_GRANTED  
DECISION_E_CLUSTER_CLEANUP: NOT_AUTHORIZED

## Authority and chronology

The owner granted continuation of the proposed independent 5-C through 5-G
steps after 5-B preservation. The owner explicitly requires effective
DEACTIVATED enforcement, failure/concurrency tests and server-derived identity.
This later grant is recorded here; historical NOT_GRANTED declarations in the
Stage 5-A design remain historical, and are not rewritten as blanket authority.

Implementation follows the [Stage 5-A design](./STAGE-5A-AUTHENTICATION-AND-AUTHORIZATION-IMPLEMENTATION-DESIGN-V1.md)
and preserves its [source reconciliation](./STAGE-5A-ACTOR-AND-AUTHENTICATION-SOURCE-RECONCILIATION-V1.md).
It does not authorize real-user enrollment, recovery endpoints, clinical use,
production route enablement, transport deployment or browser wiring.

## Current position and evidence

| Slice | Delivered | Evidence and remaining boundary |
| --- | --- | --- |
| 5-B | Previously preserved Doctor/Nurse lifecycle representation | Existing 14 Actor tests included in the scoped run |
| 5-C | Versioned, strict scrypt verifier; NFC/bounds; one derivation and bounded queue | Real Node scrypt at the proposed cost tested in Work; Infinix cost not measured |
| 5-D | Server identity/session/auth service and closed operation policy | Fake-store denial, lifecycle/version, rotation, expiry, caps and conflicting-request tests |
| 5-E | Separate auth SQL and PostgreSQL transaction repository | SQL orchestration/rollback mocks tested; DDL and repository not yet executed against PostgreSQL |
| 5-F | Separate secured Fastify composition | In-process HTTP injection with fake persistence; no production installation |
| 5-G | Guarded preparation and integration runner | Source/cluster-guard tests passed; real integration remains pending Termux execution |
| Web | Existing Vite/demo UI | No login wiring or browser transport proof in this increment |

Executed in Work (Node v24.19.0, temporary Fastify 5.12.5 / pg 8.23.1 /
tsx 4.21.0 dependency installation outside repository source):

- Scoped selection: 60 tests passed, 0 failed. Includes the existing 14 Actor tests
  plus verifier, fake-store service, Fastify boundary, SQL orchestration and proof guards.
- Existing npm run test:active: 52 passed, 0 failed.
- New authentication/proof modules passed Node syntax checks.

A Work-only attempt to provision PostgreSQL 18 did not reach initdb/server
execution: the environment cannot switch from root to an unprivileged UID.
No SQL/database proof is claimed. No Android process or filesystem was accessed.

## Implementation choices and limitations

Passwords use asynchronous Node crypto.scrypt with N=131072, r=8, p=1,
32-byte output, random 16-byte salt and 256 MiB maxmem. Only the versioned
vip-scrypt-v1 format is accepted; stored parameters cannot select cost.
The process-wide queue permits one derivation and eight waiting jobs, with a
five-second waiting timeout. Passwords use NFC, 15–128 code points and a
1024-byte input ceiling. They are neither trimmed nor case-folded.
No credential from a real person is included. Compromised-password screening,
controlled real provisioning/recovery and Infinix cost acceptance remain gates.

Sessions use random 32-byte opaque identifiers, SHA256 lookup digests, independent
random CSRF material, 15-minute idle and eight-hour absolute limits, and a
three-live-session cap. Login cannot adopt another Actor's cookie. Every request
re-resolves Actor role/lifecycle and credential version. DEACTIVATED denies new
issuance and old-session use; changing credentials invalidates old versions.
An internal repository replacement primitive increments version and revokes
sessions in one transaction; it is not a public reset/provisioning workflow.

The initial PostgreSQL implementation conservatively serializes all auth and
protected business transactions using one transaction-scoped advisory lock.
Actor/credential/policy rows are locked while requests execute. The registration
service uses a SAVEPOINT inside the auth transaction; an outer failure rolls back
both auth updates and business rows. Session issuance rechecks lifecycle/version
after costly verification and before insertion. The advisory lock is shared by
independent repository instances, not merely a JavaScript mutex.

This is a deliberate low-throughput first design. Auth mutations must use the
same repository transaction discipline; ad hoc SQL administration is not a
supported concurrent application path. The configured pool must have bounded
connection acquisition and capacity (the proof uses 5 seconds / six clients).
The repository bounds pending transactions to 64 and installs SQL lock,
statement and idle-transaction timeouts. Multi-instance deployment/performance
and privileged database-role design require later acceptance.

Persistent login counters reserve attempts before crypto: five attempts per
canonical label and twenty per actual peer per anchored 15-minute window,
with at most 5000 live keys. Successful login clears only its label counter.
Counting attempts rather than only completed failures is a conservative
refinement of the design proposal to bound concurrent wrong-password work.
Forwarded headers are not used for source identity. Availability outages return
generic 503; authentication failure 401, authorization/CSRF denial 403,
bounded request errors 400/415/413 and rate limits 429 with Retry-After.

The separate Fastify composition is never installed globally and creates no
pool/listener. It requires an explicit HTTPS trusted origin. Cookies are
__Host-vip_session; Path=/; Secure; HttpOnly; SameSite=Strict; no Domain.
Auth/data responses are no-store. Raw identifiers appear only in Set-Cookie,
not JSON. POST requires the exact Origin and JSON; cross-site metadata is
rejected. Authenticated mutations require current CSRF material. The caller must
keep request/credential/cookie logging redacted when a deployed logger is later
configured. Injection is not browser/TLS/proxy proof.

Doctor permissions are only the named implemented operations. Unknown operations
deny even for Doctor. Nurse FULL/LIMITED is confined to ARRIVAL,
PATIENT_DATA_RECORDING, EXIT and DOCTOR_NOTIFICATION, and current mode/current
Doctor grantor must permit participation. Both patient routes remain denied to
Nurse pending explicit endpoint/category/payload mapping. No frontend-selected
role or identity is read as authority. Patient registration rejects extra fields,
including role, identity, authority and Past History inputs.

## Exact preservation scope

Only these new paths belong to this package:

- backend/auth/errors.js
- backend/auth/password-verifier.js
- backend/auth/password-verifier.test.js
- backend/auth/authorization.js
- backend/auth/auth-service.js
- backend/auth/auth-service.test.js
- backend/auth/test-memory-store.cjs
- backend/auth/test-harness.cjs
- backend/auth/test-service-contract.cjs
- backend/auth/postgres-proof-guards.cjs
- backend/auth/postgres-proof-guards.test.cjs
- backend/auth/postgres-proof.cjs
- backend/persistence/auth-schema.sql
- backend/persistence/auth-repository.js
- backend/persistence/auth-repository.test.js
- backend/api/secured-patient-composition.js
- backend/api/secured-patient-composition.test.js
- ARCHITECTURE/STAGE-5C-G-AUTHENTICATION-IMPLEMENTATION-AND-TERMUX-PROOF-PACKAGE-V1.md

Existing schema.sql, composition/runtime, controllers, domain, package manifests,
frontend, README and historical governance documents are unchanged by this
increment. Test doubles are explicitly named and never selected automatically.
No dependencies or synthetic verifier values are committed.

The four protected Termux files remain excluded. Work has not independently
verified their local bytes/status. The future sync/proof must verify preservation
on the device. No git add ., reset, clean, stash, force update or cluster cleanup.

## Termux sequence after safe synchronization

First verify the exact package HEAD and downloaded source bytes, preserving
protected files, all existing worktree differences and the index. Keep Vite and
the isolated PostgreSQL cluster running. Then execute the scoped selection:

~~~bash
node --test domain/actor.test.js backend/auth/password-verifier.test.js backend/auth/auth-service.test.js backend/auth/postgres-proof-guards.test.cjs backend/persistence/auth-repository.test.js backend/api/secured-patient-composition.test.js
npm run test:active
~~~

Use the full verified resulting commit SHA as EXPECTED_FULL_PACKAGE_HEAD below
(a literal full SHA, not this placeholder). The commands are separate steps:

~~~bash
node backend/auth/postgres-proof.cjs prepare ROBY_STAGE5_AUTH_PREPARE EXPECTED_FULL_PACKAGE_HEAD
node backend/auth/postgres-proof.cjs prove ROBY_STAGE5_AUTH_PROVE EXPECTED_FULL_PACKAGE_HEAD
~~~

Preparation connects only through the already authorized isolated Unix socket,
verifies ready postmaster metadata/PG18/data/socket/port/no TCP identity, and
creates a new roby_auth_proof_stage5 database. It refuses an existing database.
It never connects to roby_retrieve_proof_c or the historical cluster. Its schema
uses the unchanged base SQL plus separate vip_auth storage. Three independent
synthetic Actors and one independent Patient are inserted with explicit IDs.
The original Stage 4 Patient ID/CPN values may coincide, but are separate rows
in a separate database, not reused persistence. No passwords are provisioned
until the proof process creates synthetic verifier material in memory.

The proof validates the committed source and exact marker/system identity and
fresh baseline. It exercises 19 shared auth-service contracts using real scrypt
and SQL; independent repository cap concurrency; atomic credential replacement;
Fastify login/session/denial/GET 200/404/CSRF/deactivation; auth+business rollback;
authorized synthetic POST persistence; logout and cookie reuse denial.
Per-case fixture restoration/truncation is confined to the new database's
synthetic auth tables. It is test setup, not Actor deletion or an exposed product
reactivation operation. No historical Actor is read or copied.

Before the authorized POST, the Patient rows, CPN sequence and compared column
metadata must match baseline through denial/GET testing. The positive POST then
deliberately leaves one additional synthetic patient: final row count two,
sequence last_value=1, is_called=true. This is an expected mutation proof;
the whole run is not claimed mutation-free. Auth/session records are synthetic
and intentionally changed by these tests. The original Stage 4 database remains
outside all queries. No exhaustive schema-object preservation claim is made.

Preparation/proof snapshot all four protected file bytes, status, tracked diff,
index and HEAD, and require them unchanged. No HTTP listener starts. No database
drop, cluster stop or cleanup runs. A completed or partial proof cannot be
silently rerun/reset: it leaves evidence for review and requires a deliberate
bounded recovery/re-proof decision if the fresh-baseline checks reject it.
Any failure means proof is not established; do not report PASS from a partial log.

Stage 5-G closes only after actual successful Termux execution evidence and
subsequent review/preservation. No current document labels it complete.
The following Web gate then needs explicit same-origin transport, browser
session/CSRF wiring and preservation of existing demo/workflow data.

## Termux execution report and bounded correction

At c87db12194252db9724ee2b45967a2ccaba9a86a, owner-provided output confirms
safe synchronization, protected-worktree preservation, 60/60 scoped tests and
52/52 active regression tests. Both preparation and proof commands failed;
their generic error messages did not establish which stage had failed.
A subsequent read-only diagnostic reported ECONNREFUSED before any SQL result.
A process/socket inspection then reported recorded PID 26713 absent, a remaining
Unix socket and matching lock file, and EACCES reading the kernel socket table.
Thus the recorded ready metadata is stale with respect to process liveness.
The cause of process termination and auth-database existence remain unknown.
No SQL creation/proof, protected-file mutation, historical-cluster operation or
cleanup is claimed from these failed commands.

Independent source review also found that the runner configures
search_path=pg_catalog,public while the previous guard required the exact string
pg_catalog, public. A bounded correction compares the same two ordered entries
after whitespace trimming; extra/reordered/malformed entries still reject.
Regression tests use the runner's actual connection options. This inconsistency
was reproduced in Work but was not the reached cause of ECONNREFUSED on Termux.
The runner now reports a fixed execution-phase label and sanitized error code,
without printing passwords, verifier material or full database diagnostics.

Continuation remains within the owner's 5-G execution grant: establish the
existing isolated cluster's control identity, start that stopped isolated cluster
only, verify Unix-only identity using a read-only session, and inspect whether
auth preparation left state. Do not use restart/stop, manually remove locks,
drop/reset databases, recreate the cluster or blindly repeat preparation.
PostgreSQL-managed startup/crash recovery changes its own runtime files; this
does not authorize Decision E removal of the cluster. Stage 4 records are not
queried or altered by the auth continuation; historical storage remains excluded.

## Empty-database preparation correction and bounded continuation

Owner-provided Termux evidence subsequently establishes successful startup of
the existing isolated cluster, system identifier 7694773229923891271, and then
preparation failure at NEW_AUTH_SCHEMA_AND_SYNTHETIC_FIXTURE with SQLSTATE 42501.
The read-only diagnostic confirms the auth database exists, is owned by the
current user, permits CREATE on public, targets pg_catalog for unqualified DDL,
has no vip_auth schema and has zero scoped relations. Protected files, index and
HEAD remain unchanged. The historical cluster and Stage 4 database were excluded.

The unchanged base schema uses unqualified CREATE SEQUENCE / CREATE TABLE.
The runner's explicit pg_catalog-first search path therefore targets the system
schema during initialization. This is a proof-runner defect, not a reason to
grant extra privileges or modify the historical/base schema.

Initialization now uses SET LOCAL search_path = public only for the base DDL;
PostgreSQL still implicitly searches pg_catalog first for name resolution.
The runner then restores pg_catalog, public before the separate auth DDL and
synthetic fixtures. All schema/fixture work remains one transaction with rollback
on failure. Runtime identity/search-path guards remain unchanged.

A separate resume-empty mode requires ROBY_STAGE5_AUTH_RESUME_EMPTY and the full
new package HEAD, the diagnosed isolated system identifier and the existing
auth database. Inside the transaction it requires current ownership/public
creation privilege, no vip_auth schema, no public relations/functions/types,
no other user schemas and no extensions other than plpgsql. Any mismatch rejects
before DDL; no existing object is dropped, truncated, reset or overwritten.
This is bounded continuation of the owner's granted synthetic 5-G preparation,
not a general recovery command. Fresh prepare still refuses an existing database.
The new manifest records the new package HEAD, not the previous failed HEAD.

After scoped synchronization and tests, execute resume-empty once, then prove
only after NEW_AUTH_DATABASE_PREPARED=PASS. Failure requires further inspection.
The diagnostic alone does not establish runtime proof. No cleanup, production,
clinical, historical-storage or frontend authority is added.

~~~bash
node backend/auth/postgres-proof.cjs resume-empty ROBY_STAGE5_AUTH_RESUME_EMPTY EXPECTED_FULL_PACKAGE_HEAD
node backend/auth/postgres-proof.cjs prove ROBY_STAGE5_AUTH_PROVE EXPECTED_FULL_PACKAGE_HEAD
~~~

Work validation for this correction: the scoped Actor/auth selection passes
65 tests with 0 failures; this includes empty-state rejection, transaction-local
DDL placement, manifest binding and rollback-before-DDL/after-failure tests.
The checks use fake SQL clients; real PostgreSQL continuation remains pending
the owner's Termux execution. The four-file correction excludes base SQL,
application/runtime/frontend code and all protected files.

## Primary engineering references

- [Node crypto](https://nodejs.org/docs/latest-v24.x/api/crypto.html): scrypt/randomBytes/timingSafeEqual.
- [OWASP sessions](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html): server session/transport lifecycle.
- [Fastify hooks](https://fastify.dev/docs/latest/Reference/Hooks/): encapsulated request boundary.

These inform engineering; none grants production or clinical authority.

## Post-implementation isolated proof closure

The owner subsequently supplied successful Termux execution at
c59fe2b48d2b2adb882a95dcf05bdb8fd8e0c59c: scoped synchronization and downloaded
bytes verified, 10/10 guard tests, guarded resume-empty preparation, all 19
real PostgreSQL service cases and all additional integration checks passed.
The final marker is REAL_POSTGRESQL_AUTH_PROOF=PASS_FOR_TESTED_ISOLATED_PATHS.
Protected bytes/status/index/HEAD were reported unchanged; no network listener,
cluster cleanup, production deployment or clinical use was authorized or run.

See the [Stage 5-G Milestone](./STAGE-5G-ISOLATED-POSTGRESQL-AUTHENTICATION-PROOF-MILESTONE-V1.md)
for provenance, exact result markers, intended synthetic POST mutation,
preservation limits and the next Stage 6 Web gate. Earlier NOT_EXECUTED/pending
statements above retain their original pre-execution chronology; this later
closure records the new evidence, not a blanket grant or an independent Work
rerun. The retained database must not be silently reset or rerun.

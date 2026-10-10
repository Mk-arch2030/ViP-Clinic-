# Stage 5-G — Isolated PostgreSQL Authentication Proof Milestone V1

OWNER: MOHAMED.K_ROBY  
STATUS: BOUNDED_AUTH_RUNTIME_PROOF_PASSED  
EVIDENCE_DATE: 2026-10-10 (Africa/Cairo)  
TESTED_SOURCE_HEAD: c59fe2b48d2b2adb882a95dcf05bdb8fd8e0c59c  
EVIDENCE_SOURCE: OWNER_PROVIDED_TERMUX_OUTPUT  
PRODUCTION_DEPLOYMENT_AND_CLINICAL_USE: NOT_GRANTED  
BROWSER_AUTH_INTEGRATION: NOT_ESTABLISHED  
DECISION_E_CLUSTER_CLEANUP: NOT_AUTHORIZED

## Authority and evidence provenance

The owner granted the independent Stage 5-B through 5-G implementation and
Termux proof steps, requiring effective DEACTIVATED enforcement, denial and
concurrency coverage, and identity/authority resolved by the server. Later
bounded grants do not rewrite historical draft NOT_GRANTED declarations or
authorize future production, clinical, browser integration or cleanup work.

The owner supplied successful synchronization, guard tests, resume-empty
preparation and real proof output at the tested source HEAD above. Work reviewed
the reported results against the committed runner and shared service contracts.
Work did not independently access Android processes/files or rerun this real
PostgreSQL proof. This documentation commit records the execution; it is not a
new runtime execution and must not replace the tested source HEAD in a manifest.

See the [implementation and continuation record](./STAGE-5C-G-AUTHENTICATION-IMPLEMENTATION-AND-TERMUX-PROOF-PACKAGE-V1.md).
The earlier [Stage 4 composition proof](./RETRIEVE-EXISTING-PATIENT-COMPOSITION-POSTGRESQL-PROOF-MILESTONE-V1.md)
remains a separate proof with its own tested HEAD and database.

## Isolation and preparation chronology

The existing independent PostgreSQL 18 cluster uses:
- Data: $HOME/vip-retrieve-proof-isolated/data
- Unix socket: $HOME/vip-retrieve-proof-isolated/socket
- Port: 55439; TCP listening disabled
- Diagnosed system identifier: 7694773229923891271
- Independent Stage 5 database: roby_auth_proof_stage5

Initial connection diagnostics reported ECONNREFUSED and recorded PID 26713
absent. The owner later started only the existing isolated cluster and reported
successful control/SQL identity verification, PID 6301 and auth database absent.
No cause of the prior process termination is established.

Preparation created the auth database but failed during schema/fixture work with
SQLSTATE 42501. A read-only diagnostic confirmed current ownership, public CREATE
privilege, unqualified DDL targeting pg_catalog, no vip_auth schema and zero
public/vip_auth scoped relations. The base SQL uses unqualified DDL; the runner
was corrected to target public only during base initialization, then restore its
normal pg_catalog, public path. The historical/base SQL was not modified.

At c59fe2b, guarded resume-empty accepted only the existing owned synthetic
database with the diagnosed cluster identity, no auth schema, no public relations,
functions or types, no other user schemas and no unexpected extensions.
The owner reported NEW_AUTH_DATABASE_PREPARED=PASS and
EXISTING_EMPTY_AUTH_DATABASE_INITIALIZED=PASS. This continued preparation in one
transaction without database drop/reset, extra privilege grants or cluster cleanup.

The independent fixture has three synthetic Actors (active Doctor, active Nurse,
deactivated Doctor) and one baseline synthetic Patient:
55555555-5555-4555-8555-555555555555, CPN-9001, DOB 1990-02-01.
Its initial CPN sequence state is last_value=1, is_called=false.
Coinciding synthetic values are separate rows in the Stage 5 database; they are
not browser demo, historical or Stage 4 persistence. Password verifier/session
material is synthetic proof data, not real-user enrollment.

## Reported execution results

Synchronization reported:
- SCOPED_PACKAGE_DIFF=VERIFIED
- SYNC=FAST_FORWARD_COMPLETE
- LOCAL_HEAD and VERIFIED_REMOTE_PACKAGE_HEAD equal the tested source HEAD
- DOWNLOADED_FILES=BYTE_VERIFIED
- PROTECTED_BYTES_AND_STATUS=UNCHANGED
- EXISTING_WORKTREE_DIFF_STATUS_AND_UNTRACKED_BYTES=UNCHANGED
- STAGED_CHANGES=NONE

The owner then reported 10/10 proof-guard tests, 0 failures.
Work's earlier correction selection passed 65/65 Actor/auth tests with fake
persistence and actual Node scrypt. Prior active regression evidence was 52/52;
it was not rerun as part of this milestone documentation.

The real proof reported:
- DATABASE_IDENTITY_AND_FRESH_BASELINE=PASS
- REAL_PG_AUTH_CASE_01 through REAL_PG_AUTH_CASE_19=PASS
- INDEPENDENT_REPOSITORY_CONCURRENT_SESSION_CAP=PASS
- ATOMIC_CREDENTIAL_REPLACEMENT_AND_SESSION_REVOCATION=PASS
- DENIAL_AND_GET_PATIENT_SEQUENCE_SCHEMA_PRESERVATION=PASS
- REAL_PG_FASTIFY_IDENTITY_CSRF_DEACTIVATION_AND_200_404=PASS
- AUTH_AND_BUSINESS_TRANSACTION_ROLLBACK=PASS
- AUTHORIZED_DOCTOR_POST_PERSISTENCE=PASS
- EXPECTED_POST_EFFECT=ONE_NEW_SYNTHETIC_PATIENT_AND_ONE_CPN_ALLOCATION
- LOGOUT_REUSE_DENIAL=PASS
- NETWORK_LISTENER=NOT_STARTED
- PROTECTED_BYTES_STATUS_INDEX_AND_HEAD=UNCHANGED
- CLUSTER_STOP_DROP_AND_CLEANUP=NOT_EXECUTED
- PRODUCTION_DEPLOYMENT_AND_CLINICAL_USE=NOT_GRANTED
- REAL_POSTGRESQL_AUTH_PROOF=PASS_FOR_TESTED_ISOLATED_PATHS

The 19 cases cover generic wrong/unknown/disabled login denial; invalid sessions;
persisted server identity; Doctor/Nurse deactivation; idle and absolute expiry;
CSRF/logout; rotation and another Actor's prior cookie; credential version and
disablement; closed Nurse capability/mode and current role policy; concurrent
session issuance, logout/protected work and deactivation/protected work;
transaction failure rollback; attempt reservation; and missing lifecycle/role
fail-closed behavior. Their names and ordering remain in the committed
backend/auth/test-service-contract.cjs; this record does not expand their coverage.

## Mutation and preservation boundaries

Denial/GET testing preserved compared Patient rows, CPN sequence state and
column metadata. The successful Doctor POST deliberately persists one additional
synthetic Patient and one CPN allocation. The runner checks final Patient count
two and sequence last_value=1, is_called=true before printing PASS. The entire
run is therefore not mutation-free. Synthetic auth/session state also changes.

Schema preservation refers to the compared column metadata, not an exhaustive
schema-object comparison. Historical storage and the Stage 4 database are
excluded from the runner's connections; no independent post-run inspection of
those protected databases is claimed.

The owner-reported unchanged protected paths are:
- src/index.css
- ARCHITECTURE/DESIGN/VISUAL-THEME-IMPLEMENTATION-AUTHORIZATION-REVIEW-V1.md
- backend/api/routes/register-new-patient-route.js
- src/components/PatientIntake.tsx.pre-light-migration

This documentation package changes only this milestone, the implementation
record and README status/roadmap. No code, schema, protected file, database,
Vite process or runtime listener is changed by documentation preservation.

## Closure and next gate

Stage 5-G has passed the tested isolated PostgreSQL/auth/Fastify injection paths.
Stage 5 backend foundation and its bounded proof are recorded. This does not
establish production GET enablement, network HTTP/TLS/browser cookie behavior,
frontend authentication wiring, real-user provisioning/recovery, production
database roles, deployment, clinical readiness or exhaustive security assurance.

The next Stage 6 gate is a bounded Web authentication/session/CSRF and Patient
UI/API adapter decision, preserving the existing browser demo/workflow state and
proving the authorized browser-to-server-to-isolated-database journey. The
frontend's Doctor/Nurse selection must not become server identity or authority.

The proof database now contains retained evidence. Do not silently rerun the
fresh-baseline proof, reset fixtures or repeat resume-empty. Any further re-proof
or evidence recovery needs its applicable bounded decision. The isolated cluster
remains protected from stop/drop/removal; Decision E cleanup is not authorized.

**Manuscript is authority. Contracts authorize. Proof validates. Git preserves.
MOHAMED.K_ROBY decides.**

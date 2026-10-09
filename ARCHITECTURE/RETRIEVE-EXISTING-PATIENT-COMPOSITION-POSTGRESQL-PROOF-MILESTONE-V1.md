# Stage 4 — Isolated Real-PostgreSQL Patient Composition Proof Milestone V1

OWNER: MOHAMED.K_ROBY  
STATUS: BOUNDED_RUNTIME_PROOF_PASSED  
ROADMAP_STAGE: 4  
TESTED_COMMIT: 9d207d4a1a0fbffd0bc38035279a7ae3f3b43925  
EVIDENCE_RECEIVED_DATE: 2026-10-10 (Africa/Cairo)  
EVIDENCE_SOURCE: OWNER_REPORTED_TERMUX_EXECUTION_OUTPUT  
WORK_REAL_DATABASE_REEXECUTION: NOT_PERFORMED  
PRODUCTION_GET_ENABLEMENT: NOT_GRANTED  
DEPLOYMENT: NOT_GRANTED  
CLINICAL_USE: NOT_GRANTED  
DECISION_E_CLEANUP: NOT_AUTHORIZED

## Owner authorization and sequence

The owner authorized preparing the Stage 4 package on GitHub, then downloading
it to the Infinix/Termux environment for review and real testing.

The owner reported a scoped fast-forward from 2e15e88 to the tested commit,
downloaded-byte verification, preserved protected local files and existing
worktree differences, and no staged changes.

The owner subsequently reported 12/12 package guard tests and 52/52 active
regression tests passing with zero failures. These are separate test runs, not
a combined suite and not replacements for real PostgreSQL proof.

After a specific request to authorize GET 200/404 and compared state preservation
on roby_retrieve_proof_c only, without invoking POST, changing data/schema, or
stopping the cluster, the owner explicitly replied:
“مصرح لك يا شقو ❤️ طير انت”.

The owner then executed the committed proof runner in Termux with the explicit
isolated execution token and expected HEAD, and returned the output below.
After the proposed milestone/README/package documentation preservation step,
the owner instructed proceeding to the next step. This preservation scope is
documentation only; it does not authorize another runtime increment.

## Tested path and environment

Fastify in-process injection → composePatientRegistration with
enableRetrieveExistingPatient=true → existing retrieval controller →
application service → PatientRepository → guarded caller-owned pool →
isolated PostgreSQL 18.

The composition registers POST /patients and GET /patients/:patientId.
POST is present but was not invoked. No HTTP network listener was started.
Default GET remains off in the ordinary runtime.

Isolated root: $HOME/vip-retrieve-proof-isolated  
Data directory: $HOME/vip-retrieve-proof-isolated/data  
Unix socket directory: $HOME/vip-retrieve-proof-isolated/socket  
Port: 55439  
TCP listening: disabled  
Database: roby_retrieve_proof_c

Fixture: exactly one independent synthetic patient, technical ID
55555555-5555-4555-8555-555555555555, CPN-9001, DOB 1990-02-01.
The sequence baseline is last_value=1, is_called=false. The missing scenario
uses 77777777-7777-4777-8777-777777777777.

Preflight checks include canonical paths, PID/process/socket identity, local
pg_controldata system identifier, matching database identity, read-only session,
source hashes, committed runner bytes, branch/HEAD, and empty staged changes.

## Execution output supplied by the owner

```text
SOURCE_AND_CLUSTER_PREFLIGHT=PASS
DATABASE_IDENTITY=PASS
BASELINE=VERIFIED
POST_ROUTE_PRESENT_NOT_INVOKED=VERIFIED
HTTP_FOUND_200=PASS
HTTP_MISSING_404=PASS
POST_GET_COMPARED_DATA_SEQUENCE_AND_SCHEMA_PRESERVATION=PASS
NETWORK_LISTENER=NOT_STARTED
PROTECTED_BYTES_AND_STATUS=UNCHANGED
INDEX=UNCHANGED
HEAD=UNCHANGED
REAL_POSTGRESQL_COMPOSITION_PROOF=PASS_FOR_TESTED_ISOLATED_PATHS
PRODUCTION_GET_ENABLEMENT=NOT_GRANTED
CLINICAL_AUTHORITY=NOT_GRANTED
DECISION_E_CLEANUP=NOT_AUTHORIZED
STAGE4_PROOF_COMMAND_EXIT=0
```

The found response passed comparison with the persisted synthetic patient's
fields and derived age. The missing response passed the expected HTTP 404 and
error-body assertion. The runner required exactly the two approved repository
retrieval queries. Final success follows application/pool closure and local
preservation comparisons.

## Compared state and limits

Before/after comparisons cover:

- Persisted columns of all rows in public.patients.
- last_value and is_called of public.clinic_patient_number_seq.
- Public relation column definitions/defaults, constraints, index definitions,
  and sequence configuration.
- Protected local file bytes/status, staged differences/index entries, and HEAD.

This does not establish unchanged contents of Clinic Day/Actor rows, functions,
privileges, or every other database object. It is not a global mutation-freedom
claim. The read-only pool/query guards are test-harness constraints, not deployed
authorization controls.

The evidence proves only the tested isolated nonproduction composition paths.
It does not prove production GET enablement, network-facing HTTP, UI-to-database
integration, login/session implementation, server role enforcement, deployment,
or clinical readiness.

The protected historical cluster was not connected to or independently
reinspected in Work. No new proof is claimed about its live state.
The isolated cluster was not stopped or deleted; Decision E is still excluded.

## Runner identity

Proof runner:
[retrieve-existing-patient-composition-postgres-proof.cjs](../backend/api/retrieve-existing-patient-composition-postgres-proof.cjs)

SHA256 at the tested commit:
428f906f14d5b21f47e568a72e10c9486d6f1c0e82f153538383c269378d9edf

Guard tests:
[retrieve-existing-patient-composition-postgres-proof-guards.test.cjs](../backend/api/retrieve-existing-patient-composition-postgres-proof-guards.test.cjs)

SHA256 at the tested commit:
e2be0d1cebdf7a4fac0461103e6f54f954a30819a5cdf5e8acc70627b0ef6458

Source identity is pinned to the tested commit. Later documentation commits
do not imply the runner was executed at those later HEADs.

## Documentation preservation scope

Only three documentation paths belong to this preservation increment:

- README.md
- ARCHITECTURE/RETRIEVE-EXISTING-PATIENT-COMPOSITION-POSTGRESQL-PROOF-PACKAGE-V1.md
- ARCHITECTURE/RETRIEVE-EXISTING-PATIENT-COMPOSITION-POSTGRESQL-PROOF-MILESTONE-V1.md

No implementation, harness, schema, fixture, package script, frontend, protected
dirty file, or database operation belongs to this increment.
GitHub preservation does not automatically update the owner's local HEAD.

## Reconciliation and next gate

The original GET-only milestone remains historical proof for its original
composition. This milestone closes the separate current opt-in composition
proof gap for the compared state and tested paths.

The package's original preparation-time pending declarations retain historical
meaning; its current header and appended execution reconciliation point here.
No successful result was assumed before the owner's actual execution output.

Stage 4's bounded runtime acceptance is satisfied by the reviewed owner evidence.
The next roadmap gate is Stage 5 authentication/server authorization contract and
current-source review, followed by a separately bounded implementation decision.
No Stage 5 implementation authority is issued by this milestone.

See [Stage 4 Package](./RETRIEVE-EXISTING-PATIENT-COMPOSITION-POSTGRESQL-PROOF-PACKAGE-V1.md)
and [README](../README.md).

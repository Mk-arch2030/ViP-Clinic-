# Stage 4 — Bounded Real-PostgreSQL Patient Composition Proof V1

OWNER: MOHAMED.K_ROBY  
STATUS: PACKAGE_PREPARED — TERMUX_RUNTIME_PROOF_PENDING  
SOURCE_BASELINE: 5aff19634533d08b4d8db0d4652cb57ddbfa0b23  
CURRENT_COMPOSITION_IMPLEMENTATION_COMMIT: 2e15e88dc15f6a927a13ce4dd87c2c44455be4c5  
PACKAGE_PREPARATION_AND_SCOPED_GITHUB_PRESERVATION: OWNER_AUTHORIZED_IN_CHAT  
REAL_POSTGRESQL_COMPOSITION_PROOF: NOT_EXECUTED  
PRODUCTION_GET_ENABLEMENT: NOT_GRANTED  
DEPLOYMENT: NOT_GRANTED  
CLINICAL_USE: NOT_GRANTED  
DECISION_E_CLEANUP: NOT_AUTHORIZED

## Purpose and owner decision

After the README and roadmap review, the owner approved preparing bounded work on
GitHub and then transferring it to Infinix/Termux for review and real execution.
The owner instructed preparation to begin.

This package implements Stage 4 preparation only. It does not close Stage 4 or
extend the earlier Decisions A–D. Real database execution remains a separate,
specific owner decision after the downloaded package and local state are reviewed.
The execution token below is an operator acknowledgement, not a technical source
of authority; do not set it before that decision.

## Why another proof is needed

The earlier milestone proved the retrieval stack in a GET-only Fastify harness
against an isolated PostgreSQL database. The current production-source composition
has POST plus an explicit optional GET, with GET off by default.

This runner uses the current composePatientRegistration function with a
caller-owned, guarded PostgreSQL pool and enableRetrieveExistingPatient=true.
It retains the actual controller, service and PatientRepository retrieval path.

POST must be registered but is never injected. The older POST_ROUTE_ABSENT
criterion is not applicable to this composition.

No production-source file, package script, default runtime option, schema,
fixture, frontend, or existing governance record is changed.

## Preservation allowlist

Only these new files belong to this package:

- backend/api/retrieve-existing-patient-composition-postgres-proof.cjs
- backend/api/retrieve-existing-patient-composition-postgres-proof-guards.test.cjs
- ARCHITECTURE/RETRIEVE-EXISTING-PATIENT-COMPOSITION-POSTGRESQL-PROOF-PACKAGE-V1.md

The package is preserved through scoped documentation/test commits on GitHub.
Remote changes do not synchronize the owner's Termux checkout automatically.
Before executing, verify the exact final package commit and that its changes
since the known local baseline consist only of the README and this allowlist.
Use a reviewed fast-forward update; no reset, clean, broad staging, or replacement
of the local worktree is part of this package.

## Isolation and fail-closed behavior

The runner is inert on import. It checks explicit execution acknowledgement and a
full expected HEAD before loading pg or Fastify.

Before any database connection it requires:

1. The checkout is main and HEAD matches the independently verified package commit.
2. Relevant package scope and composition/controller/service/repository/domain/
   configuration files match embedded SHA256 hashes from the source baseline.
3. The runner bytes match its committed version. The index is empty.
4. The test directories resolve exactly to the canonical home directory's
   vip-retrieve-proof-isolated/data and socket paths, without redirecting symlinks.
5. postmaster.pid names those exact paths, port 55439, and a ready process.
6. A signal-zero check and /proc/<pid>/cmdline inspection identify the running
   process with -D pointing at the isolated data directory.
7. The isolated Unix socket exists and is not redirected.
8. pg_controldata for that isolated directory yields a system identifier.
9. The PID file stays unchanged during preflight.

No TCP fallback, DATABASE_URL, PGHOST, PGPORT or PGDATABASE target selection is
used. The PostgreSQL role is the current operating-system username, matching the
usual Termux local cluster setup; an authentication failure blocks execution.
The package does not create or alter a database role to work around failure.

After connecting to the verified isolated Unix socket, the runner checks the
database name, data_directory, port, socket directory, disabled TCP listener,
PostgreSQL major version 18, system identifier, postmaster start time, read-only
session setting, and search_path=public.

The protected historical cluster is not an alternative target. No connection to
$PREFIX/var/lib/postgresql is allowed, including an inspection connection.

If Android disallows /proc inspection, pg_controldata is unavailable, permissions
differ, a directory/socket redirects, or identity/baseline differs: STOP.
Do not remove a guard or substitute another database in order to obtain a PASS.
Return the error for bounded review.

## Test fixture and comparisons

Database: roby_retrieve_proof_c  
Found patient: 55555555-5555-4555-8555-555555555555  
Missing patient: 77777777-7777-4777-8777-777777777777  
CPN: CPN-9001  
DOB: 1990-02-01  
Baseline patients: exactly one synthetic row  
Baseline CPN sequence: last_value=1, is_called=false

No fixture creation, repair or schema application occurs. Baseline drift blocks
the proof and needs a separate owner decision.

Compared before/after state includes:

- All persisted columns of every row in public.patients, sorted by identity.
- last_value and is_called of public.clinic_patient_number_seq.
- Public relation column definitions/defaults, constraints, index definitions,
  and sequence configuration.

This is a specified comparison set, not a proof that every object or every row
in the database was unchanged. Clinic Day/Actor row contents, functions,
privileges and all other database state are outside that comparison claim.
No other process should be using the isolated proof fixture during execution.

The pool session has default_transaction_read_only=on and a statement timeout.
The application-facing pool wrapper accepts only the existing repository's exact
normalized SELECT with one of the two synthetic identities. It rejects
connect/end calls; repository patient creation and CPN allocation are disabled
in this test instance. These are harness guards, not production authorization.

## Acceptance outputs

A successful run must finish with all of the following evidence:

- SOURCE_AND_CLUSTER_PREFLIGHT=PASS
- DATABASE_IDENTITY=PASS
- BASELINE=VERIFIED
- POST_ROUTE_PRESENT_NOT_INVOKED=VERIFIED
- HTTP_FOUND_200=PASS
- HTTP_MISSING_404=PASS
- POST_GET_COMPARED_DATA_SEQUENCE_AND_SCHEMA_PRESERVATION=PASS
- NETWORK_LISTENER=NOT_STARTED
- PROTECTED_BYTES_AND_STATUS=UNCHANGED
- INDEX=UNCHANGED
- HEAD=UNCHANGED
- REAL_POSTGRESQL_COMPOSITION_PROOF=PASS_FOR_TESTED_ISOLATED_PATHS

The found response must match all persisted patient fields and derive age from
DOB. The missing response must be 404 with the existing controller error body.
The repository must issue exactly the two expected retrieval queries.

The final proof line is printed only after successful application/pool resource
closure and worktree preservation comparison. Earlier partial PASS lines do
not close the phase if the process later fails or exits nonzero.

## Local file and resource protection

The runner compares hashes and Git status for the four protected paths, plus
staged differences/index entries and HEAD, before and after the run:

- src/index.css
- ARCHITECTURE/DESIGN/VISUAL-THEME-IMPLEMENTATION-AUTHORIZATION-REVIEW-V1.md
- backend/api/routes/register-new-patient-route.js
- src/components/PatientIntake.tsx.pre-light-migration

It never creates missing protected files or changes the index/HEAD.
It closes only its caller-owned pool and Fastify application; it does not stop
or delete the PostgreSQL cluster. Decision E remains unauthorized.

Vite stays outside this scope. Fastify injection opens no network listener and
does not need or reuse the frontend's port 3000.

## Recorded Work verification

On Node.js v24.19.0:

- Runner syntax check: passed.
- Guard unit tests: 12/12 passed, zero failures.
- Relative module paths and imported source dependency boundaries reviewed.
- Scope: three new test/documentation files only.

These tests use synthetic metadata and test the guards. They do not load
PostgreSQL/Fastify, perform HTTP injection, inspect Android processes, or
establish real-database proof. The existing 17/17 and 52/52 Termux results
remain earlier evidence; they were not rerun in Work for this package.

## Termux commands after review

First, run the database-free checks from the synchronized repository root:

~~~bash
node --check backend/api/retrieve-existing-patient-composition-postgres-proof.cjs
node --test backend/api/retrieve-existing-patient-composition-postgres-proof-guards.test.cjs
~~~

Only after the specific isolated execution decision, use:

~~~bash
VIP_STAGE4_EXECUTION=AUTHORIZED_ISOLATED_GET_ONLY node backend/api/retrieve-existing-patient-composition-postgres-proof.cjs --expected-head <VERIFIED_FULL_PACKAGE_COMMIT>
~~~

Replace the placeholder with the full package commit independently verified on
GitHub and in the local checkout. Do not use this as an instruction to bypass
the review or rerun historical database tests.

Keep the entire output and process exit status. If successful, review it before
recording a new Stage 4 milestone. Saving an execution log, adding that milestone,
or changing README status needs its own reviewed preservation scope. This
package does not prewrite a successful result.

## References

- [Current README](../README.md)
- [Current Composition](../backend/api/patient-registration-composition.js)
- [Current Retrieval Repository](../backend/persistence/patient-repository.js)
- [Earlier GET-only Milestone](./RETRIEVE-EXISTING-PATIENT-ISOLATED-POSTGRESQL-GET-RUNTIME-PROOF-MILESTONE-V1.md)
- [Historical Proof Plan](./RETRIEVE-EXISTING-PATIENT-ISOLATED-RUNTIME-PROOF-EXECUTION-PLAN-V1.md)
- [Protected Persistence Reconciliation](./PERSISTENCE-LIVE-DATABASE-CLOSURE-RECONCILIATION-V1.md)

Stage 4 closes only on reviewed real execution evidence for the specified paths.
Production GET, deployment, clinical use, and cluster cleanup remain separate.

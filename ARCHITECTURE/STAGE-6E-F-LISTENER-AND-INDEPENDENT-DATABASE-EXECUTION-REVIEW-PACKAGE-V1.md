# Stage 6-E/F — Listener and Independent Database Execution Review Package V1

OWNER: MOHAMED.K_ROBY  
REVIEW_DATE: 2026-10-10 (Africa/Cairo)  
REVIEWED_MAIN_HEAD: 4b2bb8783d336ec81a3756a213b4e87f1263291e  
PREVIOUS_IMPLEMENTATION_TEST_HEAD: 9a6905494054be36bd4c7620c87d6124c2368f18  
STATUS: DECISION_A_IMPLEMENTED_AND_WORK_VALIDATED_DEVICE_EXECUTION_PENDING  
CURRENT_AUTHORITY: OWNER_APPROVED_DECISION_A_SOURCE_TOOLS_TESTS_SCOPED_GIT_AND_SYNC  
IMPLEMENTATION_OF_THIS_PACKAGE: DECISION_A_COMPLETED_FOR_RECORDED_WORK_CHECKS  
DEVICE_BUILD_DATABASE_LISTENER_AND_BROWSER_EXECUTION: NOT_AUTHORIZED_BY_THIS_PACKAGE  
PRODUCTION_DEPLOYMENT_AND_CLINICAL_USE: NOT_GRANTED  
DECISION_E_CLUSTER_CLEANUP: NOT_AUTHORIZED

## 1. Authority and product continuity

This draft follows the owner's request at 17:52 Africa/Cairo to prepare the
loopback Listener and independent Stage 6 database package for review before
execution authorization. It does not silently extend the CA-installation grant.
The owner subsequently approved Decision A at 17:59 Africa/Cairo: implement the
exact source/tool allowlist, validate in Work, preserve it in Git and prepare safe
Termux sync. This later grant does not authorize executing device modes.

Read with the existing Stage 6-A design/decision/source reconciliation, 6-B–D
implementation record, Stage 5-G milestone and the Stage 6-E Android CA trust
authorization at reviewed main. Those historical records are preserved.
Manuscript section 14 permits learning from Shipping Hub without inheriting its
schema, auth contracts or transport. The clinic keeps its own same-origin HTTPS,
server identity, Secure/HttpOnly/Strict cookie and CSRF design.

Current source supports only a basic Patient adapter: no Case/Visit/day creation,
Past History/clinical dossier migration, CPN lookup/list API or new Nurse power.
Visit Exit, Case Completion and Clinic Day Closure remain distinct decisions.

## 2. New device evidence: installed public CA

Owner-provided Android screenshots at 17:51 Africa/Cairo show a certificate
details entry with an Uninstall action, the exact subject/issuer and SHA-256:

- CN=RobY Stage6 Device Test CA 9a690549.
- 7EC5EC247C13012F208D693AD869928B121D6916C9455567C3924659B660A0CC.
- Issued 10 October 2026; expires 13 October 2026.

Together with the preceding empty Trusted Credentials -> User screen and public
DER export evidence, record installation/details verification as PASS for the
displayed entry. The screenshots show dates, not precise validity times; exact
times remain the earlier DER check: CA expires 13 October 09:47:02 Cairo, leaf
expires 12 October 09:47:03 Cairo. Recheck both before future start.

Observed XOS path: Password & Security -> Advanced Options -> Encryption &
Credentials -> Install Certificate -> CA certificate. Browser TLS acceptance,
cookie handling and the full real-browser/PG proof remain NOT_EXECUTED.
This is current-user trust, not an established isolated Android profile.
Retain the agreed exact-entry removal/verification procedure after the test;
never use Clear Credentials, remove unrelated CAs or infer removal from expiry.

## 3. Blocking source reconciliation: POST response

Source verified against GitHub at the reviewed HEAD:

| File | Git blob SHA |
| --- | --- |
| application/services/register-new-patient.js | 7f5472f614b584a9220c314b00fb9093270f9518 |
| backend/persistence/patient-repository.js | d1e40e7273872e0c5d0ac15ddf59449bfd49fff2 |
| backend/api/secured-patient-composition.js | 1bf14b7ff737ef1d59f927c084b7f316a0b8f980 |
| domain/patient.js | 6b50cbb3ee2a32178656be4e8d92dbbe70b2e652 |
| src/integration/basic-patient.ts | 7af7e33d1365c35f2f79db9d6dfd55d9cdeefb83 |

PatientRepository.createPatient returns an INSERT RETURNING row with a generated
technical UUID. registerNewPatient discards that return value, returning its
domain Patient instead. composeSecuredPatients sends that value as HTTP 201.
The domain object has camelCase fields and no patient_id; parsePatient expects
the eight snake_case/basic fields including the technical UUID.

A Work-only Fastify injection diagnostic used the real composition, service,
repository and adapter parser with a fake authorized transaction/query client.
The matched source blob bytes were checked before execution. Observed:

WORK_FAKE_DEPENDENCY_POST_RESPONSE_MISMATCH=REPRODUCED
HTTP_201_BODY_MISSING_TECHNICAL_ID_AND_ADAPTER_REJECTS=VERIFIED
REAL_DATABASE_CONNECTION_AND_NETWORK_LISTENER=NONE

The fake INSERT returned a valid technical UUID; HTTP 201 omitted it; the actual
adapter parser rejected that response. An INSERT RETURNING shaped row was accepted
by that parser as the positive control. The fake path released its savepoint.
This demonstrates response incompatibility, not a new real-PG write proof.

Existing scoped tests check the POST status and transaction/savepoint behavior;
they do not prove browser response compatibility. Previous PASS records remain
valid for their tested assertions. A real successful insert could otherwise
commit and then become outcome-unknown in the UI because its response is invalid.

Required E0 fix proposal: in the separate secured POST boundary, retain the actual
row returned by the existing repository create operation and return its permitted
basic DTO only after the existing service/savepoint and outer auth transaction
succeed. Capture once; no guessed UUID, second CPN allocation, follow-up lookup,
domain field invention, response parsing relaxation or swallowed error.
Keep registerNewPatient's existing legacy return contract unchanged.
An outer COMMIT failure must still produce generic failure, never HTTP 201.

Add a meaningful response contract test using the actual secured route/service/
repository and real adapter parser, covering persisted UUID/CPN, commit failure,
denied writes and no extra authority/history fields. No real browser POST until
this gate is implemented, reviewed and tested. The later Decision A implementation below fixes this response boundary; real
PostgreSQL/browser evidence for the fix remains pending.

## 4. Proposed source write allowlist

Approved by the later Decision A grant; exact preservation allowlist:

Modified existing files (E0 only):
- backend/api/secured-patient-composition.js
- backend/api/secured-patient-composition.test.js

New files:
- backend/api/stage6-patient-response-contract.test.ts
- backend/web-proof/stage6-device-package.cjs
- backend/web-proof/stage6-device-package.test.cjs
- backend/web-proof/stage6-browser-proof-checklist.md
- ARCHITECTURE/STAGE-6E-F-LISTENER-AND-INDEPENDENT-DATABASE-EXECUTION-REVIEW-PACKAGE-V1.md

Do not modify shared application/domain/repository/schema contracts, current TLS
runtime, package/lockfiles, README, existing UI/demo store or ordinary Vite config.
Do not commit synthetic passwords, verifiers, session tokens, keys, certificates,
device build outputs or database exports. If this allowlist cannot implement a
required behavior, reconcile the exact additional scope before changing it.

## 5. Fixed execution envelope

| Resource | Proposed fixed value / boundary |
| --- | --- |
| Web origin | https://127.0.0.1:3443 |
| Listener | TCP 127.0.0.1 only; fail if occupied, no fallback port |
| Existing isolated cluster | $HOME/vip-retrieve-proof-isolated/data |
| Unix socket | $HOME/vip-retrieve-proof-isolated/socket; port 55439 |
| Cluster identity | 7694773229923891271; PostgreSQL 18; TCP listening disabled |
| Maintenance connection | postgres database in that verified isolated cluster only |
| New database | roby_web_proof_stage6; reject existing database |
| Database template | template0; never a historical/Stage4/Stage5 proof database |
| TLS directory | $HOME/vip-web-proof-stage6/tls-9a690549 |
| TLS inputs | Existing public CA/leaf certificates and leaf server key only |
| Build root | $HOME/vip-web-proof-stage6/build-<EXECUTION_HEAD>; fresh directory |
| Private evidence root | $HOME/vip-web-proof-stage6/run-<EXECUTION_HEAD>; 0700 |

All canonical paths, regular files, restrictive private modes and symlink-free
ancestors require checks. CA private key is never read. Existing leaf key is read
only by the future explicitly authorized TLS start; never printed or exported.
No new certificate generation, key replacement or Android trust alteration.

Historical $PREFIX/var/lib/postgresql and proof databases roby_retrieve_proof_c /
roby_auth_proof_stage5 are never connected to, restored, cloned, reset or dropped.
The existing Vite and PostgreSQL processes are not stopped or restarted.
Cluster shares CPU/memory with the proof work: this is database separation, not
physical/resource isolation. Do not claim prior DB byte preservation without
inspection; the intended evidence is that they are excluded from connections.

## 6. Execution HEAD and build binding

EXECUTION_HEAD must be the full reviewed commit after E0 and package publication.
Do not hard-code the old tested HEAD or assume a documentation HEAD is a new test.
Before device modes: verify main, exact HEAD/origin, no staged/conflict state,
all imported critical source/package/lock bytes against that commit, protected
bytes/index and every existing worktree diff/status/untracked byte.

The package itself, imports, runtime, adapter, auth, controllers, application,
domain, schema, configuration, package manifests and locked dependency selection
must all participate in source validation. A fixed token cannot replace it.
No arbitrary command arguments, DB name, path, port, origin or manifest override.

Build via the locked Vite executable and existing vite.stage6.config.ts with a
fresh explicit outDir override and emptyOutDir=false. Do not npm install/ci,
empty an output directory, write ordinary dist or restart Vite.
Reject a pre-existing build target. Record HEAD, critical-source SHA-256s,
CA/leaf fingerprints and a strict filename-to-SHA256 asset map; no secrets.
Serve only stage6-integration.html and allowlisted assets/*.js or *.css (no maps,
sources, config, keys, secrets or SPA fallback for API errors).
Existing runtime readAssets must independently verify that map at start.

The SQL vip_auth.proof_manifest singleton must bind to exactly EXECUTION_HEAD and
the fixed cluster identity, as required by startStage6WebTestRuntime. Build HEAD,
runtime expected HEAD and SQL HEAD must match. Keep old CA label as provenance;
do not rename or regenerate it merely because documentation/source HEAD changed.

## 7. Independent synthetic fixture proposal

| Item | Exact proposed baseline |
| --- | --- |
| Active Doctor | a6000000-0000-4600-8600-000000000001; SYN/STAGE6/DOCTOR |
| Active Nurse | a6000000-0000-4600-8600-000000000002; SYN/STAGE6/NURSE |
| Disabled Doctor | a6000000-0000-4600-8600-000000000003; SYN/STAGE6/DISABLED |
| Existing Patient | b6000000-0000-4600-8600-000000000001 |
| Missing Patient UUID | b6000000-0000-4600-8600-000000000002; never inserted |
| Existing Patient fields | CPN-60001; Stage 6 Synthetic Baseline; DOB 1990-02-01; Tester; 00000000000; Male |
| Clinical state | No clinic_days rows; no Case/Visit/clinical/demo fixtures |
| CPN sequence | last_value=1; is_called=false; no setval or nextval during preparation |
| Auth policy | DOCTOR_NURSE; Nurse FULL delegation from active Doctor, empty contracted capability list |
| Initial auth state | Three enabled version-1 synthetic credentials; zero sessions/login attempts |

Provision three separate owner-chosen synthetic test passwords through hidden
TTY input, not command-line arguments/environment/Git/chat/logs/files; require
the existing verifier's normalization/bounds and approved scrypt profile.
Derive sequentially, never reduce cost to fit low-RAM hardware. The owner retains
the disposable inputs for manual browser use. Do not enroll a real person.
Persist only verifiers in the new database. No default known production password.

## 8. Independent device decisions and proposed mode contracts

These mode interfaces are now implemented by Decision A, but are not device
execution authorization. Each requires its exact token and full EXECUTION_HEAD.

| Gate | Proposed mode/token | Permitted effect after its authorization |
| --- | --- | --- |
| E0 | Response fix + targeted/active tests | Work source changes within section 4; no device DB |
| E1 | preflight / ROBY_STAGE6_DEVICE_PREFLIGHT | Source/protected/TLS metadata/clock/port checks; no SQL or listener |
| E2 | build / ROBY_STAGE6_DEVICE_BUILD | Fresh separate build and nonsecret hash manifest only |
| E3 | prepare / ROBY_STAGE6_DATABASE_PREPARE | Verified isolated postgres maintenance connection, one new DB and atomic synthetic initialization |
| E4 | start / ROBY_STAGE6_LISTENER_START | Verified Stage6 DB and build, existing secured runtime, owned 127.0.0.1:3443 listener |
| F0 | Manual Chrome HTTPS acceptance | Actual trusted-origin page, certificate identity and browser version observations |
| F1 | W01–W16 controlled proof | Only explicitly approved synthetic auth changes/one Patient POST and comparisons |

No mode calls another mode automatically. Import loads only Node builtins and
opens no driver/pool/listener. No wildcard cleanup/reset/restore/resume mode.
Stop after each gate and review evidence before independent dependent execution.

E3: validate metadata and actual system identity before any CREATE. Connect with
explicit Unix socket/port/database/OS user, bounded timeouts and fixed search_path;
ignore ambient PGHOST/PGPORT/PGDATABASE/PGOPTIONS. Maintenance queries are read-only
except one fixed CREATE DATABASE ... TEMPLATE template0 outside a transaction.
Serialize preparation with an isolated maintenance session advisory lock held
through existence check, create and initialization; recheck all identity guards.

After target creation connect only to roby_web_proof_stage6, require the same
cluster identity, ownership, public CREATE privilege and absence of user objects,
vip_auth and unexpected extensions. Begin a bounded transaction; initialize the
unchanged base schema with SET LOCAL search_path=public, then restore
pg_catalog,public before the explicitly-qualified auth schema and parameterized
synthetic fixture/manifest inserts. Validate exact baseline within the transaction
before COMMIT, then independently reread committed baseline/identity.

CREATE DATABASE cannot be rolled back with fixture initialization. If subsequent
work fails, retain the new empty/partial database, report the phase and stop.
Existing DB always blocks prepare. No automatic resume-empty, truncate, setval,
reset, DROP DATABASE or retry. Diagnostics/recovery need a new bounded review.

E4: validate all files/manifests, current CA/leaf validity and key match, exact
source and owned target DB identity/manifest before listen. Call the existing
startStage6WebTestRuntime with token ROBY_STAGE6_WEB_START, matching expectedHead /
buildHead, fixed asset map and existing TLS material. No CLI plaintext variant.
Use foreground Termux; print only safe address/phase/status, never passwords,
cookies, CSRF, verifier, key contents or private response bodies.

Install one idempotent SIGINT/SIGTERM shutdown path closing only the app/pool
created by this start. Ctrl+C ends that owned listener; never pkill node,
pg_ctl stop or kill an unrelated PID. Verify owned server listening=false and
protected source/index/worktree state after close. If close fails report it;
do not claim shutdown or perform broad cleanup. Android killing the process is
not graceful-close evidence. On wake/resume recheck process/clock/identity.

## 9. Browser proof and expected effects

Before credential entry record Chrome version and actual connection/security UI
for https://127.0.0.1:3443, with no warning bypass. Root installation alone does
not prove browser acceptance. If the necessary certificate/cookie attribute cannot
be observed, keep that assertion unproven; do not infer it from Node or SQL tests.

Follow W01–W16 from the existing Stage 6-A design, failure-first. Explicit fixture
state changes for deactivation/expiry/rollback/concurrency must be implemented and
reviewed as private token-guarded target-DB-only controls before executing them.
Never add HTTP test-control routes or reset Stage 5 data. Initial package does
not claim to implement those controls or to complete all sixteen checks.

First session tests: unauthenticated denial, wrong password, disabled Actor,
trusted Doctor login/bootstrap, trusted Nurse login with Patient denial, missing/
wrong CSRF, server role over browser input, GET found/missing, logout and reopen.
Record auth mutations separately from business-data preservation: login/session
checks touch attempts/sessions; they are not a globally read-only run.

W13 positive registration remains blocked until E0 passes. Initially approve at
most one intended synthetic Patient submission with exactly the five basic fields.
Capture server UUID/CPN, then GET that UUID; compare SQL baseline to response.
Expected one new Patient and one nextval call. With the untouched initial sequence,
first allocation is CPN-1 and sequence becomes last_value=1,is_called=true.
If any separately approved fault consumed a number earlier, record the changed
baseline and expected next allocation; never reset it to force this expectation.

PostgreSQL nextval is not rolled back on transaction abort. Denials/GET that never
allocate must preserve the sequence. W14 failure after allocation must roll back
Patient/auth transactional effects but may leave a sequence gap; record that
consumption rather than claim sequence rollback or use setval. Gapless numbering
is not introduced by this package. Existing contracts are not silently amended.

Lost POST response or parser failure means outcome unknown. Stop registration;
no retry, page reload/relogin to bypass the block, guessed UUID or mock fallback.
Reconcile the exact new target-DB rows/sequence through a separately reviewed
read-only command and one-step evidence before any further write permission.

## 10. Stop rules, evidence and acceptance

Stop on changed HEAD/critical bytes, collisions or symlinks, occupied port,
wrong/expired certificate, browser trust warning, wrong cluster/database/owner,
existing target DB, unexpected schema/fixture/sequence, generic failure, unknown
Patient outcome, missing observable assertion or source/clinical/demo mixing.
No security weakening, certificate click-through, public tunnel, LAN exposure,
schema reset or automatic broad test rerun is a recovery strategy.

For each gate report actual full execution HEAD, source/build fingerprints,
UTC/device time, exact identity checks, phase/exit status, observed browser result
and bounded expected mutations. Preserve protected files, index, worktree status/
diff and all prior untracked bytes; report failure without reset if they differ.
Capture no real patient data or secrets in chat/Git/evidence.

Current evidence labels:
ANDROID_CA_ENTRY_DETAILS = PASS_FOR_DISPLAYED_ENTRY
WORK_POST_RESPONSE_DIAGNOSTIC = MISMATCH_REPRODUCED_WITH_FAKE_DEPENDENCIES
E0_RESPONSE_FIX = IMPLEMENTED_AND_FAKE_DEPENDENCY_CONTRACT_TESTED
DEVICE_STAGE6_BUILD = NOT_EXECUTED
NEW_STAGE6_DATABASE = NOT_CREATED_OR_INSPECTED_BY_THIS_REVIEW
LOOPBACK_HTTPS_LISTENER = NOT_STARTED_BY_THIS_REVIEW
ANDROID_BROWSER_TRUSTED_TLS = NOT_EXECUTED
W01_W16_COMPLETION = NOT_ESTABLISHED

## 11. Decisions requested after review

A. Adopt the envelope/fixture/stop rules and authorize only E0 plus the exact
source/tool/checklist allowlist in section 4, bounded Work validation, scoped Git
preservation and protected sync. Tool implementation does not execute device modes.
B. After reviewed source publication and final command-byte/HEAD binding, authorize
E1/E2 device checks/build separately from E3 database creation and E4/F execution.
C. Approve the exact W01–W16 state controls and expected writes only when concrete
and tested. Certificate removal remains the previously agreed exact-entry action
after testing, independent from cluster cleanup.

This package preserves the original review and later source implementation, not an executed device preparation command,
production grant or completed Stage 6 milestone. Device commands will be emitted
only after the proposed package exists at its reviewed execution commit.

## Primary technical sources

- PostgreSQL 18 CREATE DATABASE: https://www.postgresql.org/docs/18/sql-createdatabase.html
  (template0 initialization; CREATE DATABASE is outside a transaction block).
- PostgreSQL 18 sequence functions: https://www.postgresql.org/docs/18/functions-sequence.html
  (nextval values are not reclaimed after aborted transactions).
- Exact repository source and the existing Stage 6-A design at reviewed main,
  plus owner-provided Termux/Android observations distinguished above.

## Decision A implementation and Work validation

The owner approved Decision A on 2026-10-10 at 17:59 Africa/Cairo. No new Android,
SQL or persistent listener execution was performed while implementing it.
Source baseline is reviewed main 4b2bb8783d336ec81a3756a213b4e87f1263291e.

The secured POST route now captures the actual INSERT RETURNING result once and
projects its eight basic fields after the existing service/savepoint and outer
authorization transaction succeed. UUID and CPN come from persistence. Shared
registerNewPatient/domain/repository code and the legacy return contract remain
unchanged; Nurse/CSRF/Origin/session guards still precede authorized business work.
The missing UUID response no longer passes HTTP 201 for this tested path.

The new device package exposes four independent preflight/build/prepare/start
modes. CLI import/argument rejection creates no resource and loads no pg/Fastify.
It verifies critical committed source/lock/package bytes, selected installed
locked versions, protected/index/worktree/untracked state, canonical private
paths, exact public CA/leaf fingerprints and current certificate validity.
The read-only empty TCP port probe sends no HTTP/TLS/credential payload and does
not reserve the port. No CA key is read; only future start reads the leaf key.

Build creates fresh private build/run directories, invokes locked Vite into that
separate target, preserves ordinary dist and records a strict byte-approved asset
map plus source/HEAD/public-certificate metadata. Failed partial output is retained
and blocks another build; no overwrite/cleanup mode exists.

Prepare prompts for three separate synthetic passwords with hidden TTY input and
confirmation. Inputs cannot be supplied through arguments, files or environment;
no plaintext is persisted or logged. Existing scrypt normalization/cost is reused
sequentially. Maintenance connection targets only verified isolated postgres,
holds a session advisory lock through existence check/create/initialization, and
refuses any existing target. Base DDL targets public explicitly; target fixture,
auth schema and proof manifest initialize atomically after empty/owner guards.
CREATE DATABASE itself remains nontransactional: partial failure leaves the new
target for bounded diagnosis, never automatic drop/reset/resume.

Prepare records a private database-baseline.json with HEAD/database/system ID and
a schema fingerprint (columns, relation kinds, user functions/schemas/extensions),
without secrets. Start compares that record, exact fresh target fixture, ownership,
build/source/proof HEAD, schema and TLS material before the existing HTTPS runtime
binds 127.0.0.1:3443. Runtime source/SQL checks independently revalidate identity.
One idempotent close path is shared across SIGINT/SIGTERM and closes only the app/
pool owned by this start. Stale sessions or mutated baseline block restart rather
than trigger a reset. Closing failures remain failures.

The checklist explicitly marks missing private state/fault controls and observable
Android browser tooling as remaining gates; it does not claim W01–W16 completion.

Work validation used Node v24.19.0 and existing repository-locked dependencies:
- Combined Actor/auth/repository/secured-route/Web adapter/runtime/package tests:
  106/106 passed, zero failures. Includes 16 new tests (4 POST adapter contracts,
  12 device-package guards/lifecycle tests).
- Active regression: 52/52 passed, zero failures.
- Strict targeted TypeScript check for the new TS contract and its imports passed.
  Initial tool invocation needed TypeScript 7 --ignoreConfig; implicit callback
  types were resolved, and the four contract tests reran successfully afterward.
- Separate locked Vite build passed (19 modules); new package buildAssets accepted
  its three actual permitted HTML/JS/CSS assets. Output stayed outside source.
- New CJS syntax/import and closed-mode CLI guards passed. New guard tests use
  fake SQL clients; no real database, device TTY prompt or Android TLS is proven.
- Existing TLS runtime tests create/close only their own temporary fake-auth
  loopback test listeners. No persistent Web listener or database connection was
  started by the new device package in Work.
- After the final source-preflight/password-confirmation hardening, the 12 package
  tests were rerun successfully. No production/clinical assurance is inferred.

Git preservation is exactly two modified and five new paths from section 4.
No shared schema/service/repository/domain/frontend/package/README/protected
path is changed. No certificate, key, build, credential or evidence-secret file
is included. Work cannot inspect the protected Android bytes; sync and later
device execution must prove their actual preservation independently.

The actual preserved commit becomes EXECUTION_HEAD only after remote verification
and safe Termux sync. Existing certificate labels remain provenance. Device
preflight/build/prepare/start commands still require separate execution grants;
Decision A source publication is not a database/listener authorization.

**MOHAMED.K_ROBY decides. Proof validates. Git preserves.**

# Stage 7 Doctor CASE_CREATE — bounded engineering increment

Owner: MOHAMED.K_ROBY. Starting HEAD: 25fc7ab800a9073152ea50c9447e3561462e6ce2.
Authority: owner Engineering Autonomy & GitHub Authorization directive, 2026-10-13.
Status: source implementation; real PostgreSQL acceptance PENDING; clinical release NOT AUTHORIZED.

## Authority and scope

The latest owner directive explicitly separates implementation from acceptance and authorizes this increment before fresh Work PostgreSQL proof. This supersedes the earlier C1-before-C2 execution sequencing for source development only. Manuscript §§5/13 and Policy B V2 controlled amendment/reconciliation remain unchanged. The foundation source and Termux acceptance seal remain historical evidence. No assertion of inspecting underlying Termux C1 logs is made.

Only Doctor Case creation and authenticated receipt recovery are introduced. No Visit, Day, arrival, queue, prescription, CPN or completion/reopening operation is added. The four reserved clinical decisions remain untouched. Original UI and protected files are unchanged. Authenticated server composition exposes these routes only with explicit `enableCaseCreate: true`; all existing runtime callers remain disabled by default. There is no production switch, listener, migration startup, browser fallback or UI claiming completion.

## Protocol

POST /clinical/cases: exact JSON { operationId, patientId, problemSummary }.
operationId and patientId are canonical lowercase UUIDs; summary is nonblank, at most 4000 JS characters, no NUL. HTTP body bounded at 16384 bytes. Clinical text is preserved exactly; whitespace changes are different intent, not silently normalized. No actor/role/lifecycle/client time override accepted.

POST /clinical/cases/receipt: exact JSON { operationId }, body at most 1024 bytes. POST deliberately keeps operation identifiers out of URL logs and uses the same trusted-origin, current-session and CSRF protections. Caller must be a currently active authorized Doctor; actor comes only from session. Nurse delegation cannot grant either clinical capability. No second login.

Both successful create and replay return HTTP 200, { status: 'COMMITTED', result: { caseId, patientId, lifecycle: 'OPEN', lifecycleVersion: 0, createdAt } }. The result describes the original committed creation, not the Case's later current state. Recovery returns that same result or { status: 'UNKNOWN' }. Receipts are actor-scoped. No clinical summary or credential is required for receipt lookup.

400 invalid input; 401 missing/expired/revoked identity; 403 origin/CSRF/authority denial; 404 Patient absent on new creation; 409 same operation with changed meaning/kind; 413 oversized transport body; 415 wrong media type; 503 unavailable or integrity/transaction failure. A 503 or lost response is NOT a rollback certificate.

## Transaction and replay

createAuthService.withAuthorized reauthorizes before any receipt access and supplies the existing transaction client. AuthRepository owns BEGIN, global auth advisory serialization, session touch and outer COMMIT. Repositories never commit. Do not remove global serialization without separately reviewed concurrency design.

Operation key is authenticated actor UUID plus operation UUID. Existing versioned fingerprintIntent binds CASE_CREATE, policy/schema identity and exact Patient/summary meaning. Same intent returns the original immutable receipt. Different intent conflicts. A missing receipt does not prove an earlier request cannot commit.

For a new intent, Patient is checked with FOR KEY SHARE and existing FK enforcement; a server-generated UUID and database clock_timestamp create an OPEN version-zero Case. Its immutable result receipt is inserted on the same client before outer COMMIT. Failure aborts both. AuthRepository's conservative 503 on COMMIT transport error deliberately retains uncertainty. The client must retain the same operation identity, authenticate again if necessary, and recover. Never allocate a replacement operation ID simply because a response was lost.

A future client may persist only the operation UUID and protocol kind/version as a pending marker, never token, CSRF, Patient identifier or clinical payload. No client recovery storage is implemented here. If recovery is UNKNOWN and original intent was lost, do not fabricate a payload or claim success/failure: require explicit reconciliation. Identical resubmission is safe only with original intent; this increment does not introduce automated browser retries.

## Evidence boundaries

backend/clinical/case-create.test.cjs executes shared service scenarios with a serialized memory transaction double, plus actual Fastify inject security/route tests. It proves application control flow, not PostgreSQL locks/FKs, TCP/browser behavior or physical durability. Fault injection models lost acknowledgement after committing in the double.

backend/clinical/postgres-case-create-proof.cjs is an explicit Termux runner, NOT part of test:all. It validates exact committed source and dedicated branch; rejects the primary ~/ViP-Clinic- checkout; validates the known Unix-only PG18 cluster, data/socket paths, port and system identifier; creates a fresh unpredictable C2 database using template0 and refuses reuse. It never drops any database. New synthetic fixtures only. It runs shared scenarios using real AuthRepository, real password verification and PostgreSQL, then API-to-PG injection and preservation/constraint checks. A SQL division-by-zero fault aborts receipt insertion to prove rollback. A wrapper throws only after real COMMIT returns to model transport acknowledgement loss. This is controlled fault injection, not actual network partition proof. C2 runner has not run on real PostgreSQL in Work.

Strict current provenance is expected at $HOME/roby-stage7-pg-c1/data and socket, port 55437, PG18, no TCP listener. It is not permission to target any other or existing database. All newly created databases are retained even on failure for inspection; no cleanup/reset/resume mode. No production credentials or env URL used.

## Termux execution after owner review

Import the delivered full-history bundle into a NEW separate repository; verify SHA256SUMS and `git bundle verify`; checkout work/astra-stage7-doctor-case-create at the delivered exact HEAD. Configure origin to https://github.com/Mk-arch2030/ViP-Clinic-.git, install dependencies from lockfile, and verify clean status. Do not operate the primary or Golden checkout.

Run separately, inspecting each result:

- npm run test:all
- npm run lint
- npm run build
- node backend/clinical/postgres-case-create-proof.cjs ROBY_C2_NEW_DISPOSABLE <FULL_REVIEWED_HEAD>

Capture output and exit code outside the source tree and hash the log. Proof is PENDING until real execution exits 0 and prints REAL_PG_CASE_CREATE=PASS. A failed/blocked runner cannot establish acceptance. Independent browser journey remains NOT TESTED and original UI integration is outside this increment.

## Rollback and stop

Routes stay disabled in existing compositions. If later opt-in verification fails, stop that isolated app; preserve receipts/Cases and evidence. No populated schema rollback, database deletion, history rewrite or main merge. Do not move on to Visit/Completion/Reopening/Prescription. Feature-branch review is authorized; release is not.

## GitHub-native continuation, 2026-10-14

Verified remote foundation is 25fc7ab800a9073152ea50c9447e3561462e6ce2 on work/stage7-foundation-handoff and work/gemini-vip-complete. Gemini commit 8194f264910fbd5f736c7f888259e964b157c1ea returned 404 and was not imported. Owner 318-test device result is not this implementation baseline. This increment reuses reviewed local Astra source from 08487ab and 432414e, retained unchanged on the prior local branch and bundle; it is a new GitHub-native commit on the exact foundation, not an exact-object publication of those local development commits. No missing Gemini code or history was reconstructed.

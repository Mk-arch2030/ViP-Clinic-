# Stage 6-I: server Patient search by CPN or name

OWNER: MOHAMED.K_ROBY  
SOURCE_BASELINE: 516a3d6c978dbf6f21d6600b93c048d8c92c137e  
AUTHORITY: owner requested CPN/name retrieval instead of entering UUID on 2026-10-10 22:19 Africa/Cairo  
DEVICE_SEARCH_PROOF: pending for this source package

## Evidence and user behavior

Owner reported successful server login, registration and retrieval through the
connected clinic UI. Startup output validates source, pinned local theme, existing
Stage 6 identity/schema/original business baseline and loopback binding. Browser
images show Pt 2, CPN-8, UUID c5cf67dd-5051-4c10-9895-61e78fbe748e and DOB
2018-10-09/derived age 8. The owner explicitly confirmed retrieval; do not ask to
repeat the same UUID proof as if it were unreported. There is no captured HTTP
status trace or complete W01-W16/browser trust proof in these images.

The protected Patient tab now searches by CPN or name. CPN accepts 8 or CPN-8
(case-insensitive prefix), uses exact canonical equality, and rejects zero, leading
zeros, malformed or oversized input. Name accepts 2-80 NFC-normalized characters
after trimming, with literal case-insensitive substring matching. No fuzzy Arabic
normalization is claimed. SQL parameters carry input; %, underscore and backslash
do not broaden the query as wildcards.

Results show name, CPN, DOB and phone for disambiguation. Duplicate names remain
separate choices. The user selects the intended row; existing UUID retrieval then
opens that Patient internally. UUID remains technical identity and is no longer
a user input/result label in the connected panel. The original UUID API remains
compatible. At most 25 results are returned with hasMore; the UI asks to refine
the name if truncated. No automatic selection or unlimited directory export.

## Protected backend contract

GET /patients/search?mode=cpn|name&value=<text> is installed in the existing secured
composition, alongside unchanged login/session/logout/UUID retrieval/registration.
Static search route collisions are checked before registration. The route uses
existing PATIENT_RETRIEVE authority and current persisted session/Actor checks,
not browser role data. Doctor-only Patient authority is unchanged. Unauthenticated,
duplicate/unknown sessions deny; Nurse and deactivated identity deny before SQL.
Malformed/repeated/extra query fields deny. Cross-site metadata rejects, responses
are no-store and infrastructure failures are generic. This GET does not write
Patient data; normal existing session activity bookkeeping still applies.

Search response: { patients: [existing basic Patient DTO], hasMore: boolean }.
Zero results are HTTP 200 with an empty array; the UI displays Patient not found,
clears old data and retains current server identity. Existing UUID misses remain
404. Returned DOB/age may be null. The adapter rejects malformed/oversized/duplicate
identity responses and uses fixed same-origin GET with no retries, role injection,
insecure origin, CORS expansion or cookie/CSRF change.

Session coordination now owns bounded search results. Search shares existing busy,
generation and abort guards; logout/login/bootstrap/dispose cannot be followed by
late search restoring old data. Nurse UI cannot dispatch. Search does not weaken
pending/unknown Patient registration controls. No browser Patient persistence or
mock fallback is introduced. clinicStore, its records, five demonstration workflows,
protected CSS, schemas, existing Patient repository/service and clinical contracts
are preserved.

## Existing database reconciliation before the new listener

Newly registered Patients changed the original one-Patient startup baseline.
Do not rerun prepare, reset the sequence, delete records or rewrite the old proof
to force startup. CPN-8 does not imply eight Patient rows: sequences may have gaps,
and the fixed synthetic CPN-60001 baseline is separate from generated numbers.

New clinic-search-device.cjs has only preflight/build/review/start modes. It reuses
the existing source/TLS/path/theme/dependency/port protections and fixed original
fdd52be105e90a3c5f4894d9f5b5fe7fb8f73bd8 proof record. Existing strict Stage6 and
connected startup tools are unchanged. No create/reset/resume/migrate/cleanup mode.
Fresh output is under $HOME/vip-web-proof-stage6/clinic-search/build-<sourceHead>
and run-<sourceHead>; previous builds/preparation/review records are preserved.

After the old owned listener is closed and source sync/build pass, explicit review
connects ONLY to roby_web_proof_stage6 via the established isolated PostgreSQL 18
Unix socket, verifies exact server identity, and opens a repeatable-read READ ONLY
transaction. It validates original proof/schema/owner and all original Actor,
credential identity/version/enabled, mode/delegation fields. It reads no verifier,
session token or CSRF contents. Auth activity counts may be nonzero.

Original seed Patient must remain byte-equivalent, Clinic Days stay zero, Patients
have unique valid UUID/CPN and valid bounded basic fields. This synthetic review
is bounded to 100 Patients. The sequence must be positive and cover generated CPNs;
gaps are accepted without resetting it. Changed authority/schema/seed/days stop.
The local review records exact current Patient/sequence/day bytes with SHA256,
source HEAD, original proof HEAD, database/system identity and schema fingerprint
in a new exclusive 0600 file. It prints Patient identity/name/CPN plus counts/hash
for owner review. SQL is SELECT/BEGIN READ ONLY/COMMIT or ROLLBACK only. No listener
or private leaf key read occurs in review mode.

Start requires that exact local review and rechecks current business bytes against
it in another read-only transaction before the existing secured builder/listener.
If business state changed after review, start stops; no automatic record refresh
or repair. Signals close only the owned loopback listener/pool. Historical clusters
and Stage4/5 databases remain outside connection scope. Actual auth/Patient requests
continue to have their explicitly authorized existing effects after startup.

## Exact source scope and validation

Modified: backend/api/secured-patient-composition.js;
src/integration/web-api-client.ts; src/integration/session-coordinator.ts;
src/integration/connected-patient-session.ts; src/components/ConnectedPatients.tsx;
src/components/ConnectedPatients.test.tsx.

Added: backend/persistence/patient-search.js; backend/api/patient-search.test.js;
src/integration/patient-search.test.ts; backend/web-proof/clinic-search-device.cjs;
backend/web-proof/patient-search-review.cjs;
backend/web-proof/patient-search-review.test.cjs; this document.

Work npm run test:all: 200 tests, 200 passed, zero failed/skipped/cancelled/todo,
exit 0. Thirteen new tests exercise SQL/query bounds, repeated-name choices,
authorization/status normalization, response parsing, stale result suppression,
and read-only current-business reconciliation. Existing 187 tests remain passing;
the historical p37a test stays excluded. Strict targeted TypeScript passed; locked
Vite 8.3.2 separate build passed, 1675 modules. Fake SQL/auth tests and Work rendering
are not real Android search or new PostgreSQL reconciliation proof. Device build
must use the separately pinned owner CSS bytes.

## Owner handoff

1. Ctrl+C only the current connected listener before any Git sync, obtain owned
   close/protected preservation output. Keep Vite and all PostgreSQL clusters.
2. Scoped source sync checks exactly six modifications/seven additions, hashes,
   remote HEAD, existing untracked/protected state and no staging.
3. Device npm run test:all, then new preflight/build using full source HEAD.
4. Invoke new review separately, inspect Patient/CPN/count/sequence/hash evidence.
   Stop on unexpected state; do not recreate/reset the database.
5. Start only after that review; test CPN-8/8 and name Pt 2, duplicates/no-match,
   logout/unauthenticated/Nurse denial. Preserve evidence of what actually ran.

MOHAMED.K_ROBY decides. Proof validates. Git preserves.

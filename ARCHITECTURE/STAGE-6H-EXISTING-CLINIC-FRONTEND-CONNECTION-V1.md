# Stage 6-H: connect the existing clinic frontend to the protected Patient backend

OWNER: MOHAMED.K_ROBY  
SOURCE_BASELINE: fdd52be105e90a3c5f4894d9f5b5fe7fb8f73bd8  
AUTHORITY: owner requested frontend/backend connection and explicitly preserved clinicStore mock records on 2026-10-10 20:02–20:05 Africa/Cairo  
DEVICE_CONNECTION_PROOF: pending for this new package  
PRODUCTION_AND_CLINICAL_USE: not granted

## Current evidence and preservation

Owner reported current npm test:all 173/173 passed, zero failed/skipped/cancelled;
separate Stage 6 build, synthetic database preparation and loopback listener
startup succeeded. Browser screenshots show server Doctor identity and the exact
baseline Patient UUID b6000000-0000-4600-8600-000000000001, CPN-60001, DOB
1990-02-01 and derived age 36. For the absent UUID ending 002, owner observed
old result cleared and Doctor session retained, but no visible missing-patient
message. This does not establish the full browser security checklist or HTTP
status capture. Chrome certificate detail inspection remains unobserved.

Read-only device source inspection matched committed App/main/Header/Intake/
Directory/clinicStore/domain types/Vite config to the baseline. src/index.css is
the protected owner-edited theme with SHA256:
ba5a7bd86fbed4d4b60d531928cba047f18a193366452e1762773f149c9f9c76.
Staged paths were empty. That theme and all four existing protected paths remain
outside the Git write scope. No mock seed/store/domain/clinical component data is
rewritten or migrated. The Vite process is not stopped/reconfigured by this package.

## Product connection

The same App gains a Server patients tab; the five existing demonstration tabs
remain. HTTPS defaults to the server tab. Vite HTTP defaults to the original
demonstration workflow. On HTTP, the server tab contains a fixed link to the
protected clinic and cannot transmit credentials or Patient requests. On HTTPS,
the same App/current theme hosts existing WebApi and session coordination.
No cross-origin proxy, CORS expansion, insecure cookie or CSRF downgrade is used.

The Header in server context shows only server-resolved identity; demo role/mode
switches and the mock Clinic Day bar are absent there. Demo tabs retain their
existing controls and display explicit demonstration context. Server navigation labels
those tabs Demo and hides mock counts/selected CPN/prescription badges. Its footer
describes basic Patient operations only. Mock choices never
become authentication authority or an API payload field.

Server registration sends only the existing five basic fields and current CSRF;
UUID/CPN/age come from the actual response after persistence. Retrieval is by
UUID. There is no list/search-by-CPN backend yet. A returned BasicPatient is never
converted to a PatientRecord with invented Past History/registeredAt/Visits/Cases.
There is no mock fallback on not-found/outage. Nullable DOB/age remain nullable.

Server patient state lives in its separate coordinator, not clinicStore/browser
storage. The panel remains mounted when switching demonstration tabs, preserving
pending/unknown outcome guards. Navigation is disabled while busy or outcome/
logout is unconfirmed; existing server-side authorization remains authoritative.
Reopen/bootstrap always resolves current server identity rather than saved UI
role. Logout and identity changes clear draft data. Lost registration outcomes
block another registration and require bounded reconciliation, never automatic retry.

Operation notices appear beside retrieval/registration. The connected presentation
retains a not-found notice across automatic focus/session reconciliation for the
same Actor, until a new operation, logout, expired/unavailable identity or Actor
change. The historical separate Stage6IntegrationApp and its evidence are preserved.

Vite demonstration browser storage on localhost:3000 and the HTTPS browser storage
on 127.0.0.1:3443 are different origins; this package does not copy or merge their
mock records. The HTTP owner's current demonstration records remain where they are.
Day/Case/Visit/clinical history/prescription/print backend integration is future
work, not silently implemented by this basic-Patient connection.

## Exact source write scope

Modified:
- src/App.tsx
- src/components/Header.tsx

Added:
- src/components/ConnectedPatients.tsx
- src/components/ConnectedPatients.test.tsx
- src/integration/connected-patient-session.ts
- src/integration/connected-patient-session.test.ts
- clinic-connected.html
- vite.clinic-connected.config.ts
- backend/web-proof/clinic-connected-device.cjs
- backend/web-proof/clinic-connected-device.test.cjs
- this document

No package/dependency/lock/schema/service/repository/domain/clinicStore/Intake/
Directory/consultation/dossier/print component or protected-theme change is committed.

## Device transition without proof rewrite

The original prepared database proof_manifest.head stays exactly fdd52be...;
database-baseline.json and prior builds are preserved. New source HEAD differs
deliberately: connected build manifest records BOTH source head and original
proof head. No original strict Stage 6 startup guard is weakened.

New clinic-connected-device.cjs has only preflight/build/start modes with explicit
tokens and full HEAD. Import loads builtins and the side-effect-free prior helpers
only. There is no prepare/resume/reset/delete/migration/cluster-control mode.

Source validation checks prior critical source closure plus all committed src
files except the separately pinned owner theme; additional frontend packages
must match lock versions. It validates exact public CA/leaf fingerprints, validity,
private paths, old preparation record, process metadata and empty loopback port.
It never reads the CA private key. Only explicit start reads the leaf key.

Build creates fresh 0700 build/run directories under:
$HOME/vip-web-proof-stage6/clinic-connected/build-<sourceHead>
$HOME/vip-web-proof-stage6/clinic-connected/run-<sourceHead>
It uses existing locked Vite/React/Tailwind/Lucide dependencies and the current
protected CSS bytes without writing them. External font links are not included in
the connected HTML; browser system fonts remain available under unchanged CSP.
The fresh generated HTML is named stage6-integration.html only inside that private
output to reuse the prior byte-allowlisted static-serving builder. No source HTML
or prior build is renamed. Asset/source/theme/TLS/proof metadata are byte-bound.

Start connects ONLY to roby_web_proof_stage6 in the prior isolated PostgreSQL 18
cluster (Unix socket 55439, no TCP; system ID 7694773229923891271). Identity is
verified before a BEGIN READ ONLY baseline/schema/owner inspection. Auth session/
attempt counts may be nonzero because owner already logged in. They are checked
as nonnegative integer counts, never read as secrets or reset. Exact original
actors/credential identities/version/enabled/mode/delegation and business fixture
must still match; one baseline Patient, no days, sequence 1/is_called=false.
Schema fingerprint must equal the private original preparation record. Changed
business/authority/schema state or proof head stops, with no automatic repair.

After checks, the existing secured composition and TLS/static-serving builder
are reused with current AuthRepository/service and owned pool. The listener binds
127.0.0.1:3443 only. Signals close only the owned app/pool through the tested
idempotent close helper. Historical cluster and Stage 4/5 databases are never
connected, stopped or rewritten. Schema/proof metadata receives no mutation.
Normal authorized auth/Patient requests retain their existing transactional effects.

## Execution handoff

1. Before any Git sync, owner Ctrl+C closes the CURRENT owned Stage 6 listener;
   obtain its close/preservation output while HEAD is still fdd52be.... Never kill
   Vite, PostgreSQL or another process. Syncing first would break the running
   listener's exact source/index preservation expectation.
2. Safe scoped sync verifies exactly two modifications and nine additions, remote
   HEAD and each file hash, all protected bytes/status/untracked work and no staging.
   It stops on collisions/local changes, with no reset/stash/clean.
3. npm run test:all validates current sources on the device.
4. Separately invoke connected preflight then fresh build using the new full HEAD.
   Their operations are source/public TLS/filesystem/port checks plus explicit
   build output; no SQL. Do not invoke old prepare again.
5. Explicit connected start performs the scoped existing-database read-only adoption
   and opens the owned loopback listener. Device execution of these modes must be
   directed separately; a source Sync does not perform them.
6. Browser checks: current clinic chrome/theme, clearly separated demo tab; server
   identity, existing baseline GET, missing UUID notice alongside operation,
   focus/reopen behavior, Nurse denial and logout. Do not claim captured HTTP status,
   certificate details, cookie flags or full W01–W16 completion from UI alone.
7. A new Patient POST needs its own exact synthetic fixture/outcome review before
   execution. Do not retry an unknown outcome. After successful POST this runner's
   unchanged-original-business-baseline restart guard intentionally stops; a later
   read-only reconciliation gate is required, never reset to force a match.

## Work validation and limits

New behavioral tests cover notice persistence, identity expiry/change, Nurse denial,
null basic data without clinical fabrication, pending/unknown registration guards;
render tests cover blocked HTTP credentials, server-vs-demo Header and initial
checking state/current-theme classes. Device guard tests cover inert import,
closed tokens, original proof/business/authority preservation, read-only database
inspection, rollback before listener on mismatch, and source/theme/proof manifest
binding. Fake SQL tests are not a real database/browser proof.

Strict targeted TypeScript check passed. Separate build passed with the exact
locked Vite 8.3.2/React/Tailwind/Lucide dependencies. Initial Work-only dependency
probe lacked the full frontend dependencies; validation was repeated after a
fresh lock-based Work npm ci, without changing repository dependency files.
The Work build uses committed theme bytes; the owner's different pinned protected
theme requires actual device build and visual comparison. No Android/private
certificate/database/persistent device listener operation occurred in Work.

Final Work npm run test:all: 187 tests, 187 passed, 0 failed/cancelled/skipped/todo,
exit 0. This includes 173 existing current tests and 14 new behavioral/render/guard
tests. The historical clinic-authority-p37a test remains explicitly excluded.
Final strict targeted TypeScript check passed; exact locked Vite 8.3.2 connected
build transformed 1675 modules and passed. Device regression and browser connection
remain independent evidence gates. No complete
clinical-system, production or full-browser-security claim is made here.

MOHAMED.K_ROBY decides. Proof validates. Git preserves.

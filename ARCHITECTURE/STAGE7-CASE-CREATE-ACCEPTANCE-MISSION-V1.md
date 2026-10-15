# Stage 7 CASE_CREATE acceptance mission — 2026-10-15

Status: ENGINEERING PROOF PACKAGE / REAL-PG ACCEPTANCE PENDING / NO CLINICAL RELEASE.
Owner: MOHAMED.K_ROBY. Execution: Astra in Work. No owner-device commands executed by Work.

## Identity and bounded change

Baseline: 37e3d97220f4c8fedb0ec189d8b4689dfd7e89d0.
Test-source commit: 32db6e1bce4b644212f1307bab0afff4074a9d17; direct parent is baseline.
Branch: work/astra-stage7-doctor-case-create-acceptance.
The report's subsequent commit changes evidence documentation only; the final delivery manifest identifies that HEAD.

Changed executable artifacts are tests/proof only:
- backend/clinical/case-create-api-proof.cjs (new shared API acceptance assertions)
- backend/clinical/case-create.test.cjs (uses shared assertions and exposes immutable snapshot for comparison)
- backend/clinical/postgres-case-create-proof.cjs (uses same assertions with real SQL adapter and sorted Case/receipt snapshots)

No production service, route, schema, migration, metadata, Manuscript, existing contract or fixture changed. No demonstrated application defect was found requiring an implementation fix. This is strengthened evidence, not new clinical capability. Existing feature remains explicitly opt-in; no production enablement or UI wiring.

## Authority and chronology map

| Decision | Documented authority | Enforcement / proof |
|---|---|---|
| Independent OPEN Case, stable Patient UUID/CPN, no Day/Visit creation | Manuscript §§5,12,13; CONTRACT-01; Policy B controlled amendment V2, Authoritative bounded domain model and Lifecycle operations | application/services/create-case.js; case-create-repository.js; shared scenarios and preservation snapshot |
| Doctor-only clinical operations; optional Nurse without clinical authority transfer | Manuscript §§10–11/13; CONTRACT-03; V2 Normative recording, ownership and counting rules | backend/auth/authorization.js; withAuthorized; service and shared API denial tests |
| Session, origin and CSRF boundary | AUTHENTICATION-TECHNICAL-CONTRACT-V1.md and Stage 6 protected composition; bounded CASE_CREATE Protocol | auth-service.js; secured-patient-composition.js; CASE_CREATE and recovery injection tests |
| Atomic receipt, same-intent replay, current-session authorization and conservative unknown result | V2 Bounded future persistence/service representation; STAGE7-DOCTOR-CASE-CREATE-V1.md, Transaction and replay | AuthRepository.transaction owns COMMIT; service inserts Case/receipt on its client; foundation fingerprint helper; shared scenarios |
| No Visit/Day/arrival/CPN side effect | Manuscript §§5/13; CONTRACT-02/05/08 as qualified by CASE-LIFECYCLE-POLICY-B-RECONCILIATION-V2.md | source writes only Case/receipt plus legitimate auth-session touch; SQL preservation runner checks Patient/Day/Visit/facts/CPN |
| Preserved history and no browser data fallback | Manuscript §12/13; V2 history rules; CASE_CREATE increment scope | bounded SQL repository; no UI/client storage added; runtime populated-history/browser proof remains limited |
| Evidence classifications and proportionate repetition | docs/factory/ROBY-FACTORY-OPERATING-STANDARD-V1.md, Targeted Acceptance and Evidence sections | source vs memory/API vs real-PG vs browser reported separately here |
| Release and scope boundaries | current owner Full Mission; factory standard; CASE_CREATE Rollback and stop | no merge, release, deployment or downstream Visit/completion/reopen implementation |

Temporal reconciliation: FINAL-AUTHORITY-MAP-V1.md explicitly has AUTHORIZATION_EFFECT=NONE and records older authentication/migration NO states. V2's NEXT_CLINICAL_POSTGRESQL_IMPLEMENTATION=NOT AUTHORIZED describes the preservation stage. Later bounded Stage 7 owner grants and STAGE7-DOCTOR-CASE-CREATE-V1.md authorize this CASE_CREATE increment. These historical texts remain unchanged. Factory V1 still contains its original draft/adoption-pending language; later explicit Owner acceptance in the session governs process adoption without retroactively rewriting its historical text. No unresolved conflict was found requiring a clinical change for this test-only increment.

## Neculs / metadata findings

Repository-wide tracked-source/content inspection found no literal Neculs contract or executable Neculs policy mechanism. Do not equate this with a claim about artifacts outside the inspected repository.

Actual artifacts:
- metadata.json: name, description, requestFramePermissions=[], majorCapabilities=[MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API]. This is descriptive/platform metadata, not Doctor authorization or a grant to implement Gemini integration.
- ARCHITECTURE/DOMAIN-NUCLEUS-CLOSURE.md: Patient/Case/Visit/Day relationship representation proof; explicitly says workflow runtime, persistence, API and authentication NOT_IMPLEMENTED at that historical gate.
- ARCHITECTURE/MILESTONE-MR-ROBY-CLINIC-METADATA-CLOSURE-2026-09-24.md: surface metadata reconciliation; AUTHORIZATION_EFFECT=NONE, IMPLEMENTATION_EFFECT=NONE.
- ARCHITECTURE/CLINIC-SURFACE-BOUNDARY-V1.md: surface uses authorized application/API boundaries, does not own clinical authority or access SQL directly; definition-only.

Governance is documented and reviewed by the engineer. Runtime enforcement is ordinary auth/service/SQL code, not an observed metadata interpreter. No automated Neculs enforcement is claimed. If Owner intends a different external Neculs artifact, its exact source remains an input gate for that mechanism only; this mission does not invent it or modify metadata.

## Executed evidence

Environment: Work Linux, Node v24.19.0, npm 11.9.0, Vite 8.3.2; existing dependency installation reused via ignored node_modules links, lockfile unchanged. No credentials or real clinical data used.

At test-source commit 32db6e1bce4b644212f1307bab0afff4074a9d17:
- node --test backend/clinical/case-create.test.cjs: 13 PASS, 0 FAIL, 0 skipped, exit 0.
- npm run test:all: 329 PASS, 0 FAIL, 0 cancelled/skipped/todo, exit 0.
- npm run lint (tsc --noEmit): exit 0.
- npm run build: exit 0.
- git diff --check: exit 0; clean tracked working tree after source commit.

Official exclusion: src/services/clinic-authority-p37a.test.ts. PostgreSQL explicit runner is not invoked by test:all. No hidden exclusion added. 329 is this suite's actual result; 328 is earlier history, not relabeled. One new top-level test already entered at baseline 37e3d97; this mission strengthens its assertions without inflating the count.

Intermediate focused runs both passed 13/13. An intermediate full suite passed 329/329 and type/build checks passed; final checks were repeated after strengthening snapshots so no earlier deep equality coverage was weakened during extraction. No test failure occurred in these mission runs. Owner's older 327/1 and later 328/0 remain OWNER-REPORTED; no exact cause assigned to the older failure and no further investigation performed per Owner instruction.

Warnings retained: npm unknown environment config http-proxy; Vite native config warning for __dirname. Neither was suppressed. Raw TAP and command logs are in the delivery archive; hashes below.

## Acceptance matrix

| Requirement | Work evidence | Remaining acceptance |
|---|---|---|
| Doctor create, Nurse/no-session denial | shared service + real Fastify injection PASS | same shared API assertions now wired to PG; not run here |
| Origin/CSRF/cross-site denial | create and receipt endpoints PASS | PG-backed route negatives pending |
| Atomic Case/receipt, FK | source inspection + rollback model PASS | actual PG runner not run here |
| Replay and different Patient/summary conflict | shared scenarios PASS, API summary conflict PASS | PG rerun at delivered source pending |
| Concurrent requests | serialized memory model PASS, Case and receipt counts checked | multi-connection real PG pending |
| Lost response + authorized recovery | after-COMMIT acknowledgement fault model PASS; revoked session denial and fresh login recovery PASS | actual socket interruption during COMMIT/process restart not proven |
| No Patient/CPN/Day/Visit/arrival effects | source confirmed; PG runner snapshots available | updated real PG proof pending; this is not browser proof |
| Historical records | full existing Case/receipt snapshots compared through API replay/denials | nonempty Visit/Rx/closed-Day graph preservation not established by current fixtures |
| Browser | NOT RUN | no protected CASE_CREATE UI exists in this bounded increment; no fabricated demo substitute |
| Neculs runtime | NOT IMPLEMENTED / NOT OBSERVED | no executable governance engine claimed |

Real PG tooling: command discovery found no postgres, psql or docker; /usr/lib/postgresql absent. No disposable database available in Work was positively identified. No installation, cluster creation, SQL connection or migration was attempted. Owner's PostgreSQL 18.2 / ten scenarios / API-to-PG PASS is historical OWNER-REPORTED evidence, not execution of these strengthened assertions. Local Chromium/Chrome binaries were absent; a remote browser, even if present, would not establish access to the owner's Unix socket or a protected local CASE_CREATE UI.

## Termux acceptance (one gate at a time)

Do not run these as an unattended script. First verify delivered archive/bundle checksum. Use a NEW directory under HOME, never ~/ViP-Clinic- or a Golden checkout. Stop on any mismatch; do not reset/clean/overwrite.

1. git clone --branch work/astra-stage7-doctor-case-create-acceptance /absolute/path/STAGE7-CASE-CREATE-ACCEPTANCE.bundle "$HOME/roby-case-create-acceptance-<unique-suffix>"
2. In that exact new checkout, verify HEAD against delivery manifest, parent chain through 32db6e1 -> 37e3d97 -> 3c81458, git bundle verify, git fsck --full, clean status and expected diff. Bundle contains full history, no external prerequisite.
3. Set origin in THIS NEW checkout only to https://github.com/Mk-arch2030/ViP-Clinic-.git (the clone initially uses the bundle path). Install lockfile dependencies with npm ci. Inspect clean status. Do not request or expose credentials.
4. node --test backend/clinical/case-create.test.cjs (expected 13/13). Run official regression/type/build for independent device acceptance when agreed; expected 329, with historical P37A exclusion, not a preclaimed device PASS.
5. node backend/clinical/postgres-case-create-proof.cjs ROBY_C2_NEW_DISPOSABLE <EXACT_FINAL_HEAD>

The runner verifies exact clean source/approved branch shape/repository identity/foundation ancestry; validates only HOME/roby-stage7-pg-c1/data and socket, PG18, port55437, Unix-only listener and server identifier BEFORE creation. Creates a fresh random roby_stage7_c2_* database from template0; refuses reuse and never drops databases. Existing Owner proof databases untouched. Existing migration002 is exercised only in the fresh database, including empty down/up and populated-down refusal. No new schema migration is delivered. All generated databases retained on success/failure; stop and inspect on failure, no destructive retry/cleanup.

Expected real proof: 10 PG_SCENARIO_PASS entries, API_TO_REAL_PG=PASS, NO_VISIT_DAY_CPN_HISTORY_EFFECT=PASS, PG_SCENARIOS=10, REAL_PG_CASE_CREATE=PASS, exit0. Capture entire output and exit code outside source and hash it. The API flag covers expanded shared assertions at this source. This remains PENDING until actually executed. No automated merge or push is in this handoff.

## Verdict and remaining decisions

GO for independent Termux verification of the exact artifact. NO-GO for declaring complete end-to-end/clinical acceptance or release: current SQL evidence, browser proof and populated historical graph coverage are incomplete. No known critical implementation defect demonstrated; absence of such a finding is not a clinical safety certification.

No new clinical decision is needed to execute CASE_CREATE tests. Completion with active/zero Visits, overnight Day selection, repeated/simultaneous Visits and Nurse recording/Exit remain reserved and unimplemented. No new policy/schema/architectural change made. Production runtime remains unenabled. No protected branch writes, merge, deployment, credential or clinical database changes. Exact Git bundle is the fallback because authenticated native Git publication was previously unavailable; no substitute commit history is created.

## Evidence fingerprints

- `build.log` SHA-256 `340895850e3e6d3e29a2867517a46b192af8ec56d24bf81aa1531485a6761987`
- `final-build.log` SHA-256 `a71905fea31f6ad24218d09ec7754b0e5feab8d291d7c0c92e5540205e481cd3`
- `final-focused.log` SHA-256 `3d84d94ec25cb6b4d35102bd31364c30f49052ac9b3075498ac78b9f5028e6d6`
- `final-regression.log` SHA-256 `a046c41e6fc04c2242444a8de9d6fcc9d2a91a3e4ea3548938df318458eae9f1`
- `final-regression.tap` SHA-256 `c3a7e4362d089d65f2b5c2f33dd96db8de76c41c9811bdc37685a0321ef983a2`
- `final-results.json` SHA-256 `3cf0b8e7a92eb3130a8613a3eb098c85889b4863bbffd31dcde958a1bd11d3cf`
- `final-types.log` SHA-256 `3fa4b3073117fae3870a31295f620fd576b5eea6185d8b68af5bc3cfc69f7d96`
- `regression.log` SHA-256 `e32aeea49048ef014689f1b1842e8c56efd7b8e52d8a3e76bb77ab4168bfb10e`
- `regression.tap` SHA-256 `a3b6263c480136fb358366a23d804d8fb35d1995395fe116bdb9f2f4174cb378`
- `results.json` SHA-256 `7da7c902785fa2410387985e40791ade4dd0cc162e110773107d9675f75c7c55`
- `types.log` SHA-256 `3fa4b3073117fae3870a31295f620fd576b5eea6185d8b68af5bc3cfc69f7d96`

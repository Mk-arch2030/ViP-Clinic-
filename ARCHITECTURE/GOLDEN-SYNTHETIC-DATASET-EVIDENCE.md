# Golden Synthetic Dataset V1 — evidence and limits

Owner directive: preserve the original mock, extend it independently, and test the real persistence boundary without touching the owner database. Target branch: `work/golden-synthetic-dataset-postgres`. Source branch remote HEAD was verified before implementation and again before delivery: `work/original-clinic-postgres-unification` at `3caa11b0af88219e42d1e6dcf3c96ad2bd1c781b`. The target was absent; no concurrent target commits were overwritten.

## Evidence labels

| Label | Actual evidence |
|---|---|
| SOURCE_AUDIT_PASS | Current source, first application revision, domain contracts, schema, migration, repositories, auth services and representative later fixtures inspected. |
| BASELINE_HASH_PASS | Literal captures from both raw source snapshots equal the pinned canonical baseline; independent hash and relationship tests pass. |
| EXTENSION_VALIDATION_PASS | 47 complete scenario specifications; disjoint identities; graph, chronology and deterministic projection checks pass. |
| LOADER_SAFETY_PASS | Unit fake-adapter, SQL construction/catalog-model and pre-driver CLI refusal tests pass. This label is not live PostgreSQL safety proof. |
| POSTGRES_INTEGRATION_PASS | Owner-executed Termux PostgreSQL 18.2: dry-run, first load/readback, read-only verify, idempotent second load, clean process restart and custom backup/transactional restore into a distinct disposable cluster. Scope and source are recorded below; not live rollback/concurrency/crash-recovery/browser or full Stage 10 proof. |
| FULL_TEST_SUITE_PASS | Official runner after PostgreSQL catalog-format regression fixes: 271 passed, zero failed/cancelled/skipped; historical exclusion disclosed below. |

## Golden Baseline: provenance and immutability

Sources are `src/services/clinicStore.ts` at first application commit `c473be0b588078e40bd5c0554b8a24113277d7d5` and verified source HEAD `3caa11b0af88219e42d1e6dcf3c96ad2bd1c781b`. The last store change is `96fa03a17333ff23721799693151c5162199c2ab`. Byte-for-byte snapshots are retained as `backend/fixtures/golden/clinicStore.initial.ts.source.txt` and `clinicStore.current.ts.source.txt`; raw hashes and classifications are in `manifest-v1.json`.

Canonical artifact: `backend/fixtures/golden/baseline-v1.json`.

SHA-256: `2c29163ab399e99b70918bd179da5e9e2ce3e0df271cf5faeb290952321dba12`.

`capture.cjs` extracts only known AST literals from INITIAL_PATIENTS, INITIAL_CASES, INITIAL_VISITS, INITIAL_CLINIC_DAY and the empty-storage loadState return. It does not execute the store, access localStorage or generate IDs/timestamps. Object keys are sorted; values, array order, nulls and strings are preserved. Both historical captures are equal. Unknown/generated expressions fail. There is no regeneration writer or normal loader operation that changes this baseline. Fixed independent test and reference hashes fail on edits; an owner-authorized new version would require an explicit reviewed change.

Inventory: 3 patients with original UUIDs and CPNs 1001–1003; 3 cases C-001–C-003; 4 visits in original array order V-001, V-002, V-004, V-003; 4 prescriptions RX-V-001–RX-V-004, three authorized and one draft, containing six medication items; one seeded clinic day CD-2026-09-22 with counter 3. Demographics, histories, clinical encounter content, vitals, diagnoses, investigations, treatments, prescription states, authorization references, exits and follow-up decisions remain in the artifact. Case/visit/patient and prescription/visit relationships are validated. C-003 timeline is V-004 then V-003.

Historical gap GOLDEN-GAP-001: C-003.openedClinicDayId and V-004.clinicDayId reference CD-2026-09-20, which the source never seeded. These exact two references are retained and explicitly validated as known gaps. No invented clinic day repairs history.

Provenance classifications: literal seeds are confirmed historical mock; later store mutations using crypto.randomUUID and clocks are generated historical demonstration state, not seed; application tests, auth test harness, Stage 6 device FIXTURE and OriginalClinic tests contain later synthetic test data; arbitrary saved browser data is unknown provenance and excluded. Original historical names and values are preserved as the existing mock rather than renamed. New extension identities are explicitly fictional and non-dialable.

## Independent extension and roadmap inventory

Artifact: `backend/fixtures/extended/extended-v1.json`, kind EXTENDED_SYNTHETIC, version 1. SHA-256: `050b0692fb1afe0b6e95dc5b1e8c7ce0f75efdca648828d0c31bfdeae1d317f5`. Four new patients with CPNs 90001–90004 and independent fixed UUIDs; three cases; four visits; two clinic days. Same-name identities, blank profession, uncaptured versus captured-empty history, and all five past-history categories are represented. Extension validation rejects baseline identity/CPN reuse.

| IDs | Purpose |
|---|---|
| EXT-001–006 | Registration, return lookup, same-name identity, stable CPN, invalid input, uncertain mutation |
| EXT-007–011 | Chronic, allergy, surgery, family and lifestyle histories |
| EXT-012–019 | Cases, visits, follow-up, chronology and cross-patient isolation |
| EXT-020–032 | Consultation, vitals, investigation, diagnosis, treatment, prescription, follow-up and clinic-day operations |
| EXT-033–037 | Unauthenticated, expired, revoked, CSRF and doctor-only authorization denial |
| EXT-038–047 | Restart, backup/restore, idempotency, rollback, integrated journey, pilot and repeatable delivery |

Every scenario contains its stable ID, purpose, inputs, expected records/relationships/API behavior, required capability, minimum stage and implementation status. The full exact inventory is in the JSON and extension README.

| Minimum stage | Count | Evidence status |
|---|---:|---|
| 6 | 17 | 15 EXISTING_CAPABILITY_NEW_DATA_INTEGRATION_NOT_RUN; EXT-040/041 LOADER_UNIT_IMPLEMENTED_POSTGRES_NOT_RUN |
| 7 | 7 | SPECIFIED_NOT_IMPLEMENTED |
| 8 | 15 | SPECIFIED_NOT_IMPLEMENTED |
| 9 | 2 | SPECIFIED_NOT_IMPLEMENTED |
| 10 | 3 | SPECIFIED_NOT_IMPLEMENTED |
| 11 | 1 | SPECIFIED_NOT_IMPLEMENTED |
| 12 | 2 | SPECIFIED_NOT_IMPLEMENTED |

Total: 47. Thirty future-stage scenarios remain specified only. Having records/specifications does not implement those workflows or prove their PostgreSQL persistence. The independently pinned scenario catalog retains initial specification statuses; later execution evidence is additive in `backend/fixtures/evidence/termux-load-verify-v1.json`. Fixture idempotency was subsequently demonstrated on-device; forced-failure rollback remains unit-only.

## Loader and schema boundaries

Implementation: `backend/fixtures/loader/{cli,safety,schema-contract,postgres,core}.cjs`. Required token: `ROBY_GOLDEN_SYNTHETIC_FIXTURE_V1`; namespace: `ROBY_GOLDEN_V1_EXTENDED_V1`. Only database `roby_fixture_disposable_v1`, private Unix socket port 55449, TCP disabled, explicit disposable data/socket paths and PostgreSQL 18 cluster identity are accepted. Actual database/server/system identity is checked before schema or patient-row access. The owner database `roby_intake_proof_stage6`, port 55441 and known owner cluster IDs are refused. Ambiguous config, passwords/URLs, ambient DATABASE_URL/PG* configuration, symlinked path boundaries, unexpected schema/default/constraint/function/extension objects, non-owner execution and missing migration are refused.

Projection into actual project schema: 7 patients, 6 intake markers, 28 ordered history items, 3 clinic days. Full supported rows are compared on readback. Uncaptured history has no marker; captured-empty history has an empty marker. Existing repositories allocate random identities, so this special deterministic fixture projection uses parameterized SQL instead of altering the normal repository contracts.

The current backend schema cannot represent cases, visits, clinical encounters, prescriptions/authorization history or registeredAt. These six cases, eight visits and eight prescriptions remain in immutable artifacts and full JSONB archive under `roby_fixture.datasets`; archive storage is not implemented runtime clinical persistence. No field is silently discarded. The unseeded historical day remains absent.

Dry-run is read-only and creates a new exclusive local report file. First load requires the reviewed fresh plan bound to config/schema/dataset and existing database state. Load uses a serializable transaction, locks, ownership ledger and full-row/archived-payload hashes. Unowned identifier/CPN/day-date collisions fail. Second load verifies exact owned rows and returns ALREADY_LOADED_VERIFIED_NO_WRITES. Drift fails without overwrite. Unexpected non-fixture rows, other namespaces and auth-state fingerprints must remain unchanged. Insert/readback/preservation failures roll back new rows, ledger DDL and sequence reservation. The sequence never goes backwards; bounded decimal transactional ALTER SEQUENCE RESTART is used instead of nontransactional setval. Record values are SQL parameters. No cleanup, UPDATE, DELETE, TRUNCATE, startup hook, auth write, credential rotation or TLS action is supplied.

Wrong-database refusal is exercised both directly and in a child CLI process before the PostgreSQL driver is loaded. Tests inspect sanitized reports/errors; raw secrets and connection URLs are not printed. Auth tables are never returned to JS as secret-bearing rows; only SQL-side preservation fingerprints are compared.

## Executed verification

```bash
node --import tsx --test backend/fixtures/tests/*.test.cjs backend/fixtures/tests/*.test.ts
npm run test:all
npm run lint
npm run build
git diff --cached --check
```

New tests after PostgreSQL catalog-format regression fixes: 24 passed, 0 failed (7 baseline/graph/manifest, 8 loader safety/core, 6 schema/SQL/CLI, 3 API fixture tests). Official suite: 271 passed, 0 failed/cancelled/skipped/todo, RUN_ALL=PASS, REGRESSION_EXIT=0. Existing official runner exclusion remains `src/services/clinic-authority-p37a.test.ts` (EXCLUDED_HISTORICAL); no exclusion was introduced by this task. `npm run lint` runs tsc --noEmit: PASS. Vite production build: PASS; existing native-config warning concerning __dirname remains.

API tests use actual extension inputs, authenticated Fastify route injection, actual backend services and Web API client, with fake SQL clients. They cover distinct same-name server IDs/CPNs, blank profession and history round-trip, fresh-client retrieval, auth/CSRF/Nurse/expired/revoked denials, and the uncertain-mutation latch. These are HTTP injection/unit evidence, not real PostgreSQL or browser proof. Core tests use an explicitly named fake adapter; SQL contract tests inspect SQL/catalog models, not a running database.

The Work process is UID 0 with uid_map `0 0 1`; a safe unprivileged disposable PostgreSQL instance could not be provisioned. initdb root safeguards were not bypassed. Work-local PostgreSQL execution remains NOT RUN. Subsequent owner-executed disposable-device proof is recorded below; Work did not independently connect to the device. Live concurrency/forced-failure rollback and crash recovery remain NOT RUN; clean restart persistence and bounded backup/restore are now demonstrated below. No owner-operated Stage 6 database was targeted. No browser acceptance was performed for this dataset task.

### Owner-device preparation and search_path fix (2026-10-12)

The owner synchronized the first delivery and reported 269/269 tests, typecheck and build success on Termux. The separately authorized NEW disposable cluster initialized successfully with PostgreSQL 18.2; schema and intake migration were created there. Initial dry-run refused DATABASE_IDENTITY_MISMATCH before fixture inserts. Read-only diagnostics reported database, paths, sockets, port, disabled TCP, null TCP address, system ID and ownership all MATCH, with only search_path MISMATCH: actual `pg_catalog,public`, while the guard expected `pg_catalog, public`. This was a formatting defect in our identity guard, not a mismatched target. The fix compares the exact ordered, unquoted schema names after trimming whitespace around comma-delimited names; other schemas, order changes, duplicates and quoted names still fail. A regression test accepts both observed formats and rejects unsafe alternatives. All other identity gates remain exact. Device dry-run after the fix and actual fixture loading still require execution; POSTGRES_INTEGRATION_PASS is not claimed from provisioning or this diagnostic.

The owner then reported 270/270 tests and a second dry-run refusal SCHEMA_MISMATCH after identity validation. Read-only public catalog output showed the expected 24 columns, defaults, nullable fields, 21 CHECK/FK/PK/UNIQUE definitions, public-only schema and plpgsql extension. PostgreSQL deparses the known lowercase column `position` as `"position"`, both in CHECK definitions and the composite UNIQUE key. The initial parser did not account for those quotes. The fix normalizes only that exact known identifier: CHECK comparison and SQL adapter key parsing retain all other names and rules. A catalog-model regression test exercises the actual adapter with the observed quoting and rejects a different quoted uppercase identifier. This is catalog-model test evidence informed by owner-provided live output, not fixture-write proof. No schema alteration is required. Dry-run/load/reload/restore acceptance still awaits successful live execution.

### Owner-executed live fixture proof (2026-10-12)

At executed commit `0746593b7f482a88483f5c685b2fbf3514473d5a`, the owner supplied successful dry-run, load, verify and repeated-load output from `roby_fixture_disposable_v1`, private socket port 55449, PostgreSQL 18.2. The first load returned LOADED_AND_ROUNDTRIP_VERIFIED; read-only verify and repeated load both returned ALREADY_LOADED_VERIFIED_NO_WRITES. Counts were 7 patients, 6 intakes, 28 history items and 3 clinic days. Baseline/extension/combined/projection hashes match the committed manifest; verifiedRowsHash `75535834f970cf634b3e3b612edc34b73ca87ce43f34e31e6ee4a08667d10995` matches the expected supported-row checksum. StateHash remained `a40b6e3cd65025e5060316cdccc88a6b449df7bb8d8b6cafa26f20bc2f5da494` across load result, verify and repeated load. ClinicalPersistence remained NOT_IMPLEMENTED, with 6 cases/8 visits/8 prescriptions archived only and credentialWrites 0.

Additive machine-readable evidence is `backend/fixtures/evidence/termux-load-verify-v1.json`. Attribution is owner-executed output, not an independent Work connection. This earns POSTGRES_INTEGRATION_PASS only for the bounded loader/readback/idempotency scope. At that point it did not prove restart or backup; subsequent sections record those additional bounded proofs. Live rollback/concurrency/browser and future-stage completion remain unclaimed.

The owner also supplied the official device suite result: 271 tests, 271 pass, zero fail/cancelled/skipped/todo, RUN_ALL=PASS, REGRESSION_EXIT=0, same existing historical exclusion. A different Termux session later ended with signal 9 after all three fixture commands had passed while the full suite ran in another session. Cause is not established; a successful commit is not undone by a later shell termination. Whether the disposable PostgreSQL process survived that event requires read-only status/verify. No automatic reinitialization or reset is appropriate.

The owner subsequently provided post-event status/verify: PostgreSQL still ran as PID 2885 and the same loaded state/row hashes were verified without writes. Then, at code commit `3b93fc45e60dbdbb8e5aed97d23dc1daf82da824`, an explicit smart restart targeted only the designated disposable cluster. PostgreSQL stopped cleanly and started as PID 13474; before/after verify both returned ALREADY_LOADED_VERIFIED_NO_WRITES, unchanged counts, supportedRowsHash and stateHash. This proves clean process restart persistence. It does not prove crash recovery or backup/restore. The machine-readable evidence now includes both events.

### Owner-executed isolated backup/restore proof (2026-10-12)

At code commit `3e0bc87965d3cd5ceb6283a12e09c8ccc350f2d3`, the owner supplied pg_dump 18.2 custom-format backup success from the disposable source, with SHA-256 `098af6164b6b544028b55ca92983ed2d6c5275fe33ab45b9cafd5adf90ff1de3`. The archive TOC was readable and a source-verify JSON was captured beside the dump. No existing backup file was overwritten.

Restore targeted a NEW cluster rooted at `roby-golden-fixtures-disposable-restore1`, not the source or owner Stage 6 cluster. It used its own private socket, no TCP, the same allowed disposable database name/port and a verified DIFFERENT system identifier. pg_restore ran with single-transaction, exit-on-error, no-owner and no-privileges into the newly created database. Restored loader verify returned ALREADY_LOADED_VERIFIED_NO_WRITES. The comparison checked namespace, baseline/extension/combined/projection/supported-row hashes and both supported and archived-only counts against the pre-backup report; BACKUP_RESTORE_FIXTURE_INTEGRITY=PASS was emitted. Reported stateHash also matched, though fixture proof relies on the fixture checksums/counts rather than requiring unrelated state to remain identical in general.

This is real owner-executed isolated dataset backup/restore evidence, recorded additively in the device evidence JSON. It proves recovery of the supported records plus the full canonical archive for this snapshot. It does not establish doctor credential backup/restore, crash recovery, production recovery objectives, deployment readiness or full Stage 10 completion. No doctor credentials were provisioned in these fixture databases.

## Recovery preparation and next safe execution

`backend/fixtures/verification-manifest-v1.json` pins dataset/projection/normalized supported-row checksums, counts and case timelines. Combined dataset checksum is `22302291312e6a88c587535882ff2486a8aa1a22d510366da26f4c24b961dab5`. `verify` is read-only and checks owned rows plus full archive. The preparation manifest retains its original NOT_RUN capture status as an expected reference, not a current execution ledger. Subsequent isolated backup/restore execution is recorded in the additive device evidence. Full Stage 10 remains incomplete.

Provisioning instructions and exact strict config are in `backend/fixtures/loader/README.md`. Provision a NEW separately authorized disposable cluster, never the owner's existing one. Config must use its actual system identifier and absolute paths. After provisioning and review:

```bash
node backend/fixtures/loader/cli.cjs dry-run ROBY_GOLDEN_SYNTHETIC_FIXTURE_V1 /ABSOLUTE/fixture-config.json /ABSOLUTE/fixture-plan.json
node backend/fixtures/loader/cli.cjs load ROBY_GOLDEN_SYNTHETIC_FIXTURE_V1 /ABSOLUTE/fixture-config.json /ABSOLUTE/fixture-plan.json
node backend/fixtures/loader/cli.cjs verify ROBY_GOLDEN_SYNTHETIC_FIXTURE_V1 /ABSOLUTE/fixture-config.json /ABSOLUTE/fixture-plan.json
```

Review dry-run before load. Execute second load, controlled rollback/collision/unrelated-record tests, restart and re-verify in that disposable environment. Backup and restore into a second freshly authorized disposable cluster with its own reviewed identity config, then compare fixture fingerprints. Do not reuse the freshness stateHash as a fixture-only checksum after legitimate unrelated changes.

## Preservation, risks and change inventory

Only 24 new files are introduced: 7 golden files, 3 extension files, 5 loader code files plus loader README, dataset.cjs, 4 test files, verification-manifest-v1.json, the additive device evidence JSON and this report. No existing source-branch file is modified or removed. Complete listing is available via `git diff --name-status 3caa11b0af88219e42d1e6dcf3c96ad2bd1c781b..HEAD`.

Original clinicStore, App, outer doctor gate, shared auth, protected visual theme and four protected owner paths are unchanged. No duplicate Server Patients navigation was added. No secrets/new real patient data, credential/TLS changes, migrations to existing databases or deployment occurred.

Remaining blockers: live forced-failure rollback, concurrency and injected drift/preservation scenarios; live API/browser dataset journey; Stage 7–12 runtime contracts; crash recovery, credential recovery and full Stage 10 readiness. Live schema compatibility, first load, readback, idempotency, clean restart and isolated fixture backup/restore were demonstrated on the designated disposable device databases. Strict schema recognition intentionally fails closed if provisioning differs; review additive contracts instead of weakening the guard to run against another database. Historical names/phones are preserved solely as owner-directed original mock provenance; extension identifiers are independently synthetic.

Safe owner Sync is code-only: fetch the target, inspect remote history and file list, then switch/create its tracking branch and pull --ff-only. Preserve dirty local work; stop if Git reports an overwrite conflict. Never stash/reset/clean the four protected files. Stop only the owned HTTPS listener before changing a running runtime's source; leave PostgreSQL and credentials untouched. Run npm ci, npm run test:all, npm run lint and npm run build. Sync does not load fixtures or provision a database. The loader requires a separate disposable-environment decision.

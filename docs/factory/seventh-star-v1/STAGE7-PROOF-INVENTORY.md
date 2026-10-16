# Proof inventory and provenance

Mission: RBF-VIP-STAGE7-SEVENTH-STAR-001

Owner: MOHAMED.K_ROBY. Prepared by Astra, 2026-10-16. Inspected source: `91966c657c7357fca1c3476966b9199207d1f484`. Documentation only; no clinical release.

## E1 — Work logs, inspected bytes (VERIFIED)

Source 32db6e1bce4b644212f1307bab0afff4074a9d17. Environment Work Linux, Node24.19.0/npm11.9.0/Vite8.3.2 per execution record; dependencies reused through ignored node_modules links. Original directory /workspace/scratch/85bc0af0f9e1/stage7-full-acceptance-evidence. Copies included in delivery evidence/work/; hashes recomputed during this documentation mission.

Commands and recorded outcomes: `node --test backend/clinical/case-create.test.cjs` 13/13 exit0; `npm run test:all` 329/329 exit0, no skipped/cancelled/todo; `npm run lint` (tsc --noEmit) exit0; `npm run build` exit0. Raw final-regression.tap contains test outcomes; final-results.json records exit codes. These are inspected prior execution records, not new runs in this mission. P37A excluded by scripts/run-all-tests.cjs; PostgreSQL runner is explicit and is not part of test:all. 13 is a subset of329; 10 SQL scenarios are a separate environment execution, not 352 unique tests.

| File | Recomputed SHA-256 |
|---|---|
| `final-build.log` | `a71905fea31f6ad24218d09ec7754b0e5feab8d291d7c0c92e5540205e481cd3` |
| `final-focused.log` | `3d84d94ec25cb6b4d35102bd31364c30f49052ac9b3075498ac78b9f5028e6d6` |
| `final-regression.log` | `a046c41e6fc04c2242444a8de9d6fcc9d2a91a3e4ea3548938df318458eae9f1` |
| `final-regression.tap` | `c3a7e4362d089d65f2b5c2f33dd96db8de76c41c9811bdc37685a0321ef983a2` |
| `final-results.json` | `3cf0b8e7a92eb3130a8613a3eb098c85889b4863bbffd31dcde958a1bd11d3cf` |
| `final-types.log` | `3fa4b3073117fae3870a31295f620fd576b5eea6185d8b68af5bc3cfc69f7d96` |

Warnings retained: npm unknown env config http-proxy; Vite native config __dirname warning. No warning suppression or new test exclusion. Intermediate Work logs are retained in the delivery too: earlier 329/329 preceded stronger snapshots, hence final rerun; no failures in those recorded runs.

## E2 — Termux regression (REPORTED — NOT INDEPENDENTLY VERIFIED)

Owner pasted official post-integration result:329 tests,329 pass,0fail,0skipped,48827.863388ms, RUN_ALL=PASS, REGRESSION_EXIT=0. Device log: /data/data/com.termux/files/usr/tmp/roby-run-all-YHr9MV/tests.log. Full original log bytes and checksum not supplied; no checksum invented. Recorded source context: integration91966c6. Owner executed, Work did not access device.

## E3 — Termux focused / integration (REPORTED — NOT INDEPENDENTLY VERIFIED)

Owner pasted13/13,0fail,0skipped,3125.523921ms and POST_INTEGRATION=PASS in ~/ViP-Clinic-. Command checked exact HEAD91966c6 then ran node --test backend/clinical/case-create.test.cjs and tracked-diff checks. No standalone log hash supplied. Untracked gemini-vip-complete.bundle was retained; do not describe the entire owner working tree as clean.

## E4 — Termux real PostgreSQL (REPORTED — NOT INDEPENDENTLY VERIFIED)

Owner executed runner at91966c6 in /data/data/com.termux/files/home/roby-stage7-acceptance.qf8qik/checkout. Original log: /data/data/com.termux/files/home/roby-stage7-acceptance.qf8qik/postgres-proof.vz0zhF.log.
Reported SHA256:45bf372392f5a54893db3278bfcb13b2ae159e4ad9f227df40ef6b0ea82cbf38. Hash was not recomputed here because original bytes were not accessible.

Pasted output: NEW_DISPOSABLE_DATABASE=roby_stage7_c2_3d99473339826fdef115; SOURCE_HEAD=91966c657c7357fca1c3476966b9199207d1f484; SYSTEM_IDENTIFIER=7696136196847366706; EMPTY_ROLLBACK_AND_REAPPLY=PASS; ten named PG_SCENARIO_PASS entries; API_TO_REAL_PG=PASS; NO_VISIT_DAY_CPN_HISTORY_EFFECT=PASS; PG_SCENARIOS=10; REAL_PG_CASE_CREATE=PASS; PROOF_EXIT=0; BROWSER_PROOF=NOT_RUN. Database retained.

Environment provenance: Owner previously reported PG18.2, Unix-only HOME/roby-stage7-pg-c1/socket, port55437. Inspected runner validates PG18 cluster metadata and identity, uses a fresh random database, never reuses/drops existing proof databases. Output plus source support the attributed result; they are not Work SQL execution or independent log-byte verification.

## E5 — failures retained

Earlier Owner regression327pass/1fail of328,83026.941672ms,exit1, log /data/data/com.termux/files/usr/tmp/roby-run-all-oDQU8G/tests.log. Later328/328,42754.191585ms,exit0, log roby-run-all-b6lRPi/tests.log in same temp directory. Owner associated the first run with Termux in background; exact failing subtest/cause was not inspected. The later pass does not prove that cause. Investigation was stopped at Owner request; failure remains recorded.

PG first attempt: FAILED_PHASE=ISOLATED_CLUSTER_IDENTITY, ECONNREFUSED,exit1; log /data/data/com.termux/files/home/roby-stage7-acceptance.qf8qik/postgres-proof.SZ7iFQ.log; reported SHA256 edb5d02fde8fde9dfb7f0ad9b40f28cb4587fc6694da0ec6ea3973ecbe2d0d85. Owner then showed pg_ctl no server running; startup returned server started with another-server warning; next guarded run E4 passed. Source places the failed connection before CREATE DATABASE. Not a failed clinical assertion; no invented cause for the separate327/328 failure.

## E6 — current Git verification (VERIFIED)

This mission ran git ls-remote --heads origin refs/heads/work/stage7-astra-integrated, git fetch --no-tags origin refs/heads/work/stage7-astra-integrated, and rev-parse FETCH_HEAD: exact91966c6. Parent history inspected; no protected ref updated. Owner's prior non-force push and independent REMOTE_SYNC=PASS remain historical supplied output, corroborated by the current ref.

## E7 — historical evidence, scope-limited

ARCHITECTURE/STAGE7-FOUNDATION-TERMUX-ACCEPTANCE-2026-10-13.md at25fc7ab records316-test acceptance; older Golden271 and CASE_CREATE328 are historical scopes. CLOSED/PROVEN labels do not establish current runtime. Earlier ARCHITECTURE/STAGE7-CASE-CREATE-ACCEPTANCE-MISSION-V1.md says PG pending at its authoring time; later E4 is additive reported acceptance, not an edit to that historical report.


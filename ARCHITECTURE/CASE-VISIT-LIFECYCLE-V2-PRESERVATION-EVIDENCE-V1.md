# Case / Visit lifecycle V2 — preservation evidence V1

OWNER = MOHAMED.K_ROBY
EXECUTION_DATE = 2026-10-13 / Africa/Cairo
SOURCE_BASE = b72192aed65f810b794f6d69b8e49c18622a3945
BRANCH = work/clinical-unification-policy-b-v2 / LOCAL ISOLATED DEVELOPMENT
NEXT_CLINICAL_POSTGRESQL_IMPLEMENTATION = NOT AUTHORIZED

## Recovery and exact amendment

Original worktree, branch and all 15 uncommitted increment files were recovered in place. Before any new change, regenerating tracked+untracked binary diffs reproduced the reported original patch byte for byte: SHA-256 50c4b0b37b6091f41b63f68a39197e6b422e9fb660da98e7d3280bcea2c3e3b7. There were five modified and ten new files, no independent owner changes. All four new tests were explicitly staged/tracked without broad git add.

Recovered increment commit: 1222e50e83bca51bf89e4ad232a40f69da882603. Exact owner-approved Manuscript §5/§13 plus decision record commit: f750bbf900d463be088920d5964c3e5c5274215d. The original V2 proposal and proposal wording remain in that first commit. Current reconciliation/evidence is a subsequent separate commit; its exact SHA is reported in the final handoff, not invented inside this self-referencing record.

Owner-approved replacement text was read completely from the proposal. Original anchors matched the b72192a Manuscript exactly. Inverting only the two authorized replacements reconstructs original bytes, preserving all other sections, including §17/§18. Previous Manuscript SHA-256: 3459294cbe575a07b9dc98423b94aa8860e981d831ac2d829491993bbf5eca49; amended SHA-256: 3c0daf1f212d4bbca8eaaee0b3d1efa38eac03aac12789da815d4db3829be1be. Exact amendment rationale/scope is in CASE-VISIT-LIFECYCLE-MANUSCRIPT-AMENDMENT-DECISION-V1.md.

## Current execution results — not historical totals

Tests ran on the recovered/current worktree after the exact amendment, with all new tests indexed. Production source and test bytes are identical to recovered increment commit 1222e50; subsequent changes are documentation only. No claim is made that an as-yet-uncreated commit was the executed SHA.

| Command / check | Actual current result |
|---|---|
| npm run test:all | 294 tests, 294 pass, zero fail/cancelled/skipped/todo, exit0; all four new tests included by tracked-file runner |
| Independent combined selection | 48 applicable tracked+untracked test files; 294 tests/pass, zero fail/cancelled/skipped/todo, exit0 |
| npm run lint | tsc --noEmit, independently confirmed exit0 |
| npm run build | Vite production build exit0; existing __dirname/native-config warning retained |
| Git diff and index whitespace checks | exit0 |
| Protected path/history comparisons | No differences to baseline outside authorized scope; Standalone clean at 85c75dd1d7ad40aba7c71c757f6b902a93b1eee1 |

Exact combined command construction: get `git ls-files --cached --others --exclude-standard -z`; deduplicate and select paths ending test.js/cjs/ts/tsx; exclude only the pre-existing src/services/clinic-authority-p37a.test.ts; run `node --import tsx --test --test-reporter=tap` with the full argument array. No new exclusion, cancelled, skipped or todo case. The historical P37A selection was NOT RUN separately. Unconditional module console PASS/FAIL=0 prints are not evidence; Node summary/exit controls the claim.

Runtime/toolchain: Node v24.19.0, npm11.9.0, Git2.51.1, ICU78.3, tzdata2026b, host zone America/New_York. Contract09 years-only calculateAge remains byte-preserved; detailed date-only reference is repaired and tested in four zones. Existing npm http-proxy warning is not hidden. No dependencies/package lock changed in this operation.

Local evidence at /workspace/scratch/85bc0af0f9e1/preservation-evidence: official-tests.log (SHA-256 17f7d8f32ec276736d0e608300392b559c0814bb1d1630a15ececf17de94817d), combined-tests.log (b25280267f3a7868f670bc77ad57a25ac8828002a3e58c18e49e24c5454655d2), combined-test-manifest.json, recovered-file-manifest.json and manuscript-validation.json. These paths are Work-session artifacts; the aggregate results/limits are preserved in this repository record. Full log/commit/bundle identities are also in the final report.

## Intermediate attempts and limitations

No test failed during this preservation operation. Earlier engineering's ten baseline detailed-age failures and repaired DOM harness attempts remain in the unchanged prior report; they are not relabeled as current results. A branch-rules metadata URL probe returned INVALID_ARGUMENT because its path was rejected; that probe is not protection evidence. Supported repository ruleset read returned an empty collection and repository metadata reported push/admin permissions; native Git transport availability still required an independent check.

The non-writing native Git push dry-run failed, exit128: HTTPS username could not be read with terminal prompts disabled. No credentials were read/modified/requested and no remote refs were created. Remote publication is BLOCKED for exact local commits; no connector-generated different commit history is substituted. Keep exact verified local commits and an incremental Git bundle. Before any later push, independently recheck absence/divergence/protection and do not force-push or merge protected branches.

Real PostgreSQL: BLOCKED/NOT RUN. No psql/initdb/pg_ctl found; current UID0 mapping is `0 0 1`; no positively identified safe disposable target or unprivileged PostgreSQL environment. No connection, schema, migration, fixture, clinical row, credential or database write. Real browser: BLOCKED/NOT RUN, Chromium executable unavailable. Prior browser installer failure is historical infrastructure evidence, not a new attempted browser PASS. DOM + fake SQL/fake lock adapter is not real browser/PostgreSQL/Web Locks proof.

Protected authentication/authorization and original Patient path are exercised by local unit/HTTP injection/DOM tests. Real current end-to-end HTTPS/PG/browser acceptance remains unproven. The persistent Patient registration marker is only a same-origin cooperating-client denial guard; site-data clearing/other profiles/devices/direct API/older clients bypass it. No server receipt or unknown-outcome resolution UI exists. Pure Policy B calendar computation is not Case reopening. Clinical Cases/Visits/services/APIs/tables remain absent in the protected runtime. Golden backup/restore proves only its historical fixture scope, not a new clinical graph.

## Gate snapshot and stop

A — PASS for exact approved product amendment and bounded contract reconciliation; remaining clinical guards explicitly gated, runtime not implied.
B — PASS for source/index/history integrity and isolated reviewed changes.
C — PASS for freshly executed current 294-test official and combined selections, lint and build; named historical exclusion disclosed.
D — BLOCKED for required real PostgreSQL/browser/native Web Locks/clinical recovery proof; capability limitations separately stated.
E — LOCAL PRESERVATION established for first two commits and completed by the separate reconciliation/evidence commit; REMOTE PRESERVATION BLOCKED by native Git authentication. Final local SHA, bundle verification and unchanged remote baseline are independently reported after commit creation.

No Case/Visit PostgreSQL build, SQL/migration, clinical-data/credential write, owner Termux operation, deployment, protected merge, PR or Issue #1 modification. STOP after preservation/report. Stage7 completion and clinical release are NOT CLAIMED.

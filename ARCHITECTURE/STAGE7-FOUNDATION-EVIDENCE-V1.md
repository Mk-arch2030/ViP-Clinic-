# Stage 7 foundation execution evidence V1

Date: 2026-10-13. Owner: MOHAMED.K_ROBY.
Scope: independent structural Increment A, not clinical runtime acceptance.
Source commit: fd72ea49dabeda07b466645219c73143c2d8d0d3.
Parent: ccc13cb52c208ce6f9bd09e76e46d29ff7d1a876.
Branch: work/stage7-case-visit-policy-b-implementation.

## Intake / preservation

Native read-only git ls-remote independently returned the source branch at
ccc13cb52c208ce6f9bd09e76e46d29ff7d1a876 and Golden at
b72192aed65f810b794f6d69b8e49c18622a3945. The clean recovered checkout retained
the exact 1222e50 → f750bbf → ccc13cb chain. A new isolated worktree was created
from ccc13cb. No old commits, Manuscript, contracts, historical evidence, fixtures,
protected owner files, original UI or Standalone were edited. Six added source/
design/test paths comprise the implementation commit. This new evidence document
is a separate documentation commit, not a modification of previous proof.

## Executed checks

Working directory: /workspace/scratch/85bc0af0f9e1/stage7-dev.
Tests ran with HEAD ccc13cb plus the exact staged six-file source tree now in
fd72ea4. No source changed between those runs and that commit.

| Command | Fresh result / exit |
|---|---|
| node --test backend/persistence/clinical-foundation.test.cjs | 22/22, fail 0, skipped 0, cancelled 0, todo 0; exit 0 |
| npm run test:all | 316/316, fail 0, skipped 0, cancelled 0, todo 0; exit 0 |
| Independent node --import tsx --test --test-reporter=tap selection | 49 files, 316/316, fail 0, skipped 0, cancelled 0, todo 0; exit 0 |
| npm run lint | tsc --noEmit; exit 0 |
| npm run build | Vite production build; exit 0 |
| git diff --cached --check | exit 0 |
| git fsck --full | exit 0 |

Independent selection: deduplicate git ls-files --cached --others
--exclude-standard -z; select paths ending test.js/cjs/ts/tsx; exclude only
src/services/clinic-authority-p37a.test.ts. This is the existing historical
exclusion; it was NOT RUN separately. No additional exclusions. All new tests
were staged before running the official tracked-file runner. Node summaries
and exit codes, not embedded module PASS/FAIL strings, support counts.

Node v24.19.0; npm 11.9.0; Git 2.51.1; Vite 8.3.2. Dependencies copied unchanged
from the existing recovered checkout. No package/lock change or install upgrade.
Warnings retained: npm unknown http-proxy environment config; Vite native-config
__dirname warning. No warning suppression. No test failed in this increment.
An exploratory read of nonexistent backend/auth/service.js returned exit 2;
this was a file-discovery miss, not a test result or an executed service.

Evidence directory: /workspace/scratch/85bc0af0f9e1/stage7-evidence.
Full log SHA-256:

- official-full.log: c56cc4bc5efb812e7882c6d7efedac8f1ff4b4bd14ccca5c11ea2e1fb73f013a
- combined.log: b2c60dc736f29385cb34595aea69772f46dccf849736bb67dd9f21b955f53193
- foundation-tests.log: 624f1db2b220d10fd5af191235dbf4aab29ea8b9f5f1febfed5ade1952baa8fd
- lint.log: 3fa4b3073117fae3870a31295f620fd576b5eea6185d8b68af5bc3cfc69f7d96
- build.log: ff57ef03654f31ae0fd23ec7043133dec4a04343f878718cb6be5a0d07cd4bda

Six-file reviewed binary diff SHA-256 before commit:
af8dd3ba89bb3ddf7b77d7514fdb5476e6287ed95c0dec1a548b8bdf78126993.
combined-manifest.json and source-verification.json preserve selection and file
hashes. Local log paths may not survive a future environment; aggregate proof
and hashes are preserved here. Final commit/bundle identities are in the handoff.

## Unexecuted checks and exact limits

Real PostgreSQL: BLOCKED. postgres/initdb/psql/docker/podman were not on PATH;
no PostgreSQL executable was found in inspected standard locations. No positively
identified disposable target exists. No database URL, owner database, credential,
schema or clinical data was accessed. Both migration scripts remain unexecuted.
SQL constraints/triggers, transaction rollback, durable receipt commit/replay,
concurrency, lost acknowledgement and backup/restore therefore remain NOT PROVEN.

Real browser: BLOCKED. No chromium/google-chrome executable or standard local
browser installation was found. No new browser integration is implemented.
Existing DOM tests do not establish real browser/Web Locks/PostgreSQL E2E.

The read adapter test explicitly uses fake query results. The history and receipt
tests are pure computations, not authenticated clinical transitions. Existing
auth/API regression ran; no new Stage 7 API/auth negative test can be claimed
because no new service/route/capability is exposed. No new clinical payload is
placed in browser recovery metadata.

Increment A: IMPLEMENTED SOURCE / UNIT TESTED / PG ACCEPTANCE BLOCKED.
Increment B: NOT STARTED; first independent candidate is Doctor CASE_CREATE
with transaction-owned receipt after PG foundation proof.
Increment C: BLOCKED on active-Day, same-day/concurrent Visit and optional Nurse
decisions. Completion additionally blocked on active/zero-Visit decisions.
Increment D: NOT STARTED; depends on secured API + real persistence proof.
Decision alternatives and recommendations are in STAGE7-FOUNDATION-IMPLEMENTATION-V1.md.

No remote publication is authorized for this branch. No push, PR, merge, Issue #1
write, database/migration execution, credential change, owner Termux operation,
deployment or clinical release occurred. Stage 7 is NOT COMPLETE.

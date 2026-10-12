# Golden fixture loader V1

This tool has no application startup hook. Its import has no database/network side
effects. It never targets the owner's `roby_intake_proof_stage6` (port 55441).
It accepts only a separate PostgreSQL 18 cluster and database
`roby_fixture_disposable_v1` on Unix socket port 55449, TCP disabled, with its own
explicit system identifier and a disposable directory boundary. There is no cleanup
command, no truncation, no UPDATE/DELETE and no credential/TLS writes.

## What is loaded

Actual project tables: 7 patients (original UUIDs/CPNs retained), 6 intake markers,
28 ordered Past History items with deterministic technical UUIDs and 3 existing
Clinic Day representations. An uncaptured history has no intake marker; a saved
empty history has a marker with zero items. The complete canonical snapshot is also
archived in `roby_fixture.datasets` under `ROBY_GOLDEN_V1_EXTENDED_V1`.

Cases, Visits, encounter details, prescription and authorization history and
registeredAt are retained exactly in the archive/artifacts, not exposed as runtime
clinical tables. They are NOT implemented PostgreSQL clinical capabilities. The
historically referenced but unseeded day CD-2026-09-20 remains a documented gap;
this loader does not invent a row for it.

`PatientRepository` cannot preserve fixture IDs because createPatient always
allocates a new UUID. `PatientIntakeRepository` creates random item UUIDs. Therefore
the loader uses parameterized SQL for this special fixture projection, then compares
full round-trip rows to the existing schema's supported representation. The API
integration tests separately exercise the actual services and Web client with the
extension inputs; those tests use fake SQL clients and are not database proof.

## Disposable provision procedure — separate approval required on owner's device

Do not run this procedure in any existing owner cluster. It is supplied for a future
explicitly approved disposable environment; no database has been provisioned by the
loader. Use PostgreSQL 18 executables as a regular unprivileged OS user. Choose a NEW
absolute root named `roby-golden-fixtures-disposable` or that name plus an alphanumeric
suffix. Stop if the root exists. Never reset it to make a test pass.

Example, after a disposable environment is separately authorized:

```bash
fixture_root="$HOME/roby-golden-fixtures-disposable"
test ! -e "$fixture_root" &&
mkdir -m 700 "$fixture_root" &&
mkdir -m 700 "$fixture_root/socket" &&
initdb -D "$fixture_root/data" -A trust --no-locale -E UTF8 &&
pg_ctl -D "$fixture_root/data" -l "$fixture_root/server.log" \
  -o "-c listen_addresses='' -c port=55449 -c unix_socket_directories=$fixture_root/socket" -w start &&
createdb -h "$fixture_root/socket" -p 55449 roby_fixture_disposable_v1 &&
psql -X -h "$fixture_root/socket" -p 55449 -d roby_fixture_disposable_v1 \
  -v ON_ERROR_STOP=1 \
  -f backend/persistence/schema.sql \
  -f backend/persistence/migrations/001-patient-intake.sql
```

The Unix socket directory is private; trust is only for this disposable, local,
TCP-disabled cluster. No doctor credentials are created. `vip_auth` is optional; if
provisioned from the actual auth schema its existing state is only hashed for
preservation, never copied to logs or altered by the loader.

Create a NEW local JSON config with exactly these keys, using the actual system ID
read from `(pg_control_system()).system_identifier::text` in the new database:

```json
{
  "database": "roby_fixture_disposable_v1",
  "port": 55449,
  "user": "YOUR_REGULAR_OS_USER",
  "dataDirectory": "/ABSOLUTE/roby-golden-fixtures-disposable/data",
  "socketDirectory": "/ABSOLUTE/roby-golden-fixtures-disposable/socket",
  "systemId": "ACTUAL_NEW_CLUSTER_SYSTEM_ID",
  "namespace": "ROBY_GOLDEN_V1_EXTENDED_V1"
}
```

Passwords and URLs are forbidden config keys. Ambient PG* and DATABASE_URL values
are rejected. Directly importing the core also requires token/config validation.
Only the explicit config target is contacted. Wrong identity is refused before
schema or patient-row access. Owner cluster identifiers are denied as well as names.

## Commands

Use actual absolute config/plan paths in place of the examples. Dry-run writes a
new local report file exclusively; it performs a read-only database transaction.

```bash
node backend/fixtures/loader/cli.cjs dry-run \
  ROBY_GOLDEN_SYNTHETIC_FIXTURE_V1 /ABSOLUTE/fixture-config.json /ABSOLUTE/fixture-plan.json
```

Review its counts, unsupported fields, namespace and fingerprints. First load needs
that fresh plan and refuses a changed database/schema/dataset/config. Load is allowed
only in the designated disposable database:

```bash
node backend/fixtures/loader/cli.cjs load \
  ROBY_GOLDEN_SYNTHETIC_FIXTURE_V1 /ABSOLUTE/fixture-config.json /ABSOLUTE/fixture-plan.json
```

Second load validates every owned row and full archived snapshot and returns
ALREADY_LOADED_VERIFIED_NO_WRITES. It never reclaims conflicting IDs or updates drift.
Original and unexpected non-fixture rows stay unchanged. If a fixture row, marker,
archive or sequence floor drifts, it fails. Any insertion/readback/preservation error
rolls back all new rows, the ledger DDL and the transactional sequence restart.

The global CPN sequence advances only when required to reserve the explicit fixture
CPNs, never backwards. Its restart uses transactional ALTER SEQUENCE, not setval.
A validated BigInt decimal is interpolated only for this PostgreSQL DDL that cannot
accept a parameter; all record values are bound SQL parameters.

## Restore verification (Stage 10 remains NOT RUN)

```bash
node backend/fixtures/loader/cli.cjs verify \
  ROBY_GOLDEN_SYNTHETIC_FIXTURE_V1 /ABSOLUTE/fixture-config.json /ABSOLUTE/fixture-plan.json
```

Verify is read-only. Compare datasetHash, expectedProjectionHash, verifiedRowsHash
and counts with `backend/fixtures/verification-manifest-v1.json`. The archive hash
includes unsupported history too. Do not compare stateHash after legitimate unrelated
record/auth changes; it is a first-load dry-run freshness guard, not a fixture-only
backup checksum. A restored cluster has a new identity and needs its own explicit
reviewed config, even when restored fixture contents match.

A later real proof should run first load, verify, second load with zero additions,
forced-failure rollback and unrelated-row preservation in a fresh database. Restart
only that disposable process and verify again. Run pg_dump/pg_restore into another
fresh designated disposable cluster, then verify the same fixture fingerprints.
No Stage 10 completion is claimed until that cycle is actually executed.

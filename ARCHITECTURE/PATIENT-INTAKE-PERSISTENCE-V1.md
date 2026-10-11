# Patient intake persistence — V1

Date: 2026-10-11 (Africa/Cairo)
Owner: MOHAMED.K_ROBY
Source: Mk-arch2030/ViP-Clinic- at 97fe70a71e9d67aa443c47ee9e2343e990b2b205
Status: source implementation approved for commit/push by the owner on 2026-10-11
at 12:23 Africa/Cairo. Database execution and deployment remain unperformed.

## Authority and objective

The owner approved the proposed extension of registration to include Past History,
with implementation discretion on 2026-10-11 at 12:12 Africa/Cairo. This increment
implements that bounded extension and reuses the original PatientIntake component.
It does not authorize operating on the owner's database, certificates or listeners.
The historical deferred technical gates remain historical records; this decision
supplies the implementation choices below for initial intake only.

Same UI. New Persistence. Server Authority. No Silent Fallback.

## Baseline and capability map

| Capability | Baseline | This increment |
| --- | --- | --- |
| Original PatientIntake registration | Synchronous clinicStore callback, personal fields and five Past History fields | Same component and field styling, asynchronous callback in protected server panel |
| Basic POST /patients | Five basic fields; protected Doctor operation | Preserved, including its existing response shape |
| Full initial intake | No complete persistence contract | POST /patients/intake, all personal and history fields, one transaction |
| Basic search | CPN/name, returns basic data | Preserved; accepts empty profession on new patients |
| Complete patient retrieval | Not available | GET /patients/:patientId/intake returns basic fields plus Past History |
| Clinic Day | Repository/tests, separate API gate | Unchanged |
| Case/Visit/clinical dossier | Browser workflows | Unchanged; unavailable actions in server intake stay disabled |
| Demo clinicStore and local theme | Protected frontend reference | Unchanged |

## Transport contract

POST /patients/intake requires exactly name, dateOfBirth, profession, phone,
gender and pastHistory. The personal fields remain strings of at most 256 UTF-16
code units. Name and phone cannot be blank; profession may be empty, matching the
original form. dateOfBirth is a real YYYY-MM-DD date no later than the current UTC
date. Gender is Male or Female. Client identity, role, age, UUID and CPN are rejected.

pastHistory requires exactly:

- chronicIllnesses: array of up to 32 nonblank strings, each at most 500 code units.
- knownAllergies: same limits.
- surgicalHistory: same limits.
- familyHistory: same limits.
- lifestyleNotes: string of at most 2000 code units; empty is permitted.

NUL characters are rejected. Original form comma-separated entries retain their
existing split/trim behavior. JSON request size is independently capped at 300000
bytes. Over-limit input fails explicitly; nothing is silently truncated.

201 returns the existing snake_case basic patient response plus pastHistory in the
shape above, read back from persistence. UUID and CPN come from the server; age is
derived. No registeredAt, Visit, Case, or Clinical History values are synthesized.

GET /patients/:patientId/intake requires a technical UUID. It returns 404 for a
missing patient. Existing patients without an intake marker return pastHistory:
null, meaning not captured by this contract. A marker with no items returns empty
arrays and empty lifestyle text, meaning the form was saved with no information
entered. Neither representation asserts that a patient has no medical history.

## Physical decisions and atomicity

`backend/persistence/migrations/001-patient-intake.sql` is source only. It is not
executed at startup and does not modify the old schema fixture.

- patient_intakes has one marker per patient (UUID primary/foreign key).
- past_history_items has one row per submitted list entry or nonempty lifestyle
  note, a server-generated UUID item_id, patient foreign key, category, ordinal
  position and text. Ownership and ordinal uniqueness are constrained in SQL.
- This preserves Patient 1 → many Past History Items, separate from Visits.
- No legacy backfill, UPDATE, DELETE, ADD-to-existing or PATCH capability is added.
  Item IDs are internal for now; amendment transport remains a later capability.

The existing auth service owns the outer transaction. Registration uses its
transaction client and a nested savepoint. Patient INSERT, intake marker and every
history item must all succeed. Readback and auth session touch must also succeed
before the outer commit returns. Any error prevents 201 and rolls back through the
existing auth-store transaction. PostgreSQL sequence increments may leave gaps on
rollback; CPN values are never reset or reused to hide those gaps.

Both endpoints share the existing secure-cookie, HTTPS-origin, no-store, generic
error and server-resolved authorization boundary. POST additionally requires CSRF.
Only Doctor is authorized. A local role selector cannot grant permission.
Missing history tables produce an explicit 503, never a basic-only save or local
fallback.

## UI behavior and boundaries

The protected server panel now uses the existing PatientIntake rather than its
separate basic-only form. It passes no demo patients or cases and never imports
clinicStore. Demo tabs remain explicitly identified as demonstrations.

The registration callback is awaited. Pending requests disable form editing and
double submission. Success is shown only for a confirmed complete response. A
validation failure leaves the draft editable. An unavailable/uncertain result
preserves the in-memory draft and uses the existing registrationUnconfirmed latch
to prevent retries, including after session refresh. There is no automatic retry,
local persistence, or fallback to POST /patients. Reload recovery/idempotency is
not implemented; uncertain writes require reconciliation before another attempt.
Logout/confirmed unauthenticated state or actor change clears the draft.

Search remains in the existing server search panel; selecting a result uses the
complete GET. The original intake lookup/arrival and clinical dossier buttons are
disabled in server mode with an explicit explanation. Full clinic migration,
Past History amendments, Visits and Case/Clinic Day integration remain future work.
No exact pixel-level browser comparison is claimed by the component render tests.

## Review and subsequent execution

The SQL has not been applied. The current device launcher/schema guards are not
changed or bypassed. This package must not be represented as ready to run against
the existing proof database: a separate reviewed database/launcher increment is
needed to validate schema changes, credentials, fixture preservation and browser
behavior. No listener or certificate operation is included here.

Local verification results and changed-file inventory accompany the review bundle.
Protected paths and clinicStore must have no diff. Apply the patch only after
`git apply --check` succeeds on the matching baseline; never reset local theme
changes to make a patch apply. Review before any commit or push.

## Local verification — 2026-10-11

- `npm run test:all`: 200/200 PASS, exit 0; historical P37A excluded.
- `node --import tsx --test backend/api/patient-intake.test.js src/integration/patient-intake.test.ts`:
  13/13 PASS, exit 0. These new files are untracked pending owner Git review;
  the unchanged test:all runner selects tracked tests, so run this command too.
- `npm run lint`: PASS (TypeScript).
- `npm run build`: PASS; pre-existing Vite native-loader warning about __dirname.
- `git diff --check`: PASS.
- Protected paths, clinicStore, package.json and package-lock.json: no diff.

Evidence uses Fastify injection, fake transaction clients, frontend transport/session
unit tests and server-rendered components. PostgreSQL rollback is simulated by the
transaction double; it is not a real database proof. No browser/pixel or on-device
execution proof was performed. At the local verification checkpoint, no database connections, SQL execution,
listeners, certificate changes, commit or push had occurred. The owner subsequently
authorized commit/push; this does not execute the SQL migration or start a runtime.

## Owner Git preservation checkpoint — 2026-10-11 12:23 Africa/Cairo

Owner explicitly authorized commit and push, followed by Termux synchronization.
Remote main was rechecked at the source baseline before staging the 15 scoped files.
After staging the new tests, the unchanged `npm run test:all` discovered all
213 tests: 213 PASS, 0 FAIL, exit 0; historical P37A remained excluded.
Protected paths and clinicStore were verified absent from the staged diff.
This supersedes the earlier untracked-test execution note for the committed source.
Database execution, device launcher changes and browser proof remain unperformed.

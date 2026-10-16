# Original clinic unification — implementation and evidence

Owner: MOHAMED.K_ROBY. Work branch: work/original-clinic-postgres-unification.
Audited remote source: 69c093d26ad588c3590fdcd7ee690b8c0653d134, based on
0154d23a1d3430c410d8133784bc68a64f05e8be. The initial remote HEAD matched the
owner directive. This increment is not full clinical migration or production approval.

## Source audit and verified capabilities

| Original function | UI owner | Prior persistence | Actual backend support | Delivered / remaining |
| --- | --- | --- | --- | --- |
| Full registration | PatientIntake / App callback | clinicStore.registerPatient | POST /patients/intake; PatientRepository + PatientIntakeRepository; same auth outer transaction | Original form uses shared session and full-history API |
| Lookup / returning patient | PatientIntake | Local patient array | GET /patients/search (name/CPN), GET /patients/:id/intake | Original lookup searches server and fetches full record by selected UUID |
| Directory | PatientDirectory | Local patients/cases/visits | Bounded search only; no full listing/count API | Original directory searches server; explicitly search results, 25-result refinement; clinical counts unavailable |
| Patient dossier | PatientDossier | Local patient/case/visit projections | Basic demographics + Past History only | Original dossier displays full retrieved patient/Past History; clinical tabs clearly unavailable |
| Daily census | DailyCensus | Local day/visit arrays | No census API | Original layout retained; unavailable data indicated by dashes; writes disabled |
| Arrival / Case / Visit | Intake / App | recordArrivalAndVisit | No secured arrival, Case or Visit routes/tables | Disabled in protected mode; original demo behavior remains |
| Consultation | DoctorConsultation | updateEncounter | No consultation API / persistence | Navigation retained with explanation; no fabricated Visit rendered |
| Prescriptions | Consultation / print modal | authorizePrescription, local prescription | No secured prescription API / tables | Protected authorization/printing unavailable; original demo retained |
| Case completion / Visit exit | Dossier / census / consultation | completeCase, recordVisitExit | No secured routes / tables | Protected mutations reject explicitly |
| Clinic day | Header / store | openNewClinicDay, closeClinicDay | Repository and application tests only, no secured routes | No invented current day; protected mutation rejected |
| Role/mode/reset | Header/footer/store | setActorRole, setOperatingMode, resetToSeed | Server auth exists; no corresponding role/mode/reset API | Demo-only controls; protected boundary rejects |

Every former App store access was inspected: getState, getCurrentClinicDay,
registerPatient, recordArrivalAndVisit, updateEncounter, authorizePrescription,
recordVisitExit, completeCase, openNewClinicDay, closeClinicDay, setActorRole,
setOperatingMode and resetToSeed. All now cross one ClinicBoundary. The original
browser implementation is loaded only by DemoClinic, through a lazy import at the
demo origin. No protected callback delegates to clinicStore, and no protected
initialization reads its seeded arrays or localStorage.

## One original application

App chooses the protected adapter or a lazy demo adapter. Both render the same
ClinicApplication, extracted from the original App with its navigation, selectors,
callbacks, original components, bilingual/RTL/theme behavior and print integration.
The protected adapter reuses useDoctorSession, owned by the unchanged external gate.
It does not bootstrap, own, refresh, dispose or log in a second session.

ConnectedPatients and its obsolete tests are removed. There is no SERVER tab,
internal login surface, duplicate intake form or demo/server selection inside the
protected clinic. All original navigation destinations remain. Intake is the
protected entrance tab. Demo starts at its original daily census.

The original intake awaits a confirmed full API response, retains draft on validation
failure, disables submission while pending and prevents same-tick double dispatch.
The shared uncertain-outcome latch blocks further mutations and closes the external
gate. No automatic POST retry or local fallback is introduced. Manual recovery of
an unknown committed mutation across an entire page reload is not implemented;
reconcile such an outcome before manually attempting a new registration.

Search supports the backend's name/CPN semantics; phone/profession/barcode search and
complete-registry listing are not inferred. Selecting a search result retrieves the
exact technical UUID; basic search summaries cannot populate a dossier. Failed or
mismatched retrieval clears the authoritative patient and never selects the first
unrelated patient. No dates, CPNs, Visits, Cases or clinical counts are fabricated.
Missing DOB, registration timestamp and uncaptured Past History remain null.
Uncaptured history is not displayed as 'no allergies' or 'no disease'.

## Safety and test changes

The external gate, provider, auth/session coordinator, API client, login label,
credentials, schema/migrations and established HTTPS runtime are unchanged.
The owner's four protected paths and clinicStore are unchanged. No operation was
performed on the owner's database, TLS keys/trust, GitHub issue #1 or main branch.

JSDOM and its types are added as dev dependencies for actual React DOM interaction
tests. They are not bundled into the clinic. The existing outer-adapter inventory
test was repaired to use synthetic bytes instead of requiring a private prebuilt
folder under the executing user's home. Its production manifest/adapter is unchanged.
The P37B source-location assertion now follows the extracted ClinicApplication;
its save acknowledgement assertions remain intact. Historical P37A stays excluded.

A new build adapter writes a fresh commit-bound build under
$HOME/vip-original-unified-review without overwriting the old reviewed build.
It records source and actual protected-theme hashes, verifies the dedicated branch,
HEAD, clean index, dependency versions and exact asset inventory. Its preflight/listen
modes reuse the original adapter's private input and TLS validation and the existing
runtime's exact database/cluster/doctor identity pins. It runs no migrations or
credential changes. It never accepts a different doctor identity or trust bypass.

## Integration limitations

React DOM tests are not real-browser evidence. HTTP injection is not an on-device
HTTPS acceptance test. The owner's Termux resources are inaccessible here.

A repeatable explicit PostgreSQL proof utility is supplied for a NEW empty synthetic
DB named roby_original_unification_proof, with a separate Unix socket/data directory
and port 55449. It rejects existing relations, different database identity and TCP;
it must never be pointed at the owner's proof database. It exercises real schema,
auth transactions, history roundtrip, fresh-client retrieval, original boundary,
rollback, concurrency, authorization, lost-response/no-repeat and logout.

Execution here was blocked before PostgreSQL startup: the workspace process runs
as UID 0 and its user namespace maps only UID 0; assigning a new unprivileged owner
failed with Invalid argument. No root-check bypass was attempted. Therefore this
increment has NO newly executed real-PostgreSQL proof and NO real-browser proof.
The proof utility's guards are tested; its live database cases remain unexecuted.

## Owner acceptance checklist

1. Sync the dedicated branch without resetting the four local files. Install locked
   dependencies with npm ci. Run official tests, typecheck and build.
2. Close only the previously owned HTTPS listener through its original Termux session.
   Do not stop PostgreSQL. Keep the existing rotated credential and TLS files.
3. Use the new unified build/preflight/listen adapter as specified in the final report.
4. Open https://127.0.0.1:3443 and confirm the unchanged OUTSIDE doctor gate. Enter
   DR/MK_ROBY with the existing password privately, then enter the original clinic.
5. Confirm only the original registration destination and all five original tabs;
   no Server Patients tab, no internal username/password form and no sample CPN-1001.
6. Register one uniquely named synthetic patient, e.g. SYN-UNIFY-DEVICE-01, with
   blank profession, synthetic phone, valid DOB and distinctive text in all five
   history fields. Submit once; confirm server CPN after acknowledgement.
7. Use original lookup and directory to search exact CPN and name, select the UUID-backed
   result, open the original dossier and verify every field. Reload, authenticate if
   requested, search again and verify the same CPN/history. Browser data must not seed
   the protected clinic.
8. Check missing patient and validation failure. Verify draft retention without a false
   success. Do not intentionally create an uncertain POST against the owner's DB until
   a reconciliation procedure is ready; automated tests cover the blocking behavior.
9. Confirm clinical writes are disabled with a truthful explanation, and no clinical
   count or prescription is invented. The full clinical migration is still incomplete.
10. Lock clinic with the unchanged external gate action. Confirm the original screens
    disappear, then re-enter through the same external doctor authentication.

Record screenshots without credentials/secrets and test outcomes. Until this checklist
and real database roundtrip are observed, device/browser acceptance remains pending.

## Verification results

- Official `npm run test:all`: 245 tests, 245 pass, 0 fail, exit 0; historical
  src/services/clinic-authority-p37a.test.ts excluded as before.
- Targeted original-clinic DOM/boundary and new launcher tests: 13/13 pass.
- `npm run lint`: pass.
- `npm run build`: pass; existing Vite warning about __dirname/native config loading.
- `git diff --check`: pass.
- Four protected paths, clinicStore, external gate/provider/session model/coordinator,
  authenticated API client and existing runtime/credential/TLS adapters: no code diff.

The first full run exposed two failures, both remediated rather than hidden:
(1) an existing asset test required a private device-build folder, replaced by
hermetic synthetic assets with the same tamper checks; (2) P37B's source-text
assertion followed App instead of the extracted shared ClinicApplication. Subsequent
full regression passes are recorded above. No resource timeout was concealed.

## Safe Termux commands

Stop only the previously owned HTTPS process with Ctrl+C in its own session before
switching source/build. Do not stop the PostgreSQL cluster.

```bash
cd "$HOME/ViP-Clinic-" &&
git status --short &&
git fetch origin work/original-clinic-postgres-unification
```

Switch to the work branch (create the local tracking branch only if absent), then:

```bash
git pull --ff-only origin work/original-clinic-postgres-unification &&
npm ci &&
npm run test:all &&
npm run lint &&
npm run build
```

The fresh device build uses the owner's preserved local theme:

```bash
node backend/api/original-clinic-unified-device.cjs \
  build ROBY_ORIGINAL_CLINIC_UNIFIED "$(git rev-parse HEAD)" &&
node backend/api/original-clinic-unified-device.cjs \
  preflight ROBY_ORIGINAL_CLINIC_UNIFIED "$(git rev-parse HEAD)"
```

Only after preflight PASS, start the existing backend with the new reviewed assets:

```bash
node backend/api/original-clinic-unified-device.cjs \
  listen ROBY_ORIGINAL_CLINIC_UNIFIED "$(git rev-parse HEAD)"
```

Preflight/listen select the single existing private PEM that cryptographically
matches the pinned public leaf certificate. No key bytes are printed, generated,
rewritten or uploaded. If several matching private-key copies exist, pass the exact
absolute key path from the prior successful launch as the fourth argument. Do not
delete keys to satisfy the check. If a build path already exists, the tool stops
rather than overwrites it; reuse its verified manifest for preflight/listen.

## Changed-file inventory

Added: src/ClinicApplication.tsx; src/DemoClinic.tsx;
src/integration/clinic-boundary.ts; src/components/OriginalClinic.test.tsx;
backend/api/original-clinic-unified-device.cjs;
backend/api/original-clinic-unified-device.test.cjs;
scripts/prove-original-clinic-postgres.cjs;
scripts/prove-original-clinic-postgres.test.cjs; this implementation report.

Modified: src/App.tsx; src/components/PatientIntake.tsx;
src/components/PatientDirectory.tsx; src/components/PatientDossier.tsx;
src/components/DailyCensus.tsx; src/components/Header.tsx;
src/services/clinic-authority-p37b.test.ts;
backend/api/stage6-outer-doctor-device-adapter.test.cjs;
package.json; package-lock.json.

Removed: src/components/ConnectedPatients.tsx;
src/components/ConnectedPatients.test.tsx.

Nine added, ten modified, two removed. No capability has been removed from
clinicStore or the original clinical components. Protected-mode unsupported clinical
writes remain unavailable until their own contracts, routes, schemas and proofs exist.

## Device acceptance incident — 2026-10-12

Owner synchronized 080f284, ran 245/245 tests successfully, built the unified device
assets, passed the existing-DB preflight and started HTTPS on 127.0.0.1:3443.
Browser login then showed a generic rejection. The HTTP rejection status was not
provided, so the exact on-device cause is not established.

Inspection found an existing cookie-expiry trap: the original HTTPS runtime lacked
the invalid-session cookie clearing already present in the Stage 6 test runtime.
The auth service correctly rejects a login that supplies an expired prior session,
even with a correct password. The fix clears only the HttpOnly cookie after a 401
from /auth/session or /auth/logout, using Path=/, Secure, HttpOnly, SameSite=Strict
and Max-Age=0. It does not bypass prior-session checks or clear cookies on failed
password login. Credential/verifier/session validation rules remain unchanged.
The focused tests reproduce expired-cookie rejection, bootstrap recovery, subsequent
valid login, valid-session preservation and failed-password denial: 2/2 pass.

The unified device adapter now enables diagnostics containing ONLY auth route and
HTTP status. No body, headers, login input, password, cookie, CSRF or token is logged.
If login still fails, these statuses identify whether bootstrap, password login or
subsequent session retrieval failed. Throttling counters are never reset by this fix.

The owner's lint also failed before typechecking because TypeScript 7 required an
unavailable Android ARM64 native platform package. TypeScript is now pinned to the
portable JavaScript compiler version 5.9.3. No typecheck skip or Android binary
substitution is introduced.

Final local verification after both repairs: official test:all 247/247 PASS, zero
failures; lint PASS; build PASS; protected paths, outer gate/provider, auth service
and password verifier unchanged. Device re-login and Android lint await the owner's
next run. An initial cookie-hook test stalled because its Fastify hook was synchronous;
the hook was corrected to async, the stalled run was stopped, and the complete suite
was rerun successfully. That interrupted run is not counted as a passing run.

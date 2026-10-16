# Stage 8 CASE_CREATE UI engineering V1

Mission RBF-VIP-STAGE8-VERTICAL-SLICE-001. Owner MOHAMED.K_ROBY.
Status: PARTIAL ENGINEERING DELIVERY; NOT END-TO-END ACCEPTED; NO MERGE OR RELEASE.
Baseline 0e9762a6f242ce4797e9fdca17b8c4ede7c1fabd; independently queried integration ref matched before edits.
Branch work/astra-stage8-case-create-ui.
Implementation commit 8e5aefb4858637662fb2d47ed129a63603a87d37; parent is exact baseline.

## Authority discovery and implementation mapping

- Manuscript §§5/12/13 and Policy B V2 permit an independent Doctor-created OPEN Case without Visit, arrival, Day or CPN effects. No new clinical fields or policy selected.
- ARCHITECTURE/STAGE7-DOCTOR-CASE-CREATE-V1.md Protocol and Transaction/replay define exact operationId,patientId,problemSummary payload and actor-scoped receipt recovery; these endpoints and backend are unchanged.
- Same document allows only operation UUID/kind/version recovery metadata, never clinical payload/session/Patient data. New case-journal.ts follows that shape, with Web Locks and readback; missing/corrupt storage fails closed.
- Existing auth session comes from ConnectedPatientSession and the outer Doctor gate. No second login, new account or client-authoritative role is introduced.
- Factory Operating Standard V1 and docs/factory/seventh-star-v1 require explicit source/runtime evidence distinction. metadata.json and Domain Nucleus records remain descriptive/historical; no executable Neculs authority was found or altered.
- Standalone reference85c75dd1d7ad40aba7c71c757f6b902a93b1eee1 clinicStore.ts::createCase uses local state, generated C-number, current Day and Awaiting Doctor. These legacy semantics were deliberately not copied where V2 supersedes them. Original patient directory/dossier selection is reused.

## Implemented client subset

App supports explicit caseCreateEnabled opt-in, default false. main.tsx is unchanged, so existing runtime does not expose a new operational command by default. No URL/storage flag enables the feature. ClinicApplication accepts the panel at its existing patient-selection surface, not a competing patient registry.

CaseCreatePanel captures only problemSummary and selected authoritative patient UUID. It reserves operation UUID before network activity, prevents repeated same-component submission, and uses a cross-tab journal lock. Retry uses original in-memory immutable intent, not newly edited fields. After remount/reload the marker permits receipt retrieval only; clinical intent is never reconstructed from browser storage. UNKNOWN retains the guard and does not certify rollback. A different logged-in actor may receive UNKNOWN from actor-scoped backend; no identity/payload is persisted to bypass that boundary.

The marker is retained even after success so a later reload can request the original durable creation receipt. Explicit Finish receipt review removes a confirmed marker before a new request. Result is labeled original creation receipt, not current Case lifecycle or a longitudinal dossier. No Case-list/read-current-state endpoint was invented.

API adapter uses accepted paths, same-origin cookies, no-store, redirect:error, JSON and CSRF. Browser supplies Origin naturally; server remains authoritative. 401/403/409 are distinct; unavailable/malformed/lost acknowledgement remains uncertain. Response validation and matching Patient prevent false confirmation. Role/state checks protect UI affordance; server policy still decides effects. Patient switch clears unsubmitted summary; actor/session loss clears displayed result and draft and invalidates late completion display.

## Files

- src/App.tsx: explicit disabled-by-default panel opt-in.
- src/ClinicApplication.tsx: original selection/panel slot and truthful unavailable notice.
- src/components/CaseCreatePanel.tsx: bilingual workflow, recovery and feedback.
- src/integration/case-api.ts: strict accepted API adapter.
- src/integration/case-journal.ts: nonclinical durable operation marker.
- src/integration/web-api-client.ts: adds conflict to shared error-kind type.
- src/integration/Stage6IntegrationApp.tsx: exhaustive conflict message for that shared type; no Stage6 workflow change.
- src/integration/case-api.test.ts and src/components/CaseCreatePanel.test.tsx: focused transport/journal/DOM tests.
- This evidence document: scope, outcomes and outstanding runtime gate.

## Executed proof

Work Linux, Node24.19.0, npm11.9.0; reused existing ignored dependencies, lockfile unchanged.
At implementation commit: focused command node --import tsx --test src/integration/case-api.test.ts src/components/CaseCreatePanel.test.tsx src/components/OriginalClinic.test.tsx passed19/19; full npm run test:all passed337/337,0fail,0skip; npm run lint (tsc --noEmit) exit0; npm run build exit0. Final official regression run once after source stabilized. P37A historical exclusion unchanged.

New tests: six transport/journal and two DOM tests. Tests demonstrate same-origin/CSRF payloads, denial/conflict mapping, uncertain outcomes, invalid input, journal serialization/reload metadata, missing locks/storage failure, repeated-submit guard, retained-intent replay, DOM remount recovery and Nurse denial. DOM fetch responses are mocked; this is NOT PostgreSQL persistence or actual browser reload proof. Existing329 tests remain included. Existing backend tests retain SQL-model rollback/concurrency and session expiry cases; their success is not a new real-PG claim.

Intermediate failures retained: first TypeScript check failed because adding conflict required an exhaustive message in Stage6IntegrationApp; fixed with that message. Second TypeScript check failed because a test's pending Promise inferred unknown instead of Response; fixed with Promise<Response>. Focused runs passed17/17 then8/8 during development; final19/19 supersedes them only for final source. No production defect was concealed. npm http-proxy and Vite __dirname warnings retained, not suppressed.

## Real-system boundary — BLOCKED, not PASS

The inspected existing backend/api/original-clinic-https-runtime.cjs::verifyIsolatedDatabase pins roby_intake_proof_stage6, port55441, system ID7695362409703475295 and a Stage6 Doctor credential identity. Its composeSecuredPatients call does not enable CASE_CREATE. The accepted Stage7 runner instead provisions fresh roby_stage7_c2_* databases in another isolated PG18 cluster at55437 and has no browser listener. main.tsx does not opt in to the new panel.

Do not weaken the Stage6 identity guards, enable Case writes against that historical proof database, run migrations there or label the existing listener Stage8-ready. A new bounded disposable HTTPS acceptance composition and explicit UI enablement are still required. Proposed design: separate Stage8 adapter using the same original UI build, session service, secured API and fresh synthetic Patient/auth/clinical schemas; retain existing TLS/origin/CSRF discipline and positively verify new target identity. No deployment or old database reuse. This runtime-target/acceptance design is presented for Owner review before material runtime wiring; this deliverable does not implement it.

POSTGRESQL_EXECUTION=NOT_RUN_FOR_STAGE8. Work has no verified local PostgreSQL target. Stage7 Owner10/10 API-to-PG evidence remains historical at91966c6, not this frontend proof. BROWSER=NOT RUN; no real browser backed by isolated SQL available to this mission. No screenshots fabricated.

## Remaining limitations and next gate

- Full mission is incomplete: default application intentionally remains disabled; no new server opt-in or browser proof.
- Reload shows a retrieved original creation receipt, not a refreshed current Case/dossier. Any broader clinical read API needs separate contract scope.
- Recovery UNKNOWN without original in-memory intent stops new creation and requires explicit reconciliation; no automatic replacement operation.
- Only a confirmed operation can be cleared in this client. Rejected/never-sent but reserved operations can remain guarded; a safe explicit cancellation/reconciliation policy is not invented here.
- Browser Web Locks/storage behavior needs real browser proof; journal tests are an injected lock model.
- Real transport loss during COMMIT, nonempty Visit/Rx/closed-Day history and broader Stage7/8 workflows remain unproven/outside this subset.
- Completion/Visit/Day/Nurse reserved decisions remain untouched.

GO for source review and isolated client tests. NO-GO for merge, integrated clinical acceptance or release. Owner decision requested: accept design of a separate fresh synthetic Stage8 HTTPS/PG acceptance runtime, keeping the pinned Stage6 adapter unchanged. No request to change schema or clinical meaning.

## Termux reproduction (one gate at a time)

Verify delivered checksum/bundle and import into a NEW isolated checkout of work/astra-stage8-case-create-ui; verify final HEAD from delivery manifest and ancestry through implementation8e5aefb -> baseline0e9762a. npm ci, then:

```bash
node --import tsx --test src/integration/case-api.test.ts src/components/CaseCreatePanel.test.tsx src/components/OriginalClinic.test.tsx
```

Expected19/19 only when actually run. Optional independent full gate: npm run test:all (expected337), npm run lint, npm run build. Do not run the Stage7 PostgreSQL runner with this branch: its strict branch guard intentionally rejects it. No runnable Stage8 SQL/browser acceptance command exists yet; do not substitute a command targeting the historical database. No automatic merge/push.

لا تنسوا الفضل بينكم.

## Work log fingerprints

- build.log: `78fd1be5f70d22b3e18137cf04d3632b7fd089c0fb67e5532d7e311b33026db3`
- focused.log: `a3b58b06064ea992ed20af681bbff199fa32bfc7791e743a3de4b845b2ae2e31`
- regression.log: `c22d49839ab957463d4ff02e076958d20fd47b202117eb85f199804a6aa2151f`
- regression.tap: `7d2f162e6a6083a049bbc471a1f463575308297cd02d0d91ee59feec917163d3`
- results.json: `bb54900a919435eb6518ace098906aa75c36af92feb4bbc5d8aae1c6a4fafffc`
- types.log: `3fa4b3073117fae3870a31295f620fd576b5eea6185d8b68af5bc3cfc69f7d96`

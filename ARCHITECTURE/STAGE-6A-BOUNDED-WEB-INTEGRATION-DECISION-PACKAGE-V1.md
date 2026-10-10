# Stage 6-A — Bounded Web Integration Decision Package V1

OWNER: MOHAMED.K_ROBY  
SOURCE_BASELINE: adc46f5502d46699748fc3cc81c2e4afda3d57e3  
STATUS: DESIGN_READY_FOR_OWNER_SCOPE_REVIEW  
CURRENT_PRESERVATION_SCOPE: THREE_NEW_DOCUMENTS_ONLY  
CODE_AND_BROWSER_EXECUTION: NOT_PERFORMED  
PRODUCTION_DEPLOYMENT_AND_CLINICAL_USE: NOT_GRANTED  
DECISION_E_CLEANUP: NOT_AUTHORIZED

## Owner direction and proposed decision

The owner reported successful milestone synchronization and requested continuing
the existing governed method, identifying browser role forgery, cookie transport,
CSRF, mock/PostgreSQL separation, 401/403/404, reopen authority and clinical
contract preservation as Stage 6 concerns. This package turns that direction
into concrete, independently reviewable increments.

Approve the [design](./STAGE-6A-WEB-AUTHENTICATION-AND-PATIENT-ADAPTER-DESIGN-V1.md)
and its [source reconciliation](./STAGE-6A-WEB-INTEGRATION-SOURCE-RECONCILIATION-V1.md)
before replacing any clinic UI data source. Publication alone creates no new
route/clinical capability. Exact implementation permissions are recorded against
the owner's subsequent bounded decision; do not infer device execution from
source implementation.

## Independent increments

| Slice | Concrete scope | Validation / boundary |
| --- | --- | --- |
| 6-A | Source reconciliation, design, failure matrix and this decision package | Documentation only; current delivery |
| 6-B | Typed HTTPS same-origin auth/basic Patient adapter; memory session coordinator | Fake transport tests, status handling, malformed responses, races, no storage or role input |
| 6-C | Separate React integration entry: login/session/logout/basic registration/UUID retrieval | Browser/component proof; no clinicStore import or existing clinical-screen mutation |
| 6-D | Separate import-safe HTTPS test runtime and build config serving approved assets plus existing secured composition | Resource lifecycle/TLS/origin/asset guards; no default listener or unsecured Patient routes |
| 6-E | Termux preflight, exact certificate/trust procedure, independent new synthetic database preparation | Separate bounded execution decision; no Stage 5 rerun or protected database connection |
| 6-F | Real loopback HTTPS and Infinix browser/PG failure-first proof | Matrix W01–W16 evidence; only actual observed paths can PASS |
| 6-G | Review, milestone, README/roadmap reconciliation, scoped Git preservation and safe sync | Preserve tested HEAD, runtime evidence and remaining limits |

Recommend implementing 6-B–D together after scope adoption; produce 6-E's concrete
device commands/material review before starting its listener, creating its DB or
changing Android certificate trust. No real credential is requested.
Local HTTPS is test infrastructure, not production deployment.

## Proposed write allowlist for 6-B–D

New paths only:
- src/integration/basic-patient.ts
- src/integration/web-api-client.ts
- src/integration/web-api-client.test.ts
- src/integration/session-coordinator.ts
- src/integration/session-coordinator.test.ts
- src/integration/Stage6IntegrationApp.tsx
- src/integration/main.tsx
- src/integration/integration.css
- stage6-integration.html
- vite.stage6.config.ts
- backend/api/stage6-web-test-runtime.cjs
- backend/api/stage6-web-test-runtime.test.cjs

A later 6-E/F proof harness must add its exact new path allowlist before
preservation; likely backend/web-proof/* remains a proposal, not wildcard write
authority. Any required dependency/lockfile, shared-module or existing-screen
change needs explicit scope review. Reuse locked dependencies where possible.

Exclude src/App.tsx, existing PatientIntake/PatientDirectory/DoctorConsultation,
src/services/clinicStore.ts, src/index.css, ordinary vite.config.ts, package
manifests/lockfile, existing runtime/composition, base/auth SQL and credentials.
Do not quietly add real-user enrollment, password reset, delegation administration,
Past History/CPN search/list APIs, Case/Visit/day operations or new Nurse permissions.

The four protected dirty paths retain all protections:
- src/index.css
- ARCHITECTURE/DESIGN/VISUAL-THEME-IMPLEMENTATION-AUTHORIZATION-REVIEW-V1.md
- backend/api/routes/register-new-patient-route.js
- src/components/PatientIntake.tsx.pre-light-migration

No broad git add, reset, clean, stash, force update or local-worktree replacement.
Cloud review reads committed GitHub bytes, not protected Termux bytes; safe sync
must recheck the actual device snapshot before any fast-forward.

## Execution envelope proposed for 6-E/F

Existing isolated cluster only, system identifier 7694773229923891271,
Unix socket port 55439, PG18, TCP disabled.
New independent database proposal: roby_web_proof_stage6.
New origin proposal: https://127.0.0.1:3443, bound only to 127.0.0.1.
Require exact tested source HEAD/build, unused port, reviewed certificate SAN and
trust, controlled synthetic credentials, explicit start token and owned-resource
shutdown. Do not guess an available port or bypass TLS validation.

Exclude historical cluster $PREFIX/var/lib/postgresql and both prior proof
databases roby_retrieve_proof_c / roby_auth_proof_stage5 from connections/reset.
Keep the current Vite and isolated PostgreSQL processes untouched.
Stopping only a newly owned Web test listener is its resource lifecycle; it is
not permission to stop PostgreSQL or execute cleanup E.

Test-device trust changes cannot be inferred from running npm/node or selecting
a role. Review their precise scope before owner execution. No public tunnel,
LAN exposure, production DNS/certificate/secrets or clinical traffic.

## Stop conditions and acceptance

Stop for unexpected source/HEAD/scope/worktree change, existing target database,
wrong cluster, missing browser TLS trust, occupied port, storage/mock mixing,
unknown Patient outcome, failed required check or incomplete browser evidence.
Do not reset partial state, weaken security, rerun Stage 5, or declare PASS from
a page loading or an HTTP injection result.

6-F passes only with the design's W01–W16 evidence and protected-state/source
verification, with tested failures as well as positive operations. Recorded
browser/TLS observations are distinct from unit, SQL and injection evidence.
6-G preserves the actual tested HEAD and makes no production/clinical claim.
The complete clinic UI/history/CPN journey remains subsequent contracted slices.

## Documentation preservation

Under the owner's continuation direction, preservation is scoped to exactly:
- STAGE-6A-WEB-INTEGRATION-SOURCE-RECONCILIATION-V1.md
- STAGE-6A-WEB-AUTHENTICATION-AND-PATIENT-ADAPTER-DESIGN-V1.md
- STAGE-6A-BOUNDED-WEB-INTEGRATION-DECISION-PACKAGE-V1.md

The README already identifies Stage 6 as next gate and is not changed by this
design package. Historical contracts and successful Stage 5 evidence stay intact.
No UI, credential, schema, trust-store, listener or database operation is performed.

**MOHAMED.K_ROBY decides. Proof validates. Git preserves.**

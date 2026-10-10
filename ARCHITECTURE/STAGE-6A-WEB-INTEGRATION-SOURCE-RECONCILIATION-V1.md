# Stage 6-A — Web Integration Source Reconciliation V1

OWNER: MOHAMED.K_ROBY  
SOURCE_BASELINE: adc46f5502d46699748fc3cc81c2e4afda3d57e3  
STATUS: READ_ONLY_SOURCE_REVIEW_AND_DESIGN  
AUTHORITY: OWNER_CHAT_DIRECTION_TO_CONTINUE_WITH_EXISTING_GOVERNANCE  
BROWSER_RUNTIME_PROOF: NOT_EXECUTED

## Proven starting point

The owner supplied documentation sync evidence at this baseline: downloaded
bytes verified; protected files, tracked worktree diff, status and untracked
bytes unchanged; nothing staged; no database/Vite operation or proof rerun.
Stage 5-G execution remains pinned to c59fe2b, as recorded in the
[Stage 5-G milestone](./STAGE-5G-ISOLATED-POSTGRESQL-AUTHENTICATION-PROOF-MILESTONE-V1.md).
Changing documentation HEAD does not move its runtime manifest.

The owner requested continuation with server identity, actual browser cookie
transport, CSRF, isolated data, 401/403/404 handling, reopen safety and clinical
contract preservation. The following design makes implementation and device
execution choices reviewable; it does not claim those tests have run.

## Governing sources read

- [Product Manuscript](./MANUSCRIPT/DR-ROBY-CLINIC-PRODUCT-MANUSCRIPT.md)
- [CONTRACT-03 Actor Authority](./CONTRACTS/CONTRACT-03-ACTOR-AUTHORITY.md)
- [Authentication Technical Contract](./AUTHENTICATION-TECHNICAL-CONTRACT-V1.md)
- [Authorization Technical Contract](./AUTHORIZATION-TECHNICAL-CONTRACT-V1.md)
- [API Technical Contract](./API-TECHNICAL-CONTRACT-V1.md)
- [Deployment Technical Contract](./DEPLOYMENT-TECHNICAL-CONTRACT-V1.md)
- [Stage 5-A design](./STAGE-5A-AUTHENTICATION-AND-AUTHORIZATION-IMPLEMENTATION-DESIGN-V1.md)

Historical definition-state prohibitions retain their chronology. The later
Stage 5 implementation grant and proof do not automatically authorize Stage 6
device TLS trust changes, a new browser-facing listener or production deployment.
No applicable AGENTS.md exists in the reviewed repository tree.

## Source findings and consequences

| Source | Verified code behavior | Stage 6 consequence |
| --- | --- | --- |
| src/services/clinicStore.ts | Reads/writes dr_roby_clinic_emr_v1 in localStorage; seeded Patients/Cases/Visits/Clinic Days; stored actorRole and operatingMode | Treat as preserved demo state, never as backend identity, policy or a database import |
| src/App.tsx | Calls clinicStore synchronously; role selector updates local role; registration returns PatientRecord immediately | Replacing callbacks with fetch would break synchronous assumptions and authority boundaries |
| src/components/PatientIntake.tsx | Collects basic registration plus Past History; searches current local Patient list by name/CPN/phone | Existing API cannot preserve this entire form or lookup semantics |
| src/components/PatientDirectory.tsx | Receives local Patients/Cases/Visits, calculates counts and offers dossier/Visit actions | Do not feed basic SQL responses into a clinical dossier or invent missing history/counts |
| backend/api/secured-patient-composition.js | Separate composition; HTTPS trustedOrigin required; secure HttpOnly cookie; strict Origin/JSON; synchronizer CSRF; server-resolved identity | Preserve existing security policy; do not auto-disable Secure or accept HTTP origins for convenience |
| Same composition | GET /patients/:patientId validates technical UUID; POST permits only five basic fields; Nurse denied both operations by current policy | No CPN/list/search/history endpoint is inferred; basic integration is Doctor-only, Nurse denial is tested |
| backend/api/patient-registration-runtime.js | Uses the older registration composition and does not install secured composition | Do not attach browser traffic to this unsecured runtime or expose both compositions together |
| vite.config.ts and package.json | Ordinary demo Vite runs port 3000, host 0.0.0.0, no current auth proxy/TLS configuration | Preserve running demo; use a separate explicit loopback HTTPS proof boundary |
| Patient persistence/API | SQL fields and technical identity differ from the frontend PatientRecord, including unavailable history/registration metadata | Use a BasicPatient DTO; unavailable clinical data is not represented as empty clinical truth |

## Scope reconciliation

The first bridge is a separately entered React integration screen backed only by
the existing secured auth/basic Patient operations. It does not import or write
clinicStore and does not replace the full clinic UI. It establishes a bounded
Stage 6 foundation, not full Stage 9 clinical Web integration.

CPN lookup, Patient directory/listing, Past History persistence, Case/Visit/day
APIs and full dossier migration remain explicit later vertical slices. Basic
registration must not silently discard Past History from the existing form.
No Nurse permission mapping is expanded by the new screen.

See the [design](./STAGE-6A-WEB-AUTHENTICATION-AND-PATIENT-ADAPTER-DESIGN-V1.md)
and [bounded decision package](./STAGE-6A-BOUNDED-WEB-INTEGRATION-DECISION-PACKAGE-V1.md).

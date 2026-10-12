# Original ViP Clinic → PostgreSQL Unification — Owner Direction and Implementation Gate

Owner: MOHAMED.K_ROBY. Source: `0154d23a1d3430c410d8133784bc68a64f05e8be`. This branch is a review/work branch; it is NOT production deployment approval.

## Required result

Preserve the complete original clinic experience (intake, daily census, dossier, consultation, directory, prescription workflows, clinical day), its layout and clinical semantics. Replace the duplicate `Server patients` navigation with **one original intake and patient workflow**. On the protected HTTPS origin, server identity and PostgreSQL are authoritative. On the demo origin, preserve existing demonstration behavior, without silently mixing records.

## Verified code boundaries

- `src/App.tsx`: original clinic tabs, demo `clinicStore` and registration callback; separate `SERVER` tab and `ConnectedPatients`. Existing local-store mutations include registration, arrivals, encounters, prescriptions, exits and clinic days. Merely hiding the SERVER tab is **not** migration.
- `src/components/PatientIntake.tsx`: original registration form already supports async `onRegisterPatient`, `serverRegistration`, `registrationDisabled`, and a failure notice. Preserve its fields and visual design.
- `src/integration/web-api-client.ts`: authenticated server session, search, retrieve, full-history intake registration `POST /patients/intake`; no verified server endpoints for every original clinic operation.
- `src/integration/doctor-session-context.tsx`: shared authenticated session, owned by the **external** doctor gate.
- `src/integration/connected-patient-session.ts`: protected registration/search/retrieval model, with uncertain-outcome safeguards. Do not bypass it with a second independent session.
- `src/services/clinicStore.ts`: browser persistence and seeded demonstration records, not a production data source.

## Non-negotiable safeguards

1. Doctor authentication stays **outside** the clinic, label `DR/MK_ROBY`; never expose or hardcode passwords, verifiers, cookies, tokens or CSRF secrets.
2. No automatic fallback to `localStorage` on the protected HTTPS origin, even during server outage. No fake success toast, local CPN allocation, demo patient injection or unconfirmed retry after an uncertain POST outcome.
3. PostgreSQL allocates CPN and is the source of truth. Preserve history and prevent duplicate registration, cross-patient record mixing, and phantom visits.
4. Never represent demo visits, clinical notes, prescriptions or case completion as server-persisted until corresponding authenticated endpoints, schema, authorization, tests and real isolated-DB proof exist. Fail closed per unsupported capability, with clear UI notice, while retaining the original screen.
5. Preserve all original UI elements and capabilities in code; do not remove functionality to make migration appear complete. The duplicate `SERVER` surface may be removed from navigation **only when** equivalent patient registration, search and retrieval are available through the original UI.
6. Doctor-only clinical authority is enforced by backend authorization, not a client role switch. Nurse/secretary provisioning is not part of this migration.
7. Never touch the owner's four local protected dirty/untracked files (`src/index.css`, `ARCHITECTURE/DESIGN/VISUAL-THEME-IMPLEMENTATION-AUTHORIZATION-REVIEW-V1.md`, `backend/api/routes/register-new-patient-route.js`, `src/components/PatientIntake.tsx.pre-light-migration`).
8. Never mutate the isolated proof DB or its synthetic patient history without a separately reviewed proof step. No production database is yet provisioned. Never rewrite Git history, merge to main or force push.

## Implementation sequence

A. Map the complete original clinic's read/write operations and the existing backend routes/schema, documenting gaps.

B. Implement a single, origin-aware persistence boundary with explicit `demo` and `protected-server` modes. Protected mode uses the outer gate's shared session and the existing web API. No second login inside the clinic.

C. Migrate the original PatientIntake registration, patient lookup, CPN retrieval and directory first, preserving all fields, error states and patient identity; test valid/invalid data, denied/expired session, server outage, unknown mutation outcome and reload.

D. For remaining clinic workflows, implement and prove backend capabilities one at a time: arrivals/cases/visits, encounter edits, prescription authorization, exit, dossier, daily census and clinic-day management. Until each is ready, disable its **write** action on the protected origin with a truthful explanation. No demo persistence in protected mode.

E. Remove duplicate SERVER navigation only after C is proven. Keep original tabs and external doctor gate. Test demo-origin regression and protected-origin fail-closed behavior.

F. Run full tests, typecheck/build, isolated PostgreSQL integration and browser proof. Record commands, results and file diffs. Owner performs final local sync/device acceptance. Do not claim production readiness from build-only tests.

## Current status

Design and source audit recorded. **No application migration implemented or tested in this commit.** The existing isolated doctor login works on the owner's device, but original `clinicStore` workflows remain demonstration/local-storage-backed.

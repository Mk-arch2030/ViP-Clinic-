# ROBY CLINIC — OUTER DOCTOR GATE V1

**Status:** REVIEW BRANCH — architectural contract, not implementation proof  
**Owner / final authority:** MOHAMED.K_ROBY  
**Baseline:** `5535f4bd639920f31989c07675e64015ab341193`  
**Rule:** Authenticate Outside. Enter Inside. Lock on Exit.

## Owner intent

The doctor login gate belongs **outside** the clinic, not as a tab next to patient registration, reception, dossiers, or consultation. Preserve the existing clinic UI; use the owner-approved first Gemini demo gate as the visual/interaction reference **only after its actual implementation assets are reviewed**. Demo passwords, instant-login shortcuts and presentation labels are not authority.

## Verified source observations (read-only Termux reviews)

- `src/App.tsx` initializes `clinicStore.getState()` and renders the clinic header, navigation and demo screens before server authentication.
- `ConnectedPatients` currently embeds the login form in the SERVER tab, backed by `ConnectedPatientSession`.
- `ConnectedPatientSession` delegates session transitions to `SessionCoordinator`; the latter starts in `checking`, uses server `/auth/session`, and distinguishes `authenticated`, `unauthenticated`, and `unavailable`.
- `src/integration/web-api-client.ts` pins `https://127.0.0.1:3443`, uses same-origin credentials, and never derives server identity from browser storage.
- The original UI has legacy demo/seed records separate from protected PostgreSQL patients. Visibility of those demo records while unauthenticated is **not evidence of a PostgreSQL patient leak**.
- `POST /auth/login` without the required trusted `Origin` receives HTTP 403 by design; that result does not prove credential rejection.

## Required implementation boundary

1. **Outside:** On the protected origin, render only an external doctor gate (or neutral checking/unavailable state) until a fresh server-confirmed Doctor session is present. No clinic header, tabs, directory, consultation, seeded patient information, or clinicStore-derived content should mount before that decision.
2. **Inside:** On a verified Doctor session, reveal the **existing** clinic screens without redesign. The backend remains the authority for each patient operation. A client-side role or actor toggle must never grant server privileges.
3. **Close:** On confirmed logout, expired/401 session, or unavailable server, unmount clinic content and clear sensitive presentation state. A failed logout must be shown as **revocation unconfirmed**, not as confirmed server logout; keep the clinic locally closed.
4. **Nurse:** Do not silently grant a Doctor gate to a Nurse session. Explicit staff access/delegation is a separate owner-approved capability, consistent with CONTRACT-03.
5. **No fallback:** Protected origin must never silently switch to `clinicStore` as the source of real patient data, including on 401, 403, 5xx, network failure, or reload.
6. **Demo separation:** Preserve historical demo/seed fixtures and the proof database; do not import demo patients into a production database automatically. Future production persistence should start with schema and authorized identities, without demo patients or visits.
7. **Lifecycle:** Gate/session coordinator should have one authoritative lifecycle owner. Avoid a second independent auth model or duplicate refresh/logout flows. Review handling of pending writes and `registrationUnconfirmed` before unmounting.
8. **TLS:** Browser CA trust is not yet established; verified Termux curl TLS is not equivalent to Chrome-trusted HTTPS. No Android trust-store changes without owner approval.

## Acceptance tests to implement before owner review

- Initial render and in-flight `/auth/session`: gate/checking only; no clinicStore access or demo patient text.
- 401 / unavailable / malformed session: gate or blocked state; no clinic mounting or demo fallback.
- Successful Doctor login **followed by server session confirmation**: original clinic renders.
- Nurse session: Doctor-only clinic remains closed.
- Logout success, 401 expiry, actor change, and uncertain logout: clinic unmounts; sensitive local presentation cleared; uncertainty visible.
- Reopen/focus/pageshow reconciliation and late async response races do not reopen an unauthorized clinic.
- Patient API remains server-authorized; no client role toggle elevates permissions.
- Existing test suite and reviewed build behavior remain passing; test on an isolated worktree before guarded local fast-forward.

## Protected local files — do not stage or overwrite

- `src/index.css`
- `ARCHITECTURE/DESIGN/VISUAL-THEME-IMPLEMENTATION-AUTHORIZATION-REVIEW-V1.md`
- `backend/api/routes/register-new-patient-route.js`
- `src/components/PatientIntake.tsx.pre-light-migration`

## Explicit non-goals for this review contract

No migration, reset, truncate or drop of PostgreSQL; no changes to Stage 6 proof cluster or historical clusters; no production database creation yet; no certificate/trust changes; no push to `main`; no claim of browser or end-to-end proof from source inspection alone.

**Authority:** MANUSCRIPT IS AUTHORITY. CONTRACTS AUTHORIZE. PROOF VALIDATES. GIT PRESERVES. MOHAMED.K_ROBY DECIDES.

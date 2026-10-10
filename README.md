# ViP Clinic

**A focused clinic product built around continuity, clinical responsibility, and proof.**

ViP Clinic carries forward the product foundation of [Dr.Roby Clinic](https://github.com/Mk-arch2030/Dr_Roby_Clinic), owned by **MOHAMED.K_ROBY**. Its development includes a mobile/Termux workflow, a React/Vite interface, and bounded Node.js/Fastify/PostgreSQL work.

The aim is a small, focused, useful, provable, repeatable, and sellable product for one clinic.

> **Manuscript is authority. Contracts authorize. Proof validates. Git preserves. MOHAMED.K_ROBY decides.**

## Current position

This status incorporates owner-reported Termux execution evidence received on
**2026-10-10 (Africa/Cairo)**. The latest isolated authentication proof ran at
[`c59fe2b48d2b2adb882a95dcf05bdb8fd8e0c59c`](https://github.com/Mk-arch2030/ViP-Clinic-/commit/c59fe2b48d2b2adb882a95dcf05bdb8fd8e0c59c);
the earlier Stage 4 composition proof ran at `9d207d4a1a0fbffd0bc38035279a7ae3f3b43925`.
Subsequent documentation commits preserve that evidence; they are not new runtime executions.

| Area | Evidence and boundary |
| --- | --- |
| Product and domain | Manuscript, contracts, domain representations, and closure/reconciliation records exist. Definition closure is distinct from complete runtime behavior. |
| Frontend | React/Vite screens and clinic workflows exist. Current application state is managed by `src/services/clinicStore.ts` and browser `localStorage`. Owner-provided Termux logs show Vite running on port 3000. |
| Patient registration | Existing controller, application service, repository, and POST composition. Historical bounded PostgreSQL registration proof is documented separately. |
| Patient retrieval | Existing GET controller/service/repository. The current composition registers GET only when `enableRetrieveExistingPatient === true`; the default remains POST-only. |
| Current composition tests | Owner-provided Termux evidence records **17/17 scoped tests** and **52/52 active regression tests**, with zero failures. The scoped evidence covers tested fake-dependency composition paths. |
| Earlier PostgreSQL GET proof | Decisions A–D established bounded GET-only Fastify injection against a separate synthetic PostgreSQL cluster, including 200/404 and compared patient-data/sequence preservation. |
| Current PostgreSQL composition proof | Stage 4 passed for the tested isolated paths: current opt-in composition, GET 200/404, POST present but not invoked, compared patient/sequence/schema state preserved, no listener, protected local state preserved, exit 0. See the [Stage 4 Milestone](./ARCHITECTURE/RETRIEVE-EXISTING-PATIENT-COMPOSITION-POSTGRESQL-PROOF-MILESTONE-V1.md). |
| Authentication | Stage 5-B–F backend lifecycle, password verifier, persisted identity/session policy and separate secured Fastify composition are implemented. Stage 5-G passed 19 real PostgreSQL service cases plus concurrency, credential replacement, HTTP injection denial/GET/POST, rollback and logout checks. This is bounded isolated proof, not browser/production assurance. See the [Stage 5-G Milestone](./ARCHITECTURE/STAGE-5G-ISOLATED-POSTGRESQL-AUTHENTICATION-PROOF-MILESTONE-V1.md). |
| Integration and release | The current frontend-to-API/database journey, production GET enablement, deployment, and clinical readiness are not established by these proofs. |

The owner also reported the package guard tests passing 12/12 and active regression passing 52/52 before real execution. These are separate runs. Results above are recorded execution evidence, not tests rerun while updating this README. No product completion percentage is inferred from them.

**Stage 5's backend authentication foundation and bounded isolated proof are passed and documented. We are at the Stage 6 entry gate: bounded Web authentication/session/CSRF integration and the current Patient UI/API adapter. Browser integration requires its applicable owner decision and execution proof; the browser-state frontend continues in parallel.**

## Product foundation and continuity

The core concepts remain distinct:

| Concept | Meaning and boundary |
| --- | --- |
| Patient | Stable clinic identity with a persistent Clinic Patient Number (CPN). Patient identity is distinct from Case and Visit identity. |
| Case | One patient's operational and clinical journey; it can continue across visits and clinic days. |
| Visit | One organized encounter, belonging to exactly one Case and one Clinic Day. |
| Clinic Day | Working-date context; closing a day does not automatically complete an open Case. |
| Past History | Information from before entry into the clinic system. |
| Clinical History | History derived from preserved clinic Visits; those Visits remain its source. |
| Doctor | Main Admin, clinical authority, and system owner. Case completion and authorized Clinic Day closure remain Doctor decisions. |
| Nurse | Delegated operational participant; delegation does not transfer clinical authority or ownership. |

The product preserves these invariants:

- **Visit Exit does not equal Case Completion.**
- **Clinic Day Closure does not equal Case Completion.**
- **Past History remains separate from Clinical History.**
- A later Visit does not silently overwrite an earlier Visit's clinical record.
- Follow-up preserves the appropriate Patient/Case continuity without creating a duplicate Patient.
- Age is derived from date of birth; submitted age does not become persistence authority.
- Clinical prescription authorization and amendment follow their explicit contracts.
- A role selected in the frontend does not establish an authenticated server identity.

The foundation README was reviewed at
[`d80aad039bcf70d2b3bb74f0d449e637aada88d0`](https://github.com/Mk-arch2030/Dr_Roby_Clinic/blob/d80aad039bcf70d2b3bb74f0d449e637aada88d0/README.md).
Its historical starting status is not copied as ViP's present implementation status.

## Deliberate scope

The product centers on one clinic, patient continuity, cases, visits, clinic days, clinical history, and explicit Doctor/Nurse authority.

Hospital administration, LIMS, pharmacy, billing/ERP, AI diagnosis, multi-branch operations, and multi-tenancy are not implied by this scope. A dependency or an old implementation attempt does not authorize a product capability.

The deployment definition describes a single Web application without mandatory client installation. A future installable Android shell is a separate roadmap proposal: it should consume the same authorized API and semantic nucleus. Its technology, build/signing process, device proof, and delivery need their own decisions. Offline/synchronization is not included implicitly.

## Repository structure

| Path | Responsibility |
| --- | --- |
| `ARCHITECTURE/` | Manuscript, definitions, contracts, decisions, proof, and reconciliation history |
| `domain/` | Domain representations and rules |
| `application/` | Application services and behavioral tests |
| `backend/api/` | Controllers, routes, patient composition/runtime, and tests |
| `backend/persistence/` | Repositories and schema source |
| `backend/config/` | PostgreSQL configuration |
| `src/` | React interface, components, services, and browser-state implementation |

The schema source includes patients, clinic days, actors, and the patient-number sequence. This is not evidence that all clinical workflows have PostgreSQL persistence, nor an inventory of a freshly inspected live database.

The intended direction is a shared domain/application core, an authorized API/persistence boundary, and frontend adapters. Current browser workflows must be reconciled capability by capability when moving their source of truth to the backend.

## Frontend development

Use an appropriate Node.js/npm environment for the repository's locked dependencies.

For a **fresh checkout**:

```bash
git clone https://github.com/Mk-arch2030/ViP-Clinic-.git
cd ViP-Clinic-
npm ci
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/).

The current `dev` script uses `--host=0.0.0.0`, so Vite may also advertise reachable network interfaces. This is a development server, not a production deployment or a security certification. On an existing protected Termux worktree, do not replace or reset local work to follow fresh-checkout instructions.

Available scripts include:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development frontend on port 3000 |
| `npm run build` | Build the frontend |
| `npm run preview` | Preview the frontend build |
| `npm run lint` | Run the configured TypeScript check (`tsc --noEmit`) |
| `npm run test:active` | Run the defined active regression selection |
| `npm run test:historical` | Run the historical P37A selection; keep it separate from active proof |

These are command descriptions, not an authorization to rerun database-dependent tests in an unverified environment. Review a test's target and approved isolation before executing it. This README does not certify build/type-check results.

## Backend runtime boundary

- `composePatientRegistration` always registers `POST /patients`.
- It registers `GET /patients/:patientId` only with the explicit boolean option `enableRetrieveExistingPatient: true`.
- Composition does not start a listener or query the database.
- Caller-provided pools remain caller-owned; composition-owned pools follow the documented close lifecycle.
- `buildPatientRegistrationRuntime` can build a Fastify application without listening. The explicit start path is separate.
- The ordinary runtime entry does not opt into GET by default.
- `createPostgresPool` requires `DATABASE_URL`; the root `.env.example` is not a complete backend database configuration guide.

Do not point a runtime or test at a historical or production database by assumption. A Vite page loading does not establish backend connectivity.

## Roadmap and completion gates

The sequence below is a planning index. Each implementation increment needs its applicable contract, bounded owner authorization, execution evidence, review, and scoped Git preservation.

| Stage | Deliverable | Current position / exit gate |
| --- | --- | --- |
| 0 | Product definition | Manuscript exists; preserve clinic scope and meaning. |
| 1 | Contracts and authority reconciliation | Closure records exist; resolve provenance/status discrepancies for the next scope. |
| 2 | Domain and basic persistence | Bounded representations and historical proofs exist; preserve their limits. |
| 3 | Patient API foundation | POST foundation and explicit opt-in GET preserved; default GET OFF. |
| **4** | **Real-PostgreSQL composition proof** | **Bounded proof passed:** reviewed Termux output at 9d207d4, GET 200/404, compared state preserved, POST not invoked, no listener, exit 0. |
| **5** | **Authentication and server authorization** | **Bounded backend proof passed:** Stage 5-B–F delivered; Stage 5-G real PostgreSQL proof at c59fe2b, including lifecycle/session/role enforcement and tested failure/concurrency paths. No browser/production claim. |
| **6** | **Web authentication and current patient UI/API adapter** | **Next gate:** decide the bounded same-origin transport/session/CSRF and UI adapter scope, then prove frontend → secured API → isolated database, denial/error handling, server identity and preserved demo-data boundaries. |
| 7 | Case, Visit, and history persistence/API | Deliver small contracted vertical slices with transactional, continuity, and failure proof. |
| 8 | Clinical and operational workflow | Prove clinical record, prescription/follow-up, Case completion, day protection, delegation, and notifications within their contracts. |
| 9 | Integrated Web journey | Prove the full authorized workflow, durable reopening, server role enforcement, and contracted failure/concurrency behavior. |
| 10 | Operational readiness and deployment | Prove backup/restore and recovery; review environment/secrets/transport and obtain specific deployment authorization. |
| 11 | Controlled clinic pilot | Separate owner decision, bounded real-use scope, acceptance evidence, and rollback plan. |
| 12 | Repeatable Web delivery | Known release, documented setup/support/update/recovery, and acceptance for another clinic. |
| 13 | Optional Android delivery | Reconcile scope, choose technology, establish reproducible signed builds, device proof, and Web/Mobile semantic consistency. |

Stages can have parallel contract work, but successful UI demonstrations or unit tests do not skip integration, operational, or clinical-use gates.

The historical [Roadmap Reconciliation Specification](./ARCHITECTURE/ROADMAP-RECONCILIATION-SPECIFICATION-V1.md) refers to a different repository/head and some `frontend/src/` paths. Its claimed milestones must be reconciled with this repository before being treated as current evidence. Likewise, historical capability-matrix counts are not a reliable completion percentage without reconciliation.

## Authority and protected state

The operating sequence is:

**Understand → Define → Contract → Authorize → Build → Prove → Reconcile → Review → Preserve in Git → Milestone.**

Imported documents and historical `NOT_GRANTED` statements retain their temporal meaning. Later specific owner grants are read with the corresponding proof/reconciliation records; they are not blanket future permission. Historical authority-provenance gaps remain documented.

Current recorded boundaries:

```text
DEFAULT_GET = OFF
REAL_POSTGRESQL_COMPOSITION_PROOF = PASS_FOR_TESTED_ISOLATED_PATHS
REAL_POSTGRESQL_AUTH_PROOF = PASS_FOR_TESTED_ISOLATED_PATHS
BROWSER_AUTH_INTEGRATION = NOT_ESTABLISHED
PRODUCTION_GET_ENABLEMENT = NOT_GRANTED
PRODUCTION_DEPLOYMENT = NOT_GRANTED
CLINICAL_AUTHORITY = NOT_GRANTED
HISTORICAL_CLUSTER_MUTATION = PROHIBITED
DECISION_E_CLEANUP = NOT_AUTHORIZED
```

Here, `CLINICAL_AUTHORITY = NOT_GRANTED` describes project clinical-use authorization. It does not alter the Doctor's domain role.

The owner handoff protects four local dirty paths:

- `src/index.css`
- `ARCHITECTURE/DESIGN/VISUAL-THEME-IMPLEMENTATION-AUTHORIZATION-REVIEW-V1.md`
- `backend/api/routes/register-new-patient-route.js`
- `src/components/PatientIntake.tsx.pre-light-migration`

Do not modify, stage, commit, reset, clean, delete, or overwrite those paths. Do not use `git add .` or `git add -A` without explicit scoped authorization.

The historical Termux PostgreSQL cluster at `$PREFIX/var/lib/postgresql` must not be connected to, stopped, mutated, migrated, deleted, or repurposed.

The separate proof cluster under `$HOME/vip-retrieve-proof-isolated` is recorded as running in the handoff, using its isolated Unix socket and port 55439 with TCP listening disabled. Its current live state is not certified by this README. Cleanup Decision E remains unauthorized. Do not merge its synthetic fixture with browser demo or historical fixtures.

## Start reading here

- [Product Manuscript](./ARCHITECTURE/MANUSCRIPT/DR-ROBY-CLINIC-PRODUCT-MANUSCRIPT.md)
- [Domain / Business Model Closure](./ARCHITECTURE/DOMAIN-BUSINESS-MODEL-IMPLEMENTATION-CLOSURE.md)
- [ViP Product Semantic Reconciliation](./ARCHITECTURE/VIP-PRODUCT-SEMANTIC-CLOSURE-RECONCILIATION-V1.md)
- [Authority Reestablishment Review](./ARCHITECTURE/AUTHORITY-REESTABLISHMENT-DECISION-V1.md)
- [Independent Authority Source Review](./ARCHITECTURE/INDEPENDENT-CANONICAL-AUTHORITY-SOURCE-REVIEW-DECISION-V1.md)
- [API Authority Reconciliation](./ARCHITECTURE/API-AUTHORITY-REESTABLISHMENT-DECISION-V1.md)
- [Live Persistence Closure Reconciliation](./ARCHITECTURE/PERSISTENCE-LIVE-DATABASE-CLOSURE-RECONCILIATION-V1.md)
- [Authentication Contract Closure Proof](./ARCHITECTURE/AUTHENTICATION-TECHNICAL-CONTRACT-CLOSURE-PROOF-V1.md)
- [Isolated PostgreSQL GET Milestone and Later Grant Reconciliation](./ARCHITECTURE/RETRIEVE-EXISTING-PATIENT-ISOLATED-POSTGRESQL-GET-RUNTIME-PROOF-MILESTONE-V1.md)
- [Stage 4 Composition PostgreSQL Milestone](./ARCHITECTURE/RETRIEVE-EXISTING-PATIENT-COMPOSITION-POSTGRESQL-PROOF-MILESTONE-V1.md)
- [Stage 5-G Authentication PostgreSQL Milestone](./ARCHITECTURE/STAGE-5G-ISOLATED-POSTGRESQL-AUTHENTICATION-PROOF-MILESTONE-V1.md)
- [Stage 5 Authentication Implementation and Termux Package](./ARCHITECTURE/STAGE-5C-G-AUTHENTICATION-IMPLEMENTATION-AND-TERMUX-PROOF-PACKAGE-V1.md)
- [Current Patient Composition](./backend/api/patient-registration-composition.js)
- [Current Runtime](./backend/api/patient-registration-runtime.js)
- [Current Frontend State](./src/services/clinicStore.ts)

This README is an entry point and status index. It does not replace the Manuscript, authorize implementation or deployment, amend a contract, or retroactively expand a proof.

## Maturity and license

The repository is under active controlled development. No license file was present in the reviewed source tree; this README does not grant a license.

**ROBY FACTORY — built with proof, preserved with Git.**

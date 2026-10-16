# Stage 7 acceptance evidence matrix

Mission: RBF-VIP-STAGE7-SEVENTH-STAR-001

Owner: MOHAMED.K_ROBY. Prepared by Astra, 2026-10-16. Inspected source: `91966c657c7357fca1c3476966b9199207d1f484`. Documentation only; no clinical release.

## Vocabulary and evidence keys

Allowed results: VERIFIED; REPORTED — NOT INDEPENDENTLY VERIFIED; NOT RUN; NOT PROVEN; OUT OF SCOPE; BLOCKED. In the table, V means VERIFIED at the stated layer only; R means REPORTED — NOT INDEPENDENTLY VERIFIED. No source inspection is runtime proof.

Authority paths: Manuscript = ARCHITECTURE/MANUSCRIPT/DR-ROBY-CLINIC-PRODUCT-MANUSCRIPT.md; CONTRACT-01/03/04 are under ARCHITECTURE/CONTRACTS; V2 = ARCHITECTURE/CONTRACTS/CASE-LIFECYCLE-POLICY-B-CONTROLLED-AMENDMENT-V2.md, qualified by ARCHITECTURE/CASE-LIFECYCLE-POLICY-B-RECONCILIATION-V2.md. CASE_CREATE = ARCHITECTURE/STAGE7-DOCTOR-CASE-CREATE-V1.md. Authentication = ARCHITECTURE/AUTHENTICATION-TECHNICAL-CONTRACT-V1.md with its reconciliation and subsequent Stage6 scope.

S1–S10 are ordered scenarios in backend/clinical/case-create-scenarios.cjs. A = backend/clinical/case-create-api-proof.cjs::proveCaseCreateApi; P = backend/clinical/postgres-case-create-proof.cjs::run. All runtime evidence references resolve through E1 (Work logs), E2 (Termux regression), E3 (Termux focused), E4 (Termux PG) in the [inventory](STAGE7-PROOF-INVENTORY.md).

| Requirement | Authority source | Implementation location | Test or proof | Environment | Result | Evidence reference | Remaining limitation |
|---|---|---|---|---|---|---|---|
| Doctor-only CASE_CREATE | Manuscript §§10–11/13; CONTRACT-03; V2 Normative recording | backend/auth/authorization.js::authorize; application/services/create-case.js::create | S4 + A | Memory/API; PG reported | V for Work control flow; R for PG | E1 / E4 | No browser authority proof |
| Authenticated session and reauthentication | CASE_CREATE Protocol; V2 receipt rules | backend/auth/auth-service.js::withAuthorized | S5 + A revoked/fresh login | Memory/API; PG reported | V / R | E1 / E4 | Not an actual browser reload |
| Origin and CSRF | CASE_CREATE Protocol; authentication contract; protected composition | backend/api/secured-patient-composition.js; withAuthorized | A missing cookie/Nurse/CSRF/origin/cross-site denials | Fastify injection; PG reported | V / R | E1 / E4 | No browser/TLS transport claim |
| Atomic Case and durable receipt | V2 transaction/receipt rules; CASE_CREATE Transaction and replay | AuthRepository.transaction; CaseCreateRepository.create/saveReceipt | S1/S8; P actual SQL fault | Memory; PG reported | V / R | E1 / E4 | Memory is not SQL durability |
| Idempotent replay | V2 same-key same-meaning rule | create-case.js::create; fingerprintIntent | S1/S7/S9 + A, counts and result equality | Memory/API; PG reported | V / R | E1 / E4 | New operation ID is different intent identity |
| Changed intent or Patient conflict | CASE_CREATE Protocol / Transaction and replay | clinical-foundation.js::fingerprintIntent; receipt comparison | S2 summary and Patient UUID changed; A summary conflict | Memory/API; PG reported | V / R | E1 / E4 | Changed Patient uses a random unregistered UUID; not two-existing-Patient proof |
| Concurrency | V2 preserve auth serialization | backend/persistence/auth-repository.js::transaction advisory lock | S7 eight identical requests and two conflicting intents; Case/receipt counts | Serialized model; PG reported | V / R | E1 / E4 | Model does not prove PG lock behavior; no load/scaling claim |
| Patient foreign key | CONTRACT-01; V2 stable ownership | CaseCreateRepository.patient FOR KEY SHARE; migration002 FK | S3 missing Patient; P SQLSTATE23503 | Memory; PG reported | V / R | E1 / E4 | Work did not execute SQL |
| Rollback | CASE_CREATE transaction rule | same transaction client and outer COMMIT | S8; P division-by-zero receipt fault; populated-down refusal | Memory; PG reported | V / R | E1 / E4 | No production rollback exercise |
| Receipt recovery / negative access | V2 current-authority replay; CASE_CREATE recovery protocol | create-case.js::recover, actor-scoped query | S2/S4/S5/S10 + A denied receipt, revoked session, fresh login | Memory/API; PG reported | V / R | E1 / E4 | UNKNOWN is not a rollback certificate |
| Lost acknowledgement after COMMIT | CASE_CREATE Transaction and replay / Evidence boundaries | 503 uncertainty and authenticated recovery | S9 throws after COMMIT succeeds | Memory; real COMMIT reported | V / R | E1 / E4 | NOT PROVEN for actual socket failure during COMMIT or process crash |
| No implicit Visit | Manuscript §5/13; V2 lifecycle operations | create-case.js writes Case and receipt only | P preserved visits snapshot; S case counts | Source inspection; PG reported | V source only / R runtime | E1 / E4 | Snapshot Visit table initially empty |
| No implicit Clinic Day | Manuscript §5/13; V2 no mandatory opening Day | CaseCreateRepository.create has no Day write | P clinic_days snapshot | Source inspection; PG reported | V source only / R runtime | E1 / E4 | Not populated closed-Day graph proof |
| No arrival or CPN/Patient effects | Manuscript §5/12; V2 recording/counting rules | Case-only repository; no registration or arrival invocation | P patients and CPN sequence snapshot | Source inspection; PG reported | V source only / R runtime | E1 / E4 | No automatic queue/Rx path; source inspection not runtime test |
| Historical clinical preservation | Manuscript §12/13; CONTRACT-04; V2 history | No Visit/Rx/Day update path; A full Case/receipt snapshots | A snapshot equality; P preserved graph subset | Memory/API; PG reported | V bounded snapshot / R / NOT PROVEN broader history | E1 / E4 | Nonempty Visit/Rx/closed-Day and full longitudinal content not established |

E1 covers existing tests at source 32db6e1bce4b644212f1307bab0afff4074a9d17; 91966c6 adds only its historical report. E4 reports execution at 91966c6. Both parents and diffs were inspected. Receipt lookup is original-outcome retrieval, not a current clinical dossier API. Completion, reopening, Visit recording, prescription and clinical deployment are OUT OF SCOPE. Browser is NOT RUN.


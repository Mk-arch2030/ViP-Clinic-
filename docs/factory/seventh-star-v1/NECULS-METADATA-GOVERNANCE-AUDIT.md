# Neculs metadata governance audit

Mission: RBF-VIP-STAGE7-SEVENTH-STAR-001

Owner: MOHAMED.K_ROBY. Prepared by Astra, 2026-10-16. Inspected source: `91966c657c7357fca1c3476966b9199207d1f484`. Documentation only; no clinical release.

## Scope and finding

Searched tracked paths and repository text for Neculs, metadata and nucleus at the fixed baseline. No named Neculs schema/version/contract or executable Neculs enforcement mechanism was identified. This is a bounded repository finding, not proof that no external artifact exists. Library historical-image search did not resolve the visual timeline; no image content is claimed inspected.

| Artifact / structure | Classification | Actual authority and limit |
|---|---|---|
| metadata.json: name,description,requestFramePermissions[],majorCapabilities[] | Documented; data artifact implemented | No explicit schema/version field or manuscript/contract pointers. Gemini capability token is not clinical authorization or proof of a working integration. |
| ARCHITECTURE/DOMAIN-NUCLEUS-CLOSURE.md | Documented | CLOSED representation of Patient/Case/Visit/Day. Explicit historical runtime/persistence/API/auth NOT_IMPLEMENTED. Nucleus is not automatically Neculs. |
| ARCHITECTURE/MILESTONES/MILESTONE_ACTOR_DOMAIN_NUCLEUS_20260919_230125.md and SNAPSHOT_ACTOR_DOMAIN_NUCLEUS_20260919_230125.md | Documented artifacts identified | Historical actor-domain milestones, not a discovered metadata policy engine. |
| ARCHITECTURE/MILESTONE-MR-ROBY-CLINIC-METADATA-CLOSURE-2026-09-24.md | Documented | References surface boundary and its closure/hash; AUTHORIZATION_EFFECT=NONE; IMPLEMENTATION_EFFECT=NONE. |
| ARCHITECTURE/CLINIC-SURFACE-BOUNDARY-V1.md | Documented | UI expresses authorized API behavior; no direct SQL/clinical authority. Definition-only. |
| ARCHITECTURE/FINAL-AUTHORITY-MAP-V1.md | Documented | Reconciliation map, AUTHORIZATION_EFFECT=NONE; historical restrictions must be read with later bounded authorization. |
| authorization.js + withAuthorized + PostgreSQL constraints | Implemented; bounded Work control flow Runtime Verified | Actual Doctor/session/CSRF/transaction enforcement resides in code. Real PG result reported E4; not automatic metadata interpretation. |
| Automatic Neculs-driven policy compilation/enforcement | Not Proven | No interpreter/loader/test tying metadata to runtime authorization found. No new authority or schema invented. |

## How governance actually influenced this increment

Scope came from Owner CASE_CREATE authorization and V2 model; original UI, Visit, completion/reopen and prescriptions remained outside it. Server authorization comes from Actor policy rather than metadata permissions. Atomicity/replay test expectations derive from V2/CASE_CREATE contracts. Evidence classification follows Factory Standard V1, separating inspected source, Work test records and reported device SQL. Release restrictions are explicit Owner gates; neither metadata nor green tests can release the clinic.

This is procedural contract-led governance with implemented runtime controls. It is not demonstrated automated Neculs enforcement. Any external Neculs artifact should be supplied by exact path/version for a later review; no need to invent it to label the present milestone successful.

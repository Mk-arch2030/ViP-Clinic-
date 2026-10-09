# Stage 5-A — Actor and Authentication Source Reconciliation V1

OWNER: MOHAMED.K_ROBY  
STATUS: SOURCE_REVIEW_COMPLETE — IMPLEMENTATION_DESIGN_PROPOSED  
REVIEWED_HEAD: a6e76e93b8324ddf28beda4948a5b3cd1abd3ef7  
REVIEW_DATE: 2026-10-10 (Africa/Cairo)  
DESIGN_PACKAGE_AND_SCOPED_GITHUB_PRESERVATION: OWNER_AUTHORIZED_IN_CHAT  
AUTHENTICATION_IMPLEMENTATION: NOT_GRANTED  
DATABASE_EXECUTION: NOT_GRANTED  
DOMAIN_CODE_AMENDMENT: NOT_GRANTED  
DEPLOYMENT_AND_CLINICAL_USE: NOT_GRANTED

## 1. Purpose and chronology

The owner approved preparing this design package after Stage 4 proof,
documentation preservation and Termux synchronization. This is a documentation
increment. It does not implement the design or make imported historical
permissions current.

Stage 4 remains bounded proof at tested commit
9d207d4a1a0fbffd0bc38035279a7ae3f3b43925. Later documentation at the reviewed
HEAD preserves it. Owner-provided synchronization output confirms local HEAD
matched that documentation package with protected worktree state preserved.
No live database or Android process was inspected during this review.

## 2. Current-source findings

| Source | Observed behavior | Design consequence |
| --- | --- | --- |
| domain/actor.js | Stable actorIdentityReference and Doctor/Nurse roles; lifecycle validation/storage only for Nurse | Reconcile Doctor lifecycle representation with the later Actor-wide decision before depending on it |
| backend/persistence/schema.sql | actors(actor_id UUID, actor_role, lifecycle_state); lifecycle is stored for both roles | Identity/role/lifecycle exist; credentials and sessions are separate responsibilities |
| backend/server.js | Fastify construction and explicit listening; no authentication boundary | Authentication belongs in an explicitly reviewed composition/plugin, not an assumed property of Fastify |
| patient-registration-composition.js | POST always; GET only explicit true; no identity/session/permission guard | Preserve the tested default and add any secured composition as a separate bounded increment |
| Existing patient controllers | Dispatch using existing repository/pool; no authenticated actor resolution | Resolve identity and authorize before controller/service dispatch in a future secured composition |
| manage-clinic-day.js | Caller-supplied actorRole string checked for Doctor | Business guard exists, but this is not proof that the caller was authenticated as that Doctor |
| src/services/clinicStore.ts | Role chosen in local state; localStorage and browser clinical guards | Browser role is presentation/demo state; it must never become the server's authority input |

The source tree at the reviewed HEAD has no implemented login/session module.
The reviewed schema has no credential/session/delegation storage. These are
source findings, not an independently inspected inventory of live databases.

## 3. Historical definitions and later reconciliation

| Topic | Definition to preserve | Temporal reconciliation |
| --- | --- | --- |
| Authentication mechanism | Local application-managed password authentication with server-managed sessions | Read the completion amendment and closure proof after older OPEN declarations |
| Stable Actor identity | Logically distinct from username, role, credentials and session identifier | Do not create a Patient identity or derive role from a login label |
| Actor persistence key | actor_id UUID with PostgreSQL 18 uuidv7() | The later identity-mapping final sections close physical encoding; Authentication's earlier deferral does not require reopening UUID choice |
| Lifecycle | ACTIVE / DEACTIVATED applies to both Doctor and Nurse | Later Actor-wide semantics supersede the older Nurse-only scope of representation; no automatic deactivation/reactivation workflow is granted |
| Nurse delegation | Four approved operational capabilities; FULL or Doctor-selected LIMITED | FULL is not administrator access or unrestricted API access |
| Nurse lifecycle history | Deactivation preserves identity and historical associations | No deletion, identity replacement, promotion, or ownership transfer |
| Historical Main Admin | Existing historical Doctor record remains protected | Do not connect to the historical cluster, reuse its identity as a synthetic fixture, or enroll its credentials under this package |

The original domain closure is preserved as a historical representation proof.
This review identifies alignment work; it does not retroactively invalidate that
proof or silently amend its source.

## 4. Endpoint permission mapping gap

The four approved delegation categories are Patient Entry / Arrival,
Patient Data Recording, Patient Exit, and Doctor Notification.

The current GET by technical patient ID is not explicitly assigned to one of
those categories. Nurse access must remain denied in the proposed policy until
an explicit endpoint/capability mapping is approved. This is a conservative
design consequence, not a claim that the final product must permanently forbid
Nurse retrieval.

Registration of basic personal data is a candidate mapping to Patient Data
Recording, but the exact payload/capability mapping must be approved before
Nurse route enforcement is enabled. That mapping cannot include Doctor-owned
authoritative Past History mutation merely because the route records data.

A role check alone cannot implement FULL/LIMITED delegation. Unrecognized
operations, missing delegation, missing identity and missing policy are denied.

## 5. What Stage 4 does not establish for Stage 5

- No login/credential verifier/session runtime proof.
- No actor lifecycle enforcement through a request boundary.
- No Doctor/Nurse authorization proof against direct API requests.
- No browser-to-server identity binding.
- No production TLS/cookie/proxy or clinical-use acceptance.
- No permission to modify the earlier isolated database fixture.

## 6. Reconciliation result

SOURCE_REVIEW: COMPLETE  
ACTOR_WIDE_LIFECYCLE_SOURCE_ALIGNMENT: GAP_IDENTIFIED  
AUTHENTICATION_CONTRACT_DEFINITION: CLOSED_IN_HISTORICAL_CORPUS  
AUTHORIZATION_CONTRACT_DEFINITION: CLOSED_IN_HISTORICAL_CORPUS  
CURRENT_AUTH_RUNTIME: NOT_IMPLEMENTED  
ENDPOINT_PERMISSION_MAPPING: REVIEW_REQUIRED  
NEW_IMPLEMENTATION_AUTHORITY: NONE

## 7. Source references

- [Authentication contract](./AUTHENTICATION-TECHNICAL-CONTRACT-V1.md)
- [Completion decision](./AUTHENTICATION-TECHNICAL-CONTRACT-COMPLETION-DECISION-V1.md)
- [Definition closure proof](./AUTHENTICATION-TECHNICAL-CONTRACT-CLOSURE-PROOF-V1.md)
- [Authorization contract](./AUTHORIZATION-TECHNICAL-CONTRACT-V1.md)
- [Lifecycle/delegation amendment](./AUTHORIZATION-ACTOR-LIFECYCLE-DELEGATION-AMENDMENT-V1.md)
- [Actor-wide lifecycle decision](./ACTOR-LIFECYCLE-SEMANTICS-AUTHORITY-DECISION-V1.md)
- [Final identity mapping](./ACTOR-TECHNICAL-IDENTITY-MAPPING-RECONCILIATION-V1.md)
- [Historical Actor reconstruction proof](./ACTOR-CANONICAL-REBUILD-SOURCE-IMPLEMENTATION-LIVE-PROOF-V1.md)
- [Contract 03](./CONTRACTS/CONTRACT-03-ACTOR-AUTHORITY.md)
- [Application capability contract](./APPLICATION-CAPABILITY-CONTRACT-V1.md)
- [Actor source](../domain/actor.js)
- [Current schema](../backend/persistence/schema.sql)
- [Current composition](../backend/api/patient-registration-composition.js)
- [Frontend state](../src/services/clinicStore.ts)
- [Stage 4 milestone](./RETRIEVE-EXISTING-PATIENT-COMPOSITION-POSTGRESQL-PROOF-MILESTONE-V1.md)

Continue with [implementation design](./STAGE-5A-AUTHENTICATION-AND-AUTHORIZATION-IMPLEMENTATION-DESIGN-V1.md)
and [bounded decision package](./STAGE-5A-BOUNDED-IMPLEMENTATION-DECISION-PACKAGE-V1.md).

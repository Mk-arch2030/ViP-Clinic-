# ViP Candidate Continuation Evidence Coverage Matrix V1

STATUS = EVIDENCE COVERAGE MATRIX
PURPOSE = CANDIDATE CONTINUATION BOUNDARY
IMPLEMENTATION_AUTHORIZATION_GRANTED_BY_THIS_DOCUMENT = NONE
PRODUCTION_AUTHORIZATION_GRANTED_BY_THIS_DOCUMENT = NONE
CANONICAL_CONTRACT_MUTATION = NONE
AUTHORITY_REESTABLISHMENT = NONE
SCOPE_EXPANSION = NONE

## 1. EVIDENCE CLASSIFICATION

E1 = HISTORICAL AUTHORIZATION / DECISION EVIDENCE
E2 = ACTUAL CURRENT REPOSITORY IMPLEMENTATION EVIDENCE
E3 = CURRENT DEFERRED / UNAUTHORIZED EVIDENCE
E4 = CANDIDATE-SCOPE EVIDENCE
E5 = AUTHORITY-GAP / CONTROL EVIDENCE

## 2. COVERAGE MATRIX

| ID | Surface | Candidate Activity | Actual Evidence | Evidence Location | Implemented? | Canonical Authorization? | Current Status | Candidate Allowed? | Production Locked? | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| C01 | Product & Patient UX | UX refinement | React UI, workflow, and Patient Intake surfaces exist | src/App.tsx, src/components/* | YES | BOUNDED / NOT GLOBAL | CANDIDATE RUNTIME | YES | YES | Refinement only; includes Patient Intake UX |
| C03 | Patient Directory | UX refinement | Patient search/dossier flow exists | src/App.tsx, src/components/* | YES | BOUNDED | CANDIDATE RUNTIME | YES | YES | Candidate refinement |
| C04 | Patient Dossier | UX refinement | Identity/CPN/DOB/age/case/visit presentation exists | src/components/*, src/App.tsx | YES | BOUNDED | CANDIDATE RUNTIME | YES | YES | Derived age remains non-authoritative |
| C05 | Clinical Workspace | UX refinement | Consultation fields and controls exist | src/components/DoctorConsultation.tsx | YES | BOUNDED / CANDIDATE | CANDIDATE RUNTIME | YES | YES | No new clinical capability |
| C06 | Pharmacotherapy UX | UX refinement | Prescription and authorization UI exists | src/components/DoctorConsultation.tsx, src/services/clinicStore.ts | YES | BOUNDED | CANDIDATE RUNTIME | YES | YES | No pharmacy/dispensing capability |
| C07 | Domain Semantics | Semantic reconciliation | Patient/Case/Visit/Clinic Day distinctions exist | domain/*.js, src/services/clinicStore.ts | YES | PRODUCT SEMANTIC CLOSURE | CLOSED SEMANTIC BASE | YES | YES | No contract mutation |
| C08 | Patient Domain | Semantic reconciliation | Patient requires DOB and derives age | domain/patient.js, src/domain/patientAge.ts | YES | A06 BOUNDED | IMPLEMENTED BOUNDED | YES | YES | Age not authoritative stored fact |
| C09 | Case Domain | Workflow design | Case lifecycle states exist | domain/case.js, src/services/clinicStore.ts | YES | PRODUCT BOUNDED | CANDIDATE RUNTIME | YES | YES | Workflow refinement only |
| C10 | Visit Domain | Workflow design | Visit requires Case and Clinic Day | domain/visit.js, src/services/clinicStore.ts | YES | PRODUCT BOUNDED | CANDIDATE RUNTIME | YES | YES | No overwrite across visits |
| C11 | Clinic Day | Workflow design | Open/close day behavior exists | domain/clinic-day.js, src/services/clinicStore.ts | YES | BOUNDED | CANDIDATE RUNTIME | YES | YES | Production protection not implied |
| C12 | Doctor Authority UX | Candidate technical analysis | Actor role checks exist in clinicStore/UI | domain/actor.js, src/services/clinicStore.ts | YES | DOMAIN/CANDIDATE ONLY | NON-PRODUCTION AUTHORITY | YES | YES | Not security authorization |
| C13 | Nurse Delegation UX | Candidate workflow design | Nurse role/lifecycle representation exists | domain/actor.js, src/App.tsx | YES | DOMAIN/CANDIDATE ONLY | NON-PRODUCTION | YES | YES | Runtime authz deferred |
| C14 | Arrival Workflow | Workflow design | Arrival/Visit registration implemented | src/services/clinicStore.ts, src/App.tsx | YES | CANDIDATE / BOUNDED | CANDIDATE RUNTIME | YES | YES | No production promotion |
| C15 | Encounter Update | Workflow design | Encounter update flow exists | src/services/clinicStore.ts, src/App.tsx | YES | CANDIDATE / BOUNDED | CANDIDATE RUNTIME | YES | YES | Preserve Visit boundary |
| C16 | Prescription Authorization | Workflow design | Doctor-only store guard exists | src/services/clinicStore.ts, src/components/DoctorConsultation.tsx | YES | PRODUCT/CANDIDATE | NON-PRODUCTION AUTHORITY | YES | YES | Not authentication/authz infrastructure |
| C17 | Case Completion | Workflow design | Doctor-only completion exists | src/services/clinicStore.ts, src/App.tsx | YES | CANDIDATE | CANDIDATE RUNTIME | YES | YES | Candidate behavior |
| C18 | Daily Closure | Workflow design | Doctor-only clinic-day closure exists | src/services/clinicStore.ts, src/App.tsx | YES | CANDIDATE | CANDIDATE RUNTIME | YES | YES | Production protection deferred |
| C19 | Patient PostgreSQL / SQL Persistence | Technical analysis | Real PostgreSQL Patient repository, patients table, and sequence exist | backend/persistence/patient-repository.js, backend/persistence/schema.sql | YES | A06 BOUNDED YES | PROVEN BOUNDED | YES | YES | SQL evidence is restricted to the authorized Patient persistence behavior |

| C21 | Patient API Routes | Technical analysis | POST/GET patient routes exist | backend/api/routes/patient-routes.js | YES | BOUNDED YES | PROVEN BOUNDED | YES | YES | No new routes implied |
| C22 | Patient API Controllers | Technical analysis | Registration/retrieval controllers exist | backend/api/controllers/* | YES | BOUNDED YES | PROVEN BOUNDED | YES | YES | Closed request/response boundary |
| C23 | Patient Application Services | Technical analysis | Registration transaction and retrieval services exist | application/services/* | YES | BOUNDED YES | PROVEN BOUNDED | YES | YES | No new capability implied |
| C24 | Candidate Tests | Tests / proofs | Application/backend tests exist | application/tests/*, backend/*test.js | YES | TEST EVIDENCE | CANDIDATE PROOF | YES | YES | Tests do not grant authority |
| C25 | Candidate Documentation | Documentation | Architecture and decision corpus exists | ARCHITECTURE/* | YES | EXISTING CORPUS | EVIDENCE BASE | YES | YES | Documentation cannot self-authorize |
| L01 | Production Implementation | Production implementation | Current authority not proven | ARCHITECTURE/AUTHORITY-* | NO | NOT_PROVEN | LOCKED | NO | YES | No production implementation |
| L02 | Database Expansion | DB expansion | Patient scope bounded; unrelated expansion unauthorized | ARCHITECTURE/PERSISTENCE-IMPLEMENTATION-AUTHORIZATION-DECISION-V1.md | NO | NO | LOCKED | NO | YES | No expansion beyond proven scope |
| L03 | Authentication | Authentication implementation | Authentication explicitly unauthorized/deferred | ARCHITECTURE/AUTHENTICATION-TECHNICAL-CONTRACT-CLOSURE-DECISION-V1.md | NO | NO | LOCKED | NO | YES | No login/session implementation |
| L04 | Runtime Authorization | Authorization implementation | Runtime authorization explicitly unauthorized/deferred | ARCHITECTURE/AUTHENTICATION-TECHNICAL-CONTRACT-CLOSURE-PROOF-V1.md | NO | NO | LOCKED | NO | YES | Actor role is not security authz |
| L05 | Deployment | Production deployment | Deployment explicitly unauthorized/deferred | ARCHITECTURE/API-RUNTIME-IMPLEMENTATION-CLOSURE-PROOF-V1.md | NO | NO | LOCKED | NO | YES | No production deployment |
| L06 | Migration | Database migration | Migration explicitly unauthorized | ARCHITECTURE/PERSISTENCE-IMPLEMENTATION-AUTHORIZATION-DECISION-V1.md | NO | NO | LOCKED | NO | YES | No migration work |
| L07 | Production Runtime | Production runtime changes | Production runtime authority not proven | ARCHITECTURE/INDEPENDENT-CANONICAL-AUTHORITY-SOURCE-REVIEW-DECISION-V1.md | NO | NOT_PROVEN | LOCKED | NO | YES | Candidate runtime only |

## 3. AUTHORITY CONTROL

CURRENT_CONTROLLING_AUTHORITY = NOT_PROVEN
AUTHORITY_GAP = PROVEN
AUTHORITY_REESTABLISHMENT = NOT_PROVEN
INDEPENDENT_CANONICAL_AUTHORITY_SOURCE = NOT_FOUND
CANONICAL_IMPLEMENTATION_AUTHORIZATION = NOT_PROVEN
PRODUCTION_IMPLEMENTATION_AUTHORIZATION = NOT_PROVEN

## 4. CANDIDATE CONTINUATION BOUNDARY

CANDIDATE_ALLOWED =
- UX refinement
- Domain / semantic reconciliation
- Candidate workflow design
- Candidate technical analysis
- Candidate tests / proofs
- Candidate documentation

CANDIDATE_ALLOWED_WITHOUT_PRODUCTION_AUTHORIZATION = YES

## 5. HARD LOCKS

PRODUCTION_IMPLEMENTATION = LOCKED
DATABASE_EXPANSION = LOCKED
AUTHENTICATION_IMPLEMENTATION = LOCKED
AUTHORIZATION_IMPLEMENTATION = LOCKED
DEPLOYMENT = LOCKED
MIGRATION = LOCKED
PRODUCTION_RUNTIME = LOCKED
CANONICAL_AUTHORITY_MUTATION = LOCKED
SCOPE_EXPANSION = LOCKED
AUTHORITY_TRANSFER = LOCKED
CANDIDATE_TO_CANONICAL_PROMOTION = LOCKED

## 6. NON-RETROACTIVE INTERPRETATION

Existing bounded Patient PostgreSQL/API implementation is classified as
HISTORICALLY_AUTHORIZED_BOUNDED_IMPLEMENTATION where supported by the
corresponding authorization and closure evidence.

This matrix does not retroactively revoke or invalidate that bounded evidence.

## 7. DECISION

CANDIDATE_CONTINUATION = PERMITTED_WITHIN_BOUNDARY
CANDIDATE_CONTINUATION_IS_PRODUCTION_AUTHORIZATION = NO
CANDIDATE_CONTINUATION_IS_CANONICAL_AUTHORIZATION = NO
NEW_IMPLEMENTATION_AUTHORIZATION = NONE
CONTRACT_MUTATION = NONE
AUTHORITY_REOPENING = NONE
FAIL = 0

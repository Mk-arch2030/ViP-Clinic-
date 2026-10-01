# ViP Clinic — Daily Census Gold Reconciliation Candidate V1

STATUS = CANDIDATE RECONCILIATION DOCUMENT
SCOPE = APPLICATION CAPABILITY 9.1
CAPABILITY = REVIEW DAILY DATA

## 1. PURPOSE

This document reconciles the ViP Daily Census product surface against the
Canonical Dr.Roby Clinic definition of Application Capability 9.1.

This document records evidence only.

It does not authorize implementation, API runtime work, persistence changes,
database changes, authentication changes, authorization infrastructure,
deployment changes, or modification of Canonical contracts.

## 2. CANONICAL CAPABILITY

Application Capability 9.1 requires Doctor review of the Clinic Day's daily
data before explicit Clinic Day Closure.

Daily data must remain preserved.

The Canonical API surface defines:

GET /clinic-days/{clinicDayId}/daily-data

The existence of this API definition does not by itself prove runtime
implementation.

## 3. VIP PRODUCT SURFACE

The ViP workspace contains:

src/components/DailyCensus.tsx

The Daily Census currently provides:

- total Visit count;
- AWAITING_DOCTOR count;
- WITH_DOCTOR count;
- EXITED / COMPLETED count;
- filtering by operational Visit status;
- Patient context for each Visit;
- Case context for each Visit;
- Visit identifier and Visit time;
- navigation to Patient Dossier;
- navigation to Doctor Consultation;
- Visit Exit action;
- navigation to Patient Intake.

The Daily Census consumes Visit, Patient, and Case state supplied by the
existing application state.

It does not establish an independent source of truth.

## 4. CLINIC DAY RELATIONSHIP

ViP Visit records contain:

clinicDayId
date
operationalStatus

New Visits are associated with the current Clinic Day.

The Clinic Store provides explicit Clinic Day state and retrieval.

## 5. CLOSURE RELATIONSHIP

ViP provides explicit Clinic Day closure through:

closeClinicDay(actorRole)

The current implementation requires Doctor authority.

On closure it records:

status = CLOSED
lifecycle = CONCLUDED
closedAt
closedBy = Doctor

Visits belonging to the current Clinic Day are transitioned to:

protectionState = PROTECTED

This demonstrates a product-level relationship between Clinic Day closure and
preservation/protection of daily Visit data.

## 6. EVIDENCE MATCH

The following Canonical concepts are represented in the ViP product surface:

| Canonical Concept | ViP Evidence | Status |
| --- | --- | --- |
| Clinic Day daily data | DailyCensus over Visits | PRESENT |
| Visit operational state | operationalStatus filters | PRESENT |
| Patient context | Patient lookup by patientId | PRESENT |
| Case context | Case lookup by caseId | PRESENT |
| Clinic Day relationship | Visit clinicDayId | PRESENT |
| Doctor-controlled closure | closeClinicDay Doctor guard | PRESENT |
| Daily data preservation | Visit protection on closure | PRESENT |

## 7. EVIDENCE DELTA

The following Canonical implementation evidence is not established by the
current ViP workspace:

- an independently proven 9.1 Doctor Review operation;
- runtime implementation of the Canonical daily-data API;
- persistence-backed daily-data review;
- API runtime proof for GET /clinic-days/{clinicDayId}/daily-data;
- a dedicated implementation proof document establishing 9.1 as
  IMPLEMENTED_AND_PROVEN.

The Daily Census UI therefore constitutes product-surface evidence, not
Canonical implementation proof.

## 8. TECHNICAL BOUNDARY

The following remain outside this Candidate Reconciliation:

- PostgreSQL implementation;
- database schema changes;
- persistence repository implementation;
- Fastify API runtime implementation;
- authentication implementation;
- authorization infrastructure;
- deployment;
- Canonical contract mutation.

No technical implementation decision is made by this document.

## 9. AUTHORIZATION STATE

IMPLEMENTATION_AUTHORIZED = NO

DATABASE_CHANGE = NONE
API_RUNTIME_CHANGE = NONE
AUTHENTICATION_CHANGE = NONE
AUTHORIZATION_INFRASTRUCTURE_CHANGE = NONE
RUNTIME_CHANGE = NONE
CANONICAL_CONTRACT_CHANGE = NONE

## 10. RECONCILIATION STATE

PRODUCT_SURFACE = PRESENT
CANONICAL_CAPABILITY = CLOSED
PRODUCT_EVIDENCE = PRESENT
IMPLEMENTATION_PROOF = NOT ESTABLISHED
API_RUNTIME = NOT IMPLEMENTED
PERSISTENCE = NOT IMPLEMENTED
RUNTIME_PROOF = NOT PROVEN
CONTRACT_GAP = NO
TECHNICAL_DECISION = DEFERRED
UNAUTHORIZED_EXPANSION = NO
FAIL = 0

## 11. FINAL CANDIDATE VERDICT

9.1 REVIEW DAILY DATA is a valid ViP product-surface candidate.

The ViP Daily Census materially corresponds to the Canonical daily-data review
boundary, but the current evidence does not establish Canonical
IMPLEMENTED_AND_PROVEN status.

The remaining gap is evidence and implementation proof, not a newly discovered
product-contract gap.

This document does not authorize implementation.


# CONTINUITY GOLD RECONCILIATION CANDIDATE V1

Status: CANDIDATE RECONCILIATION DOCUMENT

Authority:
Canonical Dr_Roby_Clinic

Candidate Workspaces:
- Termux ViP Clinic Product Candidate
- Gemini ViP Candidate Workspace

Canonical Baseline:
d80aad039bcf70d2b3bb74f0d449e637aada88d0

Implementation Authorization:
NOT GRANTED

Database Change:
NONE

API Change:
NONE

Authentication Change:
NONE

## 1. Purpose

This document reconciles the canonical clinical-continuity behavior with the current
Termux and Gemini candidate implementations.

It does not authorize implementation.

It does not close any deferred technical decision.

It does not promote candidate technical fields into canonical domain facts.

## 2. Canonical Closed Product Behavior

The canonical application capability contract establishes:

- A Patient may continue through multiple Cases when clinically appropriate.
- An existing Case may continue across multiple Clinic Days.
- A later follow-up Visit may continue the applicable existing Case.
- A later follow-up return creates a new Visit.
- Every Visit belongs to exactly one Case.
- Every Visit occurs within exactly one Clinic Day.
- A new Visit remains distinct from previous Visits.
- A new Visit must not overwrite a previous Visit.
- Previous Visits remain preserved in Clinical History.
- Clinical History is accumulated from recorded Visits.
- Follow-up is part of the Doctor's clinical decision.
- When a Patient later returns, the existing Patient remains the same.
- The applicable Case may continue.
- The returning Patient receives a new Visit on the applicable Clinic Day.

## 3. Canonical Technical Boundary

The canonical contracts do not define:

- previousVisitId
- isFollowUpReturn
- targetDate
- intervalDays as an automatic scheduling algorithm
- an automatic follow-up return transition
- a specific continuity pointer algorithm
- a specific technical representation for linking the new Visit to a previous Visit

The canonical application capability contract explicitly states that the return
transition is not defined as an automatic technical process by that contract.

Therefore these technical representations remain candidate decisions.

## 4. Termux Candidate Evidence

The Termux ViP candidate currently demonstrates structural continuity through:

- Patient identity preservation
- Case identity preservation
- creation of a new Visit
- reuse of an existing Case when an applicable caseId is supplied
- Visit association with Case
- Visit association with Clinic Day
- preservation of multiple Visits
- longitudinal Patient Dossier presentation
- Follow-up decision fields
- follow-up interval and clinical instructions

The Termux candidate does not currently demonstrate:

- previousVisitId
- isFollowUpReturn
- automatic targetDate derivation

These observations are candidate evidence only.

## 5. Gemini Candidate Evidence

The Gemini candidate workspace additionally demonstrates candidate technical structures for:

- previousVisitId
- isFollowUpReturn
- automatic follow-up targetDate derivation
- explicit multi-visit continuity tests
- previous encounter continuity presentation

These structures are candidate technical representations.

Their presence does not establish canonical authorization.

## 6. Reconciliation

The canonical Product Behavior and both candidate workspaces are aligned on the
following behavioral principle:

Patient
-> Existing History
-> Applicable Existing Case
-> New Visit
-> Applicable Clinic Day

The principal technical delta is representation rather than product behavior.

Termux represents continuity primarily through the existing Case relationship and
creation of a new Visit.

Gemini additionally introduces explicit technical continuity fields and an automatic
target-date derivation.

No candidate technical representation is promoted to canonical authority by this
document.

## 7. No Silent Contract Mutation

This reconciliation does not:

- add previousVisitId to the canonical model
- add isFollowUpReturn to the canonical model
- define targetDate calculation
- define scheduling behavior
- define reminders
- define appointments
- create a new Visit automatically
- alter the API contract
- alter PostgreSQL schema
- alter authentication
- alter authorization
- alter the implementation coverage matrix

## 8. Coverage Status

Canonical capability coverage remains unchanged.

Follow-up Return:
Contract = YES
Proof = NO
Implementation = NOT YET ESTABLISHED

Follow-up Decision:
Contract = YES
Proof = NO
Implementation = NOT YET ESTABLISHED

This candidate reconciliation document does not change those states.

## 9. Persistence Boundary

No persistence implementation is authorized by this document.

Case persistence remains deferred.

Visit persistence remains deferred.

Follow-up persistence remains deferred.

Technical continuity identifiers remain deferred.

## 10. API Boundary

No API implementation is authorized by this document.

The canonical API surface establishes the conceptual operations:

- establish or continue Case
- create Visit
- record Arrival
- record Clinical Information
- record Exit

Exact technical payloads and continuity fields remain subject to separate technical
contract decisions.

## 11. Authorization State

IMPLEMENTATION_AUTHORIZED = NO

DATABASE_CHANGE = NONE

API_CHANGE = NONE

AUTH_CHANGE = NONE

RUNTIME_CHANGE = NONE

SILENT_CONTRACT_MUTATION = NO

UNAUTHORIZED_EXPANSION = NO

FAIL = 0

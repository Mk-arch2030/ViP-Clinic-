# UI HUMAN DESIGN V1 — COMMANDER RECONCILIATION

STATUS = RECONCILIATION ARTIFACT
IMPLEMENTATION = NOT AUTHORIZED
CONTRACT_MUTATION = NOT PERFORMED

## 1. PURPOSE

This document reconciles the Commander Synthesis against the current authoritative
Application Capability Contract and the existing Human UI Design.

It does not mutate any authoritative contract.

## 2. AUTHORITATIVE INPUTS

- ARCHITECTURE/APPLICATION-CAPABILITY-CONTRACT-V1.md
- ARCHITECTURE/DESIGN/UI-HUMAN-DESIGN-V1.md
- ARCHITECTURE/DESIGN/UI-HUMAN-DESIGN-V1-COMMANDER-SYNTHESIS.md

## 3. ALREADY COMPATIBLE

The following Commander Synthesis elements are already represented by the
current authoritative product definitions and require no new contract invention:

- Patient continuity.
- Case continuity.
- Visit continuity.
- Clinic Day continuity.
- Current Complaint as Clinical Content.
- Past History as patient-level historical information.
- Doctor authority over Past History modification.
- Doctor Clinical Authority.
- Doctor Case Completion authority.
- Visit Exit remains distinct from Case Completion.
- Clinic Day Closure remains distinct from Case Completion.
- Nurse operational delegation.
- The four authorized Nurse capabilities.
- Longitudinal Clinical History derived from Visits.
- Single Internet-hosted Web Application.
- Device-independent Doctor and Nurse access.
- Doctor operational Clinic Day visibility.
- Follow-up continuity through a new Visit.

## 4. RECONCILIATION CANDIDATES

### 4.1 ARRIVAL PATIENT CONDITION

Commander Synthesis proposes a simple Nurse-facing arrival condition:

- Normal
- Moderately Unwell
- Severely Unwell

This is intended as an arrival/intake observation and is not Vital Signs.

Detailed Vital Signs remain part of the Doctor clinical examination.

Required disposition:

- Candidate for explicit contract reconciliation.
- No Vital Signs implementation for Nurse.
- No implementation authorization.
- No contract mutation performed by this artifact.

Current state:

ARRIVAL_PATIENT_CONDITION_IMPLEMENTATION_AUTHORIZED = NO
VITAL_SIGNS_IMPLEMENTATION_AUTHORIZED = NO

### 4.2 NURSE CURRENT COMPLAINT INTAKE

Commander Synthesis proposes that the Nurse may capture Current Complaint
during delegated intake.

The Application Capability Contract already defines Current Complaint as
Clinical Content.

The reconciliation requirement is to distinguish:

- Nurse intake capture of patient-reported information.
- Doctor clinical interpretation and authority.
- Subsequent Doctor clinical decision.

Required disposition:

- Candidate for explicit boundary clarification.
- Do not create a second Current Complaint model.
- Do not transfer Clinical Authority to Nurse.
- No implementation authorization.

### 4.3 NURSE INITIAL PAST HISTORY COLLECTION

Commander Synthesis proposes that the Nurse may participate in initial
collection of Past History information.

The Application Capability Contract already establishes:

- Past History is patient-level information.
- Past History consists of multiple items.
- Past History supports ADD and MODIFY.
- Past History modification requires Doctor Authority.

The reconciliation requirement is to distinguish:

- Initial delegated information collection.
- Doctor-authorized establishment of the authoritative Past History.
- Doctor-authorized modification.

Required disposition:

- Candidate for explicit contract clarification.
- Nurse does not receive Past History authority merely by collecting information.
- No implementation authorization.

### 4.4 SEND TO DOCTOR

Commander Synthesis adopts "Send to Doctor" as a human interaction concept.

The interaction must not silently create a new clinical authority model.

Required disposition:

- Candidate for operational interaction definition.
- Must preserve Doctor Clinical Authority.
- Must not create Case Completion authority for Nurse.
- Must not create an unapproved workflow state.
- No implementation authorization.

### 4.5 CLINIC DAY OPEN

Commander Synthesis identifies an explicit "Open Clinic Day" action as a
possible lifecycle detail.

The current Application Capability Contract explicitly defines Doctor review
and explicit Doctor / Main Admin Clinic Day Closure, while the technical
establishment semantics of an Open action are not yet separately authorized.

Required disposition:

- Candidate for lifecycle clarification.
- Do not assume a new Open state.
- Do not mutate Clinic Day contract from this artifact.
- No implementation authorization.

### 4.6 OPERATIONAL COUNTERS

Commander Synthesis proposes operational counters as a visible Doctor/Nurse
workflow aid.

The existing Human UI Design already requires Clinic Day counter visibility,
including the zero-case condition.

Required disposition:

- Compatible at the presentation-intent level.
- Exact counter semantics remain subject to authoritative contract definition.
- No new persistence field or API behavior is implied.
- No implementation authorization.

## 5. EXPLICITLY REJECTED INTERPRETATION

The Commander Synthesis does NOT authorize:

- Nurse Vital Signs implementation.
- Nurse Clinical Authority.
- Nurse Case Completion.
- Automatic Case Completion on Visit Exit.
- Automatic Case Completion on Clinic Day Closure.
- A second Patient / Case / Visit model.
- A second Current Complaint model.
- An implicit new workflow state.
- Database schema mutation.
- API route implementation.
- Frontend implementation.
- Authentication implementation.
- Authorization implementation.

## 6. RECONCILIATION RULE

The authoritative contracts remain authoritative.

The Commander Synthesis is a design synthesis and proposal layer.

Any adopted candidate must be reconciled explicitly into the appropriate
authoritative contract before implementation.

No candidate becomes implementation-authorized merely because it appears in
the Commander Synthesis.

## 7. NEXT GATE

NEXT_GATE = CANDIDATE_DECISION_AND_CONTRACT_AMENDMENT_ANALYSIS

The next step is to decide the disposition of each reconciliation candidate
and identify the exact authoritative contract requiring amendment.

No implementation is authorized by this document.

STATUS = RECONCILIATION ARTIFACT
IMPLEMENTATION = NOT AUTHORIZED
CONTRACT_MUTATION = NOT PERFORMED

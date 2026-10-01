# Dr.Roby Clinic — Clinic UI Increment 04 Definition V1

STATUS = DEFINITION

## 1. Increment Identity

INCREMENT = CLINIC UI INCREMENT 04

PURPOSE = BOUNDED DOCTOR-FACING PATIENT JOURNEY CONTINUITY SURFACE

## 2. Objective

Increment 04 defines a bounded Doctor-facing read-only surface that makes the
continuity of the selected Patient journey visible across authoritative
Patient → Case → Visit → Clinic Day relationships.

The surface shall build on the proven Increment 02 and Increment 03 UI
surfaces without introducing new domain concepts, workflow states, authority,
or persistence behavior.

## 3. Authorized Candidate Scope

The definition covers presentation of:

- Selected Patient identity and context
- Patient's related Cases
- Visits belonging to the selected Case
- Clinic Day associated with each Visit
- Chronological continuity across recorded Visits
- Current Case Workflow State
- Visit Protection State
- Visit Type = Visit & Consultation
- Arrival Condition where already recorded
- Current Complaint where already recorded
- Doctor Context where already recorded
- Past History as Patient-level information
- Clinical History as a derived read-time presentation from authoritative Visits
- Clear distinction between Past History and Clinical History
- Patient → Case → Visit → Clinic Day continuity
- Previous Visit preservation
- Responsive Desktop / Laptop / Tablet / Mobile presentation

## 4. Continuity Rules

The implementation, if later authorized, shall:

- Preserve every recorded Visit as an independent historical record.
- Never overwrite a previous Visit with a later Visit.
- Present Clinical History as derived from authoritative Visits.
- Preserve Case Workflow State as the authoritative Case workflow state.
- Preserve Visit Protection State as the authoritative Visit-level protection state.
- Preserve Clinic Day as the context containing its recorded Visits.
- Preserve the ability for a Case to span Clinic Days through its Visits.
- Preserve Patient Exit as Visit-level completion only.
- Preserve Doctor authority for Case completion.
- Preserve Doctor authority for clinical decisions and clinical amendment.

## 5. Explicit Exclusions

This increment does NOT authorize:

- API implementation
- API connection
- Database implementation
- SQL
- Migration
- ORM
- Repository implementation
- Authentication implementation
- Authorization implementation
- New Nurse capabilities
- Nurse clinical authority
- Case completion by Nurse
- New domain entities
- New workflow states
- Independent Visit status state machine
- Automatic Clinic Day closure
- Clinical data-entry expansion
- Clinical amendment behavior
- Direct frontend-to-database connection
- Deployment
- PWA implementation
- Financial behavior
- Billing behavior
- Unrelated architecture changes

## 6. Existing Contract Dependencies

This definition depends on the already established and proven:

- UI Interaction Technical Contract V1
- Authorization Contract
- Workflow State Machine Contract
- Persistence Schema Definition V1
- Persistence Technical Contract V1
- Frontend Stack Decision
- Increment 02 Definition / Closure
- Increment 03 Definition / Authorization / Closure

Existing contracts remain authoritative.

## 7. Implementation Boundary

If separately authorized, implementation shall remain inside:

- frontend/src/App.jsx
- frontend/src/adapters/mockClinicService.js
- frontend/src/styles/app.css

and the specifically authorized Increment 04 architecture artifacts.

No unrelated untracked architecture artifacts shall be staged or modified.

## 8. Proof Requirements

A later implementation must prove:

- PATIENT_JOURNEY_CONTINUITY
- PATIENT_CASE_CONTINUITY
- VISIT_CONTINUITY
- CLINIC_DAY_CONTINUITY
- CLINICAL_HISTORY_DERIVED_FROM_VISITS
- PREVIOUS_VISIT_PRESERVATION
- READ_ONLY_BOUNDARY
- RESPONSIVE_SURFACE
- NO_FORBIDDEN_CONNECTION_MARKERS
- NO_DIRECT_DATABASE_MARKERS
- NO_NEGATIVE_MARKERS
- FAIL = 0

## 9. Authorization Boundary

DEFINITION_ONLY = YES

IMPLEMENTATION_AUTHORIZED = PENDING AUTHORIZATION REVIEW

No frontend implementation is authorized by this definition alone.

## 10. Next Gate

NEXT_GATE = CLINIC UI INCREMENT 04 AUTHORIZATION REVIEW

FAIL = 0


# UI HUMAN DESIGN V1 — CANDIDATE DECISION MATRIX

STATUS = DECISION MATRIX
IMPLEMENTATION = NOT AUTHORIZED
CONTRACT_MUTATION = NOT PERFORMED

## 1. PURPOSE

This document defines the decision boundary for the six candidates identified
by the Commander Reconciliation artifact.

It does not mutate any authoritative contract.

## 2. DECISION RULE

Each candidate must be resolved by explicit architectural decision before any
authoritative contract is amended.

No candidate receives implementation authorization from this document.

## 3. DECISION MATRIX

| ID | Candidate | Decision | Contract Target | Implementation |
|---|---|---|---|---|
| C01 | Arrival Patient Condition | ADOPT AS CONTRACT AMENDMENT CANDIDATE | Application Capability / Persistence boundary | NOT AUTHORIZED |
| C02 | Nurse Current Complaint Intake | ADOPT AS CONTRACT AMENDMENT CANDIDATE | Application Capability + Authorization boundary | NOT AUTHORIZED |
| C03 | Nurse Initial Past History Collection | ADOPT AS CONTRACT AMENDMENT CANDIDATE | Application Capability + Authorization boundary | NOT AUTHORIZED |
| C04 | Send to Doctor | ADOPT AS DESIGN / WORKFLOW CONTRACT CANDIDATE | UI Interaction / Application Capability boundary | NOT AUTHORIZED |
| C05 | Clinic Day Open | DEFER | Clinic Day lifecycle contract | NOT AUTHORIZED |
| C06 | Operational Counters | ADOPT AS DESIGN ONLY | UI Human Design / Interaction Surface | NOT AUTHORIZED |

## 4. C01 — ARRIVAL PATIENT CONDITION

Decision:

ADOPT AS CONTRACT AMENDMENT CANDIDATE.

Definition:

Nurse-facing arrival condition:

- Normal
- Moderately Unwell
- Severely Unwell

This is an operational intake observation.

It is not Vital Signs.

Detailed Vital Signs remain Doctor clinical-entry information.

Required contract analysis:

- Product capability meaning.
- Persistence ownership and representation.
- Nurse delegation boundary.
- Doctor clinical authority boundary.

Explicit prohibition:

Nurse Vital Signs implementation remains unauthorized.

## 5. C02 — NURSE CURRENT COMPLAINT INTAKE

Decision:

ADOPT AS CONTRACT AMENDMENT CANDIDATE.

Boundary:

The Nurse may capture patient-reported Current Complaint during delegated
intake.

The Nurse does not establish diagnosis, treatment, or clinical decision.

Doctor remains Clinical Authority.

Required contract analysis:

- Application Capability wording.
- Authorization boundary.
- Persistence representation.
- Relationship to Doctor clinical encounter.

## 6. C03 — NURSE INITIAL PAST HISTORY COLLECTION

Decision:

ADOPT AS CONTRACT AMENDMENT CANDIDATE.

Boundary:

The Nurse may collect initial Past History information when delegated.

Doctor remains the authority for the authoritative patient Past History.

Doctor authorization remains required for Past History modification.

Required contract analysis:

- Application Capability wording.
- Authorization boundary.
- Persistence representation.

## 7. C04 — SEND TO DOCTOR

Decision:

ADOPT AS DESIGN / WORKFLOW CONTRACT CANDIDATE.

Boundary:

"Send to Doctor" is an operational interaction.

It communicates that delegated Nurse intake has reached the point where Doctor
attention is requested.

It does not create Clinical Authority for Nurse.

It does not create Case Completion authority.

It does not automatically create a new Visit state.

Required contract analysis:

- UI Interaction Technical Contract.
- Application Capability semantics.
- API boundary only after the interaction contract is settled.

## 8. C05 — CLINIC DAY OPEN

Decision:

DEFER.

Reason:

The current architecture establishes explicit Clinic Day Closure by Doctor /
Main Admin but does not require a separate "Open" state or action.

No new Open state is introduced.

No implementation proceeds from this candidate.

## 9. C06 — OPERATIONAL COUNTERS

Decision:

ADOPT AS DESIGN ONLY.

Boundary:

Counters are presentation-level operational information.

The existing Human UI Design already establishes Clinic Day counter
visibility.

Exact counter semantics must not silently become persistence or API behavior.

No new database field or API route is authorized.

## 10. GLOBAL AUTHORITY RULES

The following remain unchanged:

- Doctor = Clinical Authority.
- Doctor = Main Admin / System Owner.
- Nurse = delegated operational participant.
- Delegation does not transfer authority.
- Nurse cannot complete a Case.
- Visit Exit does not complete a Case.
- Clinic Day Closure does not complete a Case.
- Clinical History remains derived from Visits.
- Past History remains distinct from Clinical History.

## 11. IMPLEMENTATION BOUNDARY

This matrix authorizes no implementation.

DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = NO
SQL_IMPLEMENTATION_AUTHORIZED = NO
API_IMPLEMENTATION_AUTHORIZED = NO
UI_IMPLEMENTATION_AUTHORIZED = NO
AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO

## 12. NEXT GATE

NEXT_GATE = AUTHORITATIVE_CONTRACT_AMENDMENT_DRAFTING

Only the candidates explicitly marked as contract-amendment candidates may
proceed to controlled amendment drafting.

No authoritative contract is mutated by this document.

STATUS = DECISION MATRIX
IMPLEMENTATION = NOT AUTHORIZED
CONTRACT_MUTATION = NOT PERFORMED

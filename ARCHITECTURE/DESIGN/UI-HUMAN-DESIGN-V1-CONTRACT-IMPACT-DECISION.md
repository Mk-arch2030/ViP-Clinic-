# UI HUMAN DESIGN V1 — CONTRACT IMPACT DECISION

STATUS = IMPACT DECISION RECORD
IMPLEMENTATION = NOT AUTHORIZED
CONTRACT_MUTATION = NOT PERFORMED

## 1. PURPOSE

This document records the architectural impact of candidates A01-A04 after
forensic comparison against:

- Application Capability Contract V1
- Authorization Technical Contract V1
- Persistence Technical Contract V1
- UI Interaction Technical Contract V1

No authoritative contract is mutated by this document.

## 2. HUMAN VALIDATION CONTEXT

The first real product validation will be performed by the Product Owner
using two operational personas:

- Doctor persona: Dr. Ahmed Hamad Hashem ("Bob Boss")
- Nurse persona: Mohamed Roby

The same Product Owner may validate both personas.

This validation context does not alter the product authority model.

Doctor remains Clinical Authority, Main Admin, and System Owner.

Nurse remains a delegated Operational Workflow Participant.

## 3. IMPACT DECISION MATRIX

| ID | Candidate | Application Capability | Authorization | Persistence | UI Interaction | Decision |
|---|---|---|---|---|---|---|
| A01 | Arrival Patient Condition | AMEND | AMEND | AMEND | AMEND | CONTRACT AMENDMENT REQUIRED |
| A02 | Nurse Current Complaint Intake | AMEND | AMEND | NO STRUCTURAL AMENDMENT | AMEND | CONTRACT BOUNDARY AMENDMENT |
| A03 | Nurse Initial Past History Collection | AMEND | AMEND | NO STRUCTURAL AMENDMENT | AMEND | CONTRACT BOUNDARY AMENDMENT |
| A04 | Send to Doctor | AMEND | NO NEW AUTHORITY | NO STRUCTURAL AMENDMENT | AMEND | WORKFLOW/INTERACTION AMENDMENT |

## 4. A01 — ARRIVAL PATIENT CONDITION

### Existing Evidence

Current Visit already owns the Arrival workflow.

Current Persistence already establishes Visit as the encounter-level source.

Current Persistence separately defines:

- Current Complaint as Visit-level Clinical Content.
- Past History as Patient-level information.
- Vital Signs are not established as a Nurse capability.

### Required Direction

Arrival Patient Condition shall be treated as Visit-level arrival/intake
information.

Allowed values:

- Normal
- Moderately Unwell
- Severely Unwell

It is NOT:

- Vital Signs.
- Patient-level Past History.
- Diagnosis.
- Clinical Decision.
- Case Completion information.

### Impact

Application Capability:

Requires explicit definition of the capability.

Authorization:

Requires explicit clarification that delegated Nurse Arrival handling may
capture this operational observation without transferring Clinical Authority.

Persistence:

Requires explicit definition of where this Visit-level value belongs.

UI Interaction:

Requires explicit Nurse intake presentation and Doctor visibility.

### Decision

CONTRACT AMENDMENT REQUIRED.

Nurse Vital Signs remain unauthorized.

## 5. A02 — NURSE CURRENT COMPLAINT INTAKE

### Existing Evidence

Application Capability already defines Current Complaint as clinical information
associated with the current Visit.

Persistence already defines:

Current Complaint = exactly one value per Visit.

Authorization already protects Clinical Authority while allowing delegated
operational workflow.

### Required Direction

The Nurse may capture the patient's reported Current Complaint during delegated
intake.

This capture does not constitute:

- Diagnosis.
- Clinical interpretation.
- Treatment decision.
- Clinical Authority.

Doctor remains Clinical Authority.

### Impact

Application Capability:

Clarify delegated intake capture versus Doctor clinical authority.

Authorization:

Clarify that Nurse capture of patient-reported Current Complaint is within
delegated Patient Data Recording and does not transfer Clinical Authority.

Persistence:

No new structural Current Complaint model is required.

UI Interaction:

Clarify Nurse intake capture and Doctor review.

### Decision

CONTRACT BOUNDARY AMENDMENT.

No second Current Complaint model shall be introduced.

## 6. A03 — NURSE INITIAL PAST HISTORY COLLECTION

### Existing Evidence

Persistence already establishes:

- Past History is Patient-level.
- Past History is distinct from Clinical History.
- Past History consists of multiple items.
- ADD and MODIFY are the defined mutations.
- Doctor holds authority for Past History changes.

Authorization already establishes delegated Patient Data Recording while
preserving Doctor authority.

### Required Direction

The Nurse may collect initial Past History information when delegated.

Collection does not itself transfer authority to establish or modify
authoritative Past History.

Doctor authority remains required for authoritative Past History changes.

### Impact

Application Capability:

Clarify initial delegated collection.

Authorization:

Clarify collection versus authority to establish/modify authoritative history.

Persistence:

No new Past History structural model is required.

UI Interaction:

Clarify Nurse collection and Doctor review/authority.

### Decision

CONTRACT BOUNDARY AMENDMENT.

No second Past History model shall be introduced.

## 7. A04 — SEND TO DOCTOR

### Existing Evidence

Authorization already defines:

Doctor Notification

as one of the four approved delegated operational capabilities.

No additional Nurse authority is required.

### Required Direction

"Send to Doctor" is a human workflow interaction representing a request for
Doctor attention after delegated Nurse intake.

It does NOT:

- Create a new clinical authority.
- Create Case Completion authority.
- Create a new Case.
- Create a new Visit.
- Create a new persistent workflow state unless separately justified.
- Automatically complete or exit a Visit.

### Impact

Application Capability:

Define the operational meaning of Doctor Notification in this context.

Authorization:

No new authority is required.

Persistence:

No new persistence entity or state is required by this interaction alone.

UI Interaction:

Define the human interaction and Doctor-facing visibility.

### Decision

WORKFLOW / INTERACTION CONTRACT AMENDMENT.

## 8. EXPLICITLY UNCHANGED

The following remain unchanged:

- Doctor Clinical Authority.
- Doctor Main Admin authority.
- Doctor System Ownership.
- Nurse delegated operational participation.
- Nurse delegation scope controlled by Doctor.
- Nurse cannot self-expand authority.
- Nurse cannot establish Case Completion.
- Visit Exit remains distinct from Case Completion.
- Clinic Day Closure remains distinct from Case Completion.
- Current Complaint remains Visit-level.
- Past History remains Patient-level.
- Clinical History remains derived from Visits.
- Previous Visits remain preserved.
- No cross-Visit Clinical Content overwrite.
- One Visit belongs to one Case and one Clinic Day.

## 9. CANDIDATES NOT ENTERING AMENDMENT

### Clinic Day Open

DEFERRED.

No separate Open state or implementation is authorized.

### Operational Counters

DESIGN ONLY.

Existing Clinic Day counter visibility remains valid.

No new persistence field or API behavior is authorized from the counter concept.

## 10. IMPLEMENTATION BOUNDARY

This document authorizes no implementation.

DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = NO
SQL_IMPLEMENTATION_AUTHORIZED = NO
API_IMPLEMENTATION_AUTHORIZED = NO
UI_IMPLEMENTATION_AUTHORIZED = NO
AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO
IMPLEMENTATION = NOT AUTHORIZED

## 11. NEXT GATE

NEXT_GATE = CONTROLLED_CONTRACT_AMENDMENT_DRAFTS

The next gate is drafting the exact proposed amendments for A01-A04.

Drafting does not itself close or authorize any contract.

STATUS = IMPACT DECISION RECORD
IMPLEMENTATION = NOT AUTHORIZED
CONTRACT_MUTATION = NOT PERFORMED

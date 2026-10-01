# UI HUMAN DESIGN V1 — CONTROLLED CONTRACT AMENDMENT DRAFTS

STATUS = CONTROLLED CONTRACT AMENDMENT DRAFT
IMPLEMENTATION = NOT AUTHORIZED
CONTRACT_MUTATION = NOT PERFORMED
SOURCE_DECISION = UI-HUMAN-DESIGN-V1-CANDIDATE-DECISION-MATRIX
SOURCE_IMPACT = UI-HUMAN-DESIGN-V1-CONTRACT-IMPACT-DECISION

## 1. PURPOSE

This document defines the controlled draft amendments required to reconcile
the adopted Commander candidates A01-A04 with the current authoritative
contracts.

This is a drafting artifact only.

No authoritative contract is modified by this document.

## 2. GOVERNING RULE

The following sequence remains mandatory:

DECISION
→ CONTROLLED AMENDMENT DRAFT
→ REVIEW
→ AUTHORITATIVE CONTRACT MUTATION
→ PROOF
→ REGRESSION

Implementation remains unauthorized until the relevant authoritative
contracts are formally amended, proven, and the implementation gate is
separately opened.

## 3. A01 — ARRIVAL PATIENT CONDITION

### 3.1 Decision

A01 is adopted as a contract amendment candidate.

### 3.2 Functional Meaning

During delegated patient arrival/intake, the workflow may capture one simple
arrival-condition classification for the current Visit.

Allowed values:

- Normal
- Moderately Unwell
- Severely Unwell

### 3.3 Boundary

Arrival Patient Condition is:

- Visit-level arrival/intake information.
- Operational information captured at arrival.
- Distinct from Vital Signs.
- Distinct from Diagnosis.
- Distinct from Treatment.
- Distinct from Clinical Decision.
- Distinct from Case Completion.
- Not a Patient-level Past History item.

### 3.4 Application Capability Amendment Draft

The Application Capability Contract should recognize Arrival Patient
Condition as part of the delegated arrival/intake workflow.

The Nurse may capture the condition when the relevant Patient Entry/Arrival
capability has been delegated.

Doctor authority remains unchanged.

### 3.5 Authorization Amendment Draft

The Authorization Contract should permit the existing delegated
Patient Entry / Arrival capability to include capture of Arrival Patient
Condition.

No new Nurse permission is introduced.

No Clinical Authority is delegated.

### 3.6 Persistence Amendment Draft

The Persistence Technical Contract should define Arrival Patient Condition
as Visit-associated persisted information.

The amendment must preserve:

- one Visit belongs to one Case;
- one Visit belongs to one Clinic Day;
- previous Visits are preserved;
- clinical history remains accumulated from Visits;
- the new field does not become Patient-level Past History;
- the new field does not replace clinical information.

The physical database representation remains outside this amendment draft.

### 3.7 UI Interaction Amendment Draft

The Nurse arrival interaction may present the three allowed condition
choices during delegated intake.

The Doctor-facing workflow may display the recorded condition as contextual
arrival information.

No clinical interpretation is implied by the interaction.

## 4. A02 — NURSE CURRENT COMPLAINT INTAKE

### 4.1 Decision

A02 is adopted as a contract boundary amendment candidate.

### 4.2 Functional Meaning

During delegated intake, the Nurse may capture the patient's reported
Current Complaint for the current Visit.

### 4.3 Boundary

Nurse Current Complaint Intake means:

- capture of patient-reported information;
- Visit-level information;
- operational intake support.

It does not mean:

- diagnosis;
- clinical interpretation;
- treatment decision;
- Case Completion;
- transfer of Clinical Authority.

Doctor review and clinical authority remain unchanged.

### 4.4 Application Capability Amendment Draft

The Application Capability Contract should explicitly recognize Nurse
capture of patient-reported Current Complaint as a delegated intake action.

The existing Current Complaint rule remains:

- exactly one Current Complaint per Visit.

### 4.5 Authorization Amendment Draft

The existing delegated Patient Data Recording capability is sufficient.

No new authorization capability is introduced.

Nurse capture does not authorize clinical interpretation or amendment of
the clinical decision.

### 4.6 Persistence Boundary Amendment Draft

No new structural domain object is required.

Current Complaint remains exactly one per Visit.

The amendment should clarify that delegated Nurse intake may provide the
captured patient-reported input for the Visit while Doctor clinical
authority remains intact.

### 4.7 UI Interaction Amendment Draft

The Nurse intake surface may include Current Complaint capture before
Doctor examination.

The Doctor encounter surface must remain capable of reviewing the captured
information as part of the Visit.

## 5. A03 — NURSE INITIAL PAST HISTORY COLLECTION

### 5.1 Decision

A03 is adopted as a contract boundary amendment candidate.

### 5.2 Functional Meaning

During delegated intake, the Nurse may collect initial Past History
information supplied by the patient.

### 5.3 Authority Boundary

Nurse collection is information gathering only.

It does not transfer authority over Past History.

The Doctor remains the authority for authoritative Past History addition
or modification.

### 5.4 Application Capability Amendment Draft

The Application Capability Contract should distinguish:

1. Nurse collection/preparation of patient-provided initial Past History.
2. Doctor-authorized authoritative Past History addition or modification.

The existing Patient-level Past History model remains.

### 5.5 Authorization Amendment Draft

The existing delegated Patient Data Recording capability may cover initial
collection.

No new Nurse authority is introduced.

Any action requiring explicit Doctor Authority remains Doctor-only.

### 5.6 Persistence Boundary Amendment Draft

No new structural domain object is required.

Past History remains:

- Patient-level;
- distinct from Clinical History;
- composed of multiple items;
- subject to Doctor Authority for authoritative addition/modification.

The amendment should clarify the distinction between Nurse-collected input
and Doctor-authorized authoritative Past History.

### 5.7 UI Interaction Amendment Draft

The Nurse intake surface may collect initial Past History information.

The Doctor surface must allow review and authoritative clinical handling.

The UI must not imply that Nurse collection itself constitutes Doctor
authorization.

## 6. A04 — SEND TO DOCTOR

### 6.1 Decision

A04 is adopted as a workflow/interaction amendment candidate.

### 6.2 Functional Meaning

Send to Doctor is an explicit operational interaction through which the
delegated Nurse requests Doctor attention after the relevant intake work.

### 6.3 Boundary

Send to Doctor:

- does not create a new Case;
- does not create a new Visit;
- does not create a new authority;
- does not complete a Case;
- does not complete a Visit;
- does not close the Clinic Day;
- does not constitute a clinical decision.

### 6.4 Application Capability Amendment Draft

The Application Capability Contract should recognize Doctor Notification
as the workflow action associated with sending the current patient/Visit
for Doctor attention.

### 6.5 Authorization Amendment Draft

The existing delegated Doctor Notification capability is sufficient.

No new Nurse authorization is introduced.

### 6.6 Persistence Boundary Amendment Draft

No new structural domain object is required.

No new Case or Visit state is authorized solely by this draft.

If a specific lifecycle transition is later required, it must be separately
defined and proven as a workflow contract decision.

### 6.7 UI Interaction Amendment Draft

The Nurse interaction may expose an explicit Send to Doctor action.

The Doctor operational surface may expose the resulting notification/request
for attention.

The interaction must not silently perform clinical actions.

## 7. CROSS-CONTRACT INVARIANTS

The following remain unchanged:

- Doctor = Clinical Authority.
- Doctor = Main Admin / System Owner.
- Nurse = delegated operational participant.
- Delegation never transfers Clinical Authority.
- Nurse cannot complete a Case.
- Visit Exit is not Case Completion.
- Clinic Day Closure is not Case Completion.
- Current Complaint remains Visit-level.
- Past History remains Patient-level.
- Clinical History remains accumulated from Visits.
- Previous Visits remain preserved.
- No cross-Visit overwrite is introduced.
- No additional Nurse permission is introduced beyond the existing
  authorization model.

## 8. EXPLICITLY DEFERRED

### Clinic Day Open

STATUS = DEFERRED

No amendment is drafted here.

### Operational Counters

STATUS = DESIGN ONLY

No authoritative contract amendment is drafted here.

## 9. IMPLEMENTATION GATE

IMPLEMENTATION_AUTHORIZED = NO

No database implementation is authorized.

No API implementation is authorized.

No frontend implementation is authorized.

No authentication/authorization implementation is authorized.

No runtime/deployment work is authorized by this document.

## 10. CONTRACT MUTATION GATE

CONTRACT_MUTATION = NOT PERFORMED

This document is not an authoritative contract.

It is a controlled amendment proposal awaiting review and authorization.

## 11. NEXT GATE

NEXT_GATE = CONTROLLED_AMENDMENT_REVIEW

Required review sequence:

A01 → A02 → A03 → A04
→ verify boundaries
→ verify no authority expansion
→ verify persistence implications
→ authorize authoritative contract mutation only after explicit approval.

# CONTRACT-08 — CASE WORKFLOW

## 1. CONTRACT IDENTITY

CONTRACT_ID = C08
CONTRACT_NAME = CASE WORKFLOW
PRODUCT = Dr_Roby_Clinic
STATUS = CLOSED

This contract defines the product-level Case Workflow only.

It does not define technical implementation.

---

## 2. DEPENDENCIES

This contract depends on:

- CONTRACT-01 — Patient / Case / Visit
- CONTRACT-02 — Clinic Day
- CONTRACT-03 — Actor & Authority
- CONTRACT-04 — Patient Identity & Clinical History
- CONTRACT-05 — Visit / Clinical Encounter Workflow
- CONTRACT-06 — Clinical Decision & Treatment
- CONTRACT-07 — Clinic Settings, Day Closure & Data Protection

CONTRACTS_01_TO_07 = CLOSED

Closed contracts are not reopened or redefined by this contract.

---

## 3. PRIMARY SCOPE

The purpose of this contract is to define the product-level workflow of
the current Patient Case across its operational and clinical journey.

The Case is distinct from the Visit.

A Case belongs to one Patient.

A Case may contain multiple Visits across multiple Clinic Days.

A Patient Exit ends the operational flow of the current Visit.

Patient Exit does not by itself complete the Case.

Case completion is established by the Doctor's clinical decision.

---

## 4. WORKFLOW INTENT

The clinic should have an explicit workflow for the current patient Case.

The workflow should make the current state of the Case / Visit understandable
to the Doctor and Nurse.

Multiple Cases may exist during the same Clinic Day and may be at different
points in their journeys at the same time.

The Clinic Day therefore needs a clear distinction between the current
states of its Cases.

---

## 5. INITIAL CASE JOURNEY

The authoritative initial journey is:

Patient Arrives
→ Arrival Recorded
→ Doctor Notified
→ Doctor Review
→ Clinical Decision
→ Patient Exit Recorded
→ Follow-up when required
→ Later Visit on a later Clinic Day
→ Case remains open
→ Doctor
→ Completed

This journey is the product vision from which the Case Workflow Contract
is being defined.

---

## 6. CLINICAL INFORMATION JOURNEY

The Case may involve:

Personal Information
→ Past History
→ Current Complaint
→ Investigation and/or Diagnosis
→ Treatment
→ Follow-up when required
→ Later Visit when required
→ Case Completion by Doctor

For an Existing Patient:

Clinic Patient Number
→ Find / Retrieve Patient
→ Retrieve Existing History
→ Continue Existing Case for Follow-up when applicable
→ Create New Visit
→ Record New Information
→ Clinical Decision
→ Treatment / Investigation
→ Follow-up or Case Completion

---

## 7. CASE / VISIT RELATIONSHIP

The Case represents the continuing operational and clinical journey.

The Visit represents one organized medical encounter within the Case.

The same Case may contain multiple Visits across multiple Clinic Days.

A later follow-up return creates a new Visit on a later Clinic Day while
remaining within the same Case when the existing Case continues.

Previous Visits retain their meaning and are not replaced by later Visits.

### Visit Type — Visit & Consultation

Visit registration is the point at which the Visit Type is selected.

The product defines `Visit & Consultation` as a Visit Type.

For a patient's first recorded Visit, the Visit is registered as `Visit & Consultation`.

When the same patient returns for a later Visit within the same Case, the Doctor selects or confirms the Visit Type for that Visit. On the second Visit, the Doctor establishes that `Visit & Consultation` continues for subsequent Visits.

When `Visit & Consultation` is established for subsequent Visits, later Visits continue with the same Visit & Consultation meaning and are counted as Visits & Consultations.

The system counts Visits & Consultations based on recorded Visits whose selected Visit Type is `Visit & Consultation`.

This capability records the Visit Type and the resulting Visit & Consultation count only.

It does not record consultation fees, prices, amounts, payments, balances, receipts, accounting data, or other financial information.

Financial calculation or collection remains outside the system.

---

## 8. ACTOR RESPONSIBILITIES

### Doctor

The Doctor:

- is the clinical authority;
- reviews patient information;
- creates or oversees the patient's clinical workflow;
- records clinical decisions where applicable;
- establishes Case completion through the Doctor's clinical decision;
- remains the Main Admin and system owner.

### Nurse

The Nurse:

- is an operational workflow participant;
- participates in operational workflow delegated by the Doctor;
- supports patient arrival / entry;
- supports patient data recording;
- supports patient exit;
- supports Doctor notification;
- may perform delegated operational workflow fully or under supervision;
- does not replace the Doctor's clinical authority.

Delegation of operational workflow does not transfer clinical authority or
system ownership.

---

## 9. WORKFLOW STATES

The product-level Case Workflow is defined by the following five Case
states, using the clinic's operational meaning exactly as established by
the product owner:

1. Arrived — Awaiting Registration
2. Awaiting Doctor
3. With Doctor
4. Exited — Follow-up Pending
5. Completed

These are product-level Case states.

They describe what the clinic needs to understand about the current Case
at the operational and clinical level.

They are not technical state-machine definitions.

The exact technical representation, persistence mechanism, and technical
transition implementation remain undefined.

---

## 10. TRANSITIONS

The product-level Case Workflow follows the five defined Case states.

The conceptual progression is:

Arrived — Awaiting Registration
→ Awaiting Doctor
→ With Doctor

From With Doctor, the Case may proceed to either:

→ Completed

or:

→ Exited — Follow-up Pending

A Case reaches Completed only through the Doctor's clinical completion
decision.

When follow-up is required, Patient Exit ends the current Visit and the
Case remains open in:

Exited — Follow-up Pending

When the patient later returns for follow-up, that return begins a new
Visit on a later Clinic Day within the same Case:

Exited — Follow-up Pending
→ Arrived — Awaiting Registration

The return transition is not automatic. It represents the patient's later
arrival for a new Visit.

The same Visit progression may therefore repeat within the same Case:

Arrived — Awaiting Registration
→ Awaiting Doctor
→ With Doctor
→ Exited — Follow-up Pending

This cycle may occur across multiple later Visits and Clinic Days until the
Doctor establishes Case completion.

A Case may therefore contain multiple Visits across multiple Clinic Days.

Patient Exit moves the current Visit out of its operational flow, but does
not by itself move the Case to Completed.

The Case reaches Completed only through the Doctor's clinical completion
decision.

The exact technical transition implementation remains undefined.

---

## 11. PERMISSIONS AND RESPONSIBILITIES

Exact product-level workflow permissions and responsibilities are
NOT_DEFINED.

The authority boundary already established by CONTRACT-03 remains:

- Doctor = Clinical Authority
- Nurse = Operational Workflow Participant
- Delegation ≠ Ownership
- Delegation ≠ Transfer of Clinical Authority

No technical permission matrix is defined here.

---

## 12. CLINIC DAY RELATIONSHIP

A Clinic Day may contain multiple Cases.

Cases may exist in different workflow conditions during the same Clinic Day.

A Case may remain open after its Clinic Day is closed.

Closing a Clinic Day does not automatically complete an open Case.

A later Visit for an open Case may occur on a later Clinic Day.

---

## 13. COMPLETION BOUNDARY

Patient Exit:

- ends the operational flow of the current Visit;
- does not by itself complete the Case.

Case Completion:

- is established by the Doctor's clinical decision;
- is distinct from Visit Exit;
- is distinct from Clinic Day Closure.

The terminal product terminology is:

Completed

No alternative terminal terminology is introduced by this contract.

---

## 14. UNDEFINED ITEMS

The following remain explicitly NOT_DEFINED:

- exact transition conditions;
- timing rules;
- concurrency behavior;
- exact workflow permissions;
- exact workflow responsibilities beyond the authority boundary already
  established by CONTRACT-03;
- technical state-machine design;
- technical persistence representation;
- technical authorization implementation.

These items require later explicit definition.

---

## 15. NON-AUTHORIZATION

This contract does NOT authorize:

- Database schema design
- Database migrations
- SQL implementation
- API routes
- API request / response contracts
- UI screens
- UI components
- Authentication implementation
- Authorization implementation
- Technical permission matrices
- Technical workflow state machines
- Audit implementation
- Locking implementation
- Deployment implementation
- Multi-clinic behavior
- Multi-branch behavior
- Multi-tenant behavior
- Hospital functionality
- LIMS functionality
- Pharmacy functionality
- Billing / Accounting functionality
- AI diagnosis
- Appointment / Scheduling capability

---

## 16. ACCEPTANCE TARGET

C08 is considered product-level defined when the Case Workflow states,
conceptual transitions, Visit Exit / Case Completion distinction, Clinic Day
Closure / Case Completion distinction, and the Doctor / Nurse authority
boundary established by CONTRACT-03 are explicitly defined and proven
against the authoritative manuscript and closed contracts.

Exact workflow conditions, timing, concurrency, technical state-machine
design, technical persistence representation, technical authorization
implementation, and technical permission matrices remain NOT_DEFINED and
are not required for this product-level definition.

The following authorization boundaries remain in force:
CASE_WORKFLOW_CONTRACT = DEFINED
IMPLEMENTATION_AUTHORIZED = NO
DATABASE_SCHEMA_AUTHORIZED = NO
API_AUTHORIZED = NO
UI_AUTHORIZED = NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO

## 17. NEXT GATE

NEXT GATE = BUILD AUTHORIZATION / IMPLEMENTATION DEFINITION

CONTRACT-08 IS CLOSED.
The Contract phase is complete through CONTRACT-08.
No implementation is authorized by this transition alone.

END OF CONTRACT-08

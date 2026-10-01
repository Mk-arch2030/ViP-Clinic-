# Dr.Roby Clinic
# CONTRACT-05 — VISIT / CLINICAL ENCOUNTER WORKFLOW

## 1. CONTRACT PURPOSE

This contract defines the product-level behavior of a Visit as a
clinical encounter within Dr.Roby Clinic.

This contract governs the relationship between Clinic Day, Case, Patient,
and Visit, and the operational Visit flow:

Arrival → Doctor → Exit

This contract does not authorize implementation.

---

## 2. VISIT IDENTITY

A Visit is one organized clinical encounter for one Patient through one
Case on one Clinic Day.

A Visit belongs to exactly one Case.

A Visit belongs to exactly one Clinic Day.

A Visit does not replace the Patient identity.

A Visit does not replace the Case identity.

---

## 3. VISIT AND CASE RELATIONSHIP

Each Case belongs to exactly one Patient.

A Case may contain multiple Visits.

The same Case may continue across multiple Clinic Days.

A later follow-up return for the same ongoing Case creates a new Visit.

The new Visit does not create a duplicate Patient.

The new Visit does not create a duplicate Case when the existing Case
continues to represent the same clinical journey.

---

## 4. VISIT AND CLINIC DAY RELATIONSHIP

Every Visit belongs to the Clinic Day on which that encounter occurs.

A Clinic Day may contain multiple Visits.

Multiple Visits may coexist during the same Clinic Day.

Closing a Clinic Day does not automatically complete an open Case.

An open Case may continue into a later Clinic Day through a new Visit.

---

## 5. VISIT OPERATIONAL FLOW

The product-level Visit flow is:

Arrival
   ↓
Doctor
   ↓
Exit

Arrival represents the patient's entry into the current Visit.

Doctor represents the clinical encounter and the Doctor's clinical
authority over the encounter.

Exit represents the end of the current Visit.

Exit does not by itself establish completion of the Case.

---

## 6. ARRIVAL

A Patient arrival is recorded within the current Visit.

Arrival establishes that the Patient has entered the current encounter.

Operational arrival handling may be performed by the Nurse when delegated
by the Doctor according to CONTRACT-03.

The Doctor remains the clinical authority.

Arrival does not complete the Visit.

Arrival does not complete the Case.

---

## 7. DOCTOR ENCOUNTER

The Doctor is the Clinical Authority for the Visit.

The Doctor may review the Patient's existing history and the current Case
context during the encounter.

The Doctor may make clinical decisions within the product's defined
clinical scope.

The Visit records the encounter as part of the Patient's Clinical
History.

The Doctor's clinical authority is not transferred to the Nurse.

---

## 8. EXIT

Exit records the end of the current Visit.

Exit closes the current encounter at the Visit level.

Exit does not automatically complete the Case.

An exited Visit remains part of the Patient's preserved Clinical History.

A Case may remain open after Visit Exit when further follow-up or clinical
work is required.

---

## 9. CASE COMPLETION IS DISTINCT FROM VISIT EXIT

The following distinction is mandatory:

Visit Exit
    ≠
Case Completion

A Case is completed only through the Doctor's established completion
decision as defined by CONTRACT-01 and CONTRACT-03.

Therefore:

Visit Exit → current Visit ends

Case Completion → Doctor establishes that the Case is completed

A Visit may end while its Case remains open.

---

## 10. FOLLOW-UP

A follow-up return for an open Case creates a new Visit.

The new Visit occurs on the applicable new Clinic Day.

The new Visit belongs to the same existing Case when that Case continues
to represent the patient's ongoing clinical journey.

The previous Visit remains preserved in Clinical History.

The new Visit does not overwrite the previous Visit.

---

## 11. CLINICAL HISTORY

Each Visit contributes to the Patient's Clinical History.

Clinical History accumulates across Visits.

Previous Visits remain historically meaningful.

A later Visit must not replace or erase an earlier Visit.

Past History remains distinct from Clinical History and is not itself a
Visit.

---

## 12. DOCTOR / NURSE OPERATIONAL BOUNDARY

The Doctor remains:

- Main Admin
- Clinical Authority
- Actor

The Nurse remains an Operational Workflow Participant.

When delegated by the Doctor, the Nurse may perform operational Visit
workflow including:

- Patient Entry / Arrival
- Patient Data Recording
- Patient Exit
- Doctor Notification

Delegation of operational workflow does not delegate Clinical Authority.

Delegation of operational workflow does not transfer System Ownership.

The Doctor may operate the clinic without a Nurse.

---

## 13. VISIT PRESERVATION

An exited Visit remains part of the Patient's Clinical History.

A later Visit must be recorded as a separate encounter.

Historical Visit information must not be overwritten by the later Visit.

Daily data remains subject to the Clinic Day preservation and protection
rules defined by CONTRACT-02.

---

## 14. CROSS-CONTRACT DEPENDENCIES

This contract depends on and must remain consistent with:

- CONTRACT-01 — Patient / Case / Visit
- CONTRACT-02 — Clinic Day
- CONTRACT-03 — Actor & Authority
- CONTRACT-04 — Patient Identity & Clinical History

Relevant authoritative rules include:

- One Case belongs to one Patient.
- A Case may contain multiple Visits.
- A Visit belongs to one Case and one Clinic Day.
- Exit does not equal Case Completion.
- Doctor establishes Case completion.
- Doctor retains Clinical Authority.
- Nurse performs delegated operational workflow.
- Clinic Patient Number remains the stable Patient identity reference.
- Patient retrieval may use approved retrieval methods defined by
  CONTRACT-04.
- Clinical History accumulates from preserved Visits.

---

## 15. PRODUCT INVARIANTS

The following invariants are mandatory:

1. Every Visit belongs to exactly one Case.
2. Every Visit belongs to exactly one Clinic Day.
3. Every Case belongs to exactly one Patient.
4. A Case may contain multiple Visits.
5. A Case may continue across multiple Clinic Days.
6. Arrival belongs to the current Visit.
7. Exit ends the current Visit.
8. Exit does not complete the Case.
9. Case completion requires the Doctor's completion decision.
10. A follow-up return creates a new Visit.
11. A later Visit does not overwrite a previous Visit.
12. Visit history contributes to Clinical History.
13. Nurse operational participation does not transfer Clinical Authority.
14. Clinic Day closure does not automatically complete an open Case.
15. Doctor-only operation remains valid.

---

## 16. EXPLICIT NON-AUTHORIZATION

This contract does NOT authorize:

- Database schema design
- Database migrations
- API routes
- API request/response contracts
- UI contracts
- Authentication implementation
- Authorization implementation
- Technical permission matrices
- Technical workflow state machines
- Audit implementation
- Locking implementation
- Deployment implementation
- Multi-clinic support
- Multi-branch support
- Multi-tenant support
- Hospital workflows
- LIMS workflows
- Pharmacy workflows
- Billing/accounting workflows
- AI diagnosis
- Appointment/scheduling capability

Any such implementation requires its own authorized contract or later
implementation gate.

---

## 17. IMPLEMENTATION DISCIPLINE

This artifact is a CONTRACT artifact.

It translates the already-defined Product Manuscript and Domain
Specification into an explicit product-level Visit workflow contract.

It does not itself authorize implementation.

Implementation may begin only after the applicable contract set and later
implementation gates explicitly authorize it.

---

## 18. CONTRACT-05 ACCEPTANCE TARGET

Contract-05 is accepted only when the product-level Visit rules can be
proven without ambiguity, including:

- Visit belongs to one Case.
- Visit belongs to one Clinic Day.
- Case may contain multiple Visits.
- Arrival → Doctor → Exit.
- Exit ≠ Case Completion.
- Follow-up creates a new Visit.
- Previous Visits remain preserved.
- Clinical History accumulates from Visits.
- Doctor remains Clinical Authority.
- Nurse remains operational/delegated.
- Doctor-only operation remains valid.
- No implementation authorization is implied.


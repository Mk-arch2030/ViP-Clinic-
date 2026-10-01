# Dr.Roby Clinic — Domain Specification

STATUS: DEFINED
PHASE: DEFINE
IMPLEMENTATION: NOT_STARTED

## 1. DOMAIN NUCLEUS

Clinic Day
Case
Patient
Visit
Clinical History
Past History
Doctor
Nurse

## 2. PATIENT

A Patient is the person whose identity and persistent clinic information
are maintained by Dr.Roby Clinic.

The Patient has a system-generated Clinic Patient Number.

The Clinic Patient Number is the stable clinic reference used for
Find / Retrieve.

Patient information includes:
- Basic / Personal Data
- Past History

Past History represents information from before the patient entered the
clinic system.

Past History is not itself a Visit.

## 3. CASE

A Case represents one patient's operational and clinical journey.

Each Case belongs to exactly one Patient.

A Case may remain open across multiple Clinic Days.

A Case may contain multiple Visits.

Patient Exit does not complete the Case.

Case completion is established by the Doctor's clinical decision.

The terminal domain concept is:
Case → Completed

## 4. VISIT

A Visit represents one organized medical encounter within a Case.

Each Visit belongs to exactly one Case.

A Case may contain one or more Visits.

Each Visit occurs within a Clinic Day.

The operational flow of a Visit is:

Arrival
→ Doctor
→ Exit

Patient Exit ends the operational flow of the current Visit.

Patient Exit does not by itself complete the Case.

A later follow-up return creates a new Visit on a later Clinic Day
within the same Case when the Case remains open.

## 5. CLINIC DAY

A Clinic Day represents the clinic's working context for a working date.

A Clinic Day contains the Cases and Visits recorded during that
working day.

Multiple Cases may coexist during the same Clinic Day.

Cases may be in different stages of their journeys at the same time.

Closing a Clinic Day does not automatically complete or close an open
Case.

Daily data must remain preserved when the working day ends.

## 6. CLINICAL HISTORY

Clinical History is the accumulated history created by recorded Visits.

Each new Visit contributes new clinical information to the Patient's
Clinical History.

Previous Visits retain their historical meaning and are not overwritten.

The conceptual relationship is:

Patient
→ Clinical History
→ Visit 1
→ Visit 2
→ Visit N

## 7. PAST HISTORY

Past History is information from before the patient entered the clinic
system.

It is recorded with the patient's initial information.

Past History is distinct from Clinical History.

## 8. DOCTOR

The Doctor is:

- Clinical Authority
- Main Admin
- Actor

The Doctor retains clinical authority and system ownership.

The Doctor may delegate operational workflow execution to a Nurse.

Delegation of operational work does not transfer clinical authority or
system ownership.

## 9. NURSE

The Nurse is an Operational Workflow Participant.

The Nurse participates in operational workflow delegated by the Doctor.

The defined operational scope includes:

- Patient Arrival / Entry
- Patient Data Recording
- Patient Exit
- Doctor Notification

The delegated workflow may be performed fully by the Nurse or under
the Doctor's supervision.

The Nurse does not replace the Doctor's clinical authority.

## 10. DOMAIN RELATIONSHIPS

Clinic Day
→ Case
→ Patient
→ Visit

One Case
→ One Patient

One Case
→ One or more Visits

One Visit
→ One Clinic Day

Patient
→ Past History

Patient
→ Clinical History
→ Visits

## 11. CORE INVARIANTS

1. A Case belongs to one Patient only.
2. A Case may contain multiple Visits.
3. Visits may occur across multiple Clinic Days.
4. Exit ends the current Visit flow.
5. Exit does not complete the Case.
6. Case completion is established by the Doctor.
7. A closed Clinic Day does not automatically complete an open Case.
8. Past History is distinct from Clinical History.
9. Clinical History accumulates through recorded Visits.
10. Previous Visits are not overwritten.
11. The Doctor remains the Clinical Authority.
12. The Doctor remains the Main Admin.
13. Nurse participation is operational and delegated by the Doctor.
14. Delegation does not transfer clinical authority or system ownership.
15. The Clinic Patient Number is the stable clinic reference for
    Find / Retrieve.

## 12. DOMAIN BOUNDARY

This specification defines the current Dr.Roby Clinic domain only.

It does not authorize:

- Database schema
- API contracts
- UI contracts
- Authorization implementation
- Authentication implementation
- Workflow implementation
- Deployment
- Hospital functionality
- LIMS functionality
- Pharmacy functionality
- Billing / Accounting functionality
- ERP functionality
- AI diagnosis
- Multi-clinic / multi-branch / multi-tenant functionality

Any future capability requires explicit product definition and its own
contract gate.

## 13. IMPLEMENTATION DISCIPLINE

This Domain Specification is a DEFINE artifact.

It does not itself authorize implementation.

The next phase after DEFINE is Contract.

END OF DOMAIN SPECIFICATION

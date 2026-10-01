# Dr.Roby Clinic — CONTRACT-01
# Patient / Case / Visit Contract

STATUS: DEFINED
PHASE: CONTRACT
IMPLEMENTATION: NOT_STARTED

## 1. CONTRACT PURPOSE

This contract defines the authoritative relationship and domain rules
between Patient, Case, and Visit.

It converts the approved DEFINE domain specification into mandatory
rules for all future implementation.

This contract does not define database schema, API routes, UI surfaces,
authentication implementation, or deployment.

## 2. PATIENT CONTRACT

A Patient is the clinic identity to which persistent patient information
is associated.

Every Patient has a system-generated Clinic Patient Number.

The Clinic Patient Number is the stable clinic reference for
Find / Retrieve.

Patient information includes:
- Basic / Personal Data
- Past History

Past History represents information from before the patient entered the
clinic system.

Past History is not a Visit and must not be treated as one.

## 3. CASE CONTRACT

A Case represents one patient's operational and clinical journey.

Each Case MUST belong to exactly one Patient.

A Case MUST NOT belong to more than one Patient.

A Case MAY remain open across multiple Clinic Days.

A Case MAY contain multiple Visits.

Patient Exit MUST NOT by itself complete the Case.

Case completion MUST be established by the Doctor's clinical decision.

The terminal domain concept for the Case is:

Case → Completed

## 4. VISIT CONTRACT

A Visit represents one organized medical encounter within a Case.

Each Visit MUST belong to exactly one Case.

A Case MAY contain one or more Visits.

Each Visit MUST occur within one Clinic Day.

The operational flow of a Visit is:

Arrival
→ Doctor
→ Exit

Patient Exit ends the operational flow of the current Visit.

Patient Exit MUST NOT by itself complete the Case.

When an open Case requires a later follow-up return, the later return
creates a new Visit on a later Clinic Day within the same Case.

Previous Visits MUST remain historically meaningful.

## 5. RELATIONSHIP CONTRACT

The authoritative relationship is:

Patient
→ Case
→ Visit
→ Clinic Day

With these cardinality rules:

One Case
→ exactly one Patient

One Case
→ one or more Visits

One Visit
→ exactly one Case

One Visit
→ exactly one Clinic Day

A Case MAY span multiple Clinic Days through its Visits.

## 6. CLINICAL HISTORY CONTRACT

Clinical History is the accumulated clinical history created by recorded
Visits.

Each new Visit adds new clinical information to the Patient's Clinical
History.

Previous Visits MUST NOT be overwritten as the current Visit is created.

The conceptual history is:

Patient
→ Clinical History
→ Visit 1
→ Visit 2
→ Visit N

Clinical History is distinct from Past History.

## 7. CLINIC DAY BOUNDARY

A Clinic Day represents the clinic's working context for a working date.

A Clinic Day contains the Cases and Visits recorded during that working
day.

Closing a Clinic Day MUST NOT automatically complete or close an open
Case.

Daily data MUST remain preserved when the working day ends.

## 8. AUTHORITY BOUNDARY

The Doctor remains the Clinical Authority.

The Doctor is also the Main Admin and Actor.

A Nurse participates only in operational workflow delegated by the
Doctor.

Operational delegation MUST NOT transfer:
- Clinical Authority
- System Ownership

The Nurse MUST NOT replace the Doctor's clinical authority.

## 9. CONTRACT INVARIANTS

The following rules are mandatory:

1. One Case belongs to one Patient only.
2. One Case may contain multiple Visits.
3. One Visit belongs to one Case only.
4. One Visit occurs within one Clinic Day.
5. A Case may continue across multiple Clinic Days.
6. Visit Exit does not equal Case Completion.
7. Case Completion is established by the Doctor.
8. Past History is distinct from Clinical History.
9. Previous Visits are not overwritten.
10. The Clinic Patient Number is the stable clinic reference.
11. Closing a Clinic Day does not automatically close an open Case.
12. Daily data remains preserved at the end of the working day.
13. Nurse participation is operational and delegated.
14. Delegation does not transfer clinical authority or system ownership.

## 10. EXPLICIT NON-AUTHORIZATION

This contract does NOT authorize:

- Database tables or schema
- Database migrations
- API routes
- API request/response formats
- UI screens
- UI components
- Authentication implementation
- Authorization implementation
- Workflow state-machine implementation
- Deployment
- Multi-clinic behavior
- Multi-branch behavior
- Multi-tenant behavior
- Hospital functionality
- LIMS functionality
- Pharmacy functionality
- Billing / Accounting functionality
- AI diagnosis

Any such capability requires its own definition and contract authority.

## 11. CONTRACT STATUS

CONTRACT-01_SCOPE = PATIENT / CASE / VISIT
CONTRACT-01_IMPLEMENTATION_AUTHORIZED = NO
CONTRACT-01_SCHEMA_AUTHORIZED = NO
CONTRACT-01_API_AUTHORIZED = NO
CONTRACT-01_UI_AUTHORIZED = NO

END OF CONTRACT-01

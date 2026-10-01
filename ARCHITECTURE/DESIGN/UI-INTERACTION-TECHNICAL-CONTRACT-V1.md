# UI / INTERACTION TECHNICAL CONTRACT V1

STATUS: CLOSED + PROVEN
AUTHORITY: PRODUCT OWNER HUMAN DESIGN + CLOSED PRODUCT CONTRACTS
IMPLEMENTATION: NOT AUTHORIZED

## 1. PURPOSE

This contract defines the technical interaction boundary required to express
the approved Human Design of Dr.Roby Clinic through the future Web Application.

It does not authorize frontend implementation.

## 2. PRODUCT SURFACE

The product surface is a single Internet-hosted Web Application.

The Web Application shall support Doctor and Nurse access from:
- PC
- Laptop
- Tablet
- Mobile

Future installable/PWA behavior remains part of the product direction but is
not implementation-authorized by this contract.

## 3. DOCTOR ENTRY CONTEXT

The Doctor entry context shall expose, at minimum:

- Patients
- Patient data
- Selected Patient inspection
- New Patient registration
- Doctor's continuing Patients and Cases
- Current Clinic Day
- Clinic Day counter
- Clinic Day status
- Clinic Day lifecycle

The Clinic Day remains visible when its daily counter is zero.

## 4. PATIENT INTERACTION BOUNDARY

The Patient interaction boundary shall support:

- viewing Patients;
- opening an existing Patient;
- inspecting organized Patient information;
- registering a new Patient;
- continuing an existing Patient journey.

Patient identity remains stable.

Name, CPN, and Barcode retrieval shall resolve to the same Patient identity.

## 5. PATIENT JOURNEY BOUNDARY

The technical interaction flow shall preserve:

Patient
→ Case
→ Visit
→ Clinic Day

A returning Patient shall continue through the appropriate existing Case
when clinically appropriate.

A follow-up shall create a new Visit and shall not overwrite a previous Visit.

## 6. CLINIC DAY INTERACTION BOUNDARY

The Clinic Day surface shall remain intentionally simple.

It shall expose the current:
- Working Day
- daily counter
- status
- lifecycle
- Patients/Cases relevant to the day

A Clinic Day with zero cases is a valid visible state.

Clinic Day closure does not complete an open Case.

## 7. VISIT ENTRY INTERACTION

The interaction flow shall support:

Patient arrives
→ Patient registered/retrieved
→ Visit recorded
→ Visit Type = Visit & Consultation
→ Patient waits for or enters Doctor encounter

Each new Visit remains distinct from previous Visits.

## 8. DOCTOR ENCOUNTER INTERACTION

During the active Visit, the Doctor interaction shall support:

- review of Patient information;
- review of Past History;
- review of Clinical History;
- review of the continuing Case;
- examination of the Patient;
- recording clinical information;
- recording the Doctor's clinical decision.

The Doctor remains the Clinical Authority.

## 9. CLINICAL DECISION INTERACTION

The interaction shall represent the approved clinical decision paths.

### Path A
Examination
→ Initial Treatment
→ Follow-up
→ Case remains open

### Path B
Treatment
→ Follow-up
→ Case remains open

### Path C
Patient considered recovered
→ Case Completion by Doctor

Case Completion remains distinct from Visit Exit.

## 10. VISIT EXIT INTERACTION

A Visit may be ended when authorized by the Doctor.

Where delegated operational workflow is active, the Nurse may perform the
authorized Visit Exit according to the Doctor's delegation.

Visit Exit:
- preserves the Visit;
- preserves Clinical History;
- does not automatically complete the Case.

## 11. NURSE INTERACTION BOUNDARY

The Nurse interaction shall support only the operational capabilities already
authorized by the Authorization Technical Contract:

1. Patient Entry / Arrival
2. Patient Data Recording
3. Patient Exit
4. Doctor Notification

Delegation does not transfer:
- Clinical Authority;
- clinical decision authority;
- Main Admin authority;
- System Ownership;
- Case Completion authority.

## 12. HISTORY INTERACTION

The interaction boundary shall preserve the distinction between:

- Past History;
- Clinical History.

Clinical History shall remain based on accumulated Visits.

Previous Visits shall remain meaningful and shall not be replaced by a
current/latest-value representation.

## 13. FOLLOW-UP INTERACTION

A follow-up shall preserve continuity:

Existing Patient
→ Existing History
→ Applicable Existing Case
→ New Visit
→ Current Clinic Day

The interaction shall not create a duplicate Patient or overwrite a previous
Visit.

## 14. AUTHORITY AND PROTECTION

The interaction boundary shall respect Doctor authority and the approved Nurse
delegation model.

Protected clinical information shall not be exposed through an interaction
that bypasses the authorization model.

Technical authentication, session handling, token handling, and authorization
middleware remain outside this contract until separately defined.

## 15. ERROR / INVALID ACTION BOUNDARY

The future interaction implementation shall not silently violate Product,
Persistence, or Authorization invariants.

Invalid operations shall be rejected rather than producing:
- duplicate Patient identity;
- duplicate CPN;
- Visit without Case;
- Visit without Clinic Day;
- Case completion by Nurse;
- cross-Visit clinical overwrite;
- unauthorized clinical amendment.

Exact error presentation remains implementation-defined.

## 16. RESPONSIVE WEB BOUNDARY

The interaction model shall be device-independent at the product level.

The same Web Application shall represent the approved workflow across:
- desktop;
- laptop;
- tablet;
- mobile.

Exact responsive breakpoints, component structure, CSS, visual styling, and
device-specific layouts are not defined here.

## 17. UI TECHNICAL IMPLEMENTATION BOUNDARY

This contract does not define or authorize:

- frontend framework;
- frontend source structure;
- React/Vite implementation;
- components;
- exact screens;
- exact navigation implementation;
- CSS;
- visual theme;
- responsive breakpoints;
- browser storage;
- API routes;
- API handlers;
- authentication implementation;
- session/token implementation;
- authorization middleware;
- database implementation;
- repository implementation;
- deployment implementation.

## 18. SOURCE OF TRUTH

Product behavior remains governed by the closed application, persistence,
authorization, API, and interaction-surface contracts.

This contract translates the approved Human Design into a technical interaction
boundary and shall not redefine those authoritative sources.

## 19. IMPLEMENTATION STATUS

UI_IMPLEMENTATION_AUTHORIZED = NO
FRONTEND_IMPLEMENTATION_AUTHORIZED = NO
API_IMPLEMENTATION_AUTHORIZED = NO
DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = NO
AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO

IMPLEMENTATION = NOT AUTHORIZED

## 20. NEXT GATE

NEXT GATE = UI IMPLEMENTATION DEFINITION / BUILD AUTHORIZATION REVIEW

## CONTROLLED AMENDMENT — A01-A04

STATUS = CONTROLLED AMENDMENT
IMPLEMENTATION_AUTHORIZED = NO

A01 — ARRIVAL PATIENT CONDITION
Nurse Arrival interaction may capture one Visit-level condition:
Normal / Moderately Unwell / Severely Unwell.
This is not Vital Signs or a clinical decision.

A02 — NURSE CURRENT COMPLAINT INTAKE
Nurse may capture the patient-reported Current Complaint during delegated
intake. Doctor remains the clinical authority.

A03 — NURSE INITIAL PAST HISTORY COLLECTION
Nurse may collect patient-supplied Past History during delegated intake.
Doctor remains authoritative for Past History.

A04 — SEND TO DOCTOR
Send to Doctor is an operational Doctor Notification interaction.
It creates no new Case, Visit, authority, completion, or closure state.

CROSS_CONTRACT_INVARIANTS_PRESERVED = YES
CONTRACT_MUTATION = PERFORMED
IMPLEMENTATION = NOT AUTHORIZED

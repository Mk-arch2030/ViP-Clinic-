# Dr.Roby Clinic — UI Human Design V1

STATUS: DEFINITION DRAFT
AUTHORITY: PRODUCT OWNER HUMAN DESIGN
IMPLEMENTATION: NOT AUTHORIZED

## 1. DOCTOR ENTRY SURFACE

When the Doctor enters the system, the primary experience shall expose:

- Patients;
- Patient data;
- ability to open and inspect a selected Patient;
- ability to register a new Patient;
- ability to follow the Doctor's Patients and their Cases;
- current Clinic Day;
- Clinic Day counter;
- Clinic Day status;
- Clinic Day lifecycle.

The Clinic Day remains visible even when the daily counter is zero.

## 2. PATIENT EXPERIENCE

The Doctor shall be able to:

- view Patients;
- open an existing Patient;
- inspect the Patient's organized information;
- register a new Patient;
- follow the Patient's continuing clinical journey.

Patient identity remains stable.

## 3. CLINIC DAY EXPERIENCE

The Clinic Day surface shall remain simple.

It shall make the current daily context understandable through:

- daily counter;
- current Clinic Day status;
- Clinic Day lifecycle;
- Patients/Cases currently relevant to the day.

A Clinic Day with zero cases remains a valid visible Clinic Day state.

## 4. VISIT ENTRY

The operational patient journey begins with:

Patient arrives
→ Patient is registered/retrieved
→ Visit is recorded
→ Visit Type = Visit & Consultation
→ Patient waits for or enters Doctor encounter.

A new Visit must remain distinct from previous Visits.

## 5. DOCTOR ENCOUNTER

During the active Visit, the Doctor shall be able to:

- review Patient information;
- review relevant history;
- review the continuing Case;
- examine the Patient;
- record the clinical decision.

The Doctor remains the Clinical Authority.

## 6. CLINICAL DECISION EXPERIENCE

The Doctor's clinical decision may lead to:

### Path A
Examination
→ initial treatment
→ follow-up
→ Case remains open.

### Path B
Treatment
→ follow-up
→ Case remains open.

### Path C
Patient is considered recovered
→ Case Completion by Doctor.

Case Completion remains distinct from Visit Exit.

## 7. VISIT END

A Visit may be ended when authorized by the Doctor.

Where delegated operational workflow is used, the Nurse may perform the authorized Visit Exit according to the Doctor's delegation.

Visit Exit preserves the Visit and does not automatically complete the Case.

## 8. NURSE EXPERIENCE

The Nurse experience shall support only the operational capabilities already authorized by the Authorization Technical Contract:

- Patient Entry / Arrival;
- Patient Data Recording;
- Patient Exit;
- Doctor Notification.

Delegation does not transfer:

- Clinical Authority;
- clinical decision authority;
- Main Admin authority;
- System Ownership;
- Case Completion authority.

## 9. CONTINUITY

The experience shall preserve the relationship:

Patient
→ Case
→ Visit
→ Clinic Day

A returning Patient continues through the appropriate existing Case when clinically appropriate.

A follow-up creates a new Visit rather than overwriting the previous Visit.

## 10. DESIGN BOUNDARY

This Human Design V1 does not yet define:

- visual styling;
- exact screens;
- exact components;
- navigation implementation;
- API routes;
- database structures;
- authentication implementation;
- authorization implementation;
- frontend implementation;
- backend implementation.

UI Technical Contract remains NOT AUTHORIZED.
Implementation remains NOT AUTHORIZED.

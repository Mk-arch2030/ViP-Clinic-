# UI HUMAN DESIGN V1 — COMMANDER SYNTHESIS

## 1. PURPOSE

This document is the Commander-level synthesis of the Dr.Roby Clinic
Human Design.

It combines:

1. Human Product Owner vision and clinic workflow understanding.
2. Useful external auditor observations.
3. Architectural reconciliation performed by the Commander.

The objective is not to concatenate suggestions.

The objective is to produce one coherent clinic experience that remains
faithful to the real clinic workflow, Doctor authority, Nurse delegation,
Patient continuity, Case continuity, Visit continuity, and Clinic Day
operation.

External observations are advisory input.

The final synthesized direction belongs to the Dr.Roby Clinic product
authority.

---

## 2. COMMANDER SYNTHESIS PRINCIPLE

The clinic should feel like one real clinic, not a collection of features.

The interface must therefore expose the real journey:

Patient
→ Case
→ Visit
→ Clinic Day
→ Nurse Operational Workflow
→ Doctor Clinical Encounter
→ Visit Exit
→ Follow-up or Case Completion

The UI must make the journey understandable without exposing unnecessary
technical complexity.

---

## 3. PRIMARY PRODUCT SURFACE

### 3.1 One Web Application

The product is one Internet-hosted Web Application.

The same product surface is intended for:

- Doctor
- Nurse
- PC
- Laptop
- Tablet
- Mobile

No separate Nurse application is required by this design.

### 3.2 Future PWA Direction

The Web Application is intentionally designed so that future PWA behavior
may be introduced.

PWA installation, service workers, offline behavior, synchronization, caching,
and device-specific implementation remain future technical decisions.

---

## 4. NURSE OPERATIONAL EXPERIENCE

The Nurse experience is treated as a first-class operational surface,
especially on tablet/mobile form factors.

The Nurse can work within the Doctor-authorized delegation boundary.

The operational flow is:

Patient Arrives
→ Identify New or Existing Patient
→ Retrieve Existing Patient when applicable
→ Record Authorized Patient/Visit Data
→ Notify / Send to Doctor
→ Patient becomes visible to Doctor workflow
→ Execute authorized Visit Exit when instructed/authorized

The Nurse does not become a clinical authority.

The Nurse does not become Main Admin.

The Nurse does not receive Case Completion authority.

The Nurse does not receive independent clinical amendment authority.

---

## 5. NURSE INTAKE DATA

The Commander synthesis adopts a clear distinction between:

### Operational Intake

Information gathered during patient arrival and operational registration.

Examples include:

- Patient identity information
- Authorized patient data
- Current Complaint intake
- Initial Past History information when delegated

### Clinical Authority

Doctor-controlled clinical interpretation and decision.

The following remain Doctor-authority areas:

- Clinical decision
- Diagnosis
- Clinical treatment decision
- Clinical amendment
- Past History modification/authority
- Case Completion

This distinction prevents the Nurse workflow from accidentally becoming
a second clinical authority.

---

## 6. CURRENT COMPLAINT

Current Complaint is surfaced early in the patient journey because it is
important to the Doctor's encounter.

The Nurse may capture Current Complaint as delegated intake information
when permitted by the final authorization contract.

The Doctor remains responsible for clinical interpretation and decision.

The exact authorization and persistence treatment must be reconciled in
the appropriate technical contracts before implementation.

---

## 7. PAST HISTORY

Past History remains patient-level historical information and remains
distinct from Clinical History.

The Nurse may participate in initial collection of Past History information
only through explicit delegation.

Doctor authority remains required for established Past History modification.

The UI must never visually imply that Nurse data entry transfers authority
from Doctor to Nurse.

---

## 8. ARRIVAL PATIENT CONDITION

The Commander replaces Nurse-facing Vital Signs capture at patient arrival
with a simple operational observation:

**Arrival Patient Condition**

The Nurse records the patient's general condition as observed at arrival:

- Normal
- Moderately Unwell
- Severely Unwell

This is an operational intake observation.

It is NOT a Vital Sign measurement.

It is NOT a diagnosis.

It is NOT a clinical decision.

The purpose is to give the Doctor an immediate understanding of the
patient's observed condition on arrival without expanding the Nurse workflow
into clinical measurement.

### Doctor Vital Signs

Detailed Vital Signs remain a Doctor-facing clinical capability.

The Doctor may enter Vital Signs during the Doctor's examination /
consultation as part of the clinical encounter.

This preserves the distinction:

Nurse:
Arrival observation

Doctor:
Clinical measurement and examination

Before implementation, the exact technical contract for both representations
must be deliberately defined.

ARRIVAL_PATIENT_CONDITION_IMPLEMENTATION_AUTHORIZED = NO
VITAL_SIGNS_IMPLEMENTATION_AUTHORIZED = NO

---

## 9. SEND TO DOCTOR

"Send to Doctor" is adopted as a human interaction concept.

It represents the Nurse's operational notification that the patient is ready
for the Doctor workflow.

The concept aligns with:

- Doctor Notification
- Awaiting Doctor
- Doctor workflow visibility

The exact technical state transition and API operation remain subject to
their respective contracts.

---

## 10. DOCTOR OPERATIONAL VIEW

The Doctor's primary operational view should make the current Clinic Day
easy to understand.

It should expose:

- Patients
- Relevant patient data
- Current Clinic Day
- Current operational status
- Current daily count
- Patients Awaiting Doctor
- Patients With Doctor
- Relevant open Cases
- Patient continuity
- Follow-up continuity

The purpose is operational clarity, not creation of a separate analytics
system.

Exact counter definitions and reporting rules remain subject to deliberate
technical definition.

---

## 11. LONGITUDINAL HISTORY

Patient History should be understandable longitudinally.

The Doctor should be able to understand:

Patient
→ Cases
→ Clinic Days
→ Visits
→ Clinical History

Previous Visits remain meaningful.

Follow-up does not overwrite previous clinical information.

The UI should present continuity rather than a mutable "latest record".

The exact visual navigation remains a UI design decision.

---

## 12. DOCTOR CLINICAL ENCOUNTER

The Doctor is the clinical authority.

The Doctor reviews:

- Patient identity
- Basic/Personal Data
- Past History
- Clinical History
- Case
- Current Complaint
- Investigation
- Diagnosis
- Treatment
- Follow-up

The Doctor then makes the clinical decision.

The system must not convert the clinical workflow into a pharmacy,
dispensing, inventory, billing, or accounting subsystem.

Treatment remains a clinic clinical capability.

---

## 13. CASE LIFECYCLE

The Doctor controls Case Completion.

The primary clinical paths remain:

### PATH A
Examination
→ Initial Treatment
→ Follow-up
→ Case remains open

### PATH B
Treatment
→ Follow-up
→ Case remains open

### PATH C
Clinical recovery
→ Case Completion by Doctor

Visit Exit is never treated as automatic Case Completion.

Clinic Day Closure is never treated as Case Completion.

---

## 14. CLINIC DAY

Clinic Day remains simple and visible.

The Doctor is the authority over Clinic Day lifecycle decisions.

The Clinic Day should make its operational context visible even when the
daily patient count is zero.

Closing a Clinic Day:

- preserves Visits
- preserves Clinical History
- preserves open Cases
- preserves continuity
- does not erase history
- does not automatically complete open Cases

An explicit "Open Clinic Day" action remains a lifecycle detail requiring
deliberate technical definition.

---

## 15. OPERATIONAL COUNTERS

The Commander adopts operational counters as part of the clinic language.

The primary examples are:

- Daily patient/case count
- Awaiting Doctor count
- With Doctor count

Counters are operational indicators.

They are not treated as an independent reporting/BI subsystem.

Exact aggregation and persistence behavior require future technical
definition.

---

## 16. VISUAL LANGUAGE

Visual design remains owned by the Human Product Owner.

The Commander may synthesize interaction patterns and hierarchy, but does
not override the Human Product Owner's visual authority.

External suggestions about colors, emphasis, buttons, branding, or visual
states are references only until explicitly accepted by the Product Owner.

---

## 17. DEVICE EXPERIENCE

The clinic should preserve the same domain workflow across devices.

### Doctor

Desktop/laptop/tablet/mobile experience should remain functionally coherent.

### Nurse

Tablet/mobile should be treated as a natural operational environment.

Responsive behavior should adapt presentation without creating separate
business logic.

---

## 18. ARCHITECTURAL GUARDRAILS

This synthesis does NOT authorize:

- Database implementation
- SQL
- Migrations
- ORM
- Repository implementation
- API route implementation
- Frontend implementation
- Authentication implementation
- Authorization implementation
- Session implementation
- PWA implementation
- Offline synchronization
- Database technology selection
- Deployment implementation

No closed contract is silently modified by this document.

---

## 19. SYNTHESIS RESULT

The Commander synthesis intentionally combines:

### FROM THE HUMAN PRODUCT OWNER

- Real clinic workflow
- Doctor-centered clinical authority
- Nurse delegation
- Patient continuity
- Case continuity
- Visit continuity
- Clinic Day visibility
- Simple Clinic Day
- Human-first UI ownership
- Product simplicity
- Sellable Web Application direction

### FROM THE EXTERNAL AUDITOR

- Strong Nurse mobile/tablet surface
- Explicit Send to Doctor interaction
- Operational waiting/doctor visibility
- Longitudinal history presentation
- Intake-oriented Current Complaint
- Simple Arrival Patient Condition for Nurse intake
- Doctor-entered Vital Signs during clinical examination
- Operational counters
- Explicit Clinic Day lifecycle consideration

### FROM ARCHITECTURAL RECONCILIATION

- No authority leakage
- No silent schema expansion
- No accidental pharmacy scope
- No implementation leakage
- No contract bypass
- No external-auditor authority transfer
- No premature technical commitment

---

## 20. FINAL COMMANDER POSITION

The preferred Dr.Roby Clinic experience is:

A single web application that behaves like one real clinic.

The Nurse operates the operational front line within explicit delegation.

The Doctor remains the clinical authority, Main Admin, and System Owner.

The Patient remains one identity.

The Case remains one clinical journey.

The Visit records each encounter without overwriting history.

The Clinic Day organizes the daily operational context.

The UI makes these relationships understandable to humans.

External observations may improve the design, but architecture determines
how they enter the product.

The best idea is not the loudest idea.

The best idea is the idea that fits the whole clinic without breaking one
contract.

---

STATUS = COMMANDER SYNTHESIS
AUTHORITY = HUMAN PRODUCT OWNER + ARCHITECTURAL COMMANDER
EXTERNAL_AUDITOR = ADVISORY / SANITY-CHECK ONLY
IMPLEMENTATION = NOT AUTHORIZED
CONTRACT_MUTATION = NOT PERFORMED
NEXT_GATE = HUMAN ACCEPTANCE OF COMMANDER SYNTHESIS

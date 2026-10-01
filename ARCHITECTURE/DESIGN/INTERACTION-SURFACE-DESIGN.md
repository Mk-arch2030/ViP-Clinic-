# Dr.Roby Clinic — Interaction Surface Design

STATUS: CLOSED + PROVEN
PHASE: DESIGN

## 1. PURPOSE

This document defines the product-level interaction surfaces through which
the already-defined clinic workflow should be understood and operated.

It organizes the user experience around the Patient, Case, Visit, Clinic Day,
and defined operating modes.

It does not define implementation.

## 2. DESIGN AUTHORITY

This Design is derived from:

- the Product Manuscript;
- CONTRACT-01 — Patient, Case, Visit;
- CONTRACT-02 — Clinic Day;
- CONTRACT-03 — Actor Authority;
- CONTRACT-04 — Patient Identity and Clinical History;
- CONTRACT-05 — Visit Clinical Encounter Workflow;
- CONTRACT-06 — Clinical Decision and Treatment;
- CONTRACT-07 — Clinic Settings, Day Closure, Protection;
- CONTRACT-08 — Case Workflow;
- DESIGN-SCOPE.md;
- WORKFLOW-EXPERIENCE-DESIGN.md.

No new product capability, workflow state, or transition is introduced.

## 3. INTERACTION PRINCIPLE

The product experience shall organize interaction around the current patient
journey rather than around isolated data records.

The user should be able to understand the relationship between:

- the current Clinic Day;
- the current Patient;
- the current Case;
- the current Visit;
- the current workflow position;
- the relevant clinical and historical information.

Interaction should preserve the continuity of the patient journey.

## 4. CLINIC DAY SURFACE

The Clinic Day provides the current daily working context.

The interaction experience shall make it possible to understand:

- the current day's Cases;
- the different workflow conditions of those Cases;
- the daily case counter;
- which Cases remain active;
- which Cases have reached completion.

The Clinic Day surface must preserve continuity for Cases that remain open
after the Clinic Day is closed.

Closing a Clinic Day does not complete an open Case.

## 5. PATIENT SURFACE

The Patient surface represents the stable patient identity.

The interaction experience shall support:

- registration of a new Patient;
- recording of essential initial information;
- recording of Past History;
- retrieval of an existing Patient;
- access to the patient's accumulated Clinical History.

The Clinic Patient Number remains the stable clinic reference.

Name, Clinic Patient Number, and Barcode remain retrieval methods that reach
the same Patient identity.

## 6. CASE SURFACE

The Case surface represents the continuing patient journey.

The interaction experience shall make the current Case understandable across
Visits and Clinic Days.

The defined Case progression remains:

Arrived — Awaiting Registration
→ Awaiting Doctor
→ With Doctor

From With Doctor:

→ Completed

or:

→ Exited — Follow-up Pending

When follow-up occurs:

Exited — Follow-up Pending
→ Arrived — Awaiting Registration

The Case surface must preserve the distinction between:

- current Case state;
- previous Visits;
- previous Clinic Days;
- Case completion.

## 7. VISIT SURFACE

The Visit surface represents the current clinical encounter.

The defined Visit flow remains:

Arrival
→ Doctor
→ Exit

The interaction experience shall make clear:

- when the Patient has arrived for the current Visit;
- when the Doctor's clinical encounter is occurring;
- when the current Visit has ended.

Visit Exit does not by itself complete the Case.

The interaction experience must therefore keep Visit completion distinct
from Case completion.

## 8. CLINICAL INFORMATION SURFACE

The clinical information experience shall allow the Doctor to discover
information relevant to the current patient journey.

It shall preserve the distinction between:

- Patient information;
- Past History;
- accumulated Clinical History;
- current Visit information;
- continuing Case information;
- clinical decisions;
- treatment and investigation information defined by the product.

Previous Visits retain their meaning.

New Visit information adds to Clinical History rather than replacing it.

## 9. WORKFLOW SURFACE

The workflow surface represents the current operational condition of the
clinic and patient journey.

It shall make the following understandable at product level:

- what Patient is currently being handled;
- what Case the Patient belongs to;
- what Visit is currently active;
- where the Case stands;
- what stage the current Visit has reached;
- whether the Case remains open or has been completed by the Doctor.

The workflow surface does not prescribe a technical state-machine,
navigation structure, or implementation mechanism.

## 10. DOCTOR INTERACTION

The Doctor remains:

- Clinical Authority;
- Main Admin;
- Actor.

The Doctor interaction experience shall support:

- oversight of the clinic workflow;
- review of Patient information;
- review of accumulated Clinical History;
- clinical decision recording where applicable;
- operation of the complete workflow without a Nurse;
- selected personal operational or clinical recording;
- determination of the clinic operating mode.

The Doctor may remain primarily focused on the Dashboard/workflow while
delegating defined operational workflow execution to the Nurse.

Delegation of operational workflow does not transfer clinical authority
or system ownership.

## 11. NURSE INTERACTION

The Nurse is an Operational Workflow Participant.

When delegated by the Doctor, the Nurse interaction experience may support
the already-defined operational activities:

- Patient Entry / Arrival;
- Patient Data Recording;
- Patient Exit;
- Doctor Notification.

The Nurse interaction experience shall preserve the Doctor's clinical
authority.

This Design does not define technical permissions or authorization rules.

## 12. OPERATING MODE INTERACTION

The product shall remain coherent in both defined operating modes.

### Doctor Only

The Doctor may operate the complete workflow.

### Doctor + Nurse

The Nurse participates in delegated operational workflow while the Doctor
remains the Clinical Authority and Main Admin.

The interaction experience changes participation according to the selected
operating mode without changing the underlying clinical authority.

## 13. RETRIEVAL INTERACTION

The product shall support deliberate retrieval of the existing Patient.

Approved retrieval methods remain:

- Patient Name;
- Clinic Patient Number;
- Barcode.

All retrieval methods reach the same Patient identity.

Retrieval is an interaction method, not a separate identity.

## 14. FOLLOW-UP INTERACTION

When follow-up is required, the current Visit ends through Patient Exit while
the Case remains open.

A later return creates a new Visit on a later Clinic Day within the same Case.

The interaction experience shall make this continuity understandable.

The later Visit must not appear as an unrelated replacement of the previous
Visit or Case.

## 15. CLINIC CLOSURE INTERACTION

The Clinic Day may be explicitly closed after the Doctor's review according
to the defined Clinic Day rules.

The interaction experience shall preserve the distinction between:

- preservation of daily data;
- Clinic Day closure;
- higher protection;
- Case completion.

Closing the Clinic Day does not automatically complete an open Case.

## 16. INTERACTION CONTINUITY

The user should be able to move through the patient journey without losing
the relationship between Patient, Case, Visit, and Clinic Day.

The experience should preserve continuity when:

- a Patient returns;
- a Case continues;
- a Visit ends;
- follow-up occurs;
- a later Clinic Day begins;
- previous Clinical History is reviewed.

## 17. SURFACE BOUNDARY

This document defines product-level interaction surfaces only.

It does not authorize:

- specific UI screens;
- specific UI components;
- visual design implementation;
- navigation contracts;
- API routes;
- API contracts;
- database schema;
- migrations;
- persistence structures;
- technical authorization;
- technical permission matrices;
- audit or locking mechanisms;
- deployment.

## 18. NON-AUTHORIZATION

PRODUCT_IMPLEMENTATION = NOT_AUTHORIZED
DATABASE_SCHEMA = NOT_AUTHORIZED
API_CONTRACT = NOT_AUTHORIZED
UI_CONTRACT = NOT_AUTHORIZED
AUTHORIZATION_IMPLEMENTATION = NOT_AUTHORIZED

## 19. DESIGN PRINCIPLE

Interaction shall expose the already-defined product workflow clearly while
preserving Patient identity, Case continuity, Visit continuity, Clinical
History, Doctor authority, and operating-mode distinctions.

No invented capability, workflow state, transition, permission, route,
schema, or technical mechanism is authorized by this document.

## 20. NEXT GATE

NEXT GATE = UI / INTERACTION TECHNICAL CONTRACT DEFINITION

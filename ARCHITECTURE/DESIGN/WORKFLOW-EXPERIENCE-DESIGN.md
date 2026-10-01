# Dr.Roby Clinic — Workflow Experience Design

STATUS: DRAFT
PHASE: DESIGN

## 1. PURPOSE

This document defines the product-level experience of the clinic workflow.

It translates the already-defined workflow into a coherent way for the
Doctor and Nurse to understand and operate the current patient journey.

It does not define implementation.

## 2. DESIGN AUTHORITY

This Design is derived from:

- the Product Manuscript;
- CONTRACT-05 — Visit Clinical Encounter Workflow;
- CONTRACT-08 — Case Workflow;
- the approved Design Scope.

No new product capability, workflow state, or transition is introduced.

## 3. CORE EXPERIENCE

The clinic workflow experience shall make the current patient journey
understandable.

At any point, the Doctor and Nurse should be able to understand:

- which Patient is being handled;
- which Case the current work belongs to;
- which Visit is currently active;
- where the Case currently stands in its workflow;
- what operational stage the current Visit has reached.

The experience represents the workflow; it does not redefine it.

## 4. CASE EXPERIENCE

The Case is the continuing patient journey.

The experience shall preserve the defined Case progression:

Arrived — Awaiting Registration
→ Awaiting Doctor
→ With Doctor

From With Doctor, the Case may proceed to:

→ Completed

or:

→ Exited — Follow-up Pending

When a later follow-up return occurs:

Exited — Follow-up Pending
→ Arrived — Awaiting Registration

The return represents a later Visit on a later Clinic Day.

The same Case may therefore remain understandable as one continuing
journey across multiple Visits and Clinic Days.

## 5. VISIT EXPERIENCE

The current Visit is understood through the defined Visit flow:

Arrival
→ Doctor
→ Exit

Arrival represents entry into the current Visit.

Doctor represents the clinical encounter.

Exit ends the operational flow of the current Visit.

Visit Exit does not by itself complete the Case.

The experience must therefore keep Visit completion and Case completion
conceptually distinct.

## 6. CURRENT STATE EXPERIENCE

The current Case state shall be understandable without requiring the user
to reconstruct the journey from unrelated historical information.

The experience should make the current state distinguishable from:

- previous Visit history;
- previous Clinic Days;
- completed Cases;
- other Cases currently active during the same Clinic Day.

The design does not prescribe a technical state-machine representation.

## 7. MULTIPLE CASES EXPERIENCE

A Clinic Day may contain multiple Cases.

Those Cases may exist in different workflow conditions at the same time.

The experience shall therefore support a clear daily understanding of
multiple ongoing Cases without merging their journeys.

The daily case counter remains a product-level concept.

Each Case retains its own independent journey.

## 8. DOCTOR EXPERIENCE

The Doctor remains:

- Clinical Authority;
- Main Admin;
- Actor.

The Doctor experience shall support understanding and oversight of the
clinic workflow.

The Doctor may operate the complete workflow without a Nurse.

The Doctor may remain primarily focused on the Dashboard/workflow or
personally perform selected operational or clinical recording steps.

The experience must preserve the Doctor's clinical authority.

## 9. NURSE EXPERIENCE

The Nurse is an Operational Workflow Participant.

When delegated by the Doctor, the Nurse may participate in the defined
operational workflow.

The Nurse experience shall support the already-defined operational
participation without transferring clinical authority from the Doctor.

The Design does not define technical permissions.

## 10. OPERATING MODE EXPERIENCE

The product shall support both defined operating modes:

### Doctor Only

The Doctor may operate the complete workflow without a Nurse.

### Doctor + Nurse

The Nurse participates in delegated operational workflow while the Doctor
remains the clinical authority and system owner.

The experience must remain coherent in both modes.

## 11. CLINIC DAY EXPERIENCE

The Clinic Day provides the daily working context.

The experience shall distinguish Cases belonging to the current Clinic Day
while preserving the continuity of Cases that remain open beyond that day.

Closing a Clinic Day does not automatically complete an open Case.

A later Visit for an open Case occurs on a later Clinic Day within the same
Case.

## 12. HISTORY EXPERIENCE

The experience shall preserve the distinction between:

- Patient information and Past History;
- accumulated Clinical History;
- the current Visit;
- the continuing Case.

Previous Visits retain their meaning.

A later Visit adds to the Clinical History rather than replacing previous
Visits.

## 13. WORKFLOW VISIBILITY PRINCIPLE

The workflow experience should answer, at product level:

- What patient is currently being handled?
- What Case does the patient belong to?
- What Visit is currently active?
- Where is the Case in its defined journey?
- What has happened in the current Visit?
- Is the Case still open or has the Doctor established completion?

These are experience questions, not technical implementation requirements.

## 14. DESIGN BOUNDARY

This document does not authorize:

- specific UI screens;
- specific UI components;
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

## 15. NON-AUTHORIZATION

PRODUCT_IMPLEMENTATION = NOT_AUTHORIZED
DATABASE_SCHEMA = NOT_AUTHORIZED
API_CONTRACT = NOT_AUTHORIZED
UI_CONTRACT = NOT_AUTHORIZED
AUTHORIZATION_IMPLEMENTATION = NOT_AUTHORIZED

## 16. DESIGN PRINCIPLE

The product experience shall expose the already-defined workflow clearly
without changing its meaning.

No invented capability, workflow state, transition, permission, route,
schema, or technical mechanism is authorized by this document.

## 17. NEXT GATE

NEXT GATE = WORKFLOW EXPERIENCE DESIGN PROVE

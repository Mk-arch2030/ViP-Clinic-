# Dr.Roby Clinic — Product Manuscript

STATUS: DRAFT
TYPE: PRODUCT MANUSCRIPT
PHASE: UNDERSTAND → DESIGN

## 1. PRODUCT IDENTITY

PRODUCT_NAME = Dr.Roby Clinic

## 2. CORE VISION

Patient + Clinical Record + Visit + Clinic Workflow

## 3. PRODUCT PRINCIPLE

SMALL
→ FOCUSED
→ USEFUL
→ PROVABLE
→ REPEATABLE
→ SELLABLE

## 4. CURRENT VISION

Dr.Roby Clinic is intended to be a small, focused clinic-management
product that preserves patient information and clinical history across
visits while providing a clear workflow for the clinic.

The product must support a clinic where the Doctor works alone and a
clinic where a Nurse participates in operational workflow.

The Doctor remains the clinical authority.

The Nurse participates in the clinic workflow according to the operating
mode and responsibilities assigned by the Doctor.

## 5. CLINIC DAY — INITIAL VISION

The clinic operates through a daily working context identified by the
working date.

A Clinic Day begins with the clinic's working day and contains the cases
recorded during that day.

Each patient arrival creates a separate case/visit cycle within the
Clinic Day.

The Clinic Day should allow the clinic to understand the overall state
of the day's cases while each case retains its own independent journey.

Example operational concept:

Clinic Day
→ Case 1
→ Case 2
→ Case 3
→ Case N

Cases may be at different points in their journeys at the same time.

The system should therefore support a daily case counter and a clear
distinction between the current states of the day's cases.

The initial operational journey is:

Patient Arrives
→ Arrival Recorded
→ Doctor Notified
→ Doctor Review
→ Clinical Decision
→ Patient Exit Recorded
→ Case Complete

This is an initial vision only.

Exact case states, transitions, timing rules, concurrency behavior,
permissions, and terminology remain to be defined before implementation.

## 6. INITIAL DOMAIN NUCLEUS

Clinic Day
Patient
Clinical Record
Case / Visit
Clinic Workflow

## 7. INITIAL PRODUCT VISION

The system should allow the clinic to:

- register a new patient and essential initial information;
- preserve the patient's clinical information;
- create and preserve visits over time;
- retrieve the patient's existing information;
- identify the patient efficiently, including a future barcode-based
  identification workflow;
- move the current visit through a clear clinic workflow;
- allow the Doctor to discover the patient's accumulated information;
- support Doctor-only operation;
- support Doctor + Nurse operation;
- allow the Doctor to determine the operating mode and participation;
- preserve historical visit information rather than erasing previous
  clinical history.

## 8. CLINICAL JOURNEY — INITIAL VISION

New Patient:
Personal Information
→ Medical History
→ Current Complaint
→ Investigation and/or Diagnosis
→ Treatment
→ Follow-up / Recovered

Existing Patient:
Identify Patient
→ Retrieve Patient History
→ Create New Visit
→ Record New Information
→ Clinical Decision
→ Treatment / Investigation
→ Follow-up / Recovered

## 9. ACTOR VISION

Doctoral:
- clinical authority;
- reviews patient information;
- creates or oversees the patient's clinical workflow;
- records clinical decisions where applicable;
- determines the clinic operating mode.

Nurse:
- operational workflow participant;
- may receive and record patient information according to the
  Doctor's assigned workflow;
- supports patient entry and exit workflow;
- does not replace the Doctor's clinical authority.

## 10. OPERATING MODE VISION

Doctor Only:
The Doctor may operate the complete workflow without a Nurse.

Doctor + Nurse:
The Nurse participates in operational workflow while the Doctor remains
the clinical authority.

The Doctor may choose whether to remain primarily focused on the
Dashboard/workflow or personally record selected clinical decisions.

## 11. PATIENT HISTORY PRINCIPLE

Patient identity and essential persistent information remain associated
with the patient.

Each new visit adds new clinical information to the patient's history.

A later visit must not erase the historical meaning of previous visits.

The system should allow the Doctor to discover the patient's accumulated
history while working with the current visit.

## 12. WORKFLOW VISION

The clinic should have an explicit workflow for the current patient
case.

The workflow is intended to make the state of the case/visit understandable
to the Doctor and Nurse.

Exact states, transitions, permissions, and responsibilities remain to be
defined before implementation.

## 13. FACTORY EXPERIENCE

Dr.Roby Clinic may learn from factory experience gained through:

- LIMS
- Shipping Hub
- RobY_BoT / MVP POS

Such experience is reusable knowledge only.

No previous project's architecture, contract, schema, capability, or
scope is automatically inherited.

## 14. PRODUCT BOUNDARY

Dr.Roby Clinic is not currently defined as:

- a Hospital System;
- an LIMS;
- a Pharmacy System;
- an ERP;
- a full CRM;
- an AI diagnostic system.

Any future capability must be justified by the actual clinic need and
defined through the product's own contracts.

## 15. ARCHITECTURAL DISCIPLINE

No implementation is authorized by this manuscript alone.

The product must progress through:

Understand
→ Design
→ Define
→ Contract
→ Build
→ Prove
→ Extend

No invented capability, contract, route, schema, or workflow state is
authorized without explicit definition.

## 16. CURRENT STATE

PRODUCT_IMPLEMENTATION = NOT_STARTED
DATABASE_SCHEMA = NOT_DEFINED
API_CONTRACT = NOT_DEFINED
UI_CONTRACT = NOT_DEFINED
AUTHORIZATION_CONTRACT = NOT_DEFINED
WORKFLOW_CONTRACT = NOT_DEFINED
DEPLOYMENT = NOT_STARTED

## 17. NEXT GATE

NEXT GATE = PRODUCT MANUSCRIPT REVIEW

The Product Owner must review and refine the manuscript before contracts
or implementation begin.

END OF MANUSCRIPT

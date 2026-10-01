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

The Doctor is the clinical authority and actor.

The Nurse participates in the clinic workflow according to the operating
mode and responsibilities assigned by the Doctor.

## 5. CLINIC DAY — INITIAL VISION

The clinic operates through a daily working context identified by the
working date.

A Clinic Day begins with the clinic's working day and contains the cases
and visits recorded during that day.

Each patient arrival is recorded within a Visit. A Visit belongs to a Case,
and the same Case may contain multiple Visits across multiple Clinic Days.

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
→ Follow-up when required
→ Later Visit on a later Clinic Day
→ Case remains open
→ Doctor → Completed

Patient Exit ends the operational flow of the current Visit.
Patient Exit does not by itself complete the Case.

Case completion is established by the Doctor's clinical decision.

This is an initial vision only.

Exact case states, transitions, timing rules, concurrency behavior,
permissions, and terminology remain to be defined before implementation.

## 6. INITIAL DOMAIN NUCLEUS

Clinic Day
Case
Patient
Visit
Clinical Record
Clinic Workflow

## 7. CASE / VISIT RELATIONSHIP — INITIAL VISION

The Clinic Day contains the cases and visits recorded during that working day.

Each Case represents one patient's operational and clinical journey.

The Patient is the person associated with the Case.

The Visit represents one organized medical encounter within the Case.
The same Case may contain multiple Visits across multiple Clinic Days.

The initial relationship is:

Clinic Day
→ Case
→ Patient
→ Visit
→ Arrival → Doctor → Exit

A Clinic Day may contain multiple cases.

Each case has its own independent operational journey, while multiple
cases may exist in different workflow states during the same Clinic Day.

The case is counted as part of the Clinic Day's daily case activity.

This relationship is an initial product definition only.

Exact identifiers, persistence relationships, state names, transitions,
permissions, and implementation structures remain to be defined through
later design and contracts.

## 8. INITIAL PRODUCT VISION

The system should allow the clinic to:

- register a new patient and essential initial information;
- preserve the patient's clinical information;
- create and preserve visits over time;
- retrieve the patient's existing information;
- identify the patient efficiently using the system-generated Clinic Patient
  Number;
- move the current visit through a clear clinic workflow;
- allow the Doctor to discover the patient's accumulated information;
- support Doctor-only operation;
- support Doctor + Nurse operation;
- allow the Doctor to determine the operating mode and participation;
- preserve historical visit information rather than erasing previous
  clinical history.

## 9. CLINICAL JOURNEY — INITIAL VISION

New Patient:
Personal Information
→ Past History
→ Current Complaint
→ Investigation and/or Diagnosis
→ Treatment
→ Follow-up when required
→ Later Visit when required
→ Case Completion by Doctor

Existing Patient:
Clinic Patient Number
→ Find / Retrieve Patient
→ Retrieve Existing History
→ Continue Existing Case for Follow-up when applicable
→ Create New Visit
→ Record New Information
→ Clinical Decision
→ Treatment / Investigation
→ Follow-up or Case Completion

## 10. ACTOR VISION

Doctor:
- clinical authority;
- reviews patient information;
- creates or oversees the patient's clinical workflow;
- records clinical decisions where applicable;
- determines the clinic operating mode.

Nurse:
- operational workflow participant;
- participates in operational workflow delegated by the Doctor;
- supports patient arrival/entry, patient data recording, patient exit,
  and Doctor notification;
- may perform the delegated workflow fully or under the Doctor's
  supervision;
- does not replace the Doctor's clinical authority.

## 11. OPERATING MODE VISION

Doctor Only:
The Doctor may operate the complete workflow without a Nurse.

Doctor + Nurse:
The Nurse participates in operational workflow while the Doctor remains
the clinical authority.

The Doctor is the Main Admin, Clinical Authority, and Actor.
The Doctor may delegate operational workflow execution to the Nurse
while retaining clinical authority and system ownership.

The Doctor may choose whether to remain primarily focused on the
Dashboard/workflow or personally perform selected operational or
clinical recording steps.

## 12. PATIENT HISTORY PRINCIPLE

Patient identity and essential persistent information remain associated
with the patient.

The Clinic Patient Number is generated by the system at first registration
and is the stable clinic reference for Find / Retrieve.

Past History is information from before the patient entered the clinic
system and is recorded with the patient's initial information.

Clinical History is the accumulated history created by recorded Visits.

Each new Visit adds new clinical information to the patient's Clinical
History. Previous Visits retain their historical meaning and are not
overwritten.

The system should allow the Doctor to discover the patient's accumulated
history while working with the current Visit.

## 13A. ONE-CLINIC SCOPE — CURRENT VISION

A Dr.Roby Clinic installation represents one clinic.

The Doctor / Main Admin owns and administers the clinic system,
with one or more Nurses participating in delegated operational workflow.

Multi-clinic, multi-branch, and multi-tenant operation are outside the
current product scope.

## 13B. SETTINGS / OPTIONS — CURRENT VISION

Doctor / Main Admin
        ↓
      Settings
        ↓
      Options

Settings and Options are under the authority of the Doctor / Main Admin.

Detailed settings and permissions remain undefined until their dedicated
design and contract gates.

## 13C. CLINIC DAY CLOSURE AND DATA PROTECTION — CURRENT VISION

When the Clinic Day's work ends, all daily data must be preserved.

The Doctor reviews the daily data and explicitly closes the Clinic Day.

Higher protection may occur according to one of two product choices:

- IMMEDIATE — higher protection follows the Doctor's review and closure.
- 3 DAYS — preserved daily data remains available during the defined
  review/correction period, after which higher protection is applied.

Preservation at the end of the workday is mandatory regardless of when
higher protection occurs.

Closing the Clinic Day does not automatically complete an open Case.

## 13. WORKFLOW VISION
The product-level Case Workflow is DEFINED.

The defined product-level workflow includes:
- the five Case states;
- the conceptual transitions between those states;
- the distinction between Visit Exit and Case Completion;
- the distinction between Case Completion and Clinic Day Closure;
- the established Doctor / Nurse authority boundary defined by CONTRACT-03.

The following remain explicitly NOT_DEFINED and are not authorized by this reconciliation:
- exact transition conditions;
- timing rules;
- concurrency behavior;
- technical state-machine design;
- technical persistence representation;
- technical authorization implementation;
- technical permission matrices.

No technical implementation is authorized by this reconciliation.

## 14. FACTORY EXPERIENCE

Dr.Roby Clinic may learn from factory experience gained through:

- LIMS
- Shipping Hub
- RobY_BoT / MVP POS

Such experience is reusable knowledge only.

No previous project's architecture, contract, schema, capability, or
scope is automatically inherited.

## 15. PRODUCT BOUNDARY

Dr.Roby Clinic is not currently defined as:

- a Hospital System;
- an LIMS;
- a Pharmacy System;
- an ERP;
- a full CRM;
- an AI diagnostic system.

Any future capability must be justified by the actual clinic need and
defined through the product's own contracts.

## 16. ARCHITECTURAL DISCIPLINE

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

## 17. CURRENT STATE

PRODUCT_IMPLEMENTATION = NOT_STARTED
DATABASE_SCHEMA = NOT_DEFINED
API_CONTRACT = NOT_DEFINED
UI_CONTRACT = NOT_DEFINED
AUTHORIZATION_CONTRACT = NOT_DEFINED
WORKFLOW_CONTRACT = DEFINED
DEPLOYMENT = NOT_STARTED

CONTRACTS_01_TO_07 = CLOSED
CONTRACT-08 = CLOSED
CONTRACTS_01_TO_07_IMPLEMENTATION_AUTHORIZED = NO
CONTRACTS_01_TO_07_SCHEMA_AUTHORIZED = NO
CONTRACTS_01_TO_07_API_AUTHORIZED = NO
CONTRACTS_01_TO_07_UI_AUTHORIZED = NO
CONTRACTS_01_TO_07_AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO

CASE_LEVEL_WORKFLOW_CONTRACT = DEFINED

## 18. NEXT GATE

NEXT GATE = TECHNICAL CONTRACT DEFINITION

The Contract phase is complete through CONTRACT-08.
Contracts 01 through 08 remain authoritative and CLOSED.

The BUILD AUTHORIZATION / IMPLEMENTATION DEFINITION has been defined,
reconciled against the Product Manuscript and CONTRACT-01 through
CONTRACT-08, proven, and committed as the BUILD authorization checkpoint.

This checkpoint does NOT authorize implementation by itself.

The next gate is to deliberately define the first technical contract
required for implementation, beginning from the inside of the system.

The next technical-definition sequence is:

DOMAIN / PERSISTENCE BOUNDARY
→ APPLICATION CAPABILITY CONTRACTS
→ AUTHORIZATION CONTRACT
→ API CONTRACT
→ UI / INTERACTION CONTRACT
→ RUNTIME / DEPLOYMENT DEFINITION

DATABASE_SCHEMA, API_CONTRACT, UI_CONTRACT, and AUTHORIZATION_CONTRACT
remain NOT_DEFINED until their respective technical contracts are
deliberately defined and proven.

No implementation is authorized merely by this transition.

END OF MANUSCRIPT

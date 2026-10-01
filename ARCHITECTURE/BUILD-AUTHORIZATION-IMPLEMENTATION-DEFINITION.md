# DR. ROBY CLINIC — BUILD AUTHORIZATION / IMPLEMENTATION DEFINITION

## 1. DOCUMENT IDENTITY

DOCUMENT = BUILD AUTHORIZATION / IMPLEMENTATION DEFINITION
VERSION = V1
PRODUCT = Dr_Roby_Clinic
PHASE = BUILD AUTHORIZATION / IMPLEMENTATION DEFINITION
STATUS = DEFINITION DRAFT
AUTHORITY = MANUSCRIPT + CLOSED CONTRACTS C01-C08

This document translates the closed product-level Contracts into explicit
boundaries for the BUILD phase.

It does not redefine the Product, the closed Contracts, or the clinical
authority model.

---

## 2. AUTHORITATIVE BASIS

The following remain authoritative and CLOSED:

- CONTRACT-01 — Patient / Case / Visit
- CONTRACT-02 — Clinic Day
- CONTRACT-03 — Actor & Authority
- CONTRACT-04 — Patient Identity & Clinical History
- CONTRACT-05 — Visit / Clinical Encounter / Workflow
- CONTRACT-06 — Clinical Decision / Treatment
- CONTRACT-07 — Clinic Settings / Day Closure / Protection
- CONTRACT-08 — Case Workflow

The Product Manuscript remains authoritative above this document.

No statement in this document may create a new product capability that is
not already supported by the Manuscript and the closed Contracts.

---

## 3. BUILD PRINCIPLE

BUILD follows:

MANUSCRIPT
→ CLOSED CONTRACTS
→ BUILD AUTHORIZATION / IMPLEMENTATION DEFINITION
→ TECHNICAL CONTRACTS
→ IMPLEMENTATION
→ PROOF

The BUILD phase must preserve the distinctions already established by the
product definition.

---

## 4. ACTOR BOUNDARY

### 4.1 Doctor

The Doctor remains:

- Main Admin;
- Clinical Authority;
- clinic system owner;
- authority over Clinic Settings and Options;
- authority to review daily clinic data;
- authority to explicitly close a Clinic Day;
- authority to make clinical decisions;
- authority to establish Case completion;
- authority to delegate operational workflow to Nurse(s).

The Doctor may perform the complete clinic workflow without a Nurse.

### 4.2 Nurse

The Nurse remains:

- Operational Workflow Participant;
- participant in workflow delegated by the Doctor.

The Nurse may participate in already-defined operational activities including:

- Patient Entry / Arrival;
- Patient Data Recording;
- Patient Exit;
- Doctor Notification.

Delegation does not transfer:

- Clinical Authority;
- System Ownership;
- Main Admin authority.

No technical Nurse permission matrix is created by this document.

### 4.3 Patient

The Patient is the persistent clinic identity and subject of the
clinical journey.

The Patient is not an administrative owner or technical authority.

---

## 5. PRODUCT CAPABILITIES ENTERING BUILD DEFINITION

The BUILD definition may cover only capabilities already established by the
Manuscript and Contracts, including:

### Patient

- New Patient registration;
- system-generated Clinic Patient Number;
- essential patient information;
- Past History;
- existing Patient retrieval;
- retrieval by approved product methods:
  - Name;
  - Clinic Patient Number;
  - Barcode;
- preservation of Patient identity.

### Clinical History

- preservation of recorded Visits;
- accumulation of Clinical History across Visits;
- preservation of historical Visits;
- Doctor access to accumulated history during the current Visit.

### Case

- Case belonging to exactly one Patient;
- Case representing the patient's clinical and operational journey;
- Case remaining distinct from Visit;
- Case remaining open across Visits when required;
- Doctor-established Case completion.

### Visit

- Visit belonging to a Case;
- Visit representing a clinical encounter;
- Arrival → Doctor → Exit operational flow;
- preservation of exited Visits;
- Visit Type capability already defined by CONTRACT-08, including
  Visit & Consultation.

### Clinic Day

- working-day context;
- daily Cases and Visits;
- visibility of daily Case activity;
- Doctor review of daily data;
- explicit Doctor Clinic Day closure;
- preservation of daily data;
- closure not automatically completing an open Case.

### Case Workflow

The defined product-level states remain:

1. Arrived — Awaiting Registration
2. Awaiting Doctor
3. With Doctor
4. Exited — Follow-up Pending
5. Completed

The product-level distinctions remain:

- Visit Exit ≠ Case Completion;
- Case Completion ≠ Clinic Day Closure;
- Case Completion is established by the Doctor.

---

## 6. OPERATING MODES

The BUILD must support both defined operating modes:

### Doctor Only

The Doctor can operate the clinic without a Nurse.

### Doctor + Nurse

The Nurse participates in delegated operational workflow while the Doctor
retains Clinical Authority and Main Admin ownership.

The presence or absence of a Nurse must not redefine the product's authority
model.

---

## 7. BUILD ORDER

The implementation definition shall proceed from inside to outside:

1. Domain / business model representation
2. Persistence representation
3. Application capabilities
4. Authorization boundary
5. API boundary
6. UI / interaction surface
7. Runtime wiring
8. Runtime proof
9. End-to-end operational proof

Each layer requires explicit technical definition and proof before the next
layer is treated as established.

---

## 8. TECHNICAL CONTRACT STATUS AND REMAINING DEFINITION
The following technical definitions have already been deliberately established
and proven, or are under controlled amendment:

ESTABLISHED_TECHNICAL_CONTRACTS:
- Persistence Schema = CLOSED + PROVEN
- Authorization Technical Contract = CLOSED + PROVEN
- API Technical Contract = CLOSED + PROVEN
- UI Interaction Technical Contract = CLOSED + PROVEN
- Persistence Technical Contract = CONTROLLED AMENDMENT
- Application Capability Contract = CONTROLLED AMENDMENT

REMAINING_TECHNICAL_DEFINITION_SCOPE:
- Authentication implementation
- Workflow state-machine implementation
- Technical Clinic Day protection
- Technical audit behavior where later authorized
- Deployment behavior

This document does not invent or independently authorize any technical
contract or implementation.
---

## 9. EXPLICIT BUILD NON-AUTHORIZATION

This document does NOT authorize:

- hospital functionality;
- LIMS functionality;
- pharmacy functionality;
- billing or accounting;
- insurance;
- ERP;
- AI diagnosis or Clinical Decision Support;
- multi-branch functionality;
- multi-tenant functionality;
- hospital wards, beds, admissions, or rosters;
- marketing funnels;
- unrelated CRM functionality;
- uncontracted scheduling functionality;
- new clinical authority for Nurse(s);
- transfer of System Ownership from Doctor;
- arbitrary permissions;
- arbitrary workflow states;
- arbitrary workflow transitions;
- arbitrary database fields;
- arbitrary API routes;
- arbitrary UI capabilities.

Any future capability requires deliberate product definition and the
appropriate contract authority.

---

## 10. IMPLEMENTATION DISCIPLINE

No technical implementation may be justified merely because a product-level
capability appears in this document.

Implementation must follow the defined technical contract for its layer.

Every BUILD increment follows:

BUILD → PROVE → NEXT

A failed proof stops progression until the defect is understood and resolved.

---

## 11. CURRENT GATE
BUILD_AUTHORIZATION = CONTROLLED AMENDMENT
IMPLEMENTATION_AUTHORIZED = NO
DATABASE_SCHEMA_AUTHORIZED = NO
API_AUTHORIZED = NO
UI_AUTHORIZED = NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO

CURRENT_ACTION = CONTROLLED_BUILD_DEFINITION_MUTATION
NEXT_GATE = CONTROLLED_BUILD_DEFINITION_PROOF_AND_RECONCILIATION

The amendment must preserve:
- the Product Manuscript;
- CONTRACT-01 through CONTRACT-08;
- established technical contracts;
- existing project boundaries;
- existing build order;
- all cross-contract invariants.

No implementation authorization is created by this amendment.
---

## 12. END

END OF BUILD AUTHORIZATION / IMPLEMENTATION DEFINITION V1

## CONTROLLED AMENDMENT — BUILD CONTRACT READINESS

AMENDMENT_STATUS = CONTROLLED AMENDMENT
IMPLEMENTATION_AUTHORIZED = NO

ESTABLISHED_TECHNICAL_CONTRACTS:
- Persistence Schema = CLOSED + PROVEN
- Authorization Technical Contract = CLOSED + PROVEN
- API Technical Contract = CLOSED + PROVEN
- UI Interaction Technical Contract = CLOSED + PROVEN
- Persistence Technical Contract = CONTROLLED AMENDMENT
- Application Capability Contract = CONTROLLED AMENDMENT

REMAINING_TECHNICAL_DEFINITION_SCOPE:
- Authentication implementation
- Workflow state-machine implementation
- Technical Clinic Day protection
- Technical audit behavior where later authorized
- Deployment behavior

CROSS_CONTRACT_INVARIANTS_PRESERVED = YES
CONTRACT_MUTATION = PERFORMED
IMPLEMENTATION = NOT AUTHORIZED

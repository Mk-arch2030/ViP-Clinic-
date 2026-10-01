# DR. ROBY CLINIC — APPLICATION CAPABILITY CONTRACT V1

DOCUMENT = APPLICATION CAPABILITY CONTRACT
VERSION = V1
PHASE = TECHNICAL CONTRACT DEFINITION
STATUS = DEFINITION DRAFT
AUTHORITY = PRODUCT MANUSCRIPT + CLOSED CONTRACTS C01-C08 + PROVEN APPLICATION CAPABILITY INVENTORY + PERSISTENCE TECHNICAL CONTRACT V1

APPLICATION_CAPABILITY_IMPLEMENTATION_AUTHORIZED = NO
DATABASE_SCHEMA_IMPLEMENTATION_AUTHORIZED = NO
SQL_IMPLEMENTATION_AUTHORIZED = NO
MIGRATION_IMPLEMENTATION_AUTHORIZED = NO
ORM_IMPLEMENTATION_AUTHORIZED = NO
REPOSITORY_IMPLEMENTATION_AUTHORIZED = NO
API_IMPLEMENTATION_AUTHORIZED = NO
UI_IMPLEMENTATION_AUTHORIZED = NO
AUTHENTICATION_IMPLEMENTATION_AUTHORIZED = NO
AUTHORIZATION_IMPLEMENTATION_AUTHORIZED = NO

---

## 1. PURPOSE

This contract defines the application-level capabilities of Dr. Roby Clinic.

It establishes:
- what the application must be capable of doing;
- the product meaning of each capability;
- the actor authority boundary for each capability;
- the required relationships between capabilities;
- the business/domain outcomes expected from each capability;
- the boundaries that prevent unauthorized capability expansion.

This contract does not define:
- database schema;
- SQL;
- migrations;
- ORM;
- repositories;
- API routes;
- UI screens;
- authentication implementation;
- authorization implementation;
- technical state-machine implementation;
- deployment implementation.

No technical mechanism may be invented from this contract.

---

## 2. APPLICATION CAPABILITY AUTHORITY

The application capabilities defined here are derived from:
- CONTRACT-01 — Patient / Case / Visit;
- CONTRACT-02 — Clinic Day;
- CONTRACT-03 — Actor / Authority;
- CONTRACT-04 — Patient Identity / Clinical History;
- CONTRACT-05 — Visit Clinical Encounter Workflow;
- CONTRACT-06 — Clinical Decision / Treatment;
- CONTRACT-07 — Clinic Settings / Day Closure / Protection;
- CONTRACT-08 — Case Workflow;
- PROVEN APPLICATION CAPABILITY INVENTORY;
- PERSISTENCE-TECHNICAL-CONTRACT-V1.

The Product Manuscript remains the ultimate product authority.

---

# 3. ACTOR AUTHORITY MODEL

## 3.1 Doctor

The Doctor is:
- Main Admin;
- Clinical Authority;
- Actor;
- System Owner.

The Doctor retains authority over:
- clinical decisions;
- diagnosis;
- investigation decisions;
- treatment decisions;
- clinical information modification requiring Doctor authority;
- Case Completion;
- Clinic Day Closure;
- clinic operating mode;
- operational delegation.

The Doctor may personally perform operational workflow.

---

## 3.2 Nurse

The Nurse is:
- Operational Workflow Participant.

The Nurse may perform delegated operational workflow under Doctor authority.

Approved operational participation includes:
- Patient Entry / Arrival;
- Patient Data Recording;
- Patient Exit;
- Doctor Notification;
- other operational steps only when subsequently and deliberately authorized by the applicable contract.

Nurse participation does not transfer:
- Clinical Authority;
- Main Admin authority;
- System Ownership;
- Case Completion authority;
- clinical decision authority.

Detailed technical authorization remains outside this contract.

---

# 4. PATIENT CAPABILITIES

## 4.1 REGISTER NEW PATIENT

The application must support registration of a new Patient.

Registration establishes:
- Patient identity;
- Clinic Patient Number;
- Basic / Personal Data;
- Past History.

A first registration creates the Patient identity.

The Clinic Patient Number becomes the stable clinic reference for that Patient.

A returning patient must not be registered as a new Patient merely because the patient has another clinical encounter.

---

## 4.2 GENERATE CLINIC PATIENT NUMBER

At first Patient registration, the application must establish a Clinic Patient Number.

The Clinic Patient Number:
- is stable for the Patient;
- is a clinic identity reference;
- is not a Visit identifier;
- is not a Case identifier;
- is not a Clinic Day identifier.

The technical representation and generation mechanism remain outside this contract.

---

## 4.3 RETRIEVE EXISTING PATIENT

The application must support retrieval of an existing Patient through the approved product-level methods:

- Patient Name;
- Clinic Patient Number;
- Barcode.

All approved retrieval methods must reach the same existing Patient identity.

Retrieval must not create or replace the Patient identity.

The Doctor decides which approved retrieval method to use.

The product must not require routine retrieval to depend exclusively on remembering the Clinic Patient Number or Barcode.

---

## 4.4 RETRIEVE EXISTING HISTORY

After an existing Patient is retrieved, the application must support access to the Patient's existing relevant information according to the defined product boundaries.

The retrieved information must preserve the distinction between:
- Patient Identity;
- Basic / Personal Data;
- Past History;
- Clinical History;
- Cases;
- individual Visits.

Past History is patient-level history represented as multiple Past History items.
A Past History item may be added or modified.
Past History mutation is limited to ADD and MODIFY.
Any modification of Past History requires Doctor Authority.
The resulting current Past History remains preserved as Past History for the Patient.

The application must not collapse Patient history into only the latest Visit.

---

# 5. CASE CAPABILITIES

## 5.1 CREATE / CONTINUE CASE JOURNEY

The application must support the Patient's continuing clinical journey through Cases.

A Patient may have multiple Cases when clinically and operationally appropriate.

A Case belongs to exactly one Patient.

An existing Case may continue across multiple Clinic Days.

A later follow-up Visit may continue the applicable existing Case.

The application must not create a duplicate Case when the existing Case remains the appropriate continuing clinical journey.

---

## 5.2 CASE COMPLETION

The application must support Case Completion.

Case Completion is established only by the Doctor's clinical completion decision.

Visit Exit does not complete the Case.

Clinic Day Closure does not complete the Case.

The Nurse cannot establish Case Completion through operational delegation.

The technical completion representation is governed separately by the Persistence Technical Contract.

---

# 6. VISIT CAPABILITIES

## 6.1 CREATE NEW VISIT

The application must support creation of a Visit within the appropriate Case.

Every Visit belongs to:
- exactly one Case;
- exactly one Clinic Day.

A Patient may have multiple Visits.

A follow-up return creates a new Visit.

A new Visit must not overwrite a previous Visit.

---

## 6.2 VISIT TYPE

The application must support the approved Visit Type:

Visit & Consultation

Visit Type is a direct property of the Visit.

The application must record Visits according to the approved Visit Type definition.
The system counts recorded Visits whose selected Visit Type is `Visit & Consultation`.

Visit Type does not introduce:
- fees;
- prices;
- payments;
- balances;
- receipts;
- accounting.

No additional Visit Type is authorized by this contract.

---

## 6.3 RECORD ARRIVAL

The application must support recording Patient Arrival within the current Visit.

Arrival establishes that the Patient has entered the current encounter.

Arrival does not:
- complete the Visit;
- complete the Case.

The Nurse may perform Arrival handling when delegated by the Doctor.

The Doctor remains the Clinical Authority.

---

## 6.4 DOCTOR ENCOUNTER

The application must support the Doctor's clinical encounter within the current Visit.

The Doctor may:
- review Patient information;
- review existing Clinical History;
- review current Case context;
- make clinical decisions within the defined product scope;
- record applicable clinical information.

The Doctor remains the Clinical Authority.

---

## 6.5 RECORD EXIT

The application must support recording Exit from the current Visit.

Exit:
- ends the current Visit encounter;
- preserves the Visit in Clinical History;
- does not automatically complete the Case.

A Case may remain open after Visit Exit.

The Nurse may perform delegated operational Exit.

---

## 6.6 FOLLOW-UP RETURN

The application must support a later follow-up return.

The follow-up flow is:

Existing Patient
→ Existing History
→ Applicable Existing Case
→ New Visit
→ New Clinic Day

The new Visit:
- belongs to the continuing Case when applicable;
- remains distinct from previous Visits;
- contributes to Clinical History;
- must not overwrite a previous Visit.

The return transition is not defined as an automatic technical process by this contract.

---

# 7. CLINICAL CAPABILITIES

## 7.1 CURRENT COMPLAINT

The application must support recording the Current Complaint as clinical information associated with the current Visit.

Current Complaint remains distinct from:
- Investigation;
- Diagnosis;
- Treatment;
- Follow-up.

---

## 7.2 INVESTIGATION

The application must support recording Investigation information within the defined clinical journey.

The Doctor determines whether investigation is required.

Investigation remains distinct from Diagnosis.

The application does not thereby become:
- a Laboratory Information System;
- a specimen workflow;
- a laboratory result management system;
- a LIMS.

---

## 7.3 DIAGNOSIS

The application must support recording Diagnosis within the current Visit.

The Doctor is the Clinical Authority for Diagnosis.

Diagnosis may be preliminary or final according to the Doctor's clinical decision.

Diagnosis modification requiring explicit Doctor authority remains governed by the applicable closed contracts.

---

## 7.4 TREATMENT

The application must support recording Treatment information associated with the current Visit.

Treatment follows the Doctor's clinical decision.

Recording Treatment does not make the application:
- a pharmacy;
- a dispensing system;
- an inventory system;
- a medication-management system.

Treatment modification requiring explicit Doctor authority remains governed by the applicable closed contracts.

---

## 7.5 FOLLOW-UP DECISION

The application must support recording whether follow-up is required as part of the Doctor's clinical decision.

When follow-up is required and the Patient later returns:
- the existing Patient remains the same;
- the applicable Case may continue;
- a new Visit is created;
- the new Visit occurs on the applicable Clinic Day.

---

## 7.6 CLINICAL HISTORY

Clinical History is accumulated from recorded Visits.

The application must preserve:
- previous Visits;
- later Visits;
- the relationship of each Visit to its Case and Patient;
- chronological clinical meaning.

Clinical History must not become a mutable single latest-value replacement for previous Visits.

Clinical History is derived from Visits according to the Persistence Technical Contract.

---

# 8. CLINICAL AMENDMENT AUTHORITY

Clinical information already recorded within a Visit may require amendment.

Such amendment requires Doctor Authorization according to the established product contracts.

This applies to the defined clinical information including:
- Diagnosis;
- Treatment;
- Investigation;
- other Clinical Content where Doctor authority is required.

The amendment occurrence is a Product Fact and must be preserved according to the Persistence Technical Contract.

This contract does not select the technical amendment mechanism.

The Nurse does not acquire clinical amendment authority through operational delegation.

---

# 9. CLINIC DAY CAPABILITIES

## 9.1 REVIEW DAILY DATA

The application must support Doctor review of the Clinic Day's daily data before explicit Clinic Day Closure.

Daily data must remain preserved.

---

## 9.2 CLOSE CLINIC DAY

The application must support explicit Clinic Day Closure by the Doctor / Main Admin.

The end of the calendar day does not automatically close the Clinic Day.

Clinic Day Closure:
- preserves the day's data;
- establishes the applicable higher-protection requirement;
- does not complete open Cases;
- does not erase Patient history;
- does not erase Visits.

---

## 9.3 PROTECTION MODE

The approved product-level protection timing choices are:

- IMMEDIATE;
- 3 DAYS.

The product meaning is defined by CONTRACT-07.

The technical mechanism that provides higher protection is not defined by this contract.

No technical protection mechanism may be invented here.

---

# 10. OPERATIONAL MODE CAPABILITIES

The application must support:

## 10.1 DOCTOR-ONLY MODE

The Doctor may operate the clinic without a Nurse.

Doctor-only operation does not reduce any Doctor authority.

---

## 10.2 DOCTOR + NURSE MODE

The Doctor may operate with a Nurse.

The Nurse participates in delegated operational workflow.

The presence of a Nurse does not change:
- Clinical Authority;
- Main Admin authority;
- System Ownership;
- Case Completion authority.

---

## 10.3 OPERATIONAL DELEGATION

The Doctor may delegate approved operational workflow to the Nurse.

Delegation means operational execution authority within the approved boundary.

Delegation does not mean transfer of ownership or clinical authority.

The detailed technical permission matrix remains outside this contract.

---

# 11. CAPABILITY RELATIONSHIPS

The application-level journey is:

New Patient
→ Register Patient
→ Generate Clinic Patient Number
→ Retrieve Patient
→ Retrieve Existing History
→ Establish / Continue Case
→ Create Visit
→ Record Arrival
→ Doctor Encounter
→ Record Clinical Information
→ Exit Visit
→ Follow-up when required
→ New Visit when Patient returns
→ Case Completion by Doctor when clinically established

The application must preserve the following distinctions:

Patient Identity
≠ Case
≠ Visit
≠ Clinic Day

Past History
≠ Clinical History

Visit Exit
≠ Case Completion

Case Completion
≠ Clinic Day Closure

Investigation
≠ Diagnosis

Clinical Authority
≠ Operational Delegation

---

# 12. CAPABILITY BOUNDARY

This contract does not authorize capabilities outside the established product scope.

The application does not become:

- a LIMS;
- a RIS/PACS;
- a pharmacy;
- a medication dispensing system;
- an inventory system;
- a billing system;
- an accounting system;
- an insurance system;
- a hospital information system;
- a multi-branch system;
- a multi-tenant system;
- an AI diagnosis system;
- a clinical decision support system beyond the defined Doctor decision workflow.

No additional capability may be introduced without deliberate product and contract authority.

---

# 13. TECHNICAL DEFINITION BOUNDARY

The following remain deliberately undefined by this contract:

- database schema;
- technical identifiers beyond decisions already closed by the Persistence Technical Contract;
- SQL;
- migrations;
- ORM;
- repository design;
- application service implementation;
- API routes;
- API payload schemas;
- UI screens;
- UI interaction implementation;
- authentication mechanism;
- authorization mechanism;
- permission matrix;
- session mechanism;
- concurrency behavior;
- workflow state-machine implementation;
- deployment behavior.

These require their own deliberate technical contracts.

---

# 14. IMPLEMENTATION PROHIBITION

No implementation may be inferred merely from the existence of a capability in this contract.

In particular, this contract does not authorize:
- database creation;
- table creation;
- SQL;
- migrations;
- repository code;
- service code;
- API routes;
- UI implementation;
- authentication;
- authorization;
- deployment.

Implementation begins only after the required technical contracts are deliberately defined, reconciled, proven, and authorized.

---

# 15. APPLICATION CAPABILITY CONTRACT ACCEPTANCE CRITERIA

This contract is ready for reconciliation when:

1. Every defined capability traces to an authoritative Product Manuscript or closed Contract.
2. Every capability has a defined product outcome.
3. Actor authority is preserved.
4. Doctor Clinical Authority is preserved.
5. Nurse delegation does not transfer authority.
6. Patient identity remains distinct from Case, Visit, and Clinic Day.
7. Visit history remains preserved.
8. Visit Exit remains distinct from Case Completion.
9. Case Completion remains Doctor-authorized.
10. Clinic Day Closure remains Doctor-authorized.
11. Investigation remains distinct from Diagnosis.
12. Technical mechanisms are not invented.
13. Out-of-scope capabilities remain excluded.
14. No implementation authorization is created by this contract.

---

# 16. STATUS

APPLICATION_CAPABILITY_INVENTORY = PROVEN

APPLICATION_CAPABILITY_CONTRACT_V1 = CLOSED + PROVEN

IMPLEMENTATION = NOT AUTHORIZED

DATABASE_SCHEMA = NOT AUTHORIZED

API = NOT AUTHORIZED

UI = NOT AUTHORIZED

AUTHENTICATION = NOT AUTHORIZED

AUTHORIZATION_IMPLEMENTATION = NOT AUTHORIZED

END OF APPLICATION CAPABILITY CONTRACT V1

## CONTROLLED AMENDMENT — A01-A04

AMENDMENT_STATUS = CONTROLLED AMENDMENT
IMPLEMENTATION_AUTHORIZED = NO

A01 — ARRIVAL PATIENT CONDITION
Nurse delegated Arrival handling may record one Visit-level arrival condition:
Normal / Moderately Unwell / Severely Unwell.
This is operational intake information and is not Vital Signs, Diagnosis,
Treatment, Clinical Decision, Case Completion, or Patient-level Past History.

A02 — NURSE CURRENT COMPLAINT INTAKE
Nurse may capture the patient-reported Current Complaint during delegated
intake. Current Complaint remains exactly one per Visit. Clinical authority
and interpretation remain with Doctor.

A03 — NURSE INITIAL PAST HISTORY COLLECTION
Nurse may collect patient-supplied initial Past History during delegated
Patient Data Recording. Collection does not grant authority to add or modify
the authoritative Past History. Doctor remains the authority.

A04 — SEND TO DOCTOR
Send to Doctor is an operational Doctor Notification interaction requesting
Doctor attention. It creates no new Case, Visit, authority, completion,
closure, or clinical decision.

CROSS_CONTRACT_INVARIANTS_PRESERVED = YES
CONTRACT_MUTATION = PERFORMED
IMPLEMENTATION = NOT AUTHORIZED
